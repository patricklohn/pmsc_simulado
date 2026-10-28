import { Mark, Name, Wrapper } from './styles';

/** Logo do PMSC Simulado: o mesmo desenho do ícone do app, com o nome ao lado. */
export function Brand({ isCompact = false }: { isCompact?: boolean }) {
  return (
    <Wrapper>
      <Mark src="/favicon.svg" alt="" width={32} height={32} />
      {!isCompact && (
        <Name>
          PMSC <strong>Simulado</strong>
        </Name>
      )}
    </Wrapper>
  );
}
