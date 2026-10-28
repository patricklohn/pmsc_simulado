import 'server-only';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { Env } from '@/configs/env';
import { getDb, type tTransactionTrx } from '@/database/db/kysely';
import { RefreshTokenRules } from '../rules/refresh-token';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Refresh token recém-emitido: o valor em texto puro só existe aqui, nunca é persistido. */
export interface iIssuedRefreshToken {
  uuid: string;
  refresh_token: string;
  expires_at: Date;
}

/** Emissão, rotação e revogação dos refresh tokens (mesmo modelo do facilita_mei_api). */
export class RefreshTokenService {
  /** Hash sha256 (hex) usado para guardar e localizar o token. */
  static hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  /** Emite um token opaco (384 bits em base64url). Sem `familyUuid`, começa uma família nova (login). */
  static async issue({
    userUuid,
    familyUuid = randomUUID(),
    trx = getDb(),
  }: {
    userUuid: string;
    familyUuid?: string;
    trx?: tTransactionTrx;
  }): Promise<iIssuedRefreshToken> {
    const refreshToken = randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + Env.REFRESH_TOKEN_EXPIRES_DAYS * DAY_MS);
    const row = await trx
      .insertInto('refresh_token')
      .values({
        user_uuid: userUuid,
        family_uuid: familyUuid,
        token_hash: this.hash(refreshToken),
        expires_at: expiresAt,
      })
      .returning('uuid')
      .executeTakeFirstOrThrow();
    return { uuid: row.uuid, refresh_token: refreshToken, expires_at: expiresAt };
  }

  /** Busca o token pelo hash travando a linha até o fim da transação (dois usos simultâneos não rotacionam 2×). */
  static async findForUpdate(trx: tTransactionTrx, token: string) {
    const row = await trx
      .selectFrom('refresh_token')
      .select(['uuid', 'user_uuid', 'family_uuid', 'expires_at', 'revoked_at', 'replaced_by_uuid'])
      .where('token_hash', '=', this.hash(token))
      .forUpdate()
      .executeTakeFirst();
    return { row, state: RefreshTokenRules.state(row, new Date()) };
  }

  /** Marca o token como rotacionado, apontando para o sucessor. */
  static async markRotated(trx: tTransactionTrx, uuid: string, replacedByUuid: string) {
    await trx
      .updateTable('refresh_token')
      .set({ revoked_at: new Date(), replaced_by_uuid: replacedByUuid })
      .where('uuid', '=', uuid)
      .execute();
  }

  /** Revoga todos os tokens ainda ativos de uma família (logout ou reutilização). */
  static async revokeFamily(trx: tTransactionTrx, familyUuid: string) {
    await trx
      .updateTable('refresh_token')
      .set({ revoked_at: new Date() })
      .where('family_uuid', '=', familyUuid)
      .where('revoked_at', 'is', null)
      .execute();
  }

  /** Encerra a sessão do token. Idempotente. */
  static async revoke(token: string) {
    await getDb()
      .transaction()
      .execute(async (trx) => {
        const { row } = await this.findForUpdate(trx, token);
        if (row) await this.revokeFamily(trx, row.family_uuid);
      });
  }
}
