import type { Lesson } from '../../types';

export const c01: Lesson = {
  id: 'mc-01',
  no: 1,
  title: 'ベクトルとその成分',
  subtitle: '向きと大きさをもつ矢印',
  quest: '風の矢印',
  card: {
    id: 'card-mc-01',
    name: '風見の矢',
    term: 'ベクトル',
    rarity: 2,
    tool: '向きと大きさをもつ量を矢印で表し、成分で和・差・実数倍を計算する道具',
    formula: '\\vec{a} = (a_1,\\ a_2),\\quad m\\vec{a} + n\\vec{b} = (ma_1 + nb_1,\\ ma_2 + nb_2),\\quad |\\vec{a}| = \\sqrt{a_1^2 + a_2^2}',
    uses: ['天気予報の風の向きと強さ', 'ゲームのキャラクターの移動', '飛行機の進路（向かい風・追い風）の計算'],
    color: '#ffd166',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：雲の上の城',
      scene: 'skycastle',
      lines: [
        { who: 'narrator', text: '天文台の望遠鏡がとらえたのは、雲の上にうかぶ城だった。最後の灯は、あの城にある。' },
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'sad', text: 'ようこそ。でも城へ行く風が、ばらばらの向きにふいて、だれもたどりつけないの。虚無の王が、向きの理術を消してしまったから。' },
        { who: 'kai', mood: 'think', text: '風には「どっちへ」と「どれくらい強く」の 2 つがあるよな。数 1 つじゃ表せないぞ。' },
        { who: 'michiru', mood: 'happy', text: '向きと大きさをいっしょに表すのが「ベクトル」。矢印で考えると、風の合わせ方がわかるわ。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：矢印をつなぐ',
      lines: [{ who: 'michiru', text: 'a と b の成分を動かしてみて。和・差・実数倍に切りかえて、桃色の矢印の成分を見てね。' }],
      figure: { type: 'vecAdd' },
      prompts: ['a + b の成分は、a と b の成分とどんな関係？', '実数倍で k を −1 にすると、矢印はどうなる？'],
      check: {
        id: 'mc-01-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '$\\vec{a} = (3,\\ 1)$、$\\vec{b} = (1,\\ 2)$ のとき、$\\vec{a} + \\vec{b}$ は？',
        choices: ['$(4,\\ 3)$', '$(3,\\ 2)$', '$(2,\\ -1)$', '$(5,\\ 5)$'],
        answer: 0,
        explain: '成分ごとに足して $(3 + 1,\\ 1 + 2) = (4,\\ 3)$。矢印をつないだ先の点と同じ。',
      },
      after: [{ who: 'zero', mood: 'happy', text: '矢印をつなぐのが足し算、成分では、よこはよこ、たてはたてで足すだけだね！' }],
    },
    {
      kind: 'concept',
      title: 'ことばにする：ベクトルと成分',
      tool: '向きと大きさをもつ量を矢印で表し、成分で和・差・実数倍を計算する道具',
      formulas: ['\\vec{a} = (a_1,\\ a_2),\\quad |\\vec{a}| = \\sqrt{a_1^2 + a_2^2}', 'm\\vec{a} + n\\vec{b} = (ma_1 + nb_1,\\ ma_2 + nb_2)', '\\overrightarrow{\\mathrm{AB}} = (b_1 - a_1,\\ b_2 - a_2)'],
      analogy: {
        title: 'たとえるなら「宝の地図の道順」',
        text: '「東へ 3 歩、北へ 1 歩」のように、向きと歩数で道順を書く。2 つの道順を続けて歩くのが和、逆向きに歩くのが −1 倍。どこから歩きはじめても、道順（ベクトル）は同じ。',
      },
      points: [
        '**ベクトル**は向きと大きさだけで決まる。場所をずらしても、向きと長さが同じなら等しいベクトル。',
        '**成分**：x 方向の量と y 方向の量の組 $(a_1,\\ a_2)$。大きさは三平方の定理で $\\sqrt{a_1^2 + a_2^2}$。',
        '$\\overrightarrow{\\mathrm{AB}}$ は「終点 B − 始点 A」。$\\overrightarrow{\\mathrm{AB}} = \\overrightarrow{\\mathrm{OB}} - \\overrightarrow{\\mathrm{OA}}$。',
        '$\\vec{b} = k\\vec{a}$ となる実数 k があるとき、$\\vec{a}$ と $\\vec{b}$ は**平行**。',
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        { icon: '🌬️', title: '風の予報', text: '天気図の矢印は、風の向きと強さを表すベクトル。2 つの風が合わさると、ベクトルの和になる。' },
        { icon: '🎮', title: 'ゲームの移動', text: 'キャラクターの位置に、毎フレーム「速さのベクトル」を足して動かしている。' },
        { icon: '✈️', title: '飛行機の進路', text: '飛行機の速さのベクトルと風のベクトルを足すと、実際に進む向きと速さがわかる。' },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'vec-comp', level: 'calc' },
        {
          id: 'mc-01-q1',
          type: 'choice',
          level: 'calc',
          prompt: '2 点 $\\mathrm{A}(1,\\ 5)$、$\\mathrm{B}(4,\\ 1)$ について、$|\\overrightarrow{\\mathrm{AB}}|$ は？',
          choices: ['$5$', '$7$', '$\\sqrt{7}$', '$25$'],
          answer: 0,
          hint: '$\\overrightarrow{\\mathrm{AB}} = (4 - 1,\\ 1 - 5)$',
          explain: '$\\overrightarrow{\\mathrm{AB}} = (3,\\ -4)$ なので、$|\\overrightarrow{\\mathrm{AB}}| = \\sqrt{9 + 16} = 5$。',
        },
        {
          id: 'mc-01-q2',
          type: 'mark',
          level: 'exam',
          prompt: '$\\vec{a} = (2,\\ 1)$、$\\vec{b} = (-1,\\ 3)$ とする。$\\vec{c} = (7,\\ 7)$ を $\\vec{c} = s\\vec{a} + t\\vec{b}$ と表すと、s = ［ア］、t = ［イ］ である。',
          answers: { ア: '4', イ: '1' },
          hint: '成分で書くと $2s - t = 7$、$s + 3t = 7$。',
          explain: '$2s - t = 7$、$s + 3t = 7$ を解くと s = 4、t = 1。確かめ：$4(2,\\ 1) + (-1,\\ 3) = (7,\\ 7)$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '天空城の風読みソラ', mood: 'happy', text: '風の矢印が、城への道順になってそろったわ！' },
        { who: 'michiru', mood: 'normal', text: '次は 2 つのベクトルを「かける」理術、内積よ。かげの長さがヒントになるわ。' },
      ],
    },
  ],
};
