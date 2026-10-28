'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { LuCloudOff } from 'react-icons/lu';
import { Button } from '@components/button';
import { EmptyState } from '@components/empty-state';
import { Spinner } from '@components/spinner';
import { contentApi } from '@services/api';
import { ApiError } from '@services/api-error';
import type { iContent } from '@/types/content';
import type { iSubject, tAreaId, tSubjectId } from '@/types/subject';
import { Center } from './styles';

export const CONTENT_QUERY_KEY = ['content'] as const;

export interface iContentContext extends iContent {
  getSubject: (id: string) => iSubject | undefined;
  subjectName: (id: string) => string;
  /** Área de conhecimento de cada matéria. */
  areaOfSubject: Record<string, tAreaId>;
  areaNames: Record<string, string>;
  questionsOfSubject: (id: tSubjectId | string) => number;
  questionsOfTopic: (id: string) => number;
}

const ContentContext = createContext<iContentContext | null>(null);

/** Monta os atalhos usados pelas telas a partir do conteúdo da API. */
export function buildContentContext(content: iContent): iContentContext {
  const byId = new Map(content.subjects.map((subject) => [subject.id, subject]));
  return {
    ...content,
    getSubject: (id) => byId.get(id as tSubjectId),
    subjectName: (id) => byId.get(id as tSubjectId)?.nome ?? id,
    areaOfSubject: Object.fromEntries(
      content.notice.provaObjetiva.areas.flatMap((area) => area.materias.map((subjectId) => [subjectId, area.id]))
    ),
    areaNames: Object.fromEntries(content.notice.provaObjetiva.areas.map((area) => [area.id, area.nome])),
    questionsOfSubject: (id) => content.questionCounts.bySubject[id] ?? 0,
    questionsOfTopic: (id) => content.questionCounts.byTopic[id] ?? 0,
  };
}

/** Carrega o conteúdo do banco (edital, cronograma, matérias, redação) uma vez e entrega para as telas. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const query = useQuery({ queryKey: CONTENT_QUERY_KEY, queryFn: contentApi.load, staleTime: 5 * 60_000 });
  const value = useMemo(() => (query.data ? buildContentContext(query.data) : null), [query.data]);

  if (query.isPending) {
    return (
      <Center>
        <Spinner size={32} label="Carregando conteúdo" />
      </Center>
    );
  }
  if (!value) {
    return (
      <EmptyState
        icon={<LuCloudOff />}
        title="Não foi possível carregar o conteúdo"
        description={query.error instanceof ApiError ? query.error.message : 'Confira sua conexão e tente de novo.'}
        action={<Button onClick={() => query.refetch()}>Tentar de novo</Button>}
      />
    );
  }
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Conteúdo do app. Use dentro do {@link ContentProvider}. */
export function useContent(): iContentContext {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent precisa estar dentro do ContentProvider');
  }
  return context;
}

/** Para testes: entrega um conteúdo pronto, sem chamar a API. */
export function ContentTestProvider({ content, children }: { content: iContent; children: ReactNode }) {
  const value = useMemo(() => buildContentContext(content), [content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
