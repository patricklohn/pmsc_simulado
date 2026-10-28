import { vi } from 'vitest';

type tHandler = (init: RequestInit & { url: string }) => { status?: number; body?: unknown } | undefined;

/**
 * Simula a API do app no `fetch`. Cada rota responde com `{ success: true, result }` (ou o `status` informado).
 * Rotas sem handler respondem 404.
 *
 * @example
 * mockApi({ 'GET /api/progresso': () => ({ body: { doneTopics: [] } }) });
 */
export function mockApi(routes: Record<string, tHandler>) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init = {}) => {
    const url = new URL(String(input));
    const method = (init.method ?? 'GET').toUpperCase();
    const handler = routes[`${method} ${url.pathname}`];
    const response = handler?.({ ...init, url: url.toString() });
    if (!response) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: `${method} ${url.pathname}` } }),
        { status: 404 }
      );
    }
    const status = response.status ?? 200;
    if (status === 204) return new Response(null, { status });
    const isError = status >= 400;
    return new Response(
      JSON.stringify(isError ? { success: false, error: response.body } : { success: true, result: response.body }),
      { status }
    );
  });
}
