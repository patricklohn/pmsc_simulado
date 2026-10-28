'use client';

import type { ReactNode } from 'react';
import { Brand } from '@components/brand';
import { Footer, Panel, Subtitle, Title, Wrapper } from './styles';

interface iAuthLayoutProps {
  title: string;
  subtitle?: string;
  /** Link de troca (ex.: "Ainda não tem conta? Criar conta"). */
  footer?: ReactNode;
  children: ReactNode;
}

/** Moldura das telas sem login: logo, título e o formulário num cartão central. */
export function AuthLayout({ title, subtitle, footer, children }: iAuthLayoutProps) {
  return (
    <Wrapper>
      <Panel>
        <Brand />
        <div>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>
        {children}
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Wrapper>
  );
}
