'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, refreshSession, type iLoginInput, type iRegisterInput } from '@services/api';
import { sessionStore } from '@services/session-store';
import type { iMe } from '@/types/auth';

export type tAuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface iAuthContext {
  status: tAuthStatus;
  me: iMe | null;
  login: (input: iLoginInput) => Promise<void>;
  /** Cria o cadastro (fica aguardando liberação; não entra). */
  register: (input: iRegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<iAuthContext | null>(null);

/**
 * Sessão do usuário. Ao abrir o app, tenta renovar pelo cookie httpOnly; se der certo, carrega o `/auth/eu`.
 * Se a renovação falhar em qualquer momento, volta para anônimo.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<tAuthStatus>('loading');
  const [me, setMe] = useState<iMe | null>(null);
  const queryClient = useQueryClient();

  const loadMe = useCallback(async () => {
    setMe(await authApi.me());
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    let isActive = true;
    refreshSession()
      .then((isRefreshed) => (isRefreshed ? loadMe() : setStatus('anonymous')))
      .catch(() => isActive && setStatus('anonymous'));

    const unsubscribe = sessionStore.subscribe((token) => {
      if (!token) {
        setMe(null);
        setStatus('anonymous');
      }
    });
    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [loadMe]);

  const login = useCallback(
    async (input: iLoginInput) => {
      await authApi.login(input);
      await loadMe();
    },
    [loadMe]
  );

  const register = useCallback(async (input: iRegisterInput) => {
    await authApi.register(input);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(() => ({ status, me, login, register, logout }), [status, me, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Sessão atual. Use dentro do {@link AuthProvider}. */
export function useAuth(): iAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro do AuthProvider');
  }
  return context;
}
