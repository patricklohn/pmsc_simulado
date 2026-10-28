import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExamSetupPage } from '@screens/exam-setup';

export const metadata: Metadata = { title: 'Simulado' };

export default function Page() {
  return (
    <Suspense>
      <ExamSetupPage />
    </Suspense>
  );
}
