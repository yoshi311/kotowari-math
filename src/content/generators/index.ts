// 数値を変えて何度でも出せる問題。復習クエストでも毎回ちがう数字で出る。
import type { InputQuestion, QLevel } from '../types';
import { fmt, paren, randInt, signed } from '../../engine/format';

type Gen = (level: QLevel) => InputQuestion;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });

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
};

export function generate(gen: string, level: QLevel): InputQuestion {
  const g = generators[gen];
  if (!g) throw new Error(`unknown generator: ${gen}`);
  return g(level);
}
