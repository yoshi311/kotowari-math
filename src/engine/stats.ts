// データの分析で使う計算（図と問題作成で共通）

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const mean = (xs: number[]) => sum(xs) / xs.length;

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/** 高校の教科書の決め方：中央値で2つに分け（奇数個なら中央値は除く）、それぞれの中央値 */
export function quartiles(xs: number[]): { min: number; q1: number; q2: number; q3: number; max: number } {
  const s = [...xs].sort((a, b) => a - b);
  const h = Math.floor(s.length / 2);
  return {
    min: s[0],
    q1: median(s.slice(0, h)),
    q2: median(s),
    q3: median(s.slice(s.length - h)),
    max: s[s.length - 1],
  };
}

/** 最頻値（いちばん多い値。同数なら小さい方から全部） */
export function modes(xs: number[]): number[] {
  const c = new Map<number, number>();
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
  const top = Math.max(...c.values());
  return [...c.entries()].filter(([, v]) => v === top).map(([k]) => k).sort((a, b) => a - b);
}

/** 分散（偏差の2乗の平均） */
export function variance(xs: number[]): number {
  const m = mean(xs);
  return mean(xs.map((x) => (x - m) ** 2));
}

export const sd = (xs: number[]) => Math.sqrt(variance(xs));

export function covariance(xs: number[], ys: number[]): number {
  const mx = mean(xs);
  const my = mean(ys);
  return mean(xs.map((x, i) => (x - mx) * (ys[i] - my)));
}

export function correlation(xs: number[], ys: number[]): number {
  return covariance(xs, ys) / (sd(xs) * sd(ys));
}

export function comb(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** 公正なコインを n 回投げて、表がちょうど k 回出る確率 */
export const binom = (n: number, k: number) => comb(n, k) / 2 ** n;

/** 表が k 回以上出る確率 */
export function binomTail(n: number, k: number): number {
  let p = 0;
  for (let j = k; j <= n; j++) p += binom(n, j);
  return p;
}
