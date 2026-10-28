'use client';

import { useRouter, useParams } from 'next/navigation';
import { LuBookMarked, LuClipboardCheck, LuExternalLink, LuFlame, LuLightbulb, LuTriangleAlert } from 'react-icons/lu';
import { ROUTES } from '@shell/routes';
import { Button } from '@components/button';
import { Card } from '@components/card';
import { EmptyState } from '@components/empty-state';
import { PageHeader } from '@components/page-header';
import { ProgressBar } from '@components/progress-bar';
import { Section } from '@components/section';
import { StatusBadge } from '@components/status-badge';
import { useContent } from '@contexts/content';
import { useStudyProgress } from '@contexts/study-progress';
import {
  Check,
  EditalText,
  KeyList,
  Overview,
  TopicBody,
  TopicCard,
  TopicSummary,
  TopicTitle,
  Topics,
  Trap,
  Tips,
} from './styles';

/** Conteúdo de uma matéria: visão geral, dicas, tópicos do edital com resumo e progresso. */
export function StudySubjectPage() {
  const { materia: subjectId = '' } = useParams<{ materia: string }>();
  const router = useRouter();
  const { isDone, toggleTopic, countDone } = useStudyProgress();
  const { getSubject, questionsOfSubject, questionsOfTopic } = useContent();
  const subject = getSubject(subjectId);

  if (!subject) {
    return <EmptyState title="Matéria não encontrada" description="Volte para a grade de estudos." />;
  }

  const topicIds = subject.topicos.map((topic) => topic.id);
  const done = countDone(topicIds);

  return (
    <>
      <PageHeader
        title={subject.nome}
        subtitle={`${subject.questoesNaProva} questões na prova · ${subject.topicos.length} tópicos`}
        backTo={ROUTES.study}
        actions={
          questionsOfSubject(subject.id) > 0 && (
            <Button
              icon={<LuClipboardCheck aria-hidden />}
              onClick={() => router.push(`${ROUTES.exams}?materia=${subject.id}`)}
            >
              Praticar esta matéria
            </Button>
          )
        }
      />

      <Card style={{ marginBottom: 24 }}>
        <ProgressBar
          label="Tópicos estudados"
          value={topicIds.length ? done / topicIds.length : 0}
          valueText={`${done} de ${topicIds.length}`}
          tone="secondary"
        />
      </Card>

      <Section title="Visão geral">
        <Overview>{subject.visaoGeral}</Overview>
        {subject.dicas.length > 0 && (
          <Tips>
            {subject.dicas.map((tip) => (
              <li key={tip}>
                <LuLightbulb aria-hidden />
                <span>{tip}</span>
              </li>
            ))}
          </Tips>
        )}
        <details>
          <summary>Conteúdo do edital (Anexo II)</summary>
          <EditalText>{subject.conteudoEdital}</EditalText>
        </details>
      </Section>

      <Section title="Tópicos">
        <Topics>
          {subject.topicos.map((topic, index) => {
            const topicQuestions = questionsOfTopic(topic.id);
            const isTopicDone = isDone(topic.id);
            return (
              <TopicCard key={topic.id} $isDone={isTopicDone}>
                <TopicSummary>
                  <TopicTitle>
                    <span>
                      {index + 1}. {topic.titulo}
                    </span>
                    {topic.maisCobrado && (
                      <StatusBadge tone="warning" icon={<LuFlame aria-hidden />}>
                        Mais cobrado
                      </StatusBadge>
                    )}
                    {isTopicDone && <StatusBadge tone="success">Estudado</StatusBadge>}
                  </TopicTitle>
                </TopicSummary>
                <TopicBody>
                  {topic.resumo.split(/\n{2,}/).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}

                  {topic.pontosChave.length > 0 && (
                    <>
                      <h3>Pontos-chave</h3>
                      <KeyList>
                        {topic.pontosChave.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </KeyList>
                    </>
                  )}

                  {topic.pegadinhas.length > 0 && (
                    <>
                      <h3>Pegadinhas da banca</h3>
                      <KeyList>
                        {topic.pegadinhas.map((item) => (
                          <Trap key={item}>
                            <LuTriangleAlert aria-hidden />
                            <span>{item}</span>
                          </Trap>
                        ))}
                      </KeyList>
                    </>
                  )}

                  {topic.referencias.length > 0 && (
                    <p>
                      <LuBookMarked aria-hidden /> <strong>Base legal:</strong> {topic.referencias.join('; ')}
                    </p>
                  )}
                  {topicQuestions > 0 && <p>{topicQuestions} questões deste tópico no banco.</p>}

                  <Check>
                    <input type="checkbox" checked={isTopicDone} onChange={() => toggleTopic(topic.id)} />
                    Marcar como estudado
                  </Check>
                </TopicBody>
              </TopicCard>
            );
          })}
        </Topics>
      </Section>

      {subject.fontesEstudo.length > 0 && (
        <Section title="Onde estudar">
          <Card>
            <KeyList>
              {subject.fontesEstudo.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.titulo} <LuExternalLink aria-hidden />
                  </a>
                </li>
              ))}
            </KeyList>
          </Card>
        </Section>
      )}
    </>
  );
}
