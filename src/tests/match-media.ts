/** Estado simulado das media queries no jsdom (que não implementa `matchMedia`). */
let viewportWidth = 375;
let isDarkScheme = false;
const listeners = new Set<() => void>();

const matches = (query: string) => {
  const minWidth = /min-width:\s*(\d+)px/.exec(query);
  if (minWidth) {
    return viewportWidth >= Number(minWidth[1]);
  }
  if (query.includes('prefers-color-scheme: dark')) {
    return isDarkScheme;
  }
  return false;
};

/** Instala o `matchMedia` simulado com tela de celular (375px) e tema claro. */
export function resetMatchMedia() {
  viewportWidth = 375;
  isDarkScheme = false;
  listeners.clear();

  window.matchMedia = (query: string) =>
    ({
      get matches() {
        return matches(query);
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => true,
    }) as unknown as MediaQueryList;
}

/** Muda a largura simulada da tela e avisa os componentes. */
export function setViewportWidth(width: number) {
  viewportWidth = width;
  listeners.forEach((listener) => listener());
}

/** Muda o tema do sistema simulado e avisa os componentes. */
export function setSystemDarkScheme(isDark: boolean) {
  isDarkScheme = isDark;
  listeners.forEach((listener) => listener());
}
