// 図形の性質（数学A）の生成問題
import type { ChoiceQuestion, QLevel, Question } from '../types';
import { randInt } from '../../engine/format';
import { fracStr, fracTex } from '../../engine/prob';

type Gen = (level: QLevel) => Question;

const base = (gen: string, level: QLevel) => ({ id: `gen:${gen}`, level, type: 'input' as const });
const pickOne = <T,>(xs: T[]): T => xs[randInt(0, xs.length - 1)];

export const geoGenerators: Record<string, Gen> = {
  /** 角の二等分線と線分の比 */
  'bisector-ratio': (level) => {
    const c = randInt(3, 9);
    const b = randInt(3, 9, { exclude: [c] });
    const a = randInt(Math.abs(b - c) + 1, b + c - 1);
    const num = a * c;
    const den = b + c;
    return {
      ...base('bisector-ratio', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ で $AB = ${c}$、$AC = ${b}$、$BC = ${a}$ である。$\\angle A$ の二等分線と辺 BC の交点を D とするとき、BD の長さを求めよう（分数は 7/2 のように入力）。`,
      answer: fracStr(num, den),
      before: 'BD ＝',
      hint: `$BD : DC = AB : AC = ${c} : ${b}$。BC を $${c} : ${b}$ に分ける。`,
      kaiMistake: `$BD : DC = ${b} : ${c}$ と逆にしちゃった！ B の側にあるのは AB だ…。`,
      explain: `$BD = ${a} \\times \\dfrac{${c}}{${c} + ${b}} = ${fracTex(num, den)}$`,
    };
  },

  /** 外心・内心と角 */
  'center-angle': (level) => {
    const A = randInt(15, 40) * 2;
    const inner = Math.random() < 0.5;
    const ans = inner ? 90 + A / 2 : 2 * A;
    return {
      ...base('center-angle', level),
      mode: 'number',
      prompt: inner
        ? `$\\triangle ABC$ の内心を I とする。$\\angle A = ${A}^\\circ$ のとき、$\\angle BIC$ を求めよう。`
        : `鋭角三角形 ABC の外心を O とする。$\\angle A = ${A}^\\circ$ のとき、$\\angle BOC$ を求めよう。`,
      answer: String(ans),
      before: inner ? '$\\angle BIC$ ＝' : '$\\angle BOC$ ＝',
      after: '°',
      hint: inner ? 'I は角の二等分線の交点。$\\angle IBC + \\angle ICB = \\dfrac{\\angle B + \\angle C}{2}$。' : 'O は外接円の中心。$\\angle BOC$ は弧 BC の中心角。',
      explain: inner
        ? `$\\angle B + \\angle C = ${180 - A}^\\circ$ なので $\\angle IBC + \\angle ICB = ${(180 - A) / 2}^\\circ$。$\\angle BIC = 180^\\circ - ${(180 - A) / 2}^\\circ = ${ans}^\\circ$。`
        : `中心角は円周角の 2 倍なので $\\angle BOC = 2 \\times ${A}^\\circ = ${ans}^\\circ$。`,
    };
  },

  /** 重心と中線 */
  'centroid-len': (level) => {
    const k = randInt(2, 8);
    const askAG = Math.random() < 0.5;
    return {
      ...base('centroid-len', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ の重心を G、辺 BC の中点を M とする。中線 $AM = ${3 * k}$ のとき、${askAG ? 'AG' : 'GM'} の長さを求めよう。`,
      answer: String(askAG ? 2 * k : k),
      before: `${askAG ? 'AG' : 'GM'} ＝`,
      hint: '重心は中線を頂点の側から $2 : 1$ に分ける。',
      explain: `$AG : GM = 2 : 1$ なので、$AG = ${3 * k} \\times \\dfrac{2}{3} = ${2 * k}$、$GM = ${k}$。`,
    };
  },

  /** チェバの定理 */
  'ceva-ratio': (level) => {
    const p = randInt(1, 5);
    const q = randInt(1, 5, { exclude: [p] });
    const r = randInt(1, 5);
    const s = randInt(1, 5, { exclude: [r] });
    return {
      ...base('ceva-ratio', level),
      mode: 'number',
      prompt: `$\\triangle ABC$ の内部の点 P について、直線 AP、BP、CP が辺 BC、CA、AB と D、E、F で交わる。$AF : FB = ${p} : ${q}$、$BD : DC = ${r} : ${s}$ のとき、$\\dfrac{CE}{EA}$ を求めよう。`,
      answer: fracStr(q * s, p * r),
      before: '$\\dfrac{CE}{EA}$ ＝',
      hint: 'チェバの定理 $\\dfrac{AF}{FB} \\cdot \\dfrac{BD}{DC} \\cdot \\dfrac{CE}{EA} = 1$',
      explain: `$\\dfrac{${p}}{${q}} \\cdot \\dfrac{${r}}{${s}} \\cdot \\dfrac{CE}{EA} = 1$ より $\\dfrac{CE}{EA} = \\dfrac{${q} \\times ${s}}{${p} \\times ${r}} = ${fracTex(q * s, p * r)}$`,
    };
  },

  /** 円周角・内接四角形 */
  'inscribed-angle': (level) => {
    const x = randInt(8, 32) * 5;
    const quad = Math.random() < 0.5;
    if (quad) {
      const y = randInt(10, 34) * 5;
      return {
        ...base('inscribed-angle', level),
        mode: 'number',
        prompt: `円に内接する四角形 ABCD で、$\\angle A = ${y}^\\circ$ のとき、$\\angle C$ を求めよう。`,
        answer: String(180 - y),
        before: '$\\angle C$ ＝',
        after: '°',
        hint: '円に内接する四角形の向かい合う角の和は $180^\\circ$。',
        explain: `$\\angle C = 180^\\circ - ${y}^\\circ = ${180 - y}^\\circ$`,
      };
    }
    return {
      ...base('inscribed-angle', level),
      mode: 'number',
      prompt: `中心 O の円で、弧 AB に対する中心角 $\\angle AOB = ${x}^\\circ$ である。弧 AB に対する円周角 $\\angle APB$ を求めよう（P は弧 AB 以外の円周上の点）。`,
      answer: String(x / 2),
      before: '$\\angle APB$ ＝',
      after: '°',
      hint: '円周角は中心角の半分。',
      kaiMistake: '中心角と同じだと思っちゃった！ 円周角は半分だ…。',
      explain: `$\\angle APB = ${x}^\\circ \\div 2 = ${x / 2}^\\circ$`,
    };
  },

  /** 方べきの定理（2 本の直線） */
  'power-chord': (level) => {
    for (;;) {
      const pa = randInt(2, 9);
      const pb = randInt(2, 12);
      const prod = pa * pb;
      const ds = [];
      for (let d = 2; d < prod; d++) if (prod % d === 0 && d !== pa && d !== pb) ds.push(d);
      if (!ds.length) continue;
      const pc = pickOne(ds);
      const inside = Math.random() < 0.5;
      return {
        ...base('power-chord', level),
        mode: 'number',
        prompt: inside
          ? `円の 2 つの弦 AB、CD が点 P で交わっている。$PA = ${pa}$、$PB = ${pb}$、$PC = ${pc}$ のとき、PD の長さを求めよう。`
          : `円の外の点 P を通る 2 本の直線が、円とそれぞれ A、B および C、D で交わる。$PA = ${Math.min(pa, pb)}$、$PB = ${Math.max(pa, pb)}$、$PC = ${pc}$ のとき、PD の長さを求めよう。`,
        answer: String(prod / pc),
        before: 'PD ＝',
        hint: '方べきの定理 $PA \\cdot PB = PC \\cdot PD$',
        explain: `$${pa} \\times ${pb} = ${pc} \\times PD$ より $PD = ${prod / pc}$。`,
      };
    }
  },

  /** 方べきの定理（接線） */
  'power-tangent': (level) => {
    for (;;) {
      const t = randInt(3, 12);
      const ds = [];
      for (let a = 2; a < t; a++) if ((t * t) % a === 0) ds.push(a);
      if (!ds.length) continue;
      const a = pickOne(ds);
      return {
        ...base('power-tangent', level),
        mode: 'number',
        prompt: `円の外の点 P から円に接線を引き、接点を T とする。また、P を通る直線が円と A、B で交わる（$PA < PB$）。$PT = ${t}$、$PA = ${a}$ のとき、PB の長さを求めよう。`,
        answer: String((t * t) / a),
        before: 'PB ＝',
        hint: '$PA \\cdot PB = PT^2$',
        explain: `$${a} \\times PB = ${t}^2 = ${t * t}$ より $PB = ${(t * t) / a}$。`,
      };
    }
  },

  /** 2 つの円の位置関係 */
  'two-circle': (level): ChoiceQuestion => {
    const r1 = randInt(3, 9);
    const r2 = randInt(1, r1 - 1);
    const kind = randInt(0, 4);
    const d = [r1 + r2 + randInt(1, 4), r1 + r2, randInt(r1 - r2 + 1, r1 + r2 - 1), r1 - r2, randInt(0, r1 - r2 - 1)][kind];
    const choices = ['離れている（共通接線 4 本）', '外接する（共通接線 3 本）', '2 点で交わる（共通接線 2 本）', '内接する（共通接線 1 本）', '一方が他方の内部にある（共通接線 0 本）'];
    return {
      id: 'gen:two-circle',
      level,
      type: 'choice',
      prompt: `半径 ${r1} の円と半径 ${r2} の円があり、中心間の距離は ${d} である。2 つの円の位置関係は？`,
      choices,
      answer: kind,
      hint: `半径の和 ${r1 + r2}、半径の差 ${r1 - r2} と、距離 ${d} をくらべる。`,
      explain: `半径の和は ${r1 + r2}、差は ${r1 - r2}。距離 ${d} との大小から「${choices[kind]}」。`,
    };
  },

  /** オイラーの多面体定理 */
  'euler-poly': (level) => {
    const n = randInt(3, 9);
    const prism = Math.random() < 0.5;
    const [v, e, f] = prism ? [2 * n, 3 * n, n + 2] : [n + 1, 2 * n, n + 1];
    const ask = randInt(0, 2);
    const given = [
      ['頂点', v],
      ['辺', e],
      ['面', f],
    ].filter((_, i) => i !== ask);
    const name = ['頂点', '辺', '面'][ask];
    const ans = [v, e, f][ask];
    return {
      ...base('euler-poly', level),
      mode: 'number',
      prompt: `へこみのない多面体で、${given[0][0]}の数が ${given[0][1]}、${given[1][0]}の数が ${given[1][1]} である。${name}の数を求めよう。`,
      answer: String(ans),
      before: `${name}の数：`,
      hint: 'オイラーの多面体定理 $v - e + f = 2$（頂点 − 辺 ＋ 面 ＝ 2）',
      explain: `$v - e + f = 2$ に入れると、${name}の数は ${ans}。（この多面体は${n}角${prism ? '柱' : 'すい'}と同じ数）`,
    };
  },
};
