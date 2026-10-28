import type { ReactNode } from 'react';
import { Header, Title, Wrapper } from './styles';

interface iSectionProps {
  title: string;
  /** Ação à direita do título (ex.: link "Ver tudo"). */
  action?: ReactNode;
  children: ReactNode;
}

/** Bloco de página com título (h2). */
export function Section({ title, action, children }: iSectionProps) {
  return (
    <Wrapper>
      <Header>
        <Title>{title}</Title>
        {action}
      </Header>
      {children}
    </Wrapper>
  );
}
