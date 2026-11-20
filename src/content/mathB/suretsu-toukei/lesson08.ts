import type { Lesson } from '../../types';

export const b08: Lesson = {
  id: 'mb-08',
  no: 8,
  title: '正規分布',
  subtitle: 'つりがねの形と標準化',
  quest: '星の明るさのばらつき',
  card: {
    id: 'card-mb-08',
    name: 'つりがねの星雲',
    term: '正規分布',
    rarity: 3,
    tool: '平均 m・標準偏差 σ の正規分布を Z = (X − m)/σ で標準化し、正規分布表で確率を求める道具',
    formula: 'X \\sim N(m,\\ \\sigma^2) \\Rightarrow Z = \\dfrac{X - m}{\\sigma} \\sim N(0,\\ 1)',
    uses: ['テストの偏差値', '身長・体重など自然のデータの分析', '工場の品質管理（規格外の割合）'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：明るさのばらつき',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: '同じ星を何度も測ると、明るさの測定値が少しずつばらつくの。グラフにすると、つりがねの形になるわ。' },
        { who: 'kai', mood: 'normal', text: '二項分布の山も、n を大きくしたらこの形だったな。' },
        { who: 'michiru', mood: 'happy', text: 'これが「正規分布」。平均と標準偏差がわかれば、どの範囲に入る確率もわかるの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：曲線の下の面積',
      lines: [{ who: 'michiru', text: 'z を動かして、ぬられた部分の面積（確率）を見てね。下の金色の目もりは、平均 50・標準偏差 10 のときの X の値よ。' }],
      figure: { type: 'normal' },
      prompts: ['z = 1 のとき、0〜z の確率は？ 表の値 0.3413 と同じ？', '「−z 〜 z」にして z = 1.96 にすると、確率はいくつ？'],
      check: {
        id: 'mb-08-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: 'Z が標準正規分布にしたがうとき、$P(-1.96 \\le Z \\le 1.96)$ はおよそいくつ？',
        choices: ['$0.95$', '$0.475$', '$0.68$', '$0.99$'],
        answer: 0,
        explain: '$P(0 \\le Z \\le 1.96) = 0.475$ で、左右対称なので 2 倍して 0.95。この「1.96 で 95%」は、推定と検定で何度も使う。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'どんな正規分布も、標準化すれば同じ 1 つの曲線になるんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：正規分布と標準化',
      tool: '平均 m・標準偏差 σ の正規分布を Z = (X − m)/σ で標準化し、正規分布表で確率を求める道具',
      formulas: ['X \\sim N(m,\\ \\sigma^2) \\Rightarrow Z = \\dfrac{X - m}{\\sigma} \\sim N(0,\\ 1)', 'P(a \\le X \\le b) = \\text{曲線と横軸のあいだの面積}', 'X \\sim B(n,\\ p),\\ n \\text{ が大きい} \\Rightarrow X \\text{ はおよそ } N\\big(np,\\ np(1 - p)\\big)'],
      analogy: {
        title: 'たとえるなら「ものさしをそろえる」',
        text: '国語は平均 60 点、数学は平均 50 点…とものさしがちがうテストも、「平均から標準偏差いくつ分はなれているか（z）」にそろえれば、くらべられる。偏差値も同じ考え方。',
      },
      points: [
        '正規分布の曲線は、平均 m を中心に左右対称。曲線の下の面積の合計は 1、半分ずつ 0.5。',
        '**手順**：① $Z = \\dfrac{X - m}{\\sigma}$ で標準化 ② 図をかいて求める部分を確かめる ③ 正規分布表の値を足したり 0.5 から引いたりする。',
        'よく使う値：$P(0 \\le Z \\le 1) = 0.3413$、$P(0 \\le Z \\le 2) = 0.4772$、$P(0 \\le Z \\le 1.96) = 0.475$。',
        '二項分布 $B(n,\\ p)$ は、n が大きいと平均 np、分散 np(1 − p) の正規分布で近似できる。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '📝', title: '偏差値', text: '偏差値は「50 + 10 × z」。平均ぴったりなら 50、標準偏差 1 つ分上なら 60。' },
        { icon: '📏', title: '身長の分布', text: '同じ年れいの身長はほぼ正規分布。服のサイズをどれだけ作るか決めるのに使われる。' },
        { icon: '🔩', title: '品質管理', text: '部品の長さが正規分布にしたがうとして、規格から外れる割合を計算し、不良品を減らす。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'normal-prob', level: 'calc' },
        {
          id: 'mb-08-q1',
          type: 'choice',
          level: 'calc',
          prompt: 'あるテストの点数 X は正規分布 $N(60,\\ 10^2)$ にしたがうとする。80 点以上の人の割合は？ ただし $P(0 \\le Z \\le 2) = 0.4772$ とする。',
          choices: ['$0.0228$', '$0.4772$', '$0.9772$', '$0.1587$'],
          answer: 0,
          hint: '$Z = \\dfrac{80 - 60}{10} = 2$。求めるのは $P(Z \\ge 2)$。',
          explain: '$P(Z \\ge 2) = 0.5 - 0.4772 = 0.0228$。およそ 2.3% の人が 80 点以上。',
        },
        { type: 'gen', gen: 'binom-ev', level: 'calc' },
        {
          id: 'mb-08-q2',
          type: 'mark',
          level: 'exam',
          prompt: 'コインを 400 回投げて表が出る回数を X とする。X は近似的に正規分布 N(［アイウ］, ［エオ］$^2$) にしたがう。$P(0 \\le Z \\le 2) = 0.4772$ を用いると、表が 220 回以上出る確率は 0.［カキクケ］ である。',
          answers: { ア: '2', イ: '0', ウ: '0', エ: '1', オ: '0', カ: '0', キ: '2', ク: '2', ケ: '8' },
          hint: '平均 $400 \\times \\dfrac{1}{2}$、分散 $400 \\times \\dfrac{1}{2} \\times \\dfrac{1}{2} = 100$。',
          explain: '平均 200、標準偏差 $\\sqrt{100} = 10$ なので N(200, $10^2$)。$Z = \\dfrac{220 - 200}{10} = 2$ より、確率は $0.5 - 0.4772 = 0.0228$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: '測定値のばらつきが、全部 1 つの曲線で説明できるなんて…！' },
        { who: 'michiru', mood: 'normal', text: 'いよいよ最後の理術。一部のデータ（標本）から、全体（母集団）を推しはかる「推定」と「検定」よ。' },
      ],
    },
  ],
};
