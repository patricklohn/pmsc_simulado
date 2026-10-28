import { type Kysely, sql } from 'kysely';

/**
 * Cria a função `set_updated_at()` (compartilhada pelos triggers) e a tabela `user`: quem estuda no app.
 *
 * - Cadastro aberto, mas o usuário nasce `pending`: só entra depois que um administrador muda para `active`
 *   direto no banco (`UPDATE "user" SET status = 'active' WHERE email = '...'`).
 * - `blocked` tira o acesso na hora (o usuário é conferido no banco a cada requisição).
 * - `role = 'admin'` fica reservado para telas de administração futuras.
 * - O Supabase está no Postgres 17 (sem `uuidv7()`), por isso `gen_random_uuid()`.
 *
 * `user` é palavra reservada no PostgreSQL: o Kysely sempre usa aspas, e o SQL manual também precisa delas.
 * RLS ligado e sem políticas em todas as tabelas: a chave pública do Supabase não acessa nada; só a API do app.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  await db.schema
    .createTable('user')
    .addColumn('uuid', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().check(sql`email = lower(email)`))
    .addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(30)', (col) =>
      col
        .notNull()
        .defaultTo('student')
        .check(sql`role IN ('student', 'admin')`)
    )
    .addColumn('status', 'varchar(30)', (col) =>
      col
        .notNull()
        .defaultTo('pending')
        .check(sql`status IN ('pending', 'active', 'blocked')`)
    )
    .addColumn('approved_at', 'timestamptz')
    .addColumn('last_login_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('deleted_at', 'timestamptz')
    .execute();

  // E-mail é o login: único entre usuários não excluídos
  await db.schema
    .createIndex('user_email_unique')
    .on('user')
    .column('email')
    .unique()
    .where(sql.ref('deleted_at'), 'is', null)
    .execute();

  await db.schema.createIndex('user_status_idx').on('user').column('status').execute();

  await sql`
    CREATE TRIGGER user_set_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `.execute(db);

  // Ao liberar o usuário (pending → active), grava quando foi
  await sql`
    CREATE OR REPLACE FUNCTION set_user_approved_at() RETURNS trigger AS $$
    BEGIN
      IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' AND NEW.approved_at IS NULL THEN
        NEW.approved_at = now();
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  await sql`
    CREATE TRIGGER user_set_approved_at
    BEFORE UPDATE OF status ON "user"
    FOR EACH ROW EXECUTE FUNCTION set_user_approved_at();
  `.execute(db);

  await sql`ALTER TABLE "user" ENABLE ROW LEVEL SECURITY`.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').ifExists().cascade().execute();
  await sql`DROP FUNCTION IF EXISTS set_user_approved_at();`.execute(db);
  await sql`DROP FUNCTION IF EXISTS set_updated_at();`.execute(db);
}
