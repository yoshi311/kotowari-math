import type { Lesson } from '../../types';

export const c05: Lesson = {
  id: 'mc-05',
  no: 5,
  title: '空間のベクトル',
  subtitle: '高さの成分をくわえる',
  quest: '城の大広間の対角線',
  card: {
    id: 'card-mc-05',
    name: '三次元の羅針盤',
    term: '空間ベクトル',
    rarity: 3,
    tool: '座標空間の点やベクトルを 3 つの成分で表し、大きさ・内積・位置関係を計算する道具',
    formula: '\\vec{a} = (a_1,\\ a_2,\\ a_3),\\quad |\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2},\\quad \\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3',
    uses: ['ドローンや飛行機の位置の管理', '3D プリンタ・CAD の設計', 'GPS で立体的な位置を求める'],
    color: '#9b5de5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：大広間の対角線',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '大広間は直方体の形。床のすみから天井の反対のすみまで、光の綱を張りたいの。長さはどれだけ必要かしら。' },
        { who: 'kai', mood: 'normal', text: 'よこ・たて・高さの 3 つの方向があるな。平面のベクトルじゃ足りないぞ。' },
        { who: 'michiru', mood: 'happy', text: '成分を 3 つにするだけで、平面と同じように計算できるの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：直方体の対角線',
      lines: [{ who: 'michiru', text: 'x、y、z を変えて、点 P までのベクトルの長さを見てね。「見る向き」で回すこともできるわ。' }],
      figure: { type: 'space3d' },
      prompts: ['金の点線（床の対角線）の長さの 2 乗は？', '緑の高さと組み合わせると、OP の長さの 2 乗は？'],
      check: {
        id: 'mc-05-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\vec{a} = (2,\\ 3,\\ 6)$ の大きさ $|\\vec{a}|$ は？',
        choices: ['$7$', '$11$', '$\\sqrt{13}$', '$49$'],
        answer: 0,
        explain: '$\\sqrt{2^2 + 3^2 + 6^2} = \\sqrt{49} = 7$。三平方の定理を 2 回使ったのと同じ。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '成分が 1 つふえても、計算のしかたはぜんぜん変わらないね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：空間ベクトル',
      tool: '座標空間の点やベクトルを 3 つの成分で表し、大きさ・内積・位置関係を計算する道具',
      formulas: ['|\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2}', '\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3', '\\text{4 点 A, B, C, P が同じ平面上} \\iff \\overrightarrow{\\mathrm{AP}} = s\\overrightarrow{\\mathrm{AB}} + t\\overrightarrow{\\mathrm{AC}}'],
      analogy: {
        title: 'たとえるなら「ビルの何階のどの部屋」',
        text: '地図の上の位置（x、y）だけでなく、何階か（z）も言えば、ビルの中の場所が 1 つに決まる。空間の点は 3 つの数で表す。',
      },
      points: [
        '座標空間には x 軸・y 軸・z 軸の 3 本がある。点は $(x,\\ y,\\ z)$、2 点間の距離も三平方の定理。',
        '和・差・実数倍・内積・分点の式は、平面とまったく同じ形。成分が 3 つになるだけ。',
        '平面上にあるか：$\\overrightarrow{\\mathrm{AP}} = s\\overrightarrow{\\mathrm{AB}} + t\\overrightarrow{\\mathrm{AC}}$ となる s、t があるか調べる。',
        '球の方程式：中心 (a, b, c)、半径 r の球は $(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🚁', title: 'ドローン', text: '位置を (x, y, z) で管理し、目的地へのベクトルを計算して飛んでいる。' },
        { icon: '🖨️', title: '3D プリンタ', text: '立体の形を、たくさんの点の空間座標とベクトルのデータで表して作っている。' },
        { icon: '🛰️', title: 'GPS', text: '人工衛星からの距離（空間の 2 点間の距離）を何個か使って、地球上の位置を求める。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'space-vec', level: 'calc' },
        { type: 'gen', gen: 'dot', level: 'calc' },
        {
          id: 'mc-05-q1',
          type: 'mark',
          level: 'exam',
          prompt: '座標空間に 3 点 $\\mathrm{A}(1,\\ 0,\\ 0)$、$\\mathrm{B}(0,\\ 2,\\ 0)$、$\\mathrm{C}(0,\\ 0,\\ 2)$ がある。$\\overrightarrow{\\mathrm{AB}} \\cdot \\overrightarrow{\\mathrm{AC}}$ = ［ア］ であり、$|\\overrightarrow{\\mathrm{AB}}|^2$ = ［イ］ である。また、∠BAC = θ とすると $\\cos\\theta = \\dfrac{p}{q}$（既約分数）で、p = ［ウ］、q = ［エ］ である。',
          answers: { ア: '1', イ: '5', ウ: '1', エ: '5' },
          hint: '$\\overrightarrow{\\mathrm{AB}} = (-1,\\ 2,\\ 0)$、$\\overrightarrow{\\mathrm{AC}} = (-1,\\ 0,\\ 2)$',
          explain: '内積は $1 + 0 + 0 = 1$。$|\\overrightarrow{\\mathrm{AB}}|^2 = 1 + 4 = 5$、$|\\overrightarrow{\\mathrm{AC}}|^2 = 5$。$\\cos\\theta = \\dfrac{1}{\\sqrt{5}\\sqrt{5}} = \\dfrac{1}{5}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '光の綱が、大広間のすみからすみへ、ぴったり張れたわ！' },
        { who: 'michiru', mood: 'normal', text: 'ベクトルの理術はそろったわ。城の上の階には、ふしぎな曲線の部屋があるの。' },
      ],
    },
  ],
};
