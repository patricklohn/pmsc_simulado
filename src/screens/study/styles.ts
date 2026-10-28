import Link from 'next/link';
import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const SubjectGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SubjectLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.transition};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SubjectName = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  font-weight: ${({ theme }) => theme.font.weight.semibold};

  > span {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
  }

  > svg {
    flex: none;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SubjectMeta = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

export const Weight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

/**
 * Plano semanal. No celular cada linha vira um card (rótulos vêm do `data-label` de cada célula);
 * a partir do tablet volta a ser uma tabela comum.
 */
export const PlanTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.size.sm};
  margin-bottom: ${({ theme }) => theme.space[3]};

  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[2]};
  }

  tr {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]};
    padding: ${({ theme }) => theme.space[3]};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
  }

  td {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]};
    min-width: 0;
  }

  td:first-child {
    font-weight: ${({ theme }) => theme.font.weight.semibold};
    overflow-wrap: anywhere;
  }

  td[data-label]::before {
    content: attr(data-label);
    color: ${({ theme }) => theme.colors.textMuted};
  }

  ${media.md} {
    thead {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: table-header-group;
    }

    tbody {
      display: table-row-group;
    }

    tr {
      display: table-row;
      padding: 0;
      border: 0;
      border-radius: 0;
    }

    th,
    td {
      display: table-cell;
      padding: ${({ theme }) => theme.space[2]};
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    td:first-child {
      font-weight: inherit;
    }

    td[data-label]::before {
      content: none;
    }

    th {
      color: ${({ theme }) => theme.colors.textMuted};
      font-weight: ${({ theme }) => theme.font.weight.medium};
    }

    td:not(:first-child),
    th:not(:first-child) {
      text-align: right;
      white-space: nowrap;
    }
  }

  & + p {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;
