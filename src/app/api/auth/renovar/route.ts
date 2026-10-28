import { HTTP_STATUS, ServiceError } from '@server/errors';
import { ok, parseBody, route } from '@server/http';
import { refreshSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from '@server/session-cookie';

/** Troca o refresh token (body ou cookie) por uma sessão nova. */
export const POST = route(async (request) => {
  const { refresh_token: fromBody } = await parseBody(request, refreshSchema);
  const token = fromBody ?? (await readRefreshCookie());
  if (!token) {
    throw new ServiceError(HTTP_STATUS.unauthorized, 'REFRESH_TOKEN_INVALID', 'Sessão expirada. Entre de novo.');
  }
  try {
    const session = await AuthService.refresh(token);
    await setRefreshCookie(session);
    return ok(session);
  } catch (error) {
    await clearRefreshCookie();
    throw error;
  }
});
