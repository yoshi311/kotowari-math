import type { Lesson } from '../../types';

export const t04: Lesson = {
  id: 'm1t-04',
  no: 4,
  title: '鈍角の三角比（単位円）',
  subtitle: '90° をこえても三角比は使える',
  quest: '回る灯台の光',
  card: {
    id: 'card-m1t-04',
    name: '旋回の光輪',
    term: '三角比の拡張（単位円）',
    rarity: 3,
    tool: '半径 1 の円の上の点の座標で、0°〜180° のどんな角の三角比も表す道具',
    formula: 'P(\\cos\\theta,\\ \\sin\\theta),\\quad \\sin(180^\\circ - \\theta) = \\sin\\theta,\\ \\cos(180^\\circ - \\theta) = -\\cos\\theta',
    uses: ['灯台やレーダーの回転', 'ロボットアームの角度', '数学Ⅱの三角関数（波）'],
    color: '#c3a6ff',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：光が後ろを向いたら？',
      scene: 'lighthouse',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'think', text: '新しいレンズは、海の東（0°）から西（180°）まで、ぐるっと半回転して光を送るんだ。' },
        { who: 'npc', npcName: '灯台守のナギ', mood: 'sad', text: 'でも、光の向きが 120° のとき、東にどれだけ照らすのか計算できなくてね。直角三角形の角は 90° より小さいだろう？' },
        { who: 'zero', mood: 'think', text: 'たしかに…120° の角をもつ直角三角形なんて、作れないよね。' },
        { who: 'michiru', mood: 'happy', text: '三角形ではなく、**円**で考え直すの。そうすれば、90° をこえても三角比が使えるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：単位円の上の点',
      lines: [{ who: 'michiru', text: '半径 1 の円（**単位円**）の上で、角 θ の位置に点 P をとるの。P の座標が $(\\cos\\theta,\\ \\sin\\theta)$ よ。' }],
      figure: { type: 'unitCircle' },
      prompts: [
        'θ を 0° から 180° まで動かして、cos と sin の符号を見よう。',
        'θ = 90° のとき、cos はいくつ？',
        '「180°−θ の点も表示」をおして、2 つの点の座標をくらべよう。',
      ],
      check: {
        id: 'm1t-04-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\cos 120^\\circ$ の値は？',
        choices: ['$\\dfrac{1}{2}$', '$-\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$-\\dfrac{\\sqrt{3}}{2}$'],
        answer: 1,
        explain: '120° の点 P は、60° の点を左右反対にした位置。高さ（sin）は同じで、横（cos）はマイナスになる。$\\cos 120^\\circ = -\\cos 60^\\circ = -\\dfrac{1}{2}$。',
      },
      after: [
        { who: 'zero', mood: 'surprised', text: '光が 90° をこえると、「東への照らし具合（cos）」がマイナス、つまり西を照らすってことだ！' },
      ],
    },
    {
      kind: 'concept',
      title: 'ことばにする：単位円と三角比',
      tool: '半径 1 の円の上の点の座標で、0°〜180° のどんな角の三角比も表す道具',
      analogy: {
        title: 'たとえるなら「灯台の光の向き」',
        text: '灯台から長さ 1 の光をのばす。光の先の「横の位置」が cos、「高さ」が sin。光を東（0°）から西（180°）へ回すと、横の位置は 1 → 0 → −1 と変わり、高さは 0 → 1 → 0 と変わる。',
      },
      formulas: [
        'P(\\cos\\theta,\\ \\sin\\theta),\\quad \\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}',
        '\\sin(180^\\circ - \\theta) = \\sin\\theta',
        '\\cos(180^\\circ - \\theta) = -\\cos\\theta,\\quad \\tan(180^\\circ - \\theta) = -\\tan\\theta',
        '\\sin 0^\\circ = 0,\\ \\cos 0^\\circ = 1;\\ \\sin 90^\\circ = 1,\\ \\cos 90^\\circ = 0;\\ \\sin 180^\\circ = 0,\\ \\cos 180^\\circ = -1',
      ],
      points: [
        '0° ≦ θ ≦ 180° では、$\\sin\\theta \\ge 0$（P はいつも上半分）。',
        '鈍角（90° < θ < 180°）では、$\\cos\\theta < 0$、$\\tan\\theta < 0$。',
        '$\\tan 90^\\circ$ は存在しない（cos が 0 で、わり算できない）。',
        '**$\\sin\\theta = \\dfrac{1}{2}$ の答えは 30° と 150° の 2 つ**（同じ高さの点が左右に 1 つずつ）。cos の方程式は答えが 1 つ。',
        '相互関係 $\\sin^2\\theta + \\cos^2\\theta = 1$ などは、鈍角でもそのまま成り立つ。ただし cos の符号に注意。',
      ],
      lines: [
        { who: 'kai', mood: 'surprised', text: '$\\sin\\theta = \\dfrac{1}{2}$ の答えが 2 つ…！ 30° だけ答えてたら、半分しか合ってないってことか。' },
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        {
          icon: '📡',
          title: 'レーダーの回転',
          text: '回転しながら電波を出すレーダーは、向きの角度 θ から、東西方向の成分（cos）と南北方向の成分（sin）を計算して、物の位置を地図に表示する。',
        },
        {
          icon: '🦾',
          title: 'ロボットアーム',
          text: '関節が 90° 以上曲がっても、腕の先の位置は（長さ × cos、長さ × sin）で計算できる。工場のロボットは単位円の考え方で動いている。',
        },
        {
          icon: '🌊',
          title: '波の数学へ',
          text: '単位円を 360° 以上ぐるぐる回すと、sin の値は波の形をえがく。音・光・電波などの「波」をあつかう数学Ⅱの三角関数は、ここから始まる。',
        },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'trig-value', level: 'calc' },
        {
          id: 'm1t-04-q1',
          type: 'choice',
          level: 'calc',
          prompt: '$0^\\circ \\le \\theta \\le 180^\\circ$ のとき、$\\sin\\theta = \\dfrac{1}{2}$ を満たす θ は？',
          choices: ['$30^\\circ$', '$30^\\circ,\\ 150^\\circ$', '$60^\\circ,\\ 120^\\circ$', '$150^\\circ$'],
          answer: 1,
          hint: '単位円で、高さが $\\dfrac{1}{2}$ の点はいくつある？',
          kaiMistake: '30° だけ答えちゃった！ 左側にも同じ高さの点があったのか…。',
          explain: '高さ $\\dfrac{1}{2}$ の点は左右に 2 つ。$\\theta = 30^\\circ,\\ 150^\\circ$。',
        },
        {
          id: 'm1t-04-q2',
          type: 'choice',
          level: 'calc',
          prompt: '$0^\\circ \\le \\theta \\le 180^\\circ$ のとき、$\\cos\\theta = -\\dfrac{\\sqrt{2}}{2}$ を満たす θ は？',
          choices: ['$45^\\circ$', '$135^\\circ$', '$45^\\circ,\\ 135^\\circ$', '$120^\\circ$'],
          answer: 1,
          explain: '横の位置が $-\\dfrac{\\sqrt{2}}{2}$ の点は左側に 1 つだけ。$45^\\circ$ を左右反対にした $135^\\circ$。',
        },
        {
          id: 'm1t-04-q3',
          type: 'mark',
          level: 'calc',
          prompt: '$\\sin 150^\\circ + \\cos 120^\\circ =$ ［ア］',
          answers: { ア: '0' },
          hint: '$\\sin 150^\\circ = \\sin 30^\\circ$、$\\cos 120^\\circ = -\\cos 60^\\circ$',
          explain: '$\\dfrac{1}{2} + \\left(-\\dfrac{1}{2}\\right) = 0$',
        },
        {
          id: 'm1t-04-q4',
          type: 'mark',
          level: 'exam',
          prompt: '$0^\\circ \\le \\theta \\le 180^\\circ$ で $\\cos\\theta = -\\dfrac{3}{5}$ のとき、\n$\\sin\\theta =$ ［ア］／［イ］、$\\tan\\theta = -$［ウ］／［エ］',
          answers: { ア: '4', イ: '5', ウ: '4', エ: '3' },
          hint: '$\\sin^2\\theta = 1 - \\dfrac{9}{25}$。0°〜180° では sin は 0 以上。',
          explain: '$\\sin^2\\theta = \\dfrac{16}{25}$、$\\sin\\theta \\ge 0$ なので $\\sin\\theta = \\dfrac{4}{5}$。$\\tan\\theta = \\dfrac{4}{5} \\div \\left(-\\dfrac{3}{5}\\right) = -\\dfrac{4}{3}$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'happy', text: '光がどの向きでも、照らす範囲が計算できる。これでレンズの調整ができるよ！' },
        { who: 'zero', mood: 'happy', text: '三角形から円へ。理術が一段パワーアップした感じ！' },
        { who: 'michiru', mood: 'normal', text: '次は、直角のない三角形にも使える、2 つの大きな定理よ。' },
      ],
    },
  ],
};
