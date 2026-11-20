import { describe, expect, it } from 'vitest';
import { expLogGenerators as G } from './explog';
import { parsePoly, constValue } from '../../engine/poly';
import type { ChoiceQuestion, InputQuestion } from '../types';
import { checkInput } from '../../engine/answerCheck';

// 生成問題の答えを、問題文から別の方法（数値計算）で計算しなおして確かめる

const N = 300;
const num = (s: string) => constValue(parsePoly(s))!;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\s+/g, ''));
const strip = (s: string) => s.replace(/\$/g, '').replace(/\s+/g, '');

/** 問題文に出てくる数の TeX を数値に */
function val(t: string): number {
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^\\left\(\\dfrac\{1\}\{(\d+)\}\\right\)$/))) return 1 / +m[1];
  if ((m = t.match(/^\\d?frac\{1\}\{(.+)\}$/))) return 1 / val(m[1]);
  if ((m = t.match(/^\\sqrt(?:\[(\d+)\])?\{(\d+)\}$/))) return (+m[2]) ** (1 / (m[1] ? +m[1] : 2));
  if (/^-?\d+$/.test(t)) return +t;
  throw new Error(`読めない数: ${t}`);
}
/** 指数（"3"、"\frac{3}{2}"、"-\frac{1}{2}"） */
function expo(e: string): number {
  const m = e.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/);
  return m ? ((m[1] ? -1 : 1) * +m[2]) / +m[3] : +e;
}
/** "B^{e}" の値 */
function powVal(t: string): number {
  const m = t.match(/^(\d+)\^\{(.+)\}$/);
  if (!m) throw new Error(`読めない累乗: ${t}`);
  return (+m[1]) ** expo(m[2]);
}
const logb = (b: number, x: number) => Math.log(x) / Math.log(b);

describe('数学Ⅱ（指数・対数）の生成問題の検算', () => {
  it('exp-simplify', () => {
    for (let i = 0; i < N; i++) {
      const q = G['exp-simplify']('calc') as InputQuestion;
      expect(num(q.answer)).toBeCloseTo(powVal(tex(q)[0]), 9);
    }
  });

  it('exp-law', () => {
    for (let i = 0; i < N; i++) {
      const q = G['exp-law']('calc') as InputQuestion;
      const t = tex(q);
      const rs = [...t[0].matchAll(/\\sqrt(?:\[(\d+)\])?\{(\d+)\}/g)].map((m) => Math.log(+m[2]) / (m[1] ? +m[1] : 2));
      const r = +t[1].match(/^(\d+)\^\{p\}$/)![1];
      expect(num(q.answer)).toBeCloseTo((rs[0] + rs[1] - rs[2]) / Math.log(r), 9);
    }
  });

  it('exp-order', () => {
    for (let i = 0; i < N; i++) {
      const q = G['exp-order']('calc') as ChoiceQuestion;
      const vs = strip(q.choices[q.answer]).split('<').map(powVal);
      expect(vs[0]).toBeLessThan(vs[1]);
      expect(vs[1]).toBeLessThan(vs[2]);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('exp-eq', () => {
    for (let i = 0; i < N; i++) {
      const q = G['exp-eq']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^(\d+)\^\{(.+)\}=(.+)$/)!;
      const pl = parsePoly(m[2]);
      const p = pl.get('x') ?? 0;
      const c = pl.get('') ?? 0;
      expect(num(q.answer)).toBeCloseTo((logb(+m[1], val(m[3])) - c) / p, 9);
    }
  });

  it('exp-ineq', () => {
    for (let i = 0; i < N; i++) {
      const q = G['exp-ineq']('calc') as ChoiceQuestion;
      const m = tex(q)[0].match(/^(.+)\^\{x\}([<>])(.+)$/)!;
      const a = val(m[1]);
      const R = val(m[3]);
      const holds = (x: number) => (m[2] === '>' ? a ** x > R : a ** x < R);
      const c = strip(q.choices[q.answer]).match(/^x([<>])(-?\d+)$/)!;
      const inSol = (x: number) => (c[1] === '>' ? x > +c[2] : x < +c[2]);
      for (const d of [-3, -0.5, 0.5, 3]) expect(holds(+c[2] + d)).toBe(inSol(+c[2] + d));
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('log-value', () => {
    for (let i = 0; i < N; i++) {
      const q = G['log-value']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\\log_\{(\d+)\}(.+)$/)!;
      expect(num(q.answer)).toBeCloseTo(logb(+m[1], val(m[2])), 9);
    }
  });

  it('log-calc', () => {
    for (let i = 0; i < N; i++) {
      const q = G['log-calc']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\\log_\{(\d+)\}(\d+)\+\\log_\{\d+\}(\d+)-\\log_\{\d+\}(\d+)$/)!;
      const a = +m[1];
      expect(num(q.answer)).toBeCloseTo(logb(a, +m[2]) + logb(a, +m[3]) - logb(a, +m[4]), 9);
    }
  });

  it('log-change', () => {
    for (let i = 0; i < N; i++) {
      const q = G['log-change']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\\log_\{(\d+)\}(\d+)\\cdot\\log_\{(\d+)\}(.+)$/)!;
      expect(m[2]).toBe(m[3]);
      expect(num(q.answer)).toBeCloseTo(logb(+m[1], +m[2]) * logb(+m[3], val(m[4])), 9);
    }
  });

  it('log-eq（真数条件もみたす）', () => {
    for (let i = 0; i < N; i++) {
      const q = G['log-eq']('calc') as InputQuestion;
      const t = tex(q)[0];
      const x = num(q.answer);
      const m1 = t.match(/^\\log_\{(\d+)\}\((.+)\)=(\d+)$/);
      if (m1) {
        const pl = parsePoly(m1[2]);
        const inner = (pl.get('x') ?? 0) * x + (pl.get('') ?? 0);
        expect(inner).toBeGreaterThan(0);
        expect(logb(+m1[1], inner)).toBeCloseTo(+m1[3], 9);
      } else {
        const m2 = t.match(/^\\log_\{(\d+)\}x\+\\log_\{\d+\}\(x-(\d+)\)=(\d+)$/)!;
        const d = +m2[2];
        expect(x).toBeGreaterThan(d);
        expect(logb(+m2[1], x) + logb(+m2[1], x - d)).toBeCloseTo(+m2[3], 9);
      }
    }
  });

  it('log-ineq', () => {
    for (let i = 0; i < N; i++) {
      const q = G['log-ineq']('calc') as ChoiceQuestion;
      const m = tex(q)[0].match(/^\\log_\{(.+?)\}x([<>])(-?\d+)$/)!;
      const b = val(m[1]);
      const k = +m[3];
      const holds = (x: number) => x > 0 && (m[2] === '>' ? logb(b, x) > k : logb(b, x) < k);
      const c = strip(q.choices[q.answer]);
      const up = c.match(/^x>(.+)$/);
      const lo = c.match(/^0<x<(.+)$/);
      expect(up || lo, c).toBeTruthy();
      const B = val((up ?? lo)![1]);
      const inSol = (x: number) => (up ? x > B : x > 0 && x < B);
      for (const x of [-1, B * 0.3, B * 0.9, B * 1.1, B * 3]) expect(holds(x)).toBe(inSol(x));
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('digits（実際の整数で確かめる）', () => {
    for (let i = 0; i < N; i++) {
      const q = G.digits('calc') as InputQuestion;
      const big = q.prompt.match(/\$(\d+)\^\{(\d+)\}\$ は何けた/);
      const small = q.prompt.match(/\\left\(\\dfrac\{1\}\{(\d+)\}\\right\)\^\{(\d+)\}/);
      const m = (big ?? small)!;
      const X = BigInt(m[1]) ** BigInt(m[2]);
      if (big) {
        expect(+q.answer).toBe(X.toString().length);
      } else {
        // 1/X の小数第 p 位にはじめて 0 でない数字 ⇔ 10^(p-1) < X ≤ 10^p
        let p = 0;
        while (10n ** BigInt(p) < X) p++;
        expect(+q.answer).toBe(p);
      }
    }
  });
  it('入力問題の正解が、そのまま入力して正解と判定される', () => {
    for (const [name, g] of Object.entries(G)) {
      for (let i = 0; i < 100; i++) {
        const q = g('calc');
        if (q.type === 'input') expect(checkInput(q, q.answer).ok, `${name}: ${q.answer}`).toBe(true);
      }
    }
  });
});
