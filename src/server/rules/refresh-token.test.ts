import { RefreshTokenRules, eRefreshTokenState } from './refresh-token';

const NOW = new Date('2026-11-01T12:00:00Z');
const FUTURE = new Date('2026-12-01T12:00:00Z');

describe('RefreshTokenRules.state', () => {
  it('classifica cada situação, com reutilização acima de expiração e revogação', () => {
    expect(RefreshTokenRules.state(undefined, NOW)).toBe(eRefreshTokenState.not_found);
    expect(RefreshTokenRules.state({ expires_at: FUTURE, revoked_at: null, replaced_by_uuid: null }, NOW)).toBe(
      eRefreshTokenState.active
    );
    expect(RefreshTokenRules.state({ expires_at: NOW, revoked_at: null, replaced_by_uuid: null }, NOW)).toBe(
      eRefreshTokenState.expired
    );
    expect(RefreshTokenRules.state({ expires_at: FUTURE, revoked_at: NOW, replaced_by_uuid: null }, NOW)).toBe(
      eRefreshTokenState.revoked
    );
    expect(RefreshTokenRules.state({ expires_at: NOW, revoked_at: NOW, replaced_by_uuid: 'x' }, NOW)).toBe(
      eRefreshTokenState.reused
    );
  });
});
