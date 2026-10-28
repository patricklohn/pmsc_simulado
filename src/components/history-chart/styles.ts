import styled from 'styled-components';

export const Figure = styled.figure`
  margin: 0;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  figcaption {
    margin-top: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
