import styled from 'styled-components';

export const Group = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Option = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[1]};
  min-height: 36px;
  min-width: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  cursor: pointer;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textMuted)};
  background: ${({ theme, $isActive }) => ($isActive ? theme.colors.surface : 'transparent')};
  box-shadow: ${({ theme, $isActive }) => ($isActive ? theme.shadow.sm : 'none')};
`;
