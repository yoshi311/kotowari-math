import type { Lesson } from '../../types';

export const c08: Lesson = {
  id: 'mc-08',
  no: 8,
  title: '複素数平面と極形式',
  subtitle: 'かけ算は回転と拡大',
  quest: '回る魔法陣',
  card: {
    id: 'card-mc-08',
    name: '回転の魔法陣',
    term: '複素数平面・極形式',
    rarity: 3,
    tool: '複素数を平面の点として表し、極形式で「かけ算 ＝ 絶対値のかけ算と偏角の足し算」として扱う道具',
    formula: 'z = r(\\cos\\theta + i\\sin\\theta),\\quad |zw| = |z||w|,\\quad \\arg(zw) = \\arg z + \\arg w',
    uses: ['電気回路（交流）の計算', '画像の回転・拡大の計算', '信号処理（音や電波の分析）'],
    color: '#9b5de5',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：回る魔法陣',
      scene: 'skycastle',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'think', text: '最上階の扉には、円い魔法陣があるの。「i をかけよ」と書いてあるけれど、どういう意味かしら。' },
        { who: 'kai', mood: 'think', text: 'i って、2 乗すると −1 になる数だよな。かけると何が起きるんだ？' },
        { who: 'michiru', mood: 'happy', text: '複素数を平面の点として見ると、i をかけることは「90° 回す」ことなの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：かけると回る',
      lines: [{ who: 'michiru', text: 'z と w の絶対値・偏角を変えて、積 zw（桃色）がどこにくるか見てね。' }],
      figure: { type: 'complexPlane' },
      prompts: ['zw の偏角は、z と w の偏角とどんな関係？', '|w| = 1 のとき、zw は z をどう動かした点？'],
      check: {
        id: 'mc-08-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '複素数 z に i をかけると、複素数平面で点 z はどう動く？',
        choices: ['原点のまわりに 90° 回る', '原点について対称に移る', '実軸について対称に移る', '2 倍の位置に移る'],
        answer: 0,
        explain: '$i = \\cos 90^\\circ + i\\sin 90^\\circ$ で、絶対値 1、偏角 90°。かけると長さはそのまま、角が 90° ふえる。',
      },
      after: [{ who: 'zero', mood: 'surprised', text: 'かけ算が「回転」になるなんて！ i² = −1 は、90° を 2 回で 180° 回ったってことだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：複素数平面と極形式',
      tool: '複素数を平面の点として表し、極形式で「かけ算 ＝ 絶対値のかけ算と偏角の足し算」として扱う道具',
      formulas: ['z = a + bi \\leftrightarrow \\text{点 } (a,\\ b),\\quad |z| = \\sqrt{a^2 + b^2},\\quad \\bar{z} = a - bi', 'z = r(\\cos\\theta + i\\sin\\theta)\\quad(r = |z|,\\ \\theta = \\arg z)', 'zw = r_1r_2\\{\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\}'],
      analogy: {
        title: 'たとえるなら「コンパスと分度器」',
        text: '複素数を「長さ（コンパス）」と「角度（分度器）」で表すのが極形式。かけ算は、長さどうしをかけて、角度どうしを足すだけ。',
      },
      points: [
        '横軸（実軸）に実部、たて軸（虚軸）に虚部をとる。複素数の和は、ベクトルの和と同じ。',
        '**絶対値** $|z|$ は原点からの距離。$|z|^2 = z\\bar{z}$。2 点 z、w の距離は $|z - w|$。',
        '**極形式**：$1 + i = \\sqrt{2}\\left(\\cos\\dfrac{\\pi}{4} + i\\sin\\dfrac{\\pi}{4}\\right)$。偏角は 0 以上 $2\\pi$ 未満（または −π より大きく π 以下）でとる。',
        'わり算は、絶対値をわり、偏角を引く。$\\bar{z}$ は実軸について対称な点。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '⚡', title: '交流の電気回路', text: '交流の電圧や電流を複素数で表すと、ずれ（位相）が偏角になり、計算がかんたんになる。' },
        { icon: '🖼️', title: '画像の回転', text: '画像の点を複素数とみて、$\\cos\\theta + i\\sin\\theta$ をかけると、θ だけ回転できる。' },
        { icon: '🎵', title: '音の分析', text: '音を波の組み合わせに分ける計算（フーリエ変換）では、回転する複素数がたくさん使われる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'complex-calc', level: 'calc' },
        { type: 'gen', gen: 'complex-abs', level: 'calc' },
        { type: 'gen', gen: 'complex-arg', level: 'calc' },
        {
          id: 'mc-08-q1',
          type: 'mark',
          level: 'exam',
          prompt: '複素数平面で、点 $z = 3 + i$ を原点のまわりに $\\dfrac{\\pi}{2}$ だけ回転した点を $a + bi$ とすると、a = ［アイ］、b = ［ウ］ である。また、2 点 $3 + i$ と $-1 + 4i$ の距離は ［エ］ である。',
          answers: { ア: '-', イ: '1', ウ: '3', エ: '5' },
          hint: '$\\dfrac{\\pi}{2}$ 回転は i をかけること。距離は $|(3 + i) - (-1 + 4i)|$。',
          explain: '$i(3 + i) = 3i + i^2 = -1 + 3i$。距離は $|4 - 3i| = \\sqrt{16 + 9} = 5$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: 'i をかけたら、魔法陣がちょうど 90° 回って、扉が半分開いたわ！' },
        { who: 'michiru', mood: 'normal', text: '同じ数を何回もかけると、くるくる回り続ける。最後の理術、ド・モアブルの定理よ。' },
      ],
    },
  ],
};
