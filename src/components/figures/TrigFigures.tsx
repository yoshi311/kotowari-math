import { useState } from 'react';
import { Tex } from '../RichText';
import { nice } from './Plane';
import { Slider } from './Slider';

// 図形と計量（三角比）の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const rad = (d: number) => (d * Math.PI) / 180;
const f3 = (v: number) => (Math.abs(v) < 5e-4 ? '0' : v.toFixed(3));

/** 角の印（円弧） */
function Arc({ cx, cy, r, from, to, color = GOLD }: { cx: number; cy: number; r: number; from: number; to: number; color?: string }) {
  // SVG は y が下向きなので、数学の角度（反時計回り）は -sin で描く
  const x1 = cx + r * Math.cos(rad(from));
  const y1 = cy - r * Math.sin(rad(from));
  const x2 = cx + r * Math.cos(rad(to));
  const y2 = cy - r * Math.sin(rad(to));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 0 : 1;
  return <path d={`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={2.5} />;
}

function Label({ x, y, children, color = '#fff', size = 13 }: { x: number; y: number; children: React.ReactNode; color?: string; size?: number }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={800} textAnchor="middle" dominantBaseline="central" className="plane-label">
      {children}
    </text>
  );
}

// ---------- 1. 直角三角形と三角比 ----------

export function RightTriangle() {
  const [th, setTh] = useState(35);
  const [size, setSize] = useState(200);
  const ax = 40;
  const ay = 210;
  const L = size;
  const cx = ax + L * Math.cos(rad(th));
  const by = ay - L * Math.sin(rad(th));
  const s = Math.sin(rad(th));
  const c = Math.cos(rad(th));
  const unit = 20; // 1 目もり
  return (
    <div className="figure">
      <svg viewBox="0 0 360 240" className="area-svg" style={{ maxWidth: 420 }}>
        <polygon points={`${ax},${ay} ${cx},${ay} ${cx},${by}`} fill="rgba(155,93,229,0.18)" />
        <line x1={ax} y1={ay} x2={cx} y2={ay} stroke={BLUE} strokeWidth={4} />
        <line x1={cx} y1={ay} x2={cx} y2={by} stroke={PINK} strokeWidth={4} />
        <line x1={ax} y1={ay} x2={cx} y2={by} stroke={GOLD} strokeWidth={4} />
        <rect x={cx - 12} y={ay - 12} width={12} height={12} fill="none" stroke="var(--muted)" strokeWidth={1.5} />
        <Arc cx={ax} cy={ay} r={30} from={0} to={th} />
        <Label x={ax + 46} y={ay - 12} color={GOLD} size={12}>θ</Label>
        <Label x={(ax + cx) / 2} y={ay + 14} color={BLUE}>底辺 {nice(L * c / unit, 1)}</Label>
        <Label x={cx + 34} y={(ay + by) / 2} color={PINK}>高さ {nice(L * s / unit, 1)}</Label>
        <Label x={(ax + cx) / 2 - 16} y={(ay + by) / 2 - 12} color={GOLD}>斜辺 {nice(L / unit, 1)}</Label>
      </svg>
      <div className="trig-ratios">
        <div style={{ borderColor: PINK }}>
          <Tex>{'\\sin\\theta = \\dfrac{\\text{高さ}}{\\text{斜辺}}'}</Tex>
          <strong>{f3(s)}</strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <Tex>{'\\cos\\theta = \\dfrac{\\text{底辺}}{\\text{斜辺}}'}</Tex>
          <strong>{f3(c)}</strong>
        </div>
        <div style={{ borderColor: GREEN }}>
          <Tex>{'\\tan\\theta = \\dfrac{\\text{高さ}}{\\text{底辺}}'}</Tex>
          <strong>{f3(s / c)}</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\sin^2\\theta + \\cos^2\\theta = ${f3(s * s)} + ${f3(c * c)} = ${f3(s * s + c * c)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="角 θ（°）" value={th} min={10} max={80} onChange={setTh} color={GOLD} />
        <Slider label="三角形の大きさ" value={size} min={120} max={240} step={10} onChange={setSize} />
      </div>
      <p className="figure-note">三角形を大きくしても、3つの比は変わらない。比を決めているのは「角 θ」だけ。だから、角がわかれば長さの比がわかる。</p>
    </div>
  );
}

// ---------- 2. 灯台の高さを測る ----------

const TAN2 = (d: number) => Math.round(Math.tan(rad(d)) * 100) / 100;

export function Measure() {
  const [d, setD] = useState(50);
  const [th, setTh] = useState(35);
  const eye = 1.5;
  const t = TAN2(th);
  const h = d * t;
  const total = h + eye;
  const scale = Math.min(240 / d, 160 / total);
  const baseX = 320;
  const ground = 205;
  const ox = baseX - d * scale;
  const eyeY = ground - eye * scale;
  const topY = ground - total * scale;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 230" className="area-svg" style={{ maxWidth: 440 }}>
        <rect x={0} y={ground} width={360} height={25} fill="#2d6a4f" />
        {/* 灯台 */}
        <polygon points={`${baseX - 10},${ground} ${baseX + 10},${ground} ${baseX + 5},${topY} ${baseX - 5},${topY}`} fill="#f8f9fa" stroke="#adb5bd" />
        <rect x={baseX - 6} y={topY - 10} width={12} height={10} fill={GOLD} />
        <circle cx={baseX} cy={topY - 5} r={14} fill={GOLD} opacity={0.25} className="pulse" />
        {/* 人 */}
        <circle cx={ox} cy={eyeY - 4} r={4} fill="#fff" />
        <line x1={ox} y1={eyeY} x2={ox} y2={ground} stroke="#fff" strokeWidth={2} />
        {/* 視線と三角形 */}
        <line x1={ox} y1={eyeY} x2={baseX} y2={eyeY} stroke={BLUE} strokeWidth={2.5} strokeDasharray="5 3" />
        <line x1={ox} y1={eyeY} x2={baseX} y2={topY} stroke={GOLD} strokeWidth={2.5} />
        <line x1={baseX} y1={eyeY} x2={baseX} y2={topY} stroke={PINK} strokeWidth={2.5} strokeDasharray="5 3" />
        <Arc cx={ox} cy={eyeY} r={26} from={0} to={th} />
        <Label x={ox + 40} y={eyeY - 10} color={GOLD} size={11}>{th}°</Label>
        <Label x={(ox + baseX) / 2} y={eyeY + 12} color={BLUE} size={11}>{d} m</Label>
        <Label x={baseX - 28} y={(eyeY + topY) / 2} color={PINK} size={11}>{nice(h, 1)} m</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`\\text{高さ} = ${d} \\times \\tan ${th}^\\circ + ${eye} \\fallingdotseq ${d} \\times ${t.toFixed(2)} + ${eye} = ${nice(total, 2)}\\ \\text{m}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="灯台までの距離（m）" value={d} min={20} max={100} step={5} onChange={setD} color={BLUE} />
        <Slider label="見上げる角（°）" value={th} min={10} max={70} onChange={setTh} color={GOLD} />
      </div>
      <p className="figure-note">のぼらなくても、「距離」と「見上げる角度（仰角）」だけで高さがわかる。目の高さ 1.5m をたすのを忘れずに！</p>
    </div>
  );
}

// ---------- 4. 単位円（0°〜180°） ----------

export function UnitCircle() {
  const [th, setTh] = useState(120);
  const [mirror, setMirror] = useState(false);
  const cx = 180;
  const cy = 165;
  const R = 120;
  const c = Math.cos(rad(th));
  const s = Math.sin(rad(th));
  const px = cx + R * c;
  const py = cy - R * s;
  const qx = cx - R * c;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 200" className="area-svg" style={{ maxWidth: 440 }}>
        <line x1={20} y1={cy} x2={340} y2={cy} stroke="var(--muted)" strokeWidth={1.5} />
        <line x1={cx} y1={cy + 20} x2={cx} y2={20} stroke="var(--muted)" strokeWidth={1.5} />
        <path d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="var(--line)" strokeWidth={2} />
        <text x={cx + R + 4} y={cy + 14} fill="var(--muted)" fontSize={10}>1</text>
        <text x={cx - R - 10} y={cy + 14} fill="var(--muted)" fontSize={10}>-1</text>
        <text x={cx + 4} y={cy - R - 4} fill="var(--muted)" fontSize={10}>1</text>
        <Arc cx={cx} cy={cy} r={24} from={0} to={th} />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke={GOLD} strokeWidth={3} />
        <line x1={cx} y1={cy} x2={px} y2={cy} stroke={BLUE} strokeWidth={5} />
        <line x1={px} y1={cy} x2={px} y2={py} stroke={PINK} strokeWidth={5} />
        <circle cx={px} cy={py} r={6} fill={GOLD} stroke="#1b1640" />
        <Label x={px + (c >= 0 ? 16 : -16)} y={py - 10} color={GOLD} size={12}>P</Label>
        <Label x={(cx + px) / 2} y={cy + 14} color={BLUE} size={11}>cos = {f3(c)}</Label>
        <Label x={px + (c >= 0 ? 38 : -38)} y={(cy + py) / 2} color={PINK} size={11}>sin = {f3(s)}</Label>
        {mirror && (
          <g className="pop-in">
            <line x1={cx} y1={cy} x2={qx} y2={py} stroke={GREEN} strokeWidth={2} strokeDasharray="5 3" />
            <circle cx={qx} cy={py} r={5} fill={GREEN} />
            <Label x={qx} y={py - 14} color={GREEN} size={11}>{180 - th}°</Label>
          </g>
        )}
      </svg>
      <div className="trig-ratios">
        <div style={{ borderColor: PINK }}>
          <Tex>{`\\sin ${th}^\\circ`}</Tex>
          <strong>{f3(s)}</strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <Tex>{`\\cos ${th}^\\circ`}</Tex>
          <strong>{f3(c)}</strong>
        </div>
        <div style={{ borderColor: GREEN }}>
          <Tex>{`\\tan ${th}^\\circ`}</Tex>
          <strong>{th === 90 ? 'なし' : f3(s / c)}</strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="角 θ（°）" value={th} min={0} max={180} step={5} onChange={setTh} color={GOLD} />
      </div>
      <button className="btn small ghost" onClick={() => setMirror((m) => !m)}>
        {mirror ? '180°−θ をかくす' : '180°−θ の点も表示'}
      </button>
      <p className="figure-note">
        半径 1 の円で、角 θ の位置にある点 P の座標が <Tex>{'(\\cos\\theta,\\ \\sin\\theta)'}</Tex>。90° をこえると P は左側へ行くので、cos がマイナスになる。
      </p>
    </div>
  );
}

// ---------- 5. 正弦定理 ----------

export function SinLaw() {
  const [phi, setPhi] = useState(100);
  const [Rr, setRr] = useState(3);
  const cx = 180;
  const cy = 130;
  const R = 105;
  const P = (deg: number) => [cx + R * Math.cos(rad(deg)), cy - R * Math.sin(rad(deg))] as const;
  const B = P(215);
  const C = P(325);
  const A = P(phi);
  const len = (p: readonly number[], q: readonly number[]) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const angleAt = (p: readonly number[], q: readonly number[], r: readonly number[]) => {
    const v1 = [q[0] - p[0], q[1] - p[1]];
    const v2 = [r[0] - p[0], r[1] - p[1]];
    return (Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1]))) * 180) / Math.PI;
  };
  const k = Rr / R; // 1px あたりの長さ
  const a = len(B, C) * k;
  const b = len(C, A) * k;
  const Aang = angleAt(A, B, C);
  const Bang = angleAt(B, C, A);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 250" className="area-svg" style={{ maxWidth: 420 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line)" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="var(--muted)" strokeDasharray="4 3" />
        <Label x={cx + R / 2} y={cy - 9} color="var(--muted)" size={11}>R = {Rr}</Label>
        <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill="rgba(241,91,181,0.12)" stroke={PINK} strokeWidth={2.5} />
        <line x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} stroke={GOLD} strokeWidth={4} />
        {[['A', A], ['B', B], ['C', C]].map(([n, p]) => (
          <g key={n as string}>
            <circle cx={(p as readonly number[])[0]} cy={(p as readonly number[])[1]} r={5} fill="#fff" />
            <Label x={(p as readonly number[])[0] + ((p as readonly number[])[0] < cx ? -12 : 12)} y={(p as readonly number[])[1] + ((p as readonly number[])[1] > cy ? 12 : -12)} size={13}>{n as string}</Label>
          </g>
        ))}
        <Label x={(B[0] + C[0]) / 2} y={B[1] + 16} color={GOLD} size={12}>a = {nice(a, 2)}</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`A = ${nice(Aang, 1)}^\\circ,\\quad \\dfrac{a}{\\sin A} = \\dfrac{${nice(a, 2)}}{${f3(Math.sin(rad(Aang)))}} = ${nice(a / Math.sin(rad(Aang)), 2)} = 2R`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\dfrac{b}{\\sin B} = \\dfrac{${nice(b, 2)}}{${f3(Math.sin(rad(Bang)))}} = ${nice(b / Math.sin(rad(Bang)), 2)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="A の位置" value={phi} min={40} max={160} onChange={setPhi} color={PINK} />
        <Slider label="円の半径 R" value={Rr} min={1} max={6} onChange={setRr} />
      </div>
      <p className="figure-note">A を円の上で動かしても、角 A は変わらない（円周角）。そして「辺 ÷ 向かいの角の sin」は、いつも円の直径 2R になる。</p>
    </div>
  );
}

// ---------- 6・7. 三角形（2辺とはさむ角） ----------

function useTriangle(a: number, b: number, C: number) {
  const U = 22;
  const ox = 70;
  const oy = 190;
  const Bp = [ox + a * U, oy] as const;
  const Ap = [ox + b * U * Math.cos(rad(C)), oy - b * U * Math.sin(rad(C))] as const;
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
  return { U, ox, oy, Bp, Ap, c };
}

export function CosLaw() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(4);
  const [C, setC] = useState(60);
  const { ox, oy, Bp, Ap, c } = useTriangle(a, b, C);
  const sum = a * a + b * b;
  const corr = 2 * a * b * Math.cos(rad(C));
  const kind = C < 90 ? '鋭角：c² は a²+b² より小さい' : C === 90 ? '直角：c² = a²+b²（三平方の定理）' : '鈍角：c² は a²+b² より大きい';
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 420 }}>
        <polygon points={`${ox},${oy} ${Bp[0]},${Bp[1]} ${Ap[0]},${Ap[1]}`} fill="rgba(0,187,249,0.12)" />
        <line x1={ox} y1={oy} x2={Bp[0]} y2={Bp[1]} stroke={BLUE} strokeWidth={4} />
        <line x1={ox} y1={oy} x2={Ap[0]} y2={Ap[1]} stroke={PINK} strokeWidth={4} />
        <line x1={Ap[0]} y1={Ap[1]} x2={Bp[0]} y2={Bp[1]} stroke={GOLD} strokeWidth={4} />
        <Arc cx={ox} cy={oy} r={24} from={0} to={C} />
        <Label x={ox - 10} y={oy + 12}>C</Label>
        <Label x={Bp[0] + 10} y={Bp[1] + 12}>B</Label>
        <Label x={Ap[0]} y={Ap[1] - 12}>A</Label>
        <Label x={(ox + Bp[0]) / 2} y={oy + 14} color={BLUE} size={12}>a = {a}</Label>
        <Label x={(ox + Ap[0]) / 2 - 18} y={(oy + Ap[1]) / 2} color={PINK} size={12}>b = {b}</Label>
        <Label x={(Ap[0] + Bp[0]) / 2 + 22} y={(Ap[1] + Bp[1]) / 2 - 6} color={GOLD} size={12}>c ≒ {nice(c, 2)}</Label>
        <Label x={ox + 40} y={oy - 14} color={GOLD} size={11}>{C}°</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`c^2 = a^2 + b^2 - 2ab\\cos C = ${sum} - ${nice(corr, 2)} = ${nice(c * c, 2)}`}</Tex>
      </div>
      <div className="cos-bars">
        <div>
          <span>a² + b²</span>
          <div className="bar"><div style={{ width: `${(sum / 200) * 100}%`, background: BLUE }} /></div>
          <strong>{sum}</strong>
        </div>
        <div>
          <span>c²</span>
          <div className="bar"><div style={{ width: `${(c * c / 200) * 100}%`, background: GOLD }} /></div>
          <strong>{nice(c * c, 1)}</strong>
        </div>
      </div>
      <div className={`disc-box ${C < 90 ? 'd2' : C === 90 ? 'd1' : 'd0'}`}>{kind}</div>
      <div className="sliders">
        <Slider label="辺 a" value={a} min={2} max={8} onChange={setA} color={BLUE} />
        <Slider label="辺 b" value={b} min={2} max={6} onChange={setB} color={PINK} />
        <Slider label="角 C（°）" value={C} min={20} max={160} step={5} onChange={setC} color={GOLD} />
      </div>
      <p className="figure-note">余弦定理は「三平方の定理の、どんな三角形でも使える版」。角 C が 90° からずれた分だけ、<Tex>{'2ab\\cos C'}</Tex> で補正する。</p>
    </div>
  );
}

export function TriArea() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(5);
  const [C, setC] = useState(50);
  const { ox, oy, Bp, Ap } = useTriangle(a, b, C);
  const h = b * Math.sin(rad(C));
  const S = 0.5 * a * h;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 420 }}>
        <polygon points={`${ox},${oy} ${Bp[0]},${Bp[1]} ${Ap[0]},${Ap[1]}`} fill="rgba(6,214,160,0.18)" stroke={GREEN} strokeWidth={2} />
        {C > 90 && <line x1={Ap[0]} y1={oy} x2={ox} y2={oy} stroke="var(--muted)" strokeDasharray="4 3" />}
        <line x1={Ap[0]} y1={Ap[1]} x2={Ap[0]} y2={oy} stroke={PINK} strokeWidth={2.5} strokeDasharray="5 3" />
        <line x1={ox} y1={oy} x2={Bp[0]} y2={Bp[1]} stroke={BLUE} strokeWidth={4} />
        <line x1={ox} y1={oy} x2={Ap[0]} y2={Ap[1]} stroke={GOLD} strokeWidth={3} />
        <Arc cx={ox} cy={oy} r={22} from={0} to={C} />
        <Label x={ox - 10} y={oy + 12}>C</Label>
        <Label x={(ox + Bp[0]) / 2} y={oy + 14} color={BLUE} size={12}>a = {a}</Label>
        <Label x={(ox + Ap[0]) / 2 - 18} y={(oy + Ap[1]) / 2} color={GOLD} size={12}>b = {b}</Label>
        <Label x={Ap[0] + 34} y={(oy + Ap[1]) / 2} color={PINK} size={11}>高さ {nice(h, 2)}</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`\\text{高さ} = b\\sin C = ${b} \\times ${f3(Math.sin(rad(C)))} \\fallingdotseq ${nice(h, 2)}`}</Tex>
      </div>
      <div className="area-formula">
        <Tex>{`S = \\dfrac{1}{2} \\times a \\times b\\sin C \\fallingdotseq ${nice(S, 2)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="辺 a" value={a} min={2} max={8} onChange={setA} color={BLUE} />
        <Slider label="辺 b" value={b} min={2} max={6} onChange={setB} color={GOLD} />
        <Slider label="角 C（°）" value={C} min={15} max={165} step={5} onChange={setC} />
      </div>
      <p className="figure-note">面積は「底辺 × 高さ ÷ 2」。高さが直接わからなくても、<Tex>{'b\\sin C'}</Tex> で求められる。角 C が 90° のとき面積が最大になるのも見てみよう。</p>
    </div>
  );
}

// ---------- 8. 直方体を切る三角形 ----------

export function Cuboid() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);
  // 直方体の大きさに合わせて、図がいっぱいに入るよう縮尺を決める
  const U = Math.min(40, 250 / (a + b * 0.45), 175 / (c + b * 0.7));
  const ox = 60;
  const oy = 205;
  // 斜投影：奥行き（y 方向）は急な斜め右上に描く（三角形 BDE がつぶれて見えないように）
  const pr = (x: number, y: number, z: number) => [ox + x * U + y * U * 0.45, oy - z * U - y * U * 0.7] as const;
  const V = {
    O: pr(0, 0, 0), B: pr(a, 0, 0), D: pr(0, b, 0), E: pr(0, 0, c),
    BD: pr(a, b, 0), BE: pr(a, 0, c), DE: pr(0, b, c), BDE: pr(a, b, c),
  };
  const seg = (p: readonly number[], q: readonly number[], dash = false, color = 'var(--muted)') => (
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={dash ? 1.2 : 1.8} strokeDasharray={dash ? '4 3' : undefined} />
  );
  const BD = Math.sqrt(a * a + b * b);
  const DE = Math.sqrt(b * b + c * c);
  const EB = Math.sqrt(c * c + a * a);
  const cosB = (BD * BD + EB * EB - DE * DE) / (2 * BD * EB);
  const S = 0.5 * Math.sqrt(a * a * b * b + b * b * c * c + c * c * a * a);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 230" className="area-svg" style={{ maxWidth: 420 }}>
        {seg(V.O, V.B, true)}
        {seg(V.O, V.D, true)}
        {seg(V.O, V.E, true)}
        {seg(V.B, V.BD)}
        {seg(V.B, V.BE)}
        {seg(V.D, V.BD)}
        {seg(V.D, V.DE)}
        {seg(V.E, V.BE)}
        {seg(V.E, V.DE)}
        {seg(V.BD, V.BDE)}
        {seg(V.BE, V.BDE)}
        {seg(V.DE, V.BDE)}
        <polygon points={`${V.B[0]},${V.B[1]} ${V.D[0]},${V.D[1]} ${V.E[0]},${V.E[1]}`} fill="rgba(255,209,102,0.35)" stroke={GOLD} strokeWidth={2.5} />
        <Label x={V.B[0] + 10} y={V.B[1] + 12}>B</Label>
        <Label x={V.D[0] + 10} y={V.D[1] - 4}>D</Label>
        <Label x={V.E[0] - 12} y={V.E[1]}>E</Label>
        <Label x={V.O[0] - 12} y={V.O[1] + 10} color="var(--muted)">O</Label>
        <Label x={(V.O[0] + V.B[0]) / 2} y={V.O[1] + 14} color={BLUE} size={11}>{a}</Label>
        <Label x={(V.O[0] + V.E[0]) / 2 - 12} y={(V.O[1] + V.E[1]) / 2} color={PINK} size={11}>{c}</Label>
        <Label x={(V.O[0] + V.D[0]) / 2 - 8} y={(V.O[1] + V.D[1]) / 2 + 10} color={GREEN} size={11}>{b}</Label>
      </svg>
      <div className="mental-steps" style={{ display: 'block' }}>
        <div><Tex>{`BD = \\sqrt{${a * a} + ${b * b}},\\ DE = \\sqrt{${b * b} + ${c * c}},\\ EB = \\sqrt{${c * c} + ${a * a}}`}</Tex></div>
        <div><Tex>{`\\cos\\angle DBE = \\dfrac{BD^2 + EB^2 - DE^2}{2 \\cdot BD \\cdot EB} \\fallingdotseq ${f3(cosB)}`}</Tex></div>
        <div className="mental-ans"><Tex>{`\\triangle BDE \\fallingdotseq ${nice(S, 2)}`}</Tex></div>
      </div>
      <div className="sliders">
        <Slider label="横 a" value={a} min={1} max={6} onChange={setA} color={BLUE} />
        <Slider label="奥行き b" value={b} min={1} max={5} onChange={setB} color={GREEN} />
        <Slider label="高さ c" value={c} min={1} max={5} onChange={setC} color={PINK} />
      </div>
      <p className="figure-note">立体の中の三角形も、①三平方で3辺を出す → ②余弦定理で角の cos → ③ sin を出して面積、と平面の理術を組み合わせれば計算できる。</p>
    </div>
  );
}
