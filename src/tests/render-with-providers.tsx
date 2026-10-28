import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ToastProvider } from '@components/toast';
import { AuthProvider } from '@contexts/auth';
import { ContentTestProvider } from '@contexts/content';
import { StudyProgressProvider } from '@contexts/study-progress';
import { ThemeModeProvider } from '@contexts/theme';
import type { iContent } from '@/types/content';
import { TEST_CONTENT } from './content-fixture';
import { mockNavigation } from './next-navigation';

interface iRenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Rota atual (pode ter `?query`). */
  route?: string;
  params?: Record<string, string>;
  /** Conteúdo entregue às telas no lugar do `GET /api/conteudo`. */
  content?: iContent;
}

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

function setRoute(route: string, params: Record<string, string>) {
  const [pathname, search = ''] = route.split('?');
  mockNavigation.pathname = pathname;
  mockNavigation.search = search;
  mockNavigation.params = params;
}

/**
 * Renderiza uma tela logada: tema, toast, auth, conteúdo (fixture) e progresso, com o roteador falso do Next.
 * As chamadas à API vêm do `fetch` simulado (`mockApi`).
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', params = {}, content = TEST_CONTENT, ...options }: iRenderWithProvidersOptions = {}
) {
  setRoute(route, params);
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider>
          <ToastProvider>
            <AuthProvider>
              <ContentTestProvider content={content}>
                <StudyProgressProvider>{children}</StudyProgressProvider>
              </ContentTestProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeModeProvider>
      </QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}

/** Só tema e roteador (componentes e forms soltos). */
export function renderWithTheme(
  ui: ReactElement,
  { route = '/', ...options }: Omit<RenderOptions, 'wrapper'> & { route?: string } = {}
) {
  setRoute(route, {});
  const queryClient = createTestQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeModeProvider>
      </QueryClientProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
