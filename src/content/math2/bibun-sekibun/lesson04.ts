import type { Lesson } from '../../types';

export const d04: Lesson = {
  id: 'm2d-04',
  no: 4,
  title: '接線の方程式',
  subtitle: '曲線に一瞬だけふれる直線',
  quest: '振り子の飛びだす向き',
  card: {
    id: 'card-m2d-04',
    name: '接点の針',
    term: '接線の方程式',
    rarity: 2,
    tool: '接点 (a, f(a)) と傾き f′(a) から、曲線にふれる直線（接線）の式を作る道具',
    formula: "y - f(a) = f'(a)(x - a)",
    uses: ['ハンマー投げで手をはなした瞬間の飛ぶ向き', '道路やレールのカーブのつなぎ目の設計', '方程式の近似解を求める計算（ニュートン法）'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：はなした瞬間の向き',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'think', text: '4 階の振り子は、糸が切れると曲線の道から飛びだします。どの向きにまっすぐ飛ぶのか、それがわからないと受けとめられません。' },
        { who: 'kai', mood: 'normal', text: 'はなした瞬間の進む向き…つまり、その点の傾きだな！' },
        { who: 'michiru', mood: 'happy', text: 'そう。傾きと通る点がわかれば、直線の式が作れるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：接線の式',
      lines: [{ who: 'michiru', text: '接点の x 座標 a を動かして、接線の式がどう変わるか見てね。' }],
      figure: { type: 'tangentLine' },
      prompts: ['曲線 $y = x^2 - 2x$ で、a = 1 のとき接線はどうなる？', 'a = 2 のとき、接線の傾きと式は？'],
      check: {
        id: 'm2d-04-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '曲線 $y = x^2 - 2x$ 上の点 $(2,\\ 0)$ における接線の傾きは？',
        choices: ['$2$', '$0$', '$4$', '$-2$'],
        answer: 0,
        explain: '$y\' = 2x - 2$ に x = 2 を代入して、傾きは 2。接線は $y - 0 = 2(x - 2)$ より $y = 2x - 4$。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '傾きは微分して代入、あとは点を通る直線の式！ 中学で習った直線の式が使えるね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：接線の方程式',
      tool: '接点 (a, f(a)) と傾き f′(a) から、曲線にふれる直線（接線）の式を作る道具',
      formulas: ["y - f(a) = f'(a)(x - a)", "\\text{接点が分からないとき：接点を } (t,\\ f(t)) \\text{ とおく}"],
      analogy: {
        title: 'たとえるなら「カーブで手をはなしたボール」',
        text: '回しているボールから手をはなすと、ボールはその瞬間に進んでいた向きへまっすぐ飛んでいく。その飛ぶ道が接線。',
      },
      points: [
        '**手順**：① $f\'(x)$ を求める ② 傾き $m = f\'(a)$ ③ $y - f(a) = m(x - a)$ を整理。',
        '**曲線の外の点から引く接線**：接点を $(t,\\ f(t))$ とおいて接線の式を作り、それが外の点を通る条件から t を求める。',
        '例：点 $(0,\\ -1)$ から $y = x^2$ に引く接線。接線 $y = 2tx - t^2$ が $(0,\\ -1)$ を通るので $t^2 = 1$、$t = \\pm 1$。',
        '接点の y 座標は $f(a)$。代入しわすれに注意。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🔨', title: 'ハンマー投げ', text: '回転の円の接線の向きにハンマーが飛ぶ。どこで手をはなすかで、飛ぶ方向が決まる。' },
        { icon: '🚄', title: 'レールのカーブ', text: '直線とカーブのつなぎ目では、傾きがそろう（接する）ように設計して、ゆれを小さくしている。' },
        { icon: '🧮', title: 'ニュートン法', text: '接線と x 軸の交点をくり返し求めて、方程式の解にどんどん近づける計算方法。電卓やコンピュータの中で使われている。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'tangent', level: 'calc' },
        {
          id: 'm2d-04-q1',
          type: 'choice',
          level: 'calc',
          prompt: '点 $(0,\\ -1)$ から放物線 $y = x^2$ に引いた接線の方程式は？',
          choices: ['$y = 2x - 1,\\ y = -2x - 1$', '$y = 2x + 1,\\ y = -2x + 1$', '$y = x - 1,\\ y = -x - 1$', '$y = 2x - 1$ のみ'],
          answer: 0,
          hint: '接点を $(t,\\ t^2)$ とおくと、接線は $y = 2tx - t^2$。',
          explain: '接線 $y = 2tx - t^2$ が点 $(0,\\ -1)$ を通るので $-1 = -t^2$、$t = \\pm 1$。$t = 1$ のとき $y = 2x - 1$、$t = -1$ のとき $y = -2x - 1$。',
        },
        { type: 'gen', gen: 'deriv-at', level: 'calc' },
        {
          id: 'm2d-04-q2',
          type: 'mark',
          level: 'exam',
          prompt: '曲線 $y = x^3 - 3x$ 上の点 $(2,\\ 2)$ における接線の方程式は、y = ［ア］x − ［イウ］ である。',
          answers: { ア: '9', イ: '1', ウ: '6' },
          hint: "$y' = 3x^2 - 3$ に x = 2 を代入して傾きを求める。",
          explain: "$y' = 3x^2 - 3$ より、傾きは $3 \\times 4 - 3 = 9$。$y - 2 = 9(x - 2)$ を整理して $y = 9x - 16$。",
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: '飛びだす向きがぴたりとわかりました！ 振り子を受けとめる網が張れます。' },
        { who: 'michiru', mood: 'normal', text: '傾きがプラスなら上り坂、マイナスなら下り坂。次は、それを使ってグラフの山と谷を見つけましょう。' },
      ],
    },
  ],
};
