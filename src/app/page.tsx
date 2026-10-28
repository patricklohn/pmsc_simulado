import type { Metadata } from 'next';
import { HomePage } from '@screens/home';

export const metadata: Metadata = { title: { absolute: 'PMSC Simulado' } };

export default function Page() {
  return <HomePage />;
}
