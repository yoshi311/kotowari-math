import type { Lesson } from '../../types';

export const c06: Lesson = {
  id: 'mc-06',
  no: 6,
  title: '2次曲線',
  subtitle: '放物線・楕円・双曲線',
  quest: 'ささやきの回廊',
  card: {
    id: 'card-mc-06',
    name: '焦点の鏡',
    term: '2 次曲線',
    rarity: 3,
    tool: '焦点からの距離の関係で決まる放物線・楕円・双曲線を、方程式と焦点で読みとく道具',
    formula: 'y^2 = 4px,\\quad \\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1,\\quad \\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1',
    uses: ['パラボラアンテナ・懐中電灯の反射鏡', '惑星や人工衛星の楕円軌道', '昔の船の位置測定（双曲線航法）'],
    color: '#00bbf9',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：声がとどく回廊',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: 'この楕円形の回廊では、あるすみでささやくと、遠くはなれた別のすみではっきり聞こえるの。ふしぎでしょう？' },
        { who: 'kai', mood: 'surprised', text: 'ほかの場所では聞こえないのに？ そのすみに何かひみつがあるのか。' },
        { who: 'michiru', mood: 'happy', text: 'その 2 つの点が「焦点」。楕円は、2 つの焦点からの距離の和が一定の曲線なの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：焦点までの距離',
      lines: [{ who: 'michiru', text: '点 P を動かして、焦点までの距離を見てね。放物線・楕円・双曲線で、何が一定になっている？' }],
      figure: { type: 'conics' },
      prompts: ['楕円で、P を動かしても変わらない量は？', '放物線では、PF とどの長さが等しい？'],
      check: {
        id: 'mc-06-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '楕円 $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ の焦点の座標は？',
        choices: ['$(\\pm 4,\\ 0)$', '$(\\pm 5,\\ 0)$', '$(\\pm 3,\\ 0)$', '$(0,\\ \\pm 4)$'],
        answer: 0,
        explain: 'x の分母のほうが大きいので、焦点は x 軸上。$c^2 = 25 - 9 = 16$ より $(\\pm 4,\\ 0)$。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: '楕円は「和」、双曲線は「差」、放物線は「焦点と準線までが同じ」。3 つともきょうだいなんだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：2 次曲線',
      tool: '焦点からの距離の関係で決まる放物線・楕円・双曲線を、方程式と焦点で読みとく道具',
      formulas: ['\\text{放物線 } y^2 = 4px：\\text{焦点 } (p,\\ 0)、\\text{準線 } x = -p', '\\text{楕円 } \\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1\\ (a > b > 0)：\\text{焦点 } (\\pm\\sqrt{a^2 - b^2},\\ 0)', '\\text{双曲線 } \\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1：\\text{焦点 } (\\pm\\sqrt{a^2 + b^2},\\ 0)、\\text{漸近線 } y = \\pm\\dfrac{b}{a}x'],
      analogy: {
        title: 'たとえるなら「ひもとピンでかく楕円」',
        text: '2 本のピンにひもの両はしを結び、えんぴつでぴんと張りながら一周すると楕円がかける。ひもの長さ（距離の和）が一定だから。ピンの位置が焦点。',
      },
      points: [
        '**楕円**は距離の和が一定（＝長軸の長さ 2a）。焦点は大きいほうの分母の軸の上にあり、$c^2 = (\\text{大}) - (\\text{小})$。',
        '**双曲線**は距離の差が一定（＝ 2a）。$c^2 = a^2 + b^2$（足し算）。',
        '**放物線**は焦点と準線までの距離が等しい。$y^2 = 4px$ の「4p」に注意。',
        '円錐を平面で切った切り口にあらわれるので、まとめて「円錐曲線」ともいう。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '📡', title: 'パラボラアンテナ', text: '放物線の形の鏡は、まっすぐ来た電波をすべて焦点に集める。懐中電灯はその逆に、焦点の光をまっすぐ出す。' },
        { icon: '🪐', title: '惑星の軌道', text: '地球などの惑星は、太陽を焦点の 1 つとする楕円の上を回っている（ケプラーの法則）。' },
        { icon: '🚢', title: '双曲線航法', text: '2 つの電波局からの電波がとどく時間の差から、船の位置が双曲線の上にあるとわかる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'conic', level: 'calc' },
        {
          id: 'mc-06-q1',
          type: 'choice',
          level: 'calc',
          prompt: '双曲線 $\\dfrac{x^2}{9} - \\dfrac{y^2}{16} = 1$ の漸近線の方程式は？',
          choices: ['$y = \\pm\\dfrac{4}{3}x$', '$y = \\pm\\dfrac{3}{4}x$', '$y = \\pm\\dfrac{16}{9}x$', '$y = \\pm 5x$'],
          answer: 0,
          hint: '$\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ の漸近線は $y = \\pm\\dfrac{b}{a}x$。',
          explain: 'a = 3、b = 4 なので $y = \\pm\\dfrac{4}{3}x$。右辺を 0 にした $\\dfrac{x^2}{9} = \\dfrac{y^2}{16}$ を解いても求まる。',
        },
        {
          id: 'mc-06-q2',
          type: 'mark',
          level: 'exam',
          prompt: '2 点 $(3,\\ 0)$、$(-3,\\ 0)$ を焦点とし、焦点からの距離の和が 10 である楕円の方程式は $\\dfrac{x^2}{p} + \\dfrac{y^2}{q} = 1$ で、p = ［アイ］、q = ［ウエ］ である。',
          answers: { ア: '2', イ: '5', ウ: '1', エ: '6' },
          hint: '距離の和 2a = 10 より a = 5。$b^2 = a^2 - c^2$。',
          explain: 'a = 5、c = 3 なので $b^2 = 25 - 9 = 16$。$\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '焦点に立ったら、遠くのささやきがはっきり聞こえたわ！' },
        { who: 'michiru', mood: 'normal', text: '曲線は方程式だけでなく、「時刻」や「角度」を使っても表せるの。次の部屋へ行きましょう。' },
      ],
    },
  ],
};
