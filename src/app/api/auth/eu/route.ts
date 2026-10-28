import { ok, route } from '@server/http';
import { AuthService } from '@server/services/auth';

/** Usuário autenticado. */
export const GET = route(async (request) => ok(await AuthService.requireUser(request)));
