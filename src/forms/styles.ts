import styled from 'styled-components';

/** Coluna de campos com espaçamento padrão, usada por todos os forms. */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;
