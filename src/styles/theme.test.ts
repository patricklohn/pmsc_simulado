import { darkTheme, lightTheme, type iTheme, type iThemeColors } from './theme';

/** Luminância relativa (WCAG 2.x) de uma cor `#RRGGBB`. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores (1 a 21). */
function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Pares texto × fundo usados pelos componentes. */
const PAIRS: [keyof iThemeColors, keyof iThemeColors][] = [
  ['text', 'background'],
  ['text', 'surface'],
  ['textMuted', 'surface'],
  ['textMuted', 'background'],
  ['onPrimary', 'primary'],
  ['onSecondary', 'secondary'],
  ['onDanger', 'danger'],
  ['primary', 'primarySoft'],
  ['secondary', 'secondarySoft'],
  ['warning', 'warningSoft'],
  ['danger', 'dangerSoft'],
  ['primary', 'surface'],
];

describe.each([lightTheme, darkTheme] as iTheme[])('tema $mode', (theme) => {
  it.each(PAIRS)('%s sobre %s passa no contraste AA (4.5:1)', (foreground, background) => {
    expect(contrast(theme.colors[foreground], theme.colors[background])).toBeGreaterThanOrEqual(4.5);
  });

  it('tem os mesmos tokens do outro tema', () => {
    expect(Object.keys(theme.colors).sort()).toEqual(Object.keys(lightTheme.colors).sort());
  });
});
