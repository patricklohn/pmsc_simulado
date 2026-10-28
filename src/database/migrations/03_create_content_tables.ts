import { type Kysely, sql } from 'kysely';

const TABLES = ['area', 'subject', 'topic', 'question'] as const;

/**
 * Conteúdo de estudo: áreas de conhecimento, matérias, tópicos e questões. Para incluir ou corrigir conteúdo, basta
 * inserir ou editar as linhas (ex.: pelo Table Editor do Supabase); o app lê tudo pela API.
 *
 * - `subject.exam_questions` é o número de questões da matéria na prova (Tabela 8.1): monta a prova completa.
 * - `question.id` tem valor padrão: num INSERT manual, pode ser omitido.
 * - Questão com `is_active = false` sai dos simulados novos, mas continua aparecendo no gabarito de provas antigas.
 *   Prefira desativar a apagar.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('area')
    .addColumn('id', 'varchar(30)', (col) => col.primaryKey())
    .addColumn('name', 'varchar(120)', (col) => col.notNull())
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('subject')
    .addColumn('id', 'varchar(60)', (col) => col.primaryKey())
    .addColumn('area_id', 'varchar(30)', (col) => col.notNull().references('area.id').onUpdate('cascade'))
    .addColumn('name', 'varchar(120)', (col) => col.notNull())
    .addColumn('exam_questions', 'integer', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .check(sql`exam_questions >= 0`)
    )
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('edital_content', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('overview', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('tips', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('study_links', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('topic')
    .addColumn('id', 'varchar(80)', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('subject_id', 'varchar(60)', (col) =>
      col.notNull().references('subject.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('is_hot', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('summary', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('key_points', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('traps', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('legal_refs', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('topic_subject_idx').on('topic').columns(['subject_id', 'position']).execute();

  await db.schema
    .createTable('question')
    .addColumn('id', 'varchar(80)', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('subject_id', 'varchar(60)', (col) =>
      col.notNull().references('subject.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('topic_id', 'varchar(80)', (col) => col.references('topic.id').onDelete('set null').onUpdate('cascade'))
    .addColumn('statement', 'text', (col) => col.notNull())
    // { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." }
    .addColumn('alternatives', 'jsonb', (col) =>
      col.notNull().check(sql`jsonb_typeof(alternatives) = 'object' AND alternatives ?& array['A','B','C','D','E']`)
    )
    .addColumn('correct_option', 'char(1)', (col) => col.notNull().check(sql`correct_option IN ('A','B','C','D','E')`))
    .addColumn('explanation', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('source', 'varchar(255)', (col) => col.notNull().defaultTo('Inédita – estilo AOCP'))
    .addColumn('difficulty', 'varchar(10)', (col) =>
      col
        .notNull()
        .defaultTo('media')
        .check(sql`difficulty IN ('facil', 'media', 'dificil')`)
    )
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('question_subject_idx').on('question').columns(['subject_id', 'is_active']).execute();
  await db.schema.createIndex('question_topic_idx').on('question').column('topic_id').execute();

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
