import 'server-only';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

/** Mesmo custo do facilita_mei_api. `bcryptjs` gera o mesmo formato do `bcrypt` nativo, sem compilar na Vercel. */
export const SALT_ROUNDS = 12;

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

let dummyHash: Promise<string> | undefined;

/**
 * Hash de um valor aleatório, com o mesmo custo das senhas. O login compara com ele quando o e-mail não existe,
 * para o tempo de resposta não revelar se o usuário existe.
 */
export const getDummyHash = () => (dummyHash ??= hashPassword(randomUUID()));
