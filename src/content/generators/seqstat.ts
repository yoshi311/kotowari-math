// 数学B「数列」「統計的な推測」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, randInt } from '../../engine/format';
import { fracStr, fracTex } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: readonly T[]): T => xs[randInt(0, xs.length - 1)];
const nz = (min: number, max: number) => randInt(min, max, { nonZero: true });

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

/** n の式（係数の配列 [n², n, 定数]）→ 文字列 */
const nPoly = (c: number[]) => {
  const k = c.length - 1;
  return fmt(c.map((v, i) => [v, k - i === 0 ? '' : k - i === 1 ? 'n' : `n^${k - i}`] as [number, string]));
};
/** 数の列を TeX の「a, b, c, …」に */
const listTex = (xs: number[], dots = true) => xs.join(',\\ ') + (dots ? ',\\ \\cdots' : '');
/** 「+ q」「- q」の形（0 なら空） */
const plusTex = (q: number) => (q === 0 ? '' : q > 0 ? ` + ${q}` : ` - ${-q}`);
/** 有効数字のゆれを消した小数の文字列 */
const dec = (v: number, d = 4) => String(Number(v.toFixed(d)));

/** 標準正規分布表の値 P(0 ≤ Z ≤ z) */
export const NORMAL_TABLE: Record<string, number> = { '0.5': 0.1915, '1': 0.3413, '1.5': 0.4332, '1.96': 0.475, '2': 0.4772, '2.5': 0.4938, '3': 0.4987 };

export const seqStatGenerators: Record<string, Gen> = {
  /** 等差数列の一般項・第 k 項 */
  'arith-term': (level) => {
    const kind = randInt(0, 2);
    const a1 = randInt(-9, 12);
    const d = nz(-5, 6);
    const an = nPoly([d, a1 - d]);
    if (kind === 2) {
      const k = randInt(10, 30);
      const ans = a1 + (k - 1) * d;
      return {
        ...base('arith-term', level),
        mode: 'number',
        prompt: `等差数列 $${listTex([a1, a1 + d, a1 + 2 * d, a1 + 3 * d])}$ の第 ${k} 項を求めよう。`,
        answer: String(ans),
        before: `第 ${k} 項：`,
        hint: '公差 d は「となりとの差」。第 k 項は $a_1 + (k - 1)d$。',
        kaiMistake: `$${a1} + ${k} \\times ${d < 0 ? `(${d})` : d}$ にしちゃった！ 第 ${k} 項までに公差を足すのは ${k - 1} 回だ…。`,
        explain: `初項 ${a1}、公差 ${d} なので、第 ${k} 項は $${a1} + (${k} - 1) \\times ${d < 0 ? `(${d})` : d} = ${ans}$`,
      };
    }
    if (kind === 1) {
      const p = randInt(2, 5);
      const q = randInt(p + 2, 12);
      const u = a1 + (p - 1) * d;
      const v = a1 + (q - 1) * d;
      return {
        ...base('arith-term', level),
        mode: 'expr',
        tidy: true,
        prompt: `等差数列 $\\{a_n\\}$ で、$a_{${p}} = ${u}$、$a_{${q}} = ${v}$ のとき、一般項 $a_n$ を n の式で求めよう。`,
        answer: an,
        before: 'a_n ＝',
        hint: `第 ${p} 項から第 ${q} 項までに、公差 d を ${q - p} 回足している。`,
        kaiMistake: `公差を $\\dfrac{${v} - ${u < 0 ? `(${u})` : u}}{${q}}$ にしちゃった！ 足した回数は ${q} − ${p} = ${q - p} 回だ…。`,
        explain: `$${v} - ${u < 0 ? `(${u})` : u} = ${q - p}d$ より $d = ${d}$。初項は $a_1 = ${u} - ${p - 1} \\times ${d < 0 ? `(${d})` : d} = ${a1}$。$a_n = ${a1} + (n - 1) \\times ${d < 0 ? `(${d})` : d} = ${an}$`,
      };
    }
    return {
      ...base('arith-term', level),
      mode: 'expr',
      tidy: true,
      prompt: `初項 ${a1}、公差 ${d} の等差数列 $\\{a_n\\}$ の一般項 $a_n$ を n の式で求めよう。`,
      answer: an,
      before: 'a_n ＝',
      hint: '$a_n = a_1 + (n - 1)d$',
      kaiMistake: `$${a1} + ${d < 0 ? `(${d})` : d}n$ にしちゃった！ 公差を足すのは (n − 1) 回だ…。`,
      explain: `$a_n = ${a1} + (n - 1) \\times ${d < 0 ? `(${d})` : d} = ${an}$`,
    };
  },

  /** 等差数列の和 */
  'arith-sum': (level) => {
    const a1 = randInt(-6, 10);
    const d = pickOne([1, 2, 3, 4, 5, -2, -3]);
    const n = randInt(8, 25);
    const an = a1 + (n - 1) * d;
    const S = (n * (a1 + an)) / 2;
    if (Math.random() < 0.5) {
      return {
        ...base('arith-sum', level),
        mode: 'number',
        prompt: `等差数列の和 $${listTex([a1, a1 + d, a1 + 2 * d], false)},\\ \\cdots,\\ ${an}$ を求めよう。`,
        answer: String(S),
        before: '和：',
        hint: `まず項の数を数える。$${an} = ${a1} + (n - 1) \\times ${d < 0 ? `(${d})` : d}$ から n を求めて、$S = \\dfrac{n(\\text{初項} + \\text{末項})}{2}$。`,
        kaiMistake: `項の数を $\\dfrac{${an} - ${a1 < 0 ? `(${a1})` : a1}}{${d < 0 ? `(${d})` : d}} = ${n - 1}$ 個にしちゃった！ 最初の項の分 1 を足して ${n} 個だ…。`,
        explain: `項の数は $\\dfrac{${an} - ${a1 < 0 ? `(${a1})` : a1}}{${d < 0 ? `(${d})` : d}} + 1 = ${n}$。和は $\\dfrac{${n}(${a1} + ${an < 0 ? `(${an})` : an})}{2} = ${S}$`,
      };
    }
    return {
      ...base('arith-sum', level),
      mode: 'number',
      prompt: `初項 ${a1}、公差 ${d} の等差数列の、初項から第 ${n} 項までの和を求めよう。`,
      answer: String(S),
      before: '和：',
      hint: '$S_n = \\dfrac{n\\{2a_1 + (n - 1)d\\}}{2}$',
      kaiMistake: '2 でわるのを忘れた！ 逆向きに並べた列と足すと 2 倍になるから、最後に 2 でわるんだった…。',
      explain: `$S_{${n}} = \\dfrac{${n}\\{2 \\times ${a1 < 0 ? `(${a1})` : a1} + ${n - 1} \\times ${d < 0 ? `(${d})` : d}\\}}{2} = \\dfrac{${n} \\times ${2 * a1 + (n - 1) * d < 0 ? `(${2 * a1 + (n - 1) * d})` : 2 * a1 + (n - 1) * d}}{2} = ${S}$`,
    };
  },

  /** 等比数列の第 k 項・和 */
  'geo-sum': (level) => {
    const half = Math.random() < 0.25;
    if (half) {
      const n = randInt(4, 6);
      const a1 = 2 ** (n - 1) * pickOne([1, 3]);
      const terms = Array.from({ length: n }, (_, i) => a1 / 2 ** i);
      const S = terms.reduce((s, v) => s + v, 0);
      return {
        ...base('geo-sum', level),
        mode: 'number',
        prompt: `初項 ${a1}、公比 $\\dfrac{1}{2}$ の等比数列の、初項から第 ${n} 項までの和を求めよう。`,
        answer: String(S),
        before: '和：',
        hint: '$S_n = \\dfrac{a(1 - r^n)}{1 - r}$。項が少ないので、書き出して足してもよい。',
        kaiMistake: '公比を 2 にして計算しちゃった！ 1/2 倍ずつ小さくなる数列だ…。',
        explain: `$${terms.join(' + ')} = ${S}$。公式でも $\\dfrac{${a1}\\left\\{1 - \\left(\\frac{1}{2}\\right)^{${n}}\\right\\}}{1 - \\frac{1}{2}} = ${S}$`,
      };
    }
    const a1 = pickOne([1, 2, 3, 5, -1, -2]);
    const r = pickOne([2, 3, -2, -3]);
    const first = [a1, a1 * r, a1 * r * r];
    if (Math.random() < 0.45) {
      const k = randInt(5, 8);
      const ans = a1 * r ** (k - 1);
      return {
        ...base('geo-sum', level),
        mode: 'number',
        prompt: `等比数列 $${listTex(first)}$ の第 ${k} 項を求めよう。`,
        answer: String(ans),
        before: `第 ${k} 項：`,
        hint: '公比 r は「となりへの倍率」。第 k 項は $a_1 r^{k-1}$。',
        kaiMistake: `$${a1} \\times ${r < 0 ? `(${r})` : r}^{${k}}$ にしちゃった！ 公比をかけるのは ${k - 1} 回だ…。`,
        explain: `初項 ${a1}、公比 ${r} なので、第 ${k} 項は $${a1} \\times ${r < 0 ? `(${r})` : r}^{${k - 1}} = ${ans}$`,
      };
    }
    const n = randInt(4, 7);
    const S = (a1 * (r ** n - 1)) / (r - 1);
    return {
      ...base('geo-sum', level),
      mode: 'number',
      prompt: `初項 ${a1}、公比 ${r} の等比数列の、初項から第 ${n} 項までの和を求めよう。`,
      answer: String(S),
      before: '和：',
      hint: '$S_n = \\dfrac{a(r^n - 1)}{r - 1}$（r ≠ 1）',
      kaiMistake: `$r^n$ を $r^{n-1}$ にしちゃった！ 和の公式は $r^n$ だ…。`,
      explain: `$S_{${n}} = \\dfrac{${a1}\\{${r < 0 ? `(${r})` : r}^{${n}} - 1\\}}{${r} - 1} = \\dfrac{${a1} \\times ${r ** n - 1 < 0 ? `(${r ** n - 1})` : r ** n - 1}}{${r - 1}} = ${S}$`,
    };
  },

  /** Σ の計算 */
  'sigma-sum': (level) => {
    if (Math.random() < 0.5) {
      const a = randInt(0, 3);
      const b = randInt(-4, 4, { nonZero: a === 0 });
      const c = randInt(-5, 5);
      const n = randInt(5, 12);
      const s1 = (n * (n + 1)) / 2;
      const s2 = (n * (n + 1) * (2 * n + 1)) / 6;
      const ans = a * s2 + b * s1 + c * n;
      const inner = fmt([[a, 'k^2'], [b, 'k'], [c, '']]);
      return {
        ...base('sigma-sum', level),
        mode: 'number',
        prompt: `$\\displaystyle\\sum_{k=1}^{${n}} (${inner})$ を求めよう。`,
        answer: String(ans),
        before: '答え：',
        hint: '$\\sum k = \\dfrac{n(n + 1)}{2}$、$\\sum k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$、$\\sum c = cn$',
        kaiMistake: `定数 ${c} を 1 回だけ足しちゃった！ k = 1 から ${n} まで、${n} 回足すんだった…。`,
        explain: `k = 1 から ${n} までで $\\sum k^2 = ${s2}$、$\\sum k = ${s1}$、定数は ${n} 回足す。だから $${[
        a ? `${a} \\times ${s2}` : '',
        b ? `${b < 0 ? `(${b})` : b} \\times ${s1}` : '',
        c ? `${c < 0 ? `(${c})` : c} \\times ${n}` : '',
      ]
        .filter(Boolean)
        .join(' + ')} = ${ans}$`,
      };
    }
    const a = pickOne([2, 4, 6, -2]);
    const b = randInt(-4, 4);
    const inner = fmt([[a, 'k'], [b, '']]);
    const ans = nPoly([a / 2, a / 2 + b, 0]);
    return {
      ...base('sigma-sum', level),
      mode: 'expr',
      tidy: true,
      prompt: `$\\displaystyle\\sum_{k=1}^{n} (${inner})$ を n の式で求めよう。`,
      answer: ans,
      before: '答え：',
      hint: '$\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2}$、$\\sum_{k=1}^{n} c = cn$',
      kaiMistake: b !== 0 ? `定数 ${b} を足しわすれた！ ${b} を n 回足すから ${b}n だ…。` : '$\\sum k$ を $n^2$ にしちゃった！ $\\dfrac{n(n + 1)}{2}$ だ…。',
      explain: `$${a} \\times \\dfrac{n(n + 1)}{2}${b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}n`} = ${ans}$`,
    };
  },

  /** 階差数列から一般項 */
  'diff-seq': (level) => {
    const a1 = randInt(-3, 6);
    const p = pickOne([2, 4, -2]);
    const q = randInt(-3, 4);
    // 階差 b_n = pn + q、a_n = a_1 + Σ_{k=1}^{n-1} (pk + q)
    const coef = [p / 2, q - p / 2, a1 - q];
    const at = (n: number) => coef[0] * n * n + coef[1] * n + coef[2];
    const terms = [1, 2, 3, 4, 5].map(at);
    const bTex = fmt([[p, 'n'], [q, '']]);
    return {
      ...base('diff-seq', level),
      mode: 'expr',
      tidy: true,
      prompt: `数列 $${listTex(terms)}$ の一般項 $a_n$ を n の式で求めよう。`,
      answer: nPoly(coef),
      before: 'a_n ＝',
      hint: 'となりどうしの差（階差数列）を書き出すと、等差数列になっている。',
      kaiMistake: '階差数列の和を k = 1 から n までにしちゃった！ 足すのは n − 1 個までだ…。',
      explain: `階差数列は $${listTex([1, 2, 3, 4].map((n) => at(n + 1) - at(n)))}$ で、$b_n = ${bTex}$。n ≧ 2 のとき $a_n = ${a1} + \\displaystyle\\sum_{k=1}^{n-1} (${fmt([[p, 'k'], [q, '']])}) = ${nPoly(coef)}$。これは n = 1 のときも成り立つ。`,
    };
  },

  /** 漸化式 a_{n+1} = p a_n + q */
  recurrence: (level) => {
    const p = pickOne([2, 3, -2]);
    const al = randInt(-3, 3);
    const q = al * (1 - p);
    let a1 = randInt(-2, 5);
    if (a1 === al) a1 += 1;
    const k = randInt(4, 6);
    const ans = (a1 - al) * p ** (k - 1) + al;
    return {
      ...base('recurrence', level),
      mode: 'number',
      prompt: `$a_1 = ${a1}$、$a_{n+1} = ${p}a_n${plusTex(q)}$ で定められる数列 $\\{a_n\\}$ の第 ${k} 項 $a_{${k}}$ を求めよう。`,
      answer: String(ans),
      before: `a_${k} ＝`,
      hint: `順に代入してもよいし、$\\alpha = ${p}\\alpha${plusTex(q)}$ をみたす α を使って $a_{n+1} - \\alpha = ${p}(a_n - \\alpha)$ と変形してもよい。`,
      kaiMistake: `第 ${k} 項なのに、${k} 回くり返しちゃった！ $a_1$ から $a_{${k}}$ までは ${k - 1} 回だ…。`,
      explain: `$\\alpha = ${p}\\alpha${plusTex(q)}$ より $\\alpha = ${al}$。$a_{n+1}${plusTex(-al)} = ${p}(a_n${plusTex(-al)})$ なので、数列 $\\{a_n${plusTex(-al)}\\}$ は初項 ${a1 - al}、公比 ${p} の等比数列。$a_{${k}} = ${a1 - al} \\times ${p < 0 ? `(${p})` : p}^{${k - 1}}${plusTex(al)} = ${ans}$`,
    };
  },

  /** 確率変数の期待値・分散 */
  'rv-mean': (level) => {
    if (Math.random() < 0.55) {
      const D = pickOne([4, 5, 6, 8, 10]);
      const c1 = randInt(1, D - 2);
      const c2 = randInt(1, D - c1 - 1);
      const cs = [c1, c2, D - c1 - c2];
      const x0 = randInt(-2, 2);
      const step = randInt(1, 3);
      const xs = [x0, x0 + step, x0 + step * pickOne([2, 3])];
      const sx = xs.reduce((s, x, i) => s + x * cs[i], 0);
      const sxx = xs.reduce((s, x, i) => s + x * x * cs[i], 0);
      const wantE = Math.random() < 0.5;
      const ans = wantE ? fracStr(sx, D) : fracStr(D * sxx - sx * sx, D * D);
      return {
        ...base('rv-mean', level),
        mode: 'number',
        prompt: `確率変数 X のとり得る値が $${xs.join(',\\ ')}$ で、その確率がそれぞれ $${cs.map((c) => fracTex(c, D)).join(',\\ ')}$ である。X の${wantE ? '期待値 $E(X)$' : '分散 $V(X)$'}を求めよう。`,
        answer: ans,
        before: wantE ? 'E(X) ＝' : 'V(X) ＝',
        hint: wantE ? '$E(X) = \\sum x_k p_k$（値 × 確率 の合計）' : '$V(X) = E(X^2) - \\{E(X)\\}^2$',
        kaiMistake: wantE ? '値を足して 3 でわっちゃった！ 確率で重みをつけるんだった…。' : '$E(X^2)$ をそのまま答えにしちゃった！ $\\{E(X)\\}^2$ を引くんだった…。',
        explain: `$E(X) = ${fracTex(sx, D)}$、$E(X^2) = ${fracTex(sxx, D)}$。${wantE ? `期待値は $${fracTex(sx, D)}$` : `$V(X) = ${fracTex(sxx, D)} - \\left(${fracTex(sx, D)}\\right)^2 = ${fracTex(D * sxx - sx * sx, D * D)}$`}`,
      };
    }
    const m = randInt(-3, 6);
    const s = randInt(1, 4);
    const v = s * s;
    const a = nz(-3, 4);
    const b = randInt(-5, 5);
    const ask = randInt(0, 2);
    const Y = `${a === 1 ? '' : a === -1 ? '-' : a}X${plusTex(b)}`;
    const ans = ask === 0 ? a * m + b : ask === 1 ? a * a * v : Math.abs(a) * s;
    const word = ask === 0 ? '期待値 $E' : ask === 1 ? '分散 $V' : '標準偏差 $\\sigma';
    return {
      ...base('rv-mean', level),
      mode: 'number',
      prompt: `確率変数 X の期待値が ${m}、分散が ${v} のとき、$Y = ${Y}$ の${word}(Y)$ を求めよう。`,
      answer: String(ans),
      before: ask === 0 ? 'E(Y) ＝' : ask === 1 ? 'V(Y) ＝' : 'σ(Y) ＝',
      hint: '$E(aX + b) = aE(X) + b$、$V(aX + b) = a^2 V(X)$、$\\sigma(aX + b) = |a|\\sigma(X)$',
      kaiMistake: ask === 0 ? '+b を忘れた！ 期待値は全体がずれる分も入るんだった…。' : '+b の分まで足しちゃった！ 全体をずらしても、ちらばりは変わらないんだった…。',
      explain: ask === 0 ? `$E(Y) = ${a} \\times ${m < 0 ? `(${m})` : m}${plusTex(b)} = ${ans}$` : ask === 1 ? `$V(Y) = ${a < 0 ? `(${a})` : a}^2 \\times ${v} = ${ans}$（b はちらばりに関係しない）` : `$\\sigma(X) = \\sqrt{${v}} = ${s}$ なので $\\sigma(Y) = |${a}| \\times ${s} = ${ans}$`,
    };
  },

  /** 二項分布の期待値・分散・標準偏差 */
  'binom-ev': (level) => {
    const cases: { text: string; pn: number; pd: number; ns: number[] }[] = [
      { text: 'さいころを {n} 回投げて、1 の目が出る回数', pn: 1, pd: 6, ns: [180, 720, 36, 60, 120] },
      { text: 'コインを {n} 回投げて、表が出る回数', pn: 1, pd: 2, ns: [100, 400, 36, 64, 50] },
      { text: '当たる確率が $\\dfrac{1}{3}$ のくじを {n} 回ひいて、当たる回数（ひいたくじはもどす）', pn: 1, pd: 3, ns: [72, 450, 18, 90, 60] },
      { text: '成功する確率が $\\dfrac{1}{5}$ の実験を {n} 回くり返して、成功する回数', pn: 1, pd: 5, ns: [100, 400, 25, 50, 75] },
    ];
    const c = pickOne(cases);
    const n = pickOne(c.ns);
    const E = (n * c.pn) / c.pd;
    const Vn = n * c.pn * (c.pd - c.pn);
    const Vd = c.pd * c.pd;
    const V = Vn / Vd;
    const sq = Number.isInteger(Math.sqrt(V)) && Number.isInteger(V);
    let ask = randInt(0, 2);
    if (ask === 2 && !sq) ask = 1;
    const ans = ask === 0 ? String(E) : ask === 1 ? fracStr(Vn, Vd) : String(Math.sqrt(V));
    const pTex = fracTex(c.pn, c.pd);
    return {
      ...base('binom-ev', level),
      mode: 'number',
      prompt: `${c.text.replace('{n}', String(n))}を X とする。X の${ask === 0 ? '期待値 $E(X)$' : ask === 1 ? '分散 $V(X)$' : '標準偏差 $\\sigma(X)$'}を求めよう。`,
      answer: ans,
      before: ask === 0 ? 'E(X) ＝' : ask === 1 ? 'V(X) ＝' : 'σ(X) ＝',
      hint: `X は二項分布 $B\\left(${n},\\ ${pTex}\\right)$ にしたがう。$E(X) = np$、$V(X) = np(1 - p)$、$\\sigma(X) = \\sqrt{np(1 - p)}$`,
      kaiMistake: ask === 0 ? '回数と確率を足しちゃった！ 期待値は n × p だ…。' : '$(1 - p)$ をかけわすれた！ 分散は np(1 − p) だ…。',
      explain: `X は $B\\left(${n},\\ ${pTex}\\right)$ にしたがうので、$E(X) = ${n} \\times ${pTex} = ${E}$、$V(X) = ${n} \\times ${pTex} \\times ${fracTex(c.pd - c.pn, c.pd)} = ${fracTex(Vn, Vd)}$${sq ? `、$\\sigma(X) = \\sqrt{${V}} = ${Math.sqrt(V)}$` : ''}。`,
    };
  },

  /** 正規分布の確率（標準化して表を使う） */
  'normal-prob': (level) => {
    const [m, s] = pickOne([[50, 10], [60, 5], [170, 6], [100, 15], [500, 100]] as const);
    const zs = ['0.5', '1', '1.5', '2', '2.5'];
    const kind = randInt(0, 2);
    const z1 = pickOne(zs);
    let z2 = pickOne(zs);
    if (kind === 2 && z2 === z1) z2 = zs[(zs.indexOf(z1) + 1) % zs.length];
    const T = NORMAL_TABLE;
    const X = (z: string) => m + Number(z) * s;
    let cond: string, ans: number, how: string;
    if (kind === 0) {
      cond = `X \\ge ${X(z1)}`;
      ans = 0.5 - T[z1];
      how = `P(Z \\ge ${z1}) = 0.5 - ${T[z1]}`;
    } else if (kind === 1) {
      cond = `X \\le ${m - Number(z1) * s}`;
      ans = 0.5 - T[z1];
      how = `P(Z \\le -${z1}) = 0.5 - ${T[z1]}`;
    } else {
      cond = `${m - Number(z1) * s} \\le X \\le ${X(z2)}`;
      ans = T[z1] + T[z2];
      how = `P(-${z1} \\le Z \\le ${z2}) = ${T[z1]} + ${T[z2]}`;
    }
    const used = [...new Set(kind === 2 ? [z1, z2] : [z1])].sort((a, b) => +a - +b);
    return {
      ...base('normal-prob', level),
      mode: 'number',
      prompt: `確率変数 X が正規分布 $N(${m},\\ ${s}^2)$ にしたがうとき、確率 $P(${cond})$ を求めよう。ただし、Z が標準正規分布にしたがうとき ${used.map((z) => `$P(0 \\le Z \\le ${z}) = ${T[z]}$`).join('、')} とする。`,
      answer: dec(ans),
      before: '確率：',
      hint: `$Z = \\dfrac{X - ${m}}{${s}}$ と標準化する。標準正規分布は 0 を中心に左右対称で、片側の合計は 0.5。`,
      kaiMistake: `表の値 ${T[z1]} をそのまま答えにしちゃった！ 求める部分がどこか、図をかいて確かめるんだった…。`,
      explain: `$Z = \\dfrac{X - ${m}}{${s}}$ とおくと、求める確率は $${how} = ${dec(ans)}$`,
    };
  },

  /** 母平均の信頼区間 */
  interval: (level) => {
    const [n, sig] = pickOne([[100, 10], [100, 20], [400, 20], [400, 40], [25, 10], [64, 16], [144, 18], [100, 15], [400, 30]] as const);
    const se = sig / Math.sqrt(n);
    const xbar = pickOne([randInt(40, 180), randInt(400, 800) / 10]);
    const w = Number((1.96 * se).toFixed(3));
    const lower = Math.random() < 0.5;
    const ans = Number((lower ? xbar - w : xbar + w).toFixed(3));
    return {
      ...base('interval', level),
      mode: 'number',
      prompt: `母標準偏差 ${sig} の母集団から大きさ ${n} の標本を取り出したところ、標本平均は ${xbar} であった。母平均 m に対する信頼度 95% の信頼区間を $A \\le m \\le B$ とするとき、${lower ? 'A' : 'B'} の値を求めよう。`,
      answer: String(ans),
      before: `${lower ? 'A' : 'B'} ＝`,
      hint: '信頼度 95% の信頼区間は $\\overline{X} - 1.96 \\times \\dfrac{\\sigma}{\\sqrt{n}} \\le m \\le \\overline{X} + 1.96 \\times \\dfrac{\\sigma}{\\sqrt{n}}$',
      kaiMistake: `$\\sqrt{${n}}$ でわらずに ${n} でわっちゃった！ 標本平均のちらばりは $\\dfrac{\\sigma}{\\sqrt{n}}$ だ…。`,
      explain: `$\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sig}}{\\sqrt{${n}}} = ${se}$、$1.96 \\times ${se} = ${w}$。${lower ? 'A' : 'B'} $= ${xbar} ${lower ? '-' : '+'} ${w} = ${ans}$`,
    };
  },

  /** 仮説検定（二項分布を正規分布で近似） */
  'test-judge': (level): ChoiceQuestion => {
    const [ctx, n, mean, sd] = pickOne([
      ['コインを 100 回投げたところ、表が {k} 回出た。このコインは表と裏の出やすさにかたよりがある', 100, 50, 5],
      ['コインを 400 回投げたところ、表が {k} 回出た。このコインは表と裏の出やすさにかたよりがある', 400, 200, 10],
      ['さいころを 180 回投げたところ、1 の目が {k} 回出た。このさいころは 1 の目の出やすさにかたよりがある', 180, 30, 5],
    ] as const);
    // z は 0.2 きざみ（sd が 5 の倍数なので、回数 k は整数になる）
    const k = mean + (randInt(2, 15) * (Math.random() < 0.5 ? -1 : 1) * sd) / 5;
    const z = (k - mean) / sd;
    const zw = Number(((k - mean) / (sd * sd)).toFixed(2));
    const reject = Math.abs(z) > 1.96;
    const lab = (zz: number, r: boolean) => `z = ${zz} で、帰無仮説は${r ? '棄却される（かたよりがあるといえる）' : '棄却されない（かたよりがあるとはいえない）'}`;
    const correct = lab(z, reject);
    const { choices, answer } = shuffle(correct, [lab(z, !reject), lab(zw, true), lab(zw, false)]);
    return {
      id: 'gen:test-judge',
      level,
      type: 'choice',
      prompt: `${ctx.replace('{k}', String(k))}といえるか、有意水準 5% で検定する。帰無仮説を「かたよりはない」とし、$z = \\dfrac{X - ${mean}}{${sd}}$（X は回数、${n} 回の二項分布を正規分布で近似）とするとき、正しいのは？ ただし $|z| > 1.96$ なら棄却する。`,
      choices,
      answer,
      hint: `かたよりがないとき、回数の平均は ${mean}、標準偏差は ${sd}。$z = \\dfrac{${k} - ${mean}}{${sd}}$`,
      kaiMistake: `分散 ${sd * sd} でわっちゃった！ 標準化は標準偏差 ${sd} でわるんだった…。`,
      explain: `$z = \\dfrac{${k} - ${mean}}{${sd}} = ${z}$。$|z| ${reject ? '>' : '\\le'} 1.96$ なので、帰無仮説は${reject ? '棄却され、かたよりがあるといえる' : '棄却されない。かたよりがあるとはいえない（「かたよりがない」と証明されたわけではない）'}。`,
    };
  },
};
