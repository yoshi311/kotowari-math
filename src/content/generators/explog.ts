// 数学Ⅱ「指数関数・対数関数」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, randInt } from '../../engine/format';
import { fracStr, fracTex, reduce } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: readonly T[]): T => xs[randInt(0, xs.length - 1)];

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

/** a^k の値の TeX（k が負なら分数） */
const powTex = (a: number, k: number) => (k >= 0 ? String(a ** k) : `\\dfrac{1}{${a ** -k}}`);

/** 指数に書く分数 n/d の TeX（約分する） */
function expTex(n: number, d: number): string {
  const [a, b] = reduce(n, d);
  if (b === 1) return String(a);
  return `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`;
}

/** k 乗根 */
const root = (k: number, v: number) => (k === 2 ? `\\sqrt{${v}}` : `\\sqrt[${k}]{${v}}`);

const GIVEN_LOG = '$\\log_{10} 2 = 0.3010$、$\\log_{10} 3 = 0.4771$ とする。';

export const expLogGenerators: Record<string, Gen> = {
  /** 分数・負の指数の値 */
  'exp-simplify': (level) => {
    const [r, n] = pickOne([[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [5, 2]] as const);
    const m = pickOne([1, 2, 3, -1, -2, -3]);
    if (reduce(m, n)[1] === 1) return expLogGenerators['exp-simplify'](level);
    const b = r ** n;
    const e = expTex(m, n);
    return {
      ...base('exp-simplify', level),
      mode: 'number',
      prompt: `$${b}^{${e}}$ の値を求めよう。`,
      answer: m >= 0 ? String(r ** m) : `1/${r ** -m}`,
      before: '値：',
      hint: `$${b} = ${r}^{${n}}$ と書きかえて、指数法則 $(a^m)^n = a^{mn}$ を使おう。`,
      kaiMistake: m < 0 ? 'マイナスの指数を、答えがマイナスになることだと思っちゃった！ $a^{-n} = \\dfrac{1}{a^n}$ だ…。' : undefined,
      explain: `$${b}^{${e}} = (${r}^{${n}})^{${e}} = ${r}^{${m}} = ${powTex(r, m)}$`,
    };
  },

  /** 累乗根のかけ算・わり算を 1 つの累乗に */
  'exp-law': (level) => {
    const r = pickOne([2, 3]);
    const mk = () => ({ k: pickOne([2, 3, 4, 6]), s: randInt(1, r === 2 ? 3 : 2) });
    const [t1, t2, t3] = [mk(), mk(), mk()];
    const num = t1.s * t2.k * t3.k + t2.s * t1.k * t3.k - t3.s * t1.k * t2.k;
    const den = t1.k * t2.k * t3.k;
    const tx = (t: { k: number; s: number }) => root(t.k, r ** t.s);
    const ex = (t: { k: number; s: number }) => expTex(t.s, t.k);
    return {
      ...base('exp-law', level),
      mode: 'number',
      prompt: `$${tx(t1)} \\times ${tx(t2)} \\div ${tx(t3)}$ を $${r}^{p}$ の形で表すとき、p の値を求めよう（分数のままでよい）。`,
      answer: fracStr(num, den),
      before: 'p ＝',
      hint: '$\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$ と書きかえる。かけ算は指数のたし算、わり算は指数のひき算。',
      explain: `$${r}^{${ex(t1)}} \\times ${r}^{${ex(t2)}} \\div ${r}^{${ex(t3)}} = ${r}^{${ex(t1)} + ${ex(t2)} - ${ex(t3)}} = ${r}^{${expTex(num, den)}}$`,
    };
  },

  /** 累乗の大小 */
  'exp-order': (level): ChoiceQuestion => {
    const r = pickOne([2, 3]);
    const pool: [number, number][] = [[1, 2], [2, 3], [3, 4], [3, 2], [4, 3], [5, 4], [5, 6], [5, 3], [7, 4], [1, 3]];
    const picked: [number, number][] = [];
    while (picked.length < 3) {
      const t = pickOne(pool);
      if (!picked.includes(t)) picked.push(t);
    }
    const items = picked.map(([tn, td]) => {
      const j = pickOne(r === 2 ? [1, 2, 3] : [1, 2]);
      return { tex: `${r ** j}^{${expTex(tn, td * j)}}`, val: tn / td, e: expTex(tn, td) };
    });
    const sorted = [...items].sort((a, b) => a.val - b.val);
    const line = (xs: typeof items) => `$${xs.map((x) => x.tex).join(' < ')}$`;
    const correct = line(sorted);
    const perms = [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => line(p.map((i) => sorted[i])));
    const wrongs: string[] = [];
    while (wrongs.length < 3) {
      const w = pickOne(perms);
      if (!wrongs.includes(w)) wrongs.push(w);
    }
    const { choices, answer } = shuffle(correct, wrongs);
    return {
      id: 'gen:exp-order',
      level,
      type: 'choice',
      prompt: `3 つの数 ${items.map((x) => `$${x.tex}$`).join('、')} を小さい順にならべると？`,
      choices,
      answer,
      hint: `すべて ${r} の累乗に直して、指数をくらべよう。底 ${r} は 1 より大きいので、指数が大きいほど大きい。`,
      explain: `${items.map((x) => `$${x.tex} = ${r}^{${x.e}}$`).join('、')}。指数の小さい順にならべて ${correct}`,
    };
  },

  /** 指数方程式 */
  'exp-eq': (level) => {
    const r = pickOne([2, 3]);
    const s = r === 2 ? randInt(1, 3) : randInt(1, 2);
    const B = r ** s;
    const t = r === 2 ? randInt(-4, 7, { nonZero: true }) : randInt(-3, 5, { nonZero: true });
    const p = pickOne([1, 1, 2]);
    const c = randInt(-3, 3);
    const R = powTex(r, t);
    const ex = fmt([[p, 'x'], [c, '']]);
    const lhs = s === 1 ? ex : `${s}(${ex})`;
    return {
      ...base('exp-eq', level),
      mode: 'number',
      prompt: `方程式 $${B}^{${ex}} = ${R}$ を解こう。`,
      answer: fracStr(t - s * c, s * p),
      before: '$x$ ＝',
      hint: `両辺を ${r} の累乗で表そう。${s === 1 ? '' : `$${B} = ${r}^{${s}}$、`}$${R} = ${r}^{${t}}$`,
      explain: `$${r}^{${lhs}} = ${r}^{${t}}$ より、$${lhs} = ${t}$。よって $x = ${fracTex(t - s * c, s * p)}$`,
    };
  },

  /** 指数不等式（底が 1 より小さいと向きが逆） */
  'exp-ineq': (level): ChoiceQuestion => {
    const r = pickOne([2, 3]);
    const dec = Math.random() < 0.5;
    const k = randInt(-3, 3, { nonZero: true });
    const aTex = dec ? `\\left(\\dfrac{1}{${r}}\\right)` : String(r);
    const N = dec ? powTex(r, -k) : powTex(r, k);
    const op = Math.random() < 0.5 ? '>' : '<';
    const rev = (o: string) => (o === '>' ? '<' : '>');
    const solOp = dec ? rev(op) : op;
    const correct = `$x ${solOp} ${k}$`;
    const { choices, answer } = shuffle(correct, [`$x ${rev(solOp)} ${k}$`, `$x ${solOp} ${-k}$`, `$x ${rev(solOp)} ${-k}$`]);
    return {
      id: 'gen:exp-ineq',
      level,
      type: 'choice',
      prompt: `不等式 $${aTex}^{x} ${op} ${N}$ を解こう。`,
      choices,
      answer,
      hint: `右辺も $${aTex}$ の累乗に直そう。${dec ? '底が 1 より小さいときは、不等号の向きに注意。' : ''}`,
      explain: `$${N} = ${aTex}^{${k}}$ なので $${aTex}^{x} ${op} ${aTex}^{${k}}$。底が 1 より${dec ? '小さいので向きが逆になり' : '大きいので向きはそのままで'}、$x ${solOp} ${k}$`,
    };
  },

  /** 対数の値 */
  'log-value': (level) => {
    const [r, s] = pickOne([[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3], [5, 1], [5, 2]] as const);
    const B = r ** s;
    const half = Math.random() < 0.25;
    const tn = half ? pickOne([1, 3, -1, -3]) : randInt(-3, r === 2 ? 5 : r === 3 ? 4 : 3, { nonZero: true });
    const td = half ? 2 : 1;
    const NTex = !half ? powTex(r, tn) : tn > 0 ? `\\sqrt{${r ** tn}}` : `\\dfrac{1}{\\sqrt{${r ** -tn}}}`;
    return {
      ...base('log-value', level),
      mode: 'number',
      prompt: `$\\log_{${B}} ${NTex}$ の値を求めよう。`,
      answer: fracStr(tn, td * s),
      before: '値：',
      hint: `$${B}$ と $${NTex}$ を、どちらも ${r} の累乗で表そう。$\\log_a a^p = p$`,
      explain: `$${NTex} = ${r}^{${expTex(tn, td)}}${s === 1 ? '' : ` = ${B}^{${expTex(tn, td * s)}}`}$ なので、$\\log_{${B}} ${NTex} = ${fracTex(tn, td * s)}$`,
    };
  },

  /** 対数の性質でまとめる */
  'log-calc': (level) => {
    const [a, k] = pickOne([[2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [5, 1], [5, 2], [6, 1], [6, 2], [10, 1], [10, 2]] as const);
    const A = a ** k;
    const z = pickOne([3, 5, 6, 7].filter((v) => v !== a));
    const ys = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15].filter((y) => (A * z) % y === 0 && (A * z) / y > 1 && y !== z);
    if (!ys.length) return expLogGenerators['log-calc'](level);
    const y = pickOne(ys);
    const x = (A * z) / y;
    return {
      ...base('log-calc', level),
      mode: 'number',
      prompt: `$\\log_{${a}} ${x} + \\log_{${a}} ${y} - \\log_{${a}} ${z}$ を計算しよう。`,
      answer: String(k),
      before: '値：',
      hint: 'たし算は真数のかけ算に、ひき算は真数のわり算にまとめて、1 つの log にしよう。',
      kaiMistake: '真数どうしをたし算しちゃった！ $\\log_a M + \\log_a N = \\log_a MN$（かけ算）だ…。',
      explain: `$\\log_{${a}} \\dfrac{${x} \\times ${y}}{${z}} = \\log_{${a}} ${A} = \\log_{${a}} ${a}^{${k}} = ${k}$`,
    };
  },

  /** 底の変換公式 */
  'log-change': (level) => {
    const a = pickOne([2, 3]);
    const b = pickOne([3, 5, 7].filter((v) => v !== a));
    const k = randInt(2, a === 2 ? 5 : 4);
    const inv = Math.random() < 0.3;
    const cTex = inv ? `\\dfrac{1}{${a ** k}}` : String(a ** k);
    const ans = inv ? -k : k;
    return {
      ...base('log-change', level),
      mode: 'number',
      prompt: `$\\log_{${a}} ${b} \\cdot \\log_{${b}} ${cTex}$ を計算しよう。`,
      answer: String(ans),
      before: '値：',
      hint: '底の変換公式 $\\log_a b = \\dfrac{\\log_c b}{\\log_c a}$ で、どちらも同じ底の log の分数にしよう。',
      explain: `$\\dfrac{\\log ${b}}{\\log ${a}} \\cdot \\dfrac{\\log ${cTex}}{\\log ${b}} = \\dfrac{\\log ${cTex}}{\\log ${a}} = \\log_{${a}} ${cTex} = ${ans}$`,
    };
  },

  /** 対数方程式（真数条件に注意） */
  'log-eq': (level) => {
    if (Math.random() < 0.5) {
      const a = pickOne([2, 3]);
      const k = randInt(1, a === 2 ? 4 : 3);
      const p = pickOne([1, 2, 3]);
      const c = randInt(-5, 5);
      const inner = fmt([[p, 'x'], [c, '']]);
      const v = a ** k;
      return {
        ...base('log-eq', level),
        mode: 'number',
        prompt: `方程式 $\\log_{${a}} (${inner}) = ${k}$ を解こう。`,
        answer: fracStr(v - c, p),
        before: '$x$ ＝',
        hint: '$\\log_a M = k \\iff M = a^k$',
        explain: `$${inner} = ${a}^{${k}} = ${v}$ より $x = ${fracTex(v - c, p)}$（このとき真数は $${v} > 0$ なので条件をみたす）`,
      };
    }
    const [a, x0, d] = pickOne([[2, 2, 1], [2, 4, 2], [2, 4, 3], [2, 8, 4], [2, 8, 6], [2, 8, 7], [2, 16, 12], [2, 16, 14], [3, 3, 2], [3, 9, 6], [3, 9, 8], [3, 27, 24]] as const);
    const M = x0 * (x0 - d);
    const k = Math.round(Math.log(M) / Math.log(a));
    return {
      ...base('log-eq', level),
      mode: 'number',
      prompt: `方程式 $\\log_{${a}} x + \\log_{${a}} (x - ${d}) = ${k}$ を解こう。`,
      answer: String(x0),
      before: '$x$ ＝',
      hint: '先に真数条件（$x > 0$ かつ $x - ' + d + ' > 0$）を確認して、左辺を 1 つの log にまとめよう。',
      kaiMistake: `2 次方程式の解を 2 つとも答えにしちゃった！ $x = ${d - x0}$ だと真数が負になる…。`,
      explain: `真数条件より $x > ${d}$。$\\log_{${a}} x(x - ${d}) = ${k}$ より $x(x - ${d}) = ${M}$、$${fmt([[1, 'x^2'], [-d, 'x'], [-M, '']])} = 0$、$(x - ${x0})(x + ${x0 - d}) = 0$。$x > ${d}$ より $x = ${x0}$`,
    };
  },

  /** 対数不等式（真数条件と向き） */
  'log-ineq': (level): ChoiceQuestion => {
    const r = pickOne([2, 3]);
    const dec = Math.random() < 0.5;
    const k = randInt(-2, r === 2 ? 3 : 2, { nonZero: true });
    const bTex = dec ? `\\frac{1}{${r}}` : String(r);
    const N = dec ? powTex(r, -k) : powTex(r, k);
    const Ninv = dec ? powTex(r, k) : powTex(r, -k);
    const op = Math.random() < 0.5 ? '>' : '<';
    const right = (op === '>') === !dec;
    const sol = right ? `x > ${N}` : `0 < x < ${N}`;
    const { choices, answer } = shuffle(`$${sol}$`, [right ? `$0 < x < ${N}$` : `$x > ${N}$`, `$x < ${N}$`, right ? `$x > ${Ninv}$` : `$0 < x < ${Ninv}$`]);
    return {
      id: 'gen:log-ineq',
      level,
      type: 'choice',
      prompt: `不等式 $\\log_{${bTex}} x ${op} ${k}$ を解こう。`,
      choices,
      answer,
      hint: `右辺の ${k} を $\\log_{${bTex}} \\square$ の形に直そう。真数条件 $x > 0$ も忘れずに。`,
      explain: `真数条件より $x > 0$。$${k} = \\log_{${bTex}} ${N}$ なので $\\log_{${bTex}} x ${op} \\log_{${bTex}} ${N}$。底が 1 より${dec ? '小さいので向きが逆になり' : '大きいので向きはそのままで'}、真数条件とあわせて $${sol}$`,
    };
  },

  /** 常用対数でけた数・小数の位 */
  digits: (level) => {
    const b = pickOne([2, 3, 5, 6]);
    const L = b === 2 ? 0.301 : b === 3 ? 0.4771 : b === 5 ? 0.699 : 0.7781;
    const n = randInt(10, b === 6 ? 60 : 80);
    const v = n * L;
    const f = Math.floor(v);
    const frac = v - f;
    if (frac < 0.03 || frac > 0.97 || (BigInt(b) ** BigInt(n)).toString().length !== f + 1) return expLogGenerators.digits(level);
    const ans = f + 1;
    const how = b === 2 ? `${n} \\times 0.3010` : b === 3 ? `${n} \\times 0.4771` : b === 5 ? `${n} \\times (1 - 0.3010)` : `${n} \\times (0.3010 + 0.4771)`;
    const vs = v.toFixed(4);
    if (Math.random() < 0.3) {
      const X = `\\left(\\dfrac{1}{${b}}\\right)^{${n}}`;
      return {
        ...base('digits', level),
        mode: 'number',
        prompt: `${GIVEN_LOG}$${X}$ を小数で表すと、小数第何位にはじめて 0 でない数字があらわれるか。`,
        answer: String(ans),
        before: '小数第',
        after: '位',
        hint: '常用対数をとると負の数になる。その値がどの整数のあいだにあるかを調べよう。',
        explain: `$\\log_{10} ${X} = -${how} = -${vs}$。$-${ans} \\le -${vs} < -${ans - 1}$ より $10^{-${ans}} \\le ${X} < 10^{-${ans - 1}}$。だから小数第 ${ans} 位。`,
      };
    }
    return {
      ...base('digits', level),
      mode: 'number',
      prompt: `${GIVEN_LOG}$${b}^{${n}}$ は何けたの整数か。`,
      answer: String(ans),
      before: '',
      after: 'けた',
      hint: 'まず常用対数をとって、その値がどの整数のあいだにあるかを調べよう。',
      kaiMistake: `整数部分の ${f} をそのままけた数にしちゃった！ $10^1 = 10$ は 2 けただ…。`,
      explain: `$\\log_{10} ${b}^{${n}} = ${how} = ${vs}$。$${f} \\le ${vs} < ${f + 1}$ より $10^{${f}} \\le ${b}^{${n}} < 10^{${f + 1}}$。だから ${ans} けた。`,
    };
  },
};
