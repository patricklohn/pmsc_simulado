import type { iSchedule } from '@/types/notice';
import { getEventStatus, toIsoDate, upcomingEvents } from './schedule';

const SCHEDULE: iSchedule = {
  aviso: '',
  grupos: [
    {
      id: 'g',
      titulo: 'Grupo',
      eventos: [
        { id: 'a', titulo: 'Inscrições', inicio: '2026-10-26', fim: '2026-11-16', destaque: true },
        { id: 'b', titulo: 'Prova', inicio: '2026-12-13', destaque: true },
        { id: 'c', titulo: 'Edital', inicio: '2026-10-20', destaque: false },
      ],
    },
  ],
};

describe('cronograma', () => {
  it('classifica passado, em andamento e futuro', () => {
    const [inscricoes, prova, edital] = SCHEDULE.grupos[0].eventos;
    expect(getEventStatus(inscricoes, '2026-11-01')).toBe('hoje');
    expect(getEventStatus(prova, '2026-11-01')).toBe('futuro');
    expect(getEventStatus(edital, '2026-11-01')).toBe('passado');
  });

  it('lista os próximos em ordem de data, sem os passados', () => {
    expect(upcomingEvents(SCHEDULE, '2026-11-01').map((event) => event.id)).toEqual(['a', 'b']);
  });

  it('data local em AAAA-MM-DD', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
