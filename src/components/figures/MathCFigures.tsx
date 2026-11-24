import { useState } from 'react';
import { Tex } from '../RichText';
import { Curve, makePlane, nice, PlaneSvg, Pt, type Plane } from './Plane';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 数学C「ベクトル」「平面上の曲線と複素数平面」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#c77dff';

/** 平面上の矢印（座標で指定） */
function Arrow({ p, x1 = 0, y1 = 0, x2, y2, color, label, dash, width = 3 }: { p: Plane; x1?: number; y1?: number; x2: number; y2: number; color: string; label?: string; dash?: string; width?: number }) {
  const X1 = p.X(x1), Y1 = p.Y(y1), X2 = p.X(x2), Y2 = p.Y(y2);
  const len = Math.hypot(X2 - X1, Y2 - Y1);
  if (len < 1) return null;
  const ux = (X2 - X1) / len, uy = (Y2 - Y1) / len;
  const h = Math.min(11, len * 0.5);
  const bx = X2 - ux * h, by = Y2 - uy * h;
  return (
    <g>
      <line x1={X1} y1={Y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />
      <polygon points={`${X2},${Y2} ${bx - uy * h * 0.5},${by + ux * h * 0.5} ${bx + uy * h * 0.5},${by - ux * h * 0.5}`} fill={color} />
      {label && (
        <text x={(X1 + X2) / 2 - uy * 14} y={(Y1 + Y2) / 2 + ux * 14 + 4} fill={color} fontSize={13} fontWeight={800} textAnchor="middle" className="plane-label">
          {label}
        </text>
      )}
    </g>
  );
}
/** 数を右上の小さい数字に（12 → ¹²） */
const sup = (n: number) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');
/** 係数 1 は書かない */
const c1 = (k: number) => (k === 1 ? '' : String(k));
const vt = (v: number[]) => `(${v.map((x) => nice(x, 2)).join(',\\ ')})`;

// ---------- 1. ベクトルの和・差・実数倍 ----------

export function VecAdd() {
  const [mode, setMode] = useState<'sum' | 'diff' | 'k'>('sum');
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(2);
  const [k, setK] = useState(2);
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -5, ymax: 6, h: 260 });
  const r = mode === 'sum' ? [ax + bx, ay + by] : mode === 'diff' ? [ax - bx, ay - by] : [k * ax, k * ay];
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {mode === 'sum' && (
          <>
            <Arrow p={p} x1={ax} y1={ay} x2={ax + bx} y2={ay + by} color={BLUE} dash="5 4" width={2} />
            <Arrow p={p} x2={bx} y2={by} color={BLUE} label="b" />
          </>
        )}
        {mode === 'diff' && (
          <>
            <Arrow p={p} x1={bx} y1={by} x2={ax} y2={ay} color={GREEN} dash="5 4" width={2} />
            <Arrow p={p} x2={bx} y2={by} color={BLUE} label="b" />
          </>
        )}
        <Arrow p={p} x2={ax} y2={ay} color={GOLD} label="a" />
        <Arrow p={p} x2={r[0]} y2={r[1]} color={mode === 'diff' ? GREEN : PINK} width={3.5} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>
          {mode === 'sum'
            ? `\\vec{a} + \\vec{b} = ${vt([ax, ay])} + ${vt([bx, by])} = ${vt(r)}`
            : mode === 'diff'
              ? `\\vec{a} - \\vec{b} = ${vt([ax, ay])} - ${vt([bx, by])} = ${vt(r)}`
              : `${k}\\vec{a} = ${k}${vt([ax, ay])} = ${vt(r)}`}
        </Tex>
      </div>
      <Toggle label="計算" options={[{ v: 'sum', text: '和 a + b' }, { v: 'diff', text: '差 a − b' }, { v: 'k', text: '実数倍' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="a の x 成分" value={ax} min={-4} max={4} onChange={setAx} color={GOLD} />
        <Slider label="a の y 成分" value={ay} min={-4} max={4} onChange={setAy} color={GOLD} />
        {mode === 'k' ? (
          <Slider label="k" value={k} min={-2} max={2} step={0.5} onChange={setK} color={PINK} />
        ) : (
          <>
            <Slider label="b の x 成分" value={bx} min={-4} max={4} onChange={setBx} color={BLUE} />
            <Slider label="b の y 成分" value={by} min={-4} max={4} onChange={setBy} color={BLUE} />
          </>
        )}
      </div>
      <p className="figure-note">
        {mode === 'sum'
          ? 'a の矢印の先に b の矢印をつなぐと、原点からその先までの矢印（桃色）が a + b。成分どうしを足せばよい。'
          : mode === 'diff'
            ? 'a − b は「b の先から a の先へ向かう矢印」（緑の点線）と同じ。原点から引きなおしたものが緑の矢印。'
            : 'k 倍すると、向きはそのまま（k が負なら逆向き）で、長さが |k| 倍になる。'}
      </p>
    </div>
  );
}

// ---------- 2. 内積（かげの長さ） ----------

export function DotProduct() {
  const [deg, setDeg] = useState(60);
  const [A, setA] = useState(4);
  const [B, setB] = useState(3);
  const th = (deg * Math.PI) / 180;
  const p = makePlane({ xmin: -4.5, xmax: 5.5, ymin: -1.5, ymax: 4.5, h: 220 });
  const bx = B * Math.cos(th), by = B * Math.sin(th);
  const dot = A * B * Math.cos(th);
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <line x1={p.X(bx)} y1={p.Y(by)} x2={p.X(bx)} y2={p.Y(0)} stroke="var(--muted)" strokeDasharray="4 3" strokeWidth={1.5} />
        <line x1={p.X(0)} y1={p.Y(0)} x2={p.X(bx)} y2={p.Y(0)} stroke={dot >= 0 ? GREEN : PINK} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
        <Arrow p={p} x2={A} y2={0} color={GOLD} label="a" />
        <Arrow p={p} x2={bx} y2={by} color={BLUE} label="b" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = ${A} \\times ${B} \\times \\cos ${deg}^\\circ ${Math.abs(dot - Math.round(dot)) < 1e-9 ? '=' : '\\approx'} ${nice(dot, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`= |\\vec{a}| \\times (\\text{b のかげ}) = ${A} \\times ${nice(B * Math.cos(th), 2)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="なす角 θ" value={deg} min={0} max={180} step={15} onChange={setDeg} color={PINK} />
        <Slider label="|a|" value={A} min={1} max={5} onChange={setA} color={GOLD} />
        <Slider label="|b|" value={B} min={1} max={4} onChange={setB} color={BLUE} />
      </div>
      <p className="figure-note">真上から光を当てたときの b のかげ（緑）の長さと、a の長さをかけたものが内積。90° ではかげが 0 なので内積は 0、90° をこえるとかげが逆向き（桃色）になって内積はマイナス。</p>
    </div>
  );
}

// ---------- 3. 内積の応用（いちばん短くなるとき） ----------

export function VecMin() {
  const [t, setT] = useState(0);
  const a = [1, 3];
  const b = [2, -1];
  const p = makePlane({ xmin: -3, xmax: 7, ymin: -3, ymax: 5, h: 240 });
  const c = [a[0] + t * b[0], a[1] + t * b[1]];
  const len2 = c[0] ** 2 + c[1] ** 2;
  const d = c[0] * b[0] + c[1] * b[1];
  const tBest = -(a[0] * b[0] + a[1] * b[1]) / (b[0] ** 2 + b[1] ** 2);
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => a[1] + ((x - a[0]) * b[1]) / b[0]} color="var(--muted)" width={1.5} dash="5 4" />
        <Arrow p={p} x1={a[0]} y1={a[1]} x2={a[0] + b[0]} y2={a[1] + b[1]} color={BLUE} label="b" width={2.5} />
        <Arrow p={p} x2={a[0]} y2={a[1]} color={GOLD} label="a" />
        <Arrow p={p} x2={c[0]} y2={c[1]} color={Math.abs(d) < 1e-9 ? GREEN : PINK} width={3.5} />
        <Pt p={p} x={c[0]} y={c[1]} color={Math.abs(d) < 1e-9 ? GREEN : PINK} r={4} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\vec{a} + t\\vec{b} = ${vt(c)},\\quad |\\vec{a} + t\\vec{b}|^2 = ${nice(len2, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`(\\vec{a} + t\\vec{b}) \\cdot \\vec{b} = ${nice(d, 2)}\\ ${Math.abs(d) < 1e-9 ? '\\Rightarrow\\ \\text{垂直！ いちばん短い}' : ''}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="t" value={t} min={-1} max={2.5} step={0.2} onChange={(v) => setT(Math.round(v * 10) / 10)} color={PINK} />
      </div>
      <p className="figure-note">a = (1, 3)、b = (2, −1)。t を動かすと、a + t b の先は点線（b の向きの直線）の上を動く。原点からの長さがいちばん短くなるのは、a + t b が b と垂直（内積 0）になるとき。ここでは t = {nice(tBest, 2)}。</p>
    </div>
  );
}

// ---------- 4. 位置ベクトルと分点 ----------

export function VecDiv() {
  const [mode, setMode] = useState<'in' | 'out'>('in');
  const [m, setM] = useState(2);
  const [n, setN] = useState(1);
  const A = [-3, -1];
  const B = [3, 2];
  const nn = mode === 'out' && m === n ? n + 1 : n;
  const s = mode === 'in' ? m / (m + nn) : m / (m - nn);
  const P = [A[0] + s * (B[0] - A[0]), A[1] + s * (B[1] - A[1])];
  const p = makePlane({ xmin: -8, xmax: 9, ymin: -5, ymax: 7, h: 250 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => A[1] + ((x - A[0]) * (B[1] - A[1])) / (B[0] - A[0])} color="var(--muted)" width={1.2} dash="4 4" />
        <Arrow p={p} x2={A[0]} y2={A[1]} color={GOLD} width={2} />
        <Arrow p={p} x2={B[0]} y2={B[1]} color={BLUE} width={2} />
        <Arrow p={p} x2={P[0]} y2={P[1]} color={PINK} width={3} />
        <Pt p={p} x={A[0]} y={A[1]} color={GOLD} label="A" dy={18} />
        <Pt p={p} x={B[0]} y={B[1]} color={BLUE} label="B" />
        <Pt p={p} x={P[0]} y={P[1]} color={PINK} label="P" anchor="start" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{mode === 'in' ? `\\vec{p} = \\dfrac{${c1(nn)}\\vec{a} + ${c1(m)}\\vec{b}}{${m} + ${nn}} = ${vt(P)}` : `\\vec{p} = \\dfrac{-${c1(nn)}\\vec{a} + ${c1(m)}\\vec{b}}{${m} - ${nn}} = ${vt(P)}`}</Tex>
      </div>
      <Toggle label="分け方" options={[{ v: 'in', text: '内分' }, { v: 'out', text: '外分' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="m" value={m} min={1} max={4} onChange={setM} color={PINK} />
        <Slider label="n" value={n} min={1} max={4} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">A(−3, −1)、B(3, 2)。内分点 P は A と B のあいだを m : n に分ける点で、近いほうの点の重みが大きくなる（m は B にかける）。外分点は線分の外側にあり、m と n が同じだと作れない。</p>
    </div>
  );
}

// ---------- 5. 空間ベクトル ----------

export function Space3D() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(2);
  const [rot, setRot] = useState(30);
  const r = (rot * Math.PI) / 180;
  const S = 26;
  const O = [150, 170];
  // 斜めから見た投影
  const proj = (px: number, py: number, pz: number) => [O[0] + S * (px * Math.cos(r) - py * Math.sin(r)), O[1] - S * (pz * 0.95 - (px * Math.sin(r) + py * Math.cos(r)) * 0.35)];
  const pt = (a: number[]) => proj(a[0], a[1], a[2]).join(',');
  const corners = [[0, 0, 0], [x, 0, 0], [x, y, 0], [0, y, 0], [0, 0, z], [x, 0, z], [x, y, z], [0, y, z]];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const P = proj(x, y, z);
  const axes: [number[], string][] = [[[5, 0, 0], 'x'], [[0, 5, 0], 'y'], [[0, 0, 5], 'z']];
  return (
    <div className="figure">
      <svg viewBox="0 0 300 220" className="area-svg" style={{ maxWidth: 400 }}>
        {axes.map(([e, n]) => {
          const [ex, ey] = proj(e[0], e[1], e[2]);
          return (
            <g key={n}>
              <line x1={O[0]} y1={O[1]} x2={ex} y2={ey} stroke="var(--muted)" strokeWidth={1.5} />
              <Label x={ex} y={ey - 4} color="var(--muted)" size={12}>{n}</Label>
            </g>
          );
        })}
        {edges.map(([i, j]) => (
          <line key={`${i}-${j}`} x1={proj(corners[i][0], corners[i][1], corners[i][2])[0]} y1={proj(corners[i][0], corners[i][1], corners[i][2])[1]} x2={proj(corners[j][0], corners[j][1], corners[j][2])[0]} y2={proj(corners[j][0], corners[j][1], corners[j][2])[1]} stroke={BLUE} strokeWidth={1.2} opacity={0.6} />
        ))}
        <polyline points={`${pt([0, 0, 0])} ${pt([x, y, 0])}`} fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" />
        <polyline points={`${pt([x, y, 0])} ${pt([x, y, z])}`} fill="none" stroke={GREEN} strokeWidth={2} strokeDasharray="5 4" />
        <line x1={O[0]} y1={O[1]} x2={P[0]} y2={P[1]} stroke={PINK} strokeWidth={3.5} />
        <circle cx={P[0]} cy={P[1]} r={5} fill={PINK} />
        <Label x={P[0] + 10} y={P[1] - 6} color={PINK} size={12} anchor="start">P</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\overrightarrow{\\mathrm{OP}} = (${x},\\ ${y},\\ ${z}),\\quad |\\overrightarrow{\\mathrm{OP}}| = \\sqrt{${x}^2 + ${y}^2 + ${z}^2} = \\sqrt{${x * x + y * y + z * z}}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="x" value={x} min={1} max={4} onChange={setX} color={BLUE} />
        <Slider label="y" value={y} min={1} max={4} onChange={setY} color={BLUE} />
        <Slider label="z" value={z} min={1} max={4} onChange={setZ} color={BLUE} />
        <Slider label="見る向き" value={rot} min={0} max={80} step={5} onChange={setRot} color="var(--muted)" />
      </div>
      <p className="figure-note">空間のベクトルは成分が 3 つになるだけで、計算のしかたは平面と同じ。長さは、床の上の対角線（金）と高さ（緑）で三平方の定理を 2 回使って求められる。</p>
    </div>
  );
}

// ---------- 6. 2 次曲線 ----------

export function Conics() {
  const [k, setK] = useState<'para' | 'ell' | 'hyp'>('ell');
  const [t, setT] = useState(1);
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, h: 260 });
  let P: number[], F1: number[], F2: number[] | null, eq: string, info: string, curve: [(s: number) => number[], number, number][];
  if (k === 'para') {
    // y² = 4x（焦点 (1, 0)、準線 x = −1）
    const y = t * 1.5;
    P = [(y * y) / 4, y];
    F1 = [1, 0];
    F2 = null;
    eq = 'y^2 = 4x';
    info = `\\text{PF} = ${nice(Math.hypot(P[0] - 1, P[1]), 2)},\\quad \\text{準線までの距離} = ${nice(P[0] + 1, 2)}`;
    curve = [[(s) => [(s * s) / 4, s], -5, 5]];
  } else if (k === 'ell') {
    P = [5 * Math.cos(t), 3 * Math.sin(t)];
    F1 = [4, 0];
    F2 = [-4, 0];
    eq = '\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1';
    const d1 = Math.hypot(P[0] - 4, P[1]), d2 = Math.hypot(P[0] + 4, P[1]);
    info = `\\text{PF} + \\text{PF}' = ${nice(d1, 2)} + ${nice(d2, 2)} = ${nice(d1 + d2, 2)}`;
    curve = [[(s) => [5 * Math.cos(s), 3 * Math.sin(s)], 0, 2 * Math.PI]];
  } else {
    P = [3 * Math.cosh(t * 0.8), 4 * Math.sinh(t * 0.8)];
    F1 = [5, 0];
    F2 = [-5, 0];
    eq = '\\dfrac{x^2}{9} - \\dfrac{y^2}{16} = 1';
    const d1 = Math.hypot(P[0] - 5, P[1]), d2 = Math.hypot(P[0] + 5, P[1]);
    info = `|\\text{PF}' - \\text{PF}| = |${nice(d2, 2)} - ${nice(d1, 2)}| = ${nice(Math.abs(d2 - d1), 2)}`;
    curve = [
      [(s) => [3 * Math.cosh(s), 4 * Math.sinh(s)], -1.6, 1.6],
      [(s) => [-3 * Math.cosh(s), 4 * Math.sinh(s)], -1.6, 1.6],
    ];
  }
  const path = ([f, a, b]: [(s: number) => number[], number, number]) => {
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const [x, y] = f(a + ((b - a) * i) / 120);
      d += `${i === 0 ? 'M' : 'L'}${p.X(x).toFixed(1)} ${p.Y(y).toFixed(1)}`;
    }
    return d;
  };
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {k === 'hyp' && (
          <>
            <Curve p={p} f={(x) => (4 / 3) * x} color="var(--muted)" width={1} dash="4 4" />
            <Curve p={p} f={(x) => (-4 / 3) * x} color="var(--muted)" width={1} dash="4 4" />
          </>
        )}
        {k === 'para' && <line x1={p.X(-1)} y1={p.Y(p.ymin)} x2={p.X(-1)} y2={p.Y(p.ymax)} stroke={GREEN} strokeWidth={2} strokeDasharray="6 4" />}
        {curve.map((c, i) => (
          <path key={i} d={path(c)} fill="none" stroke={BLUE} strokeWidth={3} />
        ))}
        <line x1={p.X(P[0])} y1={p.Y(P[1])} x2={p.X(F1[0])} y2={p.Y(F1[1])} stroke={PINK} strokeWidth={2} />
        {F2 && <line x1={p.X(P[0])} y1={p.Y(P[1])} x2={p.X(F2[0])} y2={p.Y(F2[1])} stroke={GOLD} strokeWidth={2} />}
        {k === 'para' && <line x1={p.X(P[0])} y1={p.Y(P[1])} x2={p.X(-1)} y2={p.Y(P[1])} stroke={GREEN} strokeWidth={2} />}
        <Pt p={p} x={F1[0]} y={F1[1]} color={PINK} label="F" dy={18} />
        {F2 && <Pt p={p} x={F2[0]} y={F2[1]} color={GOLD} label="F'" dy={18} />}
        <Pt p={p} x={P[0]} y={P[1]} color="#fff" label="P" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{eq}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{info}</Tex>
      </div>
      <Toggle label="曲線" options={[{ v: 'para', text: '放物線' }, { v: 'ell', text: '楕円' }, { v: 'hyp', text: '双曲線' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="点 P" value={t} min={-2} max={2} step={0.1} onChange={(v) => setT(Math.round(v * 10) / 10)} color="#fff" />
      </div>
      <p className="figure-note">
        {k === 'para'
          ? '放物線は、焦点 F までの距離と、準線（緑の点線）までの距離が等しい点の集まり。'
          : k === 'ell'
            ? '楕円は、2 つの焦点 F、F′ までの距離の和が一定（ここでは 10）の点の集まり。ひもとピン 2 本でかける。'
            : '双曲線は、2 つの焦点までの距離の差が一定（ここでは 6）の点の集まり。点線は漸近線で、曲線が近づいていく直線。'}
      </p>
    </div>
  );
}

// ---------- 7. 媒介変数表示と極座標 ----------

const CURVES: Record<'circle' | 'cyc' | 'card' | 'rose', { f: (t: number) => number[]; max: number; tex: string; note: string; box: number[] }> = {
  circle: { f: (t) => [3 * Math.cos(t), 2 * Math.sin(t)], max: 2 * Math.PI, tex: 'x = 3\\cos t,\\ y = 2\\sin t', note: '時刻 t ごとの位置 (x, y) を t の式で表すのが媒介変数表示。これは楕円 x²/9 + y²/4 = 1 になる。', box: [-4, 4, -3, 3] },
  cyc: { f: (t) => [t - Math.sin(t), 1 - Math.cos(t)], max: 4 * Math.PI, tex: 'x = t - \\sin t,\\ y = 1 - \\cos t', note: '転がる車輪のふちの 1 点がえがく曲線（サイクロイド）。この形のすべり台は、いちばん速くすべり降りられることで知られている。', box: [-1, 13, -2, 4] },
  card: { f: (t) => [(1 + Math.cos(t)) * Math.cos(t) * 2, (1 + Math.cos(t)) * Math.sin(t) * 2], max: 2 * Math.PI, tex: 'r = 2(1 + \\cos\\theta)', note: '極座標では、点を「原点からの距離 r」と「角 θ」で表す。r が θ の式で決まる曲線（極方程式）。これはハートの形（カージオイド）。', box: [-2, 5, -3.5, 3.5] },
  rose: { f: (t) => [3 * Math.cos(3 * t) * Math.cos(t), 3 * Math.cos(3 * t) * Math.sin(t)], max: Math.PI, tex: 'r = 3\\cos 3\\theta', note: '角 θ に合わせて距離 r が増えたり減ったりすると、花びらの形（正葉曲線）ができる。', box: [-3.5, 3.5, -3.5, 3.5] },
};

export function ParamCurve() {
  const [k, setK] = useState<'circle' | 'cyc' | 'card' | 'rose'>('circle');
  const [s, setS] = useState(0.6);
  const c = CURVES[k];
  const t = s * c.max;
  const p = makePlane({ xmin: c.box[0], xmax: c.box[1], ymin: c.box[2], ymax: c.box[3], h: 240 });
  let full = '', done = '';
  for (let i = 0; i <= 200; i++) {
    const tt = (c.max * i) / 200;
    const [x, y] = c.f(tt);
    const seg = `${i === 0 ? 'M' : 'L'}${p.X(x).toFixed(1)} ${p.Y(y).toFixed(1)}`;
    full += seg;
    if (tt <= t) done += seg;
  }
  const [x, y] = c.f(t);
  const polar = k === 'card' || k === 'rose';
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <path d={full} fill="none" stroke={BLUE} strokeWidth={1.5} opacity={0.25} />
        <path d={done} fill="none" stroke={BLUE} strokeWidth={3} />
        {polar && <line x1={p.X(0)} y1={p.Y(0)} x2={p.X(x)} y2={p.Y(y)} stroke={GOLD} strokeWidth={2} />}
        {k === 'cyc' && <circle cx={p.X(t)} cy={p.Y(1)} r={p.X(1) - p.X(0)} fill="none" stroke={GOLD} strokeWidth={1.5} />}
        <Pt p={p} x={x} y={y} color={PINK} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{c.tex}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`${polar ? '\\theta' : 't'} \\approx ${nice(t, 2)},\\quad (x,\\ y) \\approx (${nice(x, 2)},\\ ${nice(y, 2)})${polar ? `,\\quad r \\approx ${nice(k === 'card' ? 2 * (1 + Math.cos(t)) : 3 * Math.cos(3 * t), 2)}` : ''}`}</Tex>
      </div>
      <Toggle label="曲線" options={[{ v: 'circle', text: '楕円' }, { v: 'cyc', text: 'サイクロイド' }, { v: 'card', text: 'ハート' }, { v: 'rose', text: '花びら' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label={polar ? 'θ を進める' : 't を進める'} value={s} min={0} max={1} step={0.02} onChange={setS} color={PINK} />
      </div>
      <p className="figure-note">{c.note}</p>
    </div>
  );
}

// ---------- 8. 複素数平面（和と積） ----------

export function ComplexPlane() {
  const [mode, setMode] = useState<'sum' | 'mul'>('mul');
  const [r1, setR1] = useState(2);
  const [a1, setA1] = useState(30);
  const [r2, setR2] = useState(1.5);
  const [a2, setA2] = useState(60);
  const z = [r1 * Math.cos((a1 * Math.PI) / 180), r1 * Math.sin((a1 * Math.PI) / 180)];
  const w = [r2 * Math.cos((a2 * Math.PI) / 180), r2 * Math.sin((a2 * Math.PI) / 180)];
  const res = mode === 'sum' ? [z[0] + w[0], z[1] + w[1]] : [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
  const p = makePlane({ xmin: -5, xmax: 5, ymin: -4, ymax: 5, h: 260 });
  return (
    <div className="figure">
      <PlaneSvg p={p} xLabel="実軸" yLabel="虚軸">
        {mode === 'sum' && <Arrow p={p} x1={z[0]} y1={z[1]} x2={res[0]} y2={res[1]} color={BLUE} dash="5 4" width={2} />}
        <Arrow p={p} x2={z[0]} y2={z[1]} color={GOLD} label="z" />
        <Arrow p={p} x2={w[0]} y2={w[1]} color={BLUE} label="w" />
        <Arrow p={p} x2={res[0]} y2={res[1]} color={PINK} width={3.5} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`z = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`w = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{mode === 'sum' ? `z + w \\approx ${nice(res[0], 2)} ${res[1] < 0 ? '-' : '+'} ${nice(Math.abs(res[1]), 2)}i\\quad(\\text{ベクトルの和と同じ})` : `zw = ${nice(r1 * r2, 2)}(\\cos ${a1 + a2}^\\circ + i\\sin ${a1 + a2}^\\circ)`}</Tex>
      </div>
      <Toggle label="計算" options={[{ v: 'mul', text: '積 zw' }, { v: 'sum', text: '和 z + w' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="|z|" value={r1} min={0.5} max={3} step={0.5} onChange={setR1} color={GOLD} />
        <Slider label="z の偏角" value={a1} min={0} max={180} step={15} onChange={setA1} color={GOLD} />
        <Slider label="|w|" value={r2} min={0.5} max={2} step={0.5} onChange={setR2} color={BLUE} />
        <Slider label="w の偏角" value={a2} min={0} max={180} step={15} onChange={setA2} color={BLUE} />
      </div>
      <p className="figure-note">
        {mode === 'mul'
          ? '複素数 a + bi を点 (a, b) として表した平面が複素数平面。かけ算すると、絶対値（長さ）はかけ算、偏角（角）は足し算になる。つまり w をかけることは「|w| 倍して、w の偏角だけ回す」こと。'
          : '足し算は、ベクトルの和と同じように矢印をつなげばよい。'}
      </p>
    </div>
  );
}

// ---------- 9. ド・モアブルの定理 ----------

export function DeMoivre() {
  const [arg, setArg] = useState(45);
  const [r, setR] = useState<'1' | 'g'>('g');
  const [n, setN] = useState(5);
  const rv = r === '1' ? 1 : 1.15;
  const pts = Array.from({ length: n + 1 }, (_, k) => [rv ** k * Math.cos((k * arg * Math.PI) / 180), rv ** k * Math.sin((k * arg * Math.PI) / 180)]);
  const lim = Math.max(2.2, rv ** n * 1.1);
  const p = makePlane({ xmin: -lim, xmax: lim, ymin: -lim, ymax: lim, w: 300, h: 300 });
  return (
    <div className="figure">
      <PlaneSvg p={p} xLabel="実軸" yLabel="虚軸">
        <circle cx={p.X(0)} cy={p.Y(0)} r={p.X(1) - p.X(0)} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        <polyline points={pts.map(([x, y]) => `${p.X(x)},${p.Y(y)}`).join(' ')} fill="none" stroke={PURPLE} strokeWidth={1.5} strokeDasharray="4 3" />
        {pts.map(([x, y], k) => (
          <g key={k}>
            <line x1={p.X(0)} y1={p.Y(0)} x2={p.X(x)} y2={p.Y(y)} stroke={k === n ? PINK : 'var(--line)'} strokeWidth={k === n ? 2.5 : 1} />
            <Pt p={p} x={x} y={y} color={k === n ? PINK : k === 1 ? GOLD : BLUE} r={k === n ? 5 : 3.5} label={k === 0 ? '1' : k === 1 ? 'z' : k === n ? `z${sup(n)}` : undefined} />
          </g>
        ))}
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`z = ${r === '1' ? '' : 'r'}(\\cos ${arg}^\\circ + i\\sin ${arg}^\\circ)`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`z^{${n}} = ${r === '1' ? '' : `r^{${n}}`}(\\cos ${n * arg}^\\circ + i\\sin ${n * arg}^\\circ)`}</Tex>
      </div>
      <Toggle label="絶対値" options={[{ v: '1', text: '|z| = 1' }, { v: 'g', text: '|z| が 1 より大' }]} value={r} onChange={setR} />
      <div className="sliders">
        <Slider label="z の偏角" value={arg} min={15} max={120} step={15} onChange={setArg} color={GOLD} />
        <Slider label="n 乗" value={n} min={1} max={12} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">z をかけるたびに、同じ角だけ回る。だから n 乗すると偏角は n 倍、絶対値は n 乗になる（ド・モアブルの定理）。|z| = 1 なら点は円の上を回り、1 より大きいとうずまきのように外へ広がる。</p>
    </div>
  );
}
