import styled, { css } from 'styled-components';

export type tAlternativeState = 'idle' | 'selected' | 'correct' | 'wrong';

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Statement = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: 1.6;

  p {
    margin: 0 0 ${({ theme }) => theme.space[3]};
    white-space: pre-line;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

export const AlternativeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const stateColors = {
  idle: css`
    border-color: ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
  `,
  selected: css`
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  `,
  correct: css`
    border-color: ${({ theme }) => theme.colors.secondary};
    background: ${({ theme }) => theme.colors.secondarySoft};
  `,
  wrong: css`
    border-color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
  `,
};

export const Alternative = styled.div<{ $state: tAlternativeState; $isInteractive: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  width: 100%;
  min-height: ${({ theme }) => theme.touchTarget};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.md};
  font: inherit;
  line-height: 1.5;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  cursor: ${({ $isInteractive }) => ($isInteractive ? 'pointer' : 'default')};
  transition:
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};
  ${({ $state }) => stateColors[$state]}

  ${({ $isInteractive, $state, theme }) =>
    $isInteractive &&
    $state === 'idle' &&
    css`
      &:hover {
        border-color: ${theme.colors.primary};
      }
    `}
`;

const letterColors = {
  idle: css`
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.background};
  `,
  selected: css`
    color: ${({ theme }) => theme.colors.onPrimary};
    background: ${({ theme }) => theme.colors.primary};
  `,
  correct: css`
    color: ${({ theme }) => theme.colors.onSecondary};
    background: ${({ theme }) => theme.colors.secondary};
  `,
  wrong: css`
    color: ${({ theme }) => theme.colors.onDanger};
    background: ${({ theme }) => theme.colors.danger};
  `,
};

export const Letter = styled.span<{ $state: tAlternativeState }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-size: ${({ theme }) => theme.font.size.sm};
  ${({ $state }) => letterColors[$state]}
`;

export const Comment = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  line-height: 1.6;

  p {
    margin: 0 0 ${({ theme }) => theme.space[2]};
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const CommentTitle = styled.p`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;
