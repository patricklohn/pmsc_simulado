import { ok, parseBody, route } from '@server/http';
import { loginSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { setRefreshCookie } from '@server/session-cookie';

/** Login com e-mail e senha: devolve o access token e grava o refresh token no cookie httpOnly. */
export const POST = route(async (request) => {
  const session = await AuthService.login(await parseBody(request, loginSchema));
  await setRefreshCookie(session);
  return ok(session);
});
