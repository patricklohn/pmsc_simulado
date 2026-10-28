import 'server-only';
import { getDb } from '@/database/db/kysely';
import { HTTP_STATUS, ServiceError } from '../errors';

/** Tópicos marcados como estudados. */
export class StudyService {
  static async doneTopics(userUuid: string): Promise<string[]> {
    const rows = await getDb().selectFrom('study_topic').select('topic_id').where('user_uuid', '=', userUuid).execute();
    return rows.map((row) => row.topic_id);
  }

  /**
   * Marca ou desmarca um tópico.
   *
   * @throws {ServiceError} 404 `TOPIC_NOT_FOUND`
   */
  static async setTopic(userUuid: string, topicId: string, isDone: boolean): Promise<void> {
    const db = getDb();
    if (!isDone) {
      await db.deleteFrom('study_topic').where('user_uuid', '=', userUuid).where('topic_id', '=', topicId).execute();
      return;
    }
    const topic = await db.selectFrom('topic').select('id').where('id', '=', topicId).executeTakeFirst();
    if (!topic) {
      throw new ServiceError(HTTP_STATUS.notFound, 'TOPIC_NOT_FOUND', 'Tópico não encontrado.');
    }
    await db
      .insertInto('study_topic')
      .values({ user_uuid: userUuid, topic_id: topicId })
      .onConflict((oc) => oc.columns(['user_uuid', 'topic_id']).doNothing())
      .execute();
  }
}
