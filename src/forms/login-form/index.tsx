'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@components/alert';
import { Button } from '@components/button';
import { TextField } from '@components/text-field';
import { setFormError } from '../form-error';
import { Form } from '../styles';

/** Só formato: quem confere e-mail e senha é a API. */
const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

export type tLoginFormValues = z.infer<typeof loginSchema>;

interface iLoginFormProps {
  onSubmit: (values: tLoginFormValues) => Promise<void>;
}

/** Formulário de login (e-mail e senha). */
export function LoginForm({ onSubmit }: iLoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<tLoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error, setError);
    }
  });

  return (
    <Form onSubmit={submit} noValidate>
      {errors.root?.message && <Alert tone="danger">{errors.root.message}</Alert>}
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isFullWidth isLoading={isSubmitting}>
        Entrar
      </Button>
    </Form>
  );
}
