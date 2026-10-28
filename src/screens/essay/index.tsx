'use client';

import { useState } from 'react';
import { LuLightbulb } from 'react-icons/lu';
import { ROUTES } from '@shell/routes';
import { Alert } from '@components/alert';
import { Card } from '@components/card';
import { PageHeader } from '@components/page-header';
import { Section } from '@components/section';
import { SelectField } from '@components/select-field';
import { StatusBadge } from '@components/status-badge';
import { useContent } from '@contexts/content';
import { ESSAY_MAX_LINES, ESSAY_MIN_LINES, estimateEssayScore, estimateLines } from '@services/essay';
import { readStorage, writeStorage } from '@services/storage';
import {
  Checklist,
  Draft,
  DraftFooter,
  Estimator,
  MotivatingText,
  Proposal,
  Structure,
  Tips,
  TwoColumns,
} from './styles';

const DRAFT_KEY = (themeId: string) => `essay:draft:${themeId}`;

/** Redação: orientações do edital, temas de treino com textos motivadores, rascunho e estimativa de nota. */
export function EssayPage() {
  const { essay: ESSAY, notice: NOTICE } = useContent();
  const [themeId, setThemeId] = useState(ESSAY.temas[0]?.id ?? '');
  const [draft, setDraft] = useState(() => readStorage(DRAFT_KEY(themeId), ''));
  const [checked, setChecked] = useState<string[]>([]);
  const [contentScore, setContentScore] = useState(15);
  const [errors, setErrors] = useState(5);
  const theme = ESSAY.temas.find((item) => item.id === themeId);
  const lines = estimateLines(draft);
  const score = estimateEssayScore({ contentScore, errors, lines });

  const changeTheme = (nextId: string) => {
    setThemeId(nextId);
    setDraft(readStorage(DRAFT_KEY(nextId), ''));
    setChecked([]);
  };

  const changeDraft = (text: string) => {
    setDraft(text);
    writeStorage(DRAFT_KEY(themeId), text);
  };

  const lineTone = lines === 0 ? 'neutral' : lines < ESSAY_MIN_LINES || lines > ESSAY_MAX_LINES ? 'warning' : 'success';

  return (
    <>
      <PageHeader
        title="Redação"
        subtitle={`${NOTICE.redacao.tipo} · ${NOTICE.redacao.pontos} pontos · mínimo ${NOTICE.redacao.minimo}`}
        backTo={ROUTES.study}
      />

      <Section title="Como é a redação">
        <Card>
          <Tips>
            {ESSAY.orientacoes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Tips>
        </Card>
      </Section>

      <Section title="Estrutura do texto">
        <Structure>
          {ESSAY.estrutura.map((part) => (
            <Card key={part.parte}>
              <strong>{part.parte}</strong>
              <p>{part.descricao}</p>
            </Card>
          ))}
        </Structure>
      </Section>

      <Section title="Treinar um tema">
        <SelectField
          label="Tema"
          value={themeId}
          onChange={(event) => changeTheme(event.target.value)}
          options={ESSAY.temas.map((item) => ({ value: item.id, label: item.titulo }))}
        />
        {theme && (
          <>
            <Card>
              <StatusBadge tone="info">{theme.eixo}</StatusBadge>
              {theme.textosMotivadores.map((text, index) => (
                <MotivatingText key={index}>
                  <strong>Texto {index + 1}</strong>
                  {text.split(/\n{2,}/).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </MotivatingText>
              ))}
              <Proposal>{theme.proposta}</Proposal>
            </Card>

            <TwoColumns>
              <div>
                <Draft
                  aria-label="Rascunho da redação"
                  placeholder="Escreva seu texto aqui. O rascunho fica salvo neste aparelho."
                  value={draft}
                  onChange={(event) => changeDraft(event.target.value)}
                  rows={18}
                />
                <DraftFooter>
                  <StatusBadge tone={lineTone}>
                    ≈ {lines} linhas (de {ESSAY_MIN_LINES} a {ESSAY_MAX_LINES})
                  </StatusBadge>
                  <span>{draft.trim() ? draft.trim().split(/\s+/).length : 0} palavras</span>
                </DraftFooter>
              </div>

              <div>
                <Card>
                  <strong>Autoavaliação</strong>
                  <Checklist>
                    {ESSAY.criterios.map((criterion) => (
                      <li key={criterion.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={checked.includes(criterion.id)}
                            onChange={() =>
                              setChecked((current) =>
                                current.includes(criterion.id)
                                  ? current.filter((id) => id !== criterion.id)
                                  : [...current, criterion.id]
                              )
                            }
                          />
                          <span>
                            <strong>{criterion.titulo}</strong>
                            <small>{criterion.descricao}</small>
                          </span>
                        </label>
                      </li>
                    ))}
                  </Checklist>
                </Card>

                <Estimator>
                  <strong>Estimativa de nota</strong>
                  <label>
                    Nota de conteúdo (NC): {contentScore}
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={0.5}
                      value={contentScore}
                      onChange={(event) => setContentScore(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Erros de português (NE): {errors}
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={errors}
                      onChange={(event) => setErrors(Number(event.target.value))}
                    />
                  </label>
                  <p>
                    NPR = {contentScore} − ({errors} ÷ {Math.min(lines, ESSAY_MAX_LINES) || '—'})
                    {lines > 0 && lines < ESSAY_MIN_LINES ? ` − ${ESSAY_MIN_LINES - lines} × 0,20` : ''} ={' '}
                    <strong>{score.toFixed(2).replace('.', ',')}</strong>
                  </p>
                  <Alert tone={score >= NOTICE.redacao.minimo ? 'success' : 'warning'}>
                    {score >= NOTICE.redacao.minimo
                      ? 'Acima do mínimo de 10 pontos.'
                      : 'Abaixo do mínimo de 10 pontos: a redação eliminaria.'}
                  </Alert>
                </Estimator>
              </div>
            </TwoColumns>
          </>
        )}
      </Section>

      <Section title="Dicas">
        <Card>
          <Tips>
            {ESSAY.dicas.map((tip) => (
              <li key={tip}>
                <LuLightbulb aria-hidden /> {tip}
              </li>
            ))}
          </Tips>
        </Card>
      </Section>
    </>
  );
}
