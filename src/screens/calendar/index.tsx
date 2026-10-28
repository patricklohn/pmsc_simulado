'use client';

import { useState } from 'react';
import { LuCalendarDays, LuDumbbell, LuInfo } from 'react-icons/lu';
import { Alert } from '@components/alert';
import { PageHeader } from '@components/page-header';
import { Tabs } from '@components/tabs';
import { useNow } from '@hooks/use-now';
import { AboutTab } from './about-tab';
import { ScheduleTab } from './schedule-tab';
import { TafTab } from './taf-tab';
import { useContent } from '@contexts/content';
import { toIsoDate } from '@utils/schedule';

type tCalendarTab = 'cronograma' | 'concurso' | 'taf';

const TABS = [
  { value: 'cronograma' as const, label: 'Cronograma', icon: <LuCalendarDays aria-hidden /> },
  { value: 'concurso' as const, label: 'Sobre o concurso', icon: <LuInfo aria-hidden /> },
  { value: 'taf' as const, label: 'TAF', icon: <LuDumbbell aria-hidden /> },
];

/** Calendário do edital (Anexo I), dados do concurso e tabelas do TAF (Anexo V). */
export function CalendarPage() {
  const [tab, setTab] = useState<tCalendarTab>('cronograma');
  const today = toIsoDate(useNow());
  const { notice, schedule } = useContent();

  return (
    <>
      <PageHeader title="Calendário e edital" subtitle={notice.edital} />
      <Tabs items={TABS} value={tab} onChange={setTab} label="Seções do edital" />

      <div role="tabpanel">
        {tab === 'cronograma' && (
          <>
            <Alert tone="info">{schedule.aviso}</Alert>
            <ScheduleTab today={today} />
          </>
        )}
        {tab === 'concurso' && <AboutTab />}
        {tab === 'taf' && <TafTab />}
      </div>
    </>
  );
}
