import type { Lesson } from '../../types';

export const b06: Lesson = {
  id: 'mb-06',
  no: 6,
  title: '確率変数と期待値・分散',
  subtitle: '平均するとどのくらい？',
  quest: '流れ星のくじ',
  card: {
    id: 'card-mb-06',
    name: 'つりあいの天秤',
    term: '期待値・分散',
    rarity: 2,
    tool: '確率で重みをつけた平均（期待値）とちらばり（分散・標準偏差）で、不確かなものの「ふつう」と「ゆれ」を表す道具',
    formula: 'E(X) = \\sum x_k p_k,\\quad V(X) = E(X^2) - \\{E(X)\\}^2,\\quad E(aX + b) = aE(X) + b',
    uses: ['保険料や宝くじの損得の計算', 'ゲームのガチャの平均の出方', '投資のリスク（ゆれの大きさ）'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：流れ星のくじ',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: '観測室では、流れ星の数で賞品が決まるくじをしているの。1 回ひくと、平均でどのくらいもらえるのかしら。' },
        { who: 'kai', mood: 'normal', text: '0、10、50 の賞金の平均なら、(0 + 10 + 50) ÷ 3 = 20 だろ？' },
        { who: 'michiru', mood: 'think', text: 'でも 50 が出るのはめったにないの。出やすさ（確率）で重みをつけた平均を考えましょう。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：つりあう点',
      lines: [{ who: 'michiru', text: '棒の高さが確率よ。金の三角（期待値）は、棒グラフがつりあう点。a 倍したり b ずらしたりもしてみてね。' }],
      figure: { type: 'randVar' },
      prompts: ['くじの期待値は、カイの言った 20 より大きい？ 小さい？', 'b を動かすと、期待値とちらばり（± 標準偏差）はそれぞれどうなる？'],
      check: {
        id: 'mb-06-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: 'コインを 2 枚投げて表が出る枚数を X とする。X の期待値 $E(X)$ は？',
        choices: ['$1$', '$\\dfrac{1}{2}$', '$2$', '$\\dfrac{3}{2}$'],
        answer: 0,
        explain: 'X = 0、1、2 の確率は $\\dfrac{1}{4}$、$\\dfrac{1}{2}$、$\\dfrac{1}{4}$。$E(X) = 0 \\cdot \\dfrac{1}{4} + 1 \\cdot \\dfrac{1}{2} + 2 \\cdot \\dfrac{1}{4} = 1$。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '期待値は「値 × 確率」を全部足したもの。くじの期待値は 8 で、20 よりずっと小さいね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：確率変数・期待値・分散',
      tool: '確率で重みをつけた平均（期待値）とちらばり（分散・標準偏差）で、不確かなものの「ふつう」と「ゆれ」を表す道具',
      formulas: ['E(X) = x_1p_1 + x_2p_2 + \\cdots + x_np_n', 'V(X) = E\\big((X - m)^2\\big) = E(X^2) - \\{E(X)\\}^2,\\quad \\sigma(X) = \\sqrt{V(X)}', 'E(aX + b) = aE(X) + b,\\quad V(aX + b) = a^2V(X),\\quad \\sigma(aX + b) = |a|\\sigma(X)'],
      analogy: {
        title: 'たとえるなら「シーソーのつりあう点」',
        text: '確率の重さの棒をシーソーにのせると、つりあう場所が期待値。重い（出やすい）値のほうへ、つりあいの点が引きよせられる。',
      },
      points: [
        'とる値に確率が決まっている変数を**確率変数**、値と確率の表を**確率分布**という。確率の合計は 1。',
        '分散は「平均からのずれの 2 乗」の期待値。計算は $E(X^2) - \\{E(X)\\}^2$ が楽。',
        '全体を b ずらしても、ちらばりは変わらない。a 倍すると、分散は $a^2$ 倍、標準偏差は |a| 倍。',
        'X、Y が独立なら $E(X + Y) = E(X) + E(Y)$、$V(X + Y) = V(X) + V(Y)$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🎫', title: '宝くじの損得', text: '宝くじの賞金の期待値は、1 枚の値段の半分ほど。平均すると損になることが計算でわかる。' },
        { icon: '🛡️', title: '保険料', text: '事故が起きる確率と支払う金額から期待値を計算し、それをもとに保険料を決めている。' },
        { icon: '📉', title: '投資のリスク', text: 'もうけの期待値が同じでも、標準偏差が大きいほど「ゆれ（リスク）」が大きい投資になる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'rv-mean', level: 'calc' },
        {
          id: 'mb-06-q1',
          type: 'choice',
          level: 'calc',
          prompt: 'さいころを 1 回投げて出る目を X とする。X の期待値 $E(X)$ は？',
          choices: ['$\\dfrac{7}{2}$', '$3$', '$21$', '$6$'],
          answer: 0,
          hint: 'どの目も確率 $\\dfrac{1}{6}$。',
          explain: '$(1 + 2 + 3 + 4 + 5 + 6) \\times \\dfrac{1}{6} = \\dfrac{21}{6} = \\dfrac{7}{2}$。期待値は、実際には出ない値（3.5）になることもある。',
        },
        {
          id: 'mb-06-q2',
          type: 'mark',
          level: 'exam',
          prompt: '確率変数 X のとり得る値が 0、1、2 で、その確率がそれぞれ $\\dfrac{1}{5}$、$\\dfrac{2}{5}$、$\\dfrac{2}{5}$ である。$E(X) = \\dfrac{p}{q}$（既約分数）と表すと p = ［ア］、q = ［イ］ であり、$V(X) = \\dfrac{r}{s}$（既約分数）と表すと r = ［ウエ］、s = ［オカ］ である。',
          answers: { ア: '6', イ: '5', ウ: '1', エ: '4', オ: '2', カ: '5' },
          hint: '$E(X^2) = 0^2 \\cdot \\dfrac{1}{5} + 1^2 \\cdot \\dfrac{2}{5} + 2^2 \\cdot \\dfrac{2}{5}$',
          explain: '$E(X) = \\dfrac{2}{5} + \\dfrac{4}{5} = \\dfrac{6}{5}$。$E(X^2) = \\dfrac{2}{5} + \\dfrac{8}{5} = 2$。$V(X) = 2 - \\dfrac{36}{25} = \\dfrac{14}{25}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: '流れ星のくじの期待値は 8…。これで、くじの値段を正しく決められるわ。' },
        { who: 'michiru', mood: 'normal', text: '次は、同じことを何回もくり返したときの「成功の回数」。そこには、決まった形の分布があるの。' },
      ],
    },
  ],
};
