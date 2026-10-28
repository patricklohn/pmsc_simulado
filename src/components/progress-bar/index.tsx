import { Fill, Label, Row, Track, Wrapper, type tProgressTone } from './styles';

export type { tProgressTone };

interface iProgressBarProps {
  /** De 0 a 1. */
  value: number;
  /** Nome lido pelo leitor de tela e mostrado acima da barra. */
  label: string;
  /** Texto à direita (ex.: `3 de 10`). */
  valueText?: string;
  tone?: tProgressTone;
  /** Esconde o texto (fica só a barra, com o nome acessível). */
  isLabelHidden?: boolean;
}

/** Barra de progresso acessível. */
export function ProgressBar({ value, label, valueText, tone = 'primary', isLabelHidden = false }: iProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <Wrapper>
      {!isLabelHidden && (
        <Row>
          <Label>{label}</Label>
          <span>{valueText ?? `${percent}%`}</span>
        </Row>
      )}
      <Track
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={valueText}
      >
        <Fill $tone={tone} style={{ width: `${percent}%` }} />
      </Track>
    </Wrapper>
  );
}
