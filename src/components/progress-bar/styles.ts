import styled from 'styled-components';

export type tProgressTone = 'primary' | 'secondary' | 'warning' | 'danger';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const Track = styled.div`
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const Fill = styled.div<{ $tone: tProgressTone }>`
  height: 100%;
  border-radius: inherit;
  background: ${({ theme, $tone }) => theme.colors[$tone]};
  transition: width ${({ theme }) => theme.transition};
`;
