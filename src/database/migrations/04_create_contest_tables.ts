import { type Kysely, sql } from 'kysely';

const TABLES = ['contest', 'schedule_group', 'schedule_event', 'taf_test'] as const;

/**
 * Dados do edital: concurso (uma linha só), cronograma (grupos e eventos) e testes do TAF.
 * Retificação do edital ou data nova: edite as linhas; o app mostra na hora.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('contest')
    // Uma linha só (id = 1)
    .addColumn('id', 'smallint', (col) =>
      col
        .primaryKey()
        .defaultTo(1)
        .check(sql`id = 1`)
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('notice_code', 'varchar(255)', (col) => col.notNull())
    .addColumn('organ', 'varchar(255)', (col) => col.notNull())
    .addColumn('board', 'varchar(255)', (col) => col.notNull())
    .addColumn('board_site', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(255)', (col) => col.notNull())
    .addColumn('role_code', 'varchar(30)', (col) => col.notNull())
    .addColumn('vacancies', 'integer', (col) => col.notNull())
    .addColumn('salary', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('food_allowance', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('fee', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('education', 'text', (col) => col.notNull())
    .addColumn('validity', 'text', (col) => col.notNull())
    .addColumn('exam_date', 'date', (col) => col.notNull())
    .addColumn('exam_duration_hours', 'integer', (col) => col.notNull())
    .addColumn('vacancy_notes', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('exam_cities', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('requirements', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    // [{ fase, titulo, carater, descricao }]
    .addColumn('phases', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    // { totalQuestoes, alternativas, valorQuestao, criterioAprovacao, observacao }
    .addColumn('objective_rules', 'jsonb', (col) => col.notNull())
    // { pontos, minimo, tipo, formula, corrigidaAte }
    .addColumn('essay_rules', 'jsonb', (col) => col.notNull())
    // { formula, descricao }
    .addColumn('final_score', 'jsonb', (col) => col.notNull())
    // { local, observacoes: [] }
    .addColumn('taf_info', 'jsonb', (col) => col.notNull())
    .addColumn('schedule_notice', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('schedule_group')
    .addColumn('id', 'varchar(60)', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('schedule_event')
    .addColumn('id', 'varchar(80)', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('group_id', 'varchar(60)', (col) =>
      col.notNull().references('schedule_group.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('starts_on', 'date', (col) => col.notNull())
    .addColumn('ends_on', 'date', (col) => col.check(sql`ends_on IS NULL OR ends_on >= starts_on`))
    .addColumn('is_highlight', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('schedule_event_group_idx')
    .on('schedule_event')
    .columns(['group_id', 'position'])
    .execute();

  await db.schema
    .createTable('taf_test')
    .addColumn('id', 'varchar(60)', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('audience', 'varchar(60)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('unit', 'varchar(60)', (col) => col.notNull())
    // [{ masculino?, feminino?, pontos }]
    .addColumn('score_table', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  for (const table of TABLES) {
    await sql`
      CREATE TRIGGER ${sql.raw(`${table}_set_updated_at`)}
      BEFORE UPDATE ON ${sql.table(table)}
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `.execute(db);
    await sql`ALTER TABLE ${sql.table(table)} ENABLE ROW LEVEL SECURITY`.execute(db);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.schema.dropTable(table).ifExists().cascade().execute();
  }
}
