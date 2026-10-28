'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useToast } from '@components/toast';
import { progressApi } from '@services/api';

export const PROGRESS_QUERY_KEY = ['progress'] as const;

interface iStudyProgressContext {
  /** Ids dos tópicos marcados como estudados. */
  doneTopics: ReadonlySet<string>;
  isDone: (topicId: string) => boolean;
  toggleTopic: (topicId: string) => void;
  /** Quantos tópicos da lista já foram estudados. */
  countDone: (topicIds: string[]) => number;
}

const StudyProgressContext = createContext<iStudyProgressContext | null>(null);

/** Tópicos estudados, salvos no usuário. A marcação aparece na hora e volta atrás se a API falhar. */
export function StudyProgressProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data } = useQuery({ queryKey: PROGRESS_QUERY_KEY, queryFn: progressApi.list });

  const mutation = useMutation({
    mutationFn: ({ topicId, isDone }: { topicId: string; isDone: boolean }) => progressApi.setTopic(topicId, isDone),
    onMutate: async ({ topicId, isDone }) => {
      await queryClient.cancelQueries({ queryKey: PROGRESS_QUERY_KEY });
      const previous = queryClient.getQueryData<{ doneTopics: string[] }>(PROGRESS_QUERY_KEY);
      queryClient.setQueryData<{ doneTopics: string[] }>(PROGRESS_QUERY_KEY, (current) => {
        const list = current?.doneTopics ?? [];
        return { doneTopics: isDone ? [...new Set([...list, topicId])] : list.filter((id) => id !== topicId) };
      });
      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(PROGRESS_QUERY_KEY, context?.previous);
      showToast('Não foi possível salvar o progresso. Tente de novo.', 'danger');
    },
  });

  const doneTopics = useMemo(() => new Set(data?.doneTopics ?? []), [data]);
  const { mutate } = mutation;
  const toggleTopic = useCallback(
    (topicId: string) => mutate({ topicId, isDone: !doneTopics.has(topicId) }),
    [doneTopics, mutate]
  );

  const value = useMemo<iStudyProgressContext>(
    () => ({
      doneTopics,
      isDone: (topicId) => doneTopics.has(topicId),
      toggleTopic,
      countDone: (topicIds) => topicIds.filter((id) => doneTopics.has(id)).length,
    }),
    [doneTopics, toggleTopic]
  );

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
}

/** Progresso de estudo. Use dentro do {@link StudyProgressProvider}. */
export function useStudyProgress(): iStudyProgressContext {
  const context = useContext(StudyProgressContext);
  if (!context) {
    throw new Error('useStudyProgress precisa estar dentro do StudyProgressProvider');
  }
  return context;
}
