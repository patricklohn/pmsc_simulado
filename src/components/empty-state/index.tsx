import type { ReactNode } from 'react';
import { LuInbox } from 'react-icons/lu';
import { Description, IconCircle, Title, Wrapper } from './styles';

interface iEmptyStateProps {
  title: string;
  description?: string;
  /** Ícone (`react-icons`); padrão: caixa de entrada. */
  icon?: ReactNode;
  /** Ação principal (ex.: botão "Cadastrar cliente"). */
  action?: ReactNode;
}

/** Aviso de lista vazia ou de conteúdo que ainda não existe. */
export function EmptyState({ title, description, icon = <LuInbox />, action }: iEmptyStateProps) {
  return (
    <Wrapper>
      <IconCircle aria-hidden>{icon}</IconCircle>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action}
    </Wrapper>
  );
}
