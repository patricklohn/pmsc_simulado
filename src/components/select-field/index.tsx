import { useId, type Ref, type SelectHTMLAttributes } from 'react';
import { Field, fieldControlProps } from '@components/field';
import { Select } from './styles';

export interface iSelectOption {
  value: string;
  label: string;
}

export interface iSelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: iSelectOption[];
  /** Primeira opção vazia (ex.: "Selecione"). */
  placeholder?: string;
  hint?: string;
  error?: string;
  ref?: Ref<HTMLSelectElement>;
}

/** Lista de opções nativa (no celular abre o seletor do sistema). */
export function SelectField({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  required,
  ref,
  ...rest
}: iSelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <Field id={selectId} label={label} hint={hint} error={error} isRequired={required}>
      <Select ref={ref} required={required} {...fieldControlProps(selectId, error, hint)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
