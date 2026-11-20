import type { Lesson } from '../../types';

export const b05: Lesson = {
  id: 'mb-05',
  no: 5,
  title: '漸化式',
  subtitle: '前の項から次の項を作るルール',
  quest: '星の連鎖反応',
  card: {
    id: 'card-mb-05',
    name: '連鎖の星環',
    term: '漸化式',
    rarity: 3,
    tool: 'aₙ₊₁ = paₙ + q の形のルールを、α を使って等比数列に変え、一般項を求める道具',
    formula: 'a_{n+1} - \\alpha = p(a_n - \\alpha)\\quad(\\alpha = p\\alpha + q)',
    uses: ['ローンの残高の計算（毎月の利息と返済）', '薬の血中濃度の変化', '人口や生き物の数の予測'],
    color: '#ffd166',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：ルールでつながる星',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: 'この星座は「となりの星の明るさは、前の星の半分に 3 を足したもの」というルールでつながっているの。' },
        { who: 'kai', mood: 'normal', text: '最初が 0 なら、3、4.5、5.25…。どこまでも続けたら、どうなるんだ？' },
        { who: 'michiru', mood: 'happy', text: '前の項から次の項を決めるルールを「漸化式」というの。ルールのかくれた中心を見つければ、一般項がわかるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：金の線に近づく？',
      lines: [{ who: 'michiru', text: 'かける数 p と足す数 q を変えてみて。金の線 α からのずれが、毎回どうなるかに注目ね。' }],
      figure: { type: 'recurrence' },
      prompts: ['p = 1/2 のとき、棒は金の線に近づく？ 遠ざかる？', 'p = −1/2 にすると、近づき方はどう変わる？ p = 2 では？'],
      check: {
        id: 'mb-05-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$a_1 = 0$、$a_{n+1} = \\dfrac{1}{2}a_n + 3$ で決まる数列は、n を大きくするとどんな値に近づく？',
        choices: ['$6$', '$3$', '$0$', '限りなく大きくなる'],
        answer: 0,
        explain: '$\\alpha = \\dfrac{1}{2}\\alpha + 3$ より α = 6。6 からのずれが毎回 $\\dfrac{1}{2}$ 倍になるので、6 にどんどん近づく。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'α からのずれは等比数列なんだ！ だから一般項が求められるんだね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：漸化式',
      tool: 'aₙ₊₁ = paₙ + q の形のルールを、α を使って等比数列に変え、一般項を求める道具',
      formulas: ['a_{n+1} = a_n + d \\Rightarrow \\text{等差数列},\\quad a_{n+1} = ra_n \\Rightarrow \\text{等比数列}', 'a_{n+1} = pa_n + q:\\ \\alpha = p\\alpha + q \\text{ として } a_{n+1} - \\alpha = p(a_n - \\alpha)', 'a_{n+1} = a_n + f(n) \\Rightarrow \\text{階差数列が } f(n)'],
      analogy: {
        title: 'たとえるなら「お湯の冷め方」',
        text: '熱いお湯は、部屋の温度との差が毎分同じ割合で小さくなる。部屋の温度が α、差が等比数列で小さくなっていくのと同じしくみ。',
      },
      points: [
        '**手順**：① α = pα + q を解く（**特性方程式**）② $\\{a_n - \\alpha\\}$ は初項 $a_1 - \\alpha$、公比 p の等比数列 ③ $a_n = (a_1 - \\alpha)p^{n-1} + \\alpha$。',
        '例：$a_1 = 1$、$a_{n+1} = 2a_n + 1$ → α = −1、$a_n + 1 = 2 \\cdot 2^{n-1}$ より $a_n = 2^n - 1$。',
        '$a_{n+1} = a_n + (n \\text{ の式})$ の形は、階差数列として解く。',
        '**数学的帰納法**：「n = 1 で成り立つ」「n = k で成り立てば n = k + 1 でも成り立つ」を示すと、すべての n で成り立つ（ドミノだおし）。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏠', title: 'ローンの残高', text: '「来月の残高 = 今月の残高 × (1 + 利率) − 返済額」は、まさに $a_{n+1} = pa_n + q$ の形。' },
        { icon: '💊', title: '薬の濃度', text: '毎日同じ量の薬を飲み、体内で一定の割合が分解されると、濃度は α に近づいていく。' },
        { icon: '🐟', title: '魚の数の予測', text: '「来年の数 = 今年の数 × 増える割合 − とる数」で、資源が守れるかを調べる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'recurrence', level: 'calc' },
        {
          id: 'mb-05-q1',
          type: 'choice',
          level: 'calc',
          prompt: '$a_1 = 1$、$a_{n+1} = 2a_n + 1$ で定められる数列の一般項は？',
          choices: ['$a_n = 2^n - 1$', '$a_n = 2^{n-1}$', '$a_n = 2^n + 1$', '$a_n = 2n - 1$'],
          answer: 0,
          hint: '$\\alpha = 2\\alpha + 1$ より α = −1。$a_{n+1} + 1 = 2(a_n + 1)$',
          explain: '$\\{a_n + 1\\}$ は初項 2、公比 2 の等比数列なので $a_n + 1 = 2^n$、$a_n = 2^n - 1$。たしかめ：1、3、7、15…。',
        },
        { type: 'gen', gen: 'diff-seq', level: 'calc' },
        {
          id: 'mb-05-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$a_1 = 4$、$a_{n+1} = 3a_n - 4$ で定められる数列 $\\{a_n\\}$ がある。$a_{n+1} - \\alpha = 3(a_n - \\alpha)$ となる α は ［ア］ である。数列 $\\{a_n - \\alpha\\}$ は初項 ［イ］、公比 3 の等比数列なので、$a_4$ = ［ウエ］ である。',
          answers: { ア: '2', イ: '2', ウ: '5', エ: '6' },
          hint: '$\\alpha = 3\\alpha - 4$ を解く。',
          explain: 'α = 2。$a_1 - 2 = 2$ なので $a_n - 2 = 2 \\cdot 3^{n-1}$、$a_4 = 2 \\times 27 + 2 = 56$。たしかめ：4、8、20、56。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: 'ルールでつながる星座が、きれいにそろったわ。数列の理術はこれで全部ね。' },
        { who: 'michiru', mood: 'normal', text: 'ここからは天文台の観測室。ノイズにまどわされずに、データから真実を読む「統計」の理術よ。' },
      ],
    },
  ],
};
