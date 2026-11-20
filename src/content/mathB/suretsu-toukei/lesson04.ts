import type { Lesson } from '../../types';

export const b04: Lesson = {
  id: 'mb-04',
  no: 4,
  title: '階差数列と和からの一般項',
  subtitle: 'となりの差に目をつける',
  quest: 'かくれたきまりの星列',
  card: {
    id: 'card-mb-04',
    name: '差分のレンズ',
    term: '階差数列',
    rarity: 3,
    tool: 'となりどうしの差（階差数列）や和 Sₙ から、もとの数列の一般項を求める道具',
    formula: 'a_n = a_1 + \\sum_{k=1}^{n-1} b_k\\ (n \\ge 2),\\quad a_n = S_n - S_{n-1}\\ (n \\ge 2)',
    uses: ['データの増え方の変化を調べる', '数列のきまりを見ぬく（パズル・知能テスト）', 'コンピュータの差分計算'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：等差でも等比でもない列',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: 'この星の列は 1、2、4、7、11…。等差数列でも等比数列でもないの。' },
        { who: 'kai', mood: 'think', text: '差が 1、2、3、4…と増えてるな。これもきまりなのか？' },
        { who: 'michiru', mood: 'happy', text: 'となりの差を並べた列を「階差数列」というの。差の列のきまりから、もとの列の一般項が求められるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：差の列',
      lines: [{ who: 'michiru', text: '上の段がもとの数列、下の段がとなりとの差（階差数列）よ。見る項 k を動かして、何個の差を足しているか数えてね。' }],
      figure: { type: 'diffSeq' },
      prompts: ['第 5 項を求めるとき、階差はいくつ足している？', '階差数列の係数を変えると、上の数列の増え方はどう変わる？'],
      check: {
        id: 'mb-04-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '数列 $1,\\ 2,\\ 4,\\ 7,\\ 11,\\ \\cdots$ の次の項は？',
        choices: ['$16$', '$15$', '$14$', '$17$'],
        answer: 0,
        explain: '差は 1、2、3、4 と 1 ずつ増えるので、次の差は 5。$11 + 5 = 16$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '第 k 項は、初項に差を (k − 1) 個足したもの。ここでも「1 つ少ない」が出てきた！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：階差数列と和',
      tool: 'となりどうしの差（階差数列）や和 Sₙ から、もとの数列の一般項を求める道具',
      formulas: ['b_n = a_{n+1} - a_n', 'a_n = a_1 + \\sum_{k=1}^{n-1} b_k\\quad(n \\ge 2)', 'a_1 = S_1,\\quad a_n = S_n - S_{n-1}\\quad(n \\ge 2)'],
      analogy: {
        title: 'たとえるなら「毎日の歩数の記録から、合計の地点を知る」',
        text: '出発点（初項）と、毎日どれだけ進んだか（階差）がわかれば、何日目にどこにいるかは「出発点 + それまでの進んだ量の合計」で求められる。',
      },
      points: [
        '**階差数列の手順**：① 差を書き出して $b_n$ を求める ② $a_n = a_1 + \\sum_{k=1}^{n-1} b_k$（n ≧ 2）③ n = 1 でも成り立つか確かめる。',
        '$\\sum_{k=1}^{n-1}$ は、公式の n を **n − 1** にかえて使う。例：$\\sum_{k=1}^{n-1} k = \\dfrac{(n - 1)n}{2}$。',
        '**和 $S_n$ から一般項**：$a_n = S_n - S_{n-1}$ は n ≧ 2 のときだけ。$a_1 = S_1$ と別に確かめる。',
        '例：$S_n = n^2 + 3n + 1$ なら $a_1 = 5$、n ≧ 2 で $a_n = 2n + 2$（n = 1 では 4 になり、合わない）。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '📉', title: 'データの変化', text: '売上の「前の月との差」を並べると、増え方が加速しているか、落ちついてきたかがわかる。' },
        { icon: '🧩', title: '数列パズル', text: '「次に入る数は？」というパズルの多くは、階差を調べると解ける。' },
        { icon: '🖥️', title: '差分計算', text: '動画の圧縮では、前のコマとの「差」だけを記録してデータを小さくしている。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'diff-seq', level: 'calc' },
        {
          id: 'mb-04-q1',
          type: 'choice',
          level: 'calc',
          prompt: '初項から第 n 項までの和が $S_n = n^2 + 2n$ である数列の一般項 $a_n$ は？',
          choices: ['$a_n = 2n + 1$', '$a_n = 2n - 1$', '$a_n = n^2 + 2n$', '$a_n = 2n + 3$'],
          answer: 0,
          hint: '$a_1 = S_1$、n ≧ 2 では $a_n = S_n - S_{n-1}$。',
          explain: '$a_1 = S_1 = 3$。n ≧ 2 で $a_n = (n^2 + 2n) - \\{(n - 1)^2 + 2(n - 1)\\} = 2n + 1$。n = 1 でも 3 になるので、$a_n = 2n + 1$。',
        },
        { type: 'gen', gen: 'sigma-sum', level: 'calc' },
        {
          id: 'mb-04-q2',
          type: 'mark',
          level: 'exam',
          prompt: '初項から第 n 項までの和が $S_n = n^2 + 3n + 1$ である数列 $\\{a_n\\}$ について、$a_1$ = ［ア］ であり、n ≧ 2 のとき $a_n$ = ［イ］n + ［ウ］ である。',
          answers: { ア: '5', イ: '2', ウ: '2' },
          hint: '$a_1 = S_1$。n ≧ 2 では $S_n - S_{n-1}$ を計算する。',
          explain: '$a_1 = 1 + 3 + 1 = 5$。n ≧ 2 で $a_n = (n^2 + 3n + 1) - \\{(n - 1)^2 + 3(n - 1) + 1\\} = 2n + 2$。n = 1 を入れると 4 で $a_1 = 5$ と合わないので、分けて答える。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: 'かくれたきまりの星列も、ちゃんと光ったわ。差を見るって大事なのね。' },
        { who: 'michiru', mood: 'normal', text: '次は「前の項から次の項を作るルール」――漸化式よ。ルールから一般項を見つけましょう。' },
      ],
    },
  ],
};
