import type { ReactNode } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { Actions, BackLink, Subtitle, Texts, Title, Wrapper } from './styles';

interface iPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Rota do "voltar" (telas de detalhe e formulário). */
  backTo?: string;
  /** Ações da página (ex.: "Nova nota"). No celular quebram para baixo do título. */
  actions?: ReactNode;
}

/** Título da página, com voltar e ações opcionais. */
export function PageHeader({ title, subtitle, backTo, actions }: iPageHeaderProps) {
  return (
    <Wrapper>
      <Texts>
        {backTo && (
          <BackLink href={backTo}>
            <LuArrowLeft aria-hidden />
            Voltar
          </BackLink>
        )}
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Texts>
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  );
}
