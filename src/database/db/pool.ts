import { Pool, types } from 'pg';
import { Env } from '@/configs/env';

// `date` volta como texto `AAAA-MM-DD`: sem conversão para Date no fuso local, que pode mudar o dia
types.setTypeParser(types.builtins.DATE, (value) => value);

/**
 * Pool do Postgres (Supabase pelo pooler em modo transação, porta 6543). O `pg` não usa prepared statements
 * nomeados por padrão, então funciona com o pooler.
 */
export function createPool(): Pool {
  return new Pool({
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    user: Env.DB_USER,
    password: Env.DB_PASSWORD,
    database: Env.DB_NAME,
    ssl: Env.DB_SSL ? { rejectUnauthorized: false } : undefined,
    max: Env.MAX_DB_CONNECTIONS,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 10_000,
  });
}
