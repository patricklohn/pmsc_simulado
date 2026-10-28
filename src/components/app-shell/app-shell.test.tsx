import { screen, within } from '@testing-library/react';
import { LuBookOpen, LuCalendar, LuHouse } from 'react-icons/lu';
import { renderWithProviders } from '@tests/render-with-providers';
import { AppShell, type iNavItem } from '.';

const ITEMS: iNavItem[] = [
  { to: '/', label: 'Início', icon: <LuHouse />, isInBottomNav: true },
  { to: '/estudo', label: 'Estudo', icon: <LuBookOpen />, isInBottomNav: true },
  { to: '/calendario', label: 'Calendário', icon: <LuCalendar /> },
];

describe('AppShell', () => {
  it('menu lateral com todos os itens e barra inferior só com os marcados, com a rota atual ativa', () => {
    renderWithProviders(<AppShell items={ITEMS}>conteúdo</AppShell>, { route: '/estudo' });

    // O menu lateral só aparece a partir de 1024px; no celular (padrão dos testes) fica fora da árvore acessível
    const sidebar = screen.getByLabelText('Menu principal');
    const bottom = screen.getByRole('navigation', { name: 'Navegação' });

    expect(within(sidebar).getAllByRole('link', { hidden: true })).toHaveLength(3);
    expect(within(bottom).getAllByRole('link')).toHaveLength(2);
    expect(within(bottom).getByRole('link', { name: 'Estudo' })).toHaveAttribute('aria-current', 'page');
  });
});
