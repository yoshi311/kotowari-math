// 数学Ⅱ「いろいろな式」「図形と方程式」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, paren, randInt } from '../../engine/format';
import { fracStr, fracTex, nCr } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: T[]): T => xs[randInt(0, xs.length - 1)];

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

export const coordGenerators: Record<string, Gen> = {
  /** 二項定理の係数 */
  'binom-coef': (level) => {
    const n = randInt(3, 6);
    const a = pickOne([1, 2]);
    const b = pickOne([1, 2, 3, -1, -2]);
    const k = randInt(1, n - 1);
    const ans = nCr(n, k) * a ** k * b ** (n - k);
    const inner = fmt([[a, 'x'], [b, '']]);
    return {
      ...base('binom-coef', level),
      mode: 'number',
      prompt: `$(${inner})^${n}$ を展開したときの $x^${k}$ の係数を求めよう。`,
      answer: String(ans),
      before: '係数：',
      hint: `一般項は ${'$'}{}_{${n}}\\mathrm{C}_{r}\\,(${a === 1 ? '' : a}x)^r \\cdot (${b})^{${n} - r}${'$'}。$r = ${k}$ のとき。`,
      kaiMistake: b < 0 ? `$(${b})^{${n - k}}$ の符号を忘れちゃった！` : `${'$'}{}_{${n}}\\mathrm{C}_{${k}}${'$'} だけで、${a !== 1 ? `$${a}^${k}$ や ` : ''}$${b}^{${n - k}}$ をかけ忘れた！`,
      explain: `${'$'}{}_{${n}}\\mathrm{C}_{${k}} \\times ${a}^{${k}} \\times ${paren(b)}^{${n - k}} = ${nCr(n, k)} \\times ${a ** k} \\times ${paren(b ** (n - k))} = ${ans}$`,
    };
  },

  /** 相加平均・相乗平均で最小値 */
  'amgm-min': (level) => {
    const a = pickOne([1, 2, 3, 4]);
    const t = randInt(1, 6);
    const b = (t * t) / a;
    if (!Number.isInteger(b)) return coordGenerators['amgm-min'](level);
    const ans = 2 * t;
    const ax = a === 1 ? 'x' : `${a}x`;
    return {
      ...base('amgm-min', level),
      mode: 'number',
      prompt: `$x > 0$ のとき、$${ax} + \\dfrac{${b}}{x}$ の最小値を求めよう。`,
      answer: String(ans),
      before: '最小値：',
      hint: '相加平均と相乗平均の関係 $A + B \\ge 2\\sqrt{AB}$（A > 0、B > 0）',
      explain: `$${ax} + \\dfrac{${b}}{x} \\ge 2\\sqrt{${ax} \\cdot \\dfrac{${b}}{x}} = 2\\sqrt{${a * b}} = ${ans}$。等号は $${ax} = \\dfrac{${b}}{x}$ のとき成り立つ。`,
    };
  },

  /** 複素数のかけ算 */
  'complex-mul': (level) => {
    const a = randInt(-4, 5, { nonZero: true });
    const b = randInt(-4, 5, { nonZero: true });
    const c = randInt(-4, 5, { nonZero: true });
    const d = randInt(-4, 5, { nonZero: true });
    const re = a * c - b * d;
    const im = a * d + b * c;
    const askRe = Math.random() < 0.5;
    const z = (x: number, y: number) => `${x} ${y < 0 ? '-' : '+'} ${Math.abs(y) === 1 ? '' : Math.abs(y)}i`;
    return {
      ...base('complex-mul', level),
      mode: 'number',
      prompt: `$(${z(a, b)})(${z(c, d)})$ を計算して $p + qi$ の形にしたとき、${askRe ? '実部 p' : '虚部 q'} を求めよう。`,
      answer: String(askRe ? re : im),
      before: askRe ? 'p ＝' : 'q ＝',
      hint: '展開して、$i^2 = -1$ におきかえる。',
      kaiMistake: '$i^2$ を $1$ にしちゃった！ $i^2 = -1$ だ…。',
      explain: `$${a * c} ${a * d < 0 ? '-' : '+'} ${Math.abs(a * d)}i ${b * c < 0 ? '-' : '+'} ${Math.abs(b * c)}i ${b * d < 0 ? '+' : '-'} ${Math.abs(b * d)} = ${re} ${im < 0 ? '-' : '+'} ${Math.abs(im)}i$（$i^2 = -1$ を使った）`,
    };
  },

  /** 2 次方程式の虚数解 */
  'quad-complex': (level): ChoiceQuestion => {
    const pp = randInt(-3, 3);
    const q = randInt(1, 3);
    const b = -2 * pp;
    const c = pp * pp + q * q;
    const eq = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    const qs = q === 1 ? '' : String(q);
    const right = `$x = ${pp === 0 ? '' : pp} \\pm ${qs}i$`;
    const { choices, answer } = shuffle(right, [
      `$x = ${-pp === 0 ? '' : -pp} \\pm ${qs}i$`,
      `$x = ${pp === 0 ? '' : pp} \\pm ${q * q === 1 ? '' : q * q}i$`,
      `$x = ${pp === 0 ? '' : pp} \\pm ${q}$`,
    ].filter((s, i, arr) => s !== right && arr.indexOf(s) === i).concat(pp === 0 && q === 1 ? ['実数解も虚数解もない'] : []));
    return {
      id: 'gen:quad-complex',
      level,
      type: 'choice',
      prompt: `2 次方程式 $${eq} = 0$ の解は？`,
      choices,
      answer,
      hint: '解の公式で、√ の中がマイナスになったら $\\sqrt{-k} = \\sqrt{k}\\,i$。',
      explain: `$x = \\dfrac{${-b} \\pm \\sqrt{${b * b} - ${4 * c}}}{2} = \\dfrac{${-b} \\pm \\sqrt{${b * b - 4 * c}}}{2} = \\dfrac{${-b} \\pm ${2 * q}i}{2} = ${pp === 0 ? '' : pp} \\pm ${qs}i$`,
    };
  },

  /** 解と係数の関係（対称式の値） */
  'vieta-sym': (level) => {
    const b = randInt(-6, 6, { nonZero: true });
    const c = randInt(-6, 6, { nonZero: true });
    const s = -b;
    const p = c;
    const kind = randInt(0, 2);
    const eq = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    const names = ['\\alpha^2 + \\beta^2', '\\dfrac{1}{\\alpha} + \\dfrac{1}{\\beta}', '(\\alpha - \\beta)^2'];
    const ans = kind === 0 ? fracStr(s * s - 2 * p, 1) : kind === 1 ? fracStr(s, p) : fracStr(s * s - 4 * p, 1);
    const ansTex = kind === 0 ? String(s * s - 2 * p) : kind === 1 ? fracTex(s, p) : String(s * s - 4 * p);
    const how = kind === 0 ? `(\\alpha + \\beta)^2 - 2\\alpha\\beta = ${paren(s)}^2 - 2 \\cdot ${paren(p)}` : kind === 1 ? `\\dfrac{\\alpha + \\beta}{\\alpha\\beta} = \\dfrac{${s}}{${p}}` : `(\\alpha + \\beta)^2 - 4\\alpha\\beta = ${paren(s)}^2 - 4 \\cdot ${paren(p)}`;
    return {
      ...base('vieta-sym', level),
      mode: 'number',
      prompt: `2 次方程式 $${eq} = 0$ の 2 つの解を $\\alpha$、$\\beta$ とするとき、$${names[kind]}$ の値を求めよう。`,
      answer: ans,
      before: '値：',
      hint: '解と係数の関係 $\\alpha + \\beta = -\\dfrac{b}{a}$、$\\alpha\\beta = \\dfrac{c}{a}$ を使って、和と積で表す。',
      explain: `$\\alpha + \\beta = ${s}$、$\\alpha\\beta = ${p}$。$${names[kind]} = ${how} = ${ansTex}$`,
    };
  },

  /** 剰余の定理 */
  'remainder-thm': (level) => {
    const a = randInt(-4, 4);
    const b = randInt(-6, 6);
    const c = randInt(-6, 6);
    const k = randInt(-3, 3, { nonZero: true });
    const P = k ** 3 + a * k * k + b * k + c;
    const poly = fmt([[1, 'x^3'], [a, 'x^2'], [b, 'x'], [c, '']]);
    return {
      ...base('remainder-thm', level),
      mode: 'number',
      prompt: `整式 $P(x) = ${poly}$ を $${fmt([[1, 'x'], [-k, '']])}$ で割った余りを求めよう。`,
      answer: String(P),
      before: '余り：',
      hint: `剰余の定理：$x - k$ で割った余りは $P(k)$。$x ${k > 0 ? '-' : '+'} ${Math.abs(k)} = 0$ となる $x = ${k}$ を代入。`,
      kaiMistake: `$P(${-k})$ を計算しちゃった！ $x ${k > 0 ? '-' : '+'} ${Math.abs(k)}$ なら $x = ${k}$ を入れるんだ。`,
      explain: `$P(${k}) = ${paren(k)}^3 ${a < 0 ? '-' : '+'} ${Math.abs(a)} \\cdot ${paren(k)}^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\cdot ${paren(k)} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${P}$`,
    };
  },

  /** 内分点・外分点の座標 */
  'section-point': (level) => {
    const x1 = randInt(-5, 5);
    const x2 = randInt(-5, 5, { exclude: [x1] });
    const y1 = randInt(-5, 5);
    const y2 = randInt(-5, 5);
    const m = randInt(1, 4);
    const n = randInt(1, 4, { exclude: [m] });
    const ext = Math.random() < 0.4;
    const askX = Math.random() < 0.5;
    const [u, v] = askX ? [x1, x2] : [y1, y2];
    const num = ext ? -n * u + m * v : n * u + m * v;
    const den = ext ? m - n : m + n;
    return {
      ...base('section-point', level),
      mode: 'number',
      prompt: `2 点 A(${x1}, ${y1})、B(${x2}, ${y2}) を結ぶ線分 AB を ${m} : ${n} に${ext ? '外分' : '内分'}する点の ${askX ? 'x' : 'y'} 座標を求めよう。`,
      answer: fracStr(num, den),
      before: `${askX ? 'x' : 'y'} 座標：`,
      hint: ext ? '外分は $\\dfrac{-n x_1 + m x_2}{m - n}$' : '内分は $\\dfrac{n x_1 + m x_2}{m + n}$（A に n、B に m をかける）',
      kaiMistake: ext ? undefined : 'A に m、B に n をかけちゃった！ 遠い方の比をかけるんだ。',
      explain: `$\\dfrac{${ext ? `-${n}` : n} \\cdot ${paren(u)} + ${m} \\cdot ${paren(v)}}{${m} ${ext ? '-' : '+'} ${n}} = ${fracTex(num, den)}$`,
    };
  },

  /** 点と直線の距離 */
  'point-line-dist': (level) => {
    const [a, b] = pickOne([[3, 4], [4, 3], [3, -4], [4, -3], [5, 12], [12, 5], [6, 8], [8, -6]]);
    const L = Math.round(Math.hypot(a, b));
    const c = randInt(-10, 10);
    const x0 = randInt(-4, 4);
    const y0 = randInt(-4, 4);
    const v = Math.abs(a * x0 + b * y0 + c);
    if (v === 0) return coordGenerators['point-line-dist'](level);
    const line = fmt([[a, 'x'], [b, 'y'], [c, '']]);
    return {
      ...base('point-line-dist', level),
      mode: 'number',
      prompt: `点 (${x0}, ${y0}) と直線 $${line} = 0$ の距離を求めよう。`,
      answer: fracStr(v, L),
      before: '距離：',
      hint: '$d = \\dfrac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$',
      explain: `$d = \\dfrac{|${a} \\cdot ${paren(x0)} ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\cdot ${paren(y0)} ${c < 0 ? '-' : '+'} ${Math.abs(c)}|}{\\sqrt{${a * a} + ${b * b}}} = \\dfrac{${v}}{${L}}${fracTex(v, L) === `\\dfrac{${v}}{${L}}` ? '' : ` = ${fracTex(v, L)}`}$`,
    };
  },

  /** 円の方程式から半径 */
  'circle-radius': (level) => {
    const p = randInt(-4, 4, { nonZero: true });
    const q = randInt(-4, 4);
    const r = randInt(1, 5);
    const D = -2 * p;
    const E = -2 * q;
    const F = p * p + q * q - r * r;
    const eq = fmt([[1, 'x^2'], [1, 'y^2'], [D, 'x'], [E, 'y'], [F, '']]);
    return {
      ...base('circle-radius', level),
      mode: 'number',
      prompt: `円 $${eq} = 0$ の半径を求めよう。`,
      answer: String(r),
      before: '半径：',
      hint: '$x$、$y$ それぞれで平方完成して、$(x - a)^2 + (y - b)^2 = r^2$ の形にする。',
      explain: `$(x ${p < 0 ? '+' : '-'} ${Math.abs(p)})^2 + (y ${q < 0 ? '+' : '-'} ${Math.abs(q)})^2 = ${r * r}$ より、中心 $(${p}, ${q})$、半径 $${r}$。`,
    };
  },

  /** 2 点を通る直線の傾き */
  'line-slope': (level) => {
    const x1 = randInt(-5, 5);
    const x2 = randInt(-5, 5, { exclude: [x1] });
    const y1 = randInt(-5, 5);
    const y2 = randInt(-5, 5);
    const perp = Math.random() < 0.5 && y1 !== y2;
    const num = perp ? -(x2 - x1) : y2 - y1;
    const den = perp ? y2 - y1 : x2 - x1;
    return {
      ...base('line-slope', level),
      mode: 'number',
      prompt: `2 点 (${x1}, ${y1})、(${x2}, ${y2}) を通る直線${perp ? 'に垂直な直線' : ''}の傾きを求めよう。`,
      answer: fracStr(num, den),
      before: '傾き：',
      hint: perp ? 'まず 2 点を通る直線の傾き m を求め、垂直な直線の傾きは $-\\dfrac{1}{m}$（傾きの積が $-1$）。' : '傾き ＝ $\\dfrac{y \\text{ の増加量}}{x \\text{ の増加量}}$',
      explain: perp
        ? `2 点を通る直線の傾きは $\\dfrac{${y2 - y1}}{${x2 - x1}}$。垂直な直線の傾きは $${fracTex(num, den)}$。`
        : `$\\dfrac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = ${fracTex(num, den)}$`,
    };
  },
};
