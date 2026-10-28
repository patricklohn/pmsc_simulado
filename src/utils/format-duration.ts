/** Segundos em `H:MM:SS` (ou `MM:SS` abaixo de uma hora). */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Duração legível: `1 h 05 min`, `12 min`, `40 s`. */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m > 0) return `${m} min`;
  return `${seconds} s`;
}

/** Dias inteiros entre duas datas ISO (AAAA-MM-DD). */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.UTC(...isoParts(fromIso));
  const to = Date.UTC(...isoParts(toIso));
  return Math.round((to - from) / 86_400_000);
}

function isoParts(iso: string): [number, number, number] {
  const [year, month, day] = iso.split('-').map(Number);
  return [year, month - 1, day];
}
