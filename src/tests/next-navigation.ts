import { vi } from 'vitest';

/** Estado do roteador falso dos testes. Ajuste `pathname`, `search` e `params` antes de renderizar. */
export const mockNavigation = {
  pathname: '/',
  search: '',
  params: {} as Record<string, string>,
  push: vi.fn(),
  replace: vi.fn(),
};

export function resetMockNavigation() {
  mockNavigation.pathname = '/';
  mockNavigation.search = '';
  mockNavigation.params = {};
  mockNavigation.push.mockReset();
  mockNavigation.replace.mockReset();
}
