'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuCircleCheck, LuCloud, LuCloudOff, LuFlag, LuTimer } from 'react-icons/lu';
import { AnswerGrid } from '@components/answer-grid';
import { Button } from '@components/button';
import { ConfirmDialog } from '@components/confirm-dialog';
import { EmptyState } from '@components/empty-state';
import { ProgressBar } from '@components/progress-bar';
import { QuestionCard } from '@components/question-card';
import { Spinner } from '@components/spinner';
import { useToast } from '@components/toast';
import { useContent } from '@contexts/content';
import { useExamTimer } from '@hooks/use-exam-timer';
import { EXAM_QUERY_KEYS, useExamOverview } from '@hooks/use-exams';
import { examApi, isReview } from '@services/api';
import { ApiError } from '@services/api-error';
import { ROUTES, examResultRoute } from '@shell/routes';
import type { iExamSession } from '@/types/exam';
import type { tAlternativeKey } from '@/types/question';
import { formatClock } from '@utils/format-duration';
import { Layout, Main, Nav, SaveStatus, Side, SideCard, Timer, TopBar } from './styles';

const KEYS: tAlternativeKey[] = ['A', 'B', 'C', 'D', 'E'];
const MODE_TITLE = { completo: 'Prova completa', materia: 'Simulado por matéria', rapido: 'Simulado rápido' } as const;
/** Agrupa respostas seguidas num envio só. */
const SAVE_DELAY_MS = 1000;

/** Página da prova: abre o simulado do `?id=` (ou o que está em andamento). */
export function ExamPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: overview, isPending: isOverviewPending } = useExamOverview();
  const examId = searchParams.get('id') ?? overview?.current?.id ?? null;

  const query = useQuery({
    queryKey: EXAM_QUERY_KEYS.detail(examId ?? ''),
    queryFn: () => examApi.get(examId!),
    enabled: Boolean(examId),
    staleTime: Infinity,
  });

  // Prova já entregue (ex.: prazo acabou em outro aparelho): vai para o resultado
  useEffect(() => {
    if (query.data && isReview(query.data)) router.replace(examResultRoute(query.data.exam.id));
  }, [query.data, router]);

  if ((!examId && isOverviewPending) || (examId && query.isPending)) {
    return <Spinner size={32} label="Abrindo a prova" />;
  }
  if (!examId || !query.data || isReview(query.data)) {
    return (
      <EmptyState
        title="Nenhum simulado em andamento"
        description="Escolha um tipo de simulado para começar."
        action={<Link href={ROUTES.exams}>Ir para os simulados</Link>}
      />
    );
  }
  return <ExamRunner session={query.data} />;
}

/** Prova em andamento: uma questão por vez, cronômetro, cartão-resposta e salvamento automático na API. */
function ExamRunner({ session }: { session: iExamSession }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { subjectName } = useContent();
  const { exam, questions } = session;
  const [answers, setAnswers] = useState(exam.answers);
  const [flagged, setFlagged] = useState(exam.flagged);
  const [currentIndex, setCurrentIndex] = useState(Math.min(exam.currentIndex, questions.length - 1));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');

  // Última versão para salvar/entregar sem depender do ciclo de render
  const latest = useRef({ answers, flagged, currentIndex });
  useEffect(() => {
    latest.current = { answers, flagged, currentIndex };
  }, [answers, flagged, currentIndex]);
  const saveTimer = useRef<number | undefined>(undefined);
  const hasFinishedRef = useRef(false);

  const flush = useCallback(async () => {
    window.clearTimeout(saveTimer.current);
    if (hasFinishedRef.current) return;
    setSaveState('saving');
    try {
      await examApi.save(exam.id, latest.current);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }, [exam.id]);

  const scheduleSave = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => void flush(), SAVE_DELAY_MS);
  }, [flush]);

  // Salva ao trocar de aba ou fechar a página
  useEffect(() => {
    const onHide = () => document.visibilityState === 'hidden' && void flush();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.clearTimeout(saveTimer.current);
    };
  }, [flush]);

  const finish = useCallback(async () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    window.clearTimeout(saveTimer.current);
    setIsFinishing(true);
    try {
      const review = await examApi.finish(exam.id, {
        answers: latest.current.answers,
        flagged: latest.current.flagged,
      });
      queryClient.setQueryData(EXAM_QUERY_KEYS.detail(exam.id), review);
      await queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.overview });
      router.replace(examResultRoute(exam.id));
    } catch (error) {
      hasFinishedRef.current = false;
      setIsFinishing(false);
      showToast(error instanceof ApiError ? error.message : 'Não foi possível entregar. Tente de novo.', 'danger');
    }
  }, [exam.id, queryClient, router, showToast]);

  const remaining = useExamTimer(exam.startedAt, exam.timeLimit, () => void finish());

  const total = questions.length;
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isFlagged = flagged.includes(question.id);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(total - 1, Math.max(0, index)));
      scheduleSave();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [total, scheduleSave]
  );

  const select = useCallback(
    (key: tAlternativeKey) => {
      setAnswers((current) => ({ ...current, [question.id]: key }));
      scheduleSave();
    },
    [question.id, scheduleSave]
  );

  const toggleFlag = () => {
    setFlagged((current) =>
      current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]
    );
    scheduleSave();
  };

  // Atalhos: A–E marcam, setas mudam de questão
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || isConfirmOpen) return;
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toUpperCase();
      if (KEYS.includes(key as tAlternativeKey)) {
        select(key as tAlternativeKey);
      } else if (event.key === 'ArrowRight') {
        goTo(currentIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        goTo(currentIndex - 1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, goTo, isConfirmOpen, select]);

  const blanks = total - answeredCount;
  const isLowTime = remaining < 10 * 60;

  return (
    <>
      <TopBar>
        <div>
          <strong>{MODE_TITLE[exam.mode]}</strong>
          {exam.subjectId && <span> · {subjectName(exam.subjectId)}</span>}
        </div>
        <Timer $isLow={isLowTime} role="timer" aria-label={`Tempo restante: ${formatClock(remaining)}`}>
          <LuTimer aria-hidden /> {formatClock(remaining)}
        </Timer>
      </TopBar>

      <Layout>
        <Main>
          <QuestionCard
            question={question}
            number={currentIndex + 1}
            subjectName={subjectName(question.materia)}
            selected={answers[question.id]}
            onSelect={select}
          />
          <Nav>
            <Button
              variant="ghost"
              icon={<LuArrowLeft aria-hidden />}
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>
            <Button variant={isFlagged ? 'secondary' : 'ghost'} icon={<LuFlag aria-hidden />} onClick={toggleFlag}>
              {isFlagged ? 'Marcada' : 'Revisar'}
            </Button>
            {currentIndex < total - 1 ? (
              <Button icon={<LuArrowRight aria-hidden />} onClick={() => goTo(currentIndex + 1)}>
                Próxima
              </Button>
            ) : (
              <Button icon={<LuCircleCheck aria-hidden />} onClick={() => setIsConfirmOpen(true)}>
                Finalizar
              </Button>
            )}
          </Nav>
        </Main>

        <Side>
          <SideCard>
            <ProgressBar
              label="Respondidas"
              value={total ? answeredCount / total : 0}
              valueText={`${answeredCount} de ${total}`}
            />
            <AnswerGrid
              total={total}
              currentIndex={currentIndex}
              isAnswered={(index) => answers[questions[index].id] !== undefined}
              isFlagged={(index) => flagged.includes(questions[index].id)}
              onSelect={goTo}
            />
            <Button variant="secondary" isFullWidth onClick={() => setIsConfirmOpen(true)}>
              Entregar prova
            </Button>
            <SaveStatus $isError={saveState === 'error'} role="status">
              {saveState === 'error' ? <LuCloudOff aria-hidden /> : <LuCloud aria-hidden />}
              {saveState === 'saving'
                ? 'Salvando...'
                : saveState === 'error'
                  ? 'Sem conexão: as respostas serão enviadas na entrega'
                  : 'Respostas salvas (dá para continuar em outro aparelho)'}
            </SaveStatus>
            <small>Atalhos: teclas A a E marcam a resposta; setas mudam de questão.</small>
          </SideCard>
        </Side>
      </Layout>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Entregar a prova?"
        message={
          blanks > 0
            ? `Ainda há ${blanks} ${blanks === 1 ? 'questão' : 'questões'} em branco${
                flagged.length ? ` e ${flagged.length} marcadas para revisar` : ''
              }. Questão em branco vale zero.`
            : 'Todas as questões foram respondidas. Depois de entregar não dá para mudar as respostas.'
        }
        confirmLabel="Entregar e ver nota"
        cancelLabel="Continuar prova"
        isLoading={isFinishing}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => void finish()}
      />
    </>
  );
}
