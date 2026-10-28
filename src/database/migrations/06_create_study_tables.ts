import { type Kysely, sql } from 'kysely';

/**
 * Dados de estudo de cada usuário:
 *
 * - `study_topic`: tópicos marcados como estudados.
 * - `exam`: simulados. Nascem `in_progress` (a API salva as respostas durante a prova, então dá para continuar em
 *   outro aparelho) e viram `finished` na entrega, quando a API calcula a nota. Só um em andamento por usuário.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('study_topic')
    .addColumn('user_uuid', 'uuid', (col) => col.notNull().references('user.uuid').onDelete('cascade'))
    .addColumn('topic_id', 'varchar(80)', (col) =>
      col.notNull().references('topic.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('study_topic_pk', ['user_uuid', 'topic_id'])
    .execute();

  await db.schema
    .createTable('exam')
    .addColumn('uuid', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_uuid', 'uuid', (col) => col.notNull().references('user.uuid').onDelete('cascade'))
    .addColumn('mode', 'varchar(20)', (col) => col.notNull().check(sql`mode IN ('completo', 'materia', 'rapido')`))
    .addColumn('subject_id', 'varchar(60)', (col) =>
      col.references('subject.id').onDelete('set null').onUpdate('cascade')
    )
    .addColumn('status', 'varchar(20)', (col) =>
      col
        .notNull()
        .defaultTo('in_progress')
        .check(sql`status IN ('in_progress', 'finished')`)
    )
    .addColumn('question_ids', 'jsonb', (col) => col.notNull())
    .addColumn('answers', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn('flagged', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('current_index', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('time_limit', 'integer', (col) => col.notNull())
    .addColumn('started_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('deadline_at', 'timestamptz', (col) => col.notNull())
    .addColumn('finished_at', 'timestamptz')
    .addColumn('correct', 'integer')
    .addColumn('total', 'integer')
    .addColumn('percent', 'numeric(5, 1)')
    .addColumn('is_approved', 'boolean')
    .addColumn('by_subject', 'jsonb')
    .addColumn('by_area', 'jsonb')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('exam_user_finished_idx').on('exam').columns(['user_uuid', 'finished_at desc']).execute();

  // Um simulado em andamento por usuário
  await db.schema
    .createIndex('exam_user_in_progress_unique')
    .on('exam')
    .column('user_uuid')
    .unique()
    .where(sql.ref('status'), '=', 'in_progress')
    .execute();

  await sql`
    CREATE TRIGGER exam_set_updated_at
    BEFORE UPDATE ON exam
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `.execute(db);

  await sql`ALTER TABLE study_topic ENABLE ROW LEVEL SECURITY`.execute(db);
  await sql`ALTER TABLE exam ENABLE ROW LEVEL SECURITY`.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('exam').ifExists().execute();
  await db.schema.dropTable('study_topic').ifExists().execute();
}
