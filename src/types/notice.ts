import type { tAreaId, tSubjectId } from './subject';

export interface iScheduleEvent {
  id: string;
  titulo: string;
  /** Data ISO (AAAA-MM-DD). */
  inicio: string;
  fim?: string;
  destaque: boolean;
}

export interface iScheduleGroup {
  id: string;
  titulo: string;
  eventos: iScheduleEvent[];
}

export interface iSchedule {
  aviso: string;
  grupos: iScheduleGroup[];
}

export interface iPhase {
  fase: string;
  titulo: string;
  carater: string;
  descricao: string;
}

export interface iTafRow {
  masculino?: string;
  feminino?: string;
  pontos: string;
}

export interface iTafTest {
  id: string;
  nome: string;
  publico: string;
  descricao: string;
  unidade: string;
  tabela: iTafRow[];
}

export interface iArea {
  id: tAreaId;
  nome: string;
  materias: tSubjectId[];
}

/** Dados do edital (`src/data/edital.json`). */
export interface iNotice {
  titulo: string;
  edital: string;
  orgao: string;
  banca: string;
  siteBanca: string;
  cargo: string;
  codigoCargo: string;
  vagas: number;
  remuneracao: number;
  auxilioAlimentacao: number;
  taxa: number;
  escolaridade: string;
  validade: string;
  dataProva: string;
  duracaoProvaHoras: number;
  observacoesVagas: string[];
  cidadesProva: string[];
  requisitos: string[];
  fases: iPhase[];
  provaObjetiva: {
    totalQuestoes: number;
    alternativas: number;
    valorQuestao: number;
    criterioAprovacao: string;
    observacao: string;
    areas: iArea[];
    distribuicao: { materia: tSubjectId; questoes: number }[];
  };
  redacao: { pontos: number; minimo: number; tipo: string; formula: string; corrigidaAte: string };
  notaFinal: { formula: string; descricao: string };
  taf: { local: string; observacoes: string[]; testes: iTafTest[] };
}
