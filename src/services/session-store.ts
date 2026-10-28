type tListener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<tListener>();

/**
 * Access token do facilita_mei_api, **só em memória** (nunca em localStorage). Ao recarregar a página, a sessão
 * volta pelo `POST /auth/refresh`, que usa o cookie httpOnly.
 */
export const sessionStore = {
  getAccessToken: () => accessToken,

  /** Troca o token e avisa quem estiver ouvindo (ex.: o contexto de auth). */
  setAccessToken(token: string | null) {
    accessToken = token;
    listeners.forEach((listener) => listener(token));
  },

  /**
   * Escuta as trocas de token.
   *
   * @returns função que cancela a escuta
   */
  subscribe(listener: tListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
