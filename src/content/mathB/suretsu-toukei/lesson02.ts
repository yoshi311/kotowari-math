import type { Lesson } from '../../types';

export const b02: Lesson = {
  id: 'mb-02',
  no: 2,
  title: '等比数列とその和',
  subtitle: '同じ数ずつかける列',
  quest: '倍々に輝く星',
  card: {
    id: 'card-mb-02',
    name: '倍光の宝珠',
    term: '等比数列',
    rarity: 2,
    tool: '同じ数（公比）ずつかけていく列の第 n 項と、S − rS で和を求める道具',
    formula: 'a_n = ar^{n-1},\\quad S_n = \\dfrac{a(r^n - 1)}{r - 1}\\ (r \\ne 1)',
    uses: ['複利で増える預金やローンの計算', '細菌やウイルスの増え方', '音階（ドからドで周波数が 2 倍）'],
    color: '#06d6a0',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：明るさが倍になる星',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: 'この星座は、となりの星へ進むたびに明るさが 2 倍になるの。1、2、4、8…。' },
        { who: 'kai', mood: 'surprised', text: '倍々か！ 10 番目なんて、とんでもない明るさになりそうだな。' },
        { who: 'michiru', mood: 'happy', text: '同じ数ずつかける列を「等比数列」というの。和にも、きれいな求め方があるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：倍々の棒',
      lines: [{ who: 'michiru', text: '公比を 2、3、1/2 に変えてみて。下の式で、S と rS をずらして引くと何が残るかも見てね。' }],
      figure: { type: 'geoSeq' },
      prompts: ['公比 2 と 3 で、棒の伸び方はどうちがう？', '公比 1/2 にすると、和はどんな数に近づいていく？'],
      check: {
        id: 'mb-02-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '等比数列 $1,\\ 2,\\ 4,\\ 8,\\ \\cdots$ の第 10 項は？',
        choices: ['$512$', '$1024$', '$20$', '$256$'],
        answer: 0,
        explain: '初項 1、公比 2。第 10 項までに 2 をかけるのは 9 回なので、$2^9 = 512$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'かける回数も (n − 1) 回。等差数列とそっくりのしくみだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：等比数列',
      tool: '同じ数（公比）ずつかけていく列の第 n 項と、S − rS で和を求める道具',
      formulas: ['a_n = ar^{n-1}', 'S_n = \\dfrac{a(r^n - 1)}{r - 1} = \\dfrac{a(1 - r^n)}{1 - r}\\quad(r \\ne 1)', 'r = 1 \\text{ のとき } S_n = na'],
      analogy: {
        title: 'たとえるなら「ねずみ算」',
        text: '1 ぴきが毎月 2 ひきになると、2、4、8、16…と倍々に増える。足し算の階段（等差）よりずっと急に増えるのが、かけ算の列（等比）の特ちょう。',
      },
      points: [
        'となりへの倍率（**公比** r）がいつも同じ列が等比数列。',
        '**和のくふう**：$S - rS$ を計算すると、まん中の項がすべて消えて $a - ar^n$ が残る。',
        'r > 1 のときは $\\dfrac{a(r^n - 1)}{r - 1}$、r < 1 のときは $\\dfrac{a(1 - r^n)}{1 - r}$ を使うと、分母が正になって計算しやすい。',
        '公比が負なら、項の符号が＋−＋−と入れかわる。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏦', title: '複利の預金', text: '年利 2% なら、毎年 1.02 倍。10 年後の金額や、毎年積み立てたときの合計は等比数列で計算する。' },
        { icon: '🦠', title: '細菌の増え方', text: '20 分ごとに 2 倍になる細菌は、等比数列のように一気に増える。感染症の広がりの予測にも使われる。' },
        { icon: '🎹', title: '音階', text: 'ピアノの鍵盤は、1 つ右へ進むごとに周波数が約 1.06 倍。12 個進むとちょうど 2 倍になる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'geo-sum', level: 'calc' },
        {
          id: 'mb-02-q1',
          type: 'choice',
          level: 'calc',
          prompt: '等比数列 $2,\\ 6,\\ 18,\\ \\cdots$ の初項から第 5 項までの和は？',
          choices: ['$242$', '$162$', '$80$', '$486$'],
          answer: 0,
          hint: '初項 2、公比 3。$S_5 = \\dfrac{2(3^5 - 1)}{3 - 1}$',
          explain: '$\\dfrac{2(243 - 1)}{2} = 242$。書き出しても $2 + 6 + 18 + 54 + 162 = 242$。162 は第 5 項だけ。',
        },
        { type: 'gen', gen: 'arith-sum', level: 'calc' },
        {
          id: 'mb-02-q2',
          type: 'mark',
          level: 'exam',
          prompt: '第 2 項が 6、第 4 項が 54 で、公比が正である等比数列の初項は ［ア］、公比は ［イ］ であり、初項から第 5 項までの和は ［ウエオ］ である。',
          answers: { ア: '2', イ: '3', ウ: '2', エ: '4', オ: '2' },
          hint: '第 2 項に公比を 2 回かけると第 4 項。$r^2 = \\dfrac{54}{6}$',
          explain: '$r^2 = 9$、r > 0 より r = 3。初項は $6 \\div 3 = 2$。和は $\\dfrac{2(3^5 - 1)}{3 - 1} = 242$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: '倍々に輝く星座がよみがえったわ。こんなに明るかったのね！' },
        { who: 'michiru', mood: 'normal', text: '和をたくさん書くと長くなるわね。次は、和を短く書く記号 Σ を使いこなしましょう。' },
      ],
    },
  ],
};
