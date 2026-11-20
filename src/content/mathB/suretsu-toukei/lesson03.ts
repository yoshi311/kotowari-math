import type { Lesson } from '../../types';

export const b03: Lesson = {
  id: 'mb-03',
  no: 3,
  title: 'Σ 記号と和の公式',
  subtitle: '長い足し算を 1 文字で',
  quest: '星を数える呪文',
  card: {
    id: 'card-mb-03',
    name: 'シグマの呪文書',
    term: 'Σ と和の公式',
    rarity: 3,
    tool: 'Σ 記号で和を短く書き、Σk・Σk² などの公式で一気に計算する道具',
    formula: '\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2},\\quad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}',
    uses: ['表計算ソフトの SUM 関数', 'プログラムのくり返し計算', 'データの平均や分散の計算式'],
    color: '#9b5de5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：三角に並ぶ星',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: '三角形に並んだ星団があるの。上から 1 個、2 個、3 個…と並んで、全部で何個あるのかしら。' },
        { who: 'kai', mood: 'normal', text: '1 + 2 + 3 + … って毎回書くのは面倒だな。もっと短く書けないのか？' },
        { who: 'michiru', mood: 'happy', text: 'Σ（シグマ）という記号を使えば、長い和を 1 文字で書けるの。和の公式もセットで覚えましょう。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：点を組み合わせる',
      lines: [{ who: 'michiru', text: 'n を動かしてね。三角形の点の数を、長方形を使って数えるくふうが見えるわ。' }],
      figure: { type: 'sigmaDots' },
      prompts: ['n = 5 のとき、青い点と桃色の点を合わせた長方形は、たて何個・よこ何個？', '「1 + 3 + 5 + …」にすると、いつもどんな形になる？'],
      check: {
        id: 'mb-03-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\displaystyle\\sum_{k=1}^{10} k$ の値は？',
        choices: ['$55$', '$110$', '$100$', '$45$'],
        answer: 0,
        explain: '$1 + 2 + \\cdots + 10$ のこと。長方形はたて 10、よこ 11 で 110 個、その半分で $\\dfrac{10 \\times 11}{2} = 55$。',
      },
      after: [{ who: 'zero', mood: 'happy', text: 'Σ の下が「どこから」、上が「どこまで」。読み方がわかれば、こわくないね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：Σ と和の公式',
      tool: 'Σ 記号で和を短く書き、Σk・Σk² などの公式で一気に計算する道具',
      formulas: ['\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n', '\\sum_{k=1}^{n} c = cn,\\quad \\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2},\\quad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}', '\\sum_{k=1}^{n} (pa_k + qb_k) = p\\sum_{k=1}^{n} a_k + q\\sum_{k=1}^{n} b_k'],
      analogy: {
        title: 'たとえるなら「くり返しの指示書」',
        text: '「k を 1 から n まで変えながら、a_k を全部足しなさい」という指示を、Σ の 1 文字にまとめたもの。プログラムのくり返し（for 文）と同じ考え方。',
      },
      points: [
        '$\\displaystyle\\sum_{k=1}^{n} c = cn$：定数 c は n 回足すので cn。1 回だけにしないこと。',
        '式が組み合わさっていても、**項ごとに分けて**公式を使う。例：$\\sum (2k + 1) = 2 \\cdot \\dfrac{n(n + 1)}{2} + n = n^2 + 2n$。',
        '$\\displaystyle\\sum_{k=1}^{n} k^3 = \\left\\{\\dfrac{n(n + 1)}{2}\\right\\}^2$ もある。',
        '等比数列の和も Σ で書ける：$\\displaystyle\\sum_{k=1}^{n} 2^{k-1} = 2^n - 1$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '📊', title: '表計算の SUM', text: 'スプレッドシートの SUM 関数は、Σ と同じ「範囲をまとめて足す」はたらき。' },
        { icon: '💻', title: 'プログラムのくり返し', text: 'for 文で 1 から n まで足す計算は Σ そのもの。公式を使うと、くり返さずに一瞬で答えが出る。' },
        { icon: '📈', title: '平均と分散', text: 'データの平均は $\\dfrac{1}{n}\\sum x_k$、分散も Σ で書かれる。統計の式は Σ だらけ。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'sigma-sum', level: 'calc' },
        {
          id: 'mb-03-q1',
          type: 'choice',
          level: 'meaning',
          prompt: '$1^2 + 2^2 + 3^2 + \\cdots + n^2$ を表す式は？',
          choices: ['$\\dfrac{n(n + 1)(2n + 1)}{6}$', '$\\dfrac{n(n + 1)}{2}$', '$n^3$', '$\\left\\{\\dfrac{n(n + 1)}{2}\\right\\}^2$'],
          answer: 0,
          hint: 'n = 2 を代入して $1 + 4 = 5$ になるものを探してもよい。',
          explain: '$\\sum k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$。n = 2 なら $\\dfrac{2 \\cdot 3 \\cdot 5}{6} = 5$ で合っている。$\\left\\{\\dfrac{n(n + 1)}{2}\\right\\}^2$ は $\\sum k^3$。',
        },
        { type: 'gen', gen: 'geo-sum', level: 'calc' },
        {
          id: 'mb-03-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$\\displaystyle\\sum_{k=1}^{n} (2k + 1)$ = $n^2$ + ［ア］n である。また、$\\displaystyle\\sum_{k=1}^{10} k^2$ = ［イウエ］ である。',
          answers: { ア: '2', イ: '3', ウ: '8', エ: '5' },
          hint: '$\\sum 2k = n(n + 1)$、$\\sum 1 = n$。後半は $\\dfrac{10 \\cdot 11 \\cdot 21}{6}$。',
          explain: '$2 \\cdot \\dfrac{n(n + 1)}{2} + n = n^2 + 2n$。$\\dfrac{10 \\times 11 \\times 21}{6} = 385$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: '三角の星団は全部で 55 個…ぴったりそろったわ！' },
        { who: 'michiru', mood: 'normal', text: '次は、きまりが見えにくい列。となりどうしの「差」に目をつけると、かくれたきまりが見つかるわ。' },
      ],
    },
  ],
};
