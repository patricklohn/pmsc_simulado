const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Formata um valor em reais.
 *
 * @param value - número ou texto decimal da API (`"1500.00"`)
 * @returns ex.: `R$ 1.500,00`; vazio quando o valor não é número
 */
export function formatMoney(value: number | string | null | undefined): string {
  const amount = typeof value === 'string' ? Number(value) : value;
  return amount === null || amount === undefined || Number.isNaN(amount) ? '' : BRL.format(amount);
}

/**
 * Lê o texto digitado num campo de dinheiro (`1.500,50`) e devolve o número.
 *
 * @returns `null` quando o texto não tem dígitos
 */
export function parseMoney(text: string): number | null {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) / 100 : null;
}
