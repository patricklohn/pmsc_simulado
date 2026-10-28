import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const ModeGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[5]};

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
  }
`;

export const ModeCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  > button {
    margin-top: auto;
  }
`;

export const ModeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};

  h2 {
    font-size: ${({ theme }) => theme.font.size.lg};
  }
`;

export const ModeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
`;

export const ModeDescription = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const ModeOptions = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Notice = styled.p`
  margin-top: ${({ theme }) => theme.space[5]} !important;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;
