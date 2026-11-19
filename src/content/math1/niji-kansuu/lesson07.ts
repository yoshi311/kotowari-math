import type { Lesson } from '../../types';

export const q07: Lesson = {
  id: 'm1q-07',
  no: 7,
  title: '判別式と共有点',
  subtitle: '解かずに、解の個数を見ぬく',
  quest: '吊り橋は川にふれるか',
  card: {
    id: 'card-m1q-07',
    name: '見透しの水晶',
    term: '判別式',
    rarity: 3,
    tool: '方程式を解かずに、実数の解が何個あるか（グラフが x 軸と何回交わるか）を判定する道具',
    formula: 'D = b^2 - 4ac:\\ D > 0 \\ (2\\text{個}),\\ D = 0 \\ (1\\text{個}),\\ D < 0 \\ (0\\text{個})',
    uses: ['3DCG の光線の当たり判定（レイトレーシング）', 'ボールが目標の高さに届くか', '橋やケーブルの設計'],
    color: '#c3a6ff',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：たれさがるケーブル',
      scene: 'valley',
      lines: [
        { who: 'npc', npcName: '橋守りの老人', mood: 'sad', text: '大変じゃ！ 雨で川の水位が上がっておる。吊り橋のケーブルが水面にふれたら、流されてしまうかもしれん！' },
        { who: 'npc', npcName: '橋守りの老人', mood: 'think', text: 'ケーブルの形は放物線。水面は直線…ふれるのか、ふれんのか…。' },
        { who: 'kai', mood: 'normal', text: '方程式を解いて、解があればふれる、なければふれない…でも、解の公式は計算が大変だぞ。' },
        { who: 'michiru', mood: 'happy', text: '解をぜんぶ求めなくても、「解が何個あるか」だけを一瞬で見ぬく理術があるの。解の公式の**√ の中身**に注目して。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：交わる数が変わる瞬間',
      lines: [
        { who: 'michiru', text: '放物線 $y = x^2 - 2x + c$ を、数の項 $c$ で上下に動かしてみて。$D$ という数の符号に注目よ。' },
      ],
      figure: { type: 'discriminant' },
      prompts: ['$c$ を少しずつ大きくしていこう。交点の数はどう変わる？', 'ちょうど $x$ 軸にふれる（接する）のは、$D$ がいくつのとき？'],
      check: {
        id: 'm1q-07-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '放物線が $x$ 軸に接する（1 点だけでふれる）とき、判別式 $D$ はどうなっている？',
        choices: ['$D > 0$', '$D = 0$', '$D < 0$', '$D$ とは関係ない'],
        answer: 1,
        explain: '解の公式の $\\pm \\sqrt{D}$ が $\\pm 0$ になり、2 つの解が重なって 1 つ（**重解**）になる。グラフでは $x$ 軸に接する。',
      },
      after: [
        { who: 'zero', mood: 'surprised', text: '$D$ がプラスなら 2 個、0 なら 1 個、マイナスなら 0 個！ 解を出さなくても、符号だけでわかるんだ！' },
      ],
    },
    {
      kind: 'concept',
      title: 'ことばにする：判別式',
      tool: '方程式を解かずに、実数の解が何個あるか（グラフが x 軸と何回交わるか）を判定する道具',
      analogy: {
        title: 'たとえるなら「√ の門番」',
        text: '解の公式の √ の中身 $b^2 - 4ac$ は、門番のようなもの。中身がプラスなら門が開いて 2 人（2 つの解）が通れる。0 なら 1 人だけ。マイナスなら門は閉まっていて、だれも通れない（2乗してマイナスになる実数はないから）。',
      },
      formulas: [
        'x = \\dfrac{-b \\pm \\sqrt{D}}{2a},\\quad D = b^2 - 4ac',
        'D > 0 \\iff \\text{異なる 2 つの実数解} \\iff x \\text{ 軸と 2 点で交わる}',
        'D = 0 \\iff \\text{重解} \\iff x \\text{ 軸に接する}',
        'D < 0 \\iff \\text{実数解なし} \\iff x \\text{ 軸と共有点なし}',
      ],
      points: [
        '判別式 $D = b^2 - 4ac$ は、解の公式の√ の中身。',
        '$x$ の係数が $2b\'$ のときは、$\\dfrac{D}{4} = b\'^2 - ac$ で判定すると計算が楽。',
        '「実数解をもつ」は $D \\ge 0$（2 個でも 1 個でもよい）。「異なる 2 つ」なら $D > 0$。',
        '係数に文字（$k$ や $m$）がある問題では、$D$ の条件から文字の値や範囲を求める。共通テストの定番！',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        {
          icon: '🎥',
          title: '3DCG の光の計算',
          text: '映画やゲームの美しい3DCGは、画面の1点ごとに「光線が球に当たるか」を計算して作られる（レイトレーシング）。当たるかどうかは、2次方程式の判別式の符号で一瞬で判定している。1 枚の画像で何百万回も！',
          formula: 'D \\ge 0 \\Rightarrow \\text{当たる}',
        },
        {
          icon: '🏀',
          title: 'ボールが届くか',
          text: '「投げたボールが高さ 3m のゴールに届くか」は、高さの式 = 3 の方程式に実数解があるか（$D \\ge 0$）で判定できる。',
        },
        {
          icon: '🌉',
          title: '橋やケーブルの設計',
          text: 'ケーブルと水面・道路がふれないか、安全な距離が保たれるかを、判別式で確かめる。',
        },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'disc-count', level: 'calc' },
        {
          id: 'm1q-07-q1',
          type: 'mark',
          level: 'calc',
          prompt: '2次方程式 $x^2 + 4x + k = 0$ が重解をもつとき、$k =$ ［ア］',
          answers: { ア: '4' },
          hint: '重解は $D = 0$。$D = 4^2 - 4 \\times 1 \\times k$',
          explain: '$D = 16 - 4k = 0$ より $k = 4$。このとき $x^2 + 4x + 4 = (x + 2)^2 = 0$ で、重解 $x = -2$。',
        },
        {
          id: 'm1q-07-q2',
          type: 'choice',
          level: 'calc',
          prompt: '2次方程式 $x^2 - 2x + k = 0$ が異なる 2 つの実数解をもつような $k$ の範囲は？',
          choices: ['$k < 1$', '$k > 1$', '$k \\le 1$', '$k < -1$'],
          answer: 0,
          hint: '異なる 2 つなので $D > 0$。$D = (-2)^2 - 4k$',
          kaiMistake: '「＝」もふくめて $k \\le 1$ にしちゃった！ $k = 1$ だと重解で、「異なる 2 つ」じゃないのか。',
          explain: '$D = 4 - 4k > 0$ より $k < 1$。$k = 1$ のときは重解になるのでふくまない。',
        },
        {
          id: 'm1q-07-q3',
          type: 'mark',
          level: 'exam',
          prompt: '放物線 $y = x^2 + 2mx + m + 2$ が $x$ 軸に接するとき、\n$\\dfrac{D}{4} = m^2 - m -$ ［ア］ $= 0$ より、$m = -$［イ］、［ウ］',
          answers: { ア: '2', イ: '1', ウ: '2' },
          hint: '$x$ の係数が $2m$ なので $\\dfrac{D}{4} = m^2 - 1 \\times (m + 2)$。',
          explain: '$\\dfrac{D}{4} = m^2 - (m + 2) = m^2 - m - 2 = (m + 1)(m - 2) = 0$。よって $m = -1,\\ 2$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '橋守りの老人', mood: 'happy', text: '判別式はマイナス…ケーブルと水面は交わらん！ 吊り橋は無事じゃ！' },
        { who: 'kai', mood: 'happy', text: '解かずに個数がわかるって、ずるいくらい便利だな。' },
        { who: 'michiru', mood: 'normal', text: '次は「＝」ではなく「＞」や「＜」。グラフが上にある範囲、下にある範囲を探すわよ。' },
      ],
    },
  ],
};
