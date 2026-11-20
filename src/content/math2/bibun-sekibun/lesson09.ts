import type { Lesson } from '../../types';

export const d09: Lesson = {
  id: 'm2d-09',
  no: 9,
  title: '面積',
  subtitle: '上から下を引いて積分する',
  quest: '振り子がえがく窓',
  card: {
    id: 'card-m2d-09',
    name: '六分の一の窓',
    term: '曲線で囲まれた面積',
    rarity: 3,
    tool: '上の曲線から下の曲線を引いて積分し、囲まれた部分の面積を求める道具（放物線なら (β − α)³/6 の近道も）',
    formula: '\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta)\\,dx = -\\dfrac{(\\beta - \\alpha)^3}{6}',
    uses: ['土地や池など、曲がった形の面積', 'ダムの断面積から水の量を計算', 'グラフの差の合計（もうけの合計など）'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：放物線の窓',
      scene: 'tower',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'think', text: '9 階の窓は、放物線と直線で囲まれた形をしています。この窓にはめるガラスの面積がわからないのです。' },
        { who: 'kai', mood: 'normal', text: '定積分は「グラフと x 軸のあいだ」の面積だったよな。2 つの線のあいだだと、どうするんだ？' },
        { who: 'michiru', mood: 'happy', text: '上の線の高さから、下の線の高さを引いた「すきまの高さ」を積分すればいいの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：交点のはばと面積',
      lines: [{ who: 'michiru', text: '交点 α、β を動かして、囲まれた部分の面積を見てね。「x 軸」と「直線」を切りかえてもくらべてみて。' }],
      figure: { type: 'areaBetween' },
      prompts: ['α = −1、β = 2 のとき、面積はいくつ？', '「x 軸」と「直線」で、はばが同じなら面積はどうなる？'],
      check: {
        id: 'm2d-09-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '放物線 $y = -(x + 1)(x - 2)$ と x 軸で囲まれた部分の面積は？',
        choices: ['$\\dfrac{9}{2}$', '$27$', '$9$', '$\\dfrac{3}{2}$'],
        answer: 0,
        explain: 'x 軸との交点は x = −1、2 で、はばは 3。$\\dfrac{3^3}{6} = \\dfrac{27}{6} = \\dfrac{9}{2}$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '形がちがっても、はばが同じなら面積も同じ！ (β − α)³ ÷ 6 の近道だね。' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：囲まれた部分の面積',
      tool: '上の曲線から下の曲線を引いて積分し、囲まれた部分の面積を求める道具（放物線なら (β − α)³/6 の近道も）',
      formulas: ['S = \\int_a^b \\{f(x) - g(x)\\}\\,dx\\quad(a \\le x \\le b \\text{ で } f(x) \\ge g(x))', '\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta)\\,dx = -\\dfrac{(\\beta - \\alpha)^3}{6}'],
      analogy: {
        title: 'たとえるなら「天井と床のあいだ」',
        text: '部屋の断面の面積は、天井の高さ − 床の高さ を、はしからはしまで積み重ねたもの。床が地面（x 軸）より下にあっても、引き算すればいつも正しい高さになる。',
      },
      points: [
        '**手順**：① 交点の x 座標を求める ② どちらが上かを確かめる ③ $\\int (\\text{上} - \\text{下})\\,dx$。',
        'x 軸より**下**にある部分は、$-f(x)$ を積分する（x 軸が「上」になる）。',
        '放物線と直線（または x 軸）で囲まれた部分は、$x^2$ の係数を a として $S = \\dfrac{|a|(\\beta - \\alpha)^3}{6}$。',
        '定積分の値がそのまま面積とはかぎらない。上と下が入れかわる区間は、分けて計算する。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🏞️', title: '土地の面積', text: '川ぞいの曲がった土地の面積は、2 本の境界線の差を積分して求められる。' },
        { icon: '🌊', title: 'ダムの水の量', text: '谷の断面の形（下の曲線）と水面（上の直線）で囲まれた面積から、ためられる水の量を計算する。' },
        { icon: '💰', title: '売上と費用の差', text: '売上のグラフと費用のグラフのあいだの面積が、その期間のもうけの合計になる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'area', level: 'calc' },
        {
          id: 'm2d-09-q1',
          type: 'choice',
          level: 'exam',
          prompt: '$-1 \\le x \\le 2$ の範囲で、曲線 $y = x^2 - 1$ と x 軸ではさまれた部分の面積の合計は？',
          choices: ['$\\dfrac{8}{3}$', '$0$', '$\\dfrac{4}{3}$', '$2$'],
          answer: 0,
          hint: '−1 ≦ x ≦ 1 では曲線が x 軸より下、1 ≦ x ≦ 2 では上。分けて計算する。',
          explain: '$\\displaystyle\\int_{-1}^{1} (1 - x^2)\\,dx = \\dfrac{4}{3}$、$\\displaystyle\\int_{1}^{2} (x^2 - 1)\\,dx = \\dfrac{4}{3}$。合計 $\\dfrac{8}{3}$。そのまま $\\displaystyle\\int_{-1}^{2} (x^2 - 1)\\,dx$ を計算すると、上と下が打ち消しあって 0 になってしまう。',
        },
        { type: 'gen', gen: 'def-integral', level: 'calc' },
        {
          id: 'm2d-09-q2',
          type: 'mark',
          level: 'exam',
          prompt: '放物線 $y = x^2$ と直線 $y = x + 2$ で囲まれた部分の面積を $\\dfrac{p}{q}$（既約分数）と表すと、p = ［ア］、q = ［イ］ である。',
          answers: { ア: '9', イ: '2' },
          hint: '$x^2 = x + 2$ を解くと x = −1、2。',
          explain: '交点は x = −1、2 で、そのあいだは直線が上。$S = \\displaystyle\\int_{-1}^{2} (x + 2 - x^2)\\,dx = \\dfrac{(2 - (-1))^3}{6} = \\dfrac{27}{6} = \\dfrac{9}{2}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '時計塔の番人クロノ', mood: 'happy', text: 'ガラスがぴったりはまりました！ 窓から、塔の頂上が見えます…ゼノンがいる最上階です。' },
        { who: 'michiru', mood: 'normal', text: '微分も積分も、すべての理術がそろったわ。時を止めた魔術師に、時の流れを見せてあげましょう。' },
      ],
    },
  ],
};
