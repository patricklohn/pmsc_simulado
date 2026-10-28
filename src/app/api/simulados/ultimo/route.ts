import { ok, route } from '@server/http';
import { AuthService } from '@server/services/auth';
import { ExamService } from '@server/services/exam';

/** Resultado do último simulado entregue (ou `null`). */
export const GET = route(async (request) => {
  const user = await AuthService.requireUser(request);
  return ok(await ExamService.lastReview(user.uuid));
});
