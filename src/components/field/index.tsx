import type { ReactNode } from 'react';
import { Error, Hint, Label, Wrapper } from './styles';

export interface iFieldProps {
  /** `id` do controle, ligado ao `<label>`. */
  id: string;
  label: string;
  /** Texto de ajuda abaixo do campo. */
  hint?: string;
  /** Mensagem de erro (do form ou da API). Substitui o `hint`. */
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
}

/** Rótulo, ajuda e erro em volta de um controle. Base de todos os campos de formulário. */
export function Field({ id, label, hint, error, isRequired = false, children }: iFieldProps) {
  return (
    <Wrapper>
      <Label htmlFor={id}>
        {label}
        {isRequired && <span aria-hidden> *</span>}
      </Label>
      {children}
      {error ? (
        <Error id={`${id}-message`} role="alert">
          {error}
        </Error>
      ) : (
        hint && <Hint id={`${id}-message`}>{hint}</Hint>
      )}
    </Wrapper>
  );
}

/** Props de acessibilidade para o controle dentro de um {@link Field}. */
export const fieldControlProps = (id: string, error?: string, hint?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error || hint ? `${id}-message` : undefined,
});
