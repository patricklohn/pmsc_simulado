/** Envelope de sucesso da API: `{ success: true, result }`. */
export interface iApiSuccess<T> {
  success: true;
  result: T;
}

/** Envelope de erro da API: `{ success: false, error: { code, message } }`. */
export interface iApiFailure {
  success: false;
  error: { code: string; message: string };
}

export type tApiEnvelope<T> = iApiSuccess<T> | iApiFailure;
