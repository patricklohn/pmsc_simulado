import { type Kysely, sql } from 'kysely';

/**
 * Cria a tabela `refresh_token` (mesmo modelo do facilita_mei_api): tokens opacos de longa duração que trocam por
 * um novo access token sem pedir a senha de novo.
 *
 * - Só o hash sha256 do token é gravado (`token_hash`); o valor em texto puro existe apenas na resposta.
 * - Rotação: cada uso revoga o token (`revoked_at`) e aponta para o sucessor (`replaced_by_uuid`).
 * - `family_uuid` agrupa a cadeia de rotações de um mesmo login: reutilizar um token já rotacionado revoga a
 *   família inteira (detecção de roubo).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('refresh_token')
    .addColumn('uuid', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_uuid', 'uuid', (col) => col.notNull().references('user.uuid').onDelete('cascade'))
    .addColumn('family_uuid', 'uuid', (col) => col.notNull())
    .addColumn('token_hash', 'char(64)', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('revoked_at', 'timestamptz')
    .addColumn('replaced_by_uuid', 'uuid', (col) => col.references('refresh_token.uuid').onDelete('set null'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('refresh_token_token_hash_unique', ['token_hash'])
    .execute();

  await db.schema.createIndex('refresh_token_user_uuid_idx').on('refresh_token').column('user_uuid').execute();
  await db.schema.createIndex('refresh_token_family_uuid_idx').on('refresh_token').column('family_uuid').execute();

  await sql`
    CREATE TRIGGER refresh_token_set_updated_at
    BEFORE UPDATE ON refresh_token
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `.execute(db);

  await sql`ALTER TABLE refresh_token ENABLE ROW LEVEL SECURITY`.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('refresh_token').ifExists().cascade().execute();
}
