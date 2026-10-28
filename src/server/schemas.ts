import { z } from 'zod';

const ALTERNATIVE = z.enum(['A', 'B', 'C', 'D', 'E']);
const SUBJECT_ID = z.string().min(1).max(60);

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome').max(255),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(255),
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres').max(72, 'No máximo 72 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

/** No `/renovar` e no `/sair` o body tem prioridade; sem ele, vale o cookie. */
export const refreshSchema = z.object({ refresh_token: z.string().min(1).optional() });

export const createExamSchema = z
  .object({
    mode: z.enum(['completo', 'materia', 'rapido']),
    subjectId: SUBJECT_ID.optional(),
    count: z.number().int().min(1).max(120).optional(),
    shouldPreferUnseen: z.boolean().optional(),
    shouldReplaceCurrent: z.boolean().optional(),
  })
  .refine((input) => input.mode !== 'materia' || input.subjectId, { message: 'Escolha a matéria' });

export const saveExamSchema = z.object({
  answers: z.record(z.string(), ALTERNATIVE).optional(),
  flagged: z.array(z.string()).max(200).optional(),
  currentIndex: z.number().int().min(0).optional(),
});

export const finishExamSchema = saveExamSchema.omit({ currentIndex: true });

export const studyTopicSchema = z.object({
  topicId: z.string().min(1).max(80),
  isDone: z.boolean(),
});
