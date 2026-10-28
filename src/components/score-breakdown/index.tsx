import { ProgressBar, type tProgressTone } from '@components/progress-bar';
import { List } from './styles';

export interface iScoreRow {
  id: string;
  label: string;
  correct: number;
  total: number;
}

/** Cor da barra conforme o aproveitamento. */
export function toneForPercent(percent: number): tProgressTone {
  if (percent >= 70) return 'secondary';
  if (percent >= 50) return 'primary';
  if (percent > 0) return 'warning';
  return 'danger';
}

/** Acertos por matéria ou área, com uma barra para cada uma. */
export function ScoreBreakdown({ rows }: { rows: iScoreRow[] }) {
  return (
    <List>
      {rows.map((row) => {
        const ratio = row.total === 0 ? 0 : row.correct / row.total;
        return (
          <li key={row.id}>
            <ProgressBar
              label={row.label}
              value={ratio}
              valueText={`${row.correct} de ${row.total}`}
              tone={toneForPercent(ratio * 100)}
            />
          </li>
        );
      })}
    </List>
  );
}
