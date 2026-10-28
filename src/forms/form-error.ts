import type { FieldValues, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@services/api-error';

/** Mensagem para erros que não vieram da API (bug ou falha inesperada). */
const UNEXPECTED_MESSAGE = 'Algo deu errado. Tente de novo em instantes.';

/**
 * Leva o erro da API para o topo do formulário (`errors.root`). A mensagem é a da API, já em português.
 *
 * @example
 * try { await onSubmit(values); } catch (error) { setFormError(error, setError); }
 */
export function setFormError<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  const message = error instanceof ApiError ? error.message : UNEXPECTED_MESSAGE;
  setError('root', { message });
}
