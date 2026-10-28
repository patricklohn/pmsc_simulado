'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuHistory, LuRotateCcw } from 'react-icons/lu';
import { ROUTES } from '@shell/routes';
import { Alert } from '@components/alert';
import { Button } from '@components/button';
import { Card } from '@components/card';
import { EmptyState } from '@components/empty-state';
import { PageHeader } from '@components/page-header';
import { QuestionCard } from '@components/question-card';
import { ScoreBreakdown } from '@components/score-breakdown';
import { Section } from '@components/section';
import { StatusBadge } from '@components/status-badge';
import { Tabs } from '@components/tabs';
import { Spinner } from '@components/spinner';
import { useContent } from '@contexts/content';
import { EXAM_QUERY_KEYS } from '@hooks/use-exams';
import { examApi, isReview } from '@services/api';
import type { iExamReview } from '@/types/exam';
import { formatDateTime } from '@utils/format-date';
import { formatDuration } from '@utils/format-duration';
import { Breakdown, ReviewList, Score, ScoreCard, ScoreDetails, ScoreValue } from './styles';

type tReviewFilter = 'todas' | 'erradas' | 'branco' | 'certas';

/** Resultado do último simulado: nota, aprovação pelas regras do edital, desempenho e gabarito comentado. */
export function ExamResultPage() {
  const router = useRouter();
  const examId = useSearchParams().get('id');
  const { areaNames, subjectName } = useContent();
  const [filter, setFilter] = useState<tReviewFilter>('erradas');
  // Com ?id= abre um simulado do histórico; sem, o último entregue
  const query = useQuery({
    queryKey: examId ? EXAM_QUERY_KEYS.detail(examId) : EXAM_QUERY_KEYS.last,
    queryFn: async (): Promise<iExamReview | null> => {
      if (!examId) return examApi.last();
      const data = await examApi.get(examId);
      return isReview(data) ? data : null;
    },
  });

  if (query.isPending) {
    return <Spinner size={32} label="Carregando resultado" />;
  }
  const review = query.data && isReview(query.data) ? query.data : null;
  if (!review) {
    return (
      <EmptyState
        title="Nenhum resultado ainda"
        description="Faça um simulado para ver a nota e o gabarito comentado."
        action={<Link href={ROUTES.exams}>Ir para os simulados</Link>}
      />
    );
  }

  const { exam, result } = review;
  const items = review.questions.map((question, index) => ({
    question,
    number: index + 1,
    answer: exam.answers[question.id],
  }));
  const counts = {
    todas: items.length,
    certas: items.filter((item) => item.answer === item.question.correta).length,
    erradas: items.filter((item) => item.answer !== undefined && item.answer !== item.question.correta).length,
    branco: items.filter((item) => item.answer === undefined).length,
  };
  const visible = items.filter((item) => {
    if (filter === 'certas') return item.answer === item.question.correta;
    if (filter === 'erradas') return item.answer !== undefined && item.answer !== item.question.correta;
    if (filter === 'branco') return item.answer === undefined;
    return true;
  });
  const duration = exam.finishedAt
    ? (new Date(exam.finishedAt).getTime() - new Date(exam.startedAt).getTime()) / 1000
    : 0;

  return (
    <>
      <PageHeader
        title="Resultado do simulado"
        subtitle={exam.finishedAt ? `Entregue em ${formatDateTime(exam.finishedAt)} · ${formatDuration(duration)}` : ''}
        actions={
          <>
            <Button
              variant="secondary"
              icon={<LuHistory aria-hidden />}
              onClick={() => router.push(ROUTES.examHistory)}
            >
              Histórico
            </Button>
            <Button icon={<LuRotateCcw aria-hidden />} onClick={() => router.push(ROUTES.exams)}>
              Novo simulado
            </Button>
          </>
        }
      />

      <ScoreCard $isApproved={result.isApproved}>
        <Score>
          <ScoreValue>
            {result.correct}
            <small>/{result.total}</small>
          </ScoreValue>
          <span>{result.percent.toLocaleString('pt-BR')}% de acerto</span>
        </Score>
        <ScoreDetails>
          <StatusBadge tone={result.isApproved ? 'success' : 'danger'}>
            {result.isApproved ? 'Aprovado na objetiva' : 'Reprovado na objetiva'}
          </StatusBadge>
          <p>
            Pelo item 8.4 do edital: no mínimo 50% dos pontos e nenhuma área zerada.
            {result.zeroedAreas.length > 0 &&
              ` Área zerada: ${result.zeroedAreas.map((areaId) => areaNames[areaId]).join(', ')}.`}
          </p>
          {exam.mode !== 'completo' && (
            <small>Este simulado não tem todas as matérias: a regra serve só como referência.</small>
          )}
        </ScoreDetails>
      </ScoreCard>

      <Breakdown>
        <Card>
          <Section title="Por área">
            <ScoreBreakdown
              rows={result.byArea.map((area) => ({ id: area.areaId, label: areaNames[area.areaId], ...area }))}
            />
          </Section>
        </Card>
        <Card>
          <Section title="Por matéria">
            <ScoreBreakdown
              rows={result.bySubject.map((subject) => ({
                id: subject.subjectId,
                label: subjectName(subject.subjectId),
                ...subject,
              }))}
            />
          </Section>
        </Card>
      </Breakdown>

      <Section title="Gabarito comentado">
        <Tabs
          label="Filtrar questões"
          value={filter}
          onChange={setFilter}
          items={[
            { value: 'erradas', label: `Erradas (${counts.erradas})` },
            { value: 'branco', label: `Em branco (${counts.branco})` },
            { value: 'certas', label: `Certas (${counts.certas})` },
            { value: 'todas', label: `Todas (${counts.todas})` },
          ]}
        />
        {visible.length === 0 ? (
          <Alert tone="success">Nenhuma questão neste filtro.</Alert>
        ) : (
          <ReviewList>
            {visible.map(({ question, number, answer }) => (
              <Card key={question.id}>
                <QuestionCard
                  question={question}
                  number={number}
                  subjectName={subjectName(question.materia)}
                  selected={answer}
                  isRevealed
                />
              </Card>
            ))}
          </ReviewList>
        )}
      </Section>
    </>
  );
}
