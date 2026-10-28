'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LuClock } from 'react-icons/lu';
import { Alert } from '@components/alert';
import { AuthLayout } from '@components/auth-layout';
import { useAuth } from '@contexts/auth';
import { RegisterForm } from '@forms/register-form';
import { ROUTES } from '@shell/routes';

/** Cadastro. Depois de enviado, o usuário espera a liberação manual. */
export function RegisterPage() {
  const { register } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  if (registeredEmail) {
    return (
      <AuthLayout
        title="Cadastro enviado"
        footer={
          <>
            Já foi liberado? <Link href={ROUTES.login}>Entrar</Link>
          </>
        }
      >
        <Alert tone="success">
          <LuClock aria-hidden /> Recebemos o cadastro de <strong>{registeredEmail}</strong>. Ele está aguardando
          liberação; assim que for aprovado, é só entrar com o e-mail e a senha.
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar cadastro"
      subtitle="O acesso é liberado depois da aprovação do cadastro."
      footer={
        <>
          Já tem cadastro? <Link href={ROUTES.login}>Entrar</Link>
        </>
      }
    >
      <RegisterForm
        onSubmit={async ({ name, email, password }) => {
          await register({ name, email: email.trim().toLowerCase(), password });
          setRegisteredEmail(email.trim().toLowerCase());
        }}
      />
    </AuthLayout>
  );
}
