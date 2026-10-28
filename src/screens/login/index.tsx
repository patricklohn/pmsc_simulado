'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@components/auth-layout';
import { useAuth } from '@contexts/auth';
import { LoginForm } from '@forms/login-form';
import { ROUTES } from '@shell/routes';

/** Tela de login. */
export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Simulados, grade de estudos e calendário do concurso Soldado PMSC 2026."
      footer={
        <>
          Ainda não tem cadastro? <Link href={ROUTES.register}>Criar cadastro</Link>
        </>
      }
    >
      <LoginForm
        onSubmit={async (values) => {
          await login(values);
          router.replace(ROUTES.home);
        }}
      />
    </AuthLayout>
  );
}
