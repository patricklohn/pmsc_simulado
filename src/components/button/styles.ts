import styled, { css, type DefaultTheme } from 'styled-components';

export type tButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type tButtonSize = 'sm' | 'md';

const VARIANTS: Record<tButtonVariant, (theme: DefaultTheme) => ReturnType<typeof css>> = {
  primary: (theme) => css`
    background: ${theme.colors.primary};
    color: ${theme.colors.onPrimary};
  `,
  secondary: (theme) => css`
    background: ${theme.colors.primarySoft};
    color: ${theme.colors.primary};
  `,
  ghost: (theme) => css`
    background: transparent;
    color: ${theme.colors.text};
    &:hover:not(:disabled) {
      background: ${theme.colors.primarySoft};
    }
  `,
  danger: (theme) => css`
    background: ${theme.colors.danger};
    color: ${theme.colors.onDanger};
  `,
};

const base = css<{ $variant: tButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  transition:
    filter ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};
  ${({ theme, $variant }) => VARIANTS[$variant](theme)}

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    font-size: 1.15em;
  }
`;

export const StyledButton = styled.button<{ $variant: tButtonVariant; $size: tButtonSize; $isFullWidth: boolean }>`
  ${base}
  min-height: ${({ theme, $size }) => ($size === 'md' ? theme.touchTarget : '36px')};
  padding: 0 ${({ theme, $size }) => ($size === 'md' ? theme.space[5] : theme.space[3])};
  font-size: ${({ theme, $size }) => ($size === 'md' ? theme.font.size.md : theme.font.size.sm)};
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'auto')};
`;

export const StyledIconButton = styled.button<{ $variant: tButtonVariant }>`
  ${base}
  width: ${({ theme }) => theme.touchTarget};
  height: ${({ theme }) => theme.touchTarget};
  padding: 0;
  font-size: 1.25rem;
`;
