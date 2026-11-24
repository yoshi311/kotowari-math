import type { Lesson } from '../../types';

export const c09: Lesson = {
  id: 'mc-09',
  no: 9,
  title: 'ド・モアブルの定理',
  subtitle: 'n 乗は n 倍の回転',
  quest: '12 枚の花びらの扉',
  card: {
    id: 'card-mc-09',
    name: '永劫の歯車',
    term: 'ド・モアブルの定理',
    rarity: 3,
    tool: '極形式の n 乗を「絶対値は n 乗、偏角は n 倍」で求め、zⁿ = 1 などの方程式を円周上の点として解く道具',
    formula: '(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta',
    uses: ['正多角形の頂点の計算（CG・設計）', 'デジタル信号処理', '三角関数の公式（3 倍角など）の導出'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：花びらの扉',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '扉の残り半分には「$(1 + i)^8$ を答えよ」と書いてあるの。8 回もかけるなんて、たいへんそう…。' },
        { who: 'kai', mood: 'normal', text: '展開していったら、日が暮れちまうぞ。' },
        { who: 'michiru', mood: 'happy', text: '極形式なら、かけるたびに同じ角だけ回るだけ。8 回かけたら、角は 8 倍よ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：かけるたびに回る',
      lines: [{ who: 'michiru', text: 'z の偏角と n を変えて、z, z², z³, … の点の動きを見てね。' }],
      figure: { type: 'deMoivre' },
      prompts: ['偏角 45° で n = 8 にすると、$z^8$ はどこにくる？', '|z| が 1 より大きいと、点の並び方はどうなる？'],
      check: {
        id: 'mc-09-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$z = \\cos\\dfrac{\\pi}{6} + i\\sin\\dfrac{\\pi}{6}$ のとき、$z^6$ は？',
        choices: ['$-1$', '$1$', '$i$', '$-i$'],
        answer: 0,
        explain: 'ド・モアブルの定理より $z^6 = \\cos\\pi + i\\sin\\pi = -1$。30° を 6 回で 180°。',
      },
      after: [{ who: 'zero', mood: 'happy', text: 'n 乗は、角を n 倍に回すだけ。展開しなくていいんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：ド・モアブルの定理',
      tool: '極形式の n 乗を「絶対値は n 乗、偏角は n 倍」で求め、zⁿ = 1 などの方程式を円周上の点として解く道具',
      formulas: ['\\{r(\\cos\\theta + i\\sin\\theta)\\}^n = r^n(\\cos n\\theta + i\\sin n\\theta)', 'z^n = 1 \\text{ の解：}\\ z = \\cos\\dfrac{2k\\pi}{n} + i\\sin\\dfrac{2k\\pi}{n}\\ (k = 0, 1, \\cdots, n - 1)', '\\text{点 } \\beta \\text{ を点 } \\alpha \\text{ のまわりに } \\theta \\text{ 回転：}\\ \\gamma = \\alpha + (\\cos\\theta + i\\sin\\theta)(\\beta - \\alpha)'],
      analogy: {
        title: 'たとえるなら「時計の針を同じ角ずつ進める」',
        text: '針を 30° ずつ進めると、12 回で 1 周してもとにもどる。$z^{12} = 1$ の解は、円を 12 等分した点（時計の文字盤の位置）になる。',
      },
      points: [
        '**手順**：① 極形式になおす ② 絶対値を n 乗、偏角を n 倍 ③ $a + bi$ の形にもどす。',
        '例：$(1 + i)^8 = (\\sqrt{2})^8(\\cos 2\\pi + i\\sin 2\\pi) = 16$。',
        '$z^n = 1$ の解は、単位円を n 等分した点で、正 n 角形の頂点になる。',
        '点 α のまわりの回転は、α を原点に移してから回し、もとにもどす。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '⬡', title: '正多角形の設計', text: '$z^n = 1$ の解を使うと、正 n 角形の頂点の座標がすぐに計算できる。CG やロゴのデザインに使われる。' },
        { icon: '📶', title: '通信の信号', text: 'スマホの電波は、単位円の上の点（回転した複素数）で情報を表して送っている。' },
        { icon: '📐', title: '三角関数の公式', text: '$(\\cos\\theta + i\\sin\\theta)^3$ を 2 通りに計算すると、3 倍角の公式が出てくる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'de-moivre', level: 'calc' },
        { type: 'gen', gen: 'complex-arg', level: 'calc' },
        {
          id: 'mc-09-q1',
          type: 'mark',
          level: 'exam',
          prompt: '$(1 + \\sqrt{3}i)^6$ = ［アイ］ である。また、方程式 $z^3 = 1$ の解のうち、虚部が正のものを $z = a + bi$ とすると、$a = -\\dfrac{1}{p}$ として p = ［ウ］ である。',
          answers: { ア: '6', イ: '4', ウ: '2' },
          hint: '$1 + \\sqrt{3}i = 2\\left(\\cos\\dfrac{\\pi}{3} + i\\sin\\dfrac{\\pi}{3}\\right)$。$z^3 = 1$ の解は単位円を 3 等分した点。',
          explain: '$2^6(\\cos 2\\pi + i\\sin 2\\pi) = 64$。$z^3 = 1$ の解は偏角 0、$\\dfrac{2\\pi}{3}$、$\\dfrac{4\\pi}{3}$ の点で、虚部が正なのは $\\cos\\dfrac{2\\pi}{3} + i\\sin\\dfrac{2\\pi}{3} = -\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2}i$。p = 2。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '$(1 + i)^8 = 16$…答えたら、扉がすべて開いたわ！' },
        { who: 'michiru', mood: 'normal', text: 'すべての理術がそろったわ。扉の向こうに、最後の灯と…虚無の王が待っている。' },
      ],
    },
  ],
};
