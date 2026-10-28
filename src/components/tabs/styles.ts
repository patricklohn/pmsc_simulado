import styled from 'styled-components';

export const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  scrollbar-width: none;
`;

export const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  min-height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: nowrap;
  cursor: pointer;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textMuted)};
  background: ${({ theme, $isActive }) => ($isActive ? theme.colors.primarySoft : 'transparent')};
`;
