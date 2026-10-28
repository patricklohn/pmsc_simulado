'use client';

import { LuCheck, LuX } from 'react-icons/lu';
import { StatusBadge } from '@components/status-badge';
import type { iExamQuestion } from '@/types/exam';
import type { tAlternativeKey } from '@/types/question';
import {
  Alternative,
  AlternativeList,
  Comment,
  CommentTitle,
  Letter,
  Meta,
  Statement,
  Wrapper,
  type tAlternativeState,
} from './styles';

const KEYS: tAlternativeKey[] = ['A', 'B', 'C', 'D', 'E'];

const DIFFICULTY_LABEL = { facil: 'Fácil', media: 'Média', dificil: 'Difícil' } as const;

/** Questão da prova; o gabarito (`correta`, `comentario`, `fonte`) só vem depois da entrega. */
export type tCardQuestion = iExamQuestion & { correta?: tAlternativeKey; comentario?: string; fonte?: string };

interface iQuestionCardProps {
  question: tCardQuestion;
  /** Posição na prova (1, 2, 3...). */
  number: number;
  subjectName: string;
  selected?: tAlternativeKey;
  /** Sem `onSelect`, as alternativas ficam só para leitura. */
  onSelect?: (key: tAlternativeKey) => void;
  /** Mostra a correta, o erro e o comentário (gabarito). */
  isRevealed?: boolean;
}

/** Texto com parágrafos separados por linha em branco. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}

function stateOf(key: tAlternativeKey, question: tCardQuestion, selected?: tAlternativeKey, isRevealed = false) {
  if (!isRevealed) return key === selected ? 'selected' : 'idle';
  if (key === question.correta) return 'correct';
  if (key === selected) return 'wrong';
  return 'idle';
}

/** Questão de múltipla escolha, para responder (prova) ou conferir (gabarito comentado). */
export function QuestionCard({
  question,
  number,
  subjectName,
  selected,
  onSelect,
  isRevealed = false,
}: iQuestionCardProps) {
  const isInteractive = Boolean(onSelect) && !isRevealed;

  return (
    <Wrapper aria-labelledby={`questao-${question.id}`}>
      <Meta>
        <strong id={`questao-${question.id}`}>Questão {number}</strong>
        <span>{subjectName}</span>
        <StatusBadge tone="neutral">{DIFFICULTY_LABEL[question.dificuldade]}</StatusBadge>
      </Meta>
      <Statement>
        <Paragraphs text={question.enunciado} />
      </Statement>

      <AlternativeList role={isInteractive ? 'radiogroup' : 'list'} aria-label={`Alternativas da questão ${number}`}>
        {KEYS.map((key) => {
          const state: tAlternativeState = stateOf(key, question, selected, isRevealed);
          return (
            <Alternative
              key={key}
              as={isInteractive ? 'button' : 'div'}
              type={isInteractive ? 'button' : undefined}
              role={isInteractive ? 'radio' : 'listitem'}
              aria-checked={isInteractive ? key === selected : undefined}
              onClick={isInteractive ? () => onSelect?.(key) : undefined}
              $state={state}
              $isInteractive={isInteractive}
            >
              <Letter $state={state} aria-hidden>
                {state === 'correct' ? <LuCheck /> : state === 'wrong' ? <LuX /> : key}
              </Letter>
              <span>
                <span className="sr-only">
                  {key}){state === 'correct' ? ' (correta)' : state === 'wrong' ? ' (sua resposta, errada)' : ''}{' '}
                </span>
                {question.alternativas[key]}
              </span>
            </Alternative>
          );
        })}
      </AlternativeList>

      {isRevealed && (
        <Comment>
          <CommentTitle>
            {selected === undefined
              ? `Sem resposta. Gabarito: ${question.correta}`
              : selected === question.correta
                ? `Você acertou: ${question.correta}`
                : `Você marcou ${selected}. Gabarito: ${question.correta}`}
          </CommentTitle>
          {question.comentario && <Paragraphs text={question.comentario} />}
          {question.fonte && <small>Fonte: {question.fonte}</small>}
        </Comment>
      )}
    </Wrapper>
  );
}
