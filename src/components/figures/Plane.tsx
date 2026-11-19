import type { ReactNode } from 'react';

// 座標平面の共通部品。x, y の範囲を決めると、座標を画面の位置に変換して描ける。

export interface PlaneSpec {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  w?: number;
  h?: number;
}

export interface Plane extends Required<PlaneSpec> {
  X: (x: number) => number;
  Y: (y: number) => number;
}

const PAD = 22;

export function makePlane(spec: PlaneSpec): Plane {
  const w = spec.w ?? 340;
  const h = spec.h ?? 280;
  const X = (x: number) => PAD + ((x - spec.xmin) / (spec.xmax - spec.xmin)) * (w - 2 * PAD);
  const Y = (y: number) => h - PAD - ((y - spec.ymin) / (spec.ymax - spec.ymin)) * (h - 2 * PAD);
  return { ...spec, w, h, X, Y };
}

function niceStep(range: number): number {
  if (range <= 12) return 1;
  if (range <= 30) return 5;
  if (range <= 60) return 10;
  return 20;
}

let uid = 0;

/** 格子・軸・目もりつきの座標平面。中身は children で描く */
export function PlaneSvg({ p, children, xLabel = 'x', yLabel = 'y' }: { p: Plane; children?: ReactNode; xLabel?: string; yLabel?: string }) {
  const clipId = `plane-clip-${(uid = (uid + 1) % 100000)}`;
  const sx = niceStep(p.xmax - p.xmin);
  const sy = niceStep(p.ymax - p.ymin);
  const xs: number[] = [];
  for (let v = Math.ceil(p.xmin / sx) * sx; v <= p.xmax; v += sx) xs.push(v);
  const ys: number[] = [];
  for (let v = Math.ceil(p.ymin / sy) * sy; v <= p.ymax; v += sy) ys.push(v);
  const ox = p.X(Math.min(Math.max(0, p.xmin), p.xmax));
  const oy = p.Y(Math.min(Math.max(0, p.ymin), p.ymax));
  return (
    <svg viewBox={`0 0 ${p.w} ${p.h}`} className="plane-svg" role="img" aria-label="グラフ">
      <defs>
        <clipPath id={clipId}>
          <rect x={p.X(p.xmin)} y={p.Y(p.ymax)} width={p.X(p.xmax) - p.X(p.xmin)} height={p.Y(p.ymin) - p.Y(p.ymax)} />
        </clipPath>
        <marker id="ax-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
        </marker>
      </defs>
      {xs.map((v) => (
        <line key={`gx${v}`} x1={p.X(v)} y1={p.Y(p.ymin)} x2={p.X(v)} y2={p.Y(p.ymax)} stroke="var(--line)" strokeWidth={v === 0 ? 0 : 1} opacity={0.6} />
      ))}
      {ys.map((v) => (
        <line key={`gy${v}`} x1={p.X(p.xmin)} y1={p.Y(v)} x2={p.X(p.xmax)} y2={p.Y(v)} stroke="var(--line)" strokeWidth={v === 0 ? 0 : 1} opacity={0.6} />
      ))}
      <line x1={p.X(p.xmin)} y1={oy} x2={p.X(p.xmax) + 8} y2={oy} stroke="var(--muted)" strokeWidth={2} markerEnd="url(#ax-arrow)" />
      <line x1={ox} y1={p.Y(p.ymin)} x2={ox} y2={p.Y(p.ymax) - 8} stroke="var(--muted)" strokeWidth={2} markerEnd="url(#ax-arrow)" />
      {/* 軸の名前は、はみ出さないように内側に置く */}
      <text x={p.X(p.xmax) - 2} y={oy - 8} fill="var(--muted)" fontSize={12} fontStyle="italic" textAnchor="end" className="plane-label">{xLabel}</text>
      <text x={ox + 8} y={p.Y(p.ymax) + 10} fill="var(--muted)" fontSize={12} fontStyle="italic" className="plane-label">{yLabel}</text>
      {xs.filter((v) => v !== 0).map((v) => (
        <text key={`lx${v}`} x={p.X(v)} y={oy + 13} fill="var(--muted)" fontSize={9} textAnchor="middle">{v}</text>
      ))}
      {ys.filter((v) => v !== 0).map((v) => (
        <text key={`ly${v}`} x={ox - 4} y={p.Y(v) + 3} fill="var(--muted)" fontSize={9} textAnchor="end">{v}</text>
      ))}
      <text x={ox - 4} y={oy + 13} fill="var(--muted)" fontSize={9} textAnchor="end">O</text>
      <g clipPath={`url(#${clipId})`}>{children}</g>
    </svg>
  );
}

/** 関数 f のグラフ（from〜to の範囲だけ描くこともできる） */
export function Curve({ p, f, color = 'var(--accent)', width = 3, dash, from, to, opacity = 1 }: { p: Plane; f: (x: number) => number; color?: string; width?: number; dash?: string; from?: number; to?: number; opacity?: number }) {
  const a = from ?? p.xmin;
  const b = to ?? p.xmax;
  const n = 160;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const y = f(x);
    const yy = Math.max(Math.min(p.Y(y), p.h + 400), -400); // はみ出しすぎを防ぐ
    d += `${i === 0 ? 'M' : 'L'}${p.X(x).toFixed(1)} ${yy.toFixed(1)}`;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity} />;
}

export function Pt({ p, x, y, color = 'var(--accent)', label, r = 5, dy = -10, anchor = 'middle' }: { p: Plane; x: number; y: number; color?: string; label?: string; r?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <g>
      <circle cx={p.X(x)} cy={p.Y(y)} r={r} fill={color} stroke="#1b1640" strokeWidth={1.5} />
      {label && (
        <text x={p.X(x)} y={p.Y(y) + dy} fill={color} fontSize={12} fontWeight={800} textAnchor={anchor} className="plane-label">
          {label}
        </text>
      )}
    </g>
  );
}

export function VLine({ p, x, color = 'var(--muted)', dash = '5 4', width = 1.5 }: { p: Plane; x: number; color?: string; dash?: string; width?: number }) {
  return <line x1={p.X(x)} y1={p.Y(p.ymin)} x2={p.X(x)} y2={p.Y(p.ymax)} stroke={color} strokeDasharray={dash} strokeWidth={width} />;
}

export function HLine({ p, y, color = 'var(--muted)', dash = '5 4', width = 1.5 }: { p: Plane; y: number; color?: string; dash?: string; width?: number }) {
  return <line x1={p.X(p.xmin)} y1={p.Y(y)} x2={p.X(p.xmax)} y2={p.Y(y)} stroke={color} strokeDasharray={dash} strokeWidth={width} />;
}

/** x 軸上の区間を太く塗る（不等式の解・定義域など） */
export function XRange({ p, from, to, color = 'var(--good)', y = 0 }: { p: Plane; from: number; to: number; color?: string; y?: number }) {
  return <line x1={p.X(from)} y1={p.Y(y)} x2={p.X(to)} y2={p.Y(y)} stroke={color} strokeWidth={7} strokeLinecap="round" opacity={0.85} />;
}

/** 小数を見やすく（整数なら整数で） */
export function nice(v: number, digits = 2): string {
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return v.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
}
