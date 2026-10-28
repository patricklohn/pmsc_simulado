import { getDb } from './kysely';
import { MIGRATION_SCHEMA, createMigrator, logMigrationHint, logResults } from './migrator';

/** `pnpm migrate:latest`: aplica todas as migrations pendentes. */
async function migrateToLatest() {
  const db = getDb();
  let failure: unknown;
  try {
    await db.schema.createSchema(MIGRATION_SCHEMA).ifNotExists().execute();
    const { error, results } = await createMigrator().migrateToLatest();
    logResults(results, 'migration');
    failure = error;
  } catch (error) {
    failure = error;
  } finally {
    await db.destroy();
  }
  if (failure) {
    console.error('❌ Falha ao rodar migrations');
    console.error(failure);
    logMigrationHint(failure);
    process.exit(1);
  }
}

migrateToLatest();
