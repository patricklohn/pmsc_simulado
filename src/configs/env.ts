/**
 * Variáveis de ambiente do servidor (API e scripts de banco). Lidas sob demanda: o build do Next não precisa delas.
 * Local: `.env.local`. Produção: variáveis do projeto na Vercel.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida (veja .env-example)`);
  }
  return value;
}

const numberOr = (name: string, fallback: number) => Number(process.env[name] ?? fallback);

export const Env = {
  get DB_HOST() {
    return required('DB_HOST');
  },
  get DB_PORT() {
    return numberOr('DB_PORT', 5432);
  },
  get DB_USER() {
    return required('DB_USER');
  },
  get DB_PASSWORD() {
    return required('DB_PASSWORD');
  },
  get DB_NAME() {
    return process.env.DB_NAME ?? 'postgres';
  },
  /** Supabase exige SSL. Desligue (`false`) só para um Postgres local. */
  get DB_SSL() {
    return process.env.DB_SSL !== 'false';
  },
  /** Conexões por instância. Na Vercel cada função tem a sua pool, então o número fica baixo. */
  get MAX_DB_CONNECTIONS() {
    return numberOr('MAX_DB_CONNECTIONS', 3);
  },
  /** Segredo do access token (JWT HS256). Gere com `openssl rand -base64 48`. */
  get JWT_SECRET() {
    return required('JWT_SECRET');
  },
  /** Validade do access token (formato do `jose`: `15m`, `1h`). */
  get JWT_EXPIRES_IN() {
    return process.env.JWT_EXPIRES_IN ?? '60m';
  },
  get REFRESH_TOKEN_EXPIRES_DAYS() {
    return numberOr('REFRESH_TOKEN_EXPIRES_DAYS', 30);
  },
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === 'production';
  },
};
