import type { Kysely } from 'kysely';
import type { DB } from '../db/model';
import { eDifficulty } from '../db/model';
import { loadContentFiles } from './content-files';

const json = (value: unknown) => JSON.stringify(value);

/**
 * Carrega o conteúdo inicial (edital, cronograma, TAF, matérias, tópicos, questões e redação) a partir de
 * `seeds/data`. Pode rodar de novo: cada linha é inserida ou atualizada pelo id.
 *
 * Atenção: rodar de novo **sobrescreve** as linhas com o mesmo id que foram editadas no banco. Linhas criadas só
 * no banco (ids novos) não são tocadas.
 */
export default async function seedContent(db: Kysely<DB>): Promise<void> {
  const { notice, schedule, essay, subjects, questions } = loadContentFiles();
  const examQuestions = new Map(
    notice.provaObjetiva.distribuicao.map((item, index) => [item.materia, { ...item, index }])
  );

  await db.transaction().execute(async (trx) => {
    // Áreas de conhecimento
    for (const [position, area] of notice.provaObjetiva.areas.entries()) {
      await trx
        .insertInto('area')
        .values({ id: area.id, name: area.nome, position })
        .onConflict((oc) => oc.column('id').doUpdateSet({ name: area.nome, position }))
        .execute();
    }

    // Matérias e tópicos
    for (const subject of subjects) {
      const distribution = examQuestions.get(subject.id);
      const values = {
        area_id: subject.area,
        name: subject.nome,
        exam_questions: distribution?.questoes ?? subject.questoesNaProva,
        position: distribution?.index ?? 99,
        edital_content: subject.conteudoEdital,
        overview: subject.visaoGeral,
        tips: json(subject.dicas),
        study_links: json(subject.fontesEstudo),
      };
      await trx
        .insertInto('subject')
        .values({ id: subject.id, ...values })
        .onConflict((oc) => oc.column('id').doUpdateSet(values))
        .execute();

      for (const [position, topic] of subject.topicos.entries()) {
        const topicValues = {
          subject_id: subject.id,
          position,
          title: topic.titulo,
          is_hot: topic.maisCobrado,
          summary: topic.resumo,
          key_points: json(topic.pontosChave),
          traps: json(topic.pegadinhas),
          legal_refs: json(topic.referencias),
        };
        await trx
          .insertInto('topic')
          .values({ id: topic.id, ...topicValues })
          .onConflict((oc) => oc.column('id').doUpdateSet(topicValues))
          .execute();
      }
    }
    console.info(`  matérias: ${subjects.length}, tópicos: ${subjects.reduce((sum, s) => sum + s.topicos.length, 0)}`);

    // Questões (em lotes)
    const rows = questions.map((question) => ({
      id: question.id,
      subject_id: question.materia,
      topic_id: question.topico,
      statement: question.enunciado,
      alternatives: json(question.alternativas),
      correct_option: question.correta,
      explanation: question.comentario,
      source: question.fonte,
      difficulty: question.dificuldade as eDifficulty,
    }));
    for (let start = 0; start < rows.length; start += 100) {
      await trx
        .insertInto('question')
        .values(rows.slice(start, start + 100))
        .onConflict((oc) =>
          oc.column('id').doUpdateSet((eb) => ({
            subject_id: eb.ref('excluded.subject_id'),
            topic_id: eb.ref('excluded.topic_id'),
            statement: eb.ref('excluded.statement'),
            alternatives: eb.ref('excluded.alternatives'),
            correct_option: eb.ref('excluded.correct_option'),
            explanation: eb.ref('excluded.explanation'),
            source: eb.ref('excluded.source'),
            difficulty: eb.ref('excluded.difficulty'),
          }))
        )
        .execute();
    }
    console.info(`  questões: ${rows.length}`);

    // Concurso (linha única)
    const contest = {
      title: notice.titulo,
      notice_code: notice.edital,
      organ: notice.orgao,
      board: notice.banca,
      board_site: notice.siteBanca,
      role: notice.cargo,
      role_code: notice.codigoCargo,
      vacancies: notice.vagas,
      salary: notice.remuneracao,
      food_allowance: notice.auxilioAlimentacao,
      fee: notice.taxa,
      education: notice.escolaridade,
      validity: notice.validade,
      exam_date: notice.dataProva,
      exam_duration_hours: notice.duracaoProvaHoras,
      vacancy_notes: json(notice.observacoesVagas),
      exam_cities: json(notice.cidadesProva),
      requirements: json(notice.requisitos),
      phases: json(notice.fases),
      objective_rules: json({
        totalQuestoes: notice.provaObjetiva.totalQuestoes,
        alternativas: notice.provaObjetiva.alternativas,
        valorQuestao: notice.provaObjetiva.valorQuestao,
        criterioAprovacao: notice.provaObjetiva.criterioAprovacao,
        observacao: notice.provaObjetiva.observacao,
      }),
      essay_rules: json(notice.redacao),
      final_score: json(notice.notaFinal),
      taf_info: json({ local: notice.taf.local, observacoes: notice.taf.observacoes }),
      schedule_notice: schedule.aviso,
    };
    await trx
      .insertInto('contest')
      .values({ id: 1, ...contest })
      .onConflict((oc) => oc.column('id').doUpdateSet(contest))
      .execute();

    // TAF
    for (const [position, test] of notice.taf.testes.entries()) {
      const values = {
        name: test.nome,
        audience: test.publico,
        description: test.descricao,
        unit: test.unidade,
        score_table: json(test.tabela),
        position,
      };
      await trx
        .insertInto('taf_test')
        .values({ id: test.id, ...values })
        .onConflict((oc) => oc.column('id').doUpdateSet(values))
        .execute();
    }

    // Cronograma
    for (const [groupPosition, group] of schedule.grupos.entries()) {
      await trx
        .insertInto('schedule_group')
        .values({ id: group.id, title: group.titulo, position: groupPosition })
        .onConflict((oc) => oc.column('id').doUpdateSet({ title: group.titulo, position: groupPosition }))
        .execute();
      for (const [position, event] of group.eventos.entries()) {
        const values = {
          group_id: group.id,
          title: event.titulo,
          starts_on: event.inicio,
          ends_on: event.fim ?? null,
          is_highlight: event.destaque,
          position,
        };
        await trx
          .insertInto('schedule_event')
          .values({ id: event.id, ...values })
          .onConflict((oc) => oc.column('id').doUpdateSet(values))
          .execute();
      }
    }

    // Redação
    const guide = {
      guidelines: json(essay.orientacoes),
      criteria: json(essay.criterios),
      tips: json(essay.dicas),
      structure: json(essay.estrutura),
    };
    await trx
      .insertInto('essay_guide')
      .values({ id: 1, ...guide })
      .onConflict((oc) => oc.column('id').doUpdateSet(guide))
      .execute();
    for (const [position, theme] of essay.temas.entries()) {
      const values = {
        title: theme.titulo,
        axis: theme.eixo,
        proposal: theme.proposta,
        motivating_texts: json(theme.textosMotivadores),
        position,
      };
      await trx
        .insertInto('essay_theme')
        .values({ id: theme.id, ...values })
        .onConflict((oc) => oc.column('id').doUpdateSet(values))
        .execute();
    }
  });
}
