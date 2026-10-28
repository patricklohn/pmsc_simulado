import type { ReactNode } from 'react';
import { LuCircleAlert, LuCircleCheck, LuInfo, LuTriangleAlert } from 'react-icons/lu';
import { Box, type tAlertTone } from './styles';

export type { tAlertTone };

const ICONS: Record<tAlertTone, ReactNode> = {
  info: <LuInfo aria-hidden />,
  success: <LuCircleCheck aria-hidden />,
  warning: <LuTriangleAlert aria-hidden />,
  danger: <LuCircleAlert aria-hidden />,
};

interface iAlertProps {
  tone?: tAlertTone;
  children: ReactNode;
}

/** Aviso dentro da página (ex.: erro devolvido pela API no topo de um formulário). */
export function Alert({ tone = 'info', children }: iAlertProps) {
  return (
    <Box $tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      {ICONS[tone]}
      <div>{children}</div>
    </Box>
  );
}
