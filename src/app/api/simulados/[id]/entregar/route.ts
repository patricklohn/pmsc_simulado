import { ok, parseBody, route } from '@server/http';
import { finishExamSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { ExamService } from '@server/services/exam';

interface iContext {
  params: Promise<{ id: string }>;
}

/** Entrega a prova e devolve o resultado com o gabarito comentado. A nota é calculada aqui. */
export const POST = route<iContext>(async (request, { params }) => {
  const user = await AuthService.requireUser(request);
  const input = await parseBody(request, finishExamSchema);
  return ok(await ExamService.finish(user.uuid, (await params).id, input));
});
