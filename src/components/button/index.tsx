import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '@components/spinner';
import { StyledButton, StyledIconButton, type tButtonSize, type tButtonVariant } from './styles';

export interface iButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: tButtonVariant;
  size?: tButtonSize;
  /** Ícone à esquerda do texto (`react-icons`). */
  icon?: ReactNode;
  isLoading?: boolean;
  isFullWidth?: boolean;
}

/**
 * Botão padrão. Enquanto `isLoading`, fica desabilitado e mostra um spinner no lugar do ícone.
 *
 * @example
 * <Button icon={<LuPlus />} onClick={create}>Nova nota</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  isFullWidth = false,
  disabled,
  type = 'button',
  children,
  ...rest
}: iButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $isFullWidth={isFullWidth}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <Spinner size={18} /> : icon}
      {children}
    </StyledButton>
  );
}

export interface iIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: o botão só tem ícone, então o nome vem daqui. */
  'aria-label': string;
  variant?: tButtonVariant;
  children: ReactNode;
}

/** Botão só com ícone, com alvo de toque de 44px. */
export function IconButton({ variant = 'ghost', type = 'button', children, ...rest }: iIconButtonProps) {
  return (
    <StyledIconButton type={type} $variant={variant} title={rest['aria-label']} {...rest}>
      {children}
    </StyledIconButton>
  );
}
