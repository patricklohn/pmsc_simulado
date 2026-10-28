import type { tAlternativeKey } from '@/types/question';
import type { tSubjectId } from '@/types/subject';
import { type iScoringContext, type iScoringQuestion, scoreExam } from './scoring';

const CONTEXT: iScoringContext = {
  areaOfSubject: {
    'direito-constitucional': 'direito',
    'legislacao-institucional': 'legislacao',
    'legislacao-transito': 'legislacao',
    'lingua-portuguesa': 'comuns',
    informatica: 'comuns',
  },
  subjectOrder: [
    'direito-constitucional',
    'legislacao-transito',
    'legislacao-institucional',
    'lingua-portuguesa',
    'informatica',
  ],
  areaOrder: ['direito', 'legislacao', 'comuns'],
};

const makeQuestion = (id: string, materia: tSubjectId, correta: tAlternativeKey = 'A') => ({ id, materia, correta });

const QUESTIONS = [
  makeQuestion('c1', 'direito-constitucional'),
  makeQuestion('c2', 'direito-constitucional'),
  makeQuestion('l1', 'legislacao-institucional'),
  makeQuestion('l2', 'legislacao-transito'),
  makeQuestion('p1', 'lingua-portuguesa'),
  makeQuestion('i1', 'informatica'),
];
const BY_ID = new Map<string, iScoringQuestion>(QUESTIONS.map((question) => [question.id, question]));
const IDS = QUESTIONS.map((question) => question.id);

describe('scoreExam (item 8.4 do edital)', () => {
  it('aprova com 50% ou mais e nenhuma área zerada', () => {
    const result = scoreExam({ questionIds: IDS, answers: { c1: 'A', l1: 'A', p1: 'A' } }, BY_ID, CONTEXT);

    expect(result.correct).toBe(3);
    expect(result.percent).toBe(50);
    expect(result.zeroedAreas).toEqual([]);
    expect(result.isApproved).toBe(true);
  });

  it('reprova com nota boa quando uma área fica zerada', () => {
    const result = scoreExam(
      { questionIds: IDS, answers: { c1: 'A', c2: 'A', l1: 'A', l2: 'A', p1: 'B', i1: 'C' } },
      BY_ID,
      CONTEXT
    );

    expect(result.percent).toBeCloseTo(66.7);
    expect(result.zeroedAreas).toEqual(['comuns']);
    expect(result.isApproved).toBe(false);
  });

  it('reprova abaixo de 50% e conta questão em branco como erro', () => {
    const result = scoreExam({ questionIds: IDS, answers: { c1: 'A', l1: 'A' } }, BY_ID, CONTEXT);

    expect(result.correct).toBe(2);
    expect(result.isApproved).toBe(false);
  });

  it('separa os acertos por matéria e por área, na ordem do edital', () => {
    const result = scoreExam({ questionIds: IDS, answers: { c1: 'A', c2: 'B' } }, BY_ID, CONTEXT);

    expect(result.bySubject[0]).toEqual({ subjectId: 'direito-constitucional', correct: 1, total: 2 });
    expect(result.byArea.map((area) => area.areaId)).toEqual(['direito', 'legislacao', 'comuns']);
    expect(result.byArea[1]).toEqual({ areaId: 'legislacao', correct: 0, total: 2 });
  });
});
