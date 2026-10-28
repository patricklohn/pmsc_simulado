import type { Metadata } from 'next';
import { CalendarPage } from '@screens/calendar';

export const metadata: Metadata = { title: 'Calendário' };

export default function Page() {
  return <CalendarPage />;
}
