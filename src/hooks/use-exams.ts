import { useQuery } from '@tanstack/react-query';
import { examApi } from '@services/api';

export const EXAM_QUERY_KEYS = {
  all: ['exams'] as const,
  overview: ['exams', 'overview'] as const,
  detail: (id: string) => ['exams', 'detail', id] as const,
  last: ['exams', 'last'] as const,
};

/** Simulado em andamento e histórico do usuário. */
export function useExamOverview() {
  return useQuery({ queryKey: EXAM_QUERY_KEYS.overview, queryFn: examApi.overview });
}
