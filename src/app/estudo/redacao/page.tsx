import type { Metadata } from 'next';
import { EssayPage } from '@screens/essay';

export const metadata: Metadata = { title: 'Redação' };

export default function Page() {
  return <EssayPage />;
}
