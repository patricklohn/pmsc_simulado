import { ok, route } from '@server/http';
import { AuthService } from '@server/services/auth';
import { ContentService } from '@server/services/content';

/** Todo o conteúdo do app (edital, cronograma, matérias, tópicos, redação e contagem de questões). */
export const GET = route(async (request) => {
  await AuthService.requireUser(request);
  return ok(await ContentService.load());
});
