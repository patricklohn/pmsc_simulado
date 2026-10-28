import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { Description, Knob, Label, Row, Texts, Track } from './styles';

export interface iSwitchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Liga/desliga com a linha inteira clicável. Funciona com o `register` do react-hook-form. */
export function SwitchField({ label, description, id, ref, ...rest }: iSwitchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Row htmlFor={inputId}>
      <Texts>
        <Label>{label}</Label>
        {description && <Description>{description}</Description>}
      </Texts>
      <input ref={ref} id={inputId} type="checkbox" role="switch" {...rest} />
      <Track aria-hidden>
        <Knob />
      </Track>
    </Row>
  );
}
