import type { iAuthSession, iMe } from '@/types/auth';
import type { iContent } from '@/types/content';
import type { iCreateExamInput, iExamOverview, iExamReview, iExamSession } from '@/types/exam';
import type { tAlternativeKey } from '@/types/question';
import { createHttpClient } from './http-client';
import { sessionStore } from './session-store';

/** A API é o próprio app (`src/app/api`). */
const baseUrl = () => `${window.location.origin}/api`;

let refreshing: Promise<boolean> | null = null;

/**
 * Renova a sessão pelo cookie httpOnly (`POST /api/auth/renovar`). Chamadas ao mesmo tempo esperam a **mesma**
 * renovação: duas em paralelo fariam a API detectar reuso do refresh token e derrubar a sessão.
 *
 * @returns `true` se renovou (o novo access token já está no `sessionStore`)
 */
export function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${baseUrl()}/auth/renovar`, { method: 'POST', credentials: 'same-origin' })
    .then(async (response) => {
      if (!response.ok) {
        sessionStore.setAccessToken(null);
        return false;
      }
      const envelope = (await response.json()) as { result: iAuthSession };
      sessionStore.setAccessToken(envelope.result.access_token);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

let client: ReturnType<typeof createHttpClient> | null = null;

/** Cliente HTTP da API, com o access token em memória e renovação automática no 401. */
export function api() {
  client ??= createHttpClient({
    baseUrl: baseUrl(),
    getAccessToken: () => sessionStore.getAccessToken(),
    refreshSession,
    onSessionExpired: () => sessionStore.setAccessToken(null),
    credentials: 'same-origin',
  });
  return client;
}

export interface iRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface iLoginInput {
  email: string;
  password: string;
}

/** Cadastro, login e sessão. */
export const authApi = {
  register: (input: iRegisterInput) =>
    api().post<{ uuid: string; status: string }>('/auth/cadastro', input, { isAuthenticated: false }),
  async login(input: iLoginInput) {
    const session = await api().post<iAuthSession>('/auth/entrar', input, { isAuthenticated: false });
    sessionStore.setAccessToken(session.access_token);
    return session;
  },
  async logout() {
    await api()
      .post<void>('/auth/sair', undefined, { isAuthenticated: false })
      .catch(() => undefined);
    sessionStore.setAccessToken(null);
  },
  me: () => api().get<iMe>('/auth/eu'),
};

/** Conteúdo de estudo (lido do banco). */
export const contentApi = {
  load: () => api().get<iContent>('/conteudo'),
};

/** Tópicos estudados. */
export const progressApi = {
  list: () => api().get<{ doneTopics: string[] }>('/progresso'),
  setTopic: (topicId: string, isDone: boolean) => api().post<unknown>('/progresso', { topicId, isDone }),
};

/** Simulados. */
export const examApi = {
  overview: () => api().get<iExamOverview>('/simulados'),
  create: (input: iCreateExamInput) => api().post<iExamSession>('/simulados', input),
  get: (id: string) => api().get<iExamSession | iExamReview>(`/simulados/${id}`),
  last: () => api().get<iExamReview | null>('/simulados/ultimo'),
  save: (id: string, input: { answers?: Record<string, tAlternativeKey>; flagged?: string[]; currentIndex?: number }) =>
    api().patch<{ saved: true }>(`/simulados/${id}`, input),
  finish: (id: string, input: { answers: Record<string, tAlternativeKey>; flagged: string[] }) =>
    api().post<iExamReview>(`/simulados/${id}/entregar`, input),
  discard: (id: string) => api().delete<void>(`/simulados/${id}`),
  clearHistory: () => api().delete<void>('/simulados'),
};

/** `true` quando o simulado já foi entregue (tem resultado). */
export const isReview = (data: iExamSession | iExamReview): data is iExamReview => 'result' in data;
