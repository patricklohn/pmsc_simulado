import styled from 'styled-components';
import { media } from '@styles/breakpoints';
import type { tToastTone } from '.';

export const Region = styled.div`
  position: fixed;
  top: calc(${({ theme }) => theme.space[3]} + env(safe-area-inset-top));
  left: ${({ theme }) => theme.space[3]};
  right: ${({ theme }) => theme.space[3]};
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  pointer-events: none;

  ${media.md} {
    top: auto;
    left: auto;
    bottom: ${({ theme }) => theme.space[6]};
    right: ${({ theme }) => theme.space[6]};
    width: 380px;
  }
`;

export const Item = styled.div<{ $tone: tToastTone }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[2]} ${theme.space[3]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  pointer-events: auto;
  background: ${({ theme, $tone }) =>
    $tone === 'success'
      ? theme.colors.secondarySoft
      : $tone === 'danger'
        ? theme.colors.dangerSoft
        : theme.colors.primarySoft};
  color: ${({ theme, $tone }) =>
    $tone === 'success' ? theme.colors.secondary : $tone === 'danger' ? theme.colors.danger : theme.colors.primary};

  > svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
`;

export const Message = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const CloseButton = styled.button`
  display: inline-flex;
  padding: ${({ theme }) => theme.space[2]};
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;
