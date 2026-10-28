import { LuLoaderCircle } from 'react-icons/lu';
import { SpinnerIcon } from './styles';

interface iSpinnerProps {
  /** Tamanho em px (padrão 20). */
  size?: number;
  /** Texto para leitores de tela. */
  label?: string;
}

/** Indicador de carregamento. */
export function Spinner({ size = 20, label = 'Carregando' }: iSpinnerProps) {
  return (
    <SpinnerIcon role="status" aria-label={label}>
      <LuLoaderCircle size={size} aria-hidden />
    </SpinnerIcon>
  );
}
