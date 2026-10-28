import type { ReactNode } from 'react';
import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { Message } from './styles';

interface iConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Ação destrutiva (ex.: excluir, cancelar nota): botão vermelho. */
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Pergunta de confirmação antes de uma ação importante. */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Voltar',
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: iConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Message>{message}</Message>
    </Modal>
  );
}
