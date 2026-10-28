'use client';

import Link from 'next/link';
import { LuChevronRight, LuFlame, LuPenLine } from 'react-icons/lu';
import { ROUTES, subjectRoute } from '@shell/routes';
import { Card } from '@components/card';
import { EmptyState } from '@components/empty-state';
import { PageHeader } from '@components/page-header';
import { ProgressBar } from '@components/progress-bar';
import { Section } from '@components/section';
import { useContent } from '@contexts/content';
import { useStudyProgress } from '@contexts/study-progress';
import { useNow } from '@hooks/use-now';
import { toIsoDate } from '@utils/schedule';
import { daysBetween } from '@utils/format-duration';
import { PlanTable, SubjectGrid, SubjectLink, SubjectMeta, SubjectName, Weight } from './styles';

/** Grade de estudos: matérias por área, progresso e um plano semanal sugerido. */
export function StudyPage() {
  const { countDone } = useStudyProgress();
  const { notice: NOTICE, subjects: SUBJECTS, questionsOfSubject } = useContent();
  const today = toIsoDate(useNow());
  const weeksLeft = Math.max(1, Math.ceil(daysBetween(today, NOTICE.dataProva) / 7));
  const allTopicIds = SUBJECTS.flatMap((subject) => subject.topicos.map((topic) => topic.id));
  const doneCount = countDone(allTopicIds);

  if (SUBJECTS.length === 0) {
    return <EmptyState title="Conteúdo em preparação" description="As matérias ainda não foram carregadas." />;
  }

  return (
    <>
      <PageHeader
        title="Grade de estudos"
        subtitle="Conteúdo programático do Anexo II com resumos, pontos-chave e pegadinhas"
      />

      <Card style={{ marginBottom: 24 }}>
        <ProgressBar
          label="Progresso geral"
          value={allTopicIds.length ? doneCount / allTopicIds.length : 0}
          valueText={`${doneCount} de ${allTopicIds.length} tópicos estudados`}
          tone="secondary"
        />
      </Card>

      {NOTICE.provaObjetiva.areas.map((area) => {
        const subjects = SUBJECTS.filter((subject) => subject.area === area.id);
        const questions = subjects.reduce((sum, subject) => sum + subject.questoesNaProva, 0);
        return (
          <Section key={area.id} title={`${area.nome} · ${questions} questões`}>
            <SubjectGrid>
              {subjects.map((subject) => {
                const topicIds = subject.topicos.map((topic) => topic.id);
                const done = countDone(topicIds);
                const hot = subject.topicos.filter((topic) => topic.maisCobrado).length;
                return (
                  <SubjectLink key={subject.id} href={subjectRoute(subject.id)}>
                    <SubjectName>
                      {subject.nome}
                      <LuChevronRight aria-hidden />
                    </SubjectName>
                    <SubjectMeta>
                      <Weight>{subject.questoesNaProva} questões</Weight>
                      <span>{subject.topicos.length} tópicos</span>
                      <span>
                        <LuFlame aria-hidden /> {hot} mais cobrados
                      </span>
                      <span>{questionsOfSubject(subject.id)} questões para treinar</span>
                    </SubjectMeta>
                    <ProgressBar
                      label={`Progresso em ${subject.nome}`}
                      value={topicIds.length ? done / topicIds.length : 0}
                      valueText={`${done}/${topicIds.length}`}
                      tone="secondary"
                      isLabelHidden
                    />
                  </SubjectLink>
                );
              })}
            </SubjectGrid>
          </Section>
        );
      })}

      <Section title={`Redação · ${NOTICE.redacao.pontos} pontos`}>
        <SubjectGrid>
          <SubjectLink href={ROUTES.essay}>
            <SubjectName>
              <span>
                <LuPenLine aria-hidden /> Redação: Ordem Pública
              </span>
              <LuChevronRight aria-hidden />
            </SubjectName>
            <SubjectMeta>
              <span>
                {NOTICE.redacao.tipo} · mínimo de {NOTICE.redacao.minimo} pontos
              </span>
              <span>Temas para treinar, critérios de correção e checklist</span>
            </SubjectMeta>
          </SubjectLink>
        </SubjectGrid>
      </Section>

      <Section title={`Plano sugerido para ${weeksLeft} ${weeksLeft === 1 ? 'semana' : 'semanas'}`}>
        <Card>
          <PlanTable>
            <thead>
              <tr>
                <th scope="col">Matéria</th>
                <th scope="col">Peso</th>
                <th scope="col">Tempo de estudo</th>
                <th scope="col">Tópicos por semana</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((subject) => {
                const remaining = subject.topicos.length - countDone(subject.topicos.map((topic) => topic.id));
                return (
                  <tr key={subject.id}>
                    <td>
                      <Link href={subjectRoute(subject.id)}>{subject.nome}</Link>
                    </td>
                    <td>{subject.questoesNaProva}</td>
                    <td>{Math.round((subject.questoesNaProva / NOTICE.provaObjetiva.totalQuestoes) * 100)}%</td>
                    <td>{remaining === 0 ? 'Revisão' : Math.ceil(remaining / weeksLeft)}</td>
                  </tr>
                );
              })}
            </tbody>
          </PlanTable>
          <p>
            O tempo de cada matéria segue o número de questões na prova. Reserve também uma redação por semana e um
            simulado completo a cada 7 a 10 dias, revisando o gabarito comentado das questões que errar.
          </p>
        </Card>
      </Section>
    </>
  );
}
