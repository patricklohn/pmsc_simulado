import Link from 'next/link';
import styled, { css } from 'styled-components';
import { media } from '@styles/breakpoints';

const BOTTOM_NAV_HEIGHT = '64px';
const SIDEBAR_WIDTH = '248px';

export const Shell = styled.div`
  min-height: 100dvh;

  ${media.lg} {
    display: grid;
    grid-template-columns: ${SIDEBAR_WIDTH} 1fr;
  }
`;

export const Sidebar = styled.aside`
  display: none;

  ${media.lg} {
    position: sticky;
    top: 0;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[6]};
    padding: ${({ theme }) => `${theme.space[6]} ${theme.space[4]}`};
    background: ${({ theme }) => theme.colors.surface};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  flex: 1;
  overflow-y: auto;
`;

const sidebarItem = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  min-height: ${({ theme }) => theme.touchTarget};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-decoration: none;
  cursor: pointer;
  width: 100%;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

export const SidebarLink = styled(Link)`
  ${sidebarItem}
`;

export const SidebarButton = styled.button`
  ${sidebarItem}
`;

export const UserName = styled.span`
  padding: 0 ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

export const MobileTopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(${({ theme }) => theme.space[2]} + env(safe-area-inset-top)) ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[1]};
  }

  ${media.lg} {
    display: none;
  }
`;

export const Main = styled.main`
  padding-bottom: calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom));

  ${media.lg} {
    padding-bottom: 0;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[4]};

  ${media.md} {
    padding: ${({ theme }) => theme.space[6]};
  }

  ${media.lg} {
    padding: ${({ theme }) => `${theme.space[8]} ${theme.space[8]}`};
  }
`;

export const BottomNav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  height: calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.lg} {
    display: none;
  }
`;

export const BottomNavLink = styled(Link)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;

  svg {
    font-size: 1.35rem;
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
