import Link from 'next/link';
import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[5]};

  ${media.md} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

export const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  width: fit-content;
  min-height: 32px;
  font-size: ${({ theme }) => theme.font.size.sm};
  text-decoration: none;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;
