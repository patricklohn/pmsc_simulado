import styled from 'styled-components';

/** Superfície com borda e cantos arredondados, base de blocos e cards. */
export const Card = styled.section<{ $padding?: number }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme, $padding = 4 }) => theme.space[$padding]};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;
