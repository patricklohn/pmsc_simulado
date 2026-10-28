import { loadContentFiles } from './content-files';

const KEYS = ['A', 'B', 'C', 'D', 'E'];
const { notice, schedule, subjects, questions, essay } = loadContentFiles();
const SUBJECT_IDS = notice.provaObjetiva.distribuicao.map((item) => item.materia);

/** Confere os arquivos do seed inicial: um erro aqui quebraria a carga do banco. */
describe('conteúdo do seed (seeds/data)', () => {
  it('a distribuição do edital soma 60 questões', () => {
    expect(notice.provaObjetiva.distribuicao.reduce((sum, item) => sum + item.questoes, 0)).toBe(60);
  });

  it('cronograma tem datas válidas e o fim nunca antes do início', () => {
    for (const event of schedule.grupos.flatMap((group) => group.eventos)) {
      expect(event.inicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (event.fim) expect(event.fim >= event.inicio).toBe(true);
    }
  });

  it('matérias têm id conhecido e tópicos com id único', () => {
    const topicIds = subjects.flatMap((subject) => subject.topicos.map((topic) => topic.id));
    expect(new Set(topicIds).size).toBe(topicIds.length);
    for (const subject of subjects) {
      expect(SUBJECT_IDS).toContain(subject.id);
      expect(subject.topicos.length).toBeGreaterThan(0);
    }
  });

  it('questões têm id único, 5 alternativas preenchidas, gabarito válido e tópico existente', () => {
    const ids = questions.map((question) => question.id);
    const topicIds = new Set(subjects.flatMap((subject) => subject.topicos.map((topic) => topic.id)));
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of questions) {
      expect(SUBJECT_IDS, question.id).toContain(question.materia);
      expect(Object.keys(question.alternativas).sort(), question.id).toEqual(KEYS);
      expect(
        Object.values(question.alternativas).every((text) => text.trim().length > 0),
        question.id
      ).toBe(true);
      expect(KEYS, question.id).toContain(question.correta);
      expect(['facil', 'media', 'dificil'], question.id).toContain(question.dificuldade);
      expect(topicIds.has(question.topico), `${question.id} → ${question.topico}`).toBe(true);
    }
  });

  it('cada matéria tem questões suficientes para a prova completa', () => {
    for (const { materia, questoes } of notice.provaObjetiva.distribuicao) {
      expect(questions.filter((question) => question.materia === materia).length, materia).toBeGreaterThanOrEqual(
        questoes
      );
    }
  });

  it('redação tem temas com proposta e textos motivadores', () => {
    expect(essay.temas.length).toBeGreaterThan(0);
    for (const theme of essay.temas) {
      expect(theme.proposta).toBeTruthy();
      expect(theme.textosMotivadores.length).toBeGreaterThan(0);
    }
  });
});
