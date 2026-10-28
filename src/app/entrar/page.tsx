import type { Metadata } from 'next';
import { LoginPage } from '@screens/login';

export const metadata: Metadata = { title: 'Entrar' };

export default function Page() {
  return <LoginPage />;
}
