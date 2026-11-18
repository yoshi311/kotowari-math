// 文字式を「多項式」として読み取り、整理された形（単項式→係数の表）に変換する。
// 例: "(x+2)(x+3)" → { "x^2": 1, "x": 5, "": 6 }
// 入力のゆれ（全角、×、−、²など）を吸収するので、生徒が書いた答えの判定に使う。

export type Poly = Map<string, number>;

const EPS = 1e-9;

/** 全角→半角、記号のゆれを統一し、空白を取り除く */
export function normalizeInput(raw: string): string {
  // ² ³ は NFKC で 2 3 になってしまうので、先に ^2 ^3 へ置きかえてから全角→半角にする
  return raw
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .normalize('NFKC')
    .replace(/[−－ー‐–—]/g, '-')
    .replace(/[×✕・･]/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
    .toLowerCase();
}

type Tok =
  | { t: 'num'; v: number }
  | { t: 'var'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^' | '(' | ')' };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const v = Number(s.slice(i, j));
      if (Number.isNaN(v)) throw new Error('数字が読めません');
      out.push({ t: 'num', v });
      i = j;
    } else if (/[a-z]/.test(c)) {
      out.push({ t: 'var', v: c });
      i++;
    } else if ('+-*/^()'.includes(c)) {
      out.push({ t: 'op', v: c as any });
      i++;
    } else {
      throw new Error(`「${c}」は使えません`);
    }
  }
  return out;
}

// ---------- 多項式の演算 ----------

function keyOf(powers: Record<string, number>): string {
  return Object.keys(powers)
    .filter((k) => powers[k] !== 0)
    .sort()
    .map((k) => (powers[k] === 1 ? k : `${k}^${powers[k]}`))
    .join('');
}

function parseKey(key: string): Record<string, number> {
  const out: Record<string, number> = {};
  const re = /([a-z])(?:\^(\d+))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(key))) out[m[1]] = m[2] ? Number(m[2]) : 1;
  return out;
}

function clean(p: Poly): Poly {
  const out: Poly = new Map();
  for (const [k, v] of p) if (Math.abs(v) > EPS) out.set(k, v);
  return out;
}

export function constPoly(n: number): Poly {
  return clean(new Map([['', n]]));
}

function varPoly(v: string): Poly {
  return new Map([[v, 1]]);
}

export function add(a: Poly, b: Poly, sign = 1): Poly {
  const out: Poly = new Map(a);
  for (const [k, v] of b) out.set(k, (out.get(k) ?? 0) + sign * v);
  return clean(out);
}

export function mul(a: Poly, b: Poly): Poly {
  const out: Poly = new Map();
  for (const [ka, va] of a) {
    for (const [kb, vb] of b) {
      const pa = parseKey(ka);
      const pb = parseKey(kb);
      for (const [v, e] of Object.entries(pb)) pa[v] = (pa[v] ?? 0) + e;
      const k = keyOf(pa);
      out.set(k, (out.get(k) ?? 0) + va * vb);
    }
  }
  return clean(out);
}

function pow(a: Poly, n: number): Poly {
  let r = constPoly(1);
  for (let i = 0; i < n; i++) r = mul(r, a);
  return r;
}

function isConst(p: Poly): boolean {
  return [...p.keys()].every((k) => k === '');
}

export function constValue(p: Poly): number | null {
  if (!isConst(p)) return null;
  return p.get('') ?? 0;
}

// ---------- 構文解析（再帰下降） ----------

export function parsePoly(raw: string): Poly {
  const toks = tokenize(normalizeInput(raw));
  if (toks.length === 0) throw new Error('式が空です');
  let pos = 0;
  const peek = () => toks[pos];
  const isOp = (v: string) => {
    const t = peek();
    return !!t && t.t === 'op' && t.v === v;
  };

  function expr(): Poly {
    let left = term();
    while (isOp('+') || isOp('-')) {
      const sign = (toks[pos++] as any).v === '+' ? 1 : -1;
      left = add(left, term(), sign);
    }
    return left;
  }

  function startsFactor(): boolean {
    const t = peek();
    if (!t) return false;
    return t.t === 'num' || t.t === 'var' || (t.t === 'op' && t.v === '(');
  }

  function term(): Poly {
    let left = unary();
    for (;;) {
      if (isOp('*')) {
        pos++;
        left = mul(left, unary());
      } else if (isOp('/')) {
        pos++;
        const d = constValue(unary());
        if (d === null) throw new Error('文字でわる式はまだ使えません');
        if (Math.abs(d) < EPS) throw new Error('0 ではわれません');
        left = mul(left, constPoly(1 / d));
      } else if (startsFactor()) {
        left = mul(left, power()); // 2x や (x+1)(x+2) のような省略されたかけ算
      } else break;
    }
    return left;
  }

  function unary(): Poly {
    if (isOp('-')) {
      pos++;
      return mul(constPoly(-1), unary());
    }
    if (isOp('+')) {
      pos++;
      return unary();
    }
    return power();
  }

  function power(): Poly {
    const base = primary();
    if (isOp('^')) {
      pos++;
      let n: number | null;
      if (isOp('(')) {
        pos++;
        n = constValue(expr());
        if (!isOp(')')) throw new Error('かっこが閉じていません');
        pos++;
      } else {
        const t = toks[pos++];
        n = t && t.t === 'num' ? t.v : null;
      }
      if (n === null || !Number.isInteger(n) || n < 0 || n > 12) {
        throw new Error('指数は 0〜12 の整数にしてね');
      }
      return pow(base, n);
    }
    return base;
  }

  function primary(): Poly {
    const t = toks[pos++];
    if (!t) throw new Error('式が途中で終わっています');
    if (t.t === 'num') return constPoly(t.v);
    if (t.t === 'var') return varPoly(t.v);
    if (t.v === '(') {
      const inner = expr();
      if (!isOp(')')) throw new Error('かっこが閉じていません');
      pos++;
      return inner;
    }
    throw new Error(`「${t.v}」の位置がおかしいです`);
  }

  const result = expr();
  if (pos < toks.length) throw new Error('式の書き方がおかしいところがあります');
  return result;
}

export function polyEqual(a: Poly, b: Poly): boolean {
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    if (Math.abs((a.get(k) ?? 0) - (b.get(k) ?? 0)) > 1e-7) return false;
  }
  return true;
}

/**
 * 「整理された形」で書かれているか。
 * - かっこ・×・÷を使っていない
 * - 同類項がまとまっている（書かれた項の数 = 整理後の項の数）
 * - 1つの項の中で同じ文字を2回書いていない（xx ではなく x^2）
 */
export function isTidy(raw: string): boolean {
  const s = normalizeInput(raw);
  if (/[()*/]/.test(s)) return false;
  const terms = s.split(/(?<!\^)(?=[+-])/).filter((t) => t.replace(/[+-]/g, '') !== '');
  for (const t of terms) {
    const noExp = t.replace(/\^\d+/g, '');
    const letters = noExp.match(/[a-z]/g) ?? [];
    if (new Set(letters).size !== letters.length) return false;
    if (/[a-z]\d/.test(noExp)) return false; // x2 のように数字が文字の後ろにある
  }
  try {
    return terms.length === parsePoly(s).size || (parsePoly(s).size === 0 && terms.length === 1);
  } catch {
    return false;
  }
}

/**
 * 「かけ算の形（因数分解した形）」で書かれているか。
 * かっこの外にたし算・ひき算が残っていなければOK（先頭のマイナスは可）。
 * 例: (x+2)(x+3) ○ / 2x(x-1) ○ / x^2+5x+6 × / (x+1)(x+2)+1 ×
 */
export function isFactored(raw: string): boolean {
  const s = normalizeInput(raw);
  if (!s.includes('(')) return false;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if ((c === '+' || c === '-') && depth === 0 && i > 0 && s[i - 1] !== '^') return false;
  }
  return depth === 0;
}
