import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { resetMatchMedia } from './match-media';
import { mockNavigation, resetMockNavigation } from './next-navigation';

vi.mock('next/navigation', () => ({
  usePathname: () => mockNavigation.pathname,
  useSearchParams: () => new URLSearchParams(mockNavigation.search),
  useParams: () => mockNavigation.params,
  useRouter: () => ({
    push: mockNavigation.push,
    replace: mockNavigation.replace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

resetMatchMedia();

afterEach(() => {
  cleanup();
  resetMatchMedia();
  resetMockNavigation();
  window.localStorage.clear();
});
