import styled, { keyframes } from 'styled-components';
import { media } from '@styles/breakpoints';

const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${({ theme }) => theme.colors.overlay};

  ${media.md} {
    align-items: center;
    padding: ${({ theme }) => theme.space[6]};
  }
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90dvh;
  background: ${({ theme }) => theme.colors.surfaceRaised};
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding-bottom: env(safe-area-inset-bottom);
  animation: ${slideUp} 180ms ease-out;
  outline: none;

  ${media.md} {
    max-width: 560px;
    border-radius: ${({ theme }) => theme.radius.lg};
    padding-bottom: 0;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[2]} ${theme.space[2]} ${theme.space[5]}`};
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const Body = styled.div`
  overflow-y: auto;
  padding: ${({ theme }) => `0 ${theme.space[5]} ${theme.space[5]}`};
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.md} {
    flex-direction: row;
    justify-content: flex-end;
  }
`;
