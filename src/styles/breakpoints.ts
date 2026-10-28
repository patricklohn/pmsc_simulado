/**
 * Larguras mínimas (px) de cada faixa. Mobile first: o CSS base é o do celular e as faixas ampliam.
 * - base: até 767px (celular)
 * - md: a partir de 768px (tablet)
 * - lg: a partir de 1024px (desktop)
 */
export const BREAKPOINTS = {
  md: 768,
  lg: 1024,
} as const;

export type tBreakpoint = keyof typeof BREAKPOINTS;

/**
 * Media queries prontas para usar no styled-components.
 *
 * @example
 * const Grid = styled.div`
 *   display: grid;
 *   ${media.md} { grid-template-columns: 1fr 1fr; }
 * `;
 */
export const media = {
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
} as const;
