import { noContent, parseBody, route } from '@server/http';
import { refreshSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { clearRefreshCookie, readRefreshCookie } from '@server/session-cookie';

/** Encerra a sessão (revoga a família do refresh token) e apaga o cookie. Idempotente. */
export const POST = route(async (request) => {
  const { refresh_token: fromBody } = await parseBody(request, refreshSchema);
  const token = fromBody ?? (await readRefreshCookie());
  if (token) await AuthService.logout(token);
  await clearRefreshCookie();
  return noContent();
});
