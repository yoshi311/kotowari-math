import type { Lesson } from '../../types';

export const s09: Lesson = {
  id: 'm2s-09',
  no: 9,
  title: '三角関数の合成',
  subtitle: '2 つの波を 1 つにまとめる',
  quest: '重なる波の最大の高さ',
  card: {
    id: 'card-m2s-09',
    name: '合わせ波の宝珠',
    term: '三角関数の合成',
    rarity: 3,
    tool: 'a sin θ + b cos θ を 1 つの sin の波にまとめて、最大値・最小値や方程式を解く道具',
    formula: 'a\\sin\\theta + b\\cos\\theta = \\sqrt{a^2 + b^2}\\,\\sin(\\theta + \\alpha)',
    uses: ['ノイズキャンセリング（逆の波を重ねて音を消す）', '交流回路の電圧の計算', '振り子やばねの運動の解析'],
    color: '#9b5de5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：2 つの波が重なると',
      scene: 'coast',
      lines: [
        { who: 'npc', npcName: '海辺の漁師ナギ', mood: 'think', text: '沖から来る波 sin θ と、岬ではね返る波 cos θ が重なると、高さは sin θ + cos θ。いちばん高いときで、どのくらいになる？' },
        { who: 'kai', mood: 'normal', text: 'どっちも最大 1 だから、合わせて 2 じゃないのか？' },
        { who: 'michiru', mood: 'think', text: 'sin と cos は、いちばん高くなるタイミングがずれているの。2 つを 1 つの波にまとめてみましょう。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：点 (a, b) と波',
      lines: [{ who: 'michiru', text: 'a と b を動かしてみて。上の図の桃色の長さ r と、下の桃色の波の高さをくらべてね。' }],
      figure: { type: 'synthesis' },
      prompts: ['a = 1、b = 1 のとき、合わせた波の最大値は 2？ それとも？', 'a = 3、b = 4 のとき、波の最大値はいくつ？'],
      check: {
        id: 'm2s-09-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\sin\\theta + \\cos\\theta$ の最大値は？',
        choices: ['$\\sqrt{2}$', '$2$', '$1$', '$\\dfrac{\\sqrt{2}}{2}$'],
        answer: 0,
        explain: '点 (1, 1) の原点からの長さは $\\sqrt{1^2 + 1^2} = \\sqrt{2}$。$\\sin\\theta + \\cos\\theta = \\sqrt{2}\\sin\\left(\\theta + \\dfrac{\\pi}{4}\\right)$ なので、最大値は $\\sqrt{2}$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '高さは足し算じゃなくて、点 (a, b) までの長さ！ 三平方の定理が出てきたね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：三角関数の合成',
      tool: 'a sin θ + b cos θ を 1 つの sin の波にまとめて、最大値・最小値や方程式を解く道具',
      formulas: ['a\\sin\\theta + b\\cos\\theta = r\\sin(\\theta + \\alpha)', 'r = \\sqrt{a^2 + b^2},\\quad \\cos\\alpha = \\dfrac{a}{r},\\ \\sin\\alpha = \\dfrac{b}{r}', '-r \\le a\\sin\\theta + b\\cos\\theta \\le r'],
      analogy: {
        title: 'たとえるなら「2 人で引っぱる綱」',
        text: '東へ a、北へ b の力で引くと、合わせた力は斜めの向きに $\\sqrt{a^2 + b^2}$。sin と cos の波も同じで、点 (a, b) までの長さが合わせた波の高さ、向きの角 α がずれになる。',
      },
      points: [
        '**手順**：①点 (a, b) をとる ②長さ $r = \\sqrt{a^2 + b^2}$ ③x 軸とのなす角 α を読む ④$r\\sin(\\theta + \\alpha)$。',
        '$\\sqrt{3}\\sin\\theta + \\cos\\theta$：点 $(\\sqrt{3}, 1)$ で r = 2、α = $\\dfrac{\\pi}{6}$。$= 2\\sin\\left(\\theta + \\dfrac{\\pi}{6}\\right)$。',
        'sin の係数が x 座標（よこ）、cos の係数が y 座標（たて）。逆にしないよう注意。',
        'θ の範囲が決まっているときは、$\\theta + \\alpha$ の範囲を先に求めてから最大・最小を考える。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🎧', title: 'ノイズキャンセリング', text: '騒音と、ちょうど逆の形の波を重ねると、合成した波の高さが 0 になって音が消える。イヤホンに使われている。' },
        { icon: '⚡', title: '交流回路', text: '電気回路では、ずれのある 2 つの電圧の波を合成して、全体の電圧の大きさを $\\sqrt{a^2 + b^2}$ で求める。' },
        { icon: '🕰️', title: '振り子の運動', text: '振り子やばねの動きは $a\\sin t + b\\cos t$ の形で表され、合成すると振れはばとタイミングがわかる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'synthesis', level: 'calc' },
        {
          id: 'm2s-09-q1',
          type: 'choice',
          level: 'calc',
          prompt: '$\\sin\\theta + \\sqrt{3}\\cos\\theta$ を $r\\sin(\\theta + \\alpha)$（$r > 0$、$-\\pi < \\alpha \\le \\pi$）の形にすると？',
          choices: ['$2\\sin\\left(\\theta + \\dfrac{\\pi}{3}\\right)$', '$2\\sin\\left(\\theta + \\dfrac{\\pi}{6}\\right)$', '$4\\sin\\left(\\theta + \\dfrac{\\pi}{3}\\right)$', '$\\sqrt{2}\\sin\\left(\\theta + \\dfrac{\\pi}{4}\\right)$'],
          answer: 0,
          hint: '点 $(1, \\sqrt{3})$ をとる。sin の係数がよこ、cos の係数がたて。',
          explain: '$r = \\sqrt{1 + 3} = 2$。点 $(1, \\sqrt{3})$ は x 軸と $\\dfrac{\\pi}{3}$ の角をなすので、$2\\sin\\left(\\theta + \\dfrac{\\pi}{3}\\right)$。',
        },
        { type: 'gen', gen: 'addition-value', level: 'calc' },
        {
          id: 'm2s-09-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$0 \\le \\theta \\le \\pi$ のとき、$y = \\sqrt{3}\\sin\\theta + \\cos\\theta$ の最大値は ［ア］、最小値は ［イウ］ である。',
          answers: { ア: '2', イ: '-', ウ: '1' },
          hint: '$y = 2\\sin\\left(\\theta + \\dfrac{\\pi}{6}\\right)$。$\\theta + \\dfrac{\\pi}{6}$ の範囲は $\\dfrac{\\pi}{6}$ 以上 $\\dfrac{7}{6}\\pi$ 以下。',
          explain: '$\\dfrac{\\pi}{6} \\le \\theta + \\dfrac{\\pi}{6} \\le \\dfrac{7}{6}\\pi$ で、sin は $\\dfrac{\\pi}{2}$ のとき最大 1、$\\dfrac{7}{6}\\pi$ のとき最小 $-\\dfrac{1}{2}$。だから最大値 2、最小値 −1。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '海辺の漁師ナギ', mood: 'happy', text: '2 つの波を合わせても、高さは 2 じゃなくて √2。だから防波堤はこの高さで足りるんだな。' },
        { who: 'michiru', mood: 'normal', text: 'これで三角関数の理術はすべてそろったわ。大渦の海竜のところへ行きましょう。' },
      ],
    },
  ],
};
