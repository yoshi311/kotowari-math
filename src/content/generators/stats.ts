// データの分析の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { fmt, randInt, signed } from '../../engine/format';
import { binomTail, median, quartiles } from '../../engine/stats';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const statGenerators: Record<string, Gen> = {
  /** 平均値（整数になるように作る） */
  'stat-mean': (level) => {
    for (;;) {
      const m = randInt(5, 15);
      const devs = [randInt(-4, 4), randInt(-4, 4), randInt(-4, 4), randInt(-4, 4)];
      const last = -total(devs);
      if (Math.abs(last) > 6) continue;
      const xs = [...devs, last].map((d) => m + d);
      return {
        ...base('stat-mean', level),
        mode: 'number',
        prompt: `5 人がとったリンゴの数は $${xs.join(',\\ ')}$（個）である。平均値を求めよう。`,
        answer: String(m),
        before: '平均値：',
        after: '個',
        hint: '全部たして、人数の 5 でわる。',
        explain: `$(${xs.join(' + ')}) \\div 5 = ${total(xs)} \\div 5 = ${m}$（個）`,
      };
    }
  },

  /** 中央値（偶数個・奇数個） */
  'stat-median': (level) => {
    const n = Math.random() < 0.5 ? 6 : 7;
    const xs = Array.from({ length: n }, () => randInt(1, 30));
    const s = [...xs].sort((a, b) => a - b);
    const med = median(xs);
    return {
      ...base('stat-median', level),
      mode: 'number',
      prompt: `次の ${n} 個のデータの中央値を求めよう。$${xs.join(',\\ ')}$`,
      answer: String(med),
      before: '中央値：',
      hint: 'まず小さい順にならべかえる。偶数個なら、まん中の 2 つの平均。',
      kaiMistake: 'ならべかえずに、書いてある順のまん中を答えちゃった！',
      explain:
        `小さい順に $${s.join(',\\ ')}$。` +
        (n % 2 ? `まん中（4 番目）の $${med}$。` : `まん中の 2 つ $${s[2]}$ と $${s[3]}$ の平均で $${med}$。`),
    };
  },

  /** 四分位数・四分位範囲 */
  'stat-quartile': (level) => {
    const n = randInt(8, 11);
    const set = new Set<number>();
    while (set.size < n) set.add(randInt(1, 40));
    const s = [...set].sort((a, b) => a - b);
    const q = quartiles(s);
    const ask = (['q1', 'q3', 'iqr'] as const)[randInt(0, 2)];
    const name = ask === 'q1' ? '第 1 四分位数 $Q_1$' : ask === 'q3' ? '第 3 四分位数 $Q_3$' : '四分位範囲';
    const ans = ask === 'q1' ? q.q1 : ask === 'q3' ? q.q3 : q.q3 - q.q1;
    const h = Math.floor(n / 2);
    return {
      ...base('stat-quartile', level),
      mode: 'number',
      prompt: `小さい順にならんだ ${n} 個のデータ $${s.join(',\\ ')}$ の${name}を求めよう。`,
      answer: String(ans),
      before: '答え：',
      hint: `中央値で前半 ${h} 個と後半 ${h} 個に分ける${n % 2 ? '（中央値そのものはどちらにも入れない）' : ''}。前半のまん中が $Q_1$、後半のまん中が $Q_3$。`,
      explain: `前半 $${s.slice(0, h).join(',\\ ')}$ の中央値が $Q_1 = ${q.q1}$、後半 $${s.slice(n - h).join(',\\ ')}$ の中央値が $Q_3 = ${q.q3}$。四分位範囲は $Q_3 - Q_1 = ${q.q3 - q.q1}$。`,
    };
  },

  /** 分散 */
  'stat-variance': (level) => {
    for (;;) {
      const m = randInt(5, 12);
      const d = [randInt(-4, 4), randInt(-4, 4), randInt(-4, 4), randInt(-4, 4)];
      const last = -total(d);
      if (Math.abs(last) > 5) continue;
      const devs = [...d, last];
      const xs = devs.map((v) => m + v);
      const sq = devs.map((v) => v * v);
      const v = total(sq) / 5;
      return {
        ...base('stat-variance', level),
        mode: 'number',
        prompt: `5 個のデータ $${xs.join(',\\ ')}$ の平均値は $${m}$ である。分散を求めよう。`,
        answer: String(v),
        before: '分散：',
        hint: '偏差（データ − 平均）をそれぞれ 2 乗して、その平均を出す。',
        kaiMistake: '偏差をそのまま平均したら 0 になっちゃった！ 2 乗するのを忘れてた…。',
        explain: `偏差は $${devs.join(',\\ ')}$。2 乗すると $${sq.join(',\\ ')}$。平均は $${total(sq)} \\div 5 = ${v}$。`,
      };
    }
  },

  /** 変量の変換 y = ax + b */
  'stat-transform': (level) => {
    const mx = randInt(2, 15);
    const sx = randInt(2, 6);
    const a = randInt(-4, 5, { nonZero: true, exclude: [1] });
    const b = randInt(-20, 20, { nonZero: true });
    const ask = (['mean', 'sd', 'var'] as const)[randInt(0, 2)];
    const ans = ask === 'mean' ? a * mx + b : ask === 'sd' ? Math.abs(a) * sx : a * a * sx * sx;
    const name = ask === 'mean' ? '平均値' : ask === 'sd' ? '標準偏差' : '分散';
    const expl =
      ask === 'mean'
        ? `$\\bar{y} = ${a}\\bar{x} ${signed(b)} = ${a} \\times ${mx} ${signed(b)} = ${ans}$`
        : ask === 'sd'
          ? `$s_y = |${a}| \\times s_x = ${Math.abs(a)} \\times ${sx} = ${ans}$（$b$ をたしても、ちらばりは変わらない）`
          : `$s_y^2 = (${a})^2 \\times s_x^2 = ${a * a} \\times ${sx * sx} = ${ans}$`;
    return {
      ...base('stat-transform', level),
      mode: 'number',
      prompt: `変量 $x$ の平均値が $${mx}$、標準偏差が $${sx}$ である。$y = ${fmt([[a, 'x'], [b, '']])}$ とするとき、$y$ の${name}を求めよう。`,
      answer: String(ans),
      before: `${name}：`,
      hint: '平均値は $a\\bar{x} + b$、標準偏差は $|a|$ 倍、分散は $a^2$ 倍。$b$ はちらばりに関係しない。',
      kaiMistake: ask === 'mean' ? undefined : `ちらばりにも $${signed(b)}$ をたしちゃった！ 全体をずらしても、ちらばりは同じだよな…。`,
      explain: expl,
    };
  },

  /** 相関係数 r = 共分散 ÷ (標準偏差 × 標準偏差) */
  'stat-corr': (level) => {
    const sx = randInt(2, 6);
    const sy = randInt(2, 6);
    const r10 = randInt(-9, 9, { nonZero: true });
    const cov = (r10 * sx * sy) / 10;
    const r = r10 / 10;
    const word = Math.abs(r) >= 0.7 ? '強い' : Math.abs(r) >= 0.4 ? '' : '弱い';
    return {
      ...base('stat-corr', level),
      mode: 'number',
      prompt: `2 つの変量 $x$、$y$ の標準偏差がそれぞれ $${sx}$、$${sy}$、共分散が $${cov}$ である。相関係数 $r$ を求めよう。`,
      answer: String(r),
      before: '$r$ ＝',
      hint: '$r = \\dfrac{\\text{共分散}}{x \\text{ の標準偏差} \\times y \\text{ の標準偏差}}$',
      explain: `$r = \\dfrac{${cov}}{${sx} \\times ${sy}} = \\dfrac{${cov}}{${sx * sy}} = ${r}$。${word}${r > 0 ? '正' : '負'}の相関。`,
    };
  },

  /** 仮説検定（20 人中 k 人、基準 5%） */
  'stat-test': (level): ChoiceQuestion => {
    const k = randInt(12, 17);
    const p = binomTail(20, k);
    const pct = (p * 100).toFixed(1);
    const rare = p <= 0.05;
    return {
      id: 'gen:stat-test',
      level,
      type: 'choice',
      prompt: `20 人に 2 種類のパンを食べくらべてもらったら、${k} 人が新しいパンを選んだ。「どちらを選ぶかは半々」と仮定すると、${k} 人以上が新しいパンを選ぶ確率は約 ${pct}% である。基準を 5% とすると、どう判断する？`,
      choices: ['「新しいパンの方が好まれる」と判断できる', '「新しいパンの方が好まれる」とはいえない'],
      answer: rare ? 0 : 1,
      hint: '確率が 5% 以下なら「偶然とは考えにくい」、5% より大きければ「偶然でも起こりうる」。',
      explain: rare
        ? `約 ${pct}% は 5% 以下。「半々」という仮定のもとでは めったに起きないことが起きたので、仮定がまちがっていると考え、新しいパンの方が好まれると判断する。`
        : `約 ${pct}% は 5% より大きい。偶然でも起こりうるので、「好まれる」とはいえない（「好まれない」と決まったわけでもない）。`,
    };
  },
};
