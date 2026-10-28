import { getDb } from './kysely';
import { createMigrator, logMigrationHint, logResults } from './migrator';

/** `pnpm migrate:down`: reverte a última migration aplicada. */
async function migrateDown() {
  const db = getDb();
  let failure: unknown;
  try {
    const { error, results } = await createMigrator().migrateDown();
    logResults(results, 'rollback');
    failure = error;
  } catch (error) {
    failure = error;
  } finally {
    await db.destroy();
  }
  if (failure) {
    console.error('❌ Falha ao reverter migration');
    console.error(failure);
    logMigrationHint(failure);
    process.exit(1);
  }
}

migrateDown();
