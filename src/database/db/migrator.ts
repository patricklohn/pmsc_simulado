import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { FileMigrationProvider, Migrator, type MigrationResult } from 'kysely';
import { getDb } from './kysely';

/** Schema da tabela de controle das migrations (mesmo padrão dos backends). */
export const MIGRATION_SCHEMA = 'kysely';

export function createMigrator(): Migrator {
  return new Migrator({
    db: getDb(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(import.meta.dirname, '../migrations'),
    }),
    migrationTableSchema: MIGRATION_SCHEMA,
  });
}

/** Mostra o resultado de cada migration no terminal. */
export function logResults(results: MigrationResult[] | undefined, action: 'migration' | 'rollback') {
  if (!results || results.length === 0) {
    console.info(action === 'migration' ? 'ℹ️  Nenhuma migration pendente' : 'ℹ️  Nenhuma migration para reverter');
  }
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.info(`✅ ${action} "${it.migrationName}" executada com sucesso`);
    } else if (it.status === 'Error') {
      console.error(`❌ falha em ${action} "${it.migrationName}"`);
    } else {
      console.warn(`⏭️  ${action} "${it.migrationName}" não executada (a anterior falhou)`);
    }
  });
}

/** Dicas para os erros de conexão mais comuns. */
export function logMigrationHint(error: unknown) {
  const dbError = error as { code?: string; message?: string };
  if (dbError?.code === '28P01') {
    console.error('Dica: senha recusada. Confira DB_USER e DB_PASSWORD no .env.local.');
  } else if (dbError?.message?.includes('Tenant or user not found')) {
    console.error('Dica: usuário do pooler é `postgres.<project-ref>` e o host depende da região do projeto.');
  } else if (dbError?.code === 'ENOTFOUND' || dbError?.code === 'ENETUNREACH') {
    console.error('Dica: use o host do pooler (aws-…pooler.supabase.com): o host direto do Supabase só tem IPv6.');
  }
}
