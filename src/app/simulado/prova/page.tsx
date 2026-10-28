import type { Metadata } from 'next';
import { ExamPage } from '@screens/exam';

export const metadata: Metadata = { title: 'Prova' };

export default function Page() {
  return <ExamPage />;
}
