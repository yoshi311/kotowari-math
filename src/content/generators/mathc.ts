// 数学C「ベクトル」「平面上の曲線と複素数平面」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { randInt } from '../../engine/format';
import { fracStr, fracTex } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: readonly T[]): T => xs[randInt(0, xs.length - 1)];
const nz = (min: number, max: number) => randInt(min, max, { nonZero: true });
const p = (n: number) => (n < 0 ? `(${n})` : String(n));

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}
/** 正解とちがう候補から 3 つ選ぶ */
function pick3(correct: string, pool: string[]): string[] {
  const rest = [...new Set(pool)].filter((x) => x !== correct);
  const out: string[] = [];
  while (out.length < 3 && rest.length) out.push(rest.splice(randInt(0, rest.length - 1), 1)[0]);
  return out;
}
/** m·a + n·b の TeX（係数 1・−1 は省く） */
function combTex(m: number, n: number, a = '\\vec{a}', b = '\\vec{b}'): string {
  const c = (k: number, v: string, first: boolean) => {
    const s = Math.abs(k) === 1 ? v : `${Math.abs(k)}${v}`;
    if (first) return k < 0 ? `-${s}` : s;
    return k < 0 ? ` - ${s}` : ` + ${s}`;
  };
  return c(m, a, true) + c(n, b, false);
}
const vec = (xs: number[]) => `(${xs.join(',\\ ')})`;
/** 弧度の TeX（π の分数） */
function radTex(num: number, den: number): string {
  if (num === 0) return '0';
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  const top = `${n === 1 ? '' : n}\\pi`;
  return d === 1 ? top : `\\dfrac{${top}}{${d}}`;
}
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** 偏角がわかる複素数のもと（実部・虚部の TeX と値、偏角 = num/12 π） */
const ARGS: { re: string; im: string; x: number; y: number; arg: number }[] = [
  { re: '1', im: '1', x: 1, y: 1, arg: 3 },
  { re: '-1', im: '1', x: -1, y: 1, arg: 9 },
  { re: '-1', im: '-1', x: -1, y: -1, arg: 15 },
  { re: '1', im: '-1', x: 1, y: -1, arg: 21 },
  { re: '\\sqrt{3}', im: '1', x: Math.sqrt(3), y: 1, arg: 2 },
  { re: '1', im: '\\sqrt{3}', x: 1, y: Math.sqrt(3), arg: 4 },
  { re: '-1', im: '\\sqrt{3}', x: -1, y: Math.sqrt(3), arg: 8 },
  { re: '-\\sqrt{3}', im: '1', x: -Math.sqrt(3), y: 1, arg: 10 },
  { re: '-\\sqrt{3}', im: '-1', x: -Math.sqrt(3), y: -1, arg: 14 },
  { re: '\\sqrt{3}', im: '-1', x: Math.sqrt(3), y: -1, arg: 22 },
  { re: '0', im: '1', x: 0, y: 1, arg: 6 },
  { re: '-1', im: '0', x: -1, y: 0, arg: 12 },
];
/** 係数 k をかけた複素数 k(x + yi) の TeX */
function cTex(re: string, im: string, k: number): string {
  const mul = (t: string) => (t === '0' ? '0' : k === 1 ? t : t === '1' ? String(k) : t === '-1' ? String(-k) : t.startsWith('-') ? `-${k}${t.slice(1)}` : `${k}${t}`);
  const r = mul(re);
  const i = mul(im);
  const iPart = i === '0' ? '' : i === '1' ? 'i' : i === '-1' ? '-i' : `${i}i`;
  if (r === '0') return iPart;
  if (iPart === '') return r;
  return iPart.startsWith('-') ? `${r} ${iPart.replace('-', '- ')}` : `${r} + ${iPart}`;
}
/** 整数の複素数 a + bi の TeX */
function zTex(a: number, b: number): string {
  if (b === 0) return String(a);
  const bi = b === 1 ? 'i' : b === -1 ? '-i' : `${b}i`;
  if (a === 0) return bi;
  return b < 0 ? `${a} - ${bi.slice(1)}` : `${a} + ${bi}`;
}

const DEG_CHOICES = [30, 45, 60, 90, 120, 135, 150];

export const mathCGenerators: Record<string, Gen> = {
  /** ベクトルの成分の計算 */
  'vec-comp': (level) => {
    const a = [nz(-4, 4), randInt(-4, 4)];
    const b = [randInt(-4, 4), nz(-4, 4)];
    const m = nz(-3, 3);
    const n = nz(-3, 3);
    const xy = Math.random() < 0.5 ? 0 : 1;
    const r = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
    const name = xy === 0 ? 'x 成分 p' : 'y 成分 q';
    return {
      ...base('vec-comp', level),
      mode: 'number',
      prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = ${vec(b)}$ のとき、$${combTex(m, n)}$ を成分で $(p,\\ q)$ と表す。${name} を求めよう。`,
      answer: String(r[xy]),
      before: `${xy === 0 ? 'p' : 'q'} ＝`,
      hint: '成分ごとに計算する。$m\\vec{a} + n\\vec{b} = (ma_1 + nb_1,\\ ma_2 + nb_2)$',
      kaiMistake: 'x 成分と y 成分をまぜて計算しちゃった！ よこはよこ、たてはたてで計算するんだった…。',
      explain: `${xy === 0 ? 'x' : 'y'} 成分は $${m} \\times ${p(a[xy])} + ${p(n)} \\times ${p(b[xy])} = ${r[xy]}$。全体では $${combTex(m, n)} = ${vec(r)}$`,
    };
  },

  /** ベクトルの大きさの 2 乗 */
  'vec-norm': (level) => {
    if (Math.random() < 0.5) {
      const a = [nz(-4, 4), randInt(-4, 4)];
      const b = [randInt(-4, 4), nz(-4, 4)];
      const m = nz(-2, 2);
      const n = nz(-2, 2);
      const r = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
      const ans = r[0] ** 2 + r[1] ** 2;
      return {
        ...base('vec-norm', level),
        mode: 'number',
        prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = ${vec(b)}$ のとき、$|${combTex(m, n)}|^2$ を求めよう。`,
        answer: String(ans),
        before: '答え：',
        hint: 'まず成分を求める。$(x,\\ y)$ の大きさの 2 乗は $x^2 + y^2$。',
        kaiMistake: '2 乗をとる前に成分を足しちゃった！ x² + y² だ…。',
        explain: `$${combTex(m, n)} = ${vec(r)}$ なので、$|${combTex(m, n)}|^2 = ${p(r[0])}^2 + ${p(r[1])}^2 = ${ans}$`,
      };
    }
    const A = randInt(1, 4);
    const B = randInt(1, 4);
    const d = randInt(-A * B, A * B);
    const k = pickOne([1, 2, -1, -2, 3]);
    const ans = A * A + 2 * k * d + k * k * B * B;
    const kv = combTex(1, k);
    return {
      ...base('vec-norm', level),
      mode: 'number',
      prompt: `$|\\vec{a}| = ${A}$、$|\\vec{b}| = ${B}$、$\\vec{a} \\cdot \\vec{b} = ${d}$ のとき、$|${kv}|^2$ を求めよう。`,
      answer: String(ans),
      before: '答え：',
      hint: '$|\\vec{a} + k\\vec{b}|^2 = |\\vec{a}|^2 + 2k\\,\\vec{a} \\cdot \\vec{b} + k^2|\\vec{b}|^2$（文字式の展開と同じ）',
      kaiMistake: 'まん中の 2k a·b を忘れた！ (x + y)² = x² + 2xy + y² と同じで、まん中の項があるんだった…。',
      explain: `$|${kv}|^2 = ${A}^2 + 2 \\times ${p(k)} \\times ${p(d)} + ${p(k)}^2 \\times ${B}^2 = ${ans}$`,
    };
  },

  /** 内積 */
  dot: (level) => {
    if (Math.random() < 0.5) {
      const three = Math.random() < 0.35;
      const a = Array.from({ length: three ? 3 : 2 }, () => randInt(-4, 4));
      const b = Array.from({ length: three ? 3 : 2 }, () => randInt(-4, 4));
      if (!a.some((v) => v !== 0)) a[0] = 1;
      if (!b.some((v) => v !== 0)) b[0] = 2;
      const ans = a.reduce((s, v, i) => s + v * b[i], 0);
      return {
        ...base('dot', level),
        mode: 'number',
        prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = ${vec(b)}$ のとき、内積 $\\vec{a} \\cdot \\vec{b}$ を求めよう。`,
        answer: String(ans),
        before: '内積：',
        hint: `成分どうしをかけて足す：$a_1b_1 + a_2b_2${three ? ' + a_3b_3' : ''}$`,
        kaiMistake: '答えをベクトルにしちゃった！ 内積は 1 つの数になるんだった…。',
        explain: `$\\vec{a} \\cdot \\vec{b} = ${a.map((v, i) => `${p(v)} \\times ${p(b[i])}`).join(' + ')} = ${ans}$`,
      };
    }
    const kind = randInt(0, 4);
    const B = randInt(1, 5);
    let A: number, aTex: string, deg: number, ans: number;
    if (kind === 0 || kind === 1) {
      A = 2 * randInt(1, 3);
      aTex = String(A);
      deg = kind === 0 ? 60 : 120;
      ans = ((kind === 0 ? 1 : -1) * A * B) / 2;
    } else if (kind === 2) {
      A = randInt(1, 4);
      aTex = String(A);
      deg = 90;
      ans = 0;
    } else {
      A = Math.SQRT2;
      aTex = '\\sqrt{2}';
      deg = kind === 3 ? 45 : 135;
      ans = kind === 3 ? B : -B;
    }
    const cosTex = { 60: '\\dfrac{1}{2}', 120: '-\\dfrac{1}{2}', 90: '0', 45: '\\dfrac{1}{\\sqrt{2}}', 135: '-\\dfrac{1}{\\sqrt{2}}' }[deg]!;
    return {
      ...base('dot', level),
      mode: 'number',
      prompt: `$|\\vec{a}| = ${aTex}$、$|\\vec{b}| = ${B}$ で、$\\vec{a}$ と $\\vec{b}$ のなす角が $${deg}^\\circ$ のとき、内積 $\\vec{a} \\cdot \\vec{b}$ を求めよう。`,
      answer: String(ans),
      before: '内積：',
      hint: '$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$',
      kaiMistake: deg > 90 ? 'cos を正の数にしちゃった！ 90° より大きい角の cos はマイナスだ…。' : 'cos をかけわすれて、大きさをかけただけにしちゃった！',
      explain: `$\\vec{a} \\cdot \\vec{b} = ${aTex} \\times ${B} \\times ${cosTex.startsWith('-') ? `\\left(${cosTex}\\right)` : cosTex} = ${ans}$`,
    };
  },

  /** 2 つのベクトルのなす角 */
  'vec-angle': (level): ChoiceQuestion => {
    let a: number[], b: number[], deg: number;
    for (;;) {
      a = [randInt(-3, 3), randInt(-3, 3)];
      b = [randInt(-3, 3), randInt(-3, 3)];
      const na = Math.hypot(a[0], a[1]);
      const nb = Math.hypot(b[0], b[1]);
      if (na === 0 || nb === 0) continue;
      const c = (a[0] * b[0] + a[1] * b[1]) / (na * nb);
      const hit = [[0, 90], [Math.SQRT1_2, 45], [-Math.SQRT1_2, 135]].find(([v]) => Math.abs(c - v) < 1e-9);
      if (hit) {
        deg = hit[1];
        break;
      }
    }
    const d = a[0] * b[0] + a[1] * b[1];
    const n2 = (a[0] ** 2 + a[1] ** 2) * (b[0] ** 2 + b[1] ** 2);
    const correct = `$${deg}^\\circ$`;
    const { choices, answer } = shuffle(correct, pick3(correct, DEG_CHOICES.map((x) => `$${x}^\\circ$`)));
    return {
      id: 'gen:vec-angle',
      level,
      type: 'choice',
      prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = ${vec(b)}$ のなす角 θ（$0^\\circ \\le \\theta \\le 180^\\circ$）は？`,
      choices,
      answer,
      hint: '$\\cos\\theta = \\dfrac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}$',
      kaiMistake: '内積の符号を見ないで決めちゃった！ 内積がマイナスなら、なす角は 90° より大きいんだった…。',
      explain: `$\\vec{a} \\cdot \\vec{b} = ${d}$、$|\\vec{a}||\\vec{b}| = \\sqrt{${n2}}$。$\\cos\\theta = ${d === 0 ? '0' : `\\dfrac{${d}}{\\sqrt{${n2}}} = ${d < 0 ? '-' : ''}\\dfrac{1}{\\sqrt{2}}`}$ より、$\\theta = ${deg}^\\circ$。`,
    };
  },

  /** 垂直・平行の条件 */
  perp: (level) => {
    const kind = randInt(0, 2);
    if (kind === 2) {
      const a = [randInt(-4, 4), randInt(-4, 4)];
      const b = [nz(-3, 3), randInt(-3, 3)];
      const ab = a[0] * b[0] + a[1] * b[1];
      const bb = b[0] ** 2 + b[1] ** 2;
      return {
        ...base('perp', level),
        mode: 'number',
        prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = ${vec(b)}$ とする。$\\vec{a} + t\\vec{b}$ と $\\vec{b}$ が垂直になるような実数 t の値を求めよう。`,
        answer: fracStr(-ab, bb),
        before: 't ＝',
        hint: '垂直 ⇔ 内積が 0。$(\\vec{a} + t\\vec{b}) \\cdot \\vec{b} = \\vec{a} \\cdot \\vec{b} + t|\\vec{b}|^2 = 0$',
        kaiMistake: '内積が 1 になる t を探しちゃった！ 垂直は内積 0 だ…。',
        explain: `$\\vec{a} \\cdot \\vec{b} = ${ab}$、$|\\vec{b}|^2 = ${bb}$。$${ab} + ${bb}t = 0$ より $t = ${fracTex(-ab, bb)}$`,
      };
    }
    const a = [nz(-4, 4), nz(-4, 4)];
    const y = nz(-5, 5);
    if (kind === 0) {
      // a ⊥ (x, y)
      return {
        ...base('perp', level),
        mode: 'number',
        prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = (x,\\ ${y})$ が垂直になるような x の値を求めよう。`,
        answer: fracStr(-a[1] * y, a[0]),
        before: 'x ＝',
        hint: '垂直 ⇔ 内積が 0：$a_1b_1 + a_2b_2 = 0$',
        kaiMistake: '平行の条件で計算しちゃった！ 垂直は内積 0 だ…。',
        explain: `$${a[0]}x + ${p(a[1])} \\times ${p(y)} = 0$ より $x = ${fracTex(-a[1] * y, a[0])}$`,
      };
    }
    return {
      ...base('perp', level),
      mode: 'number',
      prompt: `$\\vec{a} = ${vec(a)}$、$\\vec{b} = (x,\\ ${y})$ が平行になるような x の値を求めよう。`,
      answer: fracStr(a[0] * y, a[1]),
      before: 'x ＝',
      hint: '平行 ⇔ $\\vec{b} = k\\vec{a}$、つまり $a_1b_2 - a_2b_1 = 0$',
      kaiMistake: '垂直の条件（内積 0）で計算しちゃった！ 平行は「何倍か」になっていることだ…。',
      explain: `$${a[0]} \\times ${p(y)} - ${p(a[1])} \\times x = 0$ より $x = ${fracTex(a[0] * y, a[1])}$`,
    };
  },

  /** 分点・重心の座標 */
  'div-point': (level) => {
    const A = [randInt(-5, 5), randInt(-5, 5)];
    const B = [randInt(-5, 5), randInt(-5, 5)];
    if (A[0] === B[0] && A[1] === B[1]) B[0] += 3;
    const xy = Math.random() < 0.5 ? 0 : 1;
    const kind = randInt(0, 2);
    const nm = xy === 0 ? 'x 座標' : 'y 座標';
    if (kind === 2) {
      const C = [randInt(-5, 5), randInt(-5, 5)];
      const s = A[xy] + B[xy] + C[xy];
      return {
        ...base('div-point', level),
        mode: 'number',
        prompt: `3 点 $\\mathrm{A}${vec(A)}$、$\\mathrm{B}${vec(B)}$、$\\mathrm{C}${vec(C)}$ を頂点とする三角形の重心 G の${nm}を求めよう。`,
        answer: fracStr(s, 3),
        before: `${nm}：`,
        hint: '重心は 3 つの頂点の平均：$\\dfrac{\\vec{a} + \\vec{b} + \\vec{c}}{3}$',
        kaiMistake: '3 つ足したまま、3 でわるのを忘れた！',
        explain: `$\\dfrac{${A[xy]} + ${p(B[xy])} + ${p(C[xy])}}{3} = ${fracTex(s, 3)}$`,
      };
    }
    const m = randInt(1, 4);
    let n = randInt(1, 4);
    const ext = kind === 1;
    if (ext && m === n) n = m + 1;
    const num = ext ? -n * A[xy] + m * B[xy] : n * A[xy] + m * B[xy];
    const den = ext ? m - n : m + n;
    return {
      ...base('div-point', level),
      mode: 'number',
      prompt: `2 点 $\\mathrm{A}${vec(A)}$、$\\mathrm{B}${vec(B)}$ を結ぶ線分 AB を ${m} : ${n} に${ext ? '外分' : '内分'}する点の${nm}を求めよう。`,
      answer: fracStr(num, den),
      before: `${nm}：`,
      hint: ext ? '外分点：$\\dfrac{-n\\vec{a} + m\\vec{b}}{m - n}$' : '内分点：$\\dfrac{n\\vec{a} + m\\vec{b}}{m + n}$（m は B のほうにかける）',
      kaiMistake: 'm を A のほうにかけちゃった！ A から m 進むので、m は B にかけるんだった…。',
      explain: `$\\dfrac{${ext ? `-${n}` : n} \\times ${p(A[xy])} + ${m} \\times ${p(B[xy])}}{${ext ? `${m} - ${n}` : `${m} + ${n}`}} = ${fracTex(num, den)}$`,
    };
  },

  /** 空間ベクトル */
  'space-vec': (level) => {
    const A = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    const B = [randInt(-3, 4), randInt(-3, 4), randInt(-3, 4)];
    if (A.every((v, i) => v === B[i])) B[2] += 2;
    const d = B.map((v, i) => v - A[i]);
    if (Math.random() < 0.5) {
      const ans = d.reduce((s, v) => s + v * v, 0);
      return {
        ...base('space-vec', level),
        mode: 'number',
        prompt: `座標空間の 2 点 $\\mathrm{A}${vec(A)}$、$\\mathrm{B}${vec(B)}$ について、$|\\overrightarrow{\\mathrm{AB}}|^2$ を求めよう。`,
        answer: String(ans),
        before: '答え：',
        hint: '$\\overrightarrow{\\mathrm{AB}} = (\\text{B の座標}) - (\\text{A の座標})$。大きさの 2 乗は $x^2 + y^2 + z^2$。',
        kaiMistake: 'A − B と B − A をまちがえた…と思ったけど、2 乗するから同じ。こわいのは z 成分の足しわすれだ！',
        explain: `$\\overrightarrow{\\mathrm{AB}} = ${vec(d)}$ なので、$|\\overrightarrow{\\mathrm{AB}}|^2 = ${d.map((v) => `${p(v)}^2`).join(' + ')} = ${ans}$`,
      };
    }
    const C = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    const e = C.map((v, i) => v - A[i]);
    const ans = d.reduce((s, v, i) => s + v * e[i], 0);
    return {
      ...base('space-vec', level),
      mode: 'number',
      prompt: `座標空間の 3 点 $\\mathrm{A}${vec(A)}$、$\\mathrm{B}${vec(B)}$、$\\mathrm{C}${vec(C)}$ について、内積 $\\overrightarrow{\\mathrm{AB}} \\cdot \\overrightarrow{\\mathrm{AC}}$ を求めよう。`,
      answer: String(ans),
      before: '内積：',
      hint: 'まず $\\overrightarrow{\\mathrm{AB}}$、$\\overrightarrow{\\mathrm{AC}}$ を成分で求め、成分どうしをかけて足す。',
      kaiMistake: '点の座標をそのままかけちゃった！ 先に A を引いてベクトルにするんだった…。',
      explain: `$\\overrightarrow{\\mathrm{AB}} = ${vec(d)}$、$\\overrightarrow{\\mathrm{AC}} = ${vec(e)}$。内積は $${d.map((v, i) => `${p(v)} \\times ${p(e[i])}`).join(' + ')} = ${ans}$`,
    };
  },

  /** 2 次曲線の焦点 */
  conic: (level) => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const k = nz(-12, 12);
      const onX = Math.random() < 0.5;
      const eq = onX ? `y^2 = ${k}x` : `x^2 = ${k}y`;
      return {
        ...base('conic', level),
        mode: 'number',
        prompt: `放物線 $${eq}$ の焦点の座標を ${onX ? '$(p,\\ 0)$' : '$(0,\\ p)$'} と表すとき、p の値を求めよう。`,
        answer: fracStr(k, 4),
        before: 'p ＝',
        hint: onX ? '$y^2 = 4px$ の焦点は $(p,\\ 0)$。4p = ' + k + ' とおく。' : '$x^2 = 4py$ の焦点は $(0,\\ p)$。4p = ' + k + ' とおく。',
        kaiMistake: `焦点を (${k}, 0) にしちゃった！ ${k} は 4p だから、4 でわるんだった…。`,
        explain: `$4p = ${k}$ より $p = ${fracTex(k, 4)}$`,
      };
    }
    const [a, b, c] = pickOne([[5, 4, 3], [5, 3, 4], [13, 12, 5], [13, 5, 12], [10, 8, 6], [10, 6, 8], [3, 4, 5], [4, 3, 5], [12, 5, 13], [6, 8, 10], [8, 6, 10]] as const);
    // 楕円になるのは a² = b² + c²（a がいちばん大きい組）のときだけ
    if (kind === 1 && a * a === b * b + c * c) {
      const flip = Math.random() < 0.5;
      const eq = flip ? `\\dfrac{x^2}{${b * b}} + \\dfrac{y^2}{${a * a}} = 1` : `\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1`;
      return {
        ...base('conic', level),
        mode: 'number',
        prompt: `楕円 $${eq}$ の焦点の座標を ${flip ? '$(0,\\ \\pm c)$' : '$(\\pm c,\\ 0)$'}（c > 0）と表すとき、c の値を求めよう。`,
        answer: String(c),
        before: 'c ＝',
        hint: '楕円では $c^2 = (\\text{大きいほうの分母}) - (\\text{小さいほうの分母})$',
        kaiMistake: '分母を足しちゃった！ 足すのは双曲線で、楕円は引き算だ…。',
        explain: `$c^2 = ${a * a} - ${b * b} = ${c * c}$ より $c = ${c}$`,
      };
    }
    // 双曲線（a, b の大小は問わない）
    const [h1, h2, h3] = a * a === b * b + c * c ? [b, c, a] : [a, b, c]; // h1² + h2² = h3²
    return {
      ...base('conic', level),
      mode: 'number',
      prompt: `双曲線 $\\dfrac{x^2}{${h1 * h1}} - \\dfrac{y^2}{${h2 * h2}} = 1$ の焦点の座標を $(\\pm c,\\ 0)$（c > 0）と表すとき、c の値を求めよう。`,
      answer: String(h3),
      before: 'c ＝',
      hint: '双曲線では $c^2 = a^2 + b^2$（分母を足す）',
      kaiMistake: '分母を引いちゃった！ 引くのは楕円で、双曲線は足し算だ…。',
      explain: `$c^2 = ${h1 * h1} + ${h2 * h2} = ${h3 * h3}$ より $c = ${h3}$`,
    };
  },

  /** 直交座標と極座標 */
  polar: (level): ChoiceQuestion => {
    const k = randInt(1, 3);
    const s2 = k === 1 ? '\\sqrt{2}' : `${k}\\sqrt{2}`;
    const s3 = k === 1 ? '\\sqrt{3}' : `${k}\\sqrt{3}`;
    const T: { xy: string; pol: string }[] = [
      { xy: `(${k},\\ ${k})`, pol: `\\left(${s2},\\ \\dfrac{\\pi}{4}\\right)` },
      { xy: `(-${k},\\ ${k})`, pol: `\\left(${s2},\\ \\dfrac{3\\pi}{4}\\right)` },
      { xy: `(-${k},\\ -${k})`, pol: `\\left(${s2},\\ \\dfrac{5\\pi}{4}\\right)` },
      { xy: `(${k},\\ -${k})`, pol: `\\left(${s2},\\ \\dfrac{7\\pi}{4}\\right)` },
      { xy: `(${k},\\ ${s3})`, pol: `\\left(${2 * k},\\ \\dfrac{\\pi}{3}\\right)` },
      { xy: `(-${k},\\ ${s3})`, pol: `\\left(${2 * k},\\ \\dfrac{2\\pi}{3}\\right)` },
      { xy: `(${s3},\\ ${k})`, pol: `\\left(${2 * k},\\ \\dfrac{\\pi}{6}\\right)` },
      { xy: `(${s3},\\ -${k})`, pol: `\\left(${2 * k},\\ \\dfrac{11\\pi}{6}\\right)` },
      { xy: `(0,\\ ${k})`, pol: `\\left(${k},\\ \\dfrac{\\pi}{2}\\right)` },
      { xy: `(-${k},\\ 0)`, pol: `\\left(${k},\\ \\pi\\right)` },
    ];
    const t = pickOne(T);
    const correct = `$${t.pol}$`;
    const { choices, answer } = shuffle(correct, pick3(correct, T.map((x) => `$${x.pol}$`)));
    return {
      id: 'gen:polar',
      level,
      type: 'choice',
      prompt: `直交座標が $${t.xy}$ である点の極座標 $(r,\\ \\theta)$ は？（$r > 0$、$0 \\le \\theta < 2\\pi$）`,
      choices,
      answer,
      hint: 'r は原点からの距離 $\\sqrt{x^2 + y^2}$、θ は x 軸の正の向きから反時計回りにはかった角。',
      kaiMistake: '点がどの象限にあるかを見ないで角を決めちゃった！ 図をかけば一発だ…。',
      explain: `原点からの距離と、x 軸からの角を読むと $${t.pol}$。$x = r\\cos\\theta$、$y = r\\sin\\theta$ で確かめられる。`,
    };
  },

  /** 複素数の計算 */
  'complex-calc': (level) => {
    const a = randInt(-4, 4);
    const b = nz(-4, 4);
    const sq = Math.random() < 0.35;
    const c = sq ? a : randInt(-4, 4);
    const d = sq ? b : nz(-4, 4);
    const re = a * c - b * d;
    const im = a * d + b * c;
    const wantRe = Math.random() < 0.5;
    const z = zTex(a, b);
    const w = zTex(c, d);
    const expr = sq ? `(${z})^2` : `(${z})(${w})`;
    return {
      ...base('complex-calc', level),
      mode: 'number',
      prompt: `$${expr}$ を $a + bi$（a, b は実数）の形にしたとき、${wantRe ? '実部 a' : '虚部 b'} を求めよう。`,
      answer: String(wantRe ? re : im),
      before: `${wantRe ? 'a' : 'b'} ＝`,
      hint: 'ふつうに展開して、$i^2 = -1$ におきかえる。',
      kaiMistake: '$i^2$ を +1 にしちゃった！ $i^2 = -1$ だ…。',
      explain: `展開すると $${a * c} + ${p(a * d + b * c)}i + ${p(b * d)}i^2$。$i^2 = -1$ より $${zTex(re, im)}$。${wantRe ? '実部' : '虚部'}は $${wantRe ? re : im}$`,
    };
  },

  /** 複素数の絶対値 */
  'complex-abs': (level) => {
    const kind = randInt(0, 2);
    const [x, y, r] = pickOne([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]] as const);
    const sx = pickOne([1, -1]) * x;
    const sy = pickOne([1, -1]) * y;
    if (kind === 0) {
      return {
        ...base('complex-abs', level),
        mode: 'number',
        prompt: `複素数 $z = ${zTex(sx, sy)}$ の絶対値 $|z|$ を求めよう。`,
        answer: String(r),
        before: '|z| ＝',
        hint: '$|a + bi| = \\sqrt{a^2 + b^2}$（複素数平面で原点からの距離）',
        kaiMistake: '実部と虚部を足しちゃった！ 原点からの距離だから三平方の定理だ…。',
        explain: `$|z| = \\sqrt{${p(sx)}^2 + ${p(sy)}^2} = \\sqrt{${r * r}} = ${r}$`,
      };
    }
    if (kind === 1) {
      const n = randInt(2, 3);
      return {
        ...base('complex-abs', level),
        mode: 'number',
        prompt: `複素数 $z = ${zTex(sx, sy)}$ について、$|z^{${n}}|$ を求めよう。`,
        answer: String(r ** n),
        before: '答え：',
        hint: '$|z^n| = |z|^n$。先に $|z|$ を求める。',
        kaiMistake: `$z^{${n}}$ を展開して計算しようとして、まちがえた！ 絶対値は「かけ算どうし」で $|z|^{${n}}$ でいい…。`,
        explain: `$|z| = ${r}$ なので $|z^{${n}}| = ${r}^{${n}} = ${r ** n}$`,
      };
    }
    const a = nz(-3, 3);
    const b = nz(-3, 3);
    const c = nz(-3, 3);
    const d = nz(-3, 3);
    const ans = (a * a + b * b) * (c * c + d * d);
    return {
      ...base('complex-abs', level),
      mode: 'number',
      prompt: `$z = ${zTex(a, b)}$、$w = ${zTex(c, d)}$ のとき、$|zw|^2$ を求めよう。`,
      answer: String(ans),
      before: '答え：',
      hint: '$|zw| = |z||w|$ なので、$|zw|^2 = |z|^2|w|^2$。',
      kaiMistake: '$|z|^2 + |w|^2$ と足しちゃった！ かけ算の絶対値は、絶対値のかけ算だ…。',
      explain: `$|z|^2 = ${a * a + b * b}$、$|w|^2 = ${c * c + d * d}$ なので、$|zw|^2 = ${a * a + b * b} \\times ${c * c + d * d} = ${ans}$`,
    };
  },

  /** 偏角 */
  'complex-arg': (level): ChoiceQuestion => {
    const t = pickOne(ARGS);
    const k = randInt(1, 3);
    const correct = `$${radTex(t.arg, 12)}$`;
    const { choices, answer } = shuffle(correct, pick3(correct, ARGS.map((x) => `$${radTex(x.arg, 12)}$`)));
    return {
      id: 'gen:complex-arg',
      level,
      type: 'choice',
      prompt: `複素数 $z = ${cTex(t.re, t.im, k)}$ の偏角 θ（$0 \\le \\theta < 2\\pi$）は？`,
      choices,
      answer,
      hint: '複素数平面に点をとって、実軸の正の向きからの角を読む。$\\cos\\theta = \\dfrac{a}{|z|}$、$\\sin\\theta = \\dfrac{b}{|z|}$',
      kaiMistake: '実部と虚部を逆にして角を読んじゃった！ 横（実軸）が実部、たて（虚軸）が虚部だ…。',
      explain: `$|z| = ${absTex(k, Math.hypot(t.x, t.y))}$。${t.arg % 6 === 0 ? '点は軸の上にあり' : `点は${['第 1', '第 2', '第 3', '第 4'][Math.floor(t.arg / 6)]}象限にあり`}、$\\cos\\theta$、$\\sin\\theta$ の値から $\\theta = ${radTex(t.arg, 12)}$。`,
    };
  },

  /** ド・モアブルの定理 */
  'de-moivre': (level) => {
    for (;;) {
      const t = pickOne(ARGS.slice(0, 8));
      const n = randInt(2, 8);
      const r = Math.hypot(t.x, t.y);
      const ang = (t.arg * Math.PI * n) / 12;
      const re = r ** n * Math.cos(ang);
      const im = r ** n * Math.sin(ang);
      const wantRe = Math.random() < 0.5;
      const v = wantRe ? re : im;
      if (Math.abs(v - Math.round(v)) > 1e-6) continue;
      const ans = Math.round(v) === 0 ? 0 : Math.round(v);
      const two = Math.abs(r - 2) < 1e-9;
      const rTex = two ? '2' : '\\sqrt{2}';
      // r^n の TeX：2^n、または (√2)^n = 2^(n/2)
      const rnTex = two ? String(2 ** n) : n % 2 === 0 ? String(2 ** (n / 2)) : `${2 ** ((n - 1) / 2) === 1 ? '' : 2 ** ((n - 1) / 2)}\\sqrt{2}`;
      const argN = (t.arg * n) % 24;
      const fn = wantRe ? '\\cos' : '\\sin';
      const unit = wantRe ? Math.cos((argN * Math.PI) / 12) : Math.sin((argN * Math.PI) / 12);
      const unitTex = (['0', '\\dfrac{1}{2}', '\\dfrac{1}{\\sqrt{2}}', '\\dfrac{\\sqrt{3}}{2}', '1'] as const)[[0, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 1].findIndex((u) => Math.abs(Math.abs(unit) - u) < 1e-9)];
      const signedUnit = unit < -1e-9 ? `\\left(-${unitTex}\\right)` : unitTex;
      return {
        ...base('de-moivre', level),
        mode: 'number',
        prompt: `$(${cTex(t.re, t.im, 1)})^{${n}}$ を $a + bi$（a, b は実数）の形にしたとき、${wantRe ? '実部 a' : '虚部 b'} を求めよう。`,
        answer: String(ans),
        before: `${wantRe ? 'a' : 'b'} ＝`,
        hint: '極形式 $r(\\cos\\theta + i\\sin\\theta)$ になおして、ド・モアブルの定理 $r^n(\\cos n\\theta + i\\sin n\\theta)$ を使う。',
        kaiMistake: `偏角を ${n} 倍しないで、絶対値だけ ${n} 乗しちゃった！ 偏角も ${n} 倍だ…。`,
        explain: `$${cTex(t.re, t.im, 1)} = ${rTex}\\left(\\cos ${radTex(t.arg, 12)} + i\\sin ${radTex(t.arg, 12)}\\right)$。${n} 乗すると、絶対値は $(${rTex})^{${n}} = ${rnTex}$、偏角は $${radTex(t.arg * n, 12)}$${argN !== t.arg * n ? `（$${argN === 0 ? '0' : radTex(argN, 12)}$ と同じ向き）` : ''}。${wantRe ? '実部' : '虚部'}は $${rnTex} \\times ${fn} ${argN === 0 ? '0' : radTex(argN, 12)} = ${rnTex} \\times ${signedUnit} = ${ans}$`,
      };
    }
  },
};

/** k × r0（r0 は 1、√2、2）の TeX */
function absTex(k: number, r0: number): string {
  if (Math.abs(r0 - Math.SQRT2) < 1e-9) return k === 1 ? '\\sqrt{2}' : `${k}\\sqrt{2}`;
  return String(k * Math.round(r0));
}
