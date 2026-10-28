'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuClipboardCheck, LuTrash2 } from 'react-icons/lu';
import { ROUTES } from '@shell/routes';
import { Button } from '@components/button';
import { Card } from '@components/card';
import { ConfirmDialog } from '@components/confirm-dialog';
import { EmptyState } from '@components/empty-state';
import { HistoryChart } from '@components/history-chart';
import { PageHeader } from '@components/page-header';
import { ScoreBreakdown } from '@components/score-breakdown';
import { Section } from '@components/section';
import { StatusBadge } from '@components/status-badge';
import { useToast } from '@components/toast';
import { Spinner } from '@components/spinner';
import { useContent } from '@contexts/content';
import { EXAM_QUERY_KEYS, useExamOverview } from '@hooks/use-exams';
import { examApi } from '@services/api';
import type { iExamHistoryEntry } from '@/types/exam';
import type { tSubjectId } from '@/types/subject';
import { formatDateTime } from '@utils/format-date';
import { formatDuration } from '@utils/format-duration';
import { examResultRoute } from '@shell/routes';
import { Entry, EntryList, EntryMain, EntryScore, Grid } from './styles';

/** Nota mínima da objetiva (item 8.4): linha de corte do gráfico. */
const PASSING_PERCENT = 50;

const MODE_LABEL = { completo: 'Prova completa', materia: 'Por matéria', rapido: 'Rápido' } as const;

/** Soma os acertos por matéria de todos os simulados. */
function totalsBySubject(history: iExamHistoryEntry[], subjectName: (id: string) => string) {
  const totals = new Map<tSubjectId, { correct: number; total: number }>();
  for (const entry of history) {
    for (const item of entry.bySubject) {
      const current = totals.get(item.subjectId) ?? { correct: 0, total: 0 };
      totals.set(item.subjectId, { correct: current.correct + item.correct, total: current.total + item.total });
    }
  }
  return [...totals.entries()]
    .map(([subjectId, value]) => ({ id: subjectId, label: subjectName(subjectId), ...value }))
    .sort((a, b) => a.correct / a.total - b.correct / b.total);
}

/** Histórico dos simulados: evolução da nota e desempenho acumulado por matéria. */
export function ExamHistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { subjectName } = useContent();
  const { data, isPending } = useExamOverview();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const history = data?.history ?? [];

  if (isPending) {
    return <Spinner size={32} label="Carregando histórico" />;
  }
  if (history.length === 0) {
    return (
      <>
        <PageHeader title="Histórico" backTo={ROUTES.exams} />
        <EmptyState
          title="Nenhum simulado feito"
          description="Os simulados entregues aparecem aqui com a nota e a evolução."
          action={<Link href={ROUTES.exams}>Fazer um simulado</Link>}
        />
      </>
    );
  }

  const chronological = [...history].reverse();
  const average = Math.round((history.reduce((sum, entry) => sum + entry.percent, 0) / history.length) * 10) / 10;

  return (
    <>
      <PageHeader
        title="Histórico"
        subtitle={`${history.length} simulados · média de ${average.toLocaleString('pt-BR')}%`}
        backTo={ROUTES.exams}
        actions={
          <>
            <Button variant="ghost" icon={<LuTrash2 aria-hidden />} onClick={() => setIsConfirmOpen(true)}>
              Limpar
            </Button>
            <Button icon={<LuClipboardCheck aria-hidden />} onClick={() => router.push(ROUTES.exams)}>
              Novo simulado
            </Button>
          </>
        }
      />

      <Grid>
        <Card>
          <Section title="Evolução">
            <HistoryChart
              passingPercent={PASSING_PERCENT}
              points={chronological.map((entry, index) => ({
                id: entry.id,
                label: `#${index + 1} ${MODE_LABEL[entry.mode]}`,
                percent: entry.percent,
              }))}
            />
          </Section>
        </Card>
        <Card>
          <Section title="Acumulado por matéria (pior primeiro)">
            <ScoreBreakdown rows={totalsBySubject(history, subjectName)} />
          </Section>
        </Card>
      </Grid>

      <Section title="Simulados">
        <EntryList>
          {history.map((entry) => (
            <Entry key={entry.id}>
              <EntryMain>
                <Link href={examResultRoute(entry.id)}>
                  {MODE_LABEL[entry.mode]}
                  {entry.subjectId && ` · ${subjectName(entry.subjectId)}`}
                </Link>
                <span>
                  {formatDateTime(entry.finishedAt)} · {formatDuration(entry.durationSeconds)}
                </span>
              </EntryMain>
              <EntryScore>
                <span>
                  {entry.correct}/{entry.total} · {entry.percent.toLocaleString('pt-BR')}%
                </span>
                <StatusBadge tone={entry.isApproved ? 'success' : 'danger'}>
                  {entry.isApproved ? 'Aprovado' : 'Reprovado'}
                </StatusBadge>
              </EntryScore>
            </Entry>
          ))}
        </EntryList>
      </Section>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Limpar o histórico?"
        message="Todos os simulados entregues serão apagados. O simulado em andamento continua."
        confirmLabel="Limpar histórico"
        isDanger
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isClearing}
        onConfirm={async () => {
          setIsClearing(true);
          try {
            await examApi.clearHistory();
            await queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
            showToast('Histórico apagado', 'success');
          } catch {
            showToast('Não foi possível apagar o histórico. Tente de novo.', 'danger');
          } finally {
            setIsClearing(false);
            setIsConfirmOpen(false);
          }
        }}
      />
    </>
  );
}
