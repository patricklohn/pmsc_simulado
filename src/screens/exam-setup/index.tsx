'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LuBookOpen, LuClipboardList, LuHistory, LuTimer, LuZap } from 'react-icons/lu';
import { Alert } from '@components/alert';
import { Button } from '@components/button';
import { ConfirmDialog } from '@components/confirm-dialog';
import { PageHeader } from '@components/page-header';
import { SelectField } from '@components/select-field';
import { SwitchField } from '@components/switch-field';
import { useToast } from '@components/toast';
import { useContent } from '@contexts/content';
import { EXAM_QUERY_KEYS, useExamOverview } from '@hooks/use-exams';
import { examApi } from '@services/api';
import { ApiError } from '@services/api-error';
import { ROUTES } from '@shell/routes';
import type { iCreateExamInput, tExamMode } from '@/types/exam';
import type { tSubjectId } from '@/types/subject';
import { formatDuration } from '@utils/format-duration';
import { ModeCard, ModeDescription, ModeGrid, ModeHeader, ModeIcon, ModeOptions, Notice } from './styles';

const QUICK_COUNT = 20;
const SUBJECT_COUNTS = ['10', '20', '30', 'todas'] as const;
/** Mesmo ritmo da API: 4 h na completa, 4 min por questão nas outras. */
const FULL_EXAM_SECONDS = 4 * 60 * 60;
const SECONDS_PER_QUESTION = 4 * 60;

/** Escolha do tipo de simulado. A API sorteia as questões. */
export function ExamSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { notice, subjects, subjectName, questionsOfSubject, questionCounts } = useContent();
  const { data: overview } = useExamOverview();
  const initialSubject = (searchParams.get('materia') ?? subjects[0]?.id ?? '') as tSubjectId;
  const [subjectId, setSubjectId] = useState<tSubjectId>(initialSubject);
  const [subjectCount, setSubjectCount] = useState<(typeof SUBJECT_COUNTS)[number]>('20');
  const [shouldPreferUnseen, setShouldPreferUnseen] = useState(true);
  const [pendingMode, setPendingMode] = useState<tExamMode | null>(null);
  const currentExam = overview?.current ?? null;

  const subjectPool = questionsOfSubject(subjectId);
  const subjectTotal = subjectCount === 'todas' ? subjectPool : Math.min(Number(subjectCount), subjectPool);

  const startMutation = useMutation({
    mutationFn: (input: iCreateExamInput) => examApi.create(input),
    onSuccess: async (session) => {
      queryClient.setQueryData(EXAM_QUERY_KEYS.detail(session.exam.id), session);
      await queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.overview });
      router.push(`${ROUTES.exam}?id=${session.exam.id}`);
    },
    onError: (error) => showToast(error instanceof ApiError ? error.message : 'Não foi possível começar.', 'danger'),
  });

  const start = (mode: tExamMode, shouldReplaceCurrent = false) =>
    startMutation.mutate({
      mode,
      subjectId: mode === 'materia' ? subjectId : undefined,
      count: mode === 'rapido' ? QUICK_COUNT : mode === 'materia' ? subjectTotal : undefined,
      shouldPreferUnseen,
      shouldReplaceCurrent,
    });

  const requestStart = (mode: tExamMode) => (currentExam ? setPendingMode(mode) : start(mode));
  const isStarting = (mode: tExamMode) => startMutation.isPending && startMutation.variables?.mode === mode;

  if (questionCounts.total === 0) {
    return (
      <>
        <PageHeader title="Simulado" />
        <Alert tone="warning">Ainda não há questões cadastradas no banco.</Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Simulado"
        subtitle={`${questionCounts.total} questões no banco, no formato da prova (${notice.banca})`}
        actions={
          <Button variant="secondary" icon={<LuHistory aria-hidden />} onClick={() => router.push(ROUTES.examHistory)}>
            Histórico
          </Button>
        }
      />

      {currentExam && (
        <Alert tone="warning">
          Você tem um simulado em andamento ({currentExam.answered} de {currentExam.total} respondidas).{' '}
          <Link href={`${ROUTES.exam}?id=${currentExam.id}`}>Continuar prova</Link>
        </Alert>
      )}

      <ModeGrid>
        <ModeCard>
          <ModeHeader>
            <ModeIcon aria-hidden>
              <LuClipboardList />
            </ModeIcon>
            <h2>Prova completa</h2>
          </ModeHeader>
          <ModeDescription>
            {notice.provaObjetiva.totalQuestoes} questões na distribuição oficial do edital, com{' '}
            {formatDuration(FULL_EXAM_SECONDS)} de prova (as 5 horas do dia menos 1 hora para a redação). Aprovação com
            50% e nenhuma área zerada.
          </ModeDescription>
          <Button
            icon={<LuTimer aria-hidden />}
            onClick={() => requestStart('completo')}
            isFullWidth
            isLoading={isStarting('completo')}
          >
            Começar prova completa
          </Button>
        </ModeCard>

        <ModeCard>
          <ModeHeader>
            <ModeIcon aria-hidden>
              <LuBookOpen />
            </ModeIcon>
            <h2>Por matéria</h2>
          </ModeHeader>
          <ModeOptions>
            <SelectField
              label="Matéria"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value as tSubjectId)}
              options={subjects.map((subject) => ({
                value: subject.id,
                label: `${subject.nome} (${questionsOfSubject(subject.id)})`,
              }))}
            />
            <SelectField
              label="Quantidade"
              value={subjectCount}
              onChange={(event) => setSubjectCount(event.target.value as (typeof SUBJECT_COUNTS)[number])}
              options={SUBJECT_COUNTS.map((count) => ({
                value: count,
                label: count === 'todas' ? `Todas (${subjectPool})` : `${count} questões`,
              }))}
            />
          </ModeOptions>
          <ModeDescription>
            {subjectTotal} questões de {subjectName(subjectId)} · {formatDuration(subjectTotal * SECONDS_PER_QUESTION)}
          </ModeDescription>
          <Button
            variant="secondary"
            onClick={() => requestStart('materia')}
            isFullWidth
            disabled={!subjectTotal}
            isLoading={isStarting('materia')}
          >
            Praticar matéria
          </Button>
        </ModeCard>

        <ModeCard>
          <ModeHeader>
            <ModeIcon aria-hidden>
              <LuZap />
            </ModeIcon>
            <h2>Rápido</h2>
          </ModeHeader>
          <ModeDescription>
            {QUICK_COUNT} questões sorteadas de todas as matérias, em{' '}
            {formatDuration(QUICK_COUNT * SECONDS_PER_QUESTION)}. Bom para revisar no dia a dia.
          </ModeDescription>
          <Button
            variant="secondary"
            onClick={() => requestStart('rapido')}
            isFullWidth
            isLoading={isStarting('rapido')}
          >
            Começar simulado rápido
          </Button>
        </ModeCard>
      </ModeGrid>

      <SwitchField
        label="Priorizar questões que ainda não vi"
        description="As questões dos simulados anteriores só aparecem quando acabam as inéditas."
        checked={shouldPreferUnseen}
        onChange={(event) => setShouldPreferUnseen(event.target.checked)}
      />

      <Notice>
        As questões são adaptadas de provas anteriores ou inéditas no estilo da banca, feitas para estudo. A fonte
        aparece no gabarito comentado. Confira sempre o texto atualizado da lei.
      </Notice>

      <ConfirmDialog
        isOpen={pendingMode !== null}
        title="Começar um novo simulado?"
        message="O simulado em andamento será descartado e não entra no histórico."
        confirmLabel="Descartar e começar"
        isDanger
        isLoading={startMutation.isPending}
        onCancel={() => setPendingMode(null)}
        onConfirm={() => {
          if (pendingMode) start(pendingMode, true);
          setPendingMode(null);
        }}
      />
    </>
  );
}
