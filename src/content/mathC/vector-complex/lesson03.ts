import type { Lesson } from '../../types';

export const c03: Lesson = {
  id: 'mc-03',
  no: 3,
  title: '内積の応用',
  subtitle: '垂直・平行と大きさ',
  quest: 'いちばん近い足場',
  card: {
    id: 'card-mc-03',
    name: '直角の水準器',
    term: '垂直・平行条件と |a + tb|',
    rarity: 3,
    tool: '内積 0 で垂直、何倍かで平行を判定し、|a + tb|² の展開で大きさや最小値を求める道具',
    formula: '\\vec{a} \\perp \\vec{b} \\iff a_1b_1 + a_2b_2 = 0,\\quad \\vec{a} \\parallel \\vec{b} \\iff a_1b_2 - a_2b_1 = 0',
    uses: ['建物の柱と床が垂直かのチェック', 'ロボットアームの最短距離の計算', '三角形の面積の計算'],
    color: '#06d6a0',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：最短の足場',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '雲の道は、まっすぐな線の上を進むの。その道の上で、城の門にいちばん近い場所に足場を作りたいわ。' },
        { who: 'kai', mood: 'normal', text: '道の上の点を全部ためすのは大変だな。' },
        { who: 'michiru', mood: 'happy', text: 'いちばん近いとき、門への矢印は道と垂直になるの。垂直は内積 0 で調べられるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：いちばん短くなる t',
      lines: [{ who: 'michiru', text: 't を動かして、a + t b の長さと、b との内積を見てね。内積が 0 になるとき、何が起きる？' }],
      figure: { type: 'vecMin' },
      prompts: ['|a + t b|² がいちばん小さくなるのは t がいくつのとき？', 'そのとき、(a + t b) · b はいくつ？'],
      check: {
        id: 'mc-03-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\vec{a} = (2,\\ 3)$ と $\\vec{b} = (x,\\ 4)$ が垂直になる x の値は？',
        choices: ['$-6$', '$6$', '$\\dfrac{8}{3}$', '$-\\dfrac{3}{2}$'],
        answer: 0,
        explain: '垂直 ⇔ 内積 0。$2x + 3 \\times 4 = 0$ より x = −6。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '「いちばん短い」と「垂直」が同じことなんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：内積の応用',
      tool: '内積 0 で垂直、何倍かで平行を判定し、|a + tb|² の展開で大きさや最小値を求める道具',
      formulas: ['|\\vec{a} + t\\vec{b}|^2 = |\\vec{a}|^2 + 2t\\,\\vec{a} \\cdot \\vec{b} + t^2|\\vec{b}|^2', '\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0,\\quad \\vec{a} \\parallel \\vec{b} \\iff \\vec{b} = k\\vec{a}', 'S = \\dfrac{1}{2}\\sqrt{|\\vec{a}|^2|\\vec{b}|^2 - (\\vec{a} \\cdot \\vec{b})^2} = \\dfrac{1}{2}|a_1b_2 - a_2b_1|'],
      analogy: {
        title: 'たとえるなら「道からいちばん近い家への近道」',
        text: 'まっすぐな道から家へ行くとき、いちばん近いのは道に垂直に進む道すじ。ななめに行くと遠回りになる。',
      },
      points: [
        '$|\\vec{a} + t\\vec{b}|^2$ は、文字式 $(x + ty)^2$ と同じように展開できる。まん中は $2t\\,\\vec{a} \\cdot \\vec{b}$。',
        '$|\\vec{a} + t\\vec{b}|^2$ は t の 2 次式。平方完成すれば最小値が求まる（そのとき $\\vec{a} + t\\vec{b} \\perp \\vec{b}$）。',
        '「$|\\vec{a}| = 2$、$|\\vec{b}| = 3$、$|\\vec{a} - \\vec{b}| = \\sqrt{7}$」のような条件は、2 乗して展開し、内積を求める。',
        '三角形 OAB の面積は、$\\overrightarrow{\\mathrm{OA}} = (a_1,\\ a_2)$、$\\overrightarrow{\\mathrm{OB}} = (b_1,\\ b_2)$ なら $\\dfrac{1}{2}|a_1b_2 - a_2b_1|$。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏗️', title: '建築のチェック', text: '柱の向きと床の向きのベクトルの内積が 0 なら、ちゃんと垂直に立っている。' },
        { icon: '🦾', title: 'ロボットアーム', text: '動きの道すじの上で目標にいちばん近い点を、内積 0 の条件で計算する。' },
        { icon: '📐', title: '土地の面積', text: '頂点の座標から、$\\dfrac{1}{2}|a_1b_2 - a_2b_1|$ の式で三角形の面積を一発で求められる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'perp', level: 'calc' },
        { type: 'gen', gen: 'vec-norm', level: 'calc' },
        {
          id: 'mc-03-q1',
          type: 'mark',
          level: 'exam',
          prompt: '$|\\vec{a}| = 2$、$|\\vec{b}| = 3$、$|\\vec{a} - \\vec{b}| = \\sqrt{7}$ のとき、$\\vec{a} \\cdot \\vec{b}$ = ［ア］ であり、$\\vec{a}$ と $\\vec{b}$ のなす角は ［イウ］° である。',
          answers: { ア: '3', イ: '6', ウ: '0' },
          hint: '$|\\vec{a} - \\vec{b}|^2 = |\\vec{a}|^2 - 2\\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$',
          explain: '$7 = 4 - 2\\vec{a} \\cdot \\vec{b} + 9$ より $\\vec{a} \\cdot \\vec{b} = 3$。$\\cos\\theta = \\dfrac{3}{2 \\times 3} = \\dfrac{1}{2}$ なので θ = 60°。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '門にいちばん近い場所に、足場ができたわ！' },
        { who: 'michiru', mood: 'normal', text: '次は、点の位置をベクトルで表す「位置ベクトル」。図形の問題が計算で解けるようになるわ。' },
      ],
    },
  ],
};
