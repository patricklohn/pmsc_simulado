import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};

  ${media.lg} {
    grid-template-columns: 3fr 2fr;
    align-items: start;
  }

  section {
    margin-bottom: 0;
  }
`;

export const EntryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`;

export const Entry = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  ${media.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const EntryMain = styled.div`
  display: flex;
  flex-direction: column;

  a {
    font-weight: ${({ theme }) => theme.font.weight.semibold};
  }

  span {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const EntryScore = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
`;
