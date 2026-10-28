import { buildFullExam, buildQuickExam, buildSubjectExam, pickQuestions, shuffle, timeLimitFor } from './exam-builder';

const DISTRIBUTION = [
  { subjectId: 'direito-constitucional', questions: 8 },
  { subjectId: 'direito-penal', questions: 6 },
  { subjectId: 'direito-processual-penal', questions: 6 },
  { subjectId: 'direito-penal-militar', questions: 6 },
  { subjectId: 'legislacao-especial', questions: 6 },
  { subjectId: 'legislacao-transito', questions: 5 },
  { subjectId: 'legislacao-institucional', questions: 10 },
  { subjectId: 'lingua-portuguesa', questions: 8 },
  { subjectId: 'informatica', questions: 5 },
];
const ORDER = DISTRIBUTION.map((item) => item.subjectId);

/** Banco falso com 12 questões por matéria. */
const POOL = ORDER.flatMap((subjectId) =>
  Array.from({ length: 12 }, (_, index) => ({ id: `${subjectId}-${index}`, subjectId }))
);

describe('montagem dos simulados', () => {
  it('prova completa segue a Tabela 8.1: 60 questões, 8/6/6/6/6/5/10/8/5, sem repetir', () => {
    const exam = buildFullExam(POOL, DISTRIBUTION);

    expect(exam).toHaveLength(60);
    expect(new Set(exam.map((question) => question.id)).size).toBe(60);
    for (const { subjectId, questions } of DISTRIBUTION) {
      expect(exam.filter((question) => question.subjectId === subjectId)).toHaveLength(questions);
    }
  });

  it('dá preferência às questões ainda não vistas', () => {
    const pool = POOL.filter((question) => question.subjectId === 'informatica');
    const seen = new Set(pool.slice(0, 10).map((question) => question.id));

    const picked = pickQuestions(pool, 2, { seenIds: seen });

    expect(picked.every((question) => !seen.has(question.id))).toBe(true);
  });

  it('simulado por matéria só traz a matéria escolhida e respeita o tamanho do banco', () => {
    const exam = buildSubjectExam(POOL, 'lingua-portuguesa', 30);

    expect(exam).toHaveLength(12);
    expect(exam.every((question) => question.subjectId === 'lingua-portuguesa')).toBe(true);
  });

  it('simulado rápido mistura matérias e as agrupa na ordem do caderno', () => {
    const exam = buildQuickExam(POOL, 20, ORDER);
    const positions = exam.map((question) => ORDER.indexOf(question.subjectId));

    expect(exam).toHaveLength(20);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('tempo: 4 h na completa, 4 min por questão nas outras', () => {
    expect(timeLimitFor('completo', 60)).toBe(4 * 3600);
    expect(timeLimitFor('rapido', 20)).toBe(20 * 240);
  });

  it('shuffle não altera a lista original', () => {
    const items = [1, 2, 3, 4];
    shuffle(items);
    expect(items).toEqual([1, 2, 3, 4]);
  });
});
