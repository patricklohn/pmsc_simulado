import { type Kysely, sql } from 'kysely';

const TABLES = ['essay_guide', 'essay_theme'] as const;

/** Redação: orientações gerais (uma linha só) e temas de treino. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('essay_guide')
    .addColumn('id', 'smallint', (col) =>
      col
        .primaryKey()
        .defaultTo(1)
        .check(sql`id = 1`)
    )
    .addColumn('guidelines', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    // [{ id, titulo, descricao }]
    .addColumn('criteria', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('tips', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    // [{ parte, descricao }]
    .addColumn('structure', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('essay_theme')
    .addColumn('id', 'varchar(60)', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('axis', 'varchar(255)', (col) => col.notNull())
    .addColumn('proposal', 'text', (col) => col.notNull())
    .addColumn('motivating_texts', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
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
