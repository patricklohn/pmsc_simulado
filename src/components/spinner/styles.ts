import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerIcon = styled.span`
  display: inline-flex;

  svg {
    animation: ${spin} 0.8s linear infinite;
  }
`;
