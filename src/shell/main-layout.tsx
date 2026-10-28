'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppShell } from '@components/app-shell';
import { ThemeToggle } from '@components/theme-toggle';
import { useAuth } from '@contexts/auth';
import { useThemeMode } from '@contexts/theme';
import { NAV_ITEMS } from './navigation';
import { ROUTES } from './routes';

/** Moldura das telas logadas: menu lateral (desktop) ou barra inferior (celular). */
export function MainLayout({ children }: { children: ReactNode }) {
  const { preference, setPreference } = useThemeMode();
  const { me, logout } = useAuth();
  const router = useRouter();
  const toggle = <ThemeToggle value={preference} onChange={setPreference} isCompact />;

  return (
    <AppShell
      items={NAV_ITEMS}
      userName={me?.name}
      sidebarFooter={toggle}
      mobileActions={toggle}
      onLogout={async () => {
        await logout();
        router.replace(ROUTES.login);
      }}
    >
      {children}
    </AppShell>
  );
}
