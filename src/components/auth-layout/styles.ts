import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) =>
    `linear-gradient(180deg, ${theme.colors.primarySoft} 0%, ${theme.colors.background} 45%)`};

  ${media.md} {
    align-items: center;
  }
`;

export const Panel = styled.main`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};

  ${media.md} {
    padding: ${({ theme }) => theme.space[8]};
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export const Subtitle = styled.p`
  margin-top: ${({ theme }) => theme.space[1]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Footer = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;
