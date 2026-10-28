'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@components/alert';
import { Button } from '@components/button';
import { TextField } from '@components/text-field';
import { setFormError } from '../form-error';
import { Form } from '../styles';

/** Só formato; os mesmos limites da API para o usuário não esperar um erro que já dá para avisar. */
const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome').max(255),
    email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
    password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres').max(72, 'No máximo 72 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

export type tRegisterFormValues = z.infer<typeof registerSchema>;

interface iRegisterFormProps {
  onSubmit: (values: tRegisterFormValues) => Promise<void>;
}

/** Formulário de cadastro (nome, e-mail e senha). */
export function RegisterForm({ onSubmit }: iRegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<tRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

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
      <TextField label="Seu nome" autoComplete="name" error={errors.name?.message} {...register('name')} />
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
        autoComplete="new-password"
        hint="De 8 a 72 caracteres"
        error={errors.password?.message}
        {...register('password')}
      />
      <TextField
        label="Confirme a senha"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" isFullWidth isLoading={isSubmitting}>
        Criar cadastro
      </Button>
    </Form>
  );
}
