import { describe, expect, it } from 'vitest';
import { coordGenerators } from './coord';
import { parsePoly, constValue } from '../../engine/poly';
import type { InputQuestion } from '../types';

// 生成問題の答えを、問題文から別の方法で計算しなおして確かめる

const num = (s: string) => constValue(parsePoly(s))!;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\s+/g, ''));
const fa = (n: number): number => (n <= 1 ? 1 : n * fa(n - 1));
const C = (n: number, r: number) => fa(n) / (fa(r) * fa(n - r));

describe('数学Ⅱ（式と図形）の生成問題の検算', () => {
  it('binom-coef', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['binom-coef']('calc') as InputQuestion;
      const t = tex(q);
      const m = t[0].match(/^\((\d*)x([+-]\d+)\)\^(\d+)$/)!;
      expect(m, t[0]).toBeTruthy();
      const a = m[1] ? +m[1] : 1;
      const b = +m[2];
      const n = +m[3];
      const k = +t[1].match(/x\^(\d+)/)![1];
      expect(num(q.answer)).toBe(C(n, k) * a ** k * b ** (n - k));
    }
  });

  it('vieta-sym', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['vieta-sym']('calc') as InputQuestion;
      const t = tex(q);
      const pl = parsePoly(t[0].replace(/=0$/, ''));
      const b = pl.get('x') ?? 0;
      const c = pl.get('') ?? 0;
      const D = b * b - 4 * c;
      // 解を複素数で求めて直接計算
      const re = -b / 2;
      const im = Math.sqrt(Math.abs(D)) / 2;
      const last = t[t.length - 1];
      let want: number;
      if (D >= 0) {
        const al = re + im;
        const be = re - im;
        want = last.includes('\\dfrac{1}{\\alpha}') ? 1 / al + 1 / be : last.includes('(\\alpha-\\beta)^2') ? (al - be) ** 2 : al * al + be * be;
      } else {
        // α = re + i·im、β = re − i·im
        want = last.includes('\\dfrac{1}{\\alpha}') ? (2 * re) / (re * re + im * im) : last.includes('(\\alpha-\\beta)^2') ? -4 * im * im : 2 * (re * re - im * im);
      }
      expect(num(q.answer)).toBeCloseTo(want, 6);
    }
  });

  it('remainder-thm', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['remainder-thm']('calc') as InputQuestion;
      const t = tex(q);
      const pl = parsePoly(t[0].slice(5));
      const k = -(parsePoly(t[1]).get('') ?? 0);
      let v = 0;
      for (const [key, c] of pl) v += c * (key === '' ? 1 : key === 'x' ? k : key === 'x^2' ? k * k : k ** 3);
      expect(num(q.answer)).toBe(v);
    }
  });

  it('section-point', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['section-point']('calc') as InputQuestion;
      const m = q.prompt.match(/A\((-?\d+), (-?\d+)\)、B\((-?\d+), (-?\d+)\) を結ぶ線分 AB を (\d+) : (\d+) に(内分|外分)する点の (x|y) 座標/)!;
      const [x1, y1, x2, y2, mm, nn] = m.slice(1, 7).map(Number);
      const A = m[8] === 'x' ? x1 : y1;
      const B = m[8] === 'x' ? x2 : y2;
      // 点 P は AP : PB = m : n をみたす（向きつき）
      const P = m[7] === '内分' ? A + ((B - A) * mm) / (mm + nn) : A + ((B - A) * mm) / (mm - nn);
      expect(num(q.answer)).toBeCloseTo(P, 9);
    }
  });

  it('circle-radius', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['circle-radius']('calc') as InputQuestion;
      const pl = parsePoly(tex(q)[0].replace(/=0$/, ''));
      const D = pl.get('x') ?? 0;
      const E = pl.get('y') ?? 0;
      const F = pl.get('') ?? 0;
      expect(num(q.answer)).toBeCloseTo(Math.sqrt((D * D) / 4 + (E * E) / 4 - F), 9);
    }
  });

  it('point-line-dist', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['point-line-dist']('calc') as InputQuestion;
      const m = q.prompt.match(/点 \((-?\d+), (-?\d+)\) と直線/)!;
      const pl = parsePoly(tex(q)[0].replace(/=0$/, ''));
      const a = pl.get('x') ?? 0;
      const b = pl.get('y') ?? 0;
      const c = pl.get('') ?? 0;
      expect(num(q.answer)).toBeCloseTo(Math.abs(a * +m[1] + b * +m[2] + c) / Math.hypot(a, b), 9);
    }
  });

  it('amgm-min・complex-mul・line-slope', () => {
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['amgm-min']('calc') as InputQuestion;
      const t = tex(q)[1];
      const m = t.match(/^(\d*)x\+\\dfrac\{(\d+)\}\{x\}$/)!;
      const a = m[1] ? +m[1] : 1;
      expect(num(q.answer)).toBeCloseTo(2 * Math.sqrt(a * +m[2]), 9);
    }
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['complex-mul']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\((-?\d+)([+-])(\d*)i\)\((-?\d+)([+-])(\d*)i\)$/)!;
      const a = +m[1];
      const b = (m[2] === '-' ? -1 : 1) * (m[3] ? +m[3] : 1);
      const c = +m[4];
      const d = (m[5] === '-' ? -1 : 1) * (m[6] ? +m[6] : 1);
      const want = q.prompt.includes('実部') ? a * c - b * d : a * d + b * c;
      expect(num(q.answer)).toBe(want);
    }
    for (let i = 0; i < 300; i++) {
      const q = coordGenerators['line-slope']('calc') as InputQuestion;
      const m = q.prompt.match(/\((-?\d+), (-?\d+)\)、\((-?\d+), (-?\d+)\)/)!;
      const [x1, y1, x2, y2] = m.slice(1, 5).map(Number);
      const s = (y2 - y1) / (x2 - x1);
      const want = q.prompt.includes('垂直') ? -1 / s : s;
      expect(num(q.answer)).toBeCloseTo(want, 9);
    }
  });
});
