import type { tAlternativeKey, tDifficulty } from './question';
import type { tAreaId, tSubjectId } from './subject';

/** Tipos de simulado. */
export type tExamMode = 'completo' | 'materia' | 'rapido';

export type tExamStatus = 'in_progress' | 'finished';

/** Simulado como a API devolve. */
export interface iExam {
  id: string;
  mode: tExamMode;
  status: tExamStatus;
  /** Só no modo `materia`. */
  subjectId?: tSubjectId;
  questionIds: string[];
  answers: Record<string, tAlternativeKey>;
  /** Questões marcadas para revisar. */
  flagged: string[];
  currentIndex: number;
  startedAt: string;
  deadlineAt: string;
  finishedAt?: string;
  /** Tempo limite em segundos. */
  timeLimit: number;
}

export interface iSubjectScore {
  subjectId: tSubjectId;
  correct: number;
  total: number;
}

export interface iAreaScore {
  areaId: tAreaId;
  correct: number;
  total: number;
}

/** Resultado calculado pela API. */
export interface iExamResult {
  correct: number;
  total: number;
  /** 0 a 100. */
  percent: number;
  bySubject: iSubjectScore[];
  byArea: iAreaScore[];
  /** Regra do item 8.4: ≥ 50% e nenhuma área zerada. */
  isApproved: boolean;
  zeroedAreas: tAreaId[];
}

/** Questão durante a prova: sem gabarito, comentário nem fonte. */
export interface iExamQuestion {
  id: string;
  materia: tSubjectId;
  topico: string | null;
  enunciado: string;
  alternativas: Record<tAlternativeKey, string>;
  dificuldade: tDifficulty;
}

/** Prova em andamento com as questões. */
export interface iExamSession {
  exam: iExam;
  questions: iExamQuestion[];
}

/** Prova entregue: resultado e questões com gabarito comentado. */
export interface iExamReview {
  exam: iExam;
  result: iExamResult;
  questions: (iExamQuestion & { correta: tAlternativeKey; comentario: string; fonte: string })[];
}

/** Resumo no histórico. */
export interface iExamHistoryEntry {
  id: string;
  mode: tExamMode;
  subjectId?: tSubjectId;
  finishedAt: string;
  durationSeconds: number;
  correct: number;
  total: number;
  percent: number;
  isApproved: boolean;
  bySubject: iSubjectScore[];
}

/** Simulado em andamento, resumido. */
export interface iCurrentExam {
  id: string;
  mode: tExamMode;
  subjectId?: tSubjectId;
  answered: number;
  total: number;
  deadlineAt: string;
}

/** `GET /api/simulados`. */
export interface iExamOverview {
  current: iCurrentExam | null;
  history: iExamHistoryEntry[];
}

/** `POST /api/simulados`. */
export interface iCreateExamInput {
  mode: tExamMode;
  subjectId?: string;
  /** Quantidade nos modos `materia` e `rapido`. */
  count?: number;
  /** Prioriza questões que ainda não apareceram em simulados entregues. */
  shouldPreferUnseen?: boolean;
  /** Descarta o simulado em andamento, se houver. */
  shouldReplaceCurrent?: boolean;
}
