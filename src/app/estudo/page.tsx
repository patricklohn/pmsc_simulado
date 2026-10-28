import type { Metadata } from 'next';
import { StudyPage } from '@screens/study';

export const metadata: Metadata = { title: 'Estudo' };

export default function Page() {
  return <StudyPage />;
}
