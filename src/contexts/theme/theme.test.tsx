import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setSystemDarkScheme } from '@tests/match-media';
import { eThemePreference } from '@/types/theme';
import { THEME_STORAGE_KEY, ThemeModeProvider, useThemeMode } from '.';

function Probe() {
  const { preference, mode, setPreference } = useThemeMode();
  return (
    <>
      <span data-testid="preference">{preference}</span>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setPreference(eThemePreference.dark)}>escuro</button>
    </>
  );
}

const renderProbe = () =>
  render(
    <ThemeModeProvider>
      <Probe />
    </ThemeModeProvider>
  );

describe('ThemeModeProvider', () => {
  it('system segue o tema do sistema e muda junto com ele', () => {
    renderProbe();
    expect(screen.getByTestId('mode')).toHaveTextContent('light');

    act(() => setSystemDarkScheme(true));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('escolha manual vale mesmo com o sistema no outro tema e fica salva para a próxima abertura', async () => {
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'escuro' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('abre com a preferência salva', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    setSystemDarkScheme(true);
    renderProbe();

    expect(screen.getByTestId('preference')).toHaveTextContent('light');
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });
});
