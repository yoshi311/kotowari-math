import { describe, expect, it } from 'vitest';
import { waveGenerators as G } from './wave';
import { parsePoly, constValue } from '../../engine/poly';
import { checkInput } from '../../engine/answerCheck';
import type { ChoiceQuestion, InputQuestion } from '../types';

// 生成問題の答えを、問題文から数値計算で求めなおして確かめる

const N = 300;
const num = (s: string) => constValue(parsePoly(s))!;
const tex = (q: { prompt: string }) => [...q.prompt.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\s+/g, ''));
const strip = (s: string) => s.replace(/\$/g, '').replace(/\s+/g, '');
const T = Math.PI;

/** 弧度の TeX（"\dfrac{5\pi}{6}" など）を数値に */
function radVal(t: string): number {
  if (t === '0') return 0;
  const m = t.match(/^(-?)(?:(\d*)\\pi|\\dfrac\{(\d*)\\pi\}\{(\d+)\})$/);
  if (!m) throw new Error(`読めない角: ${t}`);
  const sg = m[1] ? -1 : 1;
  if (m[4]) return (sg * (m[3] ? +m[3] : 1) * T) / +m[4];
  return sg * (m[2] ? +m[2] : 1) * T;
}
/** 値の TeX（√ と分数）を数値に */
function ev(t: string): number {
  let s = t.replace(/\s+/g, '');
  s = s.replace(/\\sqrt\{(\d+)\}/g, 'Math.sqrt($1)');
  s = s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
  if (/[\\{}]/.test(s)) throw new Error(`読めない値: ${t}`);
  return Function(`return ${s}`)();
}
const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan } as const;
/** "0<\theta<\dfrac{\pi}{2}" などの範囲から、その中の角を 1 つ作る（基準角 φ から） */
function inRange(range: string, phi: number): number {
  const lo = radVal(range.split('<')[0]);
  if (Math.abs(lo) < 1e-9) return phi;
  if (Math.abs(lo - T / 2) < 1e-9) return T - phi;
  if (Math.abs(lo - T) < 1e-9) return T + phi;
  return 2 * T - phi;
}
const fixRange = (r: string) => r.replace(/\\dfrac\{3\}\{2\}\\pi/g, '\\dfrac{3\\pi}{2}').replace(/\\alpha/g, '\\theta');

describe('数学Ⅱ（三角関数）の生成問題の検算', () => {
  it('rad-convert', () => {
    for (let i = 0; i < N; i++) {
      const q = G['rad-convert']('calc');
      if (q.type === 'choice') {
        const deg = +q.prompt.match(/\$(-?\d+)\^\\circ\$/)![1];
        expect(radVal(strip(q.choices[q.answer]))).toBeCloseTo((deg * T) / 180, 9);
        expect(new Set(q.choices).size).toBe(4);
      } else {
        expect(num((q as InputQuestion).answer)).toBeCloseTo((radVal(tex(q)[0]) * 180) / T, 9);
      }
    }
  });

  it('arc-sector', () => {
    for (let i = 0; i < N; i++) {
      const q = G['arc-sector']('calc') as InputQuestion;
      const t = tex(q);
      const r = +t[0];
      const th = radVal(t[1]);
      const want = q.prompt.includes('弧の長さ') ? r * th : (r * r * th) / 2;
      expect(num(q.answer) * T).toBeCloseTo(want, 9);
    }
  });

  it('trig-value2', () => {
    for (let i = 0; i < N; i++) {
      const q = G['trig-value2']('calc') as ChoiceQuestion;
      const m = tex(q)[0].match(/^\\(sin|cos|tan)(?:\\left\((.+)\\right\)|(.+))$/)!;
      const want = F[m[1] as 'sin'](radVal(m[2] ?? m[3]));
      expect(ev(strip(q.choices[q.answer]))).toBeCloseTo(want, 9);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('trig-identity', () => {
    for (let i = 0; i < N; i++) {
      const q = G['trig-identity']('calc') as InputQuestion;
      const t = tex(q);
      const g = t[1].match(/^\\(sin|cos)\\theta=(.+)$/)!;
      const v = ev(g[2]);
      const phi = g[1] === 'sin' ? Math.asin(Math.abs(v)) : Math.acos(Math.abs(v));
      const th = inRange(fixRange(t[0]), phi);
      expect(F[g[1] as 'sin'](th)).toBeCloseTo(v, 9); // 与えられた値と範囲がむじゅんしない
      const fn = q.prompt.includes('tan θ の値') ? 'tan' : q.prompt.includes('cos θ の値') ? 'cos' : 'sin';
      expect(num(q.answer)).toBeCloseTo(F[fn](th), 9);
    }
  });

  it('sym-value', () => {
    for (let i = 0; i < N; i++) {
      const q = G['sym-value']('calc') as InputQuestion;
      const t = tex(q);
      const s = ev(t[0].split('=')[1]);
      const th = Math.asin(s / Math.SQRT2) - T / 4; // sinθ + cosθ = √2 sin(θ + π/4)
      expect(Math.sin(th) + Math.cos(th)).toBeCloseTo(s, 9);
      const want = t[1].includes('\\sin\\theta\\cos\\theta') && !t[1].includes('^2') ? Math.sin(th) * Math.cos(th) : (Math.sin(th) - Math.cos(th)) ** 2;
      expect(num(q.answer)).toBeCloseTo(want, 9);
    }
  });

  it('period（周期・最大最小）', () => {
    for (let i = 0; i < N; i++) {
      const q = G.period('calc') as InputQuestion;
      const t = tex(q)[0];
      const fn = t.includes('\\sin') ? Math.sin : Math.cos;
      if (q.prompt.includes('周期')) {
        const b = t.includes('\\dfrac{\\theta}{2}') ? 0.5 : (() => { const m = t.match(/(\d*)\\theta/)!; return m[1] ? +m[1] : 1; })();
        const c = t.includes('+\\dfrac{\\pi}{3}') ? T / 3 : t.includes('-\\dfrac{\\pi}{3}') ? -T / 3 : 0;
        const f = (x: number) => fn(b * x + c);
        const P = num(q.answer) * T;
        for (const x of [0.1, 0.7, 1.9, 3.3]) expect(f(x + P)).toBeCloseTo(f(x), 9);
        // P/2・P/3 では元にもどらない（P が最小の周期）
        for (const k of [2, 3]) expect([0.1, 0.7, 1.9, 3.3].some((x) => Math.abs(f(x + P / k) - f(x)) > 1e-6)).toBe(true);
      } else {
        const m = t.match(/^y=(-?\d*)\\(?:sin|cos)(.+?)([+-]\d+)?$/)!;
        const a = m[1] === '' ? 1 : m[1] === '-' ? -1 : +m[1];
        const d = m[3] ? +m[3] : 0;
        let mx = -Infinity;
        let mn = Infinity;
        for (let u = 0; u < 2 * T; u += 0.001) {
          const v = a * fn(u) + d;
          mx = Math.max(mx, v);
          mn = Math.min(mn, v);
        }
        expect(num(q.answer)).toBeCloseTo(q.prompt.includes('最大値') ? mx : mn, 5);
      }
    }
  });

  it('trig-eq', () => {
    for (let i = 0; i < N; i++) {
      const q = G['trig-eq']('calc') as ChoiceQuestion;
      const m = tex(q)[1].match(/^\\(sin|cos)\\theta=(.+)$/)!;
      const f = F[m[1] as 'sin'];
      const k = ev(m[2]);
      const got = strip(q.choices[q.answer]).replace(/^\\theta=/, '').split(',\\').map(radVal);
      for (const x of got) expect(f(x)).toBeCloseTo(k, 9);
      // 0 ≦ θ < 2π の解の個数（細かく調べる）
      let count = 0;
      for (let d = 0; d < 360; d += 0.5) if (Math.abs(f((d * T) / 180) - k) < 1e-9) count++;
      expect(got.length).toBe(count);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('addition-value', () => {
    for (let i = 0; i < N; i++) {
      const q = G['addition-value']('calc') as ChoiceQuestion;
      const m = tex(q)[0].match(/^\\(sin|cos|tan)(\d+)\^\\circ$/)!;
      expect(ev(strip(q.choices[q.answer]))).toBeCloseTo(F[m[1] as 'sin']((+m[2] * T) / 180), 9);
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('addition-calc', () => {
    for (let i = 0; i < N; i++) {
      const q = G['addition-calc']('calc') as InputQuestion;
      const t = tex(q);
      const sa = ev(t[2].split('=')[1]);
      const cb = ev(t[3].split('=')[1]);
      const al = inRange(fixRange(t[0]), Math.asin(sa));
      const be = Math.acos(cb);
      const name = t[4];
      const want = name.startsWith('\\sin') ? Math.sin(name.includes('+') ? al + be : al - be) : Math.cos(name.includes('+') ? al + be : al - be);
      expect(num(q.answer)).toBeCloseTo(want, 9);
    }
  });

  it('double-angle', () => {
    for (let i = 0; i < N; i++) {
      const q = G['double-angle']('calc') as InputQuestion;
      const t = tex(q);
      const g = t[1].match(/^\\(sin|cos)\\theta=(.+)$/)!;
      const v = ev(g[2]);
      const th = inRange(fixRange(t[0]), g[1] === 'sin' ? Math.asin(Math.abs(v)) : Math.acos(Math.abs(v)));
      expect(F[g[1] as 'sin'](th)).toBeCloseTo(v, 9);
      const want = t[2].startsWith('\\sin') ? Math.sin(2 * th) : Math.cos(2 * th);
      expect(num(q.answer)).toBeCloseTo(want, 9);
    }
  });

  it('synthesis', () => {
    for (let i = 0; i < N; i++) {
      const q = G.synthesis('calc') as InputQuestion;
      const m = tex(q)[0].match(/^y=(.*?)\\sin\\theta([+-])(.*?)\\cos\\theta([+-]\d+)?$/)!;
      const a = m[1] === '' ? 1 : ev(m[1]);
      const b = (m[2] === '-' ? -1 : 1) * (m[3] === '' ? 1 : ev(m[3]));
      const d = m[4] ? +m[4] : 0;
      let mx = -Infinity;
      let mn = Infinity;
      for (let u = 0; u < 2 * T; u += 0.0005) {
        const v = a * Math.sin(u) + b * Math.cos(u) + d;
        mx = Math.max(mx, v);
        mn = Math.min(mn, v);
      }
      expect(num(q.answer)).toBeCloseTo(q.prompt.includes('最大値') ? mx : mn, 5);
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
