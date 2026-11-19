// 場合の数と確率の生成問題
import type { QLevel, Question } from '../types';
import { randInt } from '../../engine/format';
import { fact, fracStr, fracTex, nCr, perm } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: T[]): T => xs[randInt(0, xs.length - 1)];

export const probGenerators: Record<string, Gen> = {
  /** 1〜N で a または b の倍数の個数 */
  'union-count': (level) => {
    const N = pickOne([50, 60, 100, 120, 200]);
    const [a, b] = pickOne([[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [3, 7], [2, 7]]);
    const na = Math.floor(N / a);
    const nb = Math.floor(N / b);
    const nab = Math.floor(N / (a * b));
    const ans = na + nb - nab;
    return {
      ...base('union-count', level),
      mode: 'number',
      prompt: `1 から ${N} までの整数のうち、${a} の倍数または ${b} の倍数は何個あるか。`,
      answer: String(ans),
      before: '答え：',
      after: '個',
      hint: `$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$。両方の倍数（${a * b} の倍数）を 2 回数えないように。`,
      kaiMistake: `${a} の倍数と ${b} の倍数をたしただけにしちゃった！ ${a * b} の倍数を 2 回数えてた…。`,
      explain: `${a} の倍数 ${na} 個、${b} の倍数 ${nb} 個、${a * b} の倍数 ${nab} 個。$${na} + ${nb} - ${nab} = ${ans}$ 個。`,
    };
  },

  /** 順列 nPr */
  'perm-npr': (level) => {
    const n = randInt(4, 9);
    const r = randInt(2, 3);
    const ans = perm(n, r);
    const fs = Array.from({ length: r }, (_, i) => n - i);
    return {
      ...base('perm-npr', level),
      mode: 'number',
      prompt: `${n} 人の中から、${r === 2 ? '委員長と副委員長' : '1 位・2 位・3 位'}を 1 人ずつ選ぶ方法は何通りあるか。`,
      answer: String(ans),
      before: '答え：',
      after: '通り',
      hint: `役割（順番）があるので順列。$${'{}_{' + n + '}\\mathrm{P}_{' + r + '}'}$`,
      explain: `$${'{}_{' + n + '}\\mathrm{P}_{' + r + '}'} = ${fs.join(' \\times ')} = ${ans}$ 通り。`,
    };
  },

  /** 円順列 */
  'circle-perm': (level) => {
    const n = randInt(4, 7);
    const ans = fact(n - 1);
    return {
      ...base('circle-perm', level),
      mode: 'number',
      prompt: `${n} 人が円いテーブルのまわりにすわる方法は何通りあるか。`,
      answer: String(ans),
      before: '答え：',
      after: '通り',
      hint: '回して同じになるならび方は 1 通りとみる。$(n - 1)!$',
      kaiMistake: `一列と同じように ${n}! にしちゃった！ 回したら同じになるのに…。`,
      explain: `$(${n} - 1)! = ${n - 1}! = ${ans}$ 通り。`,
    };
  },

  /** 組合せ nCr */
  'comb-ncr': (level) => {
    const n = randInt(5, 10);
    const r = randInt(2, 4);
    const ans = nCr(n, r);
    return {
      ...base('comb-ncr', level),
      mode: 'number',
      prompt: `${n} 人の中から ${r} 人の代表を選ぶ方法は何通りあるか。`,
      answer: String(ans),
      before: '答え：',
      after: '通り',
      hint: `選ぶだけ（順番は関係ない）なので組合せ。$${'{}_{' + n + '}\\mathrm{C}_{' + r + '}'} = \\dfrac{${'{}_{' + n + '}\\mathrm{P}_{' + r + '}'}}{${r}!}$`,
      kaiMistake: `順列の ${perm(n, r)} 通りにしちゃった！ 代表に順番はないんだよな…。`,
      explain: `$${'{}_{' + n + '}\\mathrm{C}_{' + r + '}'} = \\dfrac{${perm(n, r)}}{${fact(r)}} = ${ans}$ 通り。`,
    };
  },

  /** 同じものを含む順列 */
  'same-perm': (level) => {
    const p = randInt(2, 4);
    const q = randInt(2, 4);
    const r = randInt(0, 2);
    const word = 'a'.repeat(p) + 'b'.repeat(q) + 'c'.repeat(r);
    const ans = fact(p + q + r) / (fact(p) * fact(q) * fact(r));
    const den = [`${p}!`, `${q}!`, ...(r > 1 ? [`${r}!`] : [])].join('\\,');
    return {
      ...base('same-perm', level),
      mode: 'number',
      prompt: `${p + q + r} 文字 ${word.split('').join('、')} を 1 列にならべる方法は何通りあるか。`,
      answer: String(ans),
      before: '答え：',
      after: '通り',
      hint: '全部ちがう文字とみてならべ、同じ文字どうしの入れかえ分でわる。',
      explain: `$\\dfrac{${p + q + r}!}{${den}} = ${ans}$ 通り。`,
    };
  },

  /** 最短経路 */
  'grid-path': (level) => {
    const w = randInt(2, 5);
    const h = randInt(2, 4);
    const ans = nCr(w + h, w);
    return {
      ...base('grid-path', level),
      mode: 'number',
      prompt: `碁盤の目の道で、右へ ${w} 区画、上へ ${h} 区画進んだ先の家まで行く。最短の道順は何通りあるか。`,
      answer: String(ans),
      before: '答え：',
      after: '通り',
      hint: `→ を ${w} 個、↑ を ${h} 個ならべる方法と同じ。`,
      explain: `$\\dfrac{${w + h}!}{${w}!\\,${h}!} = {}_{${w + h}}\\mathrm{C}_{${w}} = ${ans}$ 通り。`,
    };
  },

  /** 2 つのさいころの目の和 */
  'dice-sum': (level) => {
    const s = randInt(3, 11);
    const c = 6 - Math.abs(s - 7);
    return {
      ...base('dice-sum', level),
      mode: 'number',
      prompt: `大小 2 つのさいころを投げるとき、目の和が ${s} になる確率を求めよう（分数は 1/6 のように入力）。`,
      answer: fracStr(c, 36),
      before: '確率：',
      hint: `全部で $6 \\times 6 = 36$ 通り。和が ${s} になる組を数えよう。`,
      explain: `和が ${s} になるのは ${c} 通り。$\\dfrac{${c}}{36}${c === 1 ? '' : ` = ${fracTex(c, 36)}`}$`,
    };
  },

  /** 余事象「少なくとも 1 回」 */
  complement: (level) => {
    if (Math.random() < 0.5) {
      const n = randInt(2, 3);
      const d = 6 ** n;
      const nn = d - 5 ** n;
      return {
        ...base('complement', level),
        mode: 'number',
        prompt: `さいころを ${n} 回投げるとき、少なくとも 1 回は 6 の目が出る確率を求めよう。`,
        answer: fracStr(nn, d),
        before: '確率：',
        hint: '「少なくとも 1 回」は、反対の「1 回も出ない」を全体の 1 からひく。',
        kaiMistake: `$\\dfrac{1}{6}$ を ${n} 回たしちゃった！ 両方 6 の場合を重ねて数えてる…。`,
        explain: `1 回も 6 が出ない確率は $\\left(\\dfrac{5}{6}\\right)^${n} = \\dfrac{${5 ** n}}{${d}}$。$1 - \\dfrac{${5 ** n}}{${d}} = ${fracTex(nn, d)}$`,
      };
    }
    const n = randInt(3, 5);
    const d = 2 ** n;
    return {
      ...base('complement', level),
      mode: 'number',
      prompt: `コインを ${n} 回投げるとき、少なくとも 1 回は表が出る確率を求めよう。`,
      answer: fracStr(d - 1, d),
      before: '確率：',
      hint: '反対の「全部うら」の確率を 1 からひく。',
      explain: `全部うらの確率は $\\left(\\dfrac{1}{2}\\right)^${n} = \\dfrac{1}{${d}}$。$1 - \\dfrac{1}{${d}} = \\dfrac{${d - 1}}{${d}}$`,
    };
  },

  /** 反復試行 */
  'repeat-trial': (level) => {
    const coin = Math.random() < 0.5;
    const n = coin ? randInt(3, 5) : randInt(3, 4);
    const k = randInt(1, n - 1);
    const pd = coin ? 2 : 3;
    const num = nCr(n, k) * (pd - 1) ** (n - k);
    const den = pd ** n;
    const what = coin ? 'コインを投げて表が出る' : 'さいころを投げて 3 の倍数の目が出る';
    const p = coin ? '\\dfrac{1}{2}' : '\\dfrac{1}{3}';
    const q = coin ? '\\dfrac{1}{2}' : '\\dfrac{2}{3}';
    return {
      ...base('repeat-trial', level),
      mode: 'number',
      prompt: `${what}ことを ${n} 回くり返すとき、ちょうど ${k} 回${coin ? '表が出る' : '3 の倍数の目が出る'}確率を求めよう。`,
      answer: fracStr(num, den),
      before: '確率：',
      hint: `1 回の確率は $${p}$。どの ${k} 回かの選び方 $${'{}_{' + n + '}\\mathrm{C}_{' + k + '}'}$ をかけ忘れないように。`,
      kaiMistake: `$\\left(${p}\\right)^${k}\\left(${q}\\right)^${n - k}$ だけで、${'$'}{}_{${n}}\\mathrm{C}_{${k}}${'$'} をかけ忘れた！`,
      explain: `$${'{}_{' + n + '}\\mathrm{C}_{' + k + '}'} \\left(${p}\\right)^{${k}} \\left(${q}\\right)^{${n - k}} = ${nCr(n, k)} \\times \\dfrac{${(pd - 1) ** (n - k)}}{${den}} = ${fracTex(num, den)}$`,
    };
  },

  /** 表から条件付き確率 */
  'cond-table': (level) => {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    const c = randInt(2, 12);
    const d = randInt(2, 12);
    const girl = Math.random() < 0.5;
    const [x, y] = girl ? [c, d] : [a, b];
    return {
      ...base('cond-table', level),
      mode: 'number',
      prompt: `あるクラスで、めがねをかけている男子 ${a} 人・かけていない男子 ${b} 人、めがねをかけている女子 ${c} 人・かけていない女子 ${d} 人である。1 人を選んだら${girl ? '女子' : '男子'}だった。その人がめがねをかけている確率を求めよう。`,
      answer: fracStr(x, x + y),
      before: '確率：',
      hint: `「${girl ? '女子' : '男子'}だった」ので、${girl ? '女子' : '男子'} ${x + y} 人だけの世界で考える。`,
      kaiMistake: 'クラス全員を分母にしちゃった！ 条件で世界がせまくなるんだよな…。',
      explain: `$\\dfrac{${x}}{${x + y}}${fracTex(x, x + y) === `\\dfrac{${x}}{${x + y}}` ? '' : ` = ${fracTex(x, x + y)}`}$`,
    };
  },

  /** さいころの賞金の期待値 */
  'expect-dice': (level) => {
    const b = pickOne([30, 60, 90, 120, 150]);
    const c = pickOne([60, 120, 180, 240, 300, 600]);
    const e = (c + 2 * b) / 6;
    return {
      ...base('expect-dice', level),
      mode: 'number',
      prompt: `さいころを 1 回投げて、6 の目なら ${c} 円、4 か 5 の目なら ${b} 円、それ以外は 0 円もらえるゲームがある。もらえる金額の期待値を求めよう。`,
      answer: String(e),
      before: '期待値：',
      after: '円',
      hint: '（金額）×（その確率）をすべてたす。',
      explain: `$${c} \\times \\dfrac{1}{6} + ${b} \\times \\dfrac{2}{6} + 0 \\times \\dfrac{3}{6} = \\dfrac{${c + 2 * b}}{6} = ${e}$ 円。`,
    };
  },
};
