/** Dados da redação (`src/data/redacao.json`). */
export interface iEssayTheme {
  id: string;
  titulo: string;
  eixo: string;
  proposta: string;
  textosMotivadores: string[];
}

export interface iEssayCriterion {
  id: string;
  titulo: string;
  descricao: string;
}

export interface iEssayData {
  orientacoes: string[];
  criterios: iEssayCriterion[];
  temas: iEssayTheme[];
  dicas: string[];
  estrutura: { parte: string; descricao: string }[];
}
