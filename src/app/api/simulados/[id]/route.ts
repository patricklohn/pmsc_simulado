import { noContent, ok, parseBody, route } from '@server/http';
import { saveExamSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { ExamService } from '@server/services/exam';

interface iContext {
  params: Promise<{ id: string }>;
}

/** Em andamento: questões sem gabarito. Entregue: resultado e gabarito comentado. */
export const GET = route<iContext>(async (request, { params }) => {
  const user = await AuthService.requireUser(request);
  return ok(await ExamService.get(user.uuid, (await params).id));
});

/** Salva respostas, marcações e a questão atual durante a prova. */
export const PATCH = route<iContext>(async (request, { params }) => {
  const user = await AuthService.requireUser(request);
  const input = await parseBody(request, saveExamSchema);
  return ok(await ExamService.saveProgress(user.uuid, (await params).id, input));
});

/** Descarta o simulado em andamento. */
export const DELETE = route<iContext>(async (request, { params }) => {
  const user = await AuthService.requireUser(request);
  await ExamService.discard(user.uuid, (await params).id);
  return noContent();
});
