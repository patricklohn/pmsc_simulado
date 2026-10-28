import type { Metadata } from 'next';
import { RegisterPage } from '@screens/register';

export const metadata: Metadata = { title: 'Criar cadastro' };

export default function Page() {
  return <RegisterPage />;
}
