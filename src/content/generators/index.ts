// 数値を変えて何度でも出せる問題。復習クエストでも毎回ちがう数字で出る。
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, paren, randInt, signed } from '../../engine/format';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });

function shuffleChoices(correct: string, wrongs: string[]): { choices: string[]; answer: number } {
  const all = [correct, ...wrongs].map((c) => ({ c, r: Math.random() }));
  all.sort((a, b) => a.r - b.r);
  return { choices: all.map((x) => x.c), answer: all.findIndex((x) => x.c === correct) };
}

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
};

export function generate(gen: string, level: QLevel): Question {
  const g = generators[gen];
  if (!g) throw new Error(`unknown generator: ${gen}`);
  return g(level);
}
