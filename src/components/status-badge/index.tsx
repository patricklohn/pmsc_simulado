import type { ReactNode } from 'react';
import { Badge, type tBadgeTone } from './styles';

export type { tBadgeTone };

interface iStatusBadgeProps {
  tone?: tBadgeTone;
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Selo de status. O tom é escolhido pela página a partir do `status` que a API devolve.
 *
 * @example
 * <StatusBadge tone="success">Autorizada</StatusBadge>
 */
export function StatusBadge({ tone = 'neutral', icon, children }: iStatusBadgeProps) {
  return (
    <Badge $tone={tone}>
      {icon}
      {children}
    </Badge>
  );
}
