import type { Lesson } from '../../types';

export const q06: Lesson = {
  id: 'm1q-06',
  no: 6,
  title: '2次方程式と解の公式',
  subtitle: 'グラフが x 軸と交わる場所',
  quest: '石が落ちてくるのはいつ？',
  card: {
    id: 'card-m1q-06',
    name: '万能の鍵',
    term: '2次方程式・解の公式',
    rarity: 3,
    tool: '「ちょうど◯◯になるのはいつ？」を求める道具。グラフでは x 軸と交わる点',
    formula: 'ax^2 + bx + c = 0 \\Rightarrow x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    uses: ['ボールが地面に落ちる時刻', '黄金比（デザイン・自然界）', 'ゲームの当たり判定'],
    color: '#ffd166',
  },
  steps: [
    {
      kind: 'story',
      title: 'なぞ：石が落ちてくるまで何秒？',
      scene: 'valley',
      lines: [
        { who: 'npc', npcName: '大会の審判', mood: 'think', text: '最高点はわかった。でも、投げた石が地面にもどってくるまで、何秒かかるかも知りたいんだ。次の人が投げる合図を出したいからね。' },
        { who: 'zero', mood: 'think', text: '高さ $h = 20t - 5t^2$ が 0 になるとき、だよね？' },
        { who: 'kai', mood: 'normal', text: '$20t - 5t^2 = 0$…。式を「＝0」にして解くのか。' },
        { who: 'michiru', mood: 'happy', text: 'そう、**2次方程式**よ。グラフで言えば、放物線が $x$ 軸（高さ 0 の線）と交わる場所を探すことなの。' },
      ],
    },
    {
      kind: 'explore',
      title: 'さわって発見：x 軸との交点',
      lines: [{ who: 'michiru', text: '$y = x^2 + bx + c$ のグラフよ。係数を変えて、$x$ 軸と交わる点を見てみて。' }],
      figure: { type: 'roots' },
      prompts: [
        '最初の式 $x^2 - 2x - 3 = 0$ の解は、グラフのどこ？',
        '係数を変えて、交点が整数にならないときは、どう表されている？',
        'グラフが $x$ 軸と交わらないこともある？',
      ],
      check: {
        id: 'm1q-06-ex1',
        type: 'choice',
        level: 'meaning',
        prompt: '2次方程式 $x^2 - 2x - 3 = 0$ の解は、グラフでいうと何？',
        choices: [
          '放物線と $y$ 軸の交点の $y$ 座標',
          '放物線と $x$ 軸の交点の $x$ 座標',
          '放物線の頂点の座標',
          '放物線の軸',
        ],
        answer: 1,
        explain: '「＝0」は「$y$ の値（高さ）が 0」ということ。だから解は、放物線が $x$ 軸と交わる点の $x$ 座標。$(x + 1)(x - 3) = 0$ より $x = -1,\\ 3$。',
      },
      after: [
        { who: 'zero', mood: 'happy', text: '石の場合は $5t(4 - t) = 0$ だから、$t = 0$（投げた瞬間）と $t = 4$。4 秒で落ちてくるんだ！' },
      ],
    },
    {
      kind: 'concept',
      title: 'ことばにする：2次方程式の解き方',
      tool: '「ちょうど◯◯になるのはいつ？」を求める道具。グラフでは x 軸と交わる点',
      analogy: {
        title: 'たとえるなら「マスターキー」',
        text: '因数分解は、特定のドアだけ開けられるかんたんな鍵。解の公式は、どんな2次方程式のドアでも開けられる「マスターキー」。まずは因数分解できるか試し、だめならマスターキーを使おう。',
      },
      formulas: [
        'AB = 0 \\iff A = 0 \\text{ または } B = 0',
        'ax^2 + bx + c = 0 \\Rightarrow x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        'ax^2 + 2b\'x + c = 0 \\Rightarrow x = \\dfrac{-b\' \\pm \\sqrt{b\'^2 - ac}}{a}',
      ],
      points: [
        '**因数分解できるなら**：$(x - \\alpha)(x - \\beta) = 0$ より $x = \\alpha,\\ \\beta$。',
        '**できないなら解の公式**。$a$、$b$、$c$ を正しく読み取る（符号ごと！）。',
        '解の公式は、$ax^2 + bx + c = 0$ を文字のまま**平方完成**して作られている。',
        '$x$ の係数が偶数（$2b\'$）なら、短い公式を使うと約分の手間がへる。',
        '答えが出たら、元の式に代入して確かめると安心。',
      ],
      lines: [
        { who: 'kai', mood: 'normal', text: '解の公式、長くて覚えられる気がしないな…。' },
        { who: 'michiru', mood: 'happy', text: '平方完成から自分で作れるわ。$x^2 + \\dfrac{b}{a}x$ の半分 $\\dfrac{b}{2a}$ で正方形を作る、それだけよ。覚えるのは、その「作り方」の意味。' },
      ],
    },
    {
      kind: 'usage',
      title: 'どこで使われている？',
      items: [
        {
          icon: '⚾',
          title: 'ボールが落ちる時刻',
          text: '高さの式を「＝0」として解くと、地面にもどる時刻がわかる。スポーツの分析や、ロケットの着地点の計算に使われている。',
          formula: '20t - 5t^2 = 0 \\Rightarrow t = 0,\\ 4',
        },
        {
          icon: '🌻',
          title: '黄金比',
          text: '$x^2 = x + 1$ の正の解 $\\dfrac{1 + \\sqrt{5}}{2} \\fallingdotseq 1.618$ が「黄金比」。名刺やロゴのデザイン、ひまわりの種の並び方にも現れる、美しいとされる比。',
          formula: '\\dfrac{1 + \\sqrt{5}}{2} \\fallingdotseq 1.618',
        },
        {
          icon: '🎮',
          title: 'ゲームの当たり判定',
          text: '飛んでいく弾が丸い敵に当たるかどうかは、「弾の位置と敵の中心の距離 = 半径」となる時刻を、2次方程式で解いて判定する。',
        },
        {
          icon: '📐',
          title: '面積から長さを決める',
          text: '「たてが横より 2m 長く、面積が 48m² の長方形」は $x(x + 2) = 48$。設計の場面でよく出てくる。',
        },
      ],
    },
    {
      kind: 'practice',
      title: '練習：理術の修行',
      questions: [
        { type: 'gen', gen: 'solve-factor', level: 'calc' },
        {
          id: 'm1q-06-q1',
          type: 'mark',
          level: 'calc',
          prompt: '2次方程式 $x^2 - 4x + 1 = 0$ の解は $x =$ ［ア］ $\\pm \\sqrt{\\phantom{0}}$［イ］',
          answers: { ア: '2', イ: '3' },
          hint: '$a = 1,\\ b = -4,\\ c = 1$。$x$ の係数が偶数なので、短い公式も使えるよ。',
          explain: '$x = \\dfrac{4 \\pm \\sqrt{16 - 4}}{2} = \\dfrac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$',
        },
        {
          id: 'm1q-06-q2',
          type: 'mark',
          level: 'calc',
          prompt: '2次方程式 $2x^2 + 3x - 1 = 0$ の解は\n$x =$ （ $-$［ア］ $\\pm \\sqrt{\\phantom{0}}$［イウ］ ）／［エ］',
          answers: { ア: '3', イ: '1', ウ: '7', エ: '4' },
          hint: '$a = 2,\\ b = 3,\\ c = -1$。$b^2 - 4ac = 9 - 4 \\times 2 \\times (-1)$',
          kaiMistake: '$c = -1$ の符号を見落として、$9 - 8 = 1$ にしちゃった！',
          explain: '$x = \\dfrac{-3 \\pm \\sqrt{9 + 8}}{4} = \\dfrac{-3 \\pm \\sqrt{17}}{4}$',
        },
        {
          id: 'm1q-06-q3',
          type: 'mark',
          level: 'exam',
          prompt: '黄金比は、2次方程式 $x^2 - x - 1 = 0$ の正の解である。\nこの解は $x =$ （ $1 + \\sqrt{\\phantom{0}}$［ア］ ）／［イ］',
          answers: { ア: '5', イ: '2' },
          hint: '$a = 1,\\ b = -1,\\ c = -1$ を解の公式に入れよう。',
          explain: '$x = \\dfrac{1 \\pm \\sqrt{1 + 4}}{2} = \\dfrac{1 \\pm \\sqrt{5}}{2}$。正の解は $\\dfrac{1 + \\sqrt{5}}{2} \\fallingdotseq 1.618$。',
        },
      ],
    },
    {
      kind: 'card',
      lines: [
        { who: 'npc', npcName: '大会の審判', mood: 'happy', text: '投げてから 4 秒で落ちてくる…これで安全に次の合図が出せるよ！' },
        { who: 'zero', mood: 'think', text: 'でもさ、グラフが $x$ 軸と交わらないときもあったよね？ そういうときはどうなるの？' },
        { who: 'michiru', mood: 'happy', text: 'いい疑問ね。解を求めなくても、交わるかどうかを見分ける理術があるの。それが次の依頼よ。' },
      ],
    },
  ],
};
