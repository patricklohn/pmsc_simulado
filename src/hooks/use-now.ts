import { useEffect, useState } from 'react';

/** Data e hora atuais, atualizadas a cada `intervalMs` (padrão: 1 minuto). */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}
