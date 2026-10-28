import 'server-only';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { HTTP_STATUS, ServiceError } from './errors';

/** Resposta de sucesso no envelope `{ success, result }`. */
export function ok<T>(result: T, status: number = HTTP_STATUS.ok) {
  return NextResponse.json({ success: true, result }, { status });
}

export function noContent() {
  return new NextResponse(null, { status: HTTP_STATUS.noContent });
}

/** Converte qualquer erro na resposta `{ success: false, error }`. Erro inesperado vira 500 sem detalhes. */
export function fail(error: unknown) {
  if (error instanceof ServiceError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  console.error(error);
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro inesperado. Tente de novo.' } },
    { status: 500 }
  );
}

/**
 * Lê o corpo JSON e valida com o schema Zod. A primeira mensagem do Zod vai para o `error.message` (400).
 *
 * @example
 * const { email } = await parseBody(request, loginSchema);
 */
export async function parseBody<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    throw new ServiceError(
      HTTP_STATUS.badRequest,
      'VALIDATION_ERROR',
      parsed.error.issues[0]?.message ?? 'Dados inválidos'
    );
  }
  return parsed.data;
}

/**
 * Envolve um Route Handler: erros viram o envelope de erro.
 *
 * @example
 * export const GET = route(async (request) => ok(await load()));
 */
export function route<TContext>(handler: (request: Request, context: TContext) => Promise<Response>) {
  return async (request: Request, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return fail(error);
    }
  };
}
