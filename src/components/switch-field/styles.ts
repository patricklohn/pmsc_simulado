import styled from 'styled-components';

export const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transition};
`;

export const Knob = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: transform ${({ theme }) => theme.transition};
`;

export const Row = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  min-height: ${({ theme }) => theme.touchTarget};
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  input:checked + ${Track} {
    background: ${({ theme }) => theme.colors.secondary};
  }

  input:checked + ${Track} ${Knob} {
    transform: translateX(18px);
  }

  input:focus-visible + ${Track} {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

export const Texts = styled.span`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const Description = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;
