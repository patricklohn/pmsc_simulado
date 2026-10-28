import { ok, parseBody, route } from '@server/http';
import { studyTopicSchema } from '@server/schemas';
import { AuthService } from '@server/services/auth';
import { StudyService } from '@server/services/study';

/** Tópicos estudados. */
export const GET = route(async (request) => {
  const user = await AuthService.requireUser(request);
  return ok({ doneTopics: await StudyService.doneTopics(user.uuid) });
});

/** Marca ou desmarca um tópico. */
export const POST = route(async (request) => {
  const user = await AuthService.requireUser(request);
  const { topicId, isDone } = await parseBody(request, studyTopicSchema);
  await StudyService.setTopic(user.uuid, topicId, isDone);
  return ok({ topicId, isDone });
});
