'use client';

import Link from 'next/link';
import {
  LuArrowRight,
  LuBookOpen,
  LuCalendarDays,
  LuClipboardCheck,
  LuFileQuestion,
  LuGraduationCap,
  LuTarget,
  LuTrophy,
} from 'react-icons/lu';
import { ROUTES } from '@shell/routes';
import { Alert } from '@components/alert';
import { PageHeader } from '@components/page-header';
import { Section } from '@components/section';
import { Stat } from '@components/stat';
import { StatusBadge } from '@components/status-badge';
import { useAuth } from '@contexts/auth';
import { useContent } from '@contexts/content';
import { useStudyProgress } from '@contexts/study-progress';
import { useNow } from '@hooks/use-now';
import { useExamOverview } from '@hooks/use-exams';
import { formatPeriod, formatWeekday } from '@utils/format-date';
import { daysBetween } from '@utils/format-duration';
import { getEventStatus, toIsoDate, upcomingEvents } from '@utils/schedule';
import {
  Countdown,
  CountdownDays,
  CountdownText,
  EventDate,
  EventItem,
  EventList,
  Hero,
  HeroInfo,
  ShortcutCard,
  ShortcutDescription,
  ShortcutGrid,
  ShortcutIcon,
  ShortcutTitle,
  Stats,
} from './styles';

const SHORTCUTS = [
  {
    to: ROUTES.calendar,
    title: 'Calendário',
    description: 'Todas as datas do edital, as fases do concurso e as tabelas do TAF.',
    icon: <LuCalendarDays />,
  },
  {
    to: ROUTES.study,
    title: 'Estudo',
    description: 'Grade completa das matérias com resumos, pegadinhas e o que mais cai.',
    icon: <LuBookOpen />,
  },
  {
    to: ROUTES.exams,
    title: 'Simulado',
    description: 'Prova no formato AOCP: 60 questões, cronômetro e nota no final.',
    icon: <LuClipboardCheck />,
  },
] as const;

/** Tela inicial: contagem regressiva, próximas datas, atalhos e resumo do progresso. */
export function HomePage() {
  const now = useNow();
  const today = toIsoDate(now);
  const { countDone } = useStudyProgress();
  const { me } = useAuth();
  const { notice: NOTICE, schedule, subjects: SUBJECTS, questionCounts } = useContent();
  const { data: overview } = useExamOverview();
  const daysLeft = daysBetween(today, NOTICE.dataProva);
  const events = upcomingEvents(schedule, today, 4);
  const history = overview?.history ?? [];
  const lastExam = history[0];
  const currentExam = overview?.current;
  const allTopicIds = SUBJECTS.flatMap((subject) => subject.topicos.map((topic) => topic.id));
  const doneCount = countDone(allTopicIds);

  return (
    <>
      <PageHeader
        title={me ? `Olá, ${me.name.split(' ')[0]}` : NOTICE.titulo}
        subtitle={`${NOTICE.titulo} · ${NOTICE.edital} · ${NOTICE.banca}`}
      />

      {currentExam && (
        <Alert tone="warning">
          Você tem um simulado em andamento. <Link href={ROUTES.exam}>Continuar prova</Link>
        </Alert>
      )}

      <Hero>
        <Countdown>
          {daysLeft > 0 ? (
            <>
              <CountdownDays>{daysLeft}</CountdownDays>
              <CountdownText>{daysLeft === 1 ? 'dia para a prova' : 'dias para a prova'}</CountdownText>
            </>
          ) : daysLeft === 0 ? (
            <CountdownText>A prova é hoje. Boa prova!</CountdownText>
          ) : (
            <CountdownText>A prova objetiva já aconteceu</CountdownText>
          )}
        </Countdown>
        <HeroInfo>
          <strong>Prova objetiva e redação</strong>
          <span>
            {formatPeriod(NOTICE.dataProva)} ({formatWeekday(NOTICE.dataProva)}) · {NOTICE.duracaoProvaHoras} horas ·{' '}
            {NOTICE.provaObjetiva.totalQuestoes} questões
          </span>
          <span>
            {NOTICE.vagas} vagas · {NOTICE.cargo}
          </span>
        </HeroInfo>
      </Hero>

      <ShortcutGrid>
        {SHORTCUTS.map((shortcut) => (
          <ShortcutCard key={shortcut.to} href={shortcut.to}>
            <ShortcutIcon aria-hidden>{shortcut.icon}</ShortcutIcon>
            <ShortcutTitle>
              {shortcut.title} <LuArrowRight aria-hidden />
            </ShortcutTitle>
            <ShortcutDescription>{shortcut.description}</ShortcutDescription>
          </ShortcutCard>
        ))}
      </ShortcutGrid>

      <Section title="Próximas datas" action={<Link href={ROUTES.calendar}>Ver calendário</Link>}>
        <EventList>
          {events.map((event) => (
            <EventItem key={event.id}>
              <EventDate>{formatPeriod(event.inicio, event.fim)}</EventDate>
              <span>{event.titulo}</span>
              {getEventStatus(event, today) === 'hoje' && <StatusBadge tone="success">Em andamento</StatusBadge>}
            </EventItem>
          ))}
        </EventList>
      </Section>

      <Section title="Seu progresso">
        <Stats>
          <Stat
            label="Tópicos estudados"
            value={`${doneCount} de ${allTopicIds.length}`}
            icon={<LuGraduationCap />}
            tone="secondary"
          />
          <Stat
            label="Último simulado"
            value={lastExam ? `${lastExam.percent}%` : '—'}
            hint={lastExam ? `${lastExam.correct} de ${lastExam.total} questões` : 'Faça o primeiro simulado'}
            icon={<LuTarget />}
            tone={lastExam && !lastExam.isApproved ? 'warning' : 'primary'}
          />
          <Stat label="Simulados feitos" value={history.length} icon={<LuTrophy />} />
          <Stat label="Questões no banco" value={questionCounts.total} icon={<LuFileQuestion />} tone="secondary" />
        </Stats>
      </Section>
    </>
  );
}
