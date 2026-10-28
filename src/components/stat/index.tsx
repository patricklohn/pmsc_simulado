import type { ReactNode } from 'react';
import { Hint, IconCircle, Label, Value, Wrapper } from './styles';

export type tStatTone = 'primary' | 'secondary' | 'warning' | 'danger';

interface iStatProps {
  label: string;
  /** Valor já formatado (a API manda o número pronto; a página só formata). */
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: tStatTone;
}

/** Número de destaque do dashboard (faturamento do mês, contas a vencer...). */
export function Stat({ label, value, hint, icon, tone = 'primary' }: iStatProps) {
  return (
    <Wrapper>
      {icon && (
        <IconCircle $tone={tone} aria-hidden>
          {icon}
        </IconCircle>
      )}
      <Label>{label}</Label>
      <Value>{value}</Value>
      {hint && <Hint>{hint}</Hint>}
    </Wrapper>
  );
}
