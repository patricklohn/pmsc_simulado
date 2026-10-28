import styled, { type DefaultTheme } from 'styled-components';

export type tBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<tBadgeTone, (theme: DefaultTheme) => { color: string; background: string }> = {
  neutral: (theme) => ({ color: theme.colors.textMuted, background: theme.colors.background }),
  info: (theme) => ({ color: theme.colors.primary, background: theme.colors.primarySoft }),
  success: (theme) => ({ color: theme.colors.secondary, background: theme.colors.secondarySoft }),
  warning: (theme) => ({ color: theme.colors.warning, background: theme.colors.warningSoft }),
  danger: (theme) => ({ color: theme.colors.danger, background: theme.colors.dangerSoft }),
};

export const Badge = styled.span<{ $tone: tBadgeTone }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: 2px ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  color: ${({ theme, $tone }) => TONES[$tone](theme).color};
  background: ${({ theme, $tone }) => TONES[$tone](theme).background};
  border: 1px solid ${({ theme, $tone }) => ($tone === 'neutral' ? theme.colors.border : 'transparent')};
`;
