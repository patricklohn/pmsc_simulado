import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExamResultPage } from '@screens/exam-result';

export const metadata: Metadata = { title: 'Resultado' };

export default function Page() {
  return (
    <Suspense>
      <ExamResultPage />
    </Suspense>
  );
}
