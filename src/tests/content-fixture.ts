import { loadContentFiles } from '@/database/seeds/content-files';
import type { iContent } from '@/types/content';

/** Conteúdo real do seed, no formato do `GET /api/conteudo`, para os testes de tela. */
function buildTestContent(): iContent {
  const { notice, schedule, subjects, essay, questions } = loadContentFiles();
  const bySubject: Record<string, number> = {};
  const byTopic: Record<string, number> = {};
  for (const question of questions) {
    bySubject[question.materia] = (bySubject[question.materia] ?? 0) + 1;
    byTopic[question.topico] = (byTopic[question.topico] ?? 0) + 1;
  }
  return { notice, schedule, subjects, essay, questionCounts: { total: questions.length, bySubject, byTopic } };
}

export const TEST_CONTENT = buildTestContent();

/** Questões do seed (para montar respostas falsas da API). */
export const TEST_QUESTIONS = loadContentFiles().questions;
