import { describe, expect, it } from 'vitest';
import { mathCGenerators as G } from './mathc';
import { parsePoly } from '../../engine/poly';
import { checkInput } from '../../engine/answerCheck';
import type { ChoiceQuestion, InputQuestion } from '../types';

// 生成問題の答えを、問題文から計算しなおして確かめる

const N = 300;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\\ /g, ' ').replace(/\s+/g, ''));
const val = (s: string) => parsePoly(s).get('') ?? 0;
const accepted = (q: InputQuestion) => expect(checkInput(q, q.answer).ok).toBe(true);
/** "(1,-2)" → [1, -2] */
const tup = (t: string) => t.replace(/^[^(]*\(|\)$/g, '').split(',').map(Number);
/** "2\vec{a}-3\vec{b}" → [2, -3] */
function comb(t: string): [number, number] {
  const m = t.match(/^(-?\d*)\\vec\{a\}([+-]\d*)\\vec\{b\}$/)!;
  const c = (s: string) => (s === '' || s === '+' ? 1 : s === '-' ? -1 : +s);
  return [c(m[1]), c(m[2])];
}
/** 値の TeX（√ と分数）→ 数 */
function ev(t: string): number {
  const s = t.replace(/\\sqrt\{(\d+)\}/g, '*Math.sqrt($1)').replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\pi/g, '*Math.PI').replace(/(^|[(,-])\*/g, '$1');
  return Function(`return ${s}`)();
}
/** 複素数の TeX "a+bi" → [a, b] */
function cplx(t: string): [number, number] {
  const s = t.replace(/\\sqrt\{3\}/g, 'r');
  let re = 0, im = 0;
  for (const term of s.match(/[+-]?[^+-]+/g)!) {
    const isI = term.endsWith('i');
    let body = isI ? term.slice(0, -1) : term;
    const sign = body.startsWith('-') ? -1 : 1;
    body = body.replace(/^[+-]/, '');
    const hasR = body.includes('r');
    body = body.replace('r', '');
    const v = sign * (body === '' ? 1 : +body) * (hasR ? Math.sqrt(3) : 1);
    if (isI) im += v;
    else re += v;
  }
  return [re, im];
}
const mul = (a: [number, number], b: [number, number]): [number, number] => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];

describe('数学C（ベクトル・曲線・複素数平面）の生成問題の検算', () => {
  it('vec-comp', () => {
    for (let i = 0; i < N; i++) {
      const q = G['vec-comp']('calc') as InputQuestion;
      const [ta, tb, tc] = tex(q);
      const a = tup(ta), b = tup(tb), [m, n] = comb(tc);
      const k = q.prompt.includes('x 成分') ? 0 : 1;
      expect(val(q.answer)).toBe(m * a[k] + n * b[k]);
      accepted(q);
    }
  });

  it('vec-norm', () => {
    for (let i = 0; i < N; i++) {
      const q = G['vec-norm']('calc') as InputQuestion;
      const t = tex(q);
      if (t[0].includes('=(')) {
        const a = tup(t[0]), b = tup(t[1]);
        const [m, n] = comb(t[2].replace(/^\||\|\^2$/g, ''));
        expect(val(q.answer)).toBe((m * a[0] + n * b[0]) ** 2 + (m * a[1] + n * b[1]) ** 2);
      } else {
        const A = +t[0].split('=')[1], B = +t[1].split('=')[1], d = +t[2].split('=')[1];
        const [, k] = comb(t[3].replace(/^\||\|\^2$/g, ''));
        // ベクトルを実際に作って確かめる：a = (A, 0)、b は a との内積が d
        const bx = d / A, by = Math.sqrt(B * B - bx * bx);
        expect(val(q.answer)).toBeCloseTo((A + k * bx) ** 2 + (k * by) ** 2, 9);
      }
      accepted(q);
    }
  });

  it('dot', () => {
    for (let i = 0; i < N; i++) {
      const q = G.dot('calc') as InputQuestion;
      const t = tex(q);
      if (t[0].includes('=(')) {
        const a = tup(t[0]), b = tup(t[1]);
        expect(val(q.answer)).toBe(a.reduce((s, v, j) => s + v * b[j], 0));
      } else {
        const A = ev(t[0].split('=')[1]), B = +t[1].split('=')[1];
        const deg = +t[4].match(/^(\d+)\^\\circ$/)![1];
        expect(val(q.answer)).toBeCloseTo(A * B * Math.cos((deg * Math.PI) / 180), 9);
      }
      accepted(q);
    }
  });

  it('vec-angle', () => {
    for (let i = 0; i < N; i++) {
      const q = G['vec-angle']('calc') as ChoiceQuestion;
      const t = tex(q);
      const a = tup(t[0]), b = tup(t[1]);
      const deg = (Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]))) * 180) / Math.PI;
      expect(+q.choices[q.answer].match(/(\d+)\^/)![1]).toBeCloseTo(deg, 6);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('perp', () => {
    for (let i = 0; i < N; i++) {
      const q = G.perp('calc') as InputQuestion;
      const t = tex(q);
      const a = tup(t[0]);
      const v = val(q.answer);
      if (q.prompt.includes('t\\vec{b}')) {
        const b = tup(t[1]);
        const c = [a[0] + v * b[0], a[1] + v * b[1]];
        expect(c[0] * b[0] + c[1] * b[1]).toBeCloseTo(0, 9);
      } else {
        const y = +t[1].match(/,(-?\d+)\)$/)![1];
        if (q.prompt.includes('垂直')) expect(a[0] * v + a[1] * y).toBeCloseTo(0, 9);
        else expect(a[0] * y - a[1] * v).toBeCloseTo(0, 9);
      }
      accepted(q);
    }
  });

  it('div-point', () => {
    for (let i = 0; i < N; i++) {
      const q = G['div-point']('calc') as InputQuestion;
      const pts = tex(q).map(tup);
      const k = q.prompt.includes('x 座標') ? 0 : 1;
      let want: number;
      if (q.prompt.includes('重心')) want = (pts[0][k] + pts[1][k] + pts[2][k]) / 3;
      else {
        const [, m, n] = q.prompt.match(/(\d+) : (\d+)/)!.map(Number);
        const [A, B] = pts;
        // A から B への向きに、m : n の位置（外分なら符号つき）
        const s = q.prompt.includes('外分') ? m / (m - n) : m / (m + n);
        want = A[k] + s * (B[k] - A[k]);
      }
      expect(val(q.answer)).toBeCloseTo(want, 9);
      accepted(q);
    }
  });

  it('space-vec', () => {
    for (let i = 0; i < N; i++) {
      const q = G['space-vec']('calc') as InputQuestion;
      const pts = tex(q).filter((t) => t.startsWith('\\mathrm')).map(tup);
      const d = pts[1].map((v, j) => v - pts[0][j]);
      const want = pts.length === 2 ? d.reduce((s, v) => s + v * v, 0) : d.reduce((s, v, j) => s + v * (pts[2][j] - pts[0][j]), 0);
      expect(val(q.answer)).toBe(want);
      accepted(q);
    }
  });

  it('conic', () => {
    for (let i = 0; i < N; i++) {
      const q = G.conic('calc') as InputQuestion;
      const eq = tex(q)[0];
      let m;
      const v = val(q.answer);
      if ((m = eq.match(/^[xy]\^2=(-?\d+)[xy]$/))) {
        // 焦点 F と準線からの距離が等しいことで確かめる（y² = kx なら F(p, 0)、準線 x = −p）
        const k = +m[1];
        for (const y of [1, 3, -2]) {
          const x = (y * y) / k;
          expect(Math.hypot(x - v, y)).toBeCloseTo(Math.abs(x + v), 9);
        }
      } else {
        m = eq.match(/^\\dfrac\{x\^2\}\{(\d+)\}([+-])\\dfrac\{y\^2\}\{(\d+)\}=1$/)!;
        const A = +m[1], B = +m[3];
        if (m[2] === '+') {
          // 楕円：曲線上の点から 2 焦点までの距離の和が一定
          const onY = B > A;
          const f1 = onY ? [0, v] : [v, 0], f2 = onY ? [0, -v] : [-v, 0];
          const sums = [0, 1, 2].map((s) => {
            const x = Math.sqrt(A) * Math.cos(s), y = Math.sqrt(B) * Math.sin(s);
            return Math.hypot(x - f1[0], y - f1[1]) + Math.hypot(x - f2[0], y - f2[1]);
          });
          expect(sums[1]).toBeCloseTo(sums[0], 9);
          expect(sums[2]).toBeCloseTo(sums[0], 9);
          expect(q.prompt.includes(onY ? '(0,\\ \\pm c)' : '(\\pm c,\\ 0)')).toBe(true);
        } else {
          // 双曲線：2 焦点までの距離の差が一定
          const diffs = [0.3, 1, 1.7].map((s) => {
            const x = Math.sqrt(A) * Math.cosh(s), y = Math.sqrt(B) * Math.sinh(s);
            return Math.hypot(x + v, y) - Math.hypot(x - v, y);
          });
          expect(diffs[1]).toBeCloseTo(diffs[0], 9);
          expect(diffs[2]).toBeCloseTo(diffs[0], 9);
        }
      }
      accepted(q);
    }
  });

  it('polar', () => {
    for (let i = 0; i < N; i++) {
      const q = G.polar('calc') as ChoiceQuestion;
      const [x, y] = tex(q)[0].replace(/^\(|\)$/g, '').split(',').map(ev);
      const pol = q.choices[q.answer].replace(/\$/g, '').replace(/\\ /g, ' ').replace(/\s+/g, '').replace(/^\\left\(|\\right\)$/g, '');
      const [r, th] = pol.split(',').map(ev);
      expect(r * Math.cos(th)).toBeCloseTo(x, 9);
      expect(r * Math.sin(th)).toBeCloseTo(y, 9);
      expect(th).toBeGreaterThanOrEqual(0);
      expect(th).toBeLessThan(2 * Math.PI);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('complex-calc', () => {
    for (let i = 0; i < N; i++) {
      const q = G['complex-calc']('calc') as InputQuestion;
      const e = tex(q)[0];
      let z: [number, number];
      let m;
      if ((m = e.match(/^\((.+)\)\^2$/))) z = mul(cplx(m[1]), cplx(m[1]));
      else {
        m = e.match(/^\((.+)\)\((.+)\)$/)!;
        z = mul(cplx(m[1]), cplx(m[2]));
      }
      expect(val(q.answer)).toBeCloseTo(q.prompt.includes('実部') ? z[0] : z[1], 9);
      accepted(q);
    }
  });

  it('complex-abs', () => {
    for (let i = 0; i < N; i++) {
      const q = G['complex-abs']('calc') as InputQuestion;
      const t = tex(q);
      let want: number;
      if (t.length === 3 && t[1].startsWith('w=')) {
        const z = cplx(t[0].slice(2)), w = cplx(t[1].slice(2));
        want = Math.hypot(...mul(z, w)) ** 2;
      } else {
        const z = cplx(t[0].slice(2));
        const n = t[1].match(/\^\{(\d+)\}/) ? +t[1].match(/\^\{(\d+)\}/)![1] : 1;
        want = Math.hypot(...z) ** n;
      }
      expect(val(q.answer)).toBeCloseTo(want, 9);
      accepted(q);
    }
  });

  it('complex-arg', () => {
    for (let i = 0; i < N; i++) {
      const q = G['complex-arg']('calc') as ChoiceQuestion;
      const [re, im] = cplx(tex(q)[0].slice(2));
      let arg = Math.atan2(im, re);
      if (arg < 0) arg += 2 * Math.PI;
      expect(ev(q.choices[q.answer].replace(/\$/g, ''))).toBeCloseTo(arg, 9);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('de-moivre', () => {
    for (let i = 0; i < N; i++) {
      const q = G['de-moivre']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\((.+)\)\^\{(\d+)\}$/)!;
      const z = cplx(m[1]);
      let w: [number, number] = [1, 0];
      for (let k = 0; k < +m[2]; k++) w = mul(w, z);
      expect(val(q.answer)).toBeCloseTo(q.prompt.includes('実部') ? w[0] : w[1], 6);
      accepted(q);
    }
  });

  it('説明文に未処理の記号が残らない', () => {
    for (const [name, g] of Object.entries(G)) {
      for (let i = 0; i < 100; i++) {
        const q = g('calc');
        for (const s of [q.prompt, q.explain, q.hint ?? '', q.kaiMistake ?? '']) {
          expect(s, name).not.toMatch(/undefined|NaN|\+ -|- -|\+-|--|Infinity/);
          expect((s.match(/\$/g) ?? []).length % 2, name).toBe(0);
        }
      }
    }
  });
});
