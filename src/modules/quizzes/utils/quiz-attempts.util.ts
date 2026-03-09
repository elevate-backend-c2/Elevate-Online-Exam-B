export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function findDecompositions(
  N: number,
  P: number,
): [number, number, number][] {
  const out: [number, number, number][] = [];
  const diff = P - N; // m + 2h = diff
  for (let h = 0; h <= N; h++) {
    const m = diff - 2 * h;
    if (m < 0) continue;
    const e = N - m - h;
    if (e >= 0) out.push([e, m, h]);
  }
  return out;
}

export function answersMatch(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) return false;
  const a = [...selected].sort();
  const b = [...correct].sort();
  return a.every((v, i) => v === b[i]);
}
