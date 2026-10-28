import { Cell, Grid, Legend, LegendItem, type tCellState } from './styles';

interface iAnswerGridProps {
  total: number;
  currentIndex: number;
  isAnswered: (index: number) => boolean;
  isFlagged: (index: number) => boolean;
  onSelect: (index: number) => void;
}

/** Cartão-resposta: um botão por questão, mostrando respondida, marcada para revisar e a atual. */
export function AnswerGrid({ total, currentIndex, isAnswered, isFlagged, onSelect }: iAnswerGridProps) {
  return (
    <div>
      <Grid aria-label="Ir para a questão">
        {Array.from({ length: total }, (_, index) => {
          const state: tCellState = isFlagged(index) ? 'flagged' : isAnswered(index) ? 'answered' : 'empty';
          const status = [isAnswered(index) ? 'respondida' : 'sem resposta', isFlagged(index) ? 'para revisar' : '']
            .filter(Boolean)
            .join(', ');
          return (
            <Cell
              key={index}
              type="button"
              $state={state}
              $isCurrent={index === currentIndex}
              aria-current={index === currentIndex ? 'step' : undefined}
              aria-label={`Questão ${index + 1}: ${status}`}
              onClick={() => onSelect(index)}
            >
              {index + 1}
            </Cell>
          );
        })}
      </Grid>
      <Legend>
        <LegendItem $state="answered">Respondida</LegendItem>
        <LegendItem $state="flagged">Revisar</LegendItem>
        <LegendItem $state="empty">Em branco</LegendItem>
      </Legend>
    </div>
  );
}
