/** Limites de linhas da folha definitiva (item 11.7). */
export const ESSAY_MIN_LINES = 20;
export const ESSAY_MAX_LINES = 30;
/** Desconto por linha que falta para o mínimo (item 11.5, g). */
export const MISSING_LINE_PENALTY = 0.2;
/** Média de caracteres numa linha manuscrita da folha de redação (estimativa). */
export const CHARS_PER_LINE = 70;

/** Estima quantas linhas o texto ocupa na folha, quebrando por palavra a cada `CHARS_PER_LINE` caracteres. */
export function estimateLines(text: string, charsPerLine = CHARS_PER_LINE): number {
  return text
    .split('\n')
    .filter((paragraph) => paragraph.trim().length > 0)
    .reduce((total, paragraph) => {
      let lines = 1;
      let current = 0;
      for (const word of paragraph.trim().split(/\s+/)) {
        const size = current === 0 ? word.length : current + 1 + word.length;
        if (size > charsPerLine && current > 0) {
          lines += 1;
          current = word.length;
        } else {
          current = size;
        }
      }
      return total + lines;
    }, 0);
}

interface iEssayScoreInput {
  /** Nota de conteúdo (NC), de 0 a 20. */
  contentScore: number;
  /** Número de erros de língua (NE). */
  errors: number;
  /** Total de linhas escritas (TL). */
  lines: number;
}

/**
 * Nota da redação pelo item 11.5: NPR = NC − (NE ÷ TL), menos 0,20 por linha abaixo do mínimo, nunca negativa.
 * Linhas além do máximo não contam.
 */
export function estimateEssayScore({ contentScore, errors, lines }: iEssayScoreInput): number {
  const counted = Math.min(lines, ESSAY_MAX_LINES);
  if (counted <= 0) return 0;
  const missing = Math.max(0, ESSAY_MIN_LINES - counted);
  const score = contentScore - errors / counted - missing * MISSING_LINE_PENALTY;
  return Math.max(0, Math.round(score * 100) / 100);
}
