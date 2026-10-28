import styled, { css } from 'styled-components';

export type tCellState = 'empty' | 'answered' | 'flagged';

const cellColors = {
  empty: css`
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  answered: css`
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
    border-color: ${({ theme }) => theme.colors.primarySoft};
  `,
  flagged: css`
    color: ${({ theme }) => theme.colors.warning};
    background: ${({ theme }) => theme.colors.warningSoft};
    border-color: ${({ theme }) => theme.colors.warningSoft};
  `,
};

export const Grid = styled.nav`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: ${({ theme }) => theme.space[1]};
`;

export const Cell = styled.button<{ $state: tCellState; $isCurrent: boolean }>`
  height: 40px;
  border: 2px solid;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  ${({ $state }) => cellColors[$state]}

  ${({ $isCurrent, theme }) =>
    $isCurrent &&
    css`
      border-color: ${theme.colors.text};
    `}
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LegendItem = styled.span<{ $state: tCellState }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 3px;
    border: 1px solid;
    ${({ $state }) => cellColors[$state]}
  }
`;
