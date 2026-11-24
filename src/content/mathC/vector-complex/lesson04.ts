import type { Lesson } from '../../types';

export const c04: Lesson = {
  id: 'mc-04',
  no: 4,
  title: '位置ベクトル',
  subtitle: '点をベクトルで表す',
  quest: '城門のつり合いの点',
  card: {
    id: 'card-mc-04',
    name: '重心の宝玉',
    term: '位置ベクトル・分点・重心',
    rarity: 3,
    tool: '点を原点からのベクトルで表し、内分点・外分点・重心や、3 点が一直線にあるかを計算する道具',
    formula: '\\vec{p} = \\dfrac{n\\vec{a} + m\\vec{b}}{m + n},\\quad \\vec{g} = \\dfrac{\\vec{a} + \\vec{b} + \\vec{c}}{3}',
    uses: ['物体の重心（つり合う点）の計算', 'CG のなめらかな動き（2 点のあいだを補う）', '地図アプリでの中間地点'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：つり合う点',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '城門は三角形の板。重さがつり合う点を支えないと、門がかたむいてしまうの。' },
        { who: 'kai', mood: 'normal', text: '三角形のつり合う点…重心か。どうやって場所を計算するんだ？' },
        { who: 'michiru', mood: 'happy', text: '点の場所を、原点からのベクトルで表すの。そうすると、重心もかんたんな式で書けるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：m : n に分ける点',
      lines: [{ who: 'michiru', text: 'm と n を変えて、点 P の位置と式を見てね。「外分」にも切りかえてみて。' }],
      figure: { type: 'vecDiv' },
      prompts: ['m = n のとき、点 P はどこにある？', '外分で m を n より大きくすると、P は A 側と B 側のどちらの外にある？'],
      check: {
        id: 'mc-04-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '線分 AB を 2 : 1 に内分する点 P の位置ベクトル $\\vec{p}$ は？',
        choices: ['$\\dfrac{\\vec{a} + 2\\vec{b}}{3}$', '$\\dfrac{2\\vec{a} + \\vec{b}}{3}$', '$\\dfrac{\\vec{a} + \\vec{b}}{2}$', '$2\\vec{a} - \\vec{b}$'],
        answer: 0,
        explain: 'P は B に近い（A から 2、B から 1）ので、B の重みが大きい。$\\dfrac{1 \\cdot \\vec{a} + 2\\vec{b}}{2 + 1}$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'm は B に、n は A にかける。たすきがけみたいだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：位置ベクトル',
      tool: '点を原点からのベクトルで表し、内分点・外分点・重心や、3 点が一直線にあるかを計算する道具',
      formulas: ['\\text{内分}：\\vec{p} = \\dfrac{n\\vec{a} + m\\vec{b}}{m + n},\\quad \\text{外分}：\\vec{p} = \\dfrac{-n\\vec{a} + m\\vec{b}}{m - n}', '\\text{重心}：\\vec{g} = \\dfrac{\\vec{a} + \\vec{b} + \\vec{c}}{3}', '\\text{A, B, C が一直線上} \\iff \\overrightarrow{\\mathrm{AC}} = k\\overrightarrow{\\mathrm{AB}}'],
      analogy: {
        title: 'たとえるなら「シーソーの支点」',
        text: '重さ n の人と重さ m の人がシーソーに乗ると、支点は重いほうに近づく。内分点は、A に重さ n、B に重さ m をのせたときの支点の位置。',
      },
      points: [
        '点 A の**位置ベクトル**は $\\vec{a} = \\overrightarrow{\\mathrm{OA}}$。成分は A の座標と同じ。',
        '中点は $\\dfrac{\\vec{a} + \\vec{b}}{2}$。内分の式で m = n = 1 の場合。',
        '**一直線上**の証明：$\\overrightarrow{\\mathrm{AC}} = k\\overrightarrow{\\mathrm{AB}}$ となる k を見つける。',
        '**交点**を求めるとき：2 通りに表して、係数を比べる（$\\vec{a}$、$\\vec{b}$ が平行でなければ係数は一致する）。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '⚖️', title: '重心の計算', text: '車や飛行機は、重心がどこにあるかで安定性が決まる。部品の位置ベクトルの平均で計算する。' },
        { icon: '🎞️', title: 'アニメの動き', text: '2 つのポーズのあいだを、内分点の式 $(1 - t)\\vec{a} + t\\vec{b}$ でなめらかにつないでいる。' },
        { icon: '🗺️', title: '待ち合わせ場所', text: '3 人の家の位置の重心は、みんなから見てバランスのよい待ち合わせ場所の目安になる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'div-point', level: 'calc' },
        { type: 'gen', gen: 'vec-comp', level: 'calc' },
        {
          id: 'mc-04-q1',
          type: 'mark',
          level: 'exam',
          prompt: '三角形 OAB で、辺 OA を 2 : 1 に内分する点を C、辺 OB の中点を D とする。線分 AD と BC の交点を P とし、$\\overrightarrow{\\mathrm{OA}} = \\vec{a}$、$\\overrightarrow{\\mathrm{OB}} = \\vec{b}$ とすると、$\\overrightarrow{\\mathrm{OP}} = \\dfrac{p}{q}\\vec{a} + \\dfrac{r}{s}\\vec{b}$ と表せる（それぞれ既約分数）。p = ［ア］、q = ［イ］、r = ［ウ］、s = ［エ］ である。',
          answers: { ア: '1', イ: '2', ウ: '1', エ: '4' },
          hint: 'AP : PD = t : (1 − t) として $\\overrightarrow{\\mathrm{OP}} = (1 - t)\\vec{a} + \\dfrac{t}{2}\\vec{b}$。BP : PC = u : (1 − u) として $\\overrightarrow{\\mathrm{OP}} = \\dfrac{2u}{3}\\vec{a} + (1 - u)\\vec{b}$。係数を比べる。',
          explain: '$1 - t = \\dfrac{2u}{3}$、$\\dfrac{t}{2} = 1 - u$。解くと $t = \\dfrac{1}{2}$、$u = \\dfrac{3}{4}$。$\\overrightarrow{\\mathrm{OP}} = \\dfrac{1}{2}\\vec{a} + \\dfrac{1}{4}\\vec{b}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '重心を支えたら、門がまっすぐに立ったわ！' },
        { who: 'michiru', mood: 'normal', text: '城の中は立体の世界。平面のベクトルに、高さの成分を 1 つ足しましょう。' },
      ],
    },
  ],
};
