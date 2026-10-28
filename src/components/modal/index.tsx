import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import { IconButton } from '@components/button';
import { Body, Footer, Header, Overlay, Panel, Title } from './styles';

export interface iModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Botões de ação, alinhados no rodapé. */
  footer?: ReactNode;
}

/**
 * Janela sobre a página. No celular abre como **bottom sheet** (preso embaixo, fácil de alcançar com o polegar);
 * a partir de 768px, centralizada. Fecha com Esc, com o X e clicando fora.
 */
export function Modal({ isOpen, onClose, title, children, footer }: iModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Overlay onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <Panel ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <Header>
          <Title id={titleId}>{title}</Title>
          <IconButton aria-label="Fechar" onClick={onClose}>
            <LuX />
          </IconButton>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Overlay>,
    document.body
  );
}
