/** Matérias da prova objetiva (ids usados nos JSON de `src/data`). */
export type tSubjectId =
  | 'direito-constitucional'
  | 'direito-penal'
  | 'direito-processual-penal'
  | 'direito-penal-militar'
  | 'legislacao-especial'
  | 'legislacao-transito'
  | 'legislacao-institucional'
  | 'lingua-portuguesa'
  | 'informatica';

/** Áreas de conhecimento da Tabela 8.1. Zerar uma área reprova. */
export type tAreaId = 'direito' | 'legislacao' | 'comuns';

/** Tópico do conteúdo programático, com o material de estudo. */
export interface iTopic {
  id: string;
  titulo: string;
  maisCobrado: boolean;
  resumo: string;
  pontosChave: string[];
  pegadinhas: string[];
  referencias: string[];
}

export interface iStudyLink {
  titulo: string;
  url: string;
}

/** Matéria com o conteúdo do Anexo II e o material de estudo. */
export interface iSubject {
  id: tSubjectId;
  nome: string;
  area: tAreaId;
  questoesNaProva: number;
  conteudoEdital: string;
  visaoGeral: string;
  dicas: string[];
  fontesEstudo: iStudyLink[];
  topicos: iTopic[];
}
