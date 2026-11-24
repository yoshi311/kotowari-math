import type { Lesson } from '../../types';

export const c07: Lesson = {
  id: 'mc-07',
  no: 7,
  title: '媒介変数表示と極座標',
  subtitle: '時刻と角度で曲線をえがく',
  quest: '車輪がえがく道',
  card: {
    id: 'card-mc-07',
    name: '軌跡の羽ペン',
    term: '媒介変数表示・極座標',
    rarity: 3,
    tool: '曲線を時刻 t の式（媒介変数表示）や、距離 r と角 θ（極座標）で表して、動きや形をとらえる道具',
    formula: 'x = r\\cos\\theta,\\quad y = r\\sin\\theta,\\quad r = \\sqrt{x^2 + y^2}',
    uses: ['ボールや惑星の動きのシミュレーション', 'レーダーの画面（距離と方角）', '歯車やすべり台の曲線の設計'],
    color: '#ffd166',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：車輪の通った道',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '城の床には、転がる車輪のふちの 1 点がえがいた、ふしぎな曲線が残っているの。式で表せるかしら。' },
        { who: 'kai', mood: 'think', text: 'y = (x の式) にするのは、むずかしそうだな…。' },
        { who: 'michiru', mood: 'happy', text: '「時刻 t のとき、x はいくつ、y はいくつ」と別々に書けばいいの。それが媒介変数表示よ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：点の動きと曲線',
      lines: [{ who: 'michiru', text: '曲線を切りかえて、t（θ）を進めてみて。点が動いて曲線がかかれていくわ。' }],
      figure: { type: 'paramCurve' },
      prompts: ['サイクロイドで、金色の円（車輪）と点の動きを見てみよう。', 'ハートや花びらでは、原点からの距離 r が角 θ とともにどう変わる？'],
      check: {
        id: 'mc-07-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$x = \\cos t$、$y = \\sin t$（$0 \\le t < 2\\pi$）で表される曲線は？',
        choices: ['原点を中心とする半径 1 の円', '直線 y = x', '放物線 $y = x^2$', '双曲線'],
        answer: 0,
        explain: '$\\cos^2 t + \\sin^2 t = 1$ より $x^2 + y^2 = 1$。t を消すと、ふつうの方程式になる。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'x と y を別々に書けば、くるくる回る形もかんたんに表せるね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：媒介変数表示と極座標',
      tool: '曲線を時刻 t の式（媒介変数表示）や、距離 r と角 θ（極座標）で表して、動きや形をとらえる道具',
      formulas: ['x = a\\cos t,\\ y = b\\sin t \\iff \\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1', '\\text{極座標 } (r,\\ \\theta)：x = r\\cos\\theta,\\ y = r\\sin\\theta', 'r = \\sqrt{x^2 + y^2},\\quad \\cos\\theta = \\dfrac{x}{r},\\ \\sin\\theta = \\dfrac{y}{r}'],
      analogy: {
        title: 'たとえるなら「レーダーの画面」',
        text: 'レーダーは「どの方角に、どれだけはなれているか」で物の位置を表す。これが極座標。地図の「東へ何 km、北へ何 km」が直交座標。',
      },
      points: [
        '**媒介変数表示**：$x = f(t)$、$y = g(t)$。t を消すと x と y の方程式になる（$\\cos^2 t + \\sin^2 t = 1$ をよく使う）。',
        '**極座標**：原点からの距離 r と、x 軸の正の向きからの角 θ で点を表す。',
        '**極方程式**：r と θ の関係式。$r = 2$ は半径 2 の円、$\\theta = \\dfrac{\\pi}{4}$ は直線。',
        '直交座標の方程式へなおすには、$r\\cos\\theta = x$、$r\\sin\\theta = y$、$r^2 = x^2 + y^2$ を使う。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '⚾', title: '投げたボールの動き', text: '時刻 t の位置を $x = v_1 t$、$y = v_2 t - 4.9t^2$ と表すと、動きを追いかけやすい。' },
        { icon: '📡', title: 'レーダー', text: '船や飛行機のレーダー画面は、距離と方角の極座標で物の位置を表示している。' },
        { icon: '🛝', title: 'サイクロイドのすべり台', text: 'サイクロイドの形のすべり台は、直線のすべり台よりも速くすべり降りられる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'polar', level: 'calc' },
        { type: 'gen', gen: 'conic', level: 'calc' },
        {
          id: 'mc-07-q1',
          type: 'mark',
          level: 'exam',
          prompt: '極座標が $\\left(4,\\ \\dfrac{2\\pi}{3}\\right)$ である点の直交座標を $(x,\\ y)$ とすると、x = ［アイ］、$y = p\\sqrt{3}$ として p = ［ウ］ である。また、極方程式 $r = 4\\cos\\theta$ を直交座標の方程式にすると $(x - $［エ］$)^2 + y^2 = 4$ である。',
          answers: { ア: '-', イ: '2', ウ: '2', エ: '2' },
          hint: '前半は $x = 4\\cos\\dfrac{2\\pi}{3}$、$y = 4\\sin\\dfrac{2\\pi}{3}$。後半は両辺に r をかけて $r^2 = 4r\\cos\\theta$。',
          explain: '$x = 4 \\times \\left(-\\dfrac{1}{2}\\right) = -2$、$y = 4 \\times \\dfrac{\\sqrt{3}}{2} = 2\\sqrt{3}$。後半は $x^2 + y^2 = 4x$ より $(x - 2)^2 + y^2 = 4$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '車輪の道が、式どおりに光ったわ！' },
        { who: 'michiru', mood: 'normal', text: 'いよいよ城の最上階。複素数を「平面の点」として見る、最後の理術が眠っているわ。' },
      ],
    },
  ],
};
