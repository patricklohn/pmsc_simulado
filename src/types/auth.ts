/** Sessão devolvida pelo login e pela renovação (mesmo formato do facilita_mei_api). */
export interface iAuthSession {
  access_token: string;
  token_type: 'Bearer';
  expires_in: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  role: 'student' | 'admin';
}

/** Usuário autenticado. */
export interface iMe {
  uuid: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}
