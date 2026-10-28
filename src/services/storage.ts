/** Prefixo de todas as chaves do app no localStorage. */
const PREFIX = 'pmsc-simulado:';

/**
 * Lê um JSON do localStorage. Devolve `fallback` se não existir, estiver corrompido ou o storage estiver bloqueado.
 */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** Grava um JSON no localStorage. Sem storage (aba privada), o dado vale só nesta sessão. */
export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage indisponível ou cheio: segue sem persistir
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Storage indisponível
  }
}
