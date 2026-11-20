import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { reduce } from '../../engine/prob';
import { Tex } from '../RichText';
import { nice } from './Plane';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 数学Ⅱ「三角関数」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#9b5de5';

const rad = (deg: number) => (deg * Math.PI) / 180;

/** 度 → 弧度の TeX（例：150 → 5π/6） */
export function radTex(deg: number): string {
  const [n, d] = reduce(deg, 180);
  if (n === 0) return '0';
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (d === 1) return `${s}${a === 1 ? '' : a}\\pi`;
  return `${s}\\dfrac{${a === 1 ? '' : a}\\pi}{${d}}`;
}
/** 度 → 弧度のふつうの文字 */
function radText(deg: number): string {
  const [n, d] = reduce(deg, 180);
  if (n === 0) return '0';
  const a = Math.abs(n);
  return `${n < 0 ? '−' : ''}${a === 1 ? '' : a}π${d === 1 ? '' : `/${d}`}`;
}

const EXACT: [number, string][] = [
  [0, '0'],
  [0.5, '\\frac{1}{2}'],
  [Math.SQRT2 / 2, '\\frac{\\sqrt{2}}{2}'],
  [Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'],
  [1, '1'],
  [Math.sqrt(3), '\\sqrt{3}'],
  [1 / Math.sqrt(3), '\\frac{1}{\\sqrt{3}}'],
  [2, '2'],
];
/** 「= 値」か「≈ 小数」の TeX */
function eqTex(v: number): string {
  if (!Number.isFinite(v) || Math.abs(v) > 1e6) return '\\ \\text{（定義されない）}';
  for (const [x, t] of EXACT) if (Math.abs(Math.abs(v) - x) < 1e-9) return `= ${v < 0 && x !== 0 ? '-' : ''}${t}`;
  return `\\approx ${v.toFixed(3)}`;
}
const clean = (v: number) => (Math.abs(v) < 1e-12 ? 0 : v);
const sinD = (d: number) => clean(Math.sin(rad(d)));
const cosD = (d: number) => clean(Math.cos(rad(d)));
const tanD = (d: number) => (Math.abs(cosD(d)) < 1e-12 ? Infinity : clean(Math.tan(rad(d))));

/** 単位円（中心 cx, cy、半径 R）の目もりと軸 */
function CircleBase({ cx, cy, R }: { cx: number; cy: number; R: number }) {
  return (
    <g>
      <line x1={cx - R - 14} y1={cy} x2={cx + R + 14} y2={cy} stroke="var(--muted)" strokeWidth={1.5} />
      <line x1={cx} y1={cy + R + 14} x2={cx} y2={cy - R - 14} stroke="var(--muted)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line)" strokeWidth={2} />
      <Label x={cx + R + 6} y={cy + 10} color="var(--muted)" size={9}>1</Label>
      <Label x={cx - 8} y={cy - R - 6} color="var(--muted)" size={9}>1</Label>
      <Label x={cx - R - 8} y={cy + 10} color="var(--muted)" size={9}>−1</Label>
    </g>
  );
}

/** 角 from〜to（度）の弧の path */
function arcPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const n = Math.max(2, Math.ceil(Math.abs(to - from) / 4));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = rad(from + ((to - from) * i) / n);
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy - r * Math.sin(t)).toFixed(1)}`;
  }
  return d;
}

/** 横軸が角（弧度）のグラフ。0〜xmax（ラジアン）を描く */
function WavePlot({ xmax = 4 * Math.PI, ymax = 1.5, h = 170, children }: { xmax?: number; ymax?: number; h?: number; children: (X: (t: number) => number, Y: (v: number) => number) => ReactNode }) {
  const clip = useId().replace(/:/g, '');
  const w = 340;
  const x0 = 26;
  const X = (t: number) => x0 + (t / xmax) * (w - x0 - 12);
  const Y = (v: number) => h / 2 - (v / ymax) * (h / 2 - 14);
  const ticks: number[] = [];
  for (let k = 1; (k * Math.PI) / 2 <= xmax + 1e-9; k++) ticks.push(k);
  const ys: number[] = [];
  for (let v = -Math.floor(ymax); v <= Math.floor(ymax); v++) if (v !== 0) ys.push(v);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="plane-svg" role="img" aria-label="グラフ">
      <defs>
        <clipPath id={clip}>
          <rect x={x0} y={4} width={w - x0 - 8} height={h - 8} />
        </clipPath>
      </defs>
      {ticks.map((k) => (
        <line key={k} x1={X((k * Math.PI) / 2)} y1={8} x2={X((k * Math.PI) / 2)} y2={h - 8} stroke="var(--line)" opacity={k % 2 ? 0.35 : 0.7} />
      ))}
      {ys.map((v) => (
        <g key={v}>
          <line x1={x0} y1={Y(v)} x2={w - 8} y2={Y(v)} stroke="var(--line)" opacity={0.6} />
          <text x={x0 - 4} y={Y(v) + 3} fill="var(--muted)" fontSize={9} textAnchor="end">{v}</text>
        </g>
      ))}
      <line x1={x0} y1={Y(0)} x2={w - 6} y2={Y(0)} stroke="var(--muted)" strokeWidth={1.5} />
      <line x1={x0} y1={h - 6} x2={x0} y2={6} stroke="var(--muted)" strokeWidth={1.5} />
      {ticks.filter((k) => xmax <= 2 * Math.PI + 1e-9 || k % 2 === 0).map((k) => (
        <text key={k} x={X((k * Math.PI) / 2)} y={Y(0) + 12} fill="var(--muted)" fontSize={9} textAnchor="middle">
          {radText(k * 90)}
        </text>
      ))}
      <text x={w - 10} y={Y(0) - 6} fill="var(--muted)" fontSize={11} fontStyle="italic" textAnchor="end">θ</text>
      <g clipPath={`url(#${clip})`}>{children(X, Y)}</g>
    </svg>
  );
}

/** WavePlot の中に関数のグラフを描く */
function wavePath(f: (t: number) => number, X: (t: number) => number, Y: (v: number) => number, from: number, to: number): string {
  const n = 220;
  let d = '';
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const t = from + ((to - from) * i) / n;
    const v = f(t);
    if (!Number.isFinite(v) || Math.abs(v) > 50) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(v).toFixed(1)}`;
    pen = true;
  }
  return d;
}

// ---------- 1. 弧度法 ----------

export function Radian() {
  const [deg, setDeg] = useState(120);
  const cx = 120;
  const cy = 105;
  const R = 80;
  const th = rad(deg);
  const full = Math.floor(th + 1e-9);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 460 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line)" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke={BLUE} strokeWidth={3} />
        <Label x={cx + R / 2} y={cy + 12} color={BLUE} size={11}>半径 r</Label>
        <line x1={cx} y1={cy} x2={cx + R * Math.cos(th)} y2={cy - R * Math.sin(th)} stroke="var(--muted)" strokeWidth={2} />
        {deg > 0 && <path d={arcPath(cx, cy, R, 0, deg)} fill="none" stroke={PINK} strokeWidth={6} strokeLinecap="round" />}
        {Array.from({ length: full }, (_, i) => {
          const t = i + 1;
          return (
            <g key={t}>
              <line x1={cx + (R - 9) * Math.cos(t)} y1={cy - (R - 9) * Math.sin(t)} x2={cx + (R + 9) * Math.cos(t)} y2={cy - (R + 9) * Math.sin(t)} stroke={GOLD} strokeWidth={2.5} />
              <Label x={cx + (R + 20) * Math.cos(t)} y={cy - (R + 20) * Math.sin(t)} color={GOLD} size={10}>{`${t}r`}</Label>
            </g>
          );
        })}
        {deg > 0 && <path d={arcPath(cx, cy, 18, 0, deg)} fill="none" stroke={GREEN} strokeWidth={2} />}
        <Label x={cx + 30 * Math.cos(th / 2)} y={cy - 30 * Math.sin(th / 2)} color={GREEN} size={11}>θ</Label>
        <Label x={300} y={40} color="var(--muted)" size={11}>度数法</Label>
        <Label x={300} y={62} color="#fff" size={18}>{`${deg}°`}</Label>
        <Label x={300} y={100} color="var(--muted)" size={11}>弧度法</Label>
        <Label x={300} y={122} color={PINK} size={18}>{radText(deg)}</Label>
        <Label x={300} y={160} color="var(--muted)" size={10}>弧の長さ</Label>
        <Label x={300} y={178} color={GOLD} size={12}>{`半径の ${nice(th, 2)} 倍`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`${deg}^\\circ = ${deg} \\times \\dfrac{\\pi}{180} = ${radTex(deg)} ${deg % 45 === 0 && deg % 180 !== 0 ? `\\approx ${th.toFixed(2)}` : ''}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{弧の長さ } \\ell = r\\theta,\\quad \\text{面積 } S = \\dfrac{1}{2}r^2\\theta`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="角 θ（度）" value={deg} min={0} max={360} step={15} onChange={setDeg} color={PINK} />
      </div>
      <p className="figure-note">金色の目もりは、半径と同じ長さの弧ごとに付けてある。半径 1 つ分の弧に対する角が 1 ラジアン（約 57.3°）。半周（180°）は半径の π 倍（約 3.14 倍）なので、180° = π ラジアン。</p>
    </div>
  );
}

// ---------- 2. 三角関数の定義（一般角と単位円） ----------

export function TrigCircle() {
  const [deg, setDeg] = useState(210);
  const cx = 110;
  const cy = 110;
  const R = 82;
  const th = rad(deg);
  const px = cx + R * Math.cos(th);
  const py = cy - R * Math.sin(th);
  const s = sinD(deg);
  const c = cosD(deg);
  const t = tanD(deg);
  const turns = deg >= 0 ? Math.floor(deg / 360) : -Math.ceil(-deg / 360);
  const base = ((deg % 360) + 360) % 360;
  // 回った角を、らせんで表す
  let spiral = '';
  const steps = Math.max(2, Math.ceil(Math.abs(deg) / 5));
  for (let i = 0; i <= steps; i++) {
    const a = (deg * i) / steps;
    const r = 16 + (Math.abs(a) / 360) * 7;
    spiral += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(rad(a))).toFixed(1)} ${(cy - r * Math.sin(rad(a))).toFixed(1)}`;
  }
  const q = base % 90 === 0 ? '軸の上' : `第 ${Math.floor(base / 90) + 1} 象限`;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 460 }}>
        <CircleBase cx={cx} cy={cy} R={R} />
        {deg !== 0 && <path d={spiral} fill="none" stroke={GREEN} strokeWidth={2} />}
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#fff" strokeWidth={2.5} />
        <line x1={px} y1={py} x2={px} y2={cy} stroke={PINK} strokeWidth={3} />
        <line x1={cx} y1={cy} x2={px} y2={cy} stroke={BLUE} strokeWidth={3} />
        <circle cx={px} cy={py} r={6} fill={GOLD} stroke="#1b1640" strokeWidth={1.5} />
        <Label x={px + (Math.cos(th) >= 0 ? 14 : -14)} y={py - 10} color={GOLD} size={12}>P</Label>
        <Label x={282} y={30} color="var(--muted)" size={11}>{`${deg}°（${radText(deg)}）`}</Label>
        <Label x={282} y={52} color={GREEN} size={11}>{q}</Label>
        <Label x={282} y={86} color={PINK} size={12}>sin θ ＝ P の y 座標</Label>
        <Label x={282} y={108} color={BLUE} size={12}>cos θ ＝ P の x 座標</Label>
        <Label x={282} y={130} color={GOLD} size={12}>tan θ ＝ y ÷ x</Label>
        <Label x={282} y={170} color="var(--muted)" size={10}>{turns === 0 ? '1 周より少ない' : `${Math.abs(turns)} 周${turns < 0 ? '（逆回り）' : ''}＋${base}°`}</Label>
      </svg>
      <div className="trig-ratios">
        <div style={{ borderColor: PINK }}>
          <span>sin θ</span>
          <strong><Tex>{eqTex(s).replace(/^= /, '')}</Tex></strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <span>cos θ</span>
          <strong><Tex>{eqTex(c).replace(/^= /, '')}</Tex></strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>tan θ</span>
          <strong><Tex>{eqTex(t).replace(/^= /, '')}</Tex></strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="角 θ（度）" value={deg} min={-360} max={720} step={15} onChange={setDeg} color={GREEN} />
      </div>
      <p className="figure-note">半径 1 の円の上を、x 軸の正の向きから角 θ だけ回った点 P。反時計回りがプラス、時計回りがマイナスの角。何周回っても、P の位置が同じなら sin・cos・tan の値は同じ。</p>
    </div>
  );
}

// ---------- 3. 三角関数の性質（対称な点） ----------

type SymMode = 'neg' | 'pi-' | 'pi+' | 'half';

export function TrigSym() {
  const [deg, setDeg] = useState(30);
  const [mode, setMode] = useState<SymMode>('pi-');
  const cx = 120;
  const cy = 108;
  const R = 82;
  const q = mode === 'neg' ? -deg : mode === 'pi-' ? 180 - deg : mode === 'pi+' ? 180 + deg : 90 - deg;
  const P = [cx + R * Math.cos(rad(deg)), cy - R * Math.sin(rad(deg))];
  const Q = [cx + R * Math.cos(rad(q)), cy - R * Math.sin(rad(q))];
  const name = { neg: '-\\theta', 'pi-': '\\pi - \\theta', 'pi+': '\\pi + \\theta', half: '\\dfrac{\\pi}{2} - \\theta' }[mode];
  const rule = {
    neg: '\\sin(-\\theta) = -\\sin\\theta,\\ \\cos(-\\theta) = \\cos\\theta',
    'pi-': '\\sin(\\pi - \\theta) = \\sin\\theta,\\ \\cos(\\pi - \\theta) = -\\cos\\theta',
    'pi+': '\\sin(\\pi + \\theta) = -\\sin\\theta,\\ \\cos(\\pi + \\theta) = -\\cos\\theta',
    half: '\\sin\\left(\\dfrac{\\pi}{2} - \\theta\\right) = \\cos\\theta,\\ \\cos\\left(\\dfrac{\\pi}{2} - \\theta\\right) = \\sin\\theta',
  }[mode];
  const how = { neg: 'x 軸について対称', 'pi-': 'y 軸について対称', 'pi+': '原点について対称', half: '直線 y = x について対称' }[mode];
  return (
    <div className="figure">
      <svg viewBox="0 0 360 216" className="area-svg" style={{ maxWidth: 460 }}>
        <CircleBase cx={cx} cy={cy} R={R} />
        {mode === 'half' && <line x1={cx - 90} y1={cy + 90} x2={cx + 90} y2={cy - 90} stroke="var(--muted)" strokeDasharray="4 4" />}
        <line x1={cx} y1={cy} x2={P[0]} y2={P[1]} stroke={PINK} strokeWidth={2.5} />
        <line x1={cx} y1={cy} x2={Q[0]} y2={Q[1]} stroke={BLUE} strokeWidth={2.5} />
        <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={P[0]} cy={P[1]} r={6} fill={PINK} stroke="#1b1640" strokeWidth={1.5} />
        <circle cx={Q[0]} cy={Q[1]} r={6} fill={BLUE} stroke="#1b1640" strokeWidth={1.5} />
        <Label x={P[0] + 12} y={P[1] - 10} color={PINK} size={12}>P</Label>
        <Label x={Q[0] + (Q[0] < cx ? -12 : 12)} y={Q[1] + (Q[1] > cy ? 12 : -10)} color={BLUE} size={12}>Q</Label>
        <Label x={290} y={44} color={PINK} size={11}>{`P：θ = ${deg}°`}</Label>
        <Label x={290} y={70} color={BLUE} size={11}>{`Q：${q}°`}</Label>
        <Label x={290} y={110} color={GOLD} size={11}>{how}</Label>
        <Label x={290} y={150} color="var(--muted)" size={10}>{`P(${nice(cosD(deg), 3)}, ${nice(sinD(deg), 3)})`}</Label>
        <Label x={290} y={170} color="var(--muted)" size={10}>{`Q(${nice(cosD(q), 3)}, ${nice(sinD(q), 3)})`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`Q \\text{ の角 } ${name}:\\quad ${rule}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\sin^2\\theta + \\cos^2\\theta = ${nice(sinD(deg) ** 2, 3)} + ${nice(cosD(deg) ** 2, 3)} = 1`}</Tex>
      </div>
      <Toggle<SymMode>
        label="Q の角"
        options={[
          { v: 'neg', text: '−θ' },
          { v: 'pi-', text: 'π−θ' },
          { v: 'pi+', text: 'π+θ' },
          { v: 'half', text: 'π/2−θ' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="sliders">
        <Slider label="θ（度）" value={deg} min={0} max={90} step={15} onChange={setDeg} color={PINK} />
      </div>
      <p className="figure-note">P と Q は円の上で対称な位置にある。だから座標（cos と sin）は、入れかわったり符号が変わったりするだけ。公式を丸暗記しなくても、図をかけばすぐにわかる。</p>
    </div>
  );
}

// ---------- 4. 三角関数のグラフ ----------

export function SinWave() {
  const [deg, setDeg] = useState(150);
  const [fn, setFn] = useState<'sin' | 'cos' | 'tan'>('sin');
  const th = rad(deg);
  const f = fn === 'sin' ? Math.sin : fn === 'cos' ? Math.cos : Math.tan;
  const v = fn === 'sin' ? sinD(deg) : fn === 'cos' ? cosD(deg) : tanD(deg);
  const color = fn === 'sin' ? PINK : fn === 'cos' ? BLUE : GOLD;
  const cx = 60;
  const cy = 60;
  const R = 42;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 120" className="area-svg" style={{ maxWidth: 460 }}>
        <CircleBase cx={cx} cy={cy} R={R} />
        <line x1={cx} y1={cy} x2={cx + R * Math.cos(th)} y2={cy - R * Math.sin(th)} stroke="#fff" strokeWidth={2} />
        {fn === 'sin' && <line x1={cx + R * Math.cos(th)} y1={cy - R * Math.sin(th)} x2={cx + R * Math.cos(th)} y2={cy} stroke={PINK} strokeWidth={3} />}
        {fn === 'cos' && <line x1={cx} y1={cy} x2={cx + R * Math.cos(th)} y2={cy} stroke={BLUE} strokeWidth={3} />}
        <circle cx={cx + R * Math.cos(th)} cy={cy - R * Math.sin(th)} r={5} fill={GOLD} stroke="#1b1640" />
        <Label x={130} y={30} color="var(--muted)" size={11} anchor="start">{`θ = ${deg}°（${radText(deg)}）`}</Label>
        <Label x={130} y={56} color={color} size={13} anchor="start">{`${fn} θ ${Number.isFinite(v) ? `${Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6 ? '=' : '≈'} ${nice(v, 3)}` : 'は定義されない'}`}</Label>
        <Label x={130} y={84} color="var(--muted)" size={10} anchor="start">{fn === 'tan' ? '周期 π（180° ごとに同じ形）' : '周期 2π（1 周ごとに同じ形）'}</Label>
      </svg>
      <WavePlot ymax={fn === 'tan' ? 3 : 1.5}>
        {(X, Y) => (
          <>
            {fn === 'tan' && [0.5, 1.5, 2.5, 3.5].map((k) => <line key={k} x1={X(k * Math.PI)} y1={0} x2={X(k * Math.PI)} y2={200} stroke="var(--muted)" strokeDasharray="4 4" />)}
            <path d={wavePath(f, X, Y, 0, 4 * Math.PI)} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} />
            <path d={wavePath(f, X, Y, 0, th)} fill="none" stroke={color} strokeWidth={3} />
            {Number.isFinite(v) && Math.abs(v) < 3.5 && <circle cx={X(th)} cy={Y(v)} r={5} fill={GOLD} stroke="#1b1640" />}
          </>
        )}
      </WavePlot>
      <Toggle label="関数" options={[{ v: 'sin', text: 'sin' }, { v: 'cos', text: 'cos' }, { v: 'tan', text: 'tan' }]} value={fn} onChange={setFn} />
      <div className="sliders">
        <Slider label="θ（度）" value={deg} min={0} max={720} step={15} onChange={setDeg} color={color} />
      </div>
      <p className="figure-note">点 P が円を回ると、高さ（sin）は −1 と 1 のあいだを行ったり来たりして波になる。1 周（2π）で同じ形にもどる。cos は sin を左に π/2 ずらした形。tan は π ごとにくり返し、θ = π/2 などでは定義されない。</p>
    </div>
  );
}

// ---------- 5. グラフの変形と周期 ----------

export function WaveTransform() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [c, setC] = useState(0);
  const f = (t: number) => a * Math.sin(b * (t - rad(c)));
  const [pn, pd] = reduce(2 * 2, b * 2); // 周期 2π/b
  const periodTex = pd === 1 ? `${pn === 1 ? '' : pn}\\pi` : `\\dfrac{${pn === 1 ? '' : pn}\\pi}{${pd}}`;
  const bTex = Number.isInteger(b) ? (b === 1 ? '' : String(b)) : `\\frac{${b * 2}}{2}`;
  const inner = c === 0 ? '\\theta' : `\\left(\\theta ${c > 0 ? '-' : '+'} ${radTex(Math.abs(c))}\\right)`;
  return (
    <div className="figure">
      <WavePlot ymax={3.5} h={200}>
        {(X, Y) => (
          <>
            <path d={wavePath(Math.sin, X, Y, 0, 4 * Math.PI)} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 4" />
            <path d={wavePath(f, X, Y, 0, 4 * Math.PI)} fill="none" stroke={PINK} strokeWidth={3} />
            <line x1={X(rad(c) < 0 ? rad(c) + (2 * Math.PI) / b : rad(c))} y1={Y(-3.2)} x2={X((rad(c) < 0 ? rad(c) + (2 * Math.PI) / b : rad(c)) + (2 * Math.PI) / b)} y2={Y(-3.2)} stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
          </>
        )}
      </WavePlot>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{y = ${a === 1 ? '' : a}\\sin ${bTex}${inner}}`}</Tex>
      </div>
      <div className="trig-ratios">
        <div style={{ borderColor: PINK }}>
          <span>最大値・最小値</span>
          <strong>{`${a}・${-a}`}</strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>周期（金の線）</span>
          <strong><Tex>{periodTex}</Tex></strong>
        </div>
        <div style={{ borderColor: GREEN }}>
          <span>ずらし</span>
          <strong>{c === 0 ? 'なし' : `${c > 0 ? '右' : '左'}へ ${radText(Math.abs(c))}`}</strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="a（たての倍率）" value={a} min={0.5} max={3} step={0.5} onChange={setA} color={PINK} />
        <Slider label="b（よこを 1/b 倍）" value={b} min={0.5} max={4} step={0.5} onChange={setB} color={GOLD} />
        <Slider label="ずらし（度）" value={c} min={-90} max={90} step={15} onChange={setC} color={GREEN} />
      </div>
      <p className="figure-note">点線が y = sin θ。a 倍するとたてに a 倍（最大値が a）、θ を bθ にすると横に 1/b 倍にちぢんで周期が 2π/b になる。θ を θ − p にすると右へ p ずれる。</p>
    </div>
  );
}

// ---------- 6. 三角方程式・不等式 ----------

const KS: { v: number; t: string }[] = [
  { v: -1, t: '-1' },
  { v: -Math.sqrt(3) / 2, t: '-\\frac{\\sqrt{3}}{2}' },
  { v: -Math.SQRT2 / 2, t: '-\\frac{\\sqrt{2}}{2}' },
  { v: -0.5, t: '-\\frac{1}{2}' },
  { v: 0, t: '0' },
  { v: 0.5, t: '\\frac{1}{2}' },
  { v: Math.SQRT2 / 2, t: '\\frac{\\sqrt{2}}{2}' },
  { v: Math.sqrt(3) / 2, t: '\\frac{\\sqrt{3}}{2}' },
  { v: 1, t: '1' },
];

/** 0 ≦ θ < 360 で f(θ) op k をみたす範囲（15° の目もりで求める） */
export function solveTrig(f: (d: number) => number, k: number, op: '=' | '>' | '<'): { eq: number[]; runs: [number, number][] } {
  const eq: number[] = [];
  for (let d = 0; d < 360; d += 15) if (Math.abs(f(d) - k) < 1e-9) eq.push(d);
  const runs: [number, number][] = [];
  if (op !== '=') {
    let start: number | null = null;
    for (let d = 0; d < 360; d += 15) {
      const m = f(d + 7.5);
      const ok = op === '>' ? m > k : m < k;
      if (ok && start === null) start = d;
      if (!ok && start !== null) {
        runs.push([start, d]);
        start = null;
      }
    }
    if (start !== null) runs.push([start, 360]);
  }
  return { eq, runs };
}

/** 範囲を TeX に（0 は条件しだいで ≦） */
export function runsTex(runs: [number, number][], f: (d: number) => number, k: number, op: '>' | '<'): string {
  if (!runs.length) return '\\text{解なし}';
  return runs
    .map(([s, e]) => {
      const left = s === 0 && (op === '>' ? f(0) > k + 1e-9 : f(0) < k - 1e-9) ? '0 \\le' : `${radTex(s)} <`;
      return `${left} \\theta < ${radTex(e)}`;
    })
    .join(',\\ ');
}

export function TrigEq() {
  const [fn, setFn] = useState<'sin' | 'cos'>('sin');
  const [ki, setKi] = useState(5);
  const [op, setOp] = useState<'=' | '>' | '<'>('=');
  const k = KS[ki];
  const f = fn === 'sin' ? sinD : cosD;
  const { eq, runs } = solveTrig(f, k.v, op);
  const cx = 120;
  const cy = 108;
  const R = 84;
  const sol = op === '=' ? (eq.length ? `\\theta = ${eq.map(radTex).join(',\\ ')}` : '\\text{解なし}') : runsTex(runs, f, k.v, op);
  const opTex = op === '=' ? '=' : op;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 216" className="area-svg" style={{ maxWidth: 460 }}>
        <CircleBase cx={cx} cy={cy} R={R} />
        {runs.map(([s, e]) => (
          <path key={s} d={arcPath(cx, cy, R, s, e)} fill="none" stroke={GREEN} strokeWidth={6} strokeLinecap="round" />
        ))}
        {fn === 'sin' ? (
          <line x1={cx - R - 14} y1={cy - R * k.v} x2={cx + R + 14} y2={cy - R * k.v} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />
        ) : (
          <line x1={cx + R * k.v} y1={cy - R - 14} x2={cx + R * k.v} y2={cy + R + 14} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />
        )}
        {eq.map((d) => (
          <g key={d}>
            <line x1={cx} y1={cy} x2={cx + R * Math.cos(rad(d))} y2={cy - R * Math.sin(rad(d))} stroke={PINK} strokeWidth={2} />
            <circle cx={cx + R * Math.cos(rad(d))} cy={cy - R * Math.sin(rad(d))} r={6} fill={PINK} stroke="#1b1640" strokeWidth={1.5} />
            <Label x={cx + (R + 22) * Math.cos(rad(d))} y={cy - (R + 16) * Math.sin(rad(d))} color={PINK} size={10}>{radText(d)}</Label>
          </g>
        ))}
        <Label x={292} y={50} color={GOLD} size={11}>{fn === 'sin' ? `高さ（y）が ${nice(k.v, 3)}` : `よこ（x）が ${nice(k.v, 3)}`}</Label>
        <Label x={292} y={74} color={PINK} size={11}>の線</Label>
        <Label x={292} y={130} color={GREEN} size={10}>{op === '=' ? '交わる点が解' : op === '>' ? (fn === 'sin' ? '線より上の弧が解' : '線より右の弧が解') : fn === 'sin' ? '線より下の弧が解' : '線より左の弧が解'}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`${fn === 'sin' ? '\\sin' : '\\cos'}\\theta ${opTex} ${k.t}\\ (0 \\le \\theta < 2\\pi):\\quad \\color{${op === '=' ? PINK : GREEN}}{${sol}}`}</Tex>
      </div>
      <Toggle label="関数" options={[{ v: 'sin', text: 'sin' }, { v: 'cos', text: 'cos' }]} value={fn} onChange={setFn} />
      <Toggle label="記号" options={[{ v: '=', text: '＝' }, { v: '>', text: '＞' }, { v: '<', text: '＜' }]} value={op} onChange={setOp} />
      <div className="sliders">
        <Slider label="右辺 k を選ぶ" value={ki} min={0} max={8} onChange={setKi} color={GOLD} />
      </div>
      <p className="figure-note">sin θ = k なら、高さ k の横線と単位円の交わる点。cos θ = k なら、x = k の縦線との交わる点。ふつう解は 2 つある。不等式は、線より上（下）の弧の部分が解になる。</p>
    </div>
  );
}

// ---------- 7. 加法定理 ----------

export function Addition() {
  const [al, setAl] = useState(45);
  const [be, setBe] = useState(30);
  const [minus, setMinus] = useState<'+' | '-'>('+');
  const g = minus === '+' ? al + be : al - be;
  const cx = 110;
  const cy = 110;
  const R = 84;
  const pt = (d: number) => [cx + R * Math.cos(rad(d)), cy - R * Math.sin(rad(d))];
  const A = pt(al);
  const G = pt(g);
  const s = minus === '+' ? '+' : '-';
  const sv = sinD(al) * cosD(be) + (minus === '+' ? 1 : -1) * cosD(al) * sinD(be);
  const cv = cosD(al) * cosD(be) - (minus === '+' ? 1 : -1) * sinD(al) * sinD(be);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 460 }}>
        <CircleBase cx={cx} cy={cy} R={R} />
        <path d={arcPath(cx, cy, 24, 0, al)} fill="none" stroke={BLUE} strokeWidth={2.5} />
        <path d={arcPath(cx, cy, 34, al, g)} fill="none" stroke={PURPLE} strokeWidth={2.5} />
        <line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke={BLUE} strokeWidth={2.5} />
        <line x1={cx} y1={cy} x2={G[0]} y2={G[1]} stroke={PINK} strokeWidth={3} />
        <line x1={G[0]} y1={G[1]} x2={G[0]} y2={cy} stroke={PINK} strokeWidth={1.5} strokeDasharray="3 3" />
        <circle cx={A[0]} cy={A[1]} r={5} fill={BLUE} stroke="#1b1640" />
        <circle cx={G[0]} cy={G[1]} r={6} fill={PINK} stroke="#1b1640" />
        <Label x={276} y={36} color={BLUE} size={11}>{`α = ${al}°`}</Label>
        <Label x={276} y={58} color={PURPLE} size={11}>{`β = ${be}°（${minus === '+' ? 'さらに回す' : 'もどす'}）`}</Label>
        <Label x={276} y={80} color={PINK} size={11}>{`α ${minus === '+' ? '+' : '−'} β = ${g}°`}</Label>
        <Label x={276} y={120} color="var(--muted)" size={10}>{`sin(α ${minus === '+' ? '+' : '−'} β) ≈ ${nice(sinD(g), 4)}`}</Label>
        <Label x={276} y={140} color="var(--muted)" size={10}>{`cos(α ${minus === '+' ? '+' : '−'} β) ≈ ${nice(cosD(g), 4)}`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\sin(\\alpha ${s} \\beta) = \\sin\\alpha\\cos\\beta ${s} \\cos\\alpha\\sin\\beta = ${nice(sinD(al), 3)} \\cdot ${nice(cosD(be), 3)} ${s} ${nice(cosD(al), 3)} \\cdot ${nice(sinD(be), 3)} ${eqTex(sv)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\cos(\\alpha ${s} \\beta) = \\cos\\alpha\\cos\\beta ${minus === '+' ? '-' : '+'} \\sin\\alpha\\sin\\beta ${eqTex(cv)}`}</Tex>
      </div>
      <Toggle label="向き" options={[{ v: '+', text: 'α＋β' }, { v: '-', text: 'α−β' }]} value={minus} onChange={setMinus} />
      <div className="sliders">
        <Slider label="α（度）" value={al} min={0} max={90} step={15} onChange={setAl} color={BLUE} />
        <Slider label="β（度）" value={be} min={0} max={90} step={15} onChange={setBe} color={PURPLE} />
      </div>
      <p className="figure-note">sin(α + β) は sin α + sin β ではない。α と β の sin・cos をかけ合わせて組み合わせる。α = 45°、β = 30° にすると、75° のような「有名でない角」の値も求められる。</p>
    </div>
  );
}

// ---------- 8. 2 倍角・半角の公式 ----------

type DMode = 'sin2' | 'cos2' | 'half';

export function DoubleAngle() {
  const [deg, setDeg] = useState(60);
  const [mode, setMode] = useState<DMode>('cos2');
  const left = mode === 'sin2' ? (t: number) => Math.sin(2 * t) : mode === 'cos2' ? (t: number) => Math.cos(2 * t) : (t: number) => Math.sin(t / 2) ** 2;
  const right = mode === 'sin2' ? (t: number) => 2 * Math.sin(t) * Math.cos(t) : mode === 'cos2' ? (t: number) => 1 - 2 * Math.sin(t) ** 2 : (t: number) => (1 - Math.cos(t)) / 2;
  const th = rad(deg);
  const formula = {
    sin2: ['\\sin 2\\theta', '2\\sin\\theta\\cos\\theta'],
    cos2: ['\\cos 2\\theta', '1 - 2\\sin^2\\theta'],
    half: ['\\sin^2\\dfrac{\\theta}{2}', '\\dfrac{1 - \\cos\\theta}{2}'],
  }[mode];
  const dots = Array.from({ length: 17 }, (_, i) => (i * Math.PI) / 4);
  return (
    <div className="figure">
      <WavePlot ymax={1.5}>
        {(X, Y) => (
          <>
            <path d={wavePath(Math.sin, X, Y, 0, 4 * Math.PI)} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />
            <path d={wavePath(left, X, Y, 0, 4 * Math.PI)} fill="none" stroke={PINK} strokeWidth={3} />
            {dots.map((t) => (
              <circle key={t} cx={X(t)} cy={Y(right(t))} r={3.5} fill={BLUE} stroke="#1b1640" />
            ))}
            <line x1={X(th)} y1={0} x2={X(th)} y2={300} stroke={GOLD} strokeDasharray="4 3" />
            <circle cx={X(th)} cy={Y(left(th))} r={6} fill={GOLD} stroke="#1b1640" />
          </>
        )}
      </WavePlot>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{${formula[0]}} = \\color{${BLUE}}{${formula[1]}}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\theta = ${radTex(deg)}:\\quad ${formula[0]} ${eqTex(left(th))},\\quad ${formula[1]} ${eqTex(right(th))}`}</Tex>
      </div>
      <Toggle<DMode> label="公式" options={[{ v: 'sin2', text: 'sin 2θ' }, { v: 'cos2', text: 'cos 2θ' }, { v: 'half', text: '半角' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="θ（度）" value={deg} min={0} max={720} step={15} onChange={setDeg} color={GOLD} />
      </div>
      <p className="figure-note">桃色の線が左辺、青い点が右辺。どの θ でも点が線の上にのるので、2 つの式はいつも等しい。点線の sin θ にくらべて、2θ のグラフは周期が半分の π になっている。</p>
    </div>
  );
}

// ---------- 9. 三角関数の合成 ----------

/** 係数つきの項（1 は省略、0 は書かない） */
const term = (c: number, body: string, first: boolean) => (c === 0 ? '' : `${c < 0 ? '-' : first ? '' : '+'}${Math.abs(c) === 1 ? '' : Math.abs(c)}${body}`);

export function Synthesis() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const r2 = a * a + b * b;
  const r = Math.sqrt(r2);
  const al = Math.atan2(b, a);
  const alDeg = Math.round((al * 180) / Math.PI);
  const niceAl = Math.abs((al * 180) / Math.PI - alDeg) < 1e-9 && alDeg % 15 === 0;
  const rTex = Number.isInteger(r) ? String(r) : `\\sqrt{${r2}}`;
  const S = 22;
  const ox = 70;
  const oy = 90;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 180" className="area-svg" style={{ maxWidth: 460 }}>
        <line x1={ox - 4 * S - 6} y1={oy} x2={ox + 4 * S + 6} y2={oy} stroke="var(--muted)" strokeWidth={1.5} />
        <line x1={ox} y1={oy + 4 * S - 4} x2={ox} y2={oy - 4 * S + 4} stroke="var(--muted)" strokeWidth={1.5} />
        {r > 0 && <circle cx={ox} cy={oy} r={r * S} fill="none" stroke="var(--line)" strokeDasharray="4 4" />}
        <line x1={ox} y1={oy} x2={ox + a * S} y2={oy} stroke={BLUE} strokeWidth={3} />
        <line x1={ox + a * S} y1={oy} x2={ox + a * S} y2={oy - b * S} stroke={GREEN} strokeWidth={3} />
        <line x1={ox} y1={oy} x2={ox + a * S} y2={oy - b * S} stroke={PINK} strokeWidth={3} />
        {r > 0 && <path d={arcPath(ox, oy, 16, 0, (al * 180) / Math.PI)} fill="none" stroke={GOLD} strokeWidth={2} />}
        <circle cx={ox + a * S} cy={oy - b * S} r={5} fill={PINK} stroke="#1b1640" />
        <Label x={ox + a * S + (a >= 0 ? 10 : -10)} y={oy - b * S - 10} color={PINK} size={11}>{`(${a}, ${b})`}</Label>
        <Label x={250} y={40} color={BLUE} size={11}>{`sin の係数 a = ${a}（よこ）`}</Label>
        <Label x={250} y={62} color={GREEN} size={11}>{`cos の係数 b = ${b}（たて）`}</Label>
        <Label x={250} y={98} color={PINK} size={12}>{`長さ r ≈ ${nice(r, 3)}`}</Label>
        <Label x={250} y={122} color={GOLD} size={12}>{`角 α ≈ ${nice((al * 180) / Math.PI, 1)}°`}</Label>
      </svg>
      <WavePlot xmax={2 * Math.PI} ymax={Math.max(1.5, Math.ceil(r) + 0.5)} h={160}>
        {(X, Y) => (
          <>
            <path d={wavePath((t) => a * Math.sin(t), X, Y, 0, 2 * Math.PI)} fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 4" />
            <path d={wavePath((t) => b * Math.cos(t), X, Y, 0, 2 * Math.PI)} fill="none" stroke={GREEN} strokeWidth={1.5} strokeDasharray="5 4" />
            <path d={wavePath((t) => a * Math.sin(t) + b * Math.cos(t), X, Y, 0, 2 * Math.PI)} fill="none" stroke={PINK} strokeWidth={3} />
          </>
        )}
      </WavePlot>
      <div className="area-formula small-formula">
        <Tex>{r === 0 ? '0' : `${term(a, '\\sin\\theta', true)}${term(b, '\\cos\\theta', a === 0)} = ${rTex}\\sin(\\theta ${al < 0 ? '-' : '+'} ${niceAl ? radTex(Math.abs(alDeg)) : `${nice(Math.abs((al * 180) / Math.PI), 1)}^\\circ`})`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="a（sin）" value={a} min={-4} max={4} onChange={setA} color={BLUE} />
        <Slider label="b（cos）" value={b} min={-4} max={4} onChange={setB} color={GREEN} />
      </div>
      <p className="figure-note">点 (a, b) をとると、原点からの長さが r = √(a² + b²)、x 軸とのなす角が α。2 つの波（点線）を足すと、高さ r の 1 つの sin の波（桃色）になる。だから最大値は r、最小値は −r。</p>
    </div>
  );
}
