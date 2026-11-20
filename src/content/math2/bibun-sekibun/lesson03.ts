import type { Lesson } from '../../types';

export const d03: Lesson = {
  id: 'm2d-03',
  no: 3,
  title: '導関数の計算',
  subtitle: '指数を前に出して 1 へらす',
  quest: '歯車の回転数',
  card: {
    id: 'card-m2d-03',
    name: '加速の歯車',
    term: '微分の公式',
    rarity: 2,
    tool: '(xⁿ)′ = nxⁿ⁻¹ と「たし算・定数倍はそのまま」を使って、多項式をすばやく微分する道具',
    formula: "(x^n)' = nx^{n-1},\\quad \\{kf(x) + lg(x)\\}' = kf'(x) + lg'(x)",
    uses: ['位置の式から速さ・加速度を求める', '面積・体積の増え方を調べる', '物理や経済のあらゆる「変化の速さ」の計算'],
    color: '#06d6a0',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：大きくなる歯車',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'think', text: '3 階には、正方形の板がだんだん大きくなる仕かけがあります。一辺が x のとき、面積 $x^2$ はどんな速さで増えるのでしょう。' },
        { who: 'kai', mood: 'normal', text: '定義の式で h → 0 …を毎回やるのか。もっと楽な方法はないのかよ。' },
        { who: 'michiru', mood: 'happy', text: '図で増えた部分を見ると、公式のしくみがわかるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：面積の増え方',
      lines: [{ who: 'michiru', text: '一辺 x の正方形を h だけのばすと、どこが増える？ h を小さくしてみてね。' }],
      figure: { type: 'powerRule' },
      prompts: ['増えた部分は、桃色の板 2 枚と金色の小さな正方形。それぞれの面積は？', 'h を小さくすると、金色の部分はどうなる？'],
      check: {
        id: 'm2d-03-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '正方形と同じように考えると、立方体の体積 $x^3$ を微分した $(x^3)\'$ は？',
        choices: ['$3x^2$', '$x^2$', '$3x$', '$\\dfrac{x^4}{4}$'],
        answer: 0,
        explain: '一辺を h のばすと、面積 $x^2$、厚さ h の板が 3 枚ふえる（ほかはもっと小さい）。$\\dfrac{3x^2 h}{h} = 3x^2$。指数 3 が前に出て、指数は 1 へる。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '指数が前に出て、1 つへる！ $x^2$ は $2x$、$x^3$ は $3x^2$ だね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：微分の公式',
      tool: '(xⁿ)′ = nxⁿ⁻¹ と「たし算・定数倍はそのまま」を使って、多項式をすばやく微分する道具',
      formulas: ["(x^n)' = nx^{n-1}\\quad(n = 1, 2, 3, \\cdots)", "(c)' = 0", "\\{kf(x) + lg(x)\\}' = kf'(x) + lg'(x)"],
      analogy: {
        title: 'たとえるなら「項ごとの分業」',
        text: 'いくつもの項があっても、1 つずつ別々に微分して足せばいい。係数（数のかけ算）は、そのまま前に残る。',
      },
      points: [
        '例：$y = 2x^3 - 5x^2 + 4x - 7$ なら、$y\' = 6x^2 - 10x + 4$。定数 −7 は消える。',
        'かっこのある式は、**先に展開**してから微分する。$(2x + 1)^2 = 4x^2 + 4x + 1$ → $8x + 4$。',
        '文字が x 以外のときも同じ。$s = 5t^2$ を t で微分すると $10t$。',
        '条件から係数を決める問題は、$f\'(x)$ を作ってから代入し、連立方程式にする。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🍎', title: '落ちるリンゴ', text: '落ちた距離 $4.9t^2$ m を微分すると、t 秒後の速さ $9.8t$ m/秒。もう一度微分すると重力の加速度 9.8。' },
        { icon: '🎈', title: '風船のふくらみ方', text: '半径 r の球の体積 $\\dfrac{4}{3}\\pi r^3$ を微分すると $4\\pi r^2$（表面積）。半径が少し増えると、表面の分だけ体積が増える。' },
        { icon: '💹', title: '経済の「限界費用」', text: 'もう 1 個多く作るときにかかる費用は、費用の式を微分して求める。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'derivative', level: 'calc' },
        {
          id: 'm2d-03-q1',
          type: 'choice',
          level: 'calc',
          prompt: '$y = (2x + 1)^2$ を微分すると？',
          choices: ['$y\' = 8x + 4$', '$y\' = 2(2x + 1)$', '$y\' = 4x + 4$', '$y\' = 8x + 1$'],
          answer: 0,
          hint: '先に展開する。',
          explain: '$(2x + 1)^2 = 4x^2 + 4x + 1$ なので、$y\' = 8x + 4$。かっこの中だけ見て $2(2x + 1)$ とするのはまちがい。',
        },
        { type: 'gen', gen: 'deriv-at', level: 'calc' },
        {
          id: 'm2d-03-q2',
          type: 'mark',
          level: 'exam',
          prompt: '関数 $f(x) = x^3 + ax^2 + bx$ について、$f\'(1) = 4$、$f\'(-1) = 8$ であるとき、a = ［アイ］、b = ［ウ］ である。',
          answers: { ア: '-', イ: '1', ウ: '3' },
          hint: "$f'(x) = 3x^2 + 2ax + b$ に x = 1、−1 を代入する。",
          explain: "$f'(1) = 3 + 2a + b = 4$、$f'(-1) = 3 - 2a + b = 8$。2 式をひくと $4a = -4$ で a = −1、b = 3。",
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: '歯車がなめらかに回りはじめました！ 公式があれば、一瞬で微分できるのですね。' },
        { who: 'michiru', mood: 'normal', text: '傾きがすぐ求められるようになったわ。次は、その傾きで「接線」を引いてみましょう。' },
      ],
    },
  ],
};
