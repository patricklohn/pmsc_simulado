import { Block, Stack } from './styles';

interface iSkeletonProps {
  /** Quantidade de blocos. */
  lines?: number;
  /** Altura de cada bloco em px. */
  height?: number;
  label?: string;
}

/** Blocos pulsando no lugar do conteúdo enquanto carrega. */
export function Skeleton({ lines = 3, height = 20, label = 'Carregando' }: iSkeletonProps) {
  return (
    <Stack role="status" aria-label={label}>
      {Array.from({ length: lines }, (_, index) => (
        <Block key={index} $height={height} />
      ))}
    </Stack>
  );
}
