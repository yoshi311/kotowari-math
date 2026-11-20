import { describe, expect, it } from 'vitest';
import { calcGenerators as G } from './calc';
import { parsePoly, type Poly } from '../../engine/poly';
import { checkInput } from '../../engine/answerCheck';
import type { ChoiceQuestion, InputQuestion } from '../types';

// 生成問題の答えを、問題文から数値計算で求めなおして確かめる

const N = 300;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\s+/g, ''));
const strip = (s: string) => s.replace(/\$/g, '').replace(/\s+/g, '');

/** 多項式の値 */
function at(p: Poly, x: number): number {
  let s = 0;
  for (const [k, v] of p) {
    const m = k.match(/^x(?:\^(\d+))?$/);
    if (k !== '' && !m) throw new Error(`x 以外の文字: ${k}`);
    s += v * (k === '' ? 1 : x ** (m![1] ? +m![1] : 1));
  }
  return s;
}
const fn = (t: string) => {
  const p = parsePoly(t);
  return (x: number) => at(p, x);
};
/** 数値微分 */
const dif = (f: (x: number) => number, x: number) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;
/** シンプソン法 */
function integ(f: (x: number) => number, a: number, b: number): number {
  const n = 2000;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}
const val = (s: string) => {
  const p = parsePoly(s);
  return p.get('') ?? 0;
};
/** 答えが正しく受けつけられるか */
function accepted(q: InputQuestion) {
  expect(checkInput(q, q.answer).ok).toBe(true);
}

describe('数学Ⅱ（微分・積分）の生成問題の検算', () => {
  it('avg-rate', () => {
    for (let i = 0; i < N; i++) {
      const q = G['avg-rate']('calc') as InputQuestion;
      const ts = tex(q);
      const [ft, p, r] = [ts[0], ts[ts.length - 2], ts[ts.length - 1]];
      const f = fn(ft.replace('f(x)=', ''));
      expect(val(q.answer)).toBeCloseTo((f(+r) - f(+p)) / (+r - +p), 9);
      accepted(q);
    }
  });

  it('deriv-def', () => {
    for (let i = 0; i < N; i++) {
      const q = G['deriv-def']('calc') as InputQuestion;
      const [ft, lim] = tex(q);
      const t = +lim.match(/^f'\((-?\d+)\)/)![1];
      expect(val(q.answer)).toBeCloseTo(dif(fn(ft.replace('f(x)=', '')), t), 5);
      accepted(q);
    }
  });

  it('derivative', () => {
    for (let i = 0; i < N; i++) {
      const q = G.derivative('calc') as InputQuestion;
      const f = fn(tex(q)[0].replace('y=', ''));
      const d = fn(q.answer);
      for (const x of [-2.5, -1, 0, 0.7, 3]) expect(d(x)).toBeCloseTo(dif(f, x), 4);
      accepted(q);
    }
  });

  it('deriv-at', () => {
    for (let i = 0; i < N; i++) {
      const q = G['deriv-at']('calc') as InputQuestion;
      const [ft, ff] = tex(q);
      const t = +ff.match(/^f'\((-?\d+)\)$/)![1];
      expect(val(q.answer)).toBeCloseTo(dif(fn(ft.replace('f(x)=', '')), t), 4);
      accepted(q);
    }
  });

  it('tangent', () => {
    for (let i = 0; i < N; i++) {
      const q = G.tangent('calc') as InputQuestion;
      const [ft, pt] = tex(q);
      const f = fn(ft.replace('y=', ''));
      const [t, y0] = pt.replace(/[()]/g, '').split(',\\').map(Number);
      expect(f(t)).toBe(y0);
      const L = fn(q.answer);
      expect(L(t)).toBeCloseTo(y0, 9);
      expect(L(t + 1) - L(t)).toBeCloseTo(dif(f, t), 5);
      accepted(q);
    }
  });

  it('extremum', () => {
    for (let i = 0; i < N; i++) {
      const q = G.extremum('calc') as InputQuestion;
      const f = fn(tex(q)[0].replace('f(x)=', ''));
      // 格子で極値を探す
      const ext: { x: number; max: boolean }[] = [];
      for (let k = -600; k <= 600; k++) {
        const x = k / 100;
        const a = f(x - 0.01), b = f(x), c = f(x + 0.01);
        if (b > a && b > c) ext.push({ x, max: true });
        if (b < a && b < c) ext.push({ x, max: false });
      }
      expect(ext.length).toBe(2);
      const want = q.prompt.includes('極大値') ? ext.find((e) => e.max)! : ext.find((e) => !e.max)!;
      expect(val(q.answer)).toBeCloseTo(f(want.x), 6);
      accepted(q);
    }
  });

  it('max-min', () => {
    for (let i = 0; i < N; i++) {
      const q = G['max-min']('calc') as InputQuestion;
      const [range, ft] = tex(q);
      const [lo, hi] = range.split('\\lex\\le').map(Number);
      const f = fn(ft.replace('f(x)=', ''));
      let mx = -Infinity, mn = Infinity;
      for (let k = 0; k <= (hi - lo) * 1000; k++) {
        const v = f(lo + k / 1000);
        mx = Math.max(mx, v);
        mn = Math.min(mn, v);
      }
      expect(val(q.answer)).toBeCloseTo(q.prompt.includes('最大値') ? mx : mn, 6);
      accepted(q);
    }
  });

  it('root-count', () => {
    for (let i = 0; i < N; i++) {
      const q = G['root-count']('calc') as ChoiceQuestion;
      const [lhs, m] = tex(q)[0].split('=');
      const f = fn(lhs);
      const g = (x: number) => f(x) - +m;
      // 符号の変わり目と、ちょうど 0 になる点を数える
      let count = 0, last = 0;
      for (let k = -20000; k <= 20000; k++) {
        const v = g(k / 1000);
        if (Math.abs(v) < 1e-9) { count++; last = 0; continue; }
        const s = Math.sign(v);
        if (last !== 0 && s !== last) count++;
        last = s;
      }
      expect(strip(q.choices[q.answer])).toBe(`${count}個`);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('indefinite', () => {
    for (let i = 0; i < N; i++) {
      const q = G.indefinite('calc') as InputQuestion;
      const [fd, cond] = tex(q);
      const f = fn(fd.replace("F'(x)=", ''));
      const [, k, v] = cond.match(/^F\((-?\d+)\)=(-?\d+)$/)!;
      const F = fn(q.answer);
      for (const x of [-2, -0.5, 1, 2.5]) expect(dif(F, x)).toBeCloseTo(f(x), 4);
      expect(F(+k)).toBeCloseTo(+v, 9);
      accepted(q);
    }
  });

  it('def-integral', () => {
    for (let i = 0; i < N; i++) {
      const q = G['def-integral']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\\displaystyle\\int_\{(-?\d+)\}\^\{(-?\d+)\}\((.+)\)\\,dx$/)!;
      expect(val(q.answer)).toBeCloseTo(integ(fn(m[3]), +m[1], +m[2]), 7);
      accepted(q);
    }
  });

  it('area', () => {
    for (let i = 0; i < N; i++) {
      const q = G.area('calc') as InputQuestion;
      const ys = tex(q).filter((t) => t.startsWith('y=')).map((t) => parsePoly(t.slice(2)));
      const d = ys.length === 2 ? (x: number) => at(ys[0], x) - at(ys[1], x) : (x: number) => at(ys[0], x);
      // 2 次式 d の根
      const c0 = d(0), c1 = (d(1) - d(-1)) / 2, c2 = (d(1) + d(-1)) / 2 - c0;
      const D = c1 * c1 - 4 * c2 * c0;
      expect(D).toBeGreaterThan(0);
      const r1 = (-c1 - Math.sqrt(D)) / (2 * c2), r2 = (-c1 + Math.sqrt(D)) / (2 * c2);
      const S = integ((x) => Math.abs(d(x)), Math.min(r1, r2), Math.max(r1, r2));
      expect(val(q.answer)).toBeCloseTo(S, 6);
      accepted(q);
    }
  });

  it('説明文に未処理の記号が残らない', () => {
    for (const [name, g] of Object.entries(G)) {
      for (let i = 0; i < 100; i++) {
        const q = g('calc');
        for (const s of [q.prompt, q.explain, q.hint ?? '', q.kaiMistake ?? '']) {
          expect(s, name).not.toMatch(/undefined|NaN|\+ -|- -|\+-|--|\(x - \(/);
          expect((s.match(/\$/g) ?? []).length % 2, name).toBe(0);
        }
      }
    }
  });
});
