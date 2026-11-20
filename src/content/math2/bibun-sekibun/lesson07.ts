import type { Lesson } from '../../types';

export const d07: Lesson = {
  id: 'm2d-07',
  no: 7,
  title: '不定積分',
  subtitle: '微分を逆にたどる',
  quest: '消えた元の曲線',
  card: {
    id: 'card-m2d-07',
    name: '逆まわりの時計',
    term: '不定積分',
    rarity: 2,
    tool: '微分すると f(x) になる関数（原始関数）を求め、積分定数 C を条件から決める道具',
    formula: '\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C\\quad(n = 0, 1, 2, \\cdots)',
    uses: ['速さの記録から位置を求める', '傾きの情報から曲線の形を復元する', '物理の運動の計算'],
    color: '#06d6a0',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：傾きだけが残った',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'sad', text: '7 階の設計図は、ゼノンに曲線を消されてしまいました。残っているのは「各点の傾きは 2x」というメモだけです。' },
        { who: 'kai', mood: 'think', text: '微分すると 2x になる関数…$x^2$ だな！ これで元どおりだ。' },
        { who: 'michiru', mood: 'think', text: '本当に $x^2$ だけかしら。$x^2 + 1$ を微分しても 2x になるわよ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：上下にずらしても',
      lines: [{ who: 'michiru', text: 'C を動かしてグラフを上下にずらしてみて。x = 1 での接線の傾きは変わる？' }],
      figure: { type: 'antideriv' },
      prompts: ['C を変えると、金色の接線の傾きは変わる？', '微分すると 2x になる関数は、何個ある？'],
      check: {
        id: 'm2d-07-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '微分すると $2x$ になる関数は？',
        choices: ['$x^2 + C$（C は定数）', '$x^2$ だけ', '$2$', '$2x^2$'],
        answer: 0,
        explain: '定数は微分すると 0 になるので、$x^2$、$x^2 + 1$、$x^2 - 3$ …どれも微分すると 2x。まとめて $x^2 + C$ と書く。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '上下にずらしても傾きは同じ！ だから「+ C」がつくんだね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：不定積分',
      tool: '微分すると f(x) になる関数（原始関数）を求め、積分定数 C を条件から決める道具',
      formulas: ["F'(x) = f(x) \\text{ のとき } \\int f(x)\\,dx = F(x) + C", '\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C', '\\int \\{kf(x) + lg(x)\\}\\,dx = k\\int f(x)\\,dx + l\\int g(x)\\,dx'],
      analogy: {
        title: 'たとえるなら「足あとから出発点をさがす」',
        text: '歩いた向きと速さ（傾き）の記録があれば、どう歩いたかの形はわかる。でも、どこから出発したか（高さ C）は、もう 1 つ情報がないと決まらない。',
      },
      points: [
        '**微分の逆**：指数を 1 増やして、その数でわる。$\\int 3x^2\\,dx = x^3 + C$、$\\int 4x\\,dx = 2x^2 + C$、$\\int 5\\,dx = 5x + C$。',
        'C を**積分定数**という。答えには必ず「+ C（C は積分定数）」をつける。',
        '「$F(1) = 3$」のような条件があれば、代入して C を決められる。',
        '確かめ算：答えを微分して、元の式にもどれば正解。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🛰️', title: '速さから位置へ', text: '人工衛星やスマホは、加速度の記録を積分して速さを、さらに積分して位置を求める（出発点の情報で C を決める）。' },
        { icon: '🗺️', title: '坂の情報から地形を', text: '各地点の傾きのデータから、地面の高さの形を復元できる。' },
        { icon: '💧', title: '水そうにたまる水', text: '1 秒ごとに入る水の量（変化の速さ）を積分すると、たまった水の量になる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'indefinite', level: 'calc' },
        {
          id: 'm2d-07-q1',
          type: 'choice',
          level: 'calc',
          prompt: '不定積分 $\\displaystyle\\int (3x^2 - 4x + 1)\\,dx$ は？（C は積分定数）',
          choices: ['$x^3 - 2x^2 + x + C$', '$6x - 4 + C$', '$3x^3 - 4x^2 + x + C$', '$x^3 - 4x^2 + x + C$'],
          answer: 0,
          hint: '項ごとに、指数を 1 増やしてその数でわる。',
          explain: '$\\dfrac{3x^3}{3} - \\dfrac{4x^2}{2} + x + C = x^3 - 2x^2 + x + C$。微分すると $3x^2 - 4x + 1$ にもどる。$6x - 4$ は微分してしまった答え。',
        },
        { type: 'gen', gen: 'derivative', level: 'calc' },
        {
          id: 'm2d-07-q2',
          type: 'mark',
          level: 'exam',
          prompt: '曲線 $y = f(x)$ 上の各点 $(x,\\ f(x))$ における接線の傾きが $6x - 2$ で、この曲線が点 $(1,\\ 3)$ を通るとき、$f(x)$ = ［ア］$x^2$ − ［イ］x + ［ウ］ である。',
          answers: { ア: '3', イ: '2', ウ: '2' },
          hint: "$f'(x) = 6x - 2$ を積分して、$f(1) = 3$ から C を決める。",
          explain: '$f(x) = \\int (6x - 2)\\,dx = 3x^2 - 2x + C$。$f(1) = 3 - 2 + C = 3$ より C = 2。$f(x) = 3x^2 - 2x + 2$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: '傾きのメモと、点 1 つの情報から、設計図の曲線がよみがえりました！' },
        { who: 'michiru', mood: 'normal', text: '積分には、もう 1 つの顔があるの。次の階では「面積」を求めてみましょう。' },
      ],
    },
  ],
};
