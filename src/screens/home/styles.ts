import Link from 'next/link';
import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  margin: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.text};

  ${media.md} {
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.space[7]};
  }
`;

export const Countdown = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.primary};
`;

export const CountdownDays = styled.span`
  font-size: 3rem;
  line-height: 1;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-variant-numeric: tabular-nums;
`;

export const CountdownText = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const HeroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    font-size: ${({ theme }) => theme.font.size.md};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ShortcutGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ShortcutCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition:
    border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

export const ShortcutIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
`;

export const ShortcutTitle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const ShortcutDescription = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const EventList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`;

export const EventItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const EventDate = styled.span`
  min-width: 140px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[3]};

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;
