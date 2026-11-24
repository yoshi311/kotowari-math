import type { Lesson } from '../../types';

export const c02: Lesson = {
  id: 'mc-02',
  no: 2,
  title: 'ベクトルの内積',
  subtitle: 'かげの長さのかけ算',
  quest: '引き綱の仕事',
  card: {
    id: 'card-mc-02',
    name: '光とかげの天秤',
    term: '内積',
    rarity: 3,
    tool: '2 つのベクトルの「向きのそろい具合」を数にし、なす角や垂直を調べる道具',
    formula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_1b_1 + a_2b_2',
    uses: ['物理の「仕事」（力 × 動いた距離 × cos θ）', '3D ゲームの光の当たり方', '文章や画像の似ている度合いの計算（AI）'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：ななめに引く綱',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '城へのゴンドラは、綱で引いて進めるの。でも綱をななめに引くと、力がむだになるみたい。' },
        { who: 'kai', mood: 'normal', text: '進む向きにまっすぐ引けば、力はぜんぶ使えるよな。ななめだと、どのくらい効くんだ？' },
        { who: 'michiru', mood: 'happy', text: '進む向きへの「かげ」の長さで考えるの。それが内積という計算よ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：かげの長さ',
      lines: [{ who: 'michiru', text: 'なす角 θ を動かして、b のかげ（緑）と内積の値を見てね。90° をこえるとどうなる？' }],
      figure: { type: 'dotProduct' },
      prompts: ['θ = 90° のとき、内積はいくつ？', 'θ が 90° より大きいと、内積の符号は？'],
      check: {
        id: 'mc-02-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\vec{0}$ でない 2 つのベクトルの内積が 0 のとき、2 つのベクトルの関係は？',
        choices: ['垂直', '平行', '同じ向き', '大きさが等しい'],
        answer: 0,
        explain: '$|\\vec{a}||\\vec{b}|\\cos\\theta = 0$ で、大きさは 0 でないので $\\cos\\theta = 0$、θ = 90°。内積 0 は垂直の合図。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '内積は 1 つの数。プラスなら同じ向きより、マイナスなら逆向きよりなんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：内積',
      tool: '2 つのベクトルの「向きのそろい具合」を数にし、なす角や垂直を調べる道具',
      formulas: ['\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta', '\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2', '\\cos\\theta = \\dfrac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|},\\quad \\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0'],
      analogy: {
        title: 'たとえるなら「ななめに引くそり」',
        text: 'そりをななめ上に引くと、前に進むのに役立つのは力の「前向きのかげ」だけ。内積は、そのかげの長さに、進んだ距離をかけたもの（物理の仕事）。',
      },
      points: [
        '内積の答えは**ベクトルではなく数**。記号は「・」で、省かない。',
        '**成分で計算**：成分どうしをかけて足す。$(3,\\ 1) \\cdot (1,\\ 2) = 3 + 2 = 5$。',
        '**なす角**：成分で内積と大きさを出して、$\\cos\\theta$ を求める。θ は 0° 以上 180° 以下。',
        '$\\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2$。大きさの計算にも内積が使える。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🛷', title: '物理の仕事', text: '力 F で物を距離 s 動かしたときの仕事は $Fs\\cos\\theta$。力と移動のベクトルの内積。' },
        { icon: '💡', title: '3D の光', text: 'ゲームの 3D 画面では、面の向きと光の向きの内積で、面の明るさを決めている。' },
        { icon: '🤖', title: 'AI の「似ている度」', text: '文章を数のベクトルに変え、内積からなす角を出して、意味が似ているかを判断する。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'dot', level: 'calc' },
        { type: 'gen', gen: 'vec-angle', level: 'calc' },
        {
          id: 'mc-02-q1',
          type: 'mark',
          level: 'exam',
          prompt: '$\\vec{a} = (1,\\ 3)$、$\\vec{b} = (2,\\ -1)$ のとき、$\\vec{a} \\cdot \\vec{b}$ = ［アイ］ であり、$|\\vec{a}|^2$ = ［ウエ］ である。',
          answers: { ア: '-', イ: '1', ウ: '1', エ: '0' },
          hint: '$\\vec{a} \\cdot \\vec{b} = 1 \\times 2 + 3 \\times (-1)$、$|\\vec{a}|^2 = \\vec{a} \\cdot \\vec{a}$',
          explain: '$\\vec{a} \\cdot \\vec{b} = 2 - 3 = -1$。$|\\vec{a}|^2 = 1 + 9 = 10$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '綱を進む向きにそろえたら、ゴンドラがすいすい動いたわ！' },
        { who: 'michiru', mood: 'normal', text: '内積が使えると、垂直や長さの問題がぐっと楽になるの。次はその応用よ。' },
      ],
    },
  ],
};
