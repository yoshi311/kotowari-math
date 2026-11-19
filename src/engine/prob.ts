// 場合の数と確率で使う計算（図と問題作成で共通）

export function fact(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** nPr */
export function perm(n: number, r: number): number {
  let v = 1;
  for (let i = 0; i < r; i++) v *= n - i;
  return v;
}

/** nCr */
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return Math.round(perm(n, r) / fact(r));
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** 約分した分数 [分子, 分母] */
export function reduce(n: number, d: number): [number, number] {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

/** 約分した分数の文字列（答えの判定用）："11/36"、分母が 1 なら "3" */
export function fracStr(n: number, d: number): string {
  const [a, b] = reduce(n, d);
  return b === 1 ? String(a) : `${a}/${b}`;
}

/** 約分した分数の TeX */
export function fracTex(n: number, d: number): string {
  const [a, b] = reduce(n, d);
  if (b === 1) return String(a);
  return `${a < 0 ? '-' : ''}\\dfrac{${Math.abs(a)}}{${b}}`;
}
