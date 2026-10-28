/** Questão candidata a entrar num simulado. */
export interface iCandidate {
  id: string;
  subjectId: string;
}

interface iPickOptions {
  /** Questões que já apareceram em simulados entregues: ficam por último, para variar os simulados. */
  seenIds?: ReadonlySet<string>;
  random?: () => number;
}

/** Tempo da prova completa: 5 h no dia, menos ~1 h reservada para a redação. */
export const FULL_EXAM_SECONDS = 4 * 60 * 60;
/** Ritmo de 4 minutos por questão nos simulados menores (mesma média da prova completa). */
export const SECONDS_PER_QUESTION = 4 * 60;
export const QUICK_EXAM_SIZE = 20;
export const MAX_EXAM_SIZE = 120;

/** Embaralha uma cópia (Fisher–Yates). `random` é injetável para os testes. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Sorteia `count` questões dando preferência às que ainda não foram vistas. */
export function pickQuestions<T extends iCandidate>(
  pool: T[],
  count: number,
  { seenIds, random }: iPickOptions = {}
): T[] {
  const shuffled = shuffle(pool, random);
  const unseen = shuffled.filter((question) => !seenIds?.has(question.id));
  const seen = shuffled.filter((question) => seenIds?.has(question.id));
  return [...unseen, ...seen].slice(0, count);
}

/** Prova completa: a distribuição da Tabela 8.1 (questões por matéria), na ordem das matérias do caderno. */
export function buildFullExam<T extends iCandidate>(
  pool: T[],
  distribution: { subjectId: string; questions: number }[],
  options: iPickOptions = {}
): T[] {
  return distribution.flatMap((item) =>
    pickQuestions(
      pool.filter((question) => question.subjectId === item.subjectId),
      item.questions,
      options
    )
  );
}

/** Prova de uma matéria só. */
export function buildSubjectExam<T extends iCandidate>(
  pool: T[],
  subjectId: string,
  count: number,
  options: iPickOptions = {}
): T[] {
  return pickQuestions(
    pool.filter((question) => question.subjectId === subjectId),
    count,
    options
  );
}

/** Prova rápida: questões misturadas de todas as matérias, agrupadas na ordem do caderno. */
export function buildQuickExam<T extends iCandidate>(
  pool: T[],
  count: number,
  subjectOrder: string[],
  options: iPickOptions = {}
): T[] {
  return pickQuestions(pool, count, options).sort(
    (a, b) => subjectOrder.indexOf(a.subjectId) - subjectOrder.indexOf(b.subjectId)
  );
}

/** Tempo limite em segundos. */
export function timeLimitFor(mode: 'completo' | 'materia' | 'rapido', questionCount: number): number {
  return mode === 'completo' ? FULL_EXAM_SECONDS : questionCount * SECONDS_PER_QUESTION;
}
