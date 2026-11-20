// 数学Ⅱ「微分・積分」の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, paren, randInt } from '../../engine/format';
import { fracStr, fracTex } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: readonly T[]): T => xs[randInt(0, xs.length - 1)];

function shuffle(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

/** 係数 [x³, x², x, 定数] → 式の文字列（TeX にも答えにも使える） */
export const polyStr = (c: number[]) => {
  const n = c.length - 1;
  return fmt(c.map((v, i) => [v, n - i === 0 ? '' : n - i === 1 ? 'x' : `x^${n - i}`] as [number, string]));
};
/** 係数の値 f(x) */
export const polyAt = (c: number[], x: number) => c.reduce((s, v) => s * x + v, 0);
/** 導関数の係数 */
export const polyD = (c: number[]) => {
  const n = c.length - 1;
  return c.slice(0, -1).map((v, i) => v * (n - i));
};
const nz = (min: number, max: number) => randInt(min, max, { nonZero: true });
/** (x − r) の形（r = 0 なら x） */
const fac = (r: number) => (r === 0 ? 'x' : `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`);

export const calcGenerators: Record<string, Gen> = {
  /** 平均変化率 */
  'avg-rate': (level) => {
    const a = pickOne([1, -1, 2, -2, 3]);
    const b = randInt(-5, 5);
    const c = randInt(-5, 5);
    const p = randInt(-3, 2);
    const q = randInt(p + 1, 4);
    const f = [a, b, c];
    const ans = (polyAt(f, q) - polyAt(f, p)) / (q - p);
    return {
      ...base('avg-rate', level),
      mode: 'number',
      prompt: `関数 $f(x) = ${polyStr(f)}$ で、$x$ が $${p}$ から $${q}$ まで変わるときの平均変化率を求めよう。`,
      answer: String(ans),
      before: '平均変化率：',
      hint: '平均変化率 $= \\dfrac{f(b) - f(a)}{b - a}$（y の増え方 ÷ x の増え方）',
      kaiMistake: `y の増え方 $f(${q}) - f(${p})$ だけで止めちゃった！ x の増え方 $${q} - ${paren(p)}$ でわるんだった…。`,
      explain: `$f(${q}) = ${polyAt(f, q)}$、$f(${p}) = ${polyAt(f, p)}$。平均変化率は $\\dfrac{${polyAt(f, q)} - ${paren(polyAt(f, p))}}{${q} - ${paren(p)}} = \\dfrac{${polyAt(f, q) - polyAt(f, p)}}{${q - p}} = ${ans}$`,
    };
  },

  /** 定義にしたがって微分係数を求める */
  'deriv-def': (level) => {
    const a = pickOne([1, -1, 2, 3]);
    const b = randInt(-4, 4);
    const c = randInt(-4, 4);
    const t = randInt(-3, 3);
    const f = [a, b, c];
    const ans = 2 * a * t + b;
    const fa = `f(${t})`;
    const fah = t === 0 ? 'f(h)' : `f(${t} + h)`;
    return {
      ...base('deriv-def', level),
      mode: 'number',
      prompt: `関数 $f(x) = ${polyStr(f)}$ について、微分係数 $f'(${t}) = \\displaystyle\\lim_{h \\to 0} \\dfrac{${fah} - ${fa}}{h}$ を求めよう。`,
      answer: String(ans),
      before: `f'(${t}) ＝`,
      hint: `$${fah} - ${fa}$ を計算して h でわり、最後に h を 0 に近づける。`,
      kaiMistake: 'h を残したまま答えちゃった！ h でわったあと、h → 0 にするんだった…。',
      explain: `$${fah} - ${fa} = ${polyStr([a, 2 * a * t + b, 0]).replace(/x/g, 'h')}$ なので、h でわると $${polyStr([a, 2 * a * t + b]).replace(/x/g, 'h')}$。h を 0 に近づけると $f'(${t}) = ${ans}$`,
    };
  },

  /** 導関数を求める（式で答える） */
  derivative: (level) => {
    const kind = randInt(0, 2);
    let shown: string;
    let f: number[];
    if (kind === 0) {
      f = [nz(-3, 3), randInt(-5, 5), randInt(-6, 6), randInt(-6, 6)];
      shown = polyStr(f);
    } else if (kind === 1) {
      // (px + q)(rx + s)
      const p = pickOne([1, 2, 3]);
      const q = nz(-4, 4);
      const r = pickOne([1, 1, 2]);
      const s = nz(-4, 4);
      f = [p * r, p * s + q * r, q * s];
      shown = `(${polyStr([p, q])})(${polyStr([r, s])})`;
    } else {
      // x(x + q)^2 または (x + q)^3 のかわりに x^2(x + q)
      const q = nz(-3, 3);
      f = [1, q, 0, 0];
      shown = `x^2(${polyStr([1, q])})`;
    }
    const d = polyD(f);
    return {
      ...base('derivative', level),
      mode: 'expr',
      tidy: true,
      prompt: `関数 $y = ${shown}$ を微分しよう。`,
      answer: polyStr(d),
      before: "y' ＝",
      hint: kind === 0 ? "$(x^n)' = nx^{n-1}$、定数を微分すると 0。" : 'まず展開して、1 つずつの項を微分する。',
      kaiMistake: kind === 0 ? '定数の項まで残しちゃった！ 定数は変化しないから微分すると 0 だ…。' : 'かっこの中だけ微分しちゃった！ 先に展開しないと…。',
      explain: `${kind === 0 ? '' : `展開すると $y = ${polyStr(f)}$。`}1 つずつの項を微分して $y' = ${polyStr(d)}$`,
    };
  },

  /** 微分係数 f'(t) の値 */
  'deriv-at': (level) => {
    const f = [nz(-2, 2), randInt(-4, 4), randInt(-6, 6), randInt(-5, 5)];
    const t = randInt(-2, 3);
    const d = polyD(f);
    const ans = polyAt(d, t);
    return {
      ...base('deriv-at', level),
      mode: 'number',
      prompt: `関数 $f(x) = ${polyStr(f)}$ について、$f'(${t})$ の値を求めよう。`,
      answer: String(ans),
      before: `f'(${t}) ＝`,
      hint: "まず導関数 $f'(x)$ を求めてから、x に代入する。",
      kaiMistake: `$f(${t})$ を計算しちゃった！ 先に微分してから代入するんだった…。`,
      explain: `$f'(x) = ${polyStr(d)}$ に $x = ${t}$ を代入して、$f'(${t}) = ${ans}$`,
    };
  },

  /** 接線の方程式 */
  tangent: (level) => {
    const cubic = Math.random() < 0.4;
    const f = cubic ? [1, randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)] : [pickOne([1, -1, 2]), randInt(-4, 4), randInt(-4, 4)];
    const t = randInt(-2, 2);
    const ft = polyAt(f, t);
    const m = polyAt(polyD(f), t);
    const line = [m, ft - m * t];
    return {
      ...base('tangent', level),
      mode: 'expr',
      tidy: true,
      prompt: `曲線 $y = ${polyStr(f)}$ 上の点 $(${t},\\ ${ft})$ における接線の方程式を求めよう。`,
      answer: polyStr(line),
      before: 'y ＝',
      hint: "傾きは $f'(" + t + ")$。点 $(a, f(a))$ を通る傾き m の直線は $y - f(a) = m(x - a)$。",
      kaiMistake: "傾きに $f'(x)$ の式をそのまま使っちゃった！ x = " + t + ' を代入した数が傾きだ…。',
      explain: `$y' = ${polyStr(polyD(f))}$ より、傾きは $${m}$。$y${ft === 0 ? '' : ` ${ft < 0 ? '+' : '-'} ${Math.abs(ft)}`} = ${m === 0 ? '0' : `${m === 1 ? '' : m === -1 ? '-' : m}${fac(t)}`}$ を整理して $y = ${polyStr(line)}$`,
    };
  },

  /** 極値 */
  extremum: (level) => {
    // f'(x) = 3k(x - α)(x - β) となるように作る（α < β、α + β は偶数）
    const al = randInt(-3, 1);
    const be = al + pickOne([2, 4]);
    const k = pickOne([1, -1]);
    const s = (al + be) / 2;
    const p = al * be;
    const d = randInt(-4, 4);
    const f = [k, -3 * s * k, 3 * p * k, d];
    const wantMax = Math.random() < 0.5;
    // k > 0 なら α で極大、β で極小
    const x0 = (k > 0) === wantMax ? al : be;
    const ans = polyAt(f, x0);
    const word = wantMax ? '極大値' : '極小値';
    return {
      ...base('extremum', level),
      mode: 'number',
      prompt: `関数 $f(x) = ${polyStr(f)}$ の${word}を求めよう。`,
      answer: String(ans),
      before: `${word}：`,
      hint: "$f'(x) = 0$ となる x を求めて、増減表をかく。",
      kaiMistake: `$f'(x) = 0$ になる x の値を答えちゃった！ ${word}は、そのときの $f(x)$ の値だ…。`,
      explain: `$f'(x) = ${polyStr(polyD(f))} = ${k < 0 ? '-' : ''}3${fac(al)}${fac(be)}$。増減表より、$x = ${x0}$ で${word} $f(${x0}) = ${ans}$`,
    };
  },

  /** 区間での最大・最小 */
  'max-min': (level) => {
    const al = randInt(-2, 0);
    const be = al + 2;
    const s = (al + be) / 2;
    const f = [1, -3 * s, 3 * al * be, randInt(-3, 3)];
    const lo = al - randInt(1, 2);
    const hi = be + randInt(0, 2);
    const cand = [lo, al, be, hi].filter((x) => x >= lo && x <= hi);
    const vals = cand.map((x) => polyAt(f, x));
    const wantMax = Math.random() < 0.5;
    const ans = wantMax ? Math.max(...vals) : Math.min(...vals);
    const word = wantMax ? '最大値' : '最小値';
    return {
      ...base('max-min', level),
      mode: 'number',
      prompt: `$${lo} \\le x \\le ${hi}$ における関数 $f(x) = ${polyStr(f)}$ の${word}を求めよう。`,
      answer: String(ans),
      before: `${word}：`,
      hint: '極値と、区間の両はしの値をくらべる。',
      kaiMistake: '極値だけ見て、区間のはしの値を見落とした！ 両はしもくらべるんだった…。',
      explain: `$f'(x) = 3${fac(al)}${fac(be)}$ より、極値の候補は $x = ${al},\\ ${be}$。$f(${lo}) = ${polyAt(f, lo)}$、$f(${al}) = ${polyAt(f, al)}$、$f(${be}) = ${polyAt(f, be)}$、$f(${hi}) = ${polyAt(f, hi)}$ をくらべて、${word}は $${ans}$`,
    };
  },

  /** 3 次方程式の実数解の個数 */
  'root-count': (level): ChoiceQuestion => {
    const al = randInt(-2, 0);
    const be = al + 2;
    const s = (al + be) / 2;
    const k = pickOne([1, -1]);
    const f = [k, -3 * s * k, 3 * al * be * k, 0];
    const v1 = polyAt(f, al);
    const v2 = polyAt(f, be);
    const top = Math.max(v1, v2);
    const bot = Math.min(v1, v2);
    const r = randInt(0, 4);
    const m = r === 0 ? top : r === 1 ? bot : r === 2 ? randInt(bot + 1, top - 1) : r === 3 ? top + randInt(1, 3) : bot - randInt(1, 3);
    const count = m === top || m === bot ? 2 : m > bot && m < top ? 3 : 1;
    const { choices, answer } = shuffle(`${count} 個`, ['0 個', '1 個', '2 個', '3 個'].filter((c) => c !== `${count} 個`));
    return {
      id: 'gen:root-count',
      level,
      type: 'choice',
      prompt: `方程式 $${polyStr(f)} = ${m}$ の異なる実数解の個数は？`,
      choices,
      answer,
      hint: `$y = ${polyStr(f)}$ のグラフと、横線 $y = ${m}$ の交点の個数を数える。`,
      kaiMistake: '3 次方程式だから、いつも 3 個だと思っちゃった！ グラフと横線の交点を数えるんだった…。',
      explain: `$y = ${polyStr(f)}$ は 極大値 $${top}$、極小値 $${bot}$。横線 $y = ${m}$ は${count === 3 ? 'そのあいだを通るので 3 回' : count === 2 ? '極値の高さでグラフにふれるので 2 回' : '極値の外側を通るので 1 回'}交わる。答えは ${count} 個。`,
    };
  },

  /** 条件つきの不定積分 */
  indefinite: (level) => {
    const a = randInt(-2, 2);
    const b = randInt(-3, 3, { nonZero: a === 0 });
    const c = randInt(-5, 5);
    const k = randInt(-2, 2);
    const v = randInt(-6, 6);
    const F0 = [a, b, c, 0];
    const C = v - polyAt(F0, k);
    const F = [a, b, c, C];
    const f = polyD(F);
    const strip = (cs: number[]) => (cs[0] === 0 ? cs.slice(1) : cs);
    return {
      ...base('indefinite', level),
      mode: 'expr',
      tidy: true,
      prompt: `$F'(x) = ${polyStr(strip(f))}$、$F(${k}) = ${v}$ をみたす関数 $F(x)$ を求めよう。`,
      answer: polyStr(strip(F)),
      before: 'F(x) ＝',
      hint: '$\\displaystyle\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$。最後に $F(' + k + ') = ' + v + '$ から C を決める。',
      kaiMistake: '積分定数 C をわすれた！ 条件を使って C を決めるんだった…。',
      explain: `$F(x) = ${polyStr(strip(F0))} + C$ とおく。$F(${k}) = ${polyAt(F0, k)} + C = ${v}$ より $C = ${C}$。だから $F(x) = ${polyStr(strip(F))}$`,
    };
  },

  /** 定積分の計算 */
  'def-integral': (level) => {
    const a = pickOne([1, -1, 2, 3, -3]);
    const b = randInt(-4, 4);
    const c = randInt(-4, 4);
    const p = randInt(-2, 1);
    const q = randInt(p + 1, 3);
    const f = [a, b, c];
    // ∫ = a(q³−p³)/3 + b(q²−p²)/2 + c(q−p)、分母 6 にそろえる
    const num = 2 * a * (q ** 3 - p ** 3) + 3 * b * (q ** 2 - p ** 2) + 6 * c * (q - p);
    const Ft = (x: number) => fracTex(2 * a * x ** 3 + 3 * b * x ** 2 + 6 * c * x, 6);
    const prim = `${a < 0 ? '-' : ''}\\dfrac{${Math.abs(a) === 1 ? '' : Math.abs(a)}x^3}{3}`;
    const primTex = `${prim}${b === 0 ? '' : ` ${b > 0 ? '+' : '-'} \\dfrac{${Math.abs(b) === 1 ? '' : Math.abs(b)}x^2}{2}`}${c === 0 ? '' : ` ${c > 0 ? '+' : '-'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x`}`;
    return {
      ...base('def-integral', level),
      mode: 'number',
      prompt: `定積分 $\\displaystyle\\int_{${p}}^{${q}} (${polyStr(f)})\\,dx$ を求めよう。`,
      answer: fracStr(num, 6),
      before: '答え：',
      hint: '$\\displaystyle\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a)$',
      kaiMistake: `$F(${q})$ だけ計算して、$F(${p})$ を引きわすれた！`,
      explain: `$\\Big[${primTex}\\Big]_{${p}}^{${q}} = ${Ft(q)} - ${Ft(p).startsWith('-') ? `\\left(${Ft(p)}\\right)` : Ft(p)} = ${fracTex(num, 6)}$`,
    };
  },

  /** 放物線と x 軸・直線で囲まれた面積 */
  area: (level) => {
    const al = randInt(-3, 1);
    const be = al + randInt(1, 4);
    const line = Math.random() < 0.5;
    const w = be - al;
    if (line) {
      // y = x² + bx + c と y = mx + n が x = α, β で交わる
      const b = randInt(-3, 3);
      const c = randInt(-3, 3);
      const m = al + be + b;
      const n = c - al * be;
      return {
        ...base('area', level),
        mode: 'number',
        prompt: `放物線 $y = ${polyStr([1, b, c])}$ と直線 $y = ${polyStr([m, n])}$ で囲まれた部分の面積 S を求めよう。`,
        answer: fracStr(w ** 3, 6),
        before: 'S ＝',
        hint: '交点の x 座標 α、β を求める。$\\displaystyle\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta)\\,dx = -\\dfrac{(\\beta - \\alpha)^3}{6}$',
        kaiMistake: '放物線から直線を引いて積分したら、マイナスになった！ 上にあるほうから下にあるほうを引くんだった…。',
        explain: `連立すると $${polyStr([1, b - m, c - n])} = 0$、$x = ${al},\\ ${be}$。この区間では直線が上なので、$S = \\displaystyle\\int_{${al}}^{${be}} \\{(${polyStr([m, n])}) - (${polyStr([1, b, c])})\\}\\,dx = \\dfrac{(${be} - ${paren(al)})^3}{6} = ${fracTex(w ** 3, 6)}$`,
      };
    }
    const k = pickOne([1, -1, 2, -2]);
    const f = [k, -k * (al + be), k * al * be];
    return {
      ...base('area', level),
      mode: 'number',
      prompt: `放物線 $y = ${polyStr(f)}$ と x 軸で囲まれた部分の面積 S を求めよう。`,
      answer: fracStr(Math.abs(k) * w ** 3, 6),
      before: 'S ＝',
      hint: 'x 軸との交点を求める。$\\displaystyle\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta)\\,dx = -\\dfrac{(\\beta - \\alpha)^3}{6}$',
      kaiMistake: `${k > 0 ? 'グラフが x 軸より下にあるのに、そのまま積分してマイナスの面積になった！' : '係数の ' + Math.abs(k) + ' をかけわすれた！'}`,
      explain: `$y = ${k === 1 ? '' : k === -1 ? '-' : k}${fac(al)}${fac(be)}$ より、x 軸との交点は $x = ${al},\\ ${be}$。$S = ${Math.abs(k) === 1 ? '' : `${Math.abs(k)} \\times `}\\dfrac{(${be} - ${paren(al)})^3}{6} = ${fracTex(Math.abs(k) * w ** 3, 6)}$`,
    };
  },
};
