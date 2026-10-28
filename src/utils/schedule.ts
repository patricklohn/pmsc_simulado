import type { iSchedule, iScheduleEvent } from '@/types/notice';

export type tEventStatus = 'passado' | 'hoje' | 'futuro';

/** Data local no formato AAAA-MM-DD (o cronograma usa datas sem hora). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Situação do evento em relação a `today`: em andamento conta como `hoje`. */
export function getEventStatus(event: iScheduleEvent, today: string): tEventStatus {
  const end = event.fim ?? event.inicio;
  if (end < today) return 'passado';
  if (event.inicio > today) return 'futuro';
  return 'hoje';
}

export interface iFlatEvent extends iScheduleEvent {
  groupTitle: string;
}

/** Eventos em andamento hoje e os próximos, até `limit`, em ordem de data. */
export function upcomingEvents(schedule: iSchedule, today: string, limit = 3): iFlatEvent[] {
  return schedule.grupos
    .flatMap((group) => group.eventos.map((event) => ({ ...event, groupTitle: group.titulo })))
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
    .filter((event) => getEventStatus(event, today) !== 'passado')
    .slice(0, limit);
}
