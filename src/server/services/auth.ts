import 'server-only';
import { Env } from '@/configs/env';
import { getDb, type tTransactionTrx } from '@/database/db/kysely';
import { eUserRole, eUserStatus } from '@/database/db/model';
import type { iAuthSession, iMe } from '@/types/auth';
import { HTTP_STATUS, ServiceError } from '../errors';
import { eRefreshTokenState } from '../rules/refresh-token';
import { type iAccessTokenPayload, signAccessToken, verifyAccessToken } from './jwt';
import { comparePassword, getDummyHash, hashPassword } from './password';
import { type iIssuedRefreshToken, RefreshTokenService } from './refresh-token';

/** Usuários que podem usar o app: ativos e não excluídos. */
const activeUserQuery = (trx: tTransactionTrx = getDb()) =>
  trx
    .selectFrom('user')
    .select(['uuid', 'role', 'name', 'email', 'status'])
    .where('status', '=', eUserStatus.active)
    .where('deleted_at', 'is', null);

const toPayload = (user: { uuid: string; role: eUserRole }): iAccessTokenPayload => ({
  sub: user.uuid,
  role: user.role,
});

const INVALID_REFRESH = () =>
  new ServiceError(HTTP_STATUS.unauthorized, 'REFRESH_TOKEN_INVALID', 'Sessão expirada. Entre de novo.');

/** Cadastro, login e sessões (access token JWT + refresh token rotativo). */
export class AuthService {
  /**
   * Cria o usuário com status `pending`: ele só consegue entrar depois de liberado no banco.
   *
   * @throws {ServiceError} 409 `EMAIL_IN_USE`
   */
  static async register({ name, email, password }: { name: string; email: string; password: string }) {
    const exists = await getDb()
      .selectFrom('user')
      .select('uuid')
      .where('email', '=', email)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();
    if (exists) {
      throw new ServiceError(HTTP_STATUS.conflict, 'EMAIL_IN_USE', 'Este e-mail já tem cadastro.');
    }
    const user = await getDb()
      .insertInto('user')
      .values({ name, email, password_hash: await hashPassword(password) })
      .returning(['uuid', 'status'])
      .executeTakeFirstOrThrow();
    return { uuid: user.uuid, status: user.status };
  }

  /**
   * Confere e-mail e senha. Erro de credencial é genérico (não revela se o e-mail existe). Só depois da senha
   * certa o app diz que o cadastro está aguardando liberação ou bloqueado.
   *
   * @throws {ServiceError} 401 `INVALID_CREDENTIALS` · 403 `USER_PENDING` · 403 `USER_BLOCKED`
   */
  static async login({ email, password }: { email: string; password: string }): Promise<iAuthSession> {
    const user = await getDb()
      .selectFrom('user')
      .select(['uuid', 'role', 'status', 'password_hash'])
      .where('email', '=', email)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();

    const isValid = await comparePassword(password, user?.password_hash ?? (await getDummyHash()));
    if (!user || !isValid) {
      throw new ServiceError(HTTP_STATUS.unauthorized, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
    }
    if (user.status === eUserStatus.pending) {
      throw new ServiceError(
        HTTP_STATUS.forbidden,
        'USER_PENDING',
        'Seu cadastro está aguardando liberação. Tente de novo mais tarde.'
      );
    }
    if (user.status !== eUserStatus.active) {
      throw new ServiceError(HTTP_STATUS.forbidden, 'USER_BLOCKED', 'Seu acesso está bloqueado.');
    }

    await getDb().updateTable('user').set({ last_login_at: new Date() }).where('uuid', '=', user.uuid).execute();
    const refresh = await RefreshTokenService.issue({ userUuid: user.uuid });
    return this.toSession(toPayload(user), refresh);
  }

  /**
   * Troca o refresh token por um par novo (rotação). Reutilizar um token rotacionado ou usuário que deixou de estar
   * ativo revoga a família. Erro sempre igual, sem revelar o motivo.
   */
  static async refresh(refreshToken: string): Promise<iAuthSession> {
    // Sem throw dentro da transação: a revogação da família precisa ser gravada antes do 401
    const result = await getDb()
      .transaction()
      .execute(async (trx) => {
        const { row, state } = await RefreshTokenService.findForUpdate(trx, refreshToken);
        if (!row || state !== eRefreshTokenState.active) {
          if (row && state === eRefreshTokenState.reused) {
            await RefreshTokenService.revokeFamily(trx, row.family_uuid);
          }
          return undefined;
        }
        const user = await activeUserQuery(trx).where('uuid', '=', row.user_uuid).executeTakeFirst();
        if (!user) {
          await RefreshTokenService.revokeFamily(trx, row.family_uuid);
          return undefined;
        }
        const refresh = await RefreshTokenService.issue({ trx, userUuid: user.uuid, familyUuid: row.family_uuid });
        await RefreshTokenService.markRotated(trx, row.uuid, refresh.uuid);
        return { payload: toPayload(user), refresh };
      });

    if (!result) throw INVALID_REFRESH();
    return this.toSession(result.payload, result.refresh);
  }

  static logout(refreshToken: string) {
    return RefreshTokenService.revoke(refreshToken);
  }

  /**
   * Usuário do access token, conferido no banco a cada requisição (bloquear no banco tira o acesso na hora).
   *
   * @throws {ServiceError} 401 `UNAUTHORIZED`
   */
  static async requireUser(request: Request): Promise<iMe> {
    const header = request.headers.get('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const payload = token ? await verifyAccessToken(token) : null;
    const user = payload ? await activeUserQuery().where('uuid', '=', payload.sub).executeTakeFirst() : undefined;
    if (!user) {
      throw new ServiceError(HTTP_STATUS.unauthorized, 'UNAUTHORIZED', 'Sessão expirada. Entre de novo.');
    }
    return { uuid: user.uuid, name: user.name, email: user.email, role: user.role };
  }

  private static async toSession(payload: iAccessTokenPayload, refresh: iIssuedRefreshToken): Promise<iAuthSession> {
    return {
      access_token: await signAccessToken(payload),
      token_type: 'Bearer',
      expires_in: Env.JWT_EXPIRES_IN,
      refresh_token: refresh.refresh_token,
      refresh_token_expires_at: refresh.expires_at.toISOString(),
      role: payload.role,
    };
  }
}
