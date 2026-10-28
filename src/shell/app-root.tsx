'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Spinner } from '@components/spinner';
import { useAuth } from '@contexts/auth';
import { ContentProvider } from '@contexts/content';
import { StudyProgressProvider } from '@contexts/study-progress';
import { MainLayout } from './main-layout';
import { Providers } from './providers';
import { PUBLIC_ROUTES, ROUTES } from './routes';
import { FullScreen } from './styles';

function SessionLoading() {
  return (
    <FullScreen>
      <Spinner size={32} label="Abrindo sua sessão" />
    </FullScreen>
  );
}

/**
 * Decide o que mostrar: login e cadastro ficam abertos (e quem já entrou vai para o início); as demais telas
 * exigem sessão e recebem o conteúdo do banco e o progresso do usuário.
 */
function Gate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (status === 'anonymous' && !isPublic) router.replace(ROUTES.login);
    if (status === 'authenticated' && isPublic) router.replace(ROUTES.home);
  }, [status, isPublic, router]);

  if (status === 'loading') return <SessionLoading />;
  if (isPublic) return status === 'anonymous' ? <>{children}</> : <SessionLoading />;
  if (status === 'anonymous') return <SessionLoading />;

  return (
    <MainLayout>
      <ContentProvider>
        <StudyProgressProvider>{children}</StudyProgressProvider>
      </ContentProvider>
    </MainLayout>
  );
}

/** Providers, controle de acesso e moldura do app. */
export function AppRoot({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Gate>{children}</Gate>
    </Providers>
  );
}
