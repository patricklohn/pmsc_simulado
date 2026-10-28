import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './model';
import { createPool } from './pool';

type tTransactionTrx = Kysely<DB>;

declare global {
  var pmscDb: Kysely<DB> | undefined;
}

/**
 * Instância do Kysely, criada no primeiro uso e reaproveitada entre requisições (e entre recargas do `next dev`).
 */
export function getDb(): Kysely<DB> {
  globalThis.pmscDb ??= new Kysely<DB>({ dialect: new PostgresDialect({ pool: createPool() }) });
  return globalThis.pmscDb;
}

export type { tTransactionTrx };
