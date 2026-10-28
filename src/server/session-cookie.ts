import 'server-only';
import { cookies } from 'next/headers';
import { Env } from '@/configs/env';
import type { iAuthSession } from '@/types/auth';

const COOKIE_NAME = 'refresh_token';
/** O cookie só vai nas rotas de auth (renovar e sair). */
const COOKIE_PATH = '/api/auth';

/** Grava o refresh token num cookie httpOnly (o JavaScript do app não lê). */
export async function setRefreshCookie(session: iAuthSession) {
  (await cookies()).set(COOKIE_NAME, session.refresh_token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: Env.IS_PRODUCTION,
    path: COOKIE_PATH,
    expires: new Date(session.refresh_token_expires_at),
  });
}

export async function readRefreshCookie(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function clearRefreshCookie() {
  (await cookies()).delete({ name: COOKIE_NAME, path: COOKIE_PATH });
}
