import { describe, expect, it } from 'vitest';
import { seqStatGenerators as G } from './seqstat';
import { parsePoly } from '../../engine/poly';
import { checkInput } from '../../engine/answerCheck';
import type { ChoiceQuestion, InputQuestion } from '../types';

// 生成問題の答えを、問題文から計算しなおして確かめる

const N = 300;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\\ /g, ' ').replace(/\s+/g, ''));
const val = (s: string) => parsePoly(s).get('') ?? 0;
/** 文字 n の多項式の値 */
function atN(s: string, n: number): number {
  let t = 0;
  for (const [k, v] of parsePoly(s)) {
    const m = k.match(/^n(?:\^(\d+))?$/);
    if (k !== '' && !m) throw new Error(`n 以外の文字: ${k}`);
    t += v * (k === '' ? 1 : n ** (m![1] ? +m![1] : 1));
  }
  return t;
}
/** TeX の数（分数も）を数に */
function num(t: string): number {
  const m = t.match(/^(-?)\\dfrac\{(\d+)\}\{(\d+)\}$/);
  if (m) return ((m[1] ? -1 : 1) * +m[2]) / +m[3];
  if (!/^-?\d+(\.\d+)?$/.test(t)) throw new Error(`読めない数: ${t}`);
  return +t;
}
const list = (t: string) => t.replace(/,\\cdots$/, '').split(',').map(num);
const accepted = (q: InputQuestion) => expect(checkInput(q, q.answer).ok).toBe(true);
/** 標準正規分布の P(0 ≤ Z ≤ z)（数値積分） */
function phi0(z: number): number {
  const n = 2000;
  const h = z / n;
  const f = (x: number) => Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
  let s = f(0) + f(z);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(i * h);
  return (s * h) / 3;
}

describe('数学B（数列・統計的な推測）の生成問題の検算', () => {
  it('arith-term', () => {
    for (let i = 0; i < N; i++) {
      const q = G['arith-term']('calc') as InputQuestion;
      const t = tex(q);
      if (q.mode === 'number') {
        const xs = list(t[0]);
        const d = xs[1] - xs[0];
        expect(xs[2] - xs[1]).toBe(d);
        const k = +q.prompt.match(/第 (\d+) 項を/)![1];
        expect(val(q.answer)).toBe(xs[0] + (k - 1) * d);
      } else if (t.length >= 3 && t[1].startsWith('a_{')) {
        const [p, u] = t[1].match(/^a_\{(\d+)\}=(-?\d+)$/)!.slice(1).map(Number);
        const [r, v] = t[2].match(/^a_\{(\d+)\}=(-?\d+)$/)!.slice(1).map(Number);
        expect(atN(q.answer, p)).toBe(u);
        expect(atN(q.answer, r)).toBe(v);
      } else {
        const [, a1, d] = q.prompt.match(/初項 (-?\d+)、公差 (-?\d+)/)!.map(Number);
        for (const n of [1, 2, 7]) expect(atN(q.answer, n)).toBe(a1 + (n - 1) * d);
      }
      accepted(q);
    }
  });

  it('arith-sum', () => {
    for (let i = 0; i < N; i++) {
      const q = G['arith-sum']('calc') as InputQuestion;
      let terms: number[] = [];
      const m = q.prompt.match(/初項 (-?\d+)、公差 (-?\d+) の等差数列の、初項から第 (\d+) 項/);
      if (m) {
        const [a1, d, n] = [+m[1], +m[2], +m[3]];
        terms = Array.from({ length: n }, (_, k) => a1 + k * d);
      } else {
        const parts = tex(q)[0].split(',\\cdots,');
        const xs = list(parts[0]);
        const last = num(parts[1]);
        const d = xs[1] - xs[0];
        for (let x = xs[0]; d > 0 ? x <= last : x >= last; x += d) terms.push(x);
        expect(terms[terms.length - 1]).toBe(last);
      }
      expect(val(q.answer)).toBe(terms.reduce((s, x) => s + x, 0));
      accepted(q);
    }
  });

  it('geo-sum', () => {
    for (let i = 0; i < N; i++) {
      const q = G['geo-sum']('calc') as InputQuestion;
      let m;
      if ((m = q.prompt.match(/初項 (-?\d+)、公比 (.+?) の等比数列の、初項から第 (\d+) 項/))) {
        const a1 = +m[1];
        const r = m[2].includes('dfrac') ? 0.5 : +m[2];
        let s = 0;
        for (let k = 0; k < +m[3]; k++) s += a1 * r ** k;
        expect(val(q.answer)).toBeCloseTo(s, 9);
      } else {
        const xs = list(tex(q)[0]);
        const r = xs[1] / xs[0];
        expect(xs[2]).toBe(xs[1] * r);
        const k = +q.prompt.match(/第 (\d+) 項を/)![1];
        expect(val(q.answer)).toBe(xs[0] * r ** (k - 1));
      }
      accepted(q);
    }
  });

  it('sigma-sum', () => {
    for (let i = 0; i < N; i++) {
      const q = G['sigma-sum']('calc') as InputQuestion;
      const m = tex(q)[0].match(/^\\displaystyle\\sum_\{k=1\}\^\{(\w+)\}\((.+)\)$/)!;
      const f = (k: number) => {
        let s = 0;
        for (const [key, v] of parsePoly(m[2])) s += v * (key === '' ? 1 : key === 'k' ? k : k ** +key.split('^')[1]);
        return s;
      };
      const S = (n: number) => { let s = 0; for (let k = 1; k <= n; k++) s += f(k); return s; };
      if (m[1] === 'n') for (const n of [1, 2, 5, 9]) expect(atN(q.answer, n)).toBe(S(n));
      else expect(val(q.answer)).toBe(S(+m[1]));
      accepted(q);
    }
  });

  it('diff-seq', () => {
    for (let i = 0; i < N; i++) {
      const q = G['diff-seq']('calc') as InputQuestion;
      const xs = list(tex(q)[0]);
      // 階差が等差数列になっていること
      const b = xs.slice(1).map((x, k) => x - xs[k]);
      expect(b[2] - b[1]).toBe(b[1] - b[0]);
      expect(b[3] - b[2]).toBe(b[1] - b[0]);
      xs.forEach((x, k) => expect(atN(q.answer, k + 1)).toBe(x));
      accepted(q);
    }
  });

  it('recurrence', () => {
    for (let i = 0; i < N; i++) {
      const q = G.recurrence('calc') as InputQuestion;
      const t = tex(q);
      const a1 = +t[0].split('=')[1];
      const m = t[1].match(/^a_\{n\+1\}=(-?\d+)a_n([+-]\d+)?$/)!;
      const p = +m[1], c = m[2] ? +m[2] : 0;
      const k = +q.prompt.match(/第 (\d+) 項/)![1];
      let a = a1;
      for (let j = 1; j < k; j++) a = p * a + c;
      expect(val(q.answer)).toBe(a);
      accepted(q);
    }
  });

  it('rv-mean', () => {
    for (let i = 0; i < N; i++) {
      const q = G['rv-mean']('calc') as InputQuestion;
      const t = tex(q);
      if (q.prompt.includes('とり得る値')) {
        const xs = list(t[0]);
        const ps = list(t[1]);
        expect(ps.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 12);
        const E = xs.reduce((s, x, k) => s + x * ps[k], 0);
        const V = xs.reduce((s, x, k) => s + (x - E) ** 2 * ps[k], 0);
        expect(val(q.answer)).toBeCloseTo(q.prompt.includes('期待値') ? E : V, 9);
      } else {
        const [, m, v] = q.prompt.match(/期待値が (-?\d+)、分散が (\d+)/)!.map(Number);
        const ym = t[0].match(/^Y=(-?\d*)X([+-]\d+)?$/)!;
        const a = ym[1] === '' ? 1 : ym[1] === '-' ? -1 : +ym[1];
        const b = ym[2] ? +ym[2] : 0;
        const want = q.prompt.includes('期待値 $E') ? a * m + b : q.prompt.includes('分散 $V') ? a * a * v : Math.abs(a) * Math.sqrt(v);
        expect(val(q.answer)).toBeCloseTo(want, 9);
      }
      accepted(q);
    }
  });

  it('binom-ev', () => {
    for (let i = 0; i < N; i++) {
      const q = G['binom-ev']('calc') as InputQuestion;
      const n = +q.prompt.match(/(\d+) 回/)![1];
      const p = q.prompt.includes('さいころ') ? 1 / 6 : q.prompt.includes('コイン') ? 1 / 2 : q.prompt.includes('1}{3}') ? 1 / 3 : 1 / 5;
      // 定義どおり Σ k·P(X = k) で計算する
      let E = 0, E2 = 0, c = 1;
      for (let k = 0; k <= n; k++) {
        const pr = c * p ** k * (1 - p) ** (n - k);
        E += k * pr;
        E2 += k * k * pr;
        c = (c * (n - k)) / (k + 1);
      }
      const V = E2 - E * E;
      const want = q.prompt.includes('期待値') ? E : q.prompt.includes('分散') ? V : Math.sqrt(V);
      expect(val(q.answer)).toBeCloseTo(want, 6);
      accepted(q);
    }
  });

  it('normal-prob', () => {
    for (let i = 0; i < N; i++) {
      const q = G['normal-prob']('calc') as InputQuestion;
      const t = tex(q);
      const [m, s] = t[0].match(/^N\((\d+),(\d+)\^2\)$/)!.slice(1).map(Number);
      const P = (z: number) => (z >= 0 ? 0.5 + phi0(z) : 0.5 - phi0(-z)); // P(Z ≤ z)
      const cond = t[1].replace(/^P\(|\)$/g, '');
      let want: number;
      let mm;
      if ((mm = cond.match(/^X\\ge([\d.]+)$/))) want = 1 - P((+mm[1] - m) / s);
      else if ((mm = cond.match(/^X\\le([\d.]+)$/))) want = P((+mm[1] - m) / s);
      else {
        mm = cond.match(/^([\d.]+)\\leX\\le([\d.]+)$/)!;
        want = P((+mm[2] - m) / s) - P((+mm[1] - m) / s);
      }
      expect(Math.abs(val(q.answer) - want)).toBeLessThan(2e-4); // 表は 4 けたに丸めてある
      // 問題文の表の値が正しい
      for (const x of t.slice(2)) {
        const [, z, v] = x.match(/^P\(0\\leZ\\le([\d.]+)\)=([\d.]+)$/)!;
        expect(Math.abs(phi0(+z) - +v)).toBeLessThan(1e-4);
      }
      accepted(q);
    }
  });

  it('interval', () => {
    for (let i = 0; i < N; i++) {
      const q = G.interval('calc') as InputQuestion;
      const [, sig, n, xbar] = q.prompt.match(/母標準偏差 (\d+) の母集団から大きさ (\d+) の標本.*標本平均は ([\d.]+)/)!.map(Number);
      const w = (1.96 * sig) / Math.sqrt(n);
      const want = q.prompt.includes('A の値') ? xbar - w : xbar + w;
      expect(val(q.answer)).toBeCloseTo(want, 9);
      accepted(q);
    }
  });

  it('test-judge', () => {
    for (let i = 0; i < N; i++) {
      const q = G['test-judge']('calc') as ChoiceQuestion;
      const k = +q.prompt.match(/(\d+) 回出た/)![1];
      const [, mean, sd] = tex(q)[0].match(/^z=\\dfrac\{X-(\d+)\}\{(\d+)\}$/)!.map(Number);
      const z = (k - mean) / sd;
      expect(Number.isInteger(k)).toBe(true);
      const c = q.choices[q.answer];
      expect(c.startsWith(`z = ${z} で`)).toBe(true);
      expect(c.includes(Math.abs(z) > 1.96 ? '棄却される' : '棄却されない')).toBe(true);
      expect(new Set(q.choices).size).toBe(4);
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
