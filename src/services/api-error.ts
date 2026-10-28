/** Código usado quando a API não respondeu (rede fora, CORS, timeout). */
export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';

/**
 * Erro devolvido pela API (`{ success: false, error }`) ou pela rede.
 * A tela mostra `message`, que já vem pronta da API em português.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  /**
   * @param status - status HTTP (0 quando não houve resposta)
   * @param code - código de erro da API (ex.: `INVALID_CREDENTIALS`)
   * @param message - mensagem para o usuário
   */
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  /** `true` quando a falha foi de rede, sem resposta da API. */
  get isNetworkError(): boolean {
    return this.code === NETWORK_ERROR_CODE;
  }
}
