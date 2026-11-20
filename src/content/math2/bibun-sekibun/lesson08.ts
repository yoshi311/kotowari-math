import type { Lesson } from '../../types';

export const d08: Lesson = {
  id: 'm2d-08',
  no: 8,
  title: '定積分',
  subtitle: '細い長方形を積み重ねる',
  quest: '砂時計にたまる砂',
  card: {
    id: 'card-m2d-08',
    name: '積み重ねの砂',
    term: '定積分',
    rarity: 3,
    tool: '原始関数の差 F(b) − F(a) で、細かく分けて足し合わせた量（面積など）を求める道具',
    formula: '\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a)',
    uses: ['速さのグラフから進んだ距離を求める', '電気の使用量（電力 × 時間）の計算', '不規則な形の面積や体積'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：曲がったふちの面積',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'think', text: '8 階の大砂時計は、ふちが $y = x^2$ の曲線の形をしています。たまる砂の量を知るには、曲線の下の面積が必要です。' },
        { who: 'kai', mood: 'normal', text: '長方形や三角形なら楽勝なんだけどな。ふちが曲がっていると、公式がないぞ。' },
        { who: 'michiru', mood: 'happy', text: '細い長方形に切って、たくさん足せばいいの。細くすればするほど、ぴったりの面積に近づくわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：長方形をふやすと',
      lines: [{ who: 'michiru', text: '長方形の数をふやして、合計が下の式の値に近づくか見てね。' }],
      figure: { type: 'riemann' },
      prompts: ['b = 2 で長方形を 1 本、4 本、40 本にすると、合計はどう変わる？', '近づいていく先は、$\\dfrac{b^3}{3}$ になっている？'],
      check: {
        id: 'm2d-08-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\displaystyle\\int_0^3 x^2\\,dx$ の値は？',
        choices: ['$9$', '$3$', '$27$', '$6$'],
        answer: 0,
        explain: '$x^2$ の原始関数は $\\dfrac{x^3}{3}$。$\\Big[\\dfrac{x^3}{3}\\Big]_0^3 = \\dfrac{27}{3} - 0 = 9$。曲線 $y = x^2$ と x 軸、直線 x = 3 で囲まれた面積が 9。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '面積が、微分の逆（原始関数）の差で求まった！ 微分と積分はつながっているんだね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：定積分',
      tool: '原始関数の差 F(b) − F(a) で、細かく分けて足し合わせた量（面積など）を求める道具',
      formulas: ['\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a)', '\\int_a^a f(x)\\,dx = 0,\\quad \\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx', '\\dfrac{d}{dx}\\int_a^x f(t)\\,dt = f(x)'],
      analogy: {
        title: 'たとえるなら「毎日の貯金の合計」',
        text: '毎日の貯金額（f(x)）を細かく足し合わせると、たまった合計になる。合計は「最後の日の残高 − 最初の日の残高」でも求められる。この 2 つが等しいのが定積分のしくみ。',
      },
      points: [
        '**計算の手順**：原始関数 F(x) を求め（C は書かなくてよい）、$F(b) - F(a)$ を計算する。',
        '$f(x) \\ge 0$ の区間では、定積分は**グラフと x 軸のあいだの面積**。x 軸より下の部分はマイナスとして数えられる。',
        '$\\displaystyle\\int_{-a}^{a} x\\,dx = 0$、$\\displaystyle\\int_{-a}^{a} x^3\\,dx = 0$（左右で打ち消しあう）。',
        '**微分と積分の関係**：$\\displaystyle\\int_a^x f(t)\\,dt$ を x で微分すると $f(x)$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🚗', title: '速さから距離へ', text: '速さのグラフの下の面積が、進んだ距離。カーナビは速さを積み重ねて位置を計算している。' },
        { icon: '⚡', title: '電気の使用量', text: '電力（W）は時間とともに変わる。電力のグラフの下の面積が、使った電気の量（Wh）で、電気料金の計算に使う。' },
        { icon: '🏞️', title: '池の面積', text: '池のはばを一定の間かくで測って足し合わせると、曲がった形の池の面積がわかる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'def-integral', level: 'calc' },
        {
          id: 'm2d-08-q1',
          type: 'choice',
          level: 'meaning',
          prompt: '$\\dfrac{d}{dx}\\displaystyle\\int_1^x (t^2 - 2t)\\,dt$ を計算すると？',
          choices: ['$x^2 - 2x$', '$2x - 2$', '$\\dfrac{x^3}{3} - x^2$', '$x^2 - 2x + 1$'],
          answer: 0,
          hint: '$\\displaystyle\\int_a^x f(t)\\,dt$ を x で微分すると $f(x)$。',
          explain: '積分してから微分すると元にもどるので、t を x にかえた $x^2 - 2x$。下の端 1 は定数なので、微分すると消える。',
        },
        { type: 'gen', gen: 'indefinite', level: 'calc' },
        {
          id: 'm2d-08-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$\\displaystyle\\int_{-1}^{2} (x^2 - 2x)\\,dx$ = ［ア］ である。また、等式 $\\displaystyle\\int_0^x f(t)\\,dt = x^2 - 3x$ をみたす関数は、$f(x)$ = ［イ］x − ［ウ］ である。',
          answers: { ア: '0', イ: '2', ウ: '3' },
          hint: '前半は $\\Big[\\dfrac{x^3}{3} - x^2\\Big]_{-1}^{2}$。後半は両辺を x で微分する。',
          explain: '$\\Big(\\dfrac{8}{3} - 4\\Big) - \\Big(-\\dfrac{1}{3} - 1\\Big) = -\\dfrac{4}{3} + \\dfrac{4}{3} = 0$（x 軸の上と下の部分が打ち消しあう）。後半は両辺を微分して $f(x) = 2x - 3$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: '砂の量が計算どおりにたまりました！ 大砂時計が、ふたたび時を刻みはじめます。' },
        { who: 'michiru', mood: 'normal', text: '定積分で面積が求められたわね。次は、2 つの曲線にはさまれた面積に挑戦よ。' },
      ],
    },
  ],
};
