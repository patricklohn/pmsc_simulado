import type { tApiEnvelope } from '@/types/api';
import { ApiError, NETWORK_ERROR_CODE } from './api-error';

export type tHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** Valores aceitos na querystring. `undefined` e `null` são ignorados; objetos viram JSON (ex.: `condition`). */
export type tQueryValue = string | number | boolean | object | null | undefined;

export interface iRequestOptions {
  body?: unknown;
  query?: Record<string, tQueryValue>;
  signal?: AbortSignal;
  /** `false` não envia o token nem tenta renovar a sessão (ex.: login). Padrão: `true`. */
  isAuthenticated?: boolean;
}

export interface iHttpClientOptions {
  baseUrl: string;
  /** Token atual (em memória). */
  getAccessToken: () => string | null;
  /**
   * Renova a sessão quando a API responde 401. Devolve `true` se conseguiu (novo token já salvo).
   * Sem esta função, o 401 vira erro direto.
   */
  refreshSession?: () => Promise<boolean>;
  /** Chamado quando a renovação falha: a sessão acabou. */
  onSessionExpired?: () => void;
  /** `include` envia o cookie httpOnly do refresh token. */
  credentials?: RequestCredentials;
  fetchFn?: typeof fetch;
}

/** Cliente HTTP tipado. Cada método devolve o `result` do envelope ou lança {@link ApiError}. */
export interface iHttpClient {
  request: <T>(method: tHttpMethod, path: string, options?: iRequestOptions) => Promise<T>;
  get: <T>(path: string, options?: Omit<iRequestOptions, 'body'>) => Promise<T>;
  post: <T>(path: string, body?: unknown, options?: Omit<iRequestOptions, 'body'>) => Promise<T>;
  patch: <T>(path: string, body?: unknown, options?: Omit<iRequestOptions, 'body'>) => Promise<T>;
  delete: <T>(path: string, options?: Omit<iRequestOptions, 'body'>) => Promise<T>;
}

/**
 * Monta a URL com a querystring.
 *
 * @param baseUrl - URL base sem barra no final
 * @param path - caminho começando com `/`
 * @param query - parâmetros (objetos viram JSON)
 */
export function buildUrl(baseUrl: string, path: string, query?: Record<string, tQueryValue>) {
  const url = new URL(`${baseUrl}${path}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    url.searchParams.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  });

  return url.toString();
}

/**
 * Cria um cliente HTTP para uma API no envelope `{ success, result }`.
 *
 * - Desembrulha o `result` e transforma `{ success: false, error }` em {@link ApiError}.
 * - Num `401`, renova a sessão uma vez e repete a request. Várias requests com `401` ao mesmo tempo esperam a
 *   **mesma** renovação: duas renovações em paralelo fariam a API detectar reuso do refresh token e derrubar a sessão.
 *
 * @example
 * const api = createHttpClient({ baseUrl: Env.apiUrl, getAccessToken: () => sessionStore.getAccessToken() });
 * const me = await api.get<iMe>('/auth/me');
 */
export function createHttpClient(options: iHttpClientOptions): iHttpClient {
  const fetchFn = options.fetchFn ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  let refreshing: Promise<boolean> | null = null;

  const refreshOnce = () => {
    if (!options.refreshSession) {
      return Promise.resolve(false);
    }
    refreshing ??= options.refreshSession().finally(() => {
      refreshing = null;
    });
    return refreshing;
  };

  const send = async (method: tHttpMethod, path: string, requestOptions: iRequestOptions) => {
    const isAuthenticated = requestOptions.isAuthenticated ?? true;
    const headers: Record<string, string> = { accept: 'application/json' };
    const token = isAuthenticated ? options.getAccessToken() : null;

    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    if (requestOptions.body !== undefined) {
      headers['content-type'] = 'application/json';
    }

    try {
      return await fetchFn(buildUrl(options.baseUrl, path, requestOptions.query), {
        method,
        headers,
        body: requestOptions.body === undefined ? undefined : JSON.stringify(requestOptions.body),
        credentials: options.credentials ?? 'same-origin',
        signal: requestOptions.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      throw new ApiError(0, NETWORK_ERROR_CODE, 'Não foi possível falar com o servidor. Confira sua conexão.');
    }
  };

  const parse = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) {
      return undefined as T;
    }

    const envelope = (await response.json().catch(() => null)) as tApiEnvelope<T> | null;

    if (!envelope) {
      throw new ApiError(response.status, 'INVALID_RESPONSE', 'Resposta inesperada do servidor.');
    }
    if (!envelope.success) {
      throw new ApiError(response.status, envelope.error.code, envelope.error.message);
    }

    return envelope.result;
  };

  const request = async <T>(method: tHttpMethod, path: string, requestOptions: iRequestOptions = {}) => {
    let response = await send(method, path, requestOptions);
    const shouldRefresh = response.status === 401 && (requestOptions.isAuthenticated ?? true);

    if (shouldRefresh) {
      const isRefreshed = await refreshOnce();
      if (!isRefreshed) {
        options.onSessionExpired?.();
        return parse<T>(response);
      }
      response = await send(method, path, requestOptions);
    }

    return parse<T>(response);
  };

  return {
    request,
    get: (path, requestOptions) => request('GET', path, requestOptions),
    post: (path, body, requestOptions) => request('POST', path, { ...requestOptions, body }),
    patch: (path, body, requestOptions) => request('PATCH', path, { ...requestOptions, body }),
    delete: (path, requestOptions) => request('DELETE', path, requestOptions),
  };
}
