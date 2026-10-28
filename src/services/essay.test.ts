import { estimateEssayScore, estimateLines } from './essay';

describe('redação (item 11.5)', () => {
  it('NPR = NC − NE ÷ TL', () => {
    expect(estimateEssayScore({ contentScore: 16, errors: 6, lines: 30 })).toBe(15.8);
  });

  it('desconta 0,20 por linha abaixo do mínimo de 20', () => {
    expect(estimateEssayScore({ contentScore: 15, errors: 0, lines: 17 })).toBe(14.4);
  });

  it('não conta linhas além de 30 e nunca fica negativa', () => {
    expect(estimateEssayScore({ contentScore: 10, errors: 30, lines: 40 })).toBe(9);
    expect(estimateEssayScore({ contentScore: 1, errors: 60, lines: 20 })).toBe(0);
    expect(estimateEssayScore({ contentScore: 20, errors: 0, lines: 0 })).toBe(0);
  });

  it('estima as linhas quebrando o parágrafo por palavra', () => {
    const word = 'palavra';
    const paragraph = Array.from({ length: 20 }, () => word).join(' ');
    expect(estimateLines(paragraph, 70)).toBe(3);
    expect(estimateLines(`${paragraph}\n\n${word}`, 70)).toBe(4);
  });
});
