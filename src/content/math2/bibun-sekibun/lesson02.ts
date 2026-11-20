import type { Lesson } from '../../types';

export const d02: Lesson = {
  id: 'm2d-02',
  no: 2,
  title: '微分係数と導関数',
  subtitle: 'どの点の傾きも返す関数',
  quest: '傾きを映す鏡',
  card: {
    id: 'card-m2d-02',
    name: '傾き写しの鏡',
    term: '導関数',
    rarity: 2,
    tool: '各点の接線の傾きを、x の式（導関数）としてまとめて表す道具',
    formula: "f'(x) = \\lim_{h \\to 0} \\dfrac{f(x + h) - f(x)}{h}",
    uses: ['位置の式から速さの式を作る', 'グラフの山と谷の場所を探す', 'コンピュータで最適な答えを探す計算（機械学習）'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：すべての点の傾き',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'think', text: '2 階の鏡は、曲線の「傾き」を映す鏡です。ただ、点を 1 つずつ計算していたら、日が暮れてしまう…。' },
        { who: 'kai', mood: 'normal', text: '点ごとに h → 0 をやるのは大変だな。まとめて求める方法はないのか？' },
        { who: 'michiru', mood: 'happy', text: 'a のかわりに x のまま計算すれば、どの点の傾きも 1 つの式で表せるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：傾きのグラフ',
      lines: [{ who: 'michiru', text: '点を動かすと、その点の接線の傾きが下のグラフにかかれていくわ。$x^3 - 3x$ で試してね。' }],
      figure: { type: 'derivGraph' },
      prompts: ['接線が水平（傾き 0）になるのは、x がいくつのとき？', '下のグラフ（傾き）がマイナスになるのは、上の曲線がどうなっているとき？'],
      check: {
        id: 'm2d-02-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '曲線 $y = x^3 - 3x$ で、接線が水平になる x の値は？',
        choices: ['$x = -1,\\ 1$', '$x = 0$', '$x = -\\sqrt{3},\\ \\sqrt{3}$', '$x = -3,\\ 3$'],
        answer: 0,
        explain: '傾きのグラフ $y\' = 3x^2 - 3$ が 0 になるのは $x = \\pm 1$。曲線の山の頂上と谷の底で、接線が水平になる。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '傾きを集めたら、新しい関数ができた！ 上の曲線が下り坂のところでは、傾きはマイナスだね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：導関数',
      tool: '各点の接線の傾きを、x の式（導関数）としてまとめて表す道具',
      formulas: ["f'(x) = \\lim_{h \\to 0} \\dfrac{f(x + h) - f(x)}{h}", "(x^2)' = 2x,\\quad (x)' = 1,\\quad (c)' = 0\\ (c \\text{ は定数})", "f'(a) = \\text{導関数 } f'(x) \\text{ に } x = a \\text{ を代入した値}"],
      analogy: {
        title: 'たとえるなら「坂の傾きの案内板」',
        text: '山道の地図に、どの地点でも「ここの坂の傾きは○○」と書いた案内板があれば便利。導関数は、x を入れるとその地点の傾きを教えてくれる案内板。',
      },
      points: [
        '導関数を求めることを「**微分する**」という。記号は $f\'(x)$、$y\'$、$\\dfrac{dy}{dx}$ など。',
        '$f(x) = x^2$ なら $\\dfrac{(x + h)^2 - x^2}{h} = 2x + h \\to 2x$。だから $(x^2)\' = 2x$。',
        '定数 c は変化しないので、傾きはいつも 0。$(c)\' = 0$。',
        '微分係数 $f\'(a)$ は、導関数を先に求めてから $x = a$ を代入すると楽。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏎️', title: '位置から速さへ', text: '時刻 t の位置を表す式を微分すると、どの時刻の速さもわかる式になる。速さをさらに微分すると加速度。' },
        { icon: '⛰️', title: '山と谷を探す', text: '導関数が 0 になる場所は、グラフの山の頂上や谷の底の候補。利益が最大になる値段などを探せる。' },
        { icon: '🤖', title: '機械学習', text: 'AI は「まちがいの大きさ」の傾きを計算し、下り坂の方向へ少しずつ進んで、答えを良くしていく。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'deriv-def', level: 'calc' },
        {
          id: 'm2d-02-q1',
          type: 'choice',
          level: 'meaning',
          prompt: '$f(x) = x^2$ のとき、$\\displaystyle\\lim_{h \\to 0} \\dfrac{(x + h)^2 - x^2}{h}$ を計算すると？',
          choices: ['$2x$', '$x^2$', '$2x + h$', '$2$'],
          answer: 0,
          hint: '分子を展開すると $2xh + h^2$。h でわってから h → 0。',
          explain: '$\\dfrac{2xh + h^2}{h} = 2x + h$。h を 0 に近づけると $2x$。h が残っている $2x + h$ はまだ途中。',
        },
        { type: 'gen', gen: 'avg-rate', level: 'calc' },
        {
          id: 'm2d-02-q2',
          type: 'mark',
          level: 'exam',
          prompt: '関数 $f(x) = 2x^2 - x$ の導関数を定義にしたがって求める。$f(x + h) - f(x)$ = ［ア］xh + ［イ］$h^2 - h$ なので、$f\'(x)$ = ［ウ］x − ［エ］ である。',
          answers: { ア: '4', イ: '2', ウ: '4', エ: '1' },
          hint: '$2(x + h)^2 - (x + h) - (2x^2 - x)$ を展開する。',
          explain: '$2(x^2 + 2xh + h^2) - x - h - 2x^2 + x = 4xh + 2h^2 - h$。h でわると $4x + 2h - 1$、h → 0 で $f\'(x) = 4x - 1$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: '鏡に、すべての点の傾きが映りました！ 2 階の時計も動きだしましたよ。' },
        { who: 'michiru', mood: 'normal', text: '毎回 h → 0 をするのは大変ね。次は、定義を使わずにすばやく微分する公式を手に入れましょう。' },
      ],
    },
  ],
};
