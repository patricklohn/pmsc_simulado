import styled from 'styled-components';
import { media } from '@styles/breakpoints';

export const Tips = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding-left: ${({ theme }) => theme.space[5]};
  line-height: 1.5;

  svg {
    color: ${({ theme }) => theme.colors.secondary};
    vertical-align: -2px;
  }
`;

export const Structure = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
  }

  p {
    margin-top: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;

export const MotivatingText = styled.blockquote`
  margin: ${({ theme }) => theme.space[4]} 0 0;
  padding-left: ${({ theme }) => theme.space[4]};
  border-left: 3px solid ${({ theme }) => theme.colors.primarySoft};
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.space[1]};
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  p + p {
    margin-top: ${({ theme }) => theme.space[2]};
  }
`;

export const Proposal = styled.p`
  margin-top: ${({ theme }) => theme.space[4]} !important;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primarySoft};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: 1.6;
`;

export const TwoColumns = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};

  ${media.lg} {
    grid-template-columns: 3fr 2fr;
    align-items: start;
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[3]};
  }
`;

export const Draft = styled.textarea`
  width: 100%;
  min-height: 420px;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  line-height: 1.8;
  resize: vertical;

  &:focus {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DraftFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Checklist = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => theme.space[3]} 0 0;
  padding: 0;
  list-style: none;

  label {
    display: flex;
    gap: ${({ theme }) => theme.space[3]};
    cursor: pointer;
  }

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.secondary};
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.4;
  }
`;

export const Estimator = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  label {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]};
    font-size: ${({ theme }) => theme.font.size.sm};
  }

  input[type='range'] {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;
