/**
 * Gerado por `pnpm migrate:types` (kysely-codegen) e ajustado manualmente.
 * O codegen preserva os ajustes (enums, ColumnType) e só adiciona/remove campos.
 */

import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
export type { ColumnType, Insertable, Selectable, Updateable };

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

/** `numeric` volta como texto do `pg` (sem perder precisão). */
export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

/** Coluna `date`: volta como texto `AAAA-MM-DD` (ver `pool.ts`). */
export type DateText = ColumnType<string, string, string>;

/** Coluna `jsonb`: o `pg` devolve o valor já lido; na escrita vai o texto de `JSON.stringify`. */
export type JsonColumn<T> = ColumnType<T, string, string>;

/** Alternativas de uma questão. */
export type tAlternatives = Record<'A' | 'B' | 'C' | 'D' | 'E', string>;

/**
 * User
 */
export enum eUserStatus {
  pending = 'pending',
  active = 'active',
  blocked = 'blocked',
}

export enum eUserRole {
  student = 'student',
  admin = 'admin',
}

export interface iUser {
  uuid: Generated<string>;
  name: string;
  email: string;
  password_hash: string;
  role: Generated<eUserRole>;
  status: Generated<eUserStatus>;
  approved_at: Timestamp | null;
  last_login_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
}

export type tUserSelectable = Selectable<iUser>;

/**
 * Refresh token
 */
export interface iRefreshToken {
  uuid: Generated<string>;
  user_uuid: string;
  family_uuid: string;
  token_hash: string;
  expires_at: Timestamp;
  revoked_at: Timestamp | null;
  replaced_by_uuid: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export type tRefreshTokenSelectable = Selectable<iRefreshToken>;

/**
 * Conteúdo
 */
export interface iArea {
  id: string;
  name: string;
  position: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iSubject {
  id: string;
  area_id: string;
  name: string;
  exam_questions: Generated<number>;
  position: Generated<number>;
  edital_content: Generated<string>;
  overview: Generated<string>;
  tips: Generated<JsonColumn<string[]>>;
  study_links: Generated<JsonColumn<{ titulo: string; url: string }[]>>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iTopic {
  id: Generated<string>;
  subject_id: string;
  position: Generated<number>;
  title: string;
  is_hot: Generated<boolean>;
  summary: Generated<string>;
  key_points: Generated<JsonColumn<string[]>>;
  traps: Generated<JsonColumn<string[]>>;
  legal_refs: Generated<JsonColumn<string[]>>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export enum eDifficulty {
  facil = 'facil',
  media = 'media',
  dificil = 'dificil',
}

export interface iQuestion {
  id: Generated<string>;
  subject_id: string;
  topic_id: string | null;
  statement: string;
  alternatives: JsonColumn<tAlternatives>;
  correct_option: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: Generated<string>;
  source: Generated<string>;
  difficulty: Generated<eDifficulty>;
  is_active: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

/**
 * Edital
 */
export interface iContest {
  id: Generated<number>;
  title: string;
  notice_code: string;
  organ: string;
  board: string;
  board_site: string;
  role: string;
  role_code: string;
  vacancies: number;
  salary: Numeric;
  food_allowance: Numeric;
  fee: Numeric;
  education: string;
  validity: string;
  exam_date: DateText;
  exam_duration_hours: number;
  vacancy_notes: Generated<JsonColumn<string[]>>;
  exam_cities: Generated<JsonColumn<string[]>>;
  requirements: Generated<JsonColumn<string[]>>;
  phases: Generated<JsonColumn<{ fase: string; titulo: string; carater: string; descricao: string }[]>>;
  objective_rules: JsonColumn<{
    totalQuestoes: number;
    alternativas: number;
    valorQuestao: number;
    criterioAprovacao: string;
    observacao: string;
  }>;
  essay_rules: JsonColumn<{ pontos: number; minimo: number; tipo: string; formula: string; corrigidaAte: string }>;
  final_score: JsonColumn<{ formula: string; descricao: string }>;
  taf_info: JsonColumn<{ local: string; observacoes: string[] }>;
  schedule_notice: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iScheduleGroup {
  id: string;
  title: string;
  position: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iScheduleEvent {
  id: Generated<string>;
  group_id: string;
  title: string;
  starts_on: DateText;
  ends_on: DateText | null;
  is_highlight: Generated<boolean>;
  position: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iTafTest {
  id: string;
  name: string;
  audience: string;
  description: string;
  unit: string;
  score_table: Generated<JsonColumn<{ masculino?: string; feminino?: string; pontos: string }[]>>;
  position: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

/**
 * Redação
 */
export interface iEssayGuide {
  id: Generated<number>;
  guidelines: Generated<JsonColumn<string[]>>;
  criteria: Generated<JsonColumn<{ id: string; titulo: string; descricao: string }[]>>;
  tips: Generated<JsonColumn<string[]>>;
  structure: Generated<JsonColumn<{ parte: string; descricao: string }[]>>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface iEssayTheme {
  id: Generated<string>;
  title: string;
  axis: string;
  proposal: string;
  motivating_texts: Generated<JsonColumn<string[]>>;
  position: Generated<number>;
  is_active: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

/**
 * Estudo do usuário
 */
export interface iStudyTopic {
  user_uuid: string;
  topic_id: string;
  created_at: Generated<Timestamp>;
}

export enum eExamMode {
  completo = 'completo',
  materia = 'materia',
  rapido = 'rapido',
}

export enum eExamStatus {
  in_progress = 'in_progress',
  finished = 'finished',
}

export interface iScoreRow {
  correct: number;
  total: number;
}

export interface iExam {
  uuid: Generated<string>;
  user_uuid: string;
  mode: eExamMode;
  subject_id: string | null;
  status: Generated<eExamStatus>;
  question_ids: JsonColumn<string[]>;
  answers: Generated<JsonColumn<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>>;
  flagged: Generated<JsonColumn<string[]>>;
  current_index: Generated<number>;
  time_limit: number;
  started_at: Generated<Timestamp>;
  deadline_at: Timestamp;
  finished_at: Timestamp | null;
  correct: number | null;
  total: number | null;
  percent: Numeric | null;
  is_approved: boolean | null;
  by_subject: JsonColumn<(iScoreRow & { subjectId: string })[]> | null;
  by_area: JsonColumn<(iScoreRow & { areaId: string })[]> | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export type tExamSelectable = Selectable<iExam>;

export interface DB {
  area: iArea;
  contest: iContest;
  essay_guide: iEssayGuide;
  essay_theme: iEssayTheme;
  exam: iExam;
  question: iQuestion;
  refresh_token: iRefreshToken;
  schedule_event: iScheduleEvent;
  schedule_group: iScheduleGroup;
  study_topic: iStudyTopic;
  subject: iSubject;
  taf_test: iTafTest;
  topic: iTopic;
  user: iUser;
}
