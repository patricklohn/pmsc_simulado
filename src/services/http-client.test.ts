import { ApiError } from './api-error';
import { buildUrl, createHttpClient } from './http-client';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('buildUrl', () => {
  it('ignora valores vazios e serializa objetos como JSON', () => {
    const url = buildUrl('http://api.test/v1', '/actor', {
      page: 2,
      search: undefined,
      empty: null,
      condition: { type: 'and', conditions: [] },
    });

    expect(url).toBe(
      'http://api.test/v1/actor?page=2&condition=%7B%22type%22%3A%22and%22%2C%22conditions%22%3A%5B%5D%7D'
    );
  });
});

describe('createHttpClient', () => {
  it('desembrulha o result e envia o token', async () => {
    const fetchFn = vi.fn().mockResolvedValue(json(200, { success: true, result: { name: 'Ana' } }));
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => 'token-1', fetchFn });

    await expect(api.get('/auth/me')).resolves.toEqual({ name: 'Ana' });
    expect(fetchFn.mock.calls[0][1].headers.authorization).toBe('Bearer token-1');
  });

  it('transforma o envelope de erro em ApiError com a mensagem da API', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(json(409, { success: false, error: { code: 'USER_EMAIL_DUPLICITY', message: 'Já existe' } }));
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => null, fetchFn });

    const error = await api.post('/auth/register', {}).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'USER_EMAIL_DUPLICITY', message: 'Já existe' });
  });

  it('falha de rede vira ApiError de rede', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => null, fetchFn });

    const error = (await api.get('/x').catch((caught: unknown) => caught)) as ApiError;
    expect(error.isNetworkError).toBe(true);
  });

  it('204 devolve undefined', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => null, fetchFn });

    await expect(api.delete('/actor/1')).resolves.toBeUndefined();
  });

  it('duas requests com 401 ao mesmo tempo fazem uma única renovação e repetem com o token novo', async () => {
    let token = 'velho';
    const refreshSession = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      token = 'novo';
      return true;
    });
    const fetchFn = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      const authorization = (init?.headers as Record<string, string>).authorization;
      return authorization === 'Bearer novo'
        ? json(200, { success: true, result: 'ok' })
        : json(401, { success: false, error: { code: 'UNAUTHORIZED_TOKEN', message: 'expirado' } });
    });
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => token, refreshSession, fetchFn });

    await expect(Promise.all([api.get('/a'), api.get('/b')])).resolves.toEqual(['ok', 'ok']);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('renovação falhou: avisa que a sessão acabou e lança o 401', async () => {
    const onSessionExpired = vi.fn();
    const fetchFn = vi
      .fn()
      .mockResolvedValue(json(401, { success: false, error: { code: 'UNAUTHORIZED_TOKEN', message: 'expirado' } }));
    const api = createHttpClient({
      baseUrl: 'http://api.test',
      getAccessToken: () => 't',
      refreshSession: async () => false,
      onSessionExpired,
      fetchFn,
    });

    await expect(api.get('/a')).rejects.toMatchObject({ status: 401 });
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('request sem autenticação não tenta renovar', async () => {
    const refreshSession = vi.fn();
    const fetchFn = vi
      .fn()
      .mockResolvedValue(json(401, { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'inválido' } }));
    const api = createHttpClient({ baseUrl: 'http://api.test', getAccessToken: () => null, refreshSession, fetchFn });

    await expect(api.post('/auth/login', {}, { isAuthenticated: false })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });
});
