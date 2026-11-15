// 係数と文字から、きれいな式の文字列（KaTeX にも、答えの判定にもそのまま使える）を作る

export type Term = [coef: number, vars: string];

/** [[1,'x^2'],[-5,'x'],[6,'']] → "x^2-5x+6" */
export function fmt(terms: Term[]): string {
  let s = '';
  for (const [c, v] of terms) {
    if (c === 0) continue;
    const abs = Math.abs(c);
    const body = v === '' ? String(abs) : abs === 1 ? v : `${abs}${v}`;
    if (s === '') s = c < 0 ? `-${body}` : body;
    else s += c < 0 ? `-${body}` : `+${body}`;
  }
  return s === '' ? '0' : s;
}

/** 負の数をかっこでくるむ（代入のときなど） */
export function paren(n: number): string {
  return n < 0 ? `(${n})` : String(n);
}

/** +3 / -3 の形 */
export function signed(n: number): string {
  return n < 0 ? `-${Math.abs(n)}` : `+${n}`;
}

export function randInt(min: number, max: number, opts: { nonZero?: boolean; exclude?: number[] } = {}): number {
  for (;;) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    if (opts.nonZero && n === 0) continue;
    if (opts.exclude?.includes(n)) continue;
    return n;
  }
}
