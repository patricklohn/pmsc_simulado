import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const ScoreCard = styled.section<{ $isApproved: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $isApproved }) => ($isApproved ? theme.colors.secondarySoft : theme.colors.dangerSoft)};

  ${media.md} {
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.space[7]};
  }
`;

export const Score = styled.div`
  display: flex;
  flex-direction: column;

  > span {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ScoreValue = styled.span`
  font-size: 3rem;
  line-height: 1.1;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-variant-numeric: tabular-nums;

  small {
    font-size: ${({ theme }) => theme.font.size.xl};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ScoreDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[2]};
  line-height: 1.5;

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Breakdown = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};

  ${media.lg} {
    grid-template-columns: 1fr 2fr;
    align-items: start;
  }

  section {
    margin-bottom: 0;
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;
