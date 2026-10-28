import { useSyncExternalStore } from 'react';
import { BREAKPOINTS, type tBreakpoint } from '@styles/breakpoints';

/**
 * Acompanha uma media query.
 *
 * @param query - media query CSS, ex.: `(prefers-color-scheme: dark)`
 * @returns `true` enquanto a query casar
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * `true` a partir da largura do breakpoint (mobile first).
 *
 * @example
 * const isDesktop = useBreakpoint('md'); // tabela a partir de 768px, cards abaixo
 */
export function useBreakpoint(breakpoint: tBreakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}
