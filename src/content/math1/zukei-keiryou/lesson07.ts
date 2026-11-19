import type { Lesson } from '../../types';

export const t07: Lesson = {
  id: 'm1t-07',
  no: 7,
  title: '三角形の面積と内接円',
  subtitle: '高さは sin でつくる',
  quest: '灯台の花畑と円いレンズ',
  card: {
    id: 'card-m1t-07',
    name: '広さの秤',
    term: '三角形の面積・内接円の半径',
    rarity: 2,
    tool: '高さを測らなくても、2 辺とあいだの角から三角形の面積を求め、内接円の大きさも求める道具',
    formula: 'S = \\dfrac{1}{2}bc\\sin A,\\quad S = \\dfrac{1}{2}r(a + b + c)',
    uses: ['土地の面積の測量', '3DCG のポリゴンの面積', '部品にぴったり入る円の設計'],
    color: '#ff9f1c',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：三角形の花畑の広さ',
      scene: 'lighthouse',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'happy', text: '灯台のまわりの三角形の土地に、花畑を作ろうと思ってね。2 辺は 4m と 5m、そのあいだの角は 60° なんだ。' },
        { who: 'npc', npcName: '灯台守のナギ', mood: 'think', text: '種を買うのに広さが知りたいんだけど、高さがわからなくてね。' },
        { who: 'zero', mood: 'think', text: '三角形の面積は「底辺 × 高さ ÷ 2」。でも高さが…。' },
        { who: 'michiru', mood: 'happy', text: '高さは sin でつくれるの。三角比が、面積の計算にも使えるのよ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：高さを sin でつくる',
      lines: [{ who: 'michiru', text: '2 辺 a、b とあいだの角 C を変えてみて。点線の高さが $b\\sin C$ になっているわ。' }],
      figure: { type: 'triArea' },
      prompts: ['角 C を変えると、高さと面積はどう変わる？', '面積がいちばん大きくなるのは、角 C が何度のとき？', '角 C を鈍角にしても、高さは $b\\sin C$ で求められる？'],
      check: {
        id: 'm1t-07-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '2 辺 a、b の長さを変えずに角 C を動かすとき、三角形の面積が最大になるのは？',
        choices: ['$C = 30^\\circ$', '$C = 60^\\circ$', '$C = 90^\\circ$', '$C = 150^\\circ$'],
        answer: 2,
        explain: '面積は $\\dfrac{1}{2}ab\\sin C$。$\\sin C$ がいちばん大きい（1 になる）のは $C = 90^\\circ$ のとき。',
      },
    },
    {
      kind: 'concept',
      title: 'ことばにする：面積と内接円',
      tool: '高さを測らなくても、2 辺とあいだの角から三角形の面積を求め、内接円の大きさも求める道具',
      analogy: {
        title: 'たとえるなら「三角形を 3 つの小さな三角形に分ける」',
        text: '三角形の中にぴったり入る円（内接円）の中心から、3 つの頂点に線を引くと、高さがどれも半径 r の小さな三角形が 3 つできる。その面積をたすと $\\dfrac{1}{2}ra + \\dfrac{1}{2}rb + \\dfrac{1}{2}rc$。だから全体の面積は $\\dfrac{1}{2}r(a + b + c)$。',
      },
      formulas: [
        'S = \\dfrac{1}{2}bc\\sin A = \\dfrac{1}{2}ca\\sin B = \\dfrac{1}{2}ab\\sin C',
        'S = \\dfrac{1}{2}r(a + b + c)',
      ],
      points: [
        '**2 辺とあいだの角**がわかれば、$S = \\dfrac{1}{2} \\times (\\text{2 辺の積}) \\times \\sin(\\text{あいだの角})$。',
        '**3 辺しかわからない**ときは、① 余弦定理で cos → ② $\\sin^2 + \\cos^2 = 1$ で sin → ③ 面積、の順で求める（共通テストの定番）。',
        '**内接円の半径** $r$ は、面積 $S$ を出してから $r = \\dfrac{2S}{a + b + c}$。',
        '四角形の面積は、対角線で 2 つの三角形に分けて求める。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        {
          icon: '🌾',
          title: '土地の面積',
          text: '形のふぞろいな土地も、いくつかの三角形に分けて、辺と角を測れば面積が計算できる。土地の売買や農地の管理に使われている。',
        },
        {
          icon: '🎮',
          title: '3DCG のポリゴン',
          text: 'ゲームや映画の3Dモデルは、何万もの小さな三角形（ポリゴン）でできている。光の当たり方を計算するのに、三角形の面積や向きを使う。',
        },
        {
          icon: '⚙️',
          title: 'ぴったり入る円',
          text: '三角形の部品の中に、できるだけ大きな円い穴をあけたいとき、その円が内接円。機械部品や家具の設計で使われる。',
        },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'area-sin', level: 'calc' },
        {
          id: 'm1t-07-q1',
          type: 'mark',
          level: 'calc',
          prompt: '$\\triangle ABC$ で $b = 4$、$c = 5$、$A = 60^\\circ$ のとき、面積は ［ア］$\\sqrt{\\phantom{0}}$［イ］',
          answers: { ア: '5', イ: '3' },
          hint: '$S = \\dfrac{1}{2} \\times 4 \\times 5 \\times \\sin 60^\\circ$',
          explain: '$S = \\dfrac{1}{2} \\times 20 \\times \\dfrac{\\sqrt{3}}{2} = 5\\sqrt{3}$（約 8.66 m²）。',
        },
        {
          id: 'm1t-07-q2',
          type: 'choice',
          level: 'meaning',
          prompt: '内接円の半径 r を使った面積の式 $S = \\dfrac{1}{2}r(a + b + c)$ は、どうやって作られた？',
          choices: [
            '内接円の中心と 3 つの頂点を結んでできる、高さ r の 3 つの三角形の面積をたした',
            '円の面積 $\\pi r^2$ から計算した',
            '正弦定理を変形した',
            '三角形を 2 つに分けた',
          ],
          answer: 0,
          explain: '中心から各辺までの距離はどれも r。3 つの三角形 $\\dfrac{1}{2}ar$、$\\dfrac{1}{2}br$、$\\dfrac{1}{2}cr$ をたすと全体の面積になる。',
        },
        {
          id: 'm1t-07-q3',
          type: 'mark',
          level: 'exam',
          prompt:
            '3 辺が $a = 7$、$b = 5$、$c = 3$ の $\\triangle ABC$ では $A = 120^\\circ$ である（依頼6）。\nこの三角形の面積は ［アイ］$\\sqrt{\\phantom{0}}$［ウ］／［エ］、内接円の半径は $\\sqrt{\\phantom{0}}$［オ］／［カ］ である。',
          answers: { ア: '1', イ: '5', ウ: '3', エ: '4', オ: '3', カ: '2' },
          hint: '$S = \\dfrac{1}{2} \\times 5 \\times 3 \\times \\sin 120^\\circ$。$r = \\dfrac{2S}{a + b + c}$',
          explain: '$S = \\dfrac{15}{2} \\times \\dfrac{\\sqrt{3}}{2} = \\dfrac{15\\sqrt{3}}{4}$。$r = \\dfrac{2S}{15} = \\dfrac{15\\sqrt{3}}{2} \\div 15 = \\dfrac{\\sqrt{3}}{2}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'happy', text: '約 8.7 m² だね。これで種を買いに行けるよ。春には花でいっぱいになるさ。' },
        { who: 'zero', mood: 'happy', text: '高さを測らなくても面積がわかる！ sin って、なんでも作れちゃうね。' },
        { who: 'michiru', mood: 'normal', text: '最後は、平面をこえて「立体」に挑戦よ。' },
      ],
    },
  ],
};
