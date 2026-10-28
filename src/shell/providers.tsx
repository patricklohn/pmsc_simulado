'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ToastProvider } from '@components/toast';
import { AuthProvider } from '@contexts/auth';
import { ThemeModeProvider } from '@contexts/theme';
import { ApiError } from '@services/api-error';

/** Erros 4xx são definitivos: só repete falha de rede ou 5xx, uma vez. */
const shouldRetry = (failureCount: number, error: unknown) =>
  failureCount < 1 && (!(error instanceof ApiError) || error.status === 0 || error.status >= 500);

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry, staleTime: 30_000, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
}

/** Providers globais, na ordem em que dependem uns dos outros. */
export function Providers({ children, queryClient }: { children: ReactNode; queryClient?: QueryClient }) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <ThemeModeProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}
