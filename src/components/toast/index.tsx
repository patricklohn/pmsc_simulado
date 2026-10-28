'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { LuCircleAlert, LuCircleCheck, LuInfo, LuX } from 'react-icons/lu';
import { CloseButton, Item, Message, Region } from './styles';

export type tToastTone = 'success' | 'danger' | 'info';

interface iToast {
  id: number;
  tone: tToastTone;
  message: string;
}

interface iToastContext {
  /** Mostra uma mensagem curta que some sozinha. */
  showToast: (message: string, tone?: tToastTone) => void;
}

const ToastContext = createContext<iToastContext | null>(null);

const DURATION_MS = 4500;
const ICONS = { success: <LuCircleCheck />, danger: <LuCircleAlert />, info: <LuInfo /> } as const;

/** Provider das mensagens rápidas (topo no celular, canto inferior no desktop). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<iToast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const showToast = useCallback(
    (message: string, tone: tToastTone = 'info') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, tone, message }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Region aria-live="polite">
        {toasts.map((toast) => (
          <Item key={toast.id} $tone={toast.tone} role={toast.tone === 'danger' ? 'alert' : 'status'}>
            {ICONS[toast.tone]}
            <Message>{toast.message}</Message>
            <CloseButton type="button" aria-label="Fechar aviso" onClick={() => dismiss(toast.id)}>
              <LuX />
            </CloseButton>
          </Item>
        ))}
      </Region>
    </ToastContext.Provider>
  );
}

/** Acesso ao `showToast`. Use dentro do {@link ToastProvider}. */
export function useToast(): iToastContext {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa estar dentro do ToastProvider');
  }
  return context;
}
