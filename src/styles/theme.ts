import { BREAKPOINTS } from './breakpoints';

/** Modo de cor aplicado na tela (o `system` já resolvido). */
export type tColorMode = 'light' | 'dark';

/**
 * Cores do tema. Cada cor forte tem uma versão `Soft` (fundo pastel) e uma `on*` (texto sobre a cor forte).
 * Os pares de texto e fundo passam no contraste WCAG AA (conferido em `theme.test.ts`).
 */
export interface iThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondarySoft: string;
  onSecondary: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  onDanger: string;
  focusRing: string;
  overlay: string;
}

/** Tokens de design compartilhados pelos dois temas. Componentes usam só estes tokens, nunca cor solta. */
export interface iTheme {
  mode: tColorMode;
  colors: iThemeColors;
  /** Escala de espaçamento de 4px: `space[4]` = 16px. */
  space: readonly string[];
  radius: { sm: string; md: string; lg: string; pill: string };
  font: {
    family: string;
    size: { xs: string; sm: string; md: string; lg: string; xl: string; xxl: string };
    weight: { regular: number; medium: number; semibold: number; bold: number };
  };
  shadow: { sm: string; md: string };
  breakpoint: typeof BREAKPOINTS;
  /** Altura mínima de alvos de toque (botões, itens de lista). */
  touchTarget: string;
  transition: string;
}

const SHARED = {
  space: ['0', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'],
  radius: { sm: '8px', md: '12px', lg: '16px', pill: '999px' },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    // 16px no corpo evita o zoom automático do iOS ao focar um input
    size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.375rem', xxl: '1.75rem' },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  breakpoint: BREAKPOINTS,
  touchTarget: '44px',
  transition: '160ms ease',
} as const;

/** Tema claro: tons pastéis de azul e verde sobre branco. */
export const lightTheme: iTheme = {
  ...SHARED,
  mode: 'light',
  colors: {
    background: '#F6F9FB',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8EE',
    text: '#1E2A36',
    textMuted: '#5D6D7D',
    primary: '#2F6698',
    primarySoft: '#DCEAF7',
    onPrimary: '#FFFFFF',
    secondary: '#2D6A54',
    secondarySoft: '#DDF1E8',
    onSecondary: '#FFFFFF',
    warning: '#835A12',
    warningSoft: '#FBEFD6',
    danger: '#A23F3F',
    dangerSoft: '#F8E1E1',
    onDanger: '#FFFFFF',
    focusRing: '#9CC3E8',
    overlay: 'rgba(30, 42, 54, 0.45)',
  },
  shadow: {
    sm: '0 1px 2px rgba(30, 42, 54, 0.06)',
    md: '0 6px 20px rgba(30, 42, 54, 0.10)',
  },
};

/** Tema escuro: as mesmas cores, claras sobre fundo azul-escuro. */
export const darkTheme: iTheme = {
  ...SHARED,
  mode: 'dark',
  colors: {
    background: '#0F161C',
    surface: '#17212A',
    surfaceRaised: '#1D2934',
    border: '#2A3744',
    text: '#E6EDF3',
    textMuted: '#9AA9B7',
    primary: '#8DB9E4',
    primarySoft: '#1E3347',
    onPrimary: '#0F161C',
    secondary: '#86C8AE',
    secondarySoft: '#1B3A2F',
    onSecondary: '#0F161C',
    warning: '#E5BE73',
    warningSoft: '#3A2F18',
    danger: '#E89A9A',
    dangerSoft: '#3D2222',
    onDanger: '#0F161C',
    focusRing: '#4A7AA8',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 6px 20px rgba(0, 0, 0, 0.45)',
  },
};

/** Tema por modo de cor. */
export const THEMES: Record<tColorMode, iTheme> = { light: lightTheme, dark: darkTheme };
