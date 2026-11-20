// 数学Ⅱ「三角関数」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { randInt } from '../../engine/format';
import { fracStr, fracTex, reduce } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: readonly T[]): T => xs[randInt(0, xs.length - 1)];

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}
/** 正解とちがう候補から 3 つ選ぶ（重複なし） */
function pick3(correct: string, pool: string[]): string[] {
  const rest = [...new Set(pool)].filter((p) => p !== correct);
  const out: string[] = [];
  while (out.length < 3 && rest.length) out.push(rest.splice(randInt(0, rest.length - 1), 1)[0]);
  return out;
}

/** 度 → 弧度の TeX */
export function radTex(deg: number): string {
  const [n, d] = reduce(deg, 180);
  if (n === 0) return '0';
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (d === 1) return `${s}${a === 1 ? '' : a}\\pi`;
  return `${s}\\dfrac{${a === 1 ? '' : a}\\pi}{${d}}`;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const S3 = Math.sqrt(3);
const S2 = Math.SQRT2;

/** 有名な値（TeX と数値） */
const VALS: [string, number][] = [
  ['0', 0],
  ['\\dfrac{1}{2}', 0.5],
  ['\\dfrac{\\sqrt{2}}{2}', S2 / 2],
  ['\\dfrac{\\sqrt{3}}{2}', S3 / 2],
  ['1', 1],
  ['\\sqrt{3}', S3],
  ['\\dfrac{1}{\\sqrt{3}}', 1 / S3],
];
const SIGNED: [string, number][] = VALS.flatMap(([t, v]) => (v === 0 ? [[t, v] as [string, number]] : [[t, v] as [string, number], [`-${t}`, -v] as [string, number]]));
function valTex(v: number): string {
  const hit = SIGNED.find(([, x]) => Math.abs(x - v) < 1e-9);
  if (!hit) throw new Error(`有名な値ではない: ${v}`);
  return hit[0];
}

const fnVal = (fn: 'sin' | 'cos' | 'tan', deg: number) => {
  const v = fn === 'sin' ? Math.sin(rad(deg)) : fn === 'cos' ? Math.cos(rad(deg)) : Math.tan(rad(deg));
  return Math.abs(v) < 1e-12 ? 0 : v;
};

/** θ の範囲（象限）の TeX */
const RANGE = ['0 < \\theta < \\dfrac{\\pi}{2}', '\\dfrac{\\pi}{2} < \\theta < \\pi', '\\pi < \\theta < \\dfrac{3}{2}\\pi', '\\dfrac{3}{2}\\pi < \\theta < 2\\pi'];
const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

/** sin・cos の方程式の右辺 */
const KS: [string, number][] = [
  ['-1', -1],
  ['-\\dfrac{\\sqrt{3}}{2}', -S3 / 2],
  ['-\\dfrac{\\sqrt{2}}{2}', -S2 / 2],
  ['-\\dfrac{1}{2}', -0.5],
  ['0', 0],
  ['\\dfrac{1}{2}', 0.5],
  ['\\dfrac{\\sqrt{2}}{2}', S2 / 2],
  ['\\dfrac{\\sqrt{3}}{2}', S3 / 2],
  ['1', 1],
];
function eqSolutions(fn: 'sin' | 'cos', k: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < 360; d += 15) if (Math.abs(fnVal(fn, d) - k) < 1e-9) out.push(d);
  return out;
}
const solTex = (ds: number[]) => `$\\theta = ${ds.map(radTex).join(',\\ ')}$`;

/** 加法定理で出てくる値 */
const ADD_VALS: [string, number][] = [
  ['\\dfrac{\\sqrt{6} + \\sqrt{2}}{4}', (Math.sqrt(6) + S2) / 4],
  ['\\dfrac{\\sqrt{6} - \\sqrt{2}}{4}', (Math.sqrt(6) - S2) / 4],
  ['-\\dfrac{\\sqrt{6} + \\sqrt{2}}{4}', -(Math.sqrt(6) + S2) / 4],
  ['-\\dfrac{\\sqrt{6} - \\sqrt{2}}{4}', -(Math.sqrt(6) - S2) / 4],
  ['2 + \\sqrt{3}', 2 + S3],
  ['2 - \\sqrt{3}', 2 - S3],
  ['-2 - \\sqrt{3}', -2 - S3],
  ['-2 + \\sqrt{3}', -2 + S3],
];

/** 象限 q（1〜4）での sin・cos の符号 */
const sgnS = (q: number) => (q <= 2 ? 1 : -1);
const sgnC = (q: number) => (q === 1 || q === 4 ? 1 : -1);
const fr = (n: number, d: number) => fracTex(n, d);

export const waveGenerators: Record<string, Gen> = {
  /** 度数法 ⇔ 弧度法 */
  'rad-convert': (level) => {
    const degs = [30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330, -30, -45, -60, -120];
    const deg = pickOne(degs);
    if (Math.random() < 0.5) {
      return {
        ...base('rad-convert', level),
        mode: 'number',
        prompt: `$${radTex(deg)}$ を度数法で表すと何度か。`,
        answer: String(deg),
        before: '',
        after: '°',
        hint: '$\\pi = 180^\\circ$ を代入する。',
        explain: `$\\pi$ に $180^\\circ$ を代入して、$${radTex(deg)} = ${deg}^\\circ$`,
      };
    }
    const [n, d] = reduce(deg, 180);
    const correct = `$${radTex(deg)}$`;
    const swap = d !== 1 && Math.abs(n) !== 1 ? `$${n < 0 ? '-' : ''}\\dfrac{${d}\\pi}{${Math.abs(n)}}$` : `$${radTex(deg + 15)}$`;
    const wrongs = pick3(correct, [swap, `$${radTex(180 - deg)}$`, `$${radTex(deg + 30)}$`, `$${radTex(deg - 30)}$`, `$${radTex(-deg)}$`]);
    const { choices, answer } = shuffle(correct, wrongs);
    return {
      id: 'gen:rad-convert',
      level,
      type: 'choice',
      prompt: `$${deg}^\\circ$ を弧度法で表すと？`,
      choices,
      answer,
      hint: '$1^\\circ = \\dfrac{\\pi}{180}$。度に $\\dfrac{\\pi}{180}$ をかけて約分する。',
      explain: `$${deg} \\times \\dfrac{\\pi}{180} = ${radTex(deg)}$`,
    } as ChoiceQuestion;
  },

  /** おうぎ形の弧の長さ・面積 */
  'arc-sector': (level) => {
    const r = randInt(2, 12);
    const deg = pickOne([30, 45, 60, 90, 120, 135, 150, 240, 270]);
    const arc = Math.random() < 0.5;
    const ans = arc ? fracStr(r * deg, 180) : fracStr(r * r * deg, 360);
    const ansTex = arc ? fr(r * deg, 180) : fr(r * r * deg, 360);
    return {
      ...base('arc-sector', level),
      mode: 'number',
      prompt: `半径 $${r}$、中心角 $${radTex(deg)}$ のおうぎ形の${arc ? '弧の長さ' : '面積'}は $k\\pi$ と表せる。k の値を求めよう。`,
      answer: ans,
      before: 'k ＝',
      hint: arc ? '弧の長さ $\\ell = r\\theta$' : '面積 $S = \\dfrac{1}{2}r^2\\theta$',
      explain: arc ? `$\\ell = ${r} \\times ${radTex(deg)} = ${ansTex}\\pi$` : `$S = \\dfrac{1}{2} \\times ${r}^2 \\times ${radTex(deg)} = ${ansTex}\\pi$`,
    };
  },

  /** 一般角の三角関数の値 */
  'trig-value2': (level): ChoiceQuestion => {
    const fn = pickOne(['sin', 'cos', 'tan'] as const);
    let deg = pickOne([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330, 390, 405, 480, 570, -30, -45, -60, -120, -150]);
    if (fn === 'tan' && Math.abs(Math.cos(rad(deg))) < 1e-9) deg = 45;
    const v = fnVal(fn, deg);
    const correct = `$${valTex(v)}$`;
    const near = fn === 'tan' ? SIGNED.filter(([, x]) => [S3, 1 / S3, 1].some((y) => Math.abs(Math.abs(x) - y) < 1e-9)) : SIGNED.filter(([, x]) => Math.abs(x) <= 1 && x !== 0);
    const pool = near.map(([t]) => `$${t}$`);
    const flip = v !== 0 ? `$${valTex(-v)}$` : '$1$';
    const others = pick3(correct, pool.filter((p) => p !== flip));
    const wrongs = [flip, ...others].slice(0, 3);
    const { choices, answer } = shuffle(correct, wrongs);
    const arg = deg < 0 ? `\\left(${radTex(deg)}\\right)` : ` ${radTex(deg)}`;
    return {
      id: 'gen:trig-value2',
      level,
      type: 'choice',
      prompt: `$\\${fn}${arg}$ の値は？`,
      choices,
      answer,
      hint: '単位円の上で、その角の点の位置をかこう。1 周（2π）をこえる角は、2π を引いてもよい。',
      kaiMistake: '符号（プラス・マイナス）をまちがえた！ 点がどの象限にあるか、先に確かめないと…。',
      explain: `$${radTex(deg)}$ は${((deg % 360) + 360) % 360 === deg ? '' : ` $${radTex(((deg % 360) + 360) % 360)}$ と同じ位置で、`}単位円の第 ${Math.floor((((deg % 360) + 360) % 360) / 90) + 1} 象限の点。$\\${fn}${arg} = ${valTex(v)}$`,
    };
  },

  /** sin² + cos² = 1 から残りの値 */
  'trig-identity': (level) => {
    const [a, b, c] = pickOne(TRIPLES);
    const q = randInt(1, 4);
    const [sm, cm] = Math.random() < 0.5 ? [a, b] : [b, a];
    const s = sgnS(q) * sm;
    const co = sgnC(q) * cm;
    const giveSin = Math.random() < 0.5;
    const askTan = Math.random() < 0.4;
    const given = giveSin ? `\\sin\\theta = ${fr(s, c)}` : `\\cos\\theta = ${fr(co, c)}`;
    const want = askTan ? 'tan θ' : giveSin ? 'cos θ' : 'sin θ';
    const ansN = askTan ? s : giveSin ? co : s;
    const ansD = askTan ? co : c;
    return {
      ...base('trig-identity', level),
      mode: 'number',
      prompt: `$${RANGE[q - 1]}$ で $${given}$ のとき、${want} の値を求めよう。`,
      answer: fracStr(ansN, ansD),
      before: `${want} ＝`,
      hint: '$\\sin^2\\theta + \\cos^2\\theta = 1$ で残りの値の 2 乗を求め、θ の範囲で符号を決める。$\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$',
      kaiMistake: '符号を考えずにプラスにしちゃった！ θ の範囲で sin・cos の符号が決まるんだった…。',
      explain: `${giveSin ? `$\\cos^2\\theta = 1 - \\left(${fr(s, c)}\\right)^2 = ${fr(cm * cm, c * c)}$` : `$\\sin^2\\theta = 1 - \\left(${fr(co, c)}\\right)^2 = ${fr(sm * sm, c * c)}$`}。θ は第 ${q} 象限なので $\\sin\\theta = ${fr(s, c)}$、$\\cos\\theta = ${fr(co, c)}$。${askTan ? `$\\tan\\theta = ${fr(s, co)}$` : ''}`,
    };
  },

  /** sinθ + cosθ = t のときの sinθcosθ など */
  'sym-value': (level) => {
    const [p, q] = pickOne([[1, 2], [1, 3], [2, 3], [1, 5], [3, 4], [-1, 2], [-1, 3], [1, 4], [-2, 3]] as const);
    const t = fr(p, q);
    const ask = Math.random() < 0.6 ? 'prod' : 'diff';
    const ans = ask === 'prod' ? fracStr(p * p - q * q, 2 * q * q) : fracStr(2 * q * q - p * p, q * q);
    return {
      ...base('sym-value', level),
      mode: 'number',
      prompt: `$\\sin\\theta + \\cos\\theta = ${t}$ のとき、$${ask === 'prod' ? '\\sin\\theta\\cos\\theta' : '(\\sin\\theta - \\cos\\theta)^2'}$ の値を求めよう。`,
      answer: ans,
      before: '値：',
      hint: '両辺を 2 乗すると $1 + 2\\sin\\theta\\cos\\theta = \\left(' + t + '\\right)^2$',
      explain: `両辺を 2 乗して $1 + 2\\sin\\theta\\cos\\theta = ${fr(p * p, q * q)}$、$\\sin\\theta\\cos\\theta = ${fr(p * p - q * q, 2 * q * q)}$。${ask === 'diff' ? `$(\\sin\\theta - \\cos\\theta)^2 = 1 - 2\\sin\\theta\\cos\\theta = ${fr(2 * q * q - p * p, q * q)}$` : ''}`,
    };
  },

  /** 周期・最大値 */
  period: (level) => {
    const fn = pickOne(['sin', 'cos'] as const);
    const b2 = pickOne([1, 2, 4, 6, 8, 12]); // 2b
    const b = b2 / 2;
    const arg = b === 0.5 ? '\\dfrac{\\theta}{2}' : `${b === 1 ? '' : b}\\theta`;
    if (Math.random() < 0.5) {
      const a = pickOne([1, 2, 3]);
      const c = pickOne([0, 1, -1]);
      const inner = c === 0 ? arg : `\\left(${arg} ${c > 0 ? '+' : '-'} \\dfrac{\\pi}{3}\\right)`;
      return {
        ...base('period', level),
        mode: 'number',
        prompt: `関数 $y = ${a === 1 ? '' : a}\\${fn} ${inner}$ の周期は $k\\pi$ と表せる（正で最小のもの）。k の値を求めよう。`,
        answer: fracStr(4, b2),
        before: 'k ＝',
        hint: `$y = \\${fn} b\\theta$ の周期は $\\dfrac{2\\pi}{b}$。たての倍率や左右のずらしでは周期は変わらない。`,
        explain: `θ の係数は $${b === 0.5 ? '\\dfrac{1}{2}' : b}$ なので、周期は $2\\pi \\div ${b === 0.5 ? '\\dfrac{1}{2}' : b} = ${fr(4, b2)}\\pi$`,
      };
    }
    const a = pickOne([1, 2, 3, -1, -2, -3]);
    const d = randInt(-3, 3);
    const max = Math.random() < 0.5;
    const ans = max ? Math.abs(a) + d : -Math.abs(a) + d;
    const aTex = a === 1 ? '' : a === -1 ? '-' : String(a);
    return {
      ...base('period', level),
      mode: 'number',
      prompt: `関数 $y = ${aTex}\\${fn} ${arg}${d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`}$ の${max ? '最大値' : '最小値'}を求めよう。`,
      answer: String(ans),
      before: `${max ? '最大値' : '最小値'}：`,
      hint: `$-1 \\le \\${fn} ${arg} \\le 1$ を使う。係数がマイナスのときは、大小が入れかわる。`,
      explain: `$\\${fn} ${arg}$ は −1 から 1 まで動くので、$${aTex}\\${fn} ${arg}$ は $${-Math.abs(a)}$ から $${Math.abs(a)}$ まで動く。${max ? '最大値' : '最小値'}は $${max ? Math.abs(a) : -Math.abs(a)} ${d === 0 ? '' : d > 0 ? `+ ${d}` : `- ${-d}`} = ${ans}$`,
    };
  },

  /** 三角方程式（0 ≦ θ < 2π） */
  'trig-eq': (level): ChoiceQuestion => {
    const fn = pickOne(['sin', 'cos'] as const);
    const [kt, k] = pickOne(KS.filter(([, v]) => Math.abs(v) !== 1));
    const sol = eqSolutions(fn, k);
    const correct = solTex(sol);
    const other = fn === 'sin' ? 'cos' : 'sin';
    const pool = [solTex(eqSolutions(other, k)), solTex(eqSolutions(fn, -k)), solTex(eqSolutions(other, -k)), solTex(sol.slice(0, 1)), solTex(eqSolutions(fn, k === 0 ? 0.5 : Math.abs(k) === 0.5 ? (Math.sign(k) * S3) / 2 : Math.sign(k) * 0.5))];
    const wrongs = pick3(correct, pool);
    const { choices, answer } = shuffle(correct, wrongs);
    return {
      id: 'gen:trig-eq',
      level,
      type: 'choice',
      prompt: `$0 \\le \\theta < 2\\pi$ のとき、方程式 $\\${fn}\\theta = ${kt}$ を解くと？`,
      choices,
      answer,
      hint: fn === 'sin' ? `単位円と、直線 $y = ${kt}$ の交わる点を見る。` : `単位円と、直線 $x = ${kt}$ の交わる点を見る。`,
      explain: `${fn === 'sin' ? `直線 $y = ${kt}$` : `直線 $x = ${kt}$`} と単位円の交点の角を読んで、${correct}`,
    };
  },

  /** 加法定理で 15°・75° などの値 */
  'addition-value': (level): ChoiceQuestion => {
    const fn = pickOne(['sin', 'cos', 'tan'] as const);
    const deg = pickOne([15, 75, 105, 165]);
    const v = fnVal(fn, deg);
    const hit = ADD_VALS.find(([, x]) => Math.abs(x - v) < 1e-9)!;
    const correct = `$${hit[0]}$`;
    const family = ADD_VALS.filter(([, x]) => (fn === 'tan' ? Math.abs(x) > 0.2 && Math.abs(Math.abs(x) - (Math.sqrt(6) + S2) / 4) > 1e-9 && Math.abs(Math.abs(x) - (Math.sqrt(6) - S2) / 4) > 1e-9 : Math.abs(x) < 1.01)).map(([t]) => `$${t}$`);
    const { choices, answer } = shuffle(correct, pick3(correct, family));
    const split = { 15: '45^\\circ - 30^\\circ', 75: '45^\\circ + 30^\\circ', 105: '60^\\circ + 45^\\circ', 165: '120^\\circ + 45^\\circ' }[deg];
    return {
      id: 'gen:addition-value',
      level,
      type: 'choice',
      prompt: `$\\${fn} ${deg}^\\circ$ の値は？`,
      choices,
      answer,
      hint: `$${deg}^\\circ = ${split}$ として加法定理を使う。`,
      explain: `$${deg}^\\circ = ${split}$ と分けて加法定理を使うと、$\\${fn} ${deg}^\\circ = ${hit[0]}$`,
    };
  },

  /** 加法定理（分数の値） */
  'addition-calc': (level) => {
    const [a1, b1, c1] = pickOne(TRIPLES);
    let [a2, b2, c2] = pickOne(TRIPLES);
    if (Math.random() < 0.5) [a2, b2] = [b2, a2];
    const q = pickOne([1, 2]);
    const s1 = a1;
    const k1 = sgnC(q) * b1; // cos α
    const s2 = a2; // sin β
    const k2 = b2; // cos β
    const kind = randInt(0, 3);
    const names = ['\\sin(\\alpha + \\beta)', '\\cos(\\alpha + \\beta)', '\\sin(\\alpha - \\beta)', '\\cos(\\alpha - \\beta)'];
    const nums = [s1 * k2 + k1 * s2, k1 * k2 - s1 * s2, s1 * k2 - k1 * s2, k1 * k2 + s1 * s2];
    const forms = ['\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta', '\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta', '\\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta', '\\cos\\alpha\\cos\\beta + \\sin\\alpha\\sin\\beta'];
    const D = c1 * c2;
    return {
      ...base('addition-calc', level),
      mode: 'number',
      prompt: `$${RANGE[q - 1].replace(/\\theta/g, '\\alpha')}$、$0 < \\beta < \\dfrac{\\pi}{2}$ で、$\\sin\\alpha = ${fr(s1, c1)}$、$\\cos\\beta = ${fr(k2, c2)}$ のとき、$${names[kind]}$ の値を求めよう。`,
      answer: fracStr(nums[kind], D),
      before: '値：',
      hint: `まず $\\cos\\alpha$ と $\\sin\\beta$ を求める（符号に注意）。$${names[kind]} = ${forms[kind]}$`,
      explain: `$\\cos\\alpha = ${fr(k1, c1)}$、$\\sin\\beta = ${fr(s2, c2)}$。$${names[kind]} = ${forms[kind]} = ${fr(nums[kind], D)}$`,
    };
  },

  /** 2 倍角の公式 */
  'double-angle': (level) => {
    const [a, b, c] = pickOne(TRIPLES);
    const q = pickOne([1, 2]);
    const s = a;
    const co = sgnC(q) * b;
    const giveSin = Math.random() < 0.5;
    const askSin = Math.random() < 0.5;
    const given = giveSin ? `\\sin\\theta = ${fr(s, c)}` : `\\cos\\theta = ${fr(co, c)}`;
    const n = askSin ? 2 * s * co : co * co - s * s;
    return {
      ...base('double-angle', level),
      mode: 'number',
      prompt: `$${RANGE[q - 1]}$ で $${given}$ のとき、$\\${askSin ? 'sin' : 'cos'} 2\\theta$ の値を求めよう。`,
      answer: fracStr(n, c * c),
      before: '値：',
      hint: askSin ? '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$。足りない方を $\\sin^2\\theta + \\cos^2\\theta = 1$ で求める。' : '$\\cos 2\\theta = 1 - 2\\sin^2\\theta = 2\\cos^2\\theta - 1$',
      explain: askSin
        ? `$\\sin\\theta = ${fr(s, c)}$、$\\cos\\theta = ${fr(co, c)}$ より $\\sin 2\\theta = 2 \\times ${fr(s, c)} \\times \\left(${fr(co, c)}\\right) = ${fr(n, c * c)}$`
        : giveSin
          ? `$\\cos 2\\theta = 1 - 2\\left(${fr(s, c)}\\right)^2 = ${fr(n, c * c)}$`
          : `$\\cos 2\\theta = 2\\left(${fr(co, c)}\\right)^2 - 1 = ${fr(n, c * c)}$`,
    };
  },

  /** 三角関数の合成で最大値・最小値 */
  synthesis: (level) => {
    const pairs: [string, string, number][] = [
      ['3', '4', 5],
      ['4', '3', 5],
      ['5', '12', 13],
      ['12', '5', 13],
      ['6', '8', 10],
      ['\\sqrt{3}', '1', 2],
      ['1', '\\sqrt{3}', 2],
      ['1', '1', 0],
    ];
    const [at, bt, r0] = pickOne(pairs.filter((p) => p[2] > 0));
    const neg = Math.random() < 0.4;
    const d = randInt(-2, 3);
    const max = Math.random() < 0.5;
    const r = r0;
    const ans = max ? r + d : -r + d;
    const coef = (t: string) => (t === '1' ? '' : t);
    const expr = `${coef(at)}\\sin\\theta ${neg ? '-' : '+'} ${coef(bt)}\\cos\\theta${d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`}`;
    return {
      ...base('synthesis', level),
      mode: 'number',
      prompt: `関数 $y = ${expr}$ の${max ? '最大値' : '最小値'}を求めよう。`,
      answer: String(ans),
      before: `${max ? '最大値' : '最小値'}：`,
      hint: '$a\\sin\\theta + b\\cos\\theta = \\sqrt{a^2 + b^2}\\sin(\\theta + \\alpha)$ と合成する。',
      kaiMistake: `係数をそのまま足して ${max ? '最大値' : '最小値'}にしちゃった！ 合成すると高さは $\\sqrt{a^2 + b^2}$ だ…。`,
      explain: `$\\sqrt{(${at})^2 + (${bt})^2} = ${r}$ なので、$y = ${r}\\sin(\\theta + \\alpha)${d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`}$ の形になる。$-1 \\le \\sin(\\theta + \\alpha) \\le 1$ より、${max ? '最大値' : '最小値'}は $${max ? r : -r} ${d === 0 ? '' : d > 0 ? `+ ${d}` : `- ${-d}`} = ${ans}$`,
    };
  },
};
