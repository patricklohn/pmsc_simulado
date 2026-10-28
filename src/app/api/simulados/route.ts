import { HTTP_STATUS } from '@server/errors';
import { noContent, ok, parseBody, route } from '@server/http';
import { createExamSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { ExamService } from '@server/services/exam';

/** Simulado em andamento e histórico. */
export const GET = route(async (request) => {
  const user = await AuthService.requireUser(request);
  return ok(await ExamService.overview(user.uuid));
});

/** Começa um simulado: a API sorteia as questões e devolve sem gabarito. */
export const POST = route(async (request) => {
  const user = await AuthService.requireUser(request);
  const input = await parseBody(request, createExamSchema);
  return ok(await ExamService.create(user.uuid, input), HTTP_STATUS.created);
});

/** Apaga o histórico de simulados entregues. */
export const DELETE = route(async (request) => {
  const user = await AuthService.requireUser(request);
  await ExamService.clearHistory(user.uuid);
  return noContent();
});
