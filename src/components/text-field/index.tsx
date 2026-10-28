import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { Field, fieldControlProps } from '@components/field';
import { Input } from './styles';

export interface iTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Campo de texto com rótulo, ajuda e erro. Funciona com o `register` do react-hook-form.
 *
 * @example
 * <TextField label="E-mail" type="email" {...register('email')} error={errors.email?.message} />
 */
export function TextField({ label, hint, error, id, required, ref, ...rest }: iTextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field id={inputId} label={label} hint={hint} error={error} isRequired={required}>
      <Input ref={ref} required={required} {...fieldControlProps(inputId, error, hint)} {...rest} />
    </Field>
  );
}
