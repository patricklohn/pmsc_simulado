import type { iExamResult } from '@/types/exam';
import type { tAlternativeKey } from '@/types/question';
import type { tAreaId, tSubjectId } from '@/types/subject';

/** Nota mínima da objetiva: 50% dos pontos (item 8.4). */
export const PASSING_PERCENT = 50;

/** O que a correção precisa saber de cada questão. */
export interface iScoringQuestion {
  materia: tSubjectId;
  correta: tAlternativeKey;
}

/** Ordem e áreas das matérias, vindas do banco. */
export interface iScoringContext {
  areaOfSubject: Record<string, tAreaId>;
  subjectOrder: string[];
  areaOrder: string[];
}

/**
 * Corrige a prova. Aprovação segue o item 8.4 do edital: pelo menos 50% de acerto e nenhuma área de
 * conhecimento zerada (só conta área que tinha questão na prova).
 */
export function scoreExam(
  exam: { questionIds: string[]; answers: Record<string, tAlternativeKey> },
  questionsById: Map<string, iScoringQuestion>,
  context: iScoringContext
): iExamResult {
  const subjectTotals = new Map<tSubjectId, { correct: number; total: number }>();
  const areaTotals = new Map<tAreaId, { correct: number; total: number }>();
  let correct = 0;

  for (const id of exam.questionIds) {
    const question = questionsById.get(id);
    if (!question) continue;
    const isCorrect = exam.answers[id] === question.correta;
    if (isCorrect) correct += 1;

    const subject = subjectTotals.get(question.materia) ?? { correct: 0, total: 0 };
    subject.total += 1;
    if (isCorrect) subject.correct += 1;
    subjectTotals.set(question.materia, subject);

    const areaId = context.areaOfSubject[question.materia];
    const area = areaTotals.get(areaId) ?? { correct: 0, total: 0 };
    area.total += 1;
    if (isCorrect) area.correct += 1;
    areaTotals.set(areaId, area);
  }

  const total = [...subjectTotals.values()].reduce((sum, item) => sum + item.total, 0);
  const percent = total === 0 ? 0 : Math.round((correct / total) * 1000) / 10;
  const bySubject = [...subjectTotals.entries()]
    .map(([subjectId, value]) => ({ subjectId, ...value }))
    .sort((a, b) => context.subjectOrder.indexOf(a.subjectId) - context.subjectOrder.indexOf(b.subjectId));
  const byArea = [...areaTotals.entries()]
    .map(([areaId, value]) => ({ areaId, ...value }))
    .sort((a, b) => context.areaOrder.indexOf(a.areaId) - context.areaOrder.indexOf(b.areaId));
  const zeroedAreas = byArea.filter((area) => area.correct === 0).map((area) => area.areaId);

  return {
    correct,
    total,
    percent,
    bySubject,
    byArea,
    zeroedAreas,
    isApproved: total > 0 && percent >= PASSING_PERCENT && zeroedAreas.length === 0,
  };
}
