import type { Lesson } from '../../types';

export const b07: Lesson = {
  id: 'mb-07',
  no: 7,
  title: '二項分布',
  subtitle: 'くり返しの成功回数',
  quest: '100 回の観測',
  card: {
    id: 'card-mb-07',
    name: 'くり返しの望遠鏡',
    term: '二項分布',
    rarity: 3,
    tool: '成功する確率 p の試行を n 回くり返したときの成功回数の分布と、その期待値 np・分散 np(1 − p) を使う道具',
    formula: 'P(X = k) = {}_n\\mathrm{C}_k\\,p^k(1 - p)^{n-k},\\quad E(X) = np,\\quad V(X) = np(1 - p)',
    uses: ['工場の不良品の数の予測', '選挙の当選確実の判断', 'フリースローの成功回数の見こみ'],
    color: '#06d6a0',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：晴れる夜の数',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: '1 晩に星が観測できる確率は $\\dfrac{1}{5}$。100 晩観測すると、何晩くらい星が見えるかしら。' },
        { who: 'kai', mood: 'normal', text: '100 × 1/5 で 20 晩だろ。でも、ぴったり 20 になるとはかぎらないよな。' },
        { who: 'michiru', mood: 'happy', text: 'そう、成功の回数にはちらばりがあるの。その分布の形を「二項分布」というわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：成功回数の山',
      lines: [{ who: 'michiru', text: '回数 n と確率 p を動かしてみて。山の中心と広がりがどう変わるか見てね。「正規分布の曲線」を重ねてもいいわ。' }],
      figure: { type: 'binomDist' },
      prompts: ['n = 10、p = 0.5 のとき、いちばん起こりやすい回数は？', 'n を 40 まで大きくすると、山の形は何に近づく？'],
      check: {
        id: 'mb-07-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: 'さいころを 60 回投げて、1 の目が出る回数を X とする。X の期待値は？',
        choices: ['$10$', '$6$', '$60$', '$\\dfrac{1}{6}$'],
        answer: 0,
        explain: 'X は二項分布 $B\\left(60,\\ \\dfrac{1}{6}\\right)$ にしたがうので、$E(X) = 60 \\times \\dfrac{1}{6} = 10$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'n を大きくすると、山がつりがねの形になった！ 次の依頼につながりそうだね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：二項分布',
      tool: '成功する確率 p の試行を n 回くり返したときの成功回数の分布と、その期待値 np・分散 np(1 − p) を使う道具',
      formulas: ['P(X = k) = {}_n\\mathrm{C}_k\\,p^k(1 - p)^{n-k}\\quad(k = 0, 1, \\cdots, n)', 'X \\sim B(n,\\ p):\\quad E(X) = np,\\quad V(X) = np(1 - p),\\quad \\sigma(X) = \\sqrt{np(1 - p)}'],
      analogy: {
        title: 'たとえるなら「フリースローの成功回数」',
        text: '成功率 70% の選手が 10 本打つと、平均 7 本入るけれど、6 本や 8 本の日もある。その「何本入るかの分布」が二項分布。',
      },
      points: [
        '**反復試行**：同じ試行を独立に n 回くり返す。成功が k 回になる確率は ${}_n\\mathrm{C}_k p^k (1 - p)^{n-k}$（数学 A で学んだ形）。',
        'その成功回数 X の分布を二項分布 $B(n,\\ p)$ という。',
        '期待値は np、分散は np(1 − p)。標準偏差を求めるときは、分散の√をとる。',
        '逆に、E(X) と V(X) から n と p を求める問題もよく出る：$\\dfrac{V}{E} = 1 - p$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏭', title: '不良品の数', text: '不良品が出る確率 1% の工場で 1000 個作ると、不良品は平均 10 個。この分布から、検査の基準を決める。' },
        { icon: '🗳️', title: '選挙の速報', text: '出口調査の結果が二項分布にしたがうと考えて、「当選確実」を判断している。' },
        { icon: '🏀', title: 'スポーツの見こみ', text: '成功率から、試合での成功回数の平均とちらばりを予測し、作戦に生かす。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'binom-ev', level: 'calc' },
        {
          id: 'mb-07-q1',
          type: 'choice',
          level: 'calc',
          prompt: 'コインを 4 回投げて、表がちょうど 2 回出る確率は？',
          choices: ['$\\dfrac{3}{8}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{4}$', '$\\dfrac{1}{16}$'],
          answer: 0,
          hint: '${}_4\\mathrm{C}_2 \\left(\\dfrac{1}{2}\\right)^2 \\left(\\dfrac{1}{2}\\right)^2$',
          explain: '表が出る 2 回の選び方が ${}_4\\mathrm{C}_2 = 6$ 通り。$6 \\times \\dfrac{1}{16} = \\dfrac{3}{8}$。',
        },
        { type: 'gen', gen: 'rv-mean', level: 'calc' },
        {
          id: 'mb-07-q2',
          type: 'mark',
          level: 'exam',
          prompt: '確率変数 X が二項分布 $B\\left(100,\\ \\dfrac{1}{5}\\right)$ にしたがうとき、X の期待値は ［アイ］、分散は ［ウエ］、標準偏差は ［オ］ である。',
          answers: { ア: '2', イ: '0', ウ: '1', エ: '6', オ: '4' },
          hint: '$E = np$、$V = np(1 - p)$、$\\sigma = \\sqrt{V}$',
          explain: '$E(X) = 100 \\times \\dfrac{1}{5} = 20$、$V(X) = 100 \\times \\dfrac{1}{5} \\times \\dfrac{4}{5} = 16$、$\\sigma(X) = \\sqrt{16} = 4$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: '100 晩のうち、だいたい 20 晩前後、16 から 24 晩くらいが多いのね。観測の計画が立てられるわ。' },
        { who: 'michiru', mood: 'normal', text: 'n を大きくしたときに現れた、つりがねの形。それが統計でいちばん大切な「正規分布」よ。' },
      ],
    },
  ],
};
