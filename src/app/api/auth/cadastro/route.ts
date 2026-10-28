import { HTTP_STATUS } from '@server/errors';
import { ok, parseBody, route } from '@server/http';
import { registerSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';

/** Cria o cadastro. O usuário fica `pending` até ser liberado no banco; não devolve sessão. */
export const POST = route(async (request) => {
  const input = await parseBody(request, registerSchema);
  return ok(await AuthService.register(input), HTTP_STATUS.created);
});
