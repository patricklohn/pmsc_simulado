import { StatusBadge } from '@components/status-badge';
import { useContent } from '@contexts/content';
import { getEventStatus, type tEventStatus } from '@utils/schedule';
import { formatPeriod } from '@utils/format-date';
import { Dot, GroupCard, GroupTitle, Timeline, TimelineDate, TimelineItem, TimelineText, Groups } from './styles';

const STATUS_BADGE: Record<tEventStatus, { tone: 'neutral' | 'success' | 'info'; label: string } | null> = {
  passado: { tone: 'neutral', label: 'Concluído' },
  hoje: { tone: 'success', label: 'Em andamento' },
  futuro: null,
};

/** Linha do tempo do Anexo I, agrupada por fase. */
export function ScheduleTab({ today }: { today: string }) {
  const { schedule } = useContent();
  return (
    <Groups>
      {schedule.grupos.map((group) => (
        <GroupCard key={group.id}>
          <GroupTitle>{group.titulo}</GroupTitle>
          <Timeline>
            {group.eventos.map((event) => {
              const status = getEventStatus(event, today);
              const badge = STATUS_BADGE[status];
              return (
                <TimelineItem key={event.id} $status={status}>
                  <Dot $status={status} $isHighlight={event.destaque} aria-hidden />
                  <TimelineDate>{formatPeriod(event.inicio, event.fim)}</TimelineDate>
                  <TimelineText $isHighlight={event.destaque}>
                    {event.titulo}
                    {badge && <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>}
                  </TimelineText>
                </TimelineItem>
              );
            })}
          </Timeline>
        </GroupCard>
      ))}
    </Groups>
  );
}
