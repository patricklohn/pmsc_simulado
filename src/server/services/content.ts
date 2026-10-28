import 'server-only';
import { sql } from 'kysely';
import { getDb } from '@/database/db/kysely';
import type { iContent } from '@/types/content';
import type { iNotice } from '@/types/notice';
import type { tAreaId, tSubjectId } from '@/types/subject';
import { HTTP_STATUS, ServiceError } from '../errors';
import type { iScoringContext } from '../rules/scoring';

/** Conteúdo muda pouco: cada instância do servidor guarda por alguns segundos para não consultar o banco sempre. */
const CACHE_MS = 30_000;
let cache: { content: iContent; loadedAt: number } | undefined;

/** Conteúdo do app montado a partir do banco, no mesmo formato que as telas usam. */
export class ContentService {
  static async load(): Promise<iContent> {
    if (cache && Date.now() - cache.loadedAt < CACHE_MS) {
      return cache.content;
    }
    const content = await this.fetch();
    cache = { content, loadedAt: Date.now() };
    return content;
  }

  /** Áreas e ordem das matérias, para a correção. */
  static async scoringContext(): Promise<iScoringContext> {
    const { notice } = await this.load();
    return {
      areaOfSubject: Object.fromEntries(
        notice.provaObjetiva.areas.flatMap((area) => area.materias.map((subjectId) => [subjectId, area.id]))
      ),
      subjectOrder: notice.provaObjetiva.distribuicao.map((item) => item.materia),
      areaOrder: notice.provaObjetiva.areas.map((area) => area.id),
    };
  }

  private static async fetch(): Promise<iContent> {
    const db = getDb();
    const [contest, areas, subjects, topics, groups, events, tafTests, guide, themes, counts] = await Promise.all([
      db.selectFrom('contest').selectAll().where('id', '=', 1).executeTakeFirst(),
      db.selectFrom('area').selectAll().orderBy('position').execute(),
      db.selectFrom('subject').selectAll().orderBy('position').execute(),
      db.selectFrom('topic').selectAll().orderBy('subject_id').orderBy('position').execute(),
      db.selectFrom('schedule_group').selectAll().orderBy('position').execute(),
      db
        .selectFrom('schedule_event')
        .selectAll()
        .orderBy('group_id')
        .orderBy('position')
        .orderBy('starts_on')
        .execute(),
      db.selectFrom('taf_test').selectAll().orderBy('position').execute(),
      db.selectFrom('essay_guide').selectAll().where('id', '=', 1).executeTakeFirst(),
      db.selectFrom('essay_theme').selectAll().where('is_active', '=', true).orderBy('position').execute(),
      db
        .selectFrom('question')
        .select(['subject_id', 'topic_id', sql<string>`count(*)`.as('count')])
        .where('is_active', '=', true)
        .groupBy(['subject_id', 'topic_id'])
        .execute(),
    ]);

    if (!contest) {
      throw new ServiceError(
        HTTP_STATUS.notFound,
        'CONTENT_NOT_LOADED',
        'O conteúdo ainda não foi carregado no banco (pnpm migrate:seed 01_content).'
      );
    }

    const notice: iNotice = {
      titulo: contest.title,
      edital: contest.notice_code,
      orgao: contest.organ,
      banca: contest.board,
      siteBanca: contest.board_site,
      cargo: contest.role,
      codigoCargo: contest.role_code,
      vagas: contest.vacancies,
      remuneracao: Number(contest.salary),
      auxilioAlimentacao: Number(contest.food_allowance),
      taxa: Number(contest.fee),
      escolaridade: contest.education,
      validade: contest.validity,
      dataProva: contest.exam_date,
      duracaoProvaHoras: contest.exam_duration_hours,
      observacoesVagas: contest.vacancy_notes,
      cidadesProva: contest.exam_cities,
      requisitos: contest.requirements,
      fases: contest.phases,
      provaObjetiva: {
        ...contest.objective_rules,
        areas: areas.map((area) => ({
          id: area.id as tAreaId,
          nome: area.name,
          materias: subjects.filter((s) => s.area_id === area.id).map((s) => s.id as tSubjectId),
        })),
        distribuicao: subjects
          .filter((subject) => subject.exam_questions > 0)
          .map((subject) => ({ materia: subject.id as tSubjectId, questoes: subject.exam_questions })),
      },
      redacao: contest.essay_rules,
      notaFinal: contest.final_score,
      taf: {
        ...contest.taf_info,
        testes: tafTests.map((test) => ({
          id: test.id,
          nome: test.name,
          publico: test.audience,
          descricao: test.description,
          unidade: test.unit,
          tabela: test.score_table,
        })),
      },
    };

    const bySubject: Record<string, number> = {};
    const byTopic: Record<string, number> = {};
    let total = 0;
    for (const row of counts) {
      const count = Number(row.count);
      total += count;
      bySubject[row.subject_id] = (bySubject[row.subject_id] ?? 0) + count;
      if (row.topic_id) byTopic[row.topic_id] = (byTopic[row.topic_id] ?? 0) + count;
    }

    return {
      notice,
      schedule: {
        aviso: contest.schedule_notice,
        grupos: groups.map((group) => ({
          id: group.id,
          titulo: group.title,
          eventos: events
            .filter((event) => event.group_id === group.id)
            .map((event) => ({
              id: event.id,
              titulo: event.title,
              inicio: event.starts_on,
              ...(event.ends_on ? { fim: event.ends_on } : {}),
              destaque: event.is_highlight,
            })),
        })),
      },
      subjects: subjects.map((subject) => ({
        id: subject.id as tSubjectId,
        nome: subject.name,
        area: subject.area_id as tAreaId,
        questoesNaProva: subject.exam_questions,
        conteudoEdital: subject.edital_content,
        visaoGeral: subject.overview,
        dicas: subject.tips,
        fontesEstudo: subject.study_links,
        topicos: topics
          .filter((topic) => topic.subject_id === subject.id)
          .map((topic) => ({
            id: topic.id,
            titulo: topic.title,
            maisCobrado: topic.is_hot,
            resumo: topic.summary,
            pontosChave: topic.key_points,
            pegadinhas: topic.traps,
            referencias: topic.legal_refs,
          })),
      })),
      essay: {
        orientacoes: guide?.guidelines ?? [],
        criterios: guide?.criteria ?? [],
        dicas: guide?.tips ?? [],
        estrutura: guide?.structure ?? [],
        temas: themes.map((theme) => ({
          id: theme.id,
          titulo: theme.title,
          eixo: theme.axis,
          proposta: theme.proposal,
          textosMotivadores: theme.motivating_texts,
        })),
      },
      questionCounts: { total, bySubject, byTopic },
    };
  }
}
