'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { Brand } from '@components/brand';
import { IconButton } from '@components/button';
import {
  BottomNav,
  BottomNavLink,
  Content,
  Main,
  MobileTopBar,
  Shell,
  Sidebar,
  SidebarButton,
  SidebarFooter,
  SidebarLink,
  SidebarNav,
  UserName,
} from './styles';

export interface iNavItem {
  to: string;
  label: string;
  icon: ReactNode;
  /** Também aparece na barra inferior do celular (até 5 itens). */
  isInBottomNav?: boolean;
}

interface iAppShellProps {
  items: iNavItem[];
  userName?: string;
  /** Conteúdo extra no rodapé do menu lateral (ex.: seletor de tema). */
  sidebarFooter?: ReactNode;
  /** Ações do topo no celular (ex.: seletor de tema). */
  mobileActions?: ReactNode;
  onLogout?: () => void;
  children: ReactNode;
}

/**
 * Moldura das telas. No celular: barra no topo e navegação **embaixo** (alcance do polegar).
 * A partir de 1024px: menu lateral fixo.
 */
export function AppShell({ items, userName, sidebarFooter, mobileActions, onLogout, children }: iAppShellProps) {
  const pathname = usePathname();
  const bottomItems = items.filter((item) => item.isInBottomNav).slice(0, 5);
  // Início só fica ativo na raiz; os demais também nas sub-rotas (/estudo/direito-penal)
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));
  const current = (to: string) => (isActive(to) ? ('page' as const) : undefined);

  return (
    <Shell>
      <Sidebar aria-label="Menu principal">
        <Brand />
        <SidebarNav>
          {items.map((item) => (
            <SidebarLink key={item.to} href={item.to} aria-current={current(item.to)}>
              {item.icon}
              {item.label}
            </SidebarLink>
          ))}
        </SidebarNav>
        <SidebarFooter>
          {sidebarFooter}
          {userName && <UserName>{userName}</UserName>}
          {onLogout && (
            <SidebarButton type="button" onClick={onLogout}>
              <LuLogOut aria-hidden />
              Sair
            </SidebarButton>
          )}
        </SidebarFooter>
      </Sidebar>

      <MobileTopBar>
        <Brand />
        <div>
          {mobileActions}
          {onLogout && (
            <IconButton aria-label="Sair" onClick={onLogout}>
              <LuLogOut />
            </IconButton>
          )}
        </div>
      </MobileTopBar>

      <Main>
        <Content>{children}</Content>
      </Main>

      <BottomNav aria-label="Navegação">
        {bottomItems.map((item) => (
          <BottomNavLink key={item.to} href={item.to} aria-current={current(item.to)}>
            {item.icon}
            <span>{item.label}</span>
          </BottomNavLink>
        ))}
      </BottomNav>
    </Shell>
  );
}
