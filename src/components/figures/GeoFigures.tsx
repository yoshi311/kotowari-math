import { useState } from 'react';
import { Tex } from '../RichText';
import { nice } from './Plane';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 図形の性質（数学A）の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#9b5de5';

type P = [number, number];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const lerp = (a: P, b: P, t: number): P => add(a, mul(sub(b, a), t));
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
/** 角 AVB（度） */
function angleAt(v: P, a: P, b: P): number {
  const u = sub(a, v);
  const w = sub(b, v);
  const c = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w));
  return deg(Math.acos(Math.max(-1, Math.min(1, c))));
}
/** 直線 p1p2 と直線 p3p4 の交点 */
function intersect(p1: P, p2: P, p3: P, p4: P): P | null {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  if (Math.abs(d) < 1e-9) return null;
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
}
/** 円周上の点（数学の角度、y は上向き → SVG では下向き） */
const onCircle = (c: P, r: number, a: number): P => [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
const pts = (...ps: P[]) => ps.map((p) => p.join(',')).join(' ');

function Dot({ p, label, color = '#fff', dx = 0, dy = -14 }: { p: P; label?: string; color?: string; dx?: number; dy?: number }) {
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={4} fill={color} />
      {label && (
        <Label x={p[0] + dx} y={p[1] + dy} color={color} size={13}>
          {label}
        </Label>
      )}
    </g>
  );
}

function Seg({ a, b, color = '#fff', w = 2, dash }: { a: P; b: P; color?: string; w?: number; dash?: string }) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeDasharray={dash} />;
}

/** 頂点 v の角の弧（a 方向から b 方向へ、小さい方） */
function AngleArc({ v, a, b, r = 22, color = GOLD }: { v: P; a: P; b: P; r?: number; color?: string }) {
  const t1 = Math.atan2(a[1] - v[1], a[0] - v[0]);
  let t2 = Math.atan2(b[1] - v[1], b[0] - v[0]);
  let d = t2 - t1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  t2 = t1 + d;
  const p1: P = [v[0] + r * Math.cos(t1), v[1] + r * Math.sin(t1)];
  const p2: P = [v[0] + r * Math.cos(t2), v[1] + r * Math.sin(t2)];
  return <path d={`M${p1[0]} ${p1[1]} A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2[0]} ${p2[1]}`} fill="none" stroke={color} strokeWidth={2.5} />;
}

const U = 28; // 1 目もりの長さ（px）
const len = (a: P, b: P) => nice(dist(a, b) / U, 1);

// ---------- 1. 角の二等分線と線分の比 ----------

export function Bisector() {
  const [ax, setAx] = useState(130);
  const [ay, setAy] = useState(50);
  const B: P = [40, 200];
  const C: P = [320, 200];
  const A: P = [ax, ay];
  const c = dist(A, B);
  const b = dist(A, C);
  const D = lerp(B, C, c / (b + c));
  return (
    <div className="figure">
      <svg viewBox="0 0 360 230" className="area-svg" style={{ maxWidth: 440 }}>
        <polygon points={pts(A, B, C)} fill="rgba(155,93,229,0.15)" stroke="#fff" strokeWidth={2} />
        <Seg a={B} b={D} color={BLUE} w={5} />
        <Seg a={D} b={C} color={PINK} w={5} />
        <Seg a={A} b={B} color={BLUE} w={3} dash="6 4" />
        <Seg a={A} b={C} color={PINK} w={3} dash="6 4" />
        <Seg a={A} b={D} color={GOLD} w={2.5} />
        <AngleArc v={A} a={B} b={D} r={26} />
        <AngleArc v={A} a={D} b={C} r={32} />
        <Dot p={A} label="A" />
        <Dot p={B} label="B" dx={-10} dy={12} />
        <Dot p={C} label="C" dx={10} dy={12} />
        <Dot p={D} label="D" color={GOLD} dy={16} />
      </svg>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: BLUE }}>
          <span>AB : AC</span>
          <strong>{len(A, B)} : {len(A, C)}</strong>
        </div>
        <div style={{ borderColor: PINK }}>
          <span>BD : DC</span>
          <strong>{len(B, D)} : {len(D, C)}</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\dfrac{AB}{AC} = ${nice(c / b, 3)},\\quad \\dfrac{BD}{DC} = ${nice(dist(B, D) / dist(D, C), 3)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="A を左右に" value={ax} min={60} max={300} onChange={setAx} />
        <Slider label="A を上下に" value={ay} min={30} max={150} onChange={setAy} />
      </div>
      <p className="figure-note">角 A を半分に分ける線（金色）は、向かいの辺 BC を「となりの 2 辺の比」AB : AC に分ける。A をどこに動かしても、この関係は変わらない。</p>
    </div>
  );
}

// ---------- 2. 三角形の五心 ----------

type CenterMode = 'circum' | 'in' | 'centroid' | 'ortho';

export function Centers({ mode: initial = 'circum' }: { mode?: CenterMode }) {
  const [mode, setMode] = useState<CenterMode>(initial);
  const [ax, setAx] = useState(140);
  const [ay, setAy] = useState(60);
  const A: P = [ax, ay];
  const B: P = [60, 200];
  const C: P = [300, 200];
  const a = dist(B, C);
  const b = dist(C, A);
  const c = dist(A, B);
  const mBC = lerp(B, C, 0.5);
  const mCA = lerp(C, A, 0.5);
  const mAB = lerp(A, B, 0.5);
  // 外心
  const dd = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const sq = (p: P) => p[0] * p[0] + p[1] * p[1];
  const O: P = [
    (sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / dd,
    (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / dd,
  ];
  const R = dist(O, A);
  const I: P = mul(add(add(mul(A, a), mul(B, b)), mul(C, c)), 1 / (a + b + c));
  const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
  const r = (2 * area) / (a + b + c);
  const G: P = mul(add(add(A, B), C), 1 / 3);
  const H: P = sub(add(add(A, B), C), mul(O, 2));
  const foot = (v: P, p: P, q: P): P => {
    const d = sub(q, p);
    const t = ((v[0] - p[0]) * d[0] + (v[1] - p[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]);
    return add(p, mul(d, t));
  };
  const angA = angleAt(A, B, C);
  const info: Record<CenterMode, { name: string; how: string; color: string }> = {
    circum: { name: '外心 O', how: '3 辺の垂直二等分線の交点。3 つの頂点から等しい距離 → 外接円の中心。', color: BLUE },
    in: { name: '内心 I', how: '3 つの角の二等分線の交点。3 辺から等しい距離 → 内接円の中心。', color: PINK },
    centroid: { name: '重心 G', how: '3 本の中線（頂点と向かいの辺の中点を結ぶ線）の交点。中線を 2 : 1 に分ける。', color: GOLD },
    ortho: { name: '垂心 H', how: '各頂点から向かいの辺（またはその延長）に下ろした垂線の交点。', color: GREEN },
  };
  const col = info[mode].color;
  // 外接円がはみ出さないように表示範囲を広げる（大きくなりすぎないよう制限）
  const circ = mode === 'circum';
  const bx0 = circ ? Math.max(-200, Math.min(0, O[0] - R - 8)) : 0;
  const by0 = circ ? Math.max(-200, Math.min(0, O[1] - R - 8)) : 0;
  const bx1 = circ ? Math.min(560, Math.max(360, O[0] + R + 8)) : 360;
  const by1 = circ ? Math.min(450, Math.max(250, O[1] + R + 8)) : 250;
  const box = `${bx0} ${by0} ${bx1 - bx0} ${by1 - by0}`;
  return (
    <div className="figure">
      <svg viewBox={box} className="area-svg" style={{ maxWidth: 440 }}>
        {mode === 'circum' && (
          <>
            <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={BLUE} strokeWidth={1.5} opacity={0.7} />
            {[mBC, mCA, mAB].map((m, i) => (
              <Seg key={i} a={m} b={lerp(m, O, 1.4)} color={BLUE} w={1.5} dash="5 3" />
            ))}
            {[A, B, C].map((v, i) => (
              <Seg key={i} a={O} b={v} color={BLUE} w={1} />
            ))}
          </>
        )}
        {mode === 'in' && (
          <>
            <circle cx={I[0]} cy={I[1]} r={r} fill="rgba(241,91,181,0.12)" stroke={PINK} strokeWidth={1.5} />
            {[A, B, C].map((v, i) => (
              <Seg key={i} a={v} b={I} color={PINK} w={1.5} dash="5 3" />
            ))}
          </>
        )}
        {mode === 'centroid' && [
          [A, mBC],
          [B, mCA],
          [C, mAB],
        ].map(([v, m], i) => <Seg key={i} a={v as P} b={m as P} color={GOLD} w={1.5} dash="5 3" />)}
        {mode === 'centroid' && [mBC, mCA, mAB].map((m, i) => <circle key={i} cx={m[0]} cy={m[1]} r={3} fill={GOLD} />)}
        {mode === 'ortho' &&
          [
            [A, B, C],
            [B, C, A],
            [C, A, B],
          ].map(([v, p, q], i) => {
            const f = foot(v as P, p as P, q as P);
            const far = dist(v as P, H) > dist(v as P, f) ? H : f;
            return (
              <g key={i}>
                <Seg a={v as P} b={far} color={GREEN} w={1.5} dash="5 3" />
                <circle cx={f[0]} cy={f[1]} r={3} fill={GREEN} />
              </g>
            );
          })}
        <polygon points={pts(A, B, C)} fill="none" stroke="#fff" strokeWidth={2} />
        <Dot p={A} label="A" />
        <Dot p={B} label="B" dx={-10} dy={12} />
        <Dot p={C} label="C" dx={10} dy={12} />
        <Dot p={mode === 'circum' ? O : mode === 'in' ? I : mode === 'centroid' ? G : H} label={info[mode].name.slice(-1)} color={col} dx={14} dy={0} />
      </svg>
      <div className="area-formula small-formula" style={{ color: col }}>
        <strong>{info[mode].name}</strong>：{info[mode].how}
      </div>
      <div className="area-formula small-formula">
        {mode === 'circum' && <Tex>{`\\angle A = ${nice(angA, 1)}^\\circ,\\quad \\angle BOC = ${nice(angleAt(O, B, C), 1)}^\\circ\\ (= ${angA > 90 ? '360^\\circ - 2\\angle A' : '2\\angle A'})`}</Tex>}
        {mode === 'in' && <Tex>{`\\angle A = ${nice(angA, 1)}^\\circ,\\quad \\angle BIC = ${nice(angleAt(I, B, C), 1)}^\\circ = 90^\\circ + \\dfrac{\\angle A}{2}`}</Tex>}
        {mode === 'centroid' && <Tex>{`AG : GM = ${nice(dist(A, G) / U, 1)} : ${nice(dist(G, mBC) / U, 1)} = 2 : 1`}</Tex>}
        {mode === 'ortho' && <span>{angA > 90 || angleAt(B, A, C) > 90 || angleAt(C, A, B) > 90 ? '鈍角三角形では、垂心は三角形の外に出る。' : '鋭角三角形では、垂心は三角形の内部にある。'}</span>}
      </div>
      <Toggle
        label="中心"
        value={mode}
        onChange={setMode}
        options={[
          { v: 'circum', text: '外心' },
          { v: 'in', text: '内心' },
          { v: 'centroid', text: '重心' },
          { v: 'ortho', text: '垂心' },
        ]}
      />
      <div className="sliders">
        <Slider label="A を左右に" value={ax} min={40} max={320} onChange={setAx} />
        <Slider label="A を上下に" value={ay} min={30} max={170} onChange={setAy} />
      </div>
      <p className="figure-note">三角形の形をどう変えても、3 本の線はかならず 1 点で交わる。外心は鈍角三角形だと外に出る。{mode === 'circum' && '中心角 ∠BOC は、いつも ∠A の 2 倍（円周角の定理）。'}</p>
    </div>
  );
}

// ---------- 3. チェバの定理・メネラウスの定理 ----------

export function Ceva() {
  const [mode, setMode] = useState<'ceva' | 'mene'>('ceva');
  const [h, setH] = useState(35);
  const [t, setT] = useState(40);
  const [f, setF] = useState(40);
  const [e, setE] = useState(65);
  const A: P = [170, 30];
  const B: P = [40, 210];
  const C: P = [300, 210];
  let D: P | null;
  let E: P | null;
  let F: P | null;
  let Pp: P | null = null;
  if (mode === 'ceva') {
    Pp = lerp(lerp(B, A, h / 100), lerp(C, A, h / 100), t / 100);
    D = intersect(A, Pp, B, C);
    E = intersect(B, Pp, C, A);
    F = intersect(C, Pp, A, B);
  } else {
    F = lerp(A, B, f / 100);
    E = lerp(A, C, e / 100);
    D = Math.abs(f - e) < 3 ? null : intersect(F, E, B, C);
  }
  const ok = D && E && F;
  // メネラウスの交点 D が見えるように表示範囲を広げる
  const mx0 = D ? Math.max(-300, Math.min(0, D[0] - 24)) : 0;
  const mx1 = D ? Math.min(660, Math.max(360, D[0] + 24)) : 360;
  const r1 = ok ? dist(A, F!) / dist(F!, B) : 0;
  const r2 = ok ? dist(B, D!) / dist(D!, C) : 0;
  const r3 = ok ? dist(C, E!) / dist(E!, A) : 0;
  return (
    <div className="figure">
      <svg viewBox={`${mx0} 0 ${mx1 - mx0} 240`} className="area-svg" style={{ maxWidth: 440 }}>
        {mode === 'mene' && D && <Seg a={C} b={D} color="var(--muted)" w={1.5} dash="4 3" />}
        <polygon points={pts(A, B, C)} fill="rgba(155,93,229,0.15)" stroke="#fff" strokeWidth={2} />
        {mode === 'ceva' && Pp && ok && (
          <>
            <Seg a={A} b={D!} color={GOLD} w={1.8} />
            <Seg a={B} b={E!} color={GOLD} w={1.8} />
            <Seg a={C} b={F!} color={GOLD} w={1.8} />
            <Dot p={Pp} label="P" color={GOLD} dx={12} dy={-6} />
          </>
        )}
        {mode === 'mene' && ok && <Seg a={F!} b={D!} color={GREEN} w={2.5} />}
        <Dot p={A} label="A" />
        <Dot p={B} label="B" dx={-10} dy={12} />
        <Dot p={C} label="C" dx={10} dy={12} />
        {F && <Dot p={F} label="F" color={PINK} dx={-12} dy={-4} />}
        {E && <Dot p={E} label="E" color={BLUE} dx={12} dy={-4} />}
        {D && <Dot p={D} label="D" color={GREEN} dy={16} />}
      </svg>
      {ok ? (
        <div className="area-formula small-formula">
          <Tex>{`\\dfrac{AF}{FB} \\cdot \\dfrac{BD}{DC} \\cdot \\dfrac{CE}{EA} = ${nice(r1, 2)} \\times ${nice(r2, 2)} \\times ${nice(r3, 2)} = ${nice(r1 * r2 * r3, 2)}`}</Tex>
        </div>
      ) : (
        <div className="area-formula small-formula">直線 FE が BC と平行に近いので、交点 D ができない。</div>
      )}
      <Toggle
        label="定理"
        value={mode}
        onChange={setMode}
        options={[
          { v: 'ceva', text: 'チェバ' },
          { v: 'mene', text: 'メネラウス' },
        ]}
      />
      <div className="sliders">
        {mode === 'ceva' ? (
          <>
            <Slider label="P を上下に" value={h} min={10} max={80} onChange={setH} color={GOLD} />
            <Slider label="P を左右に" value={t} min={10} max={90} onChange={setT} color={GOLD} />
          </>
        ) : (
          <>
            <Slider label="F の位置（AB 上）" value={f} min={15} max={85} onChange={setF} color={PINK} />
            <Slider label="E の位置（AC 上）" value={e} min={15} max={85} onChange={setE} color={BLUE} />
          </>
        )}
      </div>
      <p className="figure-note">
        {mode === 'ceva'
          ? '三角形の内部の点 P と各頂点を結ぶ線が向かいの辺と交わるとき、A→F→B→D→C→E→A と一周する比をかけると、いつも 1 になる。'
          : '直線（緑）が三角形の 2 辺と、残り 1 辺の延長と交わるとき、A→F→B→D→C→E→A と一周する比をかけると、いつも 1 になる。'}
      </p>
    </div>
  );
}

// ---------- 4. 円周角の定理 ----------

export function InscribedAngle() {
  const [p, setP] = useState(100);
  const [cAng, setCAng] = useState(120);
  const O: P = [180, 120];
  const R = 90;
  const aA = 270 - cAng / 2;
  const aB = 270 + cAng / 2;
  const A = onCircle(O, R, aA);
  const B = onCircle(O, R, aB);
  const Pp = onCircle(O, R, p);
  const pm = ((p % 360) + 360) % 360;
  const onMinor = pm > aA && pm < aB;
  const near = Math.abs(pm - aA) < 4 || Math.abs(pm - aB) < 4;
  const apb = near ? 0 : angleAt(Pp, A, B);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 230" className="area-svg" style={{ maxWidth: 420 }}>
        <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="var(--muted)" strokeWidth={1.5} />
        <path d={`M${A[0]} ${A[1]} A${R} ${R} 0 0 0 ${B[0]} ${B[1]}`} fill="none" stroke={PINK} strokeWidth={4} />
        <polygon points={pts(O, A, B)} fill="rgba(0,187,249,0.12)" stroke={BLUE} strokeWidth={1.5} />
        <AngleArc v={O} a={A} b={B} r={18} color={BLUE} />
        {!near && (
          <>
            <Seg a={Pp} b={A} color={GOLD} w={2} />
            <Seg a={Pp} b={B} color={GOLD} w={2} />
            <AngleArc v={Pp} a={A} b={B} r={22} />
          </>
        )}
        <Dot p={O} label="O" color={BLUE} dy={-12} />
        <Dot p={A} label="A" dx={-12} dy={8} />
        <Dot p={B} label="B" dx={12} dy={8} />
        <Dot p={Pp} label="P" color={GOLD} dx={(Pp[0] - O[0]) / 7} dy={(Pp[1] - O[1]) / 7} />
      </svg>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: BLUE }}>
          <span>中心角 ∠AOB（ピンクの弧）</span>
          <strong>{cAng}°</strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>円周角 ∠APB</span>
          <strong>{near ? '—' : `${nice(apb, 0)}°`}</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        {near ? 'P を A・B 以外の場所に動かしてね。' : onMinor ? `P がピンクの弧の上 → ∠APB ＝ 180° − ${cAng / 2}° ＝ ${180 - cAng / 2}°（向かい合う角の和は 180°）` : `P がピンクの弧の反対側 → ∠APB ＝ ${cAng}° ÷ 2 ＝ ${cAng / 2}°（どこでも同じ）`}
      </div>
      <div className="sliders">
        <Slider label="P を円の上で動かす" value={p} min={0} max={359} onChange={setP} color={GOLD} />
        <Slider label="中心角（弧の大きさ）" value={cAng} min={40} max={180} step={10} onChange={setCAng} color={BLUE} />
      </div>
      <p className="figure-note">同じ弧に対する円周角は、P がどこにあっても等しく、中心角の半分。中心角を 180° にすると AB は直径になり、円周角は 90°。</p>
    </div>
  );
}

// ---------- 5. 接線と弦のつくる角 ----------

export function TangentChord() {
  const [beta, setBeta] = useState(30);
  const [t, setT] = useState(50);
  const O: P = [180, 105];
  const R = 80;
  const A = onCircle(O, R, 270);
  const B = onCircle(O, R, beta);
  const C = onCircle(O, R, beta + (t / 100) * (270 - beta));
  const T: P = [A[0] + 150, A[1]];
  const tc = (beta + 90) / 2;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 420 }}>
        <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="var(--muted)" strokeWidth={1.5} />
        <Seg a={[A[0] - 160, A[1]]} b={T} color={GREEN} w={2.5} />
        <Seg a={A} b={B} color="#fff" w={2.5} />
        <Seg a={C} b={A} color={GOLD} w={2} />
        <Seg a={C} b={B} color={GOLD} w={2} />
        <AngleArc v={A} a={T} b={B} r={26} color={PINK} />
        <AngleArc v={C} a={A} b={B} r={22} color={PINK} />
        <Dot p={A} label="A" dy={14} />
        <Dot p={B} label="B" dx={(B[0] - O[0]) / 6} dy={(B[1] - O[1]) / 6} />
        <Dot p={C} label="C" color={GOLD} dx={(C[0] - O[0]) / 6} dy={(C[1] - O[1]) / 6} />
        <Label x={T[0] - 6} y={A[1] - 10} color={GREEN} size={11} anchor="end">接線</Label>
      </svg>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: GREEN }}>
          <span>接線と弦 AB の角</span>
          <strong>{nice(angleAt(A, T, B), 0)}°</strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>円周角 ∠ACB</span>
          <strong>{nice(angleAt(C, A, B), 0)}°</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{どちらも } \\dfrac{\\text{弧 AB の中心角}}{2} = \\dfrac{${nice(beta + 90, 0)}^\\circ}{2} = ${nice(tc, 1)}^\\circ`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="B の位置" value={beta} min={-60} max={240} onChange={setBeta} />
        <Slider label="C の位置" value={t} min={5} max={95} onChange={setT} color={GOLD} />
      </div>
      <p className="figure-note">C を弦 AB に近づけていくと、CA はやがて接線に重なる。だから「接線と弦の角」は、反対側の弧の上の円周角と等しい（接弦定理）。</p>
    </div>
  );
}

// ---------- 6. 方べきの定理 ----------

function lineCircle(p: P, ang: number, o: P, r: number): [number, number] | null {
  const d: P = [Math.cos(rad(ang)), -Math.sin(rad(ang))];
  const f = sub(p, o);
  const b = f[0] * d[0] + f[1] * d[1];
  const c = f[0] * f[0] + f[1] * f[1] - r * r;
  const disc = b * b - c;
  if (disc < 0) return null;
  const s = Math.sqrt(disc);
  return [-b - s, -b + s];
}

export function PowerPoint() {
  const [d, setD] = useState(150);
  const [a1, setA1] = useState(170);
  const [a2, setA2] = useState(195);
  const O: P = [130, 120];
  const R = 80;
  const Pp: P = [O[0] + d, O[1]];
  const inside = d < R;
  const lines = [a1, a2].map((ang) => {
    const ts = lineCircle(Pp, ang, O, R);
    if (!ts) return null;
    const dir: P = [Math.cos(rad(ang)), -Math.sin(rad(ang))];
    return { X: add(Pp, mul(dir, ts[0])), Y: add(Pp, mul(dir, ts[1])), prod: Math.abs(ts[0] * ts[1]) };
  });
  const tangent = !inside && d > R + 1;
  const T = tangent ? onCircle(O, R, deg(Math.acos(R / d))) : null;
  const power = Math.abs(d * d - R * R) / (U * U);
  const names = [
    ['A', 'B'],
    ['C', 'D'],
  ];
  return (
    <div className="figure">
      <svg viewBox="0 0 360 240" className="area-svg" style={{ maxWidth: 440 }}>
        <circle cx={O[0]} cy={O[1]} r={R} fill="rgba(0,187,249,0.08)" stroke={BLUE} strokeWidth={2} />
        {lines.map((l, i) =>
          l ? (
            <g key={i}>
              <Seg a={inside ? l.X : Pp} b={inside ? l.Y : dist(Pp, l.X) > dist(Pp, l.Y) ? l.X : l.Y} color={i ? PINK : GOLD} w={2} />
              <Dot p={l.X} label={names[i][0]} color={i ? PINK : GOLD} dx={-10} dy={i ? 12 : -12} />
              <Dot p={l.Y} label={names[i][1]} color={i ? PINK : GOLD} dx={-10} dy={i ? 12 : -12} />
            </g>
          ) : null,
        )}
        {T && <Seg a={Pp} b={T} color={GREEN} w={2} dash="5 3" />}
        {T && <Dot p={T} label="T" color={GREEN} />}
        <Dot p={O} color="var(--muted)" />
        <Dot p={Pp} label="P" dx={12} dy={-8} />
      </svg>
      <div className="trig-ratios" style={{ gridTemplateColumns: tangent ? '1fr 1fr 1fr' : '1fr 1fr' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ borderColor: i ? PINK : GOLD }}>
            <span>{i ? 'PC × PD' : 'PA × PB'}</span>
            <strong>{l ? nice(l.prod / (U * U), 2) : '交わらない'}</strong>
          </div>
        ))}
        {tangent && (
          <div style={{ borderColor: GREEN }}>
            <span>PT²</span>
            <strong>{nice(power, 2)}</strong>
          </div>
        )}
      </div>
      <div className="sliders">
        <Slider label="P と中心の距離" value={d} min={10} max={210} step={5} onChange={setD} />
        <Slider label="金色の線の向き" value={a1} min={100} max={260} onChange={setA1} color={GOLD} />
        <Slider label="ピンクの線の向き" value={a2} min={100} max={260} onChange={setA2} color={PINK} />
      </div>
      <p className="figure-note">点 P を通る直線を何本引いても、「P から円までの 2 つの長さの積」は同じ値。P が円の外なら、接線の長さの 2 乗 PT² とも等しい。P を円の中に入れても成り立つ。</p>
    </div>
  );
}

// ---------- 7. 2 つの円の位置関係 ----------

export function TwoCircles() {
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(2);
  const [d, setD] = useState(7);
  const S = 18;
  const c1: P = [95, 120];
  const c2: P = [95 + d * S, 120];
  const eps = 1e-9;
  let rel: string;
  let n: number;
  if (d > r1 + r2 + eps) [rel, n] = ['離れている', 4];
  else if (Math.abs(d - (r1 + r2)) < eps) [rel, n] = ['外接する（1 点で外からふれる）', 3];
  else if (d > Math.abs(r1 - r2) + eps) [rel, n] = ['2 点で交わる', 2];
  else if (Math.abs(d - Math.abs(r1 - r2)) < eps && d > eps) [rel, n] = ['内接する（1 点で内からふれる）', 1];
  else [rel, n] = ['一方が他方の内部にある', 0];
  return (
    <div className="figure">
      <svg viewBox="0 0 360 240" className="area-svg" style={{ maxWidth: 440 }}>
        <circle cx={c1[0]} cy={c1[1]} r={r1 * S} fill="rgba(0,187,249,0.12)" stroke={BLUE} strokeWidth={2.5} />
        <circle cx={c2[0]} cy={c2[1]} r={r2 * S} fill="rgba(241,91,181,0.12)" stroke={PINK} strokeWidth={2.5} />
        <Seg a={c1} b={c2} color={GOLD} w={2} dash="4 3" />
        <Dot p={c1} color={BLUE} />
        <Dot p={c2} color={PINK} />
        <Label x={(c1[0] + c2[0]) / 2} y={134} color={GOLD} size={11}>d = {d}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`r_1 + r_2 = ${r1 + r2},\\quad |r_1 - r_2| = ${Math.abs(r1 - r2)},\\quad d = ${d}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <strong>{rel}</strong>／共通接線は <strong style={{ color: GOLD }}>{n} 本</strong>
      </div>
      <div className="sliders">
        <Slider label="青い円の半径 r₁" value={r1} min={1} max={5} onChange={setR1} color={BLUE} />
        <Slider label="ピンクの円の半径 r₂" value={r2} min={1} max={5} onChange={setR2} color={PINK} />
        <Slider label="中心の距離 d" value={d} min={0} max={10} step={0.5} onChange={setD} color={GOLD} />
      </div>
      <p className="figure-note">2 つの円の関係は、中心の距離 d と「半径の和」「半径の差」をくらべるだけで決まる。近づくにつれて共通接線は 4 本 → 3 本 → 2 本 → 1 本 → 0 本とへっていく。</p>
    </div>
  );
}

// ---------- 8. 正多面体とオイラーの多面体定理 ----------

const PHI = (1 + Math.sqrt(5)) / 2;
type V3 = [number, number, number];
function signs(base: V3): V3[] {
  const out: V3[] = [];
  for (const sx of base[0] ? [1, -1] : [1])
    for (const sy of base[1] ? [1, -1] : [1]) for (const sz of base[2] ? [1, -1] : [1]) out.push([base[0] * sx, base[1] * sy, base[2] * sz]);
  return out;
}
const cyc = (v: V3): V3[] => [v, [v[2], v[0], v[1]], [v[1], v[2], v[0]]];

const SOLIDS: Record<string, { name: string; f: number; face: string; v: V3[] }> = {
  tetra: { name: '正四面体', f: 4, face: '正三角形', v: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] },
  cube: { name: '立方体（正六面体）', f: 6, face: '正方形', v: signs([1, 1, 1]) },
  octa: { name: '正八面体', f: 8, face: '正三角形', v: cyc([1, 0, 0]).flatMap(signs) },
  dodeca: { name: '正十二面体', f: 12, face: '正五角形', v: [...signs([1, 1, 1]), ...cyc([0, 1 / PHI, PHI]).flatMap(signs)] },
  icosa: { name: '正二十面体', f: 20, face: '正三角形', v: cyc([0, 1, PHI]).flatMap(signs) },
};

function edgesOf(v: V3[]): [number, number][] {
  const d = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  let m = Infinity;
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) m = Math.min(m, d(v[i], v[j]));
  const out: [number, number][] = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (d(v[i], v[j]) < m * 1.001) out.push([i, j]);
  return out;
}

export function Polyhedron() {
  const [k, setK] = useState('cube');
  const [rot, setRot] = useState(30);
  const s = SOLIDS[k];
  const edges = edgesOf(s.v);
  const r = Math.max(...s.v.map((p) => Math.hypot(...p)));
  const scale = 85 / r;
  const ty = rad(rot);
  const tx = rad(22);
  const proj = s.v.map(([x, y, z]) => {
    const x1 = x * Math.cos(ty) + z * Math.sin(ty);
    const z1 = -x * Math.sin(ty) + z * Math.cos(ty);
    const y1 = y * Math.cos(tx) - z1 * Math.sin(tx);
    const z2 = y * Math.sin(tx) + z1 * Math.cos(tx);
    return { p: [180 + x1 * scale, 110 - y1 * scale] as P, z: z2 };
  });
  const V = s.v.length;
  const E = edges.length;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 400 }}>
        {edges.map(([i, j], n) => {
          // 奥にある辺ほどうすく・細く（手前・奥の感じを出す）
          const depth = (proj[i].z + proj[j].z) / (2 * r);
          return <line key={n} x1={proj[i].p[0]} y1={proj[i].p[1]} x2={proj[j].p[0]} y2={proj[j].p[1]} stroke={BLUE} strokeWidth={1.2 + 1.6 * (depth + 1) / 2} opacity={0.3 + 0.7 * (depth + 1) / 2} />;
        })}
        {proj.map((q, i) => (
          <circle key={i} cx={q.p[0]} cy={q.p[1]} r={q.z < 0 ? 2 : 3.5} fill={GOLD} opacity={q.z < 0 ? 0.5 : 1} />
        ))}
      </svg>
      <div className="trig-ratios">
        <div style={{ borderColor: GOLD }}>
          <span>頂点 v</span>
          <strong>{V}</strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <span>辺 e</span>
          <strong>{E}</strong>
        </div>
        <div style={{ borderColor: PURPLE }}>
          <span>面 f（{s.face}）</span>
          <strong>{s.f}</strong>
        </div>
      </div>
      <div className="area-formula">
        <Tex>{`v - e + f = ${V} - ${E} + ${s.f} = ${V - E + s.f}`}</Tex>
      </div>
      <Toggle
        label="立体"
        value={k}
        onChange={setK}
        options={[
          { v: 'tetra', text: '4' },
          { v: 'cube', text: '6' },
          { v: 'octa', text: '8' },
          { v: 'dodeca', text: '12' },
          { v: 'icosa', text: '20' },
        ]}
      />
      <div className="sliders">
        <Slider label="回す" value={rot} min={0} max={360} onChange={setRot} color={GOLD} />
      </div>
      <p className="figure-note">{s.name}。へこみのない多面体なら、どんな形でも「頂点 − 辺 ＋ 面 ＝ 2」になる（オイラーの多面体定理）。正多面体は、この 5 種類しかない。</p>
    </div>
  );
}
