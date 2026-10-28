import styled from 'styled-components';

export type tAlertTone = 'info' | 'success' | 'warning' | 'danger';

const COLOR = { info: 'primary', success: 'secondary', warning: 'warning', danger: 'danger' } as const;

export const Box = styled.div<{ $tone: tAlertTone }>`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme, $tone }) => theme.colors[COLOR[$tone]]};
  background: ${({ theme, $tone }) => theme.colors[`${COLOR[$tone]}Soft`]};

  > svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 1.1rem;
  }
`;
