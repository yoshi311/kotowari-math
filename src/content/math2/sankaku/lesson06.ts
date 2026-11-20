import type { Lesson } from '../../types';

export const s06: Lesson = {
  id: 'm2s-06',
  no: 6,
  title: '三角方程式・不等式',
  subtitle: '単位円で解を読む',
  quest: '船を出せる時間帯',
  card: {
    id: 'card-m2s-06',
    name: '潮見の砂時計',
    term: '三角方程式・三角不等式',
    rarity: 2,
    tool: '単位円と直線の交わりを見て、sin θ = k などをみたす角や範囲を求める道具',
    formula: '\\sin\\theta = k \\iff \\text{単位円と直線 } y = k \\text{ の交点}',
    uses: ['潮の高さが一定以上になる時間帯の計算', '太陽の高さから日の出・日の入りの時刻を求める', 'ロボットの関節角度の計算'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：潮が満ちる時間帯',
      scene: 'coast',
      lines: [
        { who: 'npc', npcName: '海辺の漁師ナギ', mood: 'think', text: '船を出せるのは、潮の高さを表す sin θ が 1/2 より大きいときだけなんだ。θ がどの範囲なら出られる？' },
        { who: 'kai', mood: 'normal', text: 'sin θ = 1/2 になるのは 30° だろ？ だから 30° より大きいとき…じゃないのか？' },
        { who: 'michiru', mood: 'happy', text: '1 周の中には、sin θ = 1/2 となる角がもう 1 つあるの。単位円で確かめましょう。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：直線と単位円',
      lines: [{ who: 'michiru', text: '金色の線と単位円の交わる点が、方程式の解よ。記号を ＞ にすると、線より上の弧（緑）が不等式の解になるわ。' }],
      figure: { type: 'trigEq' },
      prompts: ['sin θ = 1/2 の解は、0 ≦ θ < 2π にいくつある？', 'sin θ ＞ 1/2 の解の範囲は？', 'cos に切りかえると、線の向きはどう変わる？'],
      check: {
        id: 'm2s-06-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$0 \\le \\theta < 2\\pi$ のとき、$\\sin\\theta = \\dfrac{1}{2}$ の解は？',
        choices: ['$\\theta = \\dfrac{\\pi}{6},\\ \\dfrac{5}{6}\\pi$', '$\\theta = \\dfrac{\\pi}{6}$', '$\\theta = \\dfrac{\\pi}{3},\\ \\dfrac{2}{3}\\pi$', '$\\theta = \\dfrac{\\pi}{6},\\ \\dfrac{11}{6}\\pi$'],
        answer: 0,
        explain: '直線 $y = \\dfrac{1}{2}$ は単位円と 2 点で交わる。右の点が $\\dfrac{\\pi}{6}$、左の点が $\\pi - \\dfrac{\\pi}{6} = \\dfrac{5}{6}\\pi$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '解は 2 つあるんだ！ 1 つだけ答えると、半分しか正解にならないね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：三角方程式・不等式',
      tool: '単位円と直線の交わりを見て、sin θ = k などをみたす角や範囲を求める道具',
      formulas: ['\\sin\\theta = k:\\ \\text{直線 } y = k \\text{ と単位円の交点}', '\\cos\\theta = k:\\ \\text{直線 } x = k \\text{ と単位円の交点}', '\\tan\\theta = k:\\ \\text{直線 } y = kx \\text{ と単位円の交点}'],
      analogy: {
        title: 'たとえるなら「水位計」',
        text: '単位円を水そうと考えて、水面の高さを k にする。水面と円のふちが交わる 2 点が sin θ = k の解。「水面より上」の部分が sin θ > k の解。',
      },
      points: [
        '**手順**：①単位円をかく ②直線 y = k（または x = k）をひく ③交点の角を読む ④範囲（0 ≦ θ < 2π など）に注意する。',
        '$\\sin\\theta > \\dfrac{1}{2}$（0 ≦ θ < 2π）の解は $\\dfrac{\\pi}{6} < \\theta < \\dfrac{5}{6}\\pi$。',
        '$\\cos\\theta < \\dfrac{1}{2}$ なら、直線 $x = \\dfrac{1}{2}$ より左の弧：$\\dfrac{\\pi}{3} < \\theta < \\dfrac{5}{3}\\pi$。',
        '$\\sin\\left(\\theta + \\dfrac{\\pi}{6}\\right) = \\dfrac{1}{2}$ のような式は、$t = \\theta + \\dfrac{\\pi}{6}$ とおき、t の範囲を先に求める。',
        '$2\\sin^2\\theta - \\sin\\theta - 1 = 0$ のような式は、$\\sin\\theta = t$（$-1 \\le t \\le 1$）とおいて 2 次方程式にする。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '⛵', title: '出航の時間帯', text: '潮の高さが一定以上になる時間帯は、三角不等式で計算できる。港の船の出入りの計画に使われる。' },
        { icon: '🌅', title: '日の出・日の入り', text: '太陽の高さは時間とともに三角関数のように変わる。「高さ = 0」となる時刻が日の出と日の入り。' },
        { icon: '🤖', title: 'ロボットの関節', text: '腕の先を決まった高さに置くには、sin θ = k をみたす関節の角度を求める。解が 2 つあれば、ひじを上げる・下げるの 2 通り。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'trig-eq', level: 'calc' },
        {
          id: 'm2s-06-q1',
          type: 'choice',
          level: 'calc',
          prompt: '$0 \\le \\theta < 2\\pi$ のとき、不等式 $\\cos\\theta \\ge \\dfrac{\\sqrt{2}}{2}$ の解は？',
          choices: ['$0 \\le \\theta \\le \\dfrac{\\pi}{4},\\ \\dfrac{7}{4}\\pi \\le \\theta < 2\\pi$', '$\\dfrac{\\pi}{4} \\le \\theta \\le \\dfrac{7}{4}\\pi$', '$0 \\le \\theta \\le \\dfrac{\\pi}{4}$', '$\\dfrac{\\pi}{4} \\le \\theta \\le \\dfrac{3}{4}\\pi$'],
          answer: 0,
          hint: '直線 $x = \\dfrac{\\sqrt{2}}{2}$ より右の弧。',
          explain: '交点は $\\dfrac{\\pi}{4}$ と $\\dfrac{7}{4}\\pi$。右側の弧は θ = 0 をまたぐので、$0 \\le \\theta \\le \\dfrac{\\pi}{4}$ と $\\dfrac{7}{4}\\pi \\le \\theta < 2\\pi$ の 2 つに分かれる。',
        },
        { type: 'gen', gen: 'period', level: 'calc' },
        {
          id: 'm2s-06-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$0 \\le \\theta < 2\\pi$ のとき、方程式 $2\\sin^2\\theta - \\sin\\theta - 1 = 0$ を考える。$\\sin\\theta = t$ とおくと $(2t + 1)(t - 1) = 0$。$\\sin\\theta = 1$ となる θ は $\\dfrac{p}{q}\\pi$ で p = ［ア］、q = ［イ］ であり、方程式の解は全部で ［ウ］ 個ある。',
          answers: { ア: '1', イ: '2', ウ: '3' },
          hint: '$\\sin\\theta = 1$ と $\\sin\\theta = -\\dfrac{1}{2}$ の解をそれぞれ数える。',
          explain: '$\\sin\\theta = 1$ より $\\theta = \\dfrac{\\pi}{2}$（1 個）。$\\sin\\theta = -\\dfrac{1}{2}$ より $\\theta = \\dfrac{7}{6}\\pi,\\ \\dfrac{11}{6}\\pi$（2 個）。全部で 3 個。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '海辺の漁師ナギ', mood: 'happy', text: '30° から 150° のあいだなら船を出せるんだな。30° より大きければいい、じゃなかったのか。' },
        { who: 'michiru', mood: 'normal', text: '次は、30° や 45° を組み合わせて、75° のような角の値を求める「加法定理」よ。' },
      ],
    },
  ],
};
