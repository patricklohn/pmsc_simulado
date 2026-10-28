import type { iEssayData } from './essay';
import type { iNotice, iSchedule } from './notice';
import type { iSubject } from './subject';

/** Todo o conteúdo do app (`GET /api/conteudo`), lido do banco. As questões ficam de fora (vêm no simulado). */
export interface iContent {
  notice: iNotice;
  schedule: iSchedule;
  subjects: iSubject[];
  essay: iEssayData;
  questionCounts: {
    total: number;
    bySubject: Record<string, number>;
    byTopic: Record<string, number>;
  };
}
