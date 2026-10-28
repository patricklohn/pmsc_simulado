import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const TopBar = styled.div`
  position: sticky;
  top: 61px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  margin: -${({ theme }) => theme.space[4]} -${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.font.size.sm};

  span {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  ${media.md} {
    margin: -${({ theme }) => theme.space[6]} -${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[5]};
    padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[6]};
  }

  ${media.lg} {
    top: 0;
    margin: -${({ theme }) => theme.space[8]} -${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
    padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]};
  }
`;

export const Timer = styled.span<{ $isLow: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $isLow }) => ($isLow ? theme.colors.danger : theme.colors.primary)} !important;
  background: ${({ theme, $isLow }) => ($isLow ? theme.colors.dangerSoft : theme.colors.primarySoft)};
`;

export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  ${media.lg} {
    grid-template-columns: 1fr 300px;
    align-items: start;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  min-width: 0;
`;

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Side = styled.aside`
  ${media.lg} {
    position: sticky;
    top: 88px;
  }
`;

export const SideCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  small {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;

export const SaveStatus = styled.p<{ $isError: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme, $isError }) => ($isError ? theme.colors.warning : theme.colors.textMuted)};
`;
