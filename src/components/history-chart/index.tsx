import { useTheme } from 'styled-components';
import { Figure } from './styles';

export interface iHistoryPoint {
  id: string;
  label: string;
  percent: number;
}

const WIDTH = 600;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

/** Evolução do aproveitamento (%) nos simulados, com a linha de corte de 50%. */
export function HistoryChart({ points, passingPercent }: { points: iHistoryPoint[]; passingPercent: number }) {
  const theme = useTheme();
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) => PAD.left + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW);
  const y = (percent: number) => PAD.top + innerH - (percent / 100) * innerH;
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(point.percent)}`).join(' ');
  const summary = points.map((point) => `${point.label}: ${point.percent}%`).join('; ');

  return (
    <Figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Evolução das notas. ${summary}`}>
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} stroke={theme.colors.border} />
            <text x={PAD.left - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill={theme.colors.textMuted}>
              {tick}%
            </text>
          </g>
        ))}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={y(passingPercent)}
          y2={y(passingPercent)}
          stroke={theme.colors.warning}
          strokeDasharray="6 4"
          strokeWidth={1.5}
        />
        <path d={path} fill="none" stroke={theme.colors.primary} strokeWidth={2.5} strokeLinejoin="round" />
        {points.map((point, index) => (
          <circle
            key={point.id}
            cx={x(index)}
            cy={y(point.percent)}
            r={4}
            fill={point.percent >= passingPercent ? theme.colors.secondary : theme.colors.danger}
          >
            <title>{`${point.label}: ${point.percent}%`}</title>
          </circle>
        ))}
      </svg>
      <figcaption>Linha tracejada: nota mínima de {passingPercent}%.</figcaption>
    </Figure>
  );
}
