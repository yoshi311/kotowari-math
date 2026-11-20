// 数値を変えて何度でも出せる問題。復習クエストでも毎回ちがう数字で出る。
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, paren, randInt, signed } from '../../engine/format';
import { statGenerators } from './stats';
import { probGenerators } from './prob';
import { geoGenerators } from './geo';
import { coordGenerators } from './coord';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });

function shuffleChoices(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

/** 有名な角の三角比（TeX） */
const TRIG: Record<'sin' | 'cos' | 'tan', Record<number, string>> = {
  sin: { 30: '\\dfrac{1}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{\\sqrt{3}}{2}', 120: '\\dfrac{\\sqrt{3}}{2}', 135: '\\dfrac{\\sqrt{2}}{2}', 150: '\\dfrac{1}{2}' },
  cos: { 30: '\\dfrac{\\sqrt{3}}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{1}{2}', 120: '-\\dfrac{1}{2}', 135: '-\\dfrac{\\sqrt{2}}{2}', 150: '-\\dfrac{\\sqrt{3}}{2}' },
  tan: { 30: '\\dfrac{1}{\\sqrt{3}}', 45: '1', 60: '\\sqrt{3}', 120: '-\\sqrt{3}', 135: '-1', 150: '-\\dfrac{1}{\\sqrt{3}}' },
};

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export const generators: Record<string, Gen> = {
  /** x = k のとき ax + b の値 */
  'subst-linear': (level) => {
    const a = randInt(-6, 9, { nonZero: true, exclude: [1] });
    const b = randInt(-9, 9, { nonZero: true });
    const k = randInt(-5, 6, { nonZero: true });
    const expr = fmt([[a, 'x'], [b, '']]);
    const ans = a * k + b;
    return {
      ...base('subst-linear', level),
      mode: 'number',
      prompt: `$x = ${k}$ のとき、$${expr}$ の値を求めよう。`,
      answer: String(ans),
      before: '値：',
      hint: '箱 $x$ の中身を $' + k + '$ に入れかえて計算しよう。$' + a + 'x$ は「$' + a + ' \\times x$」のことだよ。',
      kaiMistake: k < 0 ? 'マイナスの数を入れるときに、かっこを付けずに計算してまちがえちゃった…' : undefined,
      explain: `$x$ に $${k}$ を入れると、$${a} \\times ${paren(k)} ${signed(b)} = ${a * k} ${signed(b)} = ${ans}$`,
    };
  },

  /** x = k のとき x^2 + bx + c の値（負の数の2乗に注意） */
  'subst-square': (level) => {
    const k = randInt(-5, -1);
    const b = randInt(-5, 5, { nonZero: true });
    const c = randInt(-6, 6);
    const expr = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    const ans = k * k + b * k + c;
    return {
      ...base('subst-square', level),
      mode: 'number',
      prompt: `$x = ${k}$ のとき、$${expr}$ の値を求めよう。`,
      answer: String(ans),
      before: '値：',
      hint: `$x^2$ は $x \\times x$。$x=${k}$ なら $(${k}) \\times (${k})$ だよ。マイナス×マイナスは？`,
      kaiMistake: `$x^2$ に $${k}$ を入れて $-${k * k}$ にしちゃった！ $(${k})^2$ と $-${-k}^2$ はちがうんだな…`,
      explain: `$(${k})^2 ${signed(b)} \\times ${paren(k)} ${c === 0 ? '' : signed(c)} = ${k * k} ${signed(b * k)} ${c === 0 ? '' : signed(c)} = ${ans}$`,
    };
  },

  /** (ax + b) ± (cx + d) */
  'add-linear': (level) => {
    const [a, b, c, d] = [randInt(1, 7), randInt(-9, 9, { nonZero: true }), randInt(1, 7), randInt(-9, 9, { nonZero: true })];
    const minus = Math.random() < 0.5;
    const p = fmt([[a, 'x'], [b, '']]);
    const q = fmt([[c, 'x'], [d, '']]);
    const s = minus ? -1 : 1;
    const ans = fmt([[a + s * c, 'x'], [b + s * d, '']]);
    return {
      ...base('add-linear', level),
      mode: 'expr',
      tidy: true,
      prompt: `$(${p}) ${minus ? '-' : '+'} (${q})$ を計算しよう。`,
      answer: ans,
      source: `(${p})${minus ? '-' : '+'}(${q})`,
      hint: minus
        ? 'うしろのかっこの前がマイナスのときは、かっこの中の**全部の符号**が反対になるよ。'
        : '$x$ の項どうし、数の項どうしをまとめよう。',
      kaiMistake: minus ? `かっこを外すとき、$${fmt([[c, 'x']])}$ だけ引いて、$${d}$ の符号を変えるのを忘れた！` : undefined,
      explain: `$x$ の項：$${a}x ${minus ? '-' : '+'} ${c}x = ${fmt([[a + s * c, 'x']])}$、数の項：$${b} ${minus ? '-' : '+'} ${paren(d)} = ${b + s * d}$。答えは $${ans}$`,
    };
  },

  /** ax(bx + c) */
  distribute: (level) => {
    const a = randInt(-4, 5, { nonZero: true });
    const b = randInt(1, 4);
    const c = randInt(-7, 7, { nonZero: true });
    const left = fmt([[a, 'x']]);
    const inner = fmt([[b, 'x'], [c, '']]);
    const ans = fmt([[a * b, 'x^2'], [a * c, 'x']]);
    return {
      ...base('distribute', level),
      mode: 'expr',
      tidy: true,
      prompt: `$${left}(${inner})$ を展開しよう。`,
      answer: ans,
      source: `${left}(${inner})`,
      hint: '長方形を2つに切り分けるイメージ。かっこの外の数を、中の**それぞれ**にかけよう。',
      kaiMistake: `前の項だけかけて、$${left} \\times ${paren(c)}$ を忘れちゃった！`,
      explain: `$${left} \\times ${fmt([[b, 'x']])} = ${fmt([[a * b, 'x^2']])}$、$${left} \\times ${paren(c)} = ${fmt([[a * c, 'x']])}$。合わせて $${ans}$`,
    };
  },

  /** (x + a)(x + b) */
  'expand-binom': (level) => {
    const a = randInt(-7, 7, { nonZero: true });
    const b = randInt(-7, 7, { nonZero: true, exclude: [a, -a] });
    const p = fmt([[1, 'x'], [a, '']]);
    const q = fmt([[1, 'x'], [b, '']]);
    const ans = fmt([[1, 'x^2'], [a + b, 'x'], [a * b, '']]);
    return {
      ...base('expand-binom', level),
      mode: 'expr',
      tidy: true,
      prompt: `$(${p})(${q})$ を展開しよう。`,
      answer: ans,
      source: `(${p})(${q})`,
      hint: '$(x+a)(x+b) = x^2 + (a+b)x + ab$。真ん中は「たし算」、最後は「かけ算」だよ。',
      kaiMistake: '真ん中の $x$ の項を忘れて、$x^2$ と数だけにしちゃった！',
      explain: `$a=${a},\\ b=${b}$ だから、$a+b = ${a + b}$、$ab = ${a * b}$。答えは $${ans}$`,
    };
  },

  /** (x ± a)^2 */
  'expand-square': (level) => {
    const a = randInt(-8, 8, { nonZero: true });
    const p = fmt([[1, 'x'], [a, '']]);
    const ans = fmt([[1, 'x^2'], [2 * a, 'x'], [a * a, '']]);
    return {
      ...base('expand-square', level),
      mode: 'expr',
      tidy: true,
      prompt: `$(${p})^2$ を展開しよう。`,
      answer: ans,
      source: `(${p})^2`,
      hint: '正方形を4つに分けた図を思い出そう。真ん中の長方形は**2枚**あるよ。',
      kaiMistake: `$(${p})^2 = x^2 + ${a * a}$ …じゃないのか！？ 長方形2枚ぶんの $${fmt([[2 * a, 'x']])}$ を忘れてた！`,
      explain: `$(x ${signed(a)})^2 = x^2 + 2 \\times ${paren(a)} \\times x + ${paren(a)}^2 = ${ans}$`,
    };
  },

  /** (ax + b)(ax - b) */
  'expand-diffsq': (level) => {
    const a = randInt(1, 4);
    const b = randInt(1, 9);
    const p = fmt([[a, 'x'], [b, '']]);
    const q = fmt([[a, 'x'], [-b, '']]);
    const ans = fmt([[a * a, 'x^2'], [-b * b, '']]);
    return {
      ...base('expand-diffsq', level),
      mode: 'expr',
      tidy: true,
      prompt: `$(${p})(${q})$ を展開しよう。`,
      answer: ans,
      source: `(${p})(${q})`,
      hint: '$(A+B)(A-B) = A^2 - B^2$。真ん中の項はプラスとマイナスで消えてしまうよ。',
      explain: `$A = ${fmt([[a, 'x']])},\\ B = ${b}$ として、$A^2 - B^2 = ${ans}$`,
    };
  },

  /** (ax + b)(cx + d) */
  'expand-general': (level) => {
    const a = randInt(2, 4);
    const b = randInt(-5, 5, { nonZero: true });
    const c = randInt(1, 3);
    const d = randInt(-5, 5, { nonZero: true });
    const p = fmt([[a, 'x'], [b, '']]);
    const q = fmt([[c, 'x'], [d, '']]);
    const ans = fmt([[a * c, 'x^2'], [a * d + b * c, 'x'], [b * d, '']]);
    return {
      ...base('expand-general', level),
      mode: 'expr',
      tidy: true,
      prompt: `$(${p})(${q})$ を展開しよう。`,
      answer: ans,
      source: `(${p})(${q})`,
      hint: '長方形を $2 \\times 2 = 4$ つのマスに分けて、それぞれの面積をたそう。',
      explain: `4つのマス：$${fmt([[a * c, 'x^2']])}$、$${fmt([[a * d, 'x']])}$、$${fmt([[b * c, 'x']])}$、$${b * d}$。まとめて $${ans}$`,
    };
  },

  // ---------- 因数分解 ----------

  /** ax^2 + bx → x(ax + b) */
  'factor-common': (level) => {
    let a: number, b: number;
    do {
      a = randInt(1, 5);
      b = randInt(-9, 9, { nonZero: true });
    } while (gcd(a, b) !== 1);
    const expr = fmt([[a, 'x^2'], [b, 'x']]);
    const ans = `x(${fmt([[a, 'x'], [b, '']])})`;
    return {
      ...base('factor-common', level),
      mode: 'expr',
      factored: true,
      prompt: `$${expr}$ を因数分解しよう。`,
      answer: ans,
      source: expr,
      hint: 'どの項にも入っている「共通の部分」を、かっこの外にくくり出そう。',
      kaiMistake: 'くくり出したあと、かっこの中に何が残るか確かめるのを忘れた！ 展開してもとに戻るか確認だ…',
      explain: `どの項にも $x$ がふくまれるので、$x$ をくくり出して $${ans}$。展開すると元の式にもどるよ。`,
    };
  },

  /** x^2 + (a+b)x + ab → (x+a)(x+b) */
  'factor-binom': (level) => {
    const a = randInt(-7, 7, { nonZero: true });
    const b = randInt(-7, 7, { nonZero: true, exclude: [a, -a] });
    const expr = fmt([[1, 'x^2'], [a + b, 'x'], [a * b, '']]);
    const ans = `(${fmt([[1, 'x'], [a, '']])})(${fmt([[1, 'x'], [b, '']])})`;
    return {
      ...base('factor-binom', level),
      mode: 'expr',
      factored: true,
      prompt: `$${expr}$ を因数分解しよう。`,
      answer: ans,
      source: expr,
      hint: `「かけて $${a * b}$、たして $${a + b}$」になる2つの数を探そう。`,
      kaiMistake: 'かけ算の組み合わせは合ってたのに、符号（＋と−）を逆にしちゃった！',
      explain: `かけて $${a * b}$、たして $${a + b}$ になるのは $${a}$ と $${b}$。だから $${ans}$。`,
    };
  },

  /** x^2 ± 2ax + a^2 → (x ± a)^2 */
  'factor-square': (level) => {
    const a = randInt(-9, 9, { nonZero: true });
    const expr = fmt([[1, 'x^2'], [2 * a, 'x'], [a * a, '']]);
    const ans = `(${fmt([[1, 'x'], [a, '']])})^2`;
    return {
      ...base('factor-square', level),
      mode: 'expr',
      factored: true,
      prompt: `$${expr}$ を因数分解しよう。`,
      answer: ans,
      source: expr,
      hint: `最後の数 $${a * a}$ は、何の2乗？ 真ん中が $2 \\times (\\text{その数}) \\times x$ になっているか確かめよう。`,
      explain: `$${a * a} = ${paren(a)}^2$、真ん中は $2 \\times ${paren(a)} \\times x = ${fmt([[2 * a, 'x']])}$。だから $${ans}$。正方形にぴったり並ぶ形だね。`,
    };
  },

  /** a^2x^2 - b^2 → (ax + b)(ax - b) */
  'factor-diffsq': (level) => {
    const a = randInt(1, 4);
    let b: number;
    do b = randInt(1, 9);
    while (gcd(a, b) !== 1);
    const expr = fmt([[a * a, 'x^2'], [-b * b, '']]);
    const ax = fmt([[a, 'x']]);
    const ans = `(${ax}+${b})(${ax}-${b})`;
    return {
      ...base('factor-diffsq', level),
      mode: 'expr',
      factored: true,
      prompt: `$${expr}$ を因数分解しよう。`,
      answer: ans,
      source: expr,
      hint: '「2乗 − 2乗」の形。$A^2 - B^2 = (A+B)(A-B)$ を使おう。',
      explain: `$${expr} = (${ax})^2 - ${b}^2$ なので、$${ans}$。正方形からすみを切り取って並べかえた、あの図だよ。`,
    };
  },

  // ---------- 絶対値 ----------

  /** |a| + |b| や |a - b| の値 */
  'abs-value': (level) => {
    const a = randInt(-9, 9, { nonZero: true });
    const b = randInt(-9, 9, { nonZero: true });
    const kind = Math.random() < 0.5;
    const expr = kind ? `|${a}| + |${b}|` : `|${a} - ${paren(b)}|`;
    const ans = kind ? Math.abs(a) + Math.abs(b) : Math.abs(a - b);
    return {
      ...base('abs-value', level),
      mode: 'number',
      prompt: `$${expr}$ の値を求めよう。`,
      answer: String(ans),
      before: '値：',
      hint: kind ? '絶対値は「0 からの距離」。距離はいつも 0 以上だよ。' : '先に絶対値の中を計算してから、0 からの距離にしよう。',
      kaiMistake: kind ? undefined : '絶対値を先にばらばらに外して $|a| - |b|$ にしちゃった！ 中身を先に計算しなきゃ…',
      explain: kind
        ? `$|${a}| = ${Math.abs(a)}$、$|${b}| = ${Math.abs(b)}$。たして $${ans}$`
        : `中身は $${a} - ${paren(b)} = ${a - b}$。0 からの距離は $${ans}$`,
    };
  },

  /** 数直線上の 2 点の距離 */
  'abs-dist': (level) => {
    const a = randInt(-9, 9);
    const b = randInt(-9, 9, { exclude: [a] });
    return {
      ...base('abs-dist', level),
      mode: 'number',
      prompt: `数直線上の 2 点 $A(${a})$、$B(${b})$ の距離 $AB$ を求めよう。`,
      answer: String(Math.abs(a - b)),
      before: '距離：',
      hint: '2 点の距離は「大きいほう − 小さいほう」。式で書くと $|a - b|$。',
      explain: `$AB = |${a} - ${paren(b)}| = |${a - b}| = ${Math.abs(a - b)}$`,
    };
  },

  // ---------- 1 次不等式 ----------

  /** ax + b > c を解く（a が負なら向きが変わる） */
  'linear-ineq': (level): ChoiceQuestion => {
    const a = randInt(-5, 5, { nonZero: true, exclude: [1, -1] });
    const k = randInt(-6, 6, { nonZero: true });
    const b = randInt(-9, 9, { nonZero: true });
    const gt = Math.random() < 0.5;
    const c = a * k + b;
    const sign = gt ? '>' : '<';
    // a が負なら不等号の向きが逆になる
    const resGt = a > 0 ? gt : !gt;
    const show = (g: boolean, v: number) => `$x ${g ? '>' : '<'} ${v}$`;
    const { choices, answer } = shuffleChoices(show(resGt, k), [show(!resGt, k), show(resGt, -k), show(!resGt, -k)]);
    return {
      id: 'gen:linear-ineq',
      level,
      type: 'choice',
      prompt: `不等式 $${fmt([[a, 'x'], [b, '']])} ${sign} ${c}$ を解こう。`,
      choices,
      answer,
      hint: a < 0 ? '両辺を**負の数**でわるとき、不等号の向きはどうなる？' : 'まず $' + b + '$ を右辺に移そう（符号が変わる）。',
      kaiMistake: a < 0 ? `$${a}$ でわったのに、不等号の向きを変えるのを忘れた！` : undefined,
      explain: `$${b}$ を右辺に移して $${fmt([[a, 'x']])} ${sign} ${c - b}$。両辺を $${a}$ でわると${a < 0 ? '（**負の数でわるので向きが逆になる**）' : ''}、$x ${resGt ? '>' : '<'} ${k}$`,
    };
  },

  // ---------- 2次関数 ----------

  /** f(x) = ax^2 + bx + c の f(k) */
  'func-value': (level) => {
    const a = randInt(-3, 3, { nonZero: true });
    const b = randInt(-5, 5);
    const c = randInt(-6, 6);
    const k = randInt(-3, 3, { nonZero: true });
    const expr = fmt([[a, 'x^2'], [b, 'x'], [c, '']]);
    const ans = a * k * k + b * k + c;
    return {
      ...base('func-value', level),
      mode: 'number',
      prompt: `$f(x) = ${expr}$ のとき、$f(${k})$ の値を求めよう。`,
      answer: String(ans),
      before: '値：',
      hint: `$f(${k})$ は「$x$ に $${k}$ を入れたときの値」。${k < 0 ? 'マイナスはかっこをつけて入れよう。' : ''}`,
      kaiMistake: k < 0 ? `$x^2$ に $${k}$ を入れて、$(${k})^2$ を $-${k * k}$ にしちゃった！` : undefined,
      explain: `$f(${k}) = ${a === 1 ? '' : a === -1 ? '-' : a}${paren(k)}^2 ${b === 0 ? '' : `${signed(b)} \\times ${paren(k)}`} ${c === 0 ? '' : signed(c)} = ${ans}$`,
    };
  },

  /** y = a(x - p)^2 + q の頂点 */
  'shift-vertex': (level): ChoiceQuestion => {
    const a = [1, 2, -1, -2, 3][randInt(0, 4)];
    const p = randInt(-5, 5, { nonZero: true });
    let q: number;
    do q = randInt(-6, 6, { nonZero: true });
    while (Math.abs(q) === Math.abs(p));
    const aa = a === 1 ? '' : a === -1 ? '-' : String(a);
    const tex = `y = ${aa}(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2 ${signed(q)}`;
    const show = (x: number, y: number) => `$(${x},\\ ${y})$`;
    const { choices, answer } = shuffleChoices(show(p, q), [show(-p, q), show(p, -q), show(-p, -q)]);
    return {
      id: 'gen:shift-vertex',
      level,
      type: 'choice',
      prompt: `放物線 $${tex}$ の頂点の座標は？`,
      choices,
      answer,
      hint: '$y = a(x - p)^2 + q$ の頂点は $(p,\\ q)$。かっこの中の符号は**逆**になるよ。',
      kaiMistake: `$(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})$ を見て、頂点の $x$ 座標を $${-p}$ にしちゃった！`,
      explain: `$(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2$ は $x = ${p}$ のとき 0 になる。だから頂点は $(${p},\\ ${q})$。`,
    };
  },

  /** y = x^2 + bx + c を平方完成して頂点 */
  'complete-square': (level): ChoiceQuestion => {
    const h = randInt(-5, 5, { nonZero: true });
    const k = randInt(-8, 8, { exclude: [h, -h] });
    const b = 2 * h;
    const c = h * h + k;
    const expr = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    const show = (x: number, y: number) => `$(${x},\\ ${y})$`;
    const wrongs = [show(h, k), show(-h, c), show(h, -k)].filter((w) => w !== show(-h, k));
    const { choices, answer } = shuffleChoices(show(-h, k), [...new Set(wrongs)]);
    return {
      id: 'gen:complete-square',
      level,
      type: 'choice',
      prompt: `放物線 $y = ${expr}$ の頂点の座標は？`,
      choices,
      answer,
      hint: `$x$ の係数 $${b}$ の半分は $${h}$。$(x ${signed(h)})^2$ を作って、増えた $${h * h}$ を引こう。`,
      explain: `$y = (x ${signed(h)})^2 - ${h * h} ${signed(c)} = (x ${signed(h)})^2 ${k === 0 ? '' : signed(k)}$。頂点は $(${-h},\\ ${k})$。`,
    };
  },

  /** y = x^2 + bx + c の最小値 */
  'cs-min': (level) => {
    const h = randInt(-5, 5, { nonZero: true });
    const k = randInt(-9, 9);
    const b = 2 * h;
    const c = h * h + k;
    const expr = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    return {
      ...base('cs-min', level),
      mode: 'number',
      prompt: `2次関数 $y = ${expr}$ の最小値を求めよう。`,
      answer: String(k),
      before: '最小値：',
      hint: '平方完成して、頂点の $y$ 座標を求めよう。下に凸なので、頂点がいちばん低い点。',
      explain: `$y = (x ${signed(h)})^2 ${k === 0 ? '' : signed(k)}$。$x = ${-h}$ のとき最小値 $${k}$。`,
    };
  },

  /** y = (x - p)^2 + q の、定義域つきの最大値・最小値 */
  'max-min-domain': (level) => {
    const p = randInt(-2, 3);
    const q = randInt(-4, 4);
    const s = randInt(-3, 2);
    const e = s + randInt(2, 4);
    const f = (x: number) => (x - p) ** 2 + q;
    const wantMax = Math.random() < 0.5;
    const inside = p >= s && p <= e;
    const min = inside ? q : Math.min(f(s), f(e));
    const max = Math.max(f(s), f(e));
    const ans = wantMax ? max : min;
    const inner = p === 0 ? 'x^2' : `(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2`;
    const word = wantMax ? '最大値' : '最小値';
    return {
      ...base('max-min-domain', level),
      mode: 'number',
      prompt: `2次関数 $y = ${inner} ${q === 0 ? '' : signed(q)}$（$${s} \\le x \\le ${e}$）の**${word}**を求めよう。`,
      answer: String(ans),
      before: `${word}：`,
      hint: `軸は $x = ${p}$。定義域の両はしと頂点のうち、どこがいちばん高い（低い）？ グラフをかいてみよう。`,
      kaiMistake: wantMax ? '頂点のところが最大だと思っちゃった！ 下に凸のグラフだから、頂点は最小のほうだ…。' : undefined,
      explain: `軸 $x = ${p}$ は定義域の${inside ? '中' : '外'}。$x = ${s}$ のとき $${f(s)}$、$x = ${e}$ のとき $${f(e)}$${inside ? `、頂点の値は $${q}$` : ''}。よって${word}は $${ans}$。`,
    };
  },

  /** x^2 + (a+b)x + ab = 0 を因数分解で解く */
  'solve-factor': (level): ChoiceQuestion => {
    const a = randInt(-7, 7, { nonZero: true });
    const b = randInt(-7, 7, { nonZero: true, exclude: [a, -a] });
    const expr = fmt([[1, 'x^2'], [a + b, 'x'], [a * b, '']]);
    const show = (x: number, y: number) => `$x = ${Math.min(x, y)},\\ ${Math.max(x, y)}$`;
    const { choices, answer } = shuffleChoices(show(-a, -b), [show(a, b), show(-a, b), show(a, -b)]);
    return {
      id: 'gen:solve-factor',
      level,
      type: 'choice',
      prompt: `2次方程式 $${expr} = 0$ を解こう。`,
      choices,
      answer,
      hint: `因数分解すると $(x ${signed(a)})(x ${signed(b)}) = 0$。かけて 0 なら、どちらかが 0。`,
      kaiMistake: `$(x ${signed(a)})(x ${signed(b)}) = 0$ から、そのまま $x = ${a},\\ ${b}$ と答えちゃった！ 符号が逆だ…。`,
      explain: `$(x ${signed(a)})(x ${signed(b)}) = 0$ より $x ${signed(a)} = 0$ または $x ${signed(b)} = 0$。よって $x = ${-a},\\ ${-b}$。`,
    };
  },

  /** 判別式で共有点の個数 */
  'disc-count': (level): ChoiceQuestion => {
    const kind = randInt(0, 2); // 0: D>0, 1: D=0, 2: D<0
    const h = randInt(-4, 4, { nonZero: true });
    const b = 2 * h;
    const c = kind === 1 ? h * h : kind === 0 ? h * h - randInt(1, 6) : h * h + randInt(1, 6);
    const D = b * b - 4 * c;
    const expr = fmt([[1, 'x^2'], [b, 'x'], [c, '']]);
    return {
      id: 'gen:disc-count',
      level,
      type: 'choice',
      prompt: `放物線 $y = ${expr}$ と $x$ 軸の共有点の個数は？`,
      choices: ['2 個', '1 個', '0 個'],
      answer: kind,
      hint: '判別式 $D = b^2 - 4ac$ の符号を調べよう。',
      explain: `$D = ${paren(b)}^2 - 4 \\times 1 \\times ${paren(c)} = ${D}$。${D > 0 ? '$D > 0$ なので 2 個' : D === 0 ? '$D = 0$ なので 1 個（接する）' : '$D < 0$ なので 0 個（交わらない）'}。`,
    };
  },

  /** (x - α)(x - β) > 0 / < 0 */
  'quad-ineq': (level): ChoiceQuestion => {
    const al = randInt(-6, 4);
    let be: number;
    do be = randInt(al + 1, 7);
    while (be === -al);
    const pos = Math.random() < 0.5;
    const expr = fmt([[1, 'x^2'], [-(al + be), 'x'], [al * be, '']]);
    const inside = (x: number, y: number) => `$${x} < x < ${y}$`;
    const outside = (x: number, y: number) => `$x < ${x},\\ ${y} < x$`;
    const correct = pos ? outside(al, be) : inside(al, be);
    const wrongs = pos ? [inside(al, be), outside(-be, -al), inside(-be, -al)] : [outside(al, be), inside(-be, -al), outside(-be, -al)];
    const { choices, answer } = shuffleChoices(correct, wrongs);
    return {
      id: 'gen:quad-ineq',
      level,
      type: 'choice',
      prompt: `2次不等式 $${expr} ${pos ? '>' : '<'} 0$ を解こう。`,
      choices,
      answer,
      hint: `左辺を因数分解すると $(x ${signed(-al)})(x ${signed(-be)})$。グラフが $x$ 軸より${pos ? '上' : '下'}になる範囲は？`,
      explain: `$(x ${signed(-al)})(x ${signed(-be)}) ${pos ? '>' : '<'} 0$。グラフは $x = ${al},\\ ${be}$ で $x$ 軸と交わる下に凸の放物線なので、${pos ? '外側' : 'あいだ'}が答え：${correct}`,
    };
  },


  // ---------- 図形と計量 ----------

  /** 有名な角の三角比の値 */
  'trig-value': (level): ChoiceQuestion => {
    const fn = (['sin', 'cos', 'tan'] as const)[randInt(0, 2)];
    const angles = fn === 'tan' ? [30, 45, 60, 120, 135, 150] : [30, 45, 60, 120, 135, 150];
    const deg = angles[randInt(0, angles.length - 1)];
    const correct = `$${TRIG[fn][deg]}$`;
    // まちがいの候補は sin・cos・tan すべての値から選ぶ（sin だけだと 3 種類しかなく足りない）
    const pool = [...new Set([...Object.values(TRIG.sin), ...Object.values(TRIG.cos), ...Object.values(TRIG.tan)])]
      .map((v) => `$${v}$`)
      .filter((v) => v !== correct);
    const wrongs: string[] = [];
    while (wrongs.length < 3) {
      const w = pool[randInt(0, pool.length - 1)];
      if (!wrongs.includes(w)) wrongs.push(w);
    }
    const { choices, answer } = shuffleChoices(correct, wrongs);
    return {
      id: 'gen:trig-value',
      level,
      type: 'choice',
      prompt: `$\\${fn} ${deg}^\\circ$ の値は？`,
      choices,
      answer,
      hint: deg > 90
        ? `単位円で考えよう。$${deg}^\\circ$ の点は左側にあるので、cos と tan はマイナス。$180^\\circ - ${deg}^\\circ = ${180 - deg}^\\circ$ と同じ高さ。`
        : '30°・45°・60° の三角定規の辺の比（$1 : 2 : \\sqrt{3}$、$1 : 1 : \\sqrt{2}$）を思い出そう。',
      kaiMistake: deg > 90 && fn !== 'sin' ? `$${180 - deg}^\\circ$ と同じ値にして、マイナスをつけ忘れた！` : undefined,
      explain: `$\\${fn} ${deg}^\\circ = ${TRIG[fn][deg]}$${deg > 90 ? `（$180^\\circ - \\theta$ の公式：$\\sin$ はそのまま、$\\cos$・$\\tan$ は符号が逆）` : ''}`,
    };
  },

  /** 30°・60° の直角三角形の辺 */
  'right-tri-side': (level) => {
    const k = randInt(2, 9);
    const use30 = Math.random() < 0.5;
    return {
      ...base('right-tri-side', level),
      mode: 'number',
      prompt: use30
        ? `斜辺の長さが $${2 * k}$、1つの角が $30^\\circ$ の直角三角形で、$30^\\circ$ の角に向かい合う辺（高さ）の長さは？`
        : `斜辺の長さが $${2 * k}$、1つの角が $60^\\circ$ の直角三角形で、$60^\\circ$ の角のとなりの辺（底辺）の長さは？`,
      answer: String(k),
      before: '長さ：',
      hint: use30 ? '高さ ＝ 斜辺 × $\\sin 30^\\circ$' : '底辺 ＝ 斜辺 × $\\cos 60^\\circ$',
      explain: use30
        ? `$${2 * k} \\times \\sin 30^\\circ = ${2 * k} \\times \\dfrac{1}{2} = ${k}$`
        : `$${2 * k} \\times \\cos 60^\\circ = ${2 * k} \\times \\dfrac{1}{2} = ${k}$`,
    };
  },

  /** 距離と仰角から高さ（tan の近似値を使う） */
  'height-tan': (level) => {
    const table: Record<number, number> = { 20: 0.36, 25: 0.47, 30: 0.58, 35: 0.7, 40: 0.84 };
    const deg = [20, 25, 30, 35, 40][randInt(0, 4)];
    const d = randInt(1, 6) * 50;
    const h = Math.round(d * table[deg] * 100) / 100;
    return {
      ...base('height-tan', level),
      mode: 'number',
      prompt: `塔から $${d}$ m はなれた地点で、塔の先を見上げる角（仰角）は $${deg}^\\circ$ だった。$\\tan ${deg}^\\circ = ${table[deg]}$ として、塔の高さを求めよう（目の高さは考えない）。`,
      answer: String(h),
      before: '高さ：',
      after: 'm',
      hint: '高さ ÷ 距離 ＝ tan（仰角）。だから 高さ ＝ 距離 × tan。',
      explain: `$${d} \\times \\tan ${deg}^\\circ = ${d} \\times ${table[deg]} = ${h}$ m`,
    };
  },

  /** 余弦定理で c^2 */
  'cos-law-sq': (level) => {
    const a = randInt(2, 8);
    const b = randInt(2, 8);
    const C = Math.random() < 0.5 ? 60 : 120;
    const ans = C === 60 ? a * a + b * b - a * b : a * a + b * b + a * b;
    return {
      ...base('cos-law-sq', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ で $a = ${a}$、$b = ${b}$、$C = ${C}^\\circ$ のとき、$c^2$ の値を求めよう。`,
      answer: String(ans),
      before: '$c^2$ ＝',
      hint: `$c^2 = a^2 + b^2 - 2ab\\cos C$。$\\cos ${C}^\\circ = ${C === 60 ? '\\dfrac{1}{2}' : '-\\dfrac{1}{2}'}$`,
      kaiMistake: C === 120 ? '$\\cos 120^\\circ$ をプラスの $\\dfrac{1}{2}$ にして、引き算しちゃった！' : undefined,
      explain: `$c^2 = ${a * a} + ${b * b} - 2 \\times ${a} \\times ${b} \\times \\left(${C === 60 ? '\\dfrac{1}{2}' : '-\\dfrac{1}{2}'}\\right) = ${ans}$`,
    };
  },

  /** 2辺とはさむ角から面積 */
  'area-sin': (level) => {
    const a = randInt(1, 6) * 2;
    const b = randInt(1, 6) * 2;
    const C = Math.random() < 0.5 ? 30 : 150;
    const S = (a * b) / 4;
    return {
      ...base('area-sin', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ で $a = ${a}$、$b = ${b}$、$C = ${C}^\\circ$ のとき、面積 $S$ を求めよう。`,
      answer: String(S),
      before: '$S$ ＝',
      hint: `$S = \\dfrac{1}{2}ab\\sin C$。$\\sin ${C}^\\circ = \\dfrac{1}{2}$`,
      explain: `$S = \\dfrac{1}{2} \\times ${a} \\times ${b} \\times \\sin ${C}^\\circ = \\dfrac{1}{2} \\times ${a * b} \\times \\dfrac{1}{2} = ${S}$`,
    };
  },

  /** 正弦定理で外接円の半径 */
  'sin-law-R': (level) => {
    const A = [30, 150, 90][randInt(0, 2)];
    const a = A === 90 ? randInt(1, 8) * 2 : randInt(2, 12);
    const R = A === 90 ? a / 2 : a;
    return {
      ...base('sin-law-R', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ で $a = ${a}$、$A = ${A}^\\circ$ のとき、外接円の半径 $R$ を求めよう。`,
      answer: String(R),
      before: '$R$ ＝',
      hint: `正弦定理 $\\dfrac{a}{\\sin A} = 2R$。$\\sin ${A}^\\circ = ${A === 90 ? '1' : '\\dfrac{1}{2}'}$`,
      kaiMistake: '$\\dfrac{a}{\\sin A}$ をそのまま $R$ にしちゃった！ それは直径 $2R$ だ…。',
      explain: `$2R = \\dfrac{${a}}{\\sin ${A}^\\circ} = ${A === 90 ? a : 2 * a}$ より $R = ${R}$`,
    };
  },

  ...statGenerators,
  ...probGenerators,
  ...geoGenerators,
  ...coordGenerators,
};

export function generate(gen: string, level: QLevel): Question {
  const g = generators[gen];
  if (!g) throw new Error(`unknown generator: ${gen}`);
  return g(level);
}
