import { useEffect, useRef, useState } from 'react';

/**
 * Tempo restante da prova, calculado a partir do início (continua certo ao recarregar a página).
 * Chama `onTimeUp` uma vez quando o tempo acaba.
 */
export function useExamTimer(startedAt: string, timeLimitSeconds: number, onTimeUp: () => void): number {
  const deadline = new Date(startedAt).getTime() + timeLimitSeconds * 1000;
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.round((deadline - Date.now()) / 1000)));
  const onTimeUpRef = useRef(onTimeUp);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    const tick = () => {
      const next = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0 && !hasFiredRef.current) {
        hasFiredRef.current = true;
        onTimeUpRef.current();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return remaining;
}
