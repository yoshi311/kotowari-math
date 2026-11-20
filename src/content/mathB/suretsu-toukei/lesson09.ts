import type { Lesson } from '../../types';

export const b09: Lesson = {
  id: 'mb-09',
  no: 9,
  title: '推定と検定',
  subtitle: '一部から全体を推しはかる',
  quest: 'ノイズか、本物か',
  card: {
    id: 'card-mb-09',
    name: '真実の星眼',
    term: '区間推定・仮説検定',
    rarity: 3,
    tool: '標本から母平均の信頼区間を求め（推定）、「偶然でも起こりうるか」を確率で判断する（検定）道具',
    formula: '\\overline{X} - 1.96\\dfrac{\\sigma}{\\sqrt{n}} \\le m \\le \\overline{X} + 1.96\\dfrac{\\sigma}{\\sqrt{n}},\\quad |z| > 1.96 \\Rightarrow \\text{棄却}',
    uses: ['テレビの視聴率調査', '新しい薬が本当に効くかの判断', '世論調査（内閣支持率）'],
    color: '#ffd166',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：ノイズか、本物の星か',
      scene: 'observatory',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'think', text: '空のすべての点を調べるのは無理。いくつかの点（標本）を測って、全体の明るさの平均を知りたいの。' },
        { who: 'kai', mood: 'normal', text: 'それに、新しい星を見つけたと思っても、ノイズのせいかもしれないよな。' },
        { who: 'michiru', mood: 'happy', text: '標本から全体の平均の範囲を推しはかるのが「推定」、偶然かどうかを確率で判断するのが「検定」よ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：95% の網',
      lines: [{ who: 'michiru', text: '「区間推定」では、20 回の標本それぞれの信頼区間をかいたわ。n を変えたり、標本をとりなおしたりしてみて。「仮説検定」にも切りかえてね。' }],
      figure: { type: 'estimate' },
      prompts: ['20 本の区間のうち、母平均 50 をふくむのはだいたい何本？', 'n を 100 から 400 にすると、区間のはばはどうなる？'],
      check: {
        id: 'mb-09-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '標本の大きさ n を 4 倍にすると、母平均の信頼区間のはばは何倍になる？',
        choices: ['$\\dfrac{1}{2}$ 倍', '$\\dfrac{1}{4}$ 倍', '2 倍', '変わらない'],
        answer: 0,
        explain: 'はばは $2 \\times 1.96 \\times \\dfrac{\\sigma}{\\sqrt{n}}$。n が 4 倍になると $\\sqrt{n}$ は 2 倍なので、はばは $\\dfrac{1}{2}$ 倍。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '「95%」は、この方法で区間を作ると 100 回中 95 回くらい当たる、という意味なんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：推定と検定',
      tool: '標本から母平均の信頼区間を求め（推定）、「偶然でも起こりうるか」を確率で判断する（検定）道具',
      formulas: ['E(\\overline{X}) = m,\\quad \\sigma(\\overline{X}) = \\dfrac{\\sigma}{\\sqrt{n}}', '\\text{信頼度 95\\%：}\\ \\overline{X} - 1.96\\dfrac{\\sigma}{\\sqrt{n}} \\le m \\le \\overline{X} + 1.96\\dfrac{\\sigma}{\\sqrt{n}}', '\\text{母比率：}\\ \\hat{p} \\pm 1.96\\sqrt{\\dfrac{\\hat{p}(1 - \\hat{p})}{n}}'],
      analogy: {
        title: 'たとえるなら「みそ汁の味見」',
        text: '大なべのみそ汁は、よくかきまぜて 1 さじ味見すれば全体の味がわかる。これが標本調査。1 さじより 2 さじ、3 さじと多くすれば、全体の味の見当（区間）はせまく正確になる。',
      },
      points: [
        '調べたい全体を**母集団**、取り出した一部を**標本**という。標本平均 $\\overline{X}$ のちらばりは $\\dfrac{\\sigma}{\\sqrt{n}}$ で、n が大きいほど小さい。',
        '**仮説検定の手順**：① 帰無仮説（「差はない」「かたよりはない」）をたてる ② それが正しいとして z を計算 ③ 有意水準 5%（両側）なら $|z| > 1.96$ で棄却。',
        '棄却されない＝「差があるとはいえない」。「差がない」と証明されたわけではない。',
        '母標準偏差がわからないときは、n が大きければ標本の標準偏差で代用してよい。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '📺', title: '視聴率', text: '数千世帯の標本から、全国の視聴率を「○% ± ○%」の範囲で推定している。' },
        { icon: '💊', title: '薬の効き目', text: '薬を飲んだグループと飲まないグループの差が「偶然でも起こるくらいか」を検定して、効果を判断する。' },
        { icon: '🗳️', title: '世論調査', text: '約 1000 人に聞くだけで、内閣支持率をおよそ ±3% の範囲で推定できる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'interval', level: 'calc' },
        {
          id: 'mb-09-q1',
          type: 'choice',
          level: 'exam',
          prompt: 'ある工場の製品から 400 個を取り出して調べたところ、80 個が不良品だった。この工場の製品の不良品の割合 p に対する、信頼度 95% の信頼区間は？',
          choices: ['$0.1608 \\le p \\le 0.2392$', '$0.1804 \\le p \\le 0.2196$', '$0.1 \\le p \\le 0.3$', '$0.1216 \\le p \\le 0.2784$'],
          answer: 0,
          hint: '標本比率 $\\hat{p} = \\dfrac{80}{400} = 0.2$、$\\sqrt{\\dfrac{0.2 \\times 0.8}{400}} = 0.02$。',
          explain: '$1.96 \\times 0.02 = 0.0392$。$0.2 \\pm 0.0392$ より $0.1608 \\le p \\le 0.2392$。',
        },
        { type: 'gen', gen: 'test-judge', level: 'exam' },
        {
          id: 'mb-09-q2',
          type: 'mark',
          level: 'exam',
          prompt: '母標準偏差が 12 の母集団から大きさ 144 の標本を取り出したところ、標本平均は 60 であった。母平均 m に対する信頼度 95% の信頼区間は ［アイ］.［ウエ］ ≦ m ≦ ［オカ］.［キク］ である。',
          answers: { ア: '5', イ: '8', ウ: '0', エ: '4', オ: '6', カ: '1', キ: '9', ク: '6' },
          hint: '$\\dfrac{12}{\\sqrt{144}} = 1$ なので、$60 \\pm 1.96 \\times 1$。',
          explain: '$\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{12}{12} = 1$。$60 - 1.96 = 58.04$、$60 + 1.96 = 61.96$ より $58.04 \\le m \\le 61.96$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天文台の星読みステラ', mood: 'happy', text: 'ノイズと本物の星を、確率で見分けられるようになったわ！' },
        { who: 'michiru', mood: 'normal', text: '数列も統計も、すべての理術がそろったわ。星を喰らう影――ノイズのところへ行きましょう。' },
      ],
    },
  ],
};
