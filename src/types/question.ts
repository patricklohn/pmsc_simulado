import type { tSubjectId } from './subject';

export type tAlternativeKey = 'A' | 'B' | 'C' | 'D' | 'E';

export type tDifficulty = 'facil' | 'media' | 'dificil';

/** Questão de múltipla escolha no formato AOCP (5 alternativas, uma correta). */
export interface iQuestion {
  id: string;
  materia: tSubjectId;
  topico: string;
  enunciado: string;
  alternativas: Record<tAlternativeKey, string>;
  correta: tAlternativeKey;
  comentario: string;
  fonte: string;
  dificuldade: tDifficulty;
}
