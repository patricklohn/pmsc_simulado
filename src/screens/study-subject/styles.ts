import styled from 'styled-components';

export const Overview = styled.p`
  line-height: 1.6;
`;

export const Tips = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding: ${({ theme }) => theme.space[4]};
  list-style: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.secondarySoft};

  li {
    display: flex;
    gap: ${({ theme }) => theme.space[2]};
    line-height: 1.5;
  }

  svg {
    flex: none;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const EditalText = styled.p`
  margin-top: ${({ theme }) => theme.space[2]} !important;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: 1.6;
  white-space: pre-line;
`;

export const Topics = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

export const TopicCard = styled.details<{ $isDone: boolean }>`
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme, $isDone }) => ($isDone ? theme.colors.secondary : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};

  &[open] summary {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const TopicSummary = styled.summary`
  min-height: ${({ theme }) => theme.touchTarget};
  padding: ${({ theme }) => theme.space[4]};
  cursor: pointer;
  list-style-position: outside;
  margin-left: ${({ theme }) => theme.space[4]};
`;

export const TopicTitle = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const TopicBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  line-height: 1.6;

  h3 {
    margin-top: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.font.size.md};
  }
`;

export const KeyList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding-left: ${({ theme }) => theme.space[5]};

  a {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[1]};
  }
`;

export const Trap = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  list-style: none;
  margin-left: -${({ theme }) => theme.space[5]};

  svg {
    flex: none;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.warning};
  }
`;

export const Check = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-height: ${({ theme }) => theme.touchTarget};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;

  input {
    width: 20px;
    height: 20px;
    accent-color: ${({ theme }) => theme.colors.secondary};
  }
`;
