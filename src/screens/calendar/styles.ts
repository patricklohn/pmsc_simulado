import styled, { css } from 'styled-components';
import { Card } from '@components/card';
import { media } from '@styles/breakpoints';
import type { tEventStatus } from '@utils/schedule';

export const Groups = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[4]};

  ${media.lg} {
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
  }
`;

export const GroupCard = styled(Card)``;

export const GroupTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const Timeline = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const TimelineItem = styled.li<{ $status: tEventStatus }>`
  position: relative;
  display: grid;
  grid-template-columns: 16px 1fr;
  column-gap: ${({ theme }) => theme.space[3]};
  padding-bottom: ${({ theme }) => theme.space[3]};
  opacity: ${({ $status }) => ($status === 'passado' ? 0.6 : 1)};

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 18px;
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const Dot = styled.span<{ $status: tEventStatus; $isHighlight: boolean }>`
  grid-row: span 2;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
  background: ${({ theme, $status, $isHighlight }) =>
    $status === 'hoje'
      ? theme.colors.secondary
      : $isHighlight
        ? theme.colors.primary
        : $status === 'passado'
          ? theme.colors.textMuted
          : theme.colors.border};
`;

export const TimelineDate = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TimelineText = styled.span<{ $isHighlight: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  line-height: 1.4;

  ${({ $isHighlight, theme }) =>
    $isHighlight &&
    css`
      font-weight: ${theme.font.weight.semibold};
    `}
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: ${({ theme }) => theme.space[2]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: ${({ theme }) => theme.font.weight.medium};
  }

  tfoot td {
    font-weight: ${({ theme }) => theme.font.weight.semibold};
    border-bottom: 0;
  }

  td:last-child,
  th:last-child {
    text-align: right;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.space[2]};
  }

  p {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }

  p + p {
    margin-top: ${({ theme }) => theme.space[2]};
  }
`;

export const PhaseList = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Phase = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  > span {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-weight: ${({ theme }) => theme.font.weight.bold};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  p {
    margin-top: ${({ theme }) => theme.space[1]};
    font-size: ${({ theme }) => theme.font.size.sm};
    line-height: 1.5;
  }
`;

export const BulletList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding-left: ${({ theme }) => theme.space[5]};
  line-height: 1.5;
`;

export const Chips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.font.size.sm};
  }
`;

export const TafHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space[3]};

  small {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.font.weight.medium};
  }

  p {
    margin-top: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;
