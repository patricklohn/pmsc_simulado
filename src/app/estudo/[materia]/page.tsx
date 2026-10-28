import type { Metadata } from 'next';
import { StudySubjectPage } from '@screens/study-subject';

export const metadata: Metadata = { title: 'Matéria' };

export default function Page() {
  return <StudySubjectPage />;
}
