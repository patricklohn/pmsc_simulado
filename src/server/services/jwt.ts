import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { Env } from '@/configs/env';
import type { eUserRole } from '@/database/db/model';

export interface iAccessTokenPayload {
  sub: string;
  role: eUserRole;
}

const secretKey = () => new TextEncoder().encode(Env.JWT_SECRET);

/** Assina o access token (HS256). */
export async function signAccessToken(payload: iAccessTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Env.JWT_EXPIRES_IN)
    .sign(secretKey());
}

/** Confere assinatura e validade. Devolve `null` se o token não serve. */
export async function verifyAccessToken(token: string): Promise<iAccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return typeof payload.sub === 'string' ? { sub: payload.sub, role: payload.role as eUserRole } : null;
  } catch {
    return null;
  }
}
