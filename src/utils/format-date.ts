const DATE = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATE_TIME = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formata uma data da API. Datas sem hora (`AAAA-MM-DD`, ex.: competência) são lidas como data local, para não
 * voltar um dia por causa do fuso.
 *
 * @example
 * formatDate('2026-10-01');                 // '01/10/2026'
 * formatDate('2026-10-23T03:40:01.591Z');   // '23/10/2026' (no fuso local)
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  if (DATE_ONLY.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : DATE.format(date);
}

/** Data e hora no fuso local (`23/10/2026, 00:40`). */
export function formatDateTime(value: string | null | undefined): string {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? DATE_TIME.format(date) : '';
}

const WEEKDAY = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

/**
 * Período curto de um evento do cronograma (`13/12`, `15/12 a 16/12/26`).
 *
 * @example
 * formatPeriod('2026-12-13');                 // '13/12/2026'
 * formatPeriod('2026-12-15', '2026-12-16');   // '15/12 a 16/12/2026'
 */
export function formatPeriod(start: string, end?: string): string {
  if (!end || end === start) {
    return formatDate(start);
  }
  const [startYear, startMonth, startDay] = start.split('-');
  const isSameYear = startYear === end.slice(0, 4);
  return `${startDay}/${startMonth}${isSameYear ? '' : `/${startYear}`} a ${formatDate(end)}`;
}

/** Dia da semana abreviado de uma data `AAAA-MM-DD` (`dom.`). */
export function formatWeekday(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return WEEKDAY.format(new Date(year, month - 1, day));
}
