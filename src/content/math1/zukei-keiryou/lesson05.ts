import type { Lesson } from '../../types';

export const t05: Lesson = {
  id: 'm1t-05',
  no: 5,
  title: '正弦定理',
  subtitle: '向かい合う辺と角は、いつもペア',
  quest: '沖の岩礁までの距離',
  card: {
    id: 'card-m1t-05',
    name: '円環の天秤',
    term: '正弦定理',
    rarity: 3,
    tool: '三角形の「辺」と「向かい合う角」の関係から、わからない辺・角・外接円の半径を求める道具',
    formula: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R',
    uses: ['三角測量（地図づくり）', '星までの距離の計算', '船や飛行機の位置の特定'],
    color: '#f15bb5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：近づけない岩礁',
      scene: 'lighthouse',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'sad', text: '沖に「黒岩」という岩礁があってね。船がぶつからないよう、灯台からの距離を知りたいんだけど、近づけば船がこわれてしまう。' },
        { who: 'npc', npcName: '灯台守のナギ', mood: 'think', text: 'この岬には灯台 A と、となりの見張り台 B がある。AB の距離は 100m。それぞれから岩礁を見る角度は測れるんだが…。' },
        { who: 'kai', mood: 'normal', text: '三角形 ABC（C が岩礁）はできるけど、直角三角形じゃないな。' },
        { who: 'michiru', mood: 'happy', text: '直角がなくても大丈夫。どんな三角形にも使える理術、**正弦定理**の出番よ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：辺 ÷ sin は何になる？',
      lines: [{ who: 'michiru', text: '円にぴったり入った三角形よ（この円を**外接円**というの）。頂点 A を円の上で動かしてみて。' }],
      figure: { type: 'sinLaw' },
      prompts: [
        'A を動かしても、角 A の大きさは変わる？',
        '$\\dfrac{a}{\\sin A}$ と $\\dfrac{b}{\\sin B}$ の値をくらべよう。',
        '半径 R を変えると、$\\dfrac{a}{\\sin A}$ はどうなる？',
      ],
      check: {
        id: 'm1t-05-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '外接円の半径が R の三角形で、$\\dfrac{a}{\\sin A}$ はいつもいくつになる？',
        choices: ['$R$', '$2R$', '$\\dfrac{R}{2}$', '三角形によってばらばら'],
        answer: 1,
        explain: '辺と向かいの角の sin の比は、いつも外接円の直径 $2R$ に等しい。これが正弦定理。',
      },
      after: [
        { who: 'zero', mood: 'happy', text: '辺と、向かい合う角の sin の比は、どの組でも同じなんだ！ 大きい角の向かいには、長い辺がある！' },
      ],
    },
    {
      kind: 'concept',
      title: 'ことばにする：正弦定理',
      tool: '三角形の「辺」と「向かい合う角」の関係から、わからない辺・角・外接円の半径を求める道具',
      analogy: {
        title: 'たとえるなら「シーソーのペア」',
        text: '三角形の辺と、その向かいの角はペア。大きい角の向かいには長い辺、小さい角の向かいには短い辺がすわっている。そのつり合いの割合（辺 ÷ sin 角）は、3 組とも同じ。だから 1 組わかれば、ほかの組の辺や角が求められる。',
      },
      formulas: [
        '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R',
        'a = 2R\\sin A,\\quad \\sin A = \\dfrac{a}{2R}',
        'a : b : c = \\sin A : \\sin B : \\sin C',
      ],
      points: [
        '$a$ は角 A の**向かい**の辺（BC）。辺と角のペアをまちがえない。',
        '**使うとき**：①「1 辺と 2 つの角」がわかっているとき ②「外接円の半径」が出てくるとき。',
        '三角形の角の和は 180°。2 つの角がわかれば、残りの角もわかる。',
        '角を求めるときは、sin の値から角が 2 つ（鋭角と鈍角）考えられることがあるので注意。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        {
          icon: '🗾',
          title: '三角測量で地図を作る',
          text: '距離がわかった 2 地点から、遠くの山頂を見る角度を測る。正弦定理で山頂までの距離がわかり、それをくり返して国全体の地図が作られた。',
        },
        {
          icon: '🌟',
          title: '星までの距離',
          text: '地球が太陽のまわりを半年動くと、近くの星の見える方向が少しずれる。その角度と地球の動いた距離から、三角形の考え方で星までの距離を計算する。',
        },
        {
          icon: '🛰️',
          title: '船や飛行機の位置',
          text: '2 つの電波塔から、船の方向の角度を測れば、正弦定理で船の位置がわかる。GPS が生まれる前から使われてきた方法。',
        },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        {
          id: 'm1t-05-q1',
          type: 'choice',
          level: 'meaning',
          prompt: '正弦定理を使うと便利なのは、どんな情報がわかっているとき？',
          choices: ['3 辺の長さ', '2 辺とそのあいだの角', '1 辺とその両はしの 2 つの角', '3 つの角だけ'],
          answer: 2,
          explain: '1 辺と 2 つの角がわかれば、3 つ目の角も出て、辺と向かいの角のペアがそろう。3 辺や「2 辺とあいだの角」は、次の依頼の余弦定理の出番。',
        },
        { type: 'gen', gen: 'sin-law-R', level: 'calc' },
        {
          id: 'm1t-05-q2',
          type: 'mark',
          level: 'calc',
          prompt: '$\\triangle ABC$ で $a = 6$、$A = 45^\\circ$、$B = 60^\\circ$ のとき、$b =$ ［ア］$\\sqrt{\\phantom{0}}$［イ］',
          answers: { ア: '3', イ: '6' },
          hint: '$\\dfrac{6}{\\sin 45^\\circ} = \\dfrac{b}{\\sin 60^\\circ}$',
          explain: '$b = \\dfrac{6 \\sin 60^\\circ}{\\sin 45^\\circ} = 6 \\times \\dfrac{\\sqrt{3}}{2} \\div \\dfrac{\\sqrt{2}}{2} = \\dfrac{6\\sqrt{3}}{\\sqrt{2}} = 3\\sqrt{6}$',
        },
        {
          id: 'm1t-05-q3',
          type: 'mark',
          level: 'calc',
          prompt: '$\\triangle ABC$ で $a = 3$、$A = 60^\\circ$ のとき、外接円の半径は $R = \\sqrt{\\phantom{0}}$［ア］',
          answers: { ア: '3' },
          hint: '$2R = \\dfrac{3}{\\sin 60^\\circ}$',
          explain: '$2R = 3 \\div \\dfrac{\\sqrt{3}}{2} = \\dfrac{6}{\\sqrt{3}} = 2\\sqrt{3}$ より $R = \\sqrt{3}$。',
        },
        {
          id: 'm1t-05-q4',
          type: 'mark',
          level: 'exam',
          prompt: '灯台 A と見張り台 B の距離は 100m。岩礁を C とすると、$\\angle A = 75^\\circ$、$\\angle B = 60^\\circ$ だった。\n$\\angle C =$ ［アイ］°なので、灯台から岩礁までの距離 AC は ［ウエ］$\\sqrt{\\phantom{0}}$［オ］ m である。',
          answers: { ア: '4', イ: '5', ウ: '5', エ: '0', オ: '6' },
          hint: '$\\angle C = 180^\\circ - 75^\\circ - 60^\\circ$。AC は角 B の向かいの辺、AB は角 C の向かいの辺。',
          explain: '$\\angle C = 45^\\circ$。$\\dfrac{AC}{\\sin 60^\\circ} = \\dfrac{100}{\\sin 45^\\circ}$ より $AC = \\dfrac{100 \\times \\frac{\\sqrt{3}}{2}}{\\frac{\\sqrt{2}}{2}} = \\dfrac{100\\sqrt{3}}{\\sqrt{2}} = 50\\sqrt{6} \\fallingdotseq 122$ m。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '灯台守のナギ', mood: 'happy', text: '黒岩までは約 122m。これを船乗りたちに知らせれば、もう事故は起きないね。' },
        { who: 'kai', mood: 'happy', text: '直角がなくても計算できるなんてな。三角比の本当の力はこっちか。' },
        { who: 'michiru', mood: 'normal', text: '正弦定理と並ぶ、もう 1 つの定理もあるわ。' },
      ],
    },
  ],
};
