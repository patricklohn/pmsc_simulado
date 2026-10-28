import type { Metadata } from 'next';
import { ExamHistoryPage } from '@screens/exam-history';

export const metadata: Metadata = { title: 'Histórico' };

export default function Page() {
  return <ExamHistoryPage />;
}
