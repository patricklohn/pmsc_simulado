import 'server-only';
import { getDb } from '@/database/db/kysely';
import { eExamMode, eExamStatus, type tExamSelectable } from '@/database/db/model';
import type {
  iCreateExamInput,
  iExam,
  iExamHistoryEntry,
  iExamOverview,
  iExamQuestion,
  iExamReview,
  iExamSession,
} from '@/types/exam';
import type { tAlternativeKey, tDifficulty } from '@/types/question';
import type { tSubjectId } from '@/types/subject';
import { HTTP_STATUS, ServiceError } from '../errors';
import { QUICK_EXAM_SIZE, buildFullExam, buildQuickExam, buildSubjectExam, timeLimitFor } from '../rules/exam-builder';
import { scoreExam } from '../rules/scoring';
import { ContentService } from './content';

/** Tolerância depois do prazo para a última resposta chegar (rede lenta). */
const SAVE_GRACE_MS = 60_000;

const notFound = () => new ServiceError(HTTP_STATUS.notFound, 'EXAM_NOT_FOUND', 'Simulado não encontrado.');

function toExam(row: tExamSelectable): iExam {
  return {
    id: row.uuid,
    mode: row.mode,
    status: row.status,
    subjectId: (row.subject_id as tSubjectId | null) ?? undefined,
    questionIds: row.question_ids,
    answers: row.answers,
    flagged: row.flagged,
    currentIndex: row.current_index,
    startedAt: row.started_at.toISOString(),
    deadlineAt: row.deadline_at.toISOString(),
    finishedAt: row.finished_at?.toISOString(),
    timeLimit: row.time_limit,
  };
}

function toHistoryEntry(row: tExamSelectable): iExamHistoryEntry {
  const finishedAt = row.finished_at ?? row.deadline_at;
  return {
    id: row.uuid,
    mode: row.mode,
    subjectId: (row.subject_id as tSubjectId | null) ?? undefined,
    finishedAt: finishedAt.toISOString(),
    durationSeconds: Math.round((finishedAt.getTime() - row.started_at.getTime()) / 1000),
    correct: row.correct ?? 0,
    total: row.total ?? 0,
    percent: Number(row.percent ?? 0),
    isApproved: row.is_approved ?? false,
    bySubject: (row.by_subject ?? []) as iExamHistoryEntry['bySubject'],
  };
}

/** Questões do simulado na ordem da prova (inclusive as desativadas depois, para o gabarito antigo). */
async function loadQuestions(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await getDb()
    .selectFrom('question')
    .select([
      'id',
      'subject_id',
      'topic_id',
      'statement',
      'alternatives',
      'difficulty',
      'correct_option',
      'explanation',
      'source',
    ])
    .where('id', 'in', ids)
    .execute();
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.flatMap((id) => {
    const row = byId.get(id);
    return row ? [row] : [];
  });
}

type tQuestionRow = Awaited<ReturnType<typeof loadQuestions>>[number];

const toPublicQuestion = (row: tQuestionRow): iExamQuestion => ({
  id: row.id,
  materia: row.subject_id as tSubjectId,
  topico: row.topic_id,
  enunciado: row.statement,
  alternativas: row.alternatives,
  dificuldade: row.difficulty as tDifficulty,
});

/** Simulados: a API sorteia as questões, guarda as respostas durante a prova e corrige na entrega. */
export class ExamService {
  /** Simulado em andamento e histórico. Prova com o prazo vencido é entregue antes. */
  static async overview(userUuid: string): Promise<iExamOverview> {
    await this.finishExpired(userUuid);
    const rows = await getDb()
      .selectFrom('exam')
      .selectAll()
      .where('user_uuid', '=', userUuid)
      .orderBy('started_at', 'desc')
      .limit(101)
      .execute();
    const current = rows.find((row) => row.status === eExamStatus.in_progress);
    return {
      current: current
        ? {
            id: current.uuid,
            mode: current.mode,
            subjectId: (current.subject_id as tSubjectId | null) ?? undefined,
            answered: Object.keys(current.answers).length,
            total: current.question_ids.length,
            deadlineAt: current.deadline_at.toISOString(),
          }
        : null,
      history: rows
        .filter((row) => row.status === eExamStatus.finished)
        .sort((a, b) => (b.finished_at?.getTime() ?? 0) - (a.finished_at?.getTime() ?? 0))
        .slice(0, 100)
        .map(toHistoryEntry),
    };
  }

  /**
   * Monta um simulado novo. Com `shouldPreferUnseen`, as questões de simulados entregues ficam por último.
   *
   * @throws {ServiceError} 409 `EXAM_IN_PROGRESS` · 422 `NOT_ENOUGH_QUESTIONS`
   */
  static async create(userUuid: string, input: iCreateExamInput): Promise<iExamSession> {
    const db = getDb();
    await this.finishExpired(userUuid);
    const current = await db
      .selectFrom('exam')
      .select('uuid')
      .where('user_uuid', '=', userUuid)
      .where('status', '=', eExamStatus.in_progress)
      .executeTakeFirst();
    if (current && !input.shouldReplaceCurrent) {
      throw new ServiceError(HTTP_STATUS.conflict, 'EXAM_IN_PROGRESS', 'Você já tem um simulado em andamento.');
    }

    const [pool, seenRows, content] = await Promise.all([
      db.selectFrom('question').select(['id', 'subject_id as subjectId']).where('is_active', '=', true).execute(),
      input.shouldPreferUnseen
        ? db
            .selectFrom('exam')
            .select('question_ids')
            .where('user_uuid', '=', userUuid)
            .where('status', '=', eExamStatus.finished)
            .execute()
        : Promise.resolve([]),
      ContentService.load(),
    ]);
    const seenIds = new Set(seenRows.flatMap((row) => row.question_ids));
    const subjectOrder = content.notice.provaObjetiva.distribuicao.map((item) => item.materia);

    const picked =
      input.mode === 'completo'
        ? buildFullExam(
            pool,
            content.notice.provaObjetiva.distribuicao.map((item) => ({
              subjectId: item.materia,
              questions: item.questoes,
            })),
            { seenIds }
          )
        : input.mode === 'rapido'
          ? buildQuickExam(pool, input.count ?? QUICK_EXAM_SIZE, subjectOrder, { seenIds })
          : buildSubjectExam(pool, input.subjectId ?? '', input.count ?? QUICK_EXAM_SIZE, { seenIds });

    if (picked.length === 0) {
      throw new ServiceError(HTTP_STATUS.unprocessable, 'NOT_ENOUGH_QUESTIONS', 'Não há questões para este simulado.');
    }

    const timeLimit = timeLimitFor(input.mode, picked.length);
    const now = new Date();
    const row = await db.transaction().execute(async (trx) => {
      if (current) {
        await trx.deleteFrom('exam').where('uuid', '=', current.uuid).execute();
      }
      return trx
        .insertInto('exam')
        .values({
          user_uuid: userUuid,
          mode: input.mode as eExamMode,
          subject_id: input.mode === 'materia' ? (input.subjectId ?? null) : null,
          question_ids: JSON.stringify(picked.map((question) => question.id)),
          time_limit: timeLimit,
          started_at: now,
          deadline_at: new Date(now.getTime() + timeLimit * 1000),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });

    return { exam: toExam(row), questions: (await loadQuestions(row.question_ids)).map(toPublicQuestion) };
  }

  /** Simulado do usuário: em andamento vem sem gabarito; entregue vem com resultado e gabarito comentado. */
  static async get(userUuid: string, examId: string): Promise<iExamSession | iExamReview> {
    let row = await this.findOwn(userUuid, examId);
    if (row.status === eExamStatus.in_progress && this.isExpired(row)) {
      row = await this.finishRow(row);
    }
    if (row.status === eExamStatus.finished) {
      return this.review(row);
    }
    return { exam: toExam(row), questions: (await loadQuestions(row.question_ids)).map(toPublicQuestion) };
  }

  /** Último simulado entregue (tela de resultado sem id). */
  static async lastReview(userUuid: string): Promise<iExamReview | null> {
    const row = await getDb()
      .selectFrom('exam')
      .selectAll()
      .where('user_uuid', '=', userUuid)
      .where('status', '=', eExamStatus.finished)
      .orderBy('finished_at', 'desc')
      .limit(1)
      .executeTakeFirst();
    return row ? this.review(row) : null;
  }

  /**
   * Salva respostas, marcações e a questão atual durante a prova.
   *
   * @throws {ServiceError} 409 `EXAM_FINISHED` · 422 `INVALID_ANSWERS`
   */
  static async saveProgress(
    userUuid: string,
    examId: string,
    input: { answers?: Record<string, tAlternativeKey>; flagged?: string[]; currentIndex?: number }
  ): Promise<{ saved: true }> {
    const row = await this.findOwn(userUuid, examId);
    if (row.status !== eExamStatus.in_progress || Date.now() > row.deadline_at.getTime() + SAVE_GRACE_MS) {
      throw new ServiceError(HTTP_STATUS.conflict, 'EXAM_FINISHED', 'Este simulado já foi entregue.');
    }
    this.assertBelongs(row, input.answers, input.flagged);
    await getDb()
      .updateTable('exam')
      .set({
        ...(input.answers ? { answers: JSON.stringify(input.answers) } : {}),
        ...(input.flagged ? { flagged: JSON.stringify(input.flagged) } : {}),
        ...(input.currentIndex !== undefined
          ? { current_index: Math.min(Math.max(0, input.currentIndex), row.question_ids.length - 1) }
          : {}),
      })
      .where('uuid', '=', row.uuid)
      .execute();
    return { saved: true };
  }

  /**
   * Entrega a prova (com as últimas respostas, se vierem) e calcula a nota.
   *
   * @throws {ServiceError} 422 `INVALID_ANSWERS`
   */
  static async finish(
    userUuid: string,
    examId: string,
    input: { answers?: Record<string, tAlternativeKey>; flagged?: string[] }
  ): Promise<iExamReview> {
    const row = await this.findOwn(userUuid, examId);
    if (row.status === eExamStatus.finished) {
      return this.review(row);
    }
    // Respostas enviadas depois do prazo (+ tolerância) não valem: fica o que estava salvo
    const isOnTime = Date.now() <= row.deadline_at.getTime() + SAVE_GRACE_MS;
    if (isOnTime) this.assertBelongs(row, input.answers, input.flagged);
    const answers = isOnTime && input.answers ? input.answers : row.answers;
    const flagged = isOnTime && input.flagged ? input.flagged : row.flagged;
    return this.review(await this.finishRow({ ...row, answers, flagged }));
  }

  /** Descarta o simulado em andamento (não entra no histórico). */
  static async discard(userUuid: string, examId: string): Promise<void> {
    await getDb()
      .deleteFrom('exam')
      .where('uuid', '=', examId)
      .where('user_uuid', '=', userUuid)
      .where('status', '=', eExamStatus.in_progress)
      .execute();
  }

  /** Apaga o histórico de simulados entregues. */
  static async clearHistory(userUuid: string): Promise<void> {
    await getDb()
      .deleteFrom('exam')
      .where('user_uuid', '=', userUuid)
      .where('status', '=', eExamStatus.finished)
      .execute();
  }

  private static isExpired(row: tExamSelectable) {
    return Date.now() > row.deadline_at.getTime() + SAVE_GRACE_MS;
  }

  private static async findOwn(userUuid: string, examId: string): Promise<tExamSelectable> {
    // uuid inválido derrubaria a query: trata como inexistente
    if (!/^[0-9a-f-]{36}$/i.test(examId)) throw notFound();
    const row = await getDb()
      .selectFrom('exam')
      .selectAll()
      .where('uuid', '=', examId)
      .where('user_uuid', '=', userUuid)
      .executeTakeFirst();
    if (!row) throw notFound();
    return row;
  }

  /** Respostas e marcações só de questões da prova. */
  private static assertBelongs(row: tExamSelectable, answers?: Record<string, string>, flagged?: string[]) {
    const ids = new Set(row.question_ids);
    const isValid = Object.keys(answers ?? {}).every((id) => ids.has(id)) && (flagged ?? []).every((id) => ids.has(id));
    if (!isValid) {
      throw new ServiceError(HTTP_STATUS.unprocessable, 'INVALID_ANSWERS', 'Respostas de questões fora da prova.');
    }
  }

  private static async finishExpired(userUuid: string) {
    const expired = await getDb()
      .selectFrom('exam')
      .selectAll()
      .where('user_uuid', '=', userUuid)
      .where('status', '=', eExamStatus.in_progress)
      .where('deadline_at', '<', new Date(Date.now() - SAVE_GRACE_MS))
      .execute();
    for (const row of expired) await this.finishRow(row);
  }

  /** Corrige e grava o resultado. A correção usa o gabarito do banco, nunca o que vem do app. */
  private static async finishRow(row: tExamSelectable): Promise<tExamSelectable> {
    const [questions, context] = await Promise.all([loadQuestions(row.question_ids), ContentService.scoringContext()]);
    const result = scoreExam(
      { questionIds: row.question_ids, answers: row.answers },
      new Map(questions.map((q) => [q.id, { materia: q.subject_id as tSubjectId, correta: q.correct_option }])),
      context
    );
    const finishedAt = new Date(Math.min(Date.now(), row.deadline_at.getTime()));
    return getDb()
      .updateTable('exam')
      .set({
        status: eExamStatus.finished,
        answers: JSON.stringify(row.answers),
        flagged: JSON.stringify(row.flagged),
        finished_at: finishedAt,
        correct: result.correct,
        total: result.total,
        percent: result.percent,
        is_approved: result.isApproved,
        by_subject: JSON.stringify(result.bySubject),
        by_area: JSON.stringify(result.byArea),
      })
      .where('uuid', '=', row.uuid)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  private static async review(row: tExamSelectable): Promise<iExamReview> {
    const [questions, context] = await Promise.all([loadQuestions(row.question_ids), ContentService.scoringContext()]);
    const result = scoreExam(
      { questionIds: row.question_ids, answers: row.answers },
      new Map(questions.map((q) => [q.id, { materia: q.subject_id as tSubjectId, correta: q.correct_option }])),
      context
    );
    return {
      exam: toExam(row),
      result,
      questions: questions.map((q) => ({
        ...toPublicQuestion(q),
        correta: q.correct_option,
        comentario: q.explanation,
        fonte: q.source,
      })),
    };
  }
}
