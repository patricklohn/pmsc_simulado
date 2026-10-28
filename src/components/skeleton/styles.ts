import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  50% { opacity: 0.5; }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Block = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.border};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;
