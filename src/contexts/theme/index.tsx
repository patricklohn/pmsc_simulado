'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/use-media-query';
import { GlobalStyle } from '@styles/global-style';
import { THEMES, type tColorMode } from '@styles/theme';
import { eThemePreference } from '@/types/theme';

/** Chave do localStorage usada só para a primeira pintura, da primeira pintura. */
export const THEME_STORAGE_KEY = 'pmsc-simulado:theme';

interface iThemeModeContext {
  /** O que o usuário escolheu. */
  preference: eThemePreference;
  /** O que está na tela (`system` já resolvido). */
  mode: tColorMode;
  setPreference: (preference: eThemePreference) => void;
}

const ThemeModeContext = createContext<iThemeModeContext | null>(null);

const readStoredPreference = (): eThemePreference => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return Object.values(eThemePreference).includes(stored as eThemePreference)
      ? (stored as eThemePreference)
      : eThemePreference.system;
  } catch {
    return eThemePreference.system;
  }
};

interface iThemeModeProviderProps {
  children: ReactNode;
}

/**
 * Aplica o tema claro ou escuro. `system` segue o `prefers-color-scheme` e muda junto com o sistema.
 * A preferência fica salva no localStorage.
 */
export function ThemeModeProvider({ children }: iThemeModeProviderProps) {
  const [preference, setPreferenceState] = useState(readStoredPreference);
  const isSystemDark = useMediaQuery('(prefers-color-scheme: dark)');

  const mode: tColorMode =
    preference === eThemePreference.system ? (isSystemDark ? 'dark' : 'light') : (preference as tColorMode);

  const setPreference = useCallback((next: eThemePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sem localStorage (aba privada): o tema vale só nesta sessão
    }
  }, []);

  const value = useMemo(() => ({ preference, mode, setPreference }), [preference, mode, setPreference]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={THEMES[mode]}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

/** Preferência e modo de cor atuais. Use dentro do {@link ThemeModeProvider}. */
export function useThemeMode(): iThemeModeContext {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode precisa estar dentro do ThemeModeProvider');
  }
  return context;
}
