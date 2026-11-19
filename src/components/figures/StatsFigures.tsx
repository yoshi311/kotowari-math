import { useState } from 'react';
import { binom, binomTail, correlation, mean, median, modes, quartiles, sd, variance } from '../../engine/stats';
import { Tex } from '../RichText';
import { nice } from './Plane';
import { Slider } from './Slider';

// データの分析の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#9b5de5';

export function Label({ x, y, children, color = '#fff', size = 12, anchor = 'middle' }: { x: number; y: number; children: React.ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={800} textAnchor={anchor} dominantBaseline="central" className={color === "#1b1640" ? undefined : "plane-label"}>
      {children}
    </text>
  );
}

/** 数直線（目もりつき） */
function Axis({ x0, x1, y, from, to, step, label }: { x0: number; x1: number; y: number; from: number; to: number; step: number; label?: string }) {
  const sx = (v: number) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  const ticks: number[] = [];
  for (let v = from; v <= to + 1e-9; v += step) ticks.push(v);
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--muted)" strokeWidth={1.5} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={sx(v)} y1={y} x2={sx(v)} y2={y + 4} stroke="var(--muted)" />
          <text x={sx(v)} y={y + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">
            {v}
          </text>
        </g>
      ))}
      {label && (
        <text x={x1} y={y + 27} fontSize={10} fill="var(--muted)" textAnchor="end">
          {label}
        </text>
      )}
    </g>
  );
}

/** 同じ値の点を積み上げた「ドットプロット」の座標 */
function stack(xs: number[]): { v: number; k: number; i: number }[] {
  const seen = new Map<number, number>();
  return xs.map((v, i) => {
    const k = seen.get(v) ?? 0;
    seen.set(v, k + 1);
    return { v, k, i };
  });
}

export function Toggle<T extends string | number>({ options, value, onChange, label }: { options: { v: T; text: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="stat-toggle" role="group" aria-label={label}>
      <span>{label}</span>
      {options.map((o) => (
        <button key={String(o.v)} type="button" className={o.v === value ? 'on' : ''} onClick={() => onChange(o.v)}>
          {o.text}
        </button>
      ))}
    </div>
  );
}

// ---------- 1. 代表値（平均値・中央値・最頻値） ----------

export function MeanBalance() {
  const [x, setX] = useState(7);
  const data = [2, 3, 3, 4, 5, 6, x];
  const m = mean(data);
  const med = median(data);
  const mo = modes(data);
  const x0 = 20;
  const x1 = 340;
  const sx = (v: number) => x0 + (v / 20) * (x1 - x0);
  const base = 150;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 225" className="area-svg" style={{ maxWidth: 440 }}>
        {/* シーソーの板 */}
        <line x1={x0} y1={base} x2={x1} y2={base} stroke="#8d6e63" strokeWidth={5} strokeLinecap="round" />
        {stack(data).map(({ v, k, i }) => (
          <circle key={i} cx={sx(v)} cy={base - 12 - k * 20} r={9} fill={i === 6 ? PINK : '#f8f9fa'} stroke="#adb5bd" />
        ))}
        {/* 支点＝平均値 */}
        <polygon points={`${sx(m)},${base + 3} ${sx(m) - 11},${base + 20} ${sx(m) + 11},${base + 20}`} fill={GOLD} />
        <Label x={sx(m)} y={base + 30} color={GOLD} size={11}>平均 {nice(m, 1)}</Label>
        {/* 中央値 */}
        <line x1={sx(med)} y1={30} x2={sx(med)} y2={base - 4} stroke={BLUE} strokeWidth={2} strokeDasharray="4 3" />
        <Label x={sx(med)} y={20} color={BLUE} size={11}>中央値 {nice(med, 1)}</Label>
        <Axis x0={x0} x1={x1} y={base + 42} from={0} to={20} step={2} label="卵の数（個）" />
      </svg>
      <div className="trig-ratios">
        <div style={{ borderColor: GOLD }}>
          <span>平均値</span>
          <strong>{nice(m, 2)}</strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <span>中央値</span>
          <strong>{nice(med, 1)}</strong>
        </div>
        <div style={{ borderColor: PINK }}>
          <span>最頻値</span>
          <strong>{mo.join('・')}</strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="大農場（ピンク）の卵の数" value={x} min={1} max={20} onChange={setX} color={PINK} />
      </div>
      <p className="figure-note">平均値は、板がつりあう「支点」の場所。1 つだけ大きな値があると、支点（平均値）は大きくずれるけど、まん中の順番の値（中央値）はほとんど動かない。</p>
    </div>
  );
}

// ---------- 2. 度数分布表とヒストグラム ----------

/** 麦 30 本の背丈（cm） */
export const WHEAT = [42, 47, 49, 51, 53, 54, 55, 56, 57, 58, 58, 59, 61, 61, 62, 62, 63, 63, 64, 64, 65, 66, 67, 68, 69, 71, 72, 74, 76, 79];

export function Histogram() {
  const [w, setW] = useState(10);
  const lo = 40;
  const hi = 80;
  const bins: { a: number; b: number; n: number }[] = [];
  for (let a = lo; a < hi; a += w) bins.push({ a, b: a + w, n: WHEAT.filter((v) => v >= a && v < a + w).length });
  const maxN = Math.max(...bins.map((b) => b.n));
  const x0 = 30;
  const x1 = 340;
  const base = 175;
  const sx = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const unitH = 130 / Math.max(maxN, 1);
  const top = bins.find((b) => b.n === maxN)!;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 440 }}>
        {bins.map((b) => (
          <g key={b.a}>
            <rect
              x={sx(b.a)}
              y={base - b.n * unitH}
              width={sx(b.b) - sx(b.a)}
              height={b.n * unitH}
              fill={b === top ? GOLD : PURPLE}
              opacity={b === top ? 0.9 : 0.6}
              stroke="#fff"
              strokeWidth={1}
            />
            {b.n > 0 && (
              <Label x={(sx(b.a) + sx(b.b)) / 2} y={base - b.n * unitH - 9} size={w <= 4 ? 9 : 12}>
                {b.n}
              </Label>
            )}
          </g>
        ))}
        <Axis x0={x0} x1={x1} y={base} from={lo} to={hi} step={w <= 4 ? 8 : w} label="背たけ（cm）" />
      </svg>
      <div className="area-formula small-formula">
        いちばん多い階級：{top.a}〜{top.b}cm（{top.n} 本）、階級値 {nice((top.a + top.b) / 2, 1)}cm
      </div>
      <Toggle
        label="階級の幅"
        value={w}
        onChange={setW}
        options={[
          { v: 2, text: '2cm' },
          { v: 5, text: '5cm' },
          { v: 10, text: '10cm' },
          { v: 20, text: '20cm' },
        ]}
      />
      <p className="figure-note">同じ 30 本のデータでも、階級の幅で形が変わる。せますぎるとギザギザ、広すぎるとのっぺり。ちょうどよい幅で、データの「山の形」が見えてくる。</p>
    </div>
  );
}

// ---------- 3. 四分位数と箱ひげ図 ----------

const BOX_DATA = [3, 4, 6, 7, 9, 10, 12, 13, 15, 17, 19];

/** 箱ひげ図（outlier を渡すと、その値は ○ で別にかく） */
function BoxPlotSvg({ q, y, sx, lowW, highW, outliers = [] }: { q: ReturnType<typeof quartiles>; y: number; sx: (v: number) => number; lowW?: number; highW?: number; outliers?: number[] }) {
  const lw = lowW ?? q.min;
  const hw = highW ?? q.max;
  return (
    <g>
      <line x1={sx(lw)} y1={y} x2={sx(q.q1)} y2={y} stroke="#fff" strokeWidth={2} />
      <line x1={sx(q.q3)} y1={y} x2={sx(hw)} y2={y} stroke="#fff" strokeWidth={2} />
      <line x1={sx(lw)} y1={y - 9} x2={sx(lw)} y2={y + 9} stroke="#fff" strokeWidth={2} />
      <line x1={sx(hw)} y1={y - 9} x2={sx(hw)} y2={y + 9} stroke="#fff" strokeWidth={2} />
      <rect x={sx(q.q1)} y={y - 16} width={Math.max(sx(q.q3) - sx(q.q1), 1)} height={32} fill="rgba(0,187,249,0.25)" stroke={BLUE} strokeWidth={2} />
      <line x1={sx(q.q2)} y1={y - 16} x2={sx(q.q2)} y2={y + 16} stroke={GOLD} strokeWidth={3} />
      {outliers.map((o, i) => (
        <circle key={i} cx={sx(o)} cy={y} r={6} fill="none" stroke={PINK} strokeWidth={2.5} />
      ))}
    </g>
  );
}

export function BoxPlot() {
  const [n, setN] = useState(11);
  const data = BOX_DATA.slice(0, n);
  const q = quartiles(data);
  const h = Math.floor(n / 2);
  const x0 = 20;
  const x1 = 340;
  const sx = (v: number) => x0 + (v / 20) * (x1 - x0);
  const color = (i: number) => (n % 2 && i === h ? GOLD : i < h ? BLUE : PINK);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 200" className="area-svg" style={{ maxWidth: 440 }}>
        {data.map((v, i) => (
          <circle key={i} cx={sx(v)} cy={40} r={8} fill={color(i)} />
        ))}
        <Label x={20} y={14} color={BLUE} size={11} anchor="start">前半</Label>
        <Label x={340} y={14} color={PINK} size={11} anchor="end">後半</Label>
        {(['q1', 'q2', 'q3'] as const).map((k, i) => (
          <g key={k}>
            <line x1={sx(q[k])} y1={52} x2={sx(q[k])} y2={92} stroke={GOLD} strokeDasharray="3 3" />
            <Label x={sx(q[k])} y={66 + (i % 2) * 14} color={GOLD} size={10}>
              {['Q1', 'Q2', 'Q3'][i]}={nice(q[k], 1)}
            </Label>
          </g>
        ))}
        <BoxPlotSvg q={q} y={110} sx={sx} />
        <Axis x0={x0} x1={x1} y={150} from={0} to={20} step={2} />
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{最小 } ${q.min},\\ Q_1 = ${nice(q.q1)},\\ Q_2 = ${nice(q.q2)},\\ Q_3 = ${nice(q.q3)},\\ \\text{最大 } ${q.max}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{四分位範囲} = Q_3 - Q_1 = ${nice(q.q3 - q.q1)}`}</Tex>
      </div>
      <Toggle
        label="データの個数"
        value={n}
        onChange={setN}
        options={[8, 9, 10, 11].map((v) => ({ v, text: `${v}個` }))}
      />
      <p className="figure-note">小さい順にならべて、まん中（中央値 Q2）で前半と後半に分ける。前半のまん中が Q1、後半のまん中が Q3。個数が奇数のときは、中央値（金色）はどちらにも入れない。</p>
    </div>
  );
}

// ---------- 4. 外れ値 ----------

export function Outlier() {
  const [x, setX] = useState(24);
  const data = [12, 14, 15, 15, 16, 17, 18, 18, 19, 20, x];
  const q = quartiles(data);
  const iqr = q.q3 - q.q1;
  const loF = q.q1 - 1.5 * iqr;
  const hiF = q.q3 + 1.5 * iqr;
  const out = data.filter((v) => v <= loF || v >= hiF);
  const inside = data.filter((v) => v > loF && v < hiF);
  const x0 = 20;
  const x1 = 340;
  const sx = (v: number) => x0 + ((v - 5) / 35) * (x1 - x0);
  const isOut = x >= hiF;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 190" className="area-svg" style={{ maxWidth: 440 }}>
        {stack(data).map(({ v, k, i }) => (
          <circle key={i} cx={sx(v)} cy={40 - k * 14} r={6} fill={i === 10 ? PINK : '#f8f9fa'} />
        ))}
        <rect x={sx(Math.max(loF, 5))} y={60} width={sx(Math.min(hiF, 40)) - sx(Math.max(loF, 5))} height={70} fill="rgba(6,214,160,0.12)" />
        <line x1={sx(hiF)} y1={55} x2={sx(hiF)} y2={135} stroke={GREEN} strokeWidth={2} strokeDasharray="5 3" />
        <Label x={Math.min(sx(hiF), 320)} y={146} color={GREEN} size={10}>Q3+1.5×IQR = {nice(hiF, 2)}</Label>
        <BoxPlotSvg q={q} y={95} sx={sx} lowW={Math.min(...inside)} highW={Math.max(...inside)} outliers={out} />
        <Axis x0={x0} x1={x1} y={160} from={5} to={40} step={5} label="年れい（才）" />
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`Q_1 = ${nice(q.q1)},\\ Q_3 = ${nice(q.q3)},\\ Q_3 - Q_1 = ${nice(iqr)}`}</Tex>
      </div>
      <div className="area-formula small-formula" style={{ color: isOut ? PINK : GREEN }}>
        {isOut ? `${x} は ${nice(hiF, 2)} 以上なので「外れ値」。箱ひげ図では ○ で別にかく。` : `${x} は ${nice(hiF, 2)} より小さいので、外れ値ではない。`}
      </div>
      <div className="sliders">
        <Slider label="ピンクの人の年れい" value={x} min={20} max={40} onChange={setX} color={PINK} />
      </div>
      <p className="figure-note">箱の長さ（四分位範囲）の 1.5 倍より外にはみ出した値を「外れ値」とよぶ。入力ミスや、特別な事情がないかを調べるきっかけになる。</p>
    </div>
  );
}

// ---------- 5. 分散と標準偏差 ----------

export function Variance() {
  const [k, setK] = useState(10);
  const center = 10;
  const devs = [-4, -2, 0, 1, 5];
  const data = devs.map((d) => center + (d * k) / 10);
  const v = variance(data);
  const s = sd(data);
  const x0 = 20;
  const x1 = 340;
  const U = (x1 - x0) / 20;
  const sx = (val: number) => x0 + val * U;
  const base = 170;
  const colors = [BLUE, PURPLE, GREEN, GOLD, PINK];
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 440 }}>
        {/* 大きい正方形を先にかいて、小さい正方形が上に見えるようにする */}
        {data
          .map((d, i) => ({ d, i, dev: d - center }))
          .sort((a, b) => Math.abs(b.dev) - Math.abs(a.dev))
          .map(({ d, i, dev }) => {
            const side = Math.abs(dev) * U;
            if (side < 1) return null;
            const x = dev < 0 ? sx(d) : sx(center);
            return (
              <g key={i}>
                <rect x={x} y={base - side} width={side} height={side} fill={colors[i]} fillOpacity={0.12} stroke={colors[i]} strokeWidth={2.5} />
                {side >= 16 && (
                  <Label x={dev < 0 ? x + 9 : x + side - 9} y={base - side + 9} color={colors[i]} size={10}>
                    {nice(dev * dev, 1)}
                  </Label>
                )}
              </g>
            );
          })}
        <line x1={sx(center)} y1={20} x2={sx(center)} y2={base} stroke={GOLD} strokeWidth={2} strokeDasharray="4 3" />
        <Label x={sx(center)} y={12} color={GOLD} size={11}>平均 {center}</Label>
        {data.map((d, i) => (
          <circle key={i} cx={sx(d)} cy={base} r={6} fill={colors[i]} />
        ))}
        <Axis x0={x0} x1={x1} y={base + 8} from={0} to={20} step={2} />
      </svg>
      <div className="area-formula small-formula">
        偏差：{data.map((d) => nice(d - center, 1)).join('、')}（正方形の数字は偏差の 2 乗）
      </div>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: PURPLE }}>
          <span>分散（正方形の面積の平均）</span>
          <strong>{nice(v, 2)}</strong>
        </div>
        <div style={{ borderColor: GREEN }}>
          <span>標準偏差 √分散</span>
          <strong>{nice(s, 2)}</strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="ちらばり具合" value={k} min={0} max={20} onChange={setK} color={PURPLE} />
      </div>
      <p className="figure-note">平均からのずれ（偏差）を 1 辺とする正方形をつくり、その面積の平均が「分散」。もとの単位にもどすため √ をとったのが「標準偏差」。データが平均のまわりに集まるほど小さくなる。</p>
    </div>
  );
}

// ---------- 6. 変量の変換 y = ax + b ----------

const TX = [3, 5, 6, 7, 9];

export function Transform() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(5);
  const ys = TX.map((x) => a * x + b);
  const x0 = 20;
  const x1 = 340;
  const sx = (v: number) => x0 + ((v + 40) / 80) * (x1 - x0);
  const mx = mean(TX);
  const my = mean(ys);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 200" className="area-svg" style={{ maxWidth: 440 }}>
        <Label x={x0} y={22} color={BLUE} anchor="start">x</Label>
        <line x1={x0} y1={50} x2={x1} y2={50} stroke="var(--line)" />
        {TX.map((x, i) => (
          <circle key={i} cx={sx(x)} cy={50} r={6} fill={BLUE} />
        ))}
        <polygon points={`${sx(mx)},${58} ${sx(mx) - 6},${68} ${sx(mx) + 6},${68}`} fill={GOLD} />
        <Label x={x0} y={100} color={PINK} anchor="start">y = ax + b</Label>
        <line x1={x0} y1={128} x2={x1} y2={128} stroke="var(--line)" />
        {TX.map((x, i) => (
          <line key={i} x1={sx(x)} y1={56} x2={sx(ys[i])} y2={122} stroke="var(--muted)" strokeWidth={0.8} strokeDasharray="2 3" />
        ))}
        {ys.map((y, i) => (
          <circle key={i} cx={sx(y)} cy={128} r={6} fill={PINK} />
        ))}
        <polygon points={`${sx(my)},${136} ${sx(my) - 6},${146} ${sx(my) + 6},${146}`} fill={GOLD} />
        <Axis x0={x0} x1={x1} y={162} from={-40} to={40} step={10} />
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\bar{y} = a\\bar{x} + b = ${a} \\times ${mx} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${nice(my)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`s_y = |a|\\,s_x = ${Math.abs(a)} \\times 2 = ${nice(Math.abs(a) * 2)},\\quad s_y^2 = a^2 s_x^2 = ${nice(a * a * 4)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="a（何倍）" value={a} min={-3} max={3} step={0.5} onChange={setA} color={PINK} />
        <Slider label="b（いくつたす）" value={b} min={-10} max={10} onChange={setB} color={GREEN} />
      </div>
      <p className="figure-note">x のデータは平均 6、標準偏差 2。b をたすと全体が横にずれるだけで、ちらばりは変わらない。a 倍すると、ちらばりも |a| 倍になる。</p>
    </div>
  );
}

// ---------- 7. 散布図と相関係数 ----------

// 決まった乱数（毎回同じ点の配置になるように）
const RAW = Array.from({ length: 24 }, (_, i) => {
  const r1 = Math.sin(i * 12.9898 + 1.3) * 43758.5453;
  const r2 = Math.sin(i * 78.233 + 4.1) * 12543.1234;
  return [r1 - Math.floor(r1), r2 - Math.floor(r2)];
});

function standardize(v: number[]): number[] {
  const m = mean(v);
  const s = sd(v);
  return v.map((x) => (x - m) / s);
}

const SX = standardize(RAW.map((p) => p[0]));
// x と無関係な成分（x との相関を 0 にしてから標準化）
const SZ = (() => {
  const z = standardize(RAW.map((p) => p[1]));
  const c = mean(z.map((v, i) => v * SX[i]));
  return standardize(z.map((v, i) => v - c * SX[i]));
})();

function corrWord(r: number): string {
  const a = Math.abs(r);
  if (a < 0.2) return 'ほとんど相関がない';
  const kind = r > 0 ? '正' : '負';
  if (a < 0.4) return `弱い${kind}の相関`;
  if (a < 0.7) return `${kind}の相関`;
  return `強い${kind}の相関`;
}

export function Scatter() {
  const [r10, setR10] = useState(7);
  const target = r10 / 10;
  const ys = SX.map((x, i) => target * x + Math.sqrt(1 - target * target) * SZ[i]);
  const r = correlation(SX, ys);
  const ox = 180;
  const oy = 110;
  const UX = 82;
  const UY = 52;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 220" className="area-svg" style={{ maxWidth: 420 }}>
        <rect x={ox} y={10} width={150} height={100} fill="rgba(6,214,160,0.08)" />
        <rect x={30} y={110} width={150} height={100} fill="rgba(6,214,160,0.08)" />
        <rect x={30} y={10} width={150} height={100} fill="rgba(241,91,181,0.08)" />
        <rect x={ox} y={110} width={150} height={100} fill="rgba(241,91,181,0.08)" />
        <line x1={30} y1={oy} x2={330} y2={oy} stroke={GOLD} strokeDasharray="4 3" />
        <line x1={ox} y1={10} x2={ox} y2={210} stroke={GOLD} strokeDasharray="4 3" />
        <Label x={326} y={oy - 10} color={GOLD} size={10} anchor="end">y の平均</Label>
        <Label x={ox + 4} y={18} color={GOLD} size={10} anchor="start">x の平均</Label>
        {SX.map((x, i) => {
          const px = ox + Math.max(-1.8, Math.min(1.8, x)) * UX;
          const py = oy - Math.max(-1.9, Math.min(1.9, ys[i])) * UY;
          const pos = x * ys[i] > 0;
          return <circle key={i} cx={px} cy={py} r={5} fill={pos ? GREEN : PINK} />;
        })}
        <Label x={340} y={oy + 12} color="var(--muted)" size={10} anchor="end">日照時間 →</Label>
        <Label x={34} y={18} color="var(--muted)" size={10} anchor="start">↑ 収穫量</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`r = ${nice(r, 2)}`}</Tex>
        <span style={{ marginLeft: 8, fontWeight: 800 }}>（{corrWord(r)}）</span>
      </div>
      <div className="sliders">
        <Slider label="相関の強さ ×0.1" value={r10} min={-10} max={10} onChange={setR10} color={GREEN} />
      </div>
      <p className="figure-note">緑の点（右上・左下）は r をプラスに、ピンクの点（左上・右下）はマイナスに引っぱる。r は −1 から 1 のあいだで、±1 に近いほど点が直線にならぶ。</p>
    </div>
  );
}

// ---------- 8. 仮説検定の考え方 ----------

export function Hypothesis() {
  const [k, setK] = useState(15);
  const n = 20;
  const p = binomTail(n, k);
  const maxP = binom(n, 10);
  const x0 = 24;
  const x1 = 340;
  const base = 160;
  const bw = (x1 - x0) / (n + 1);
  const rare = p <= 0.05;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 200" className="area-svg" style={{ maxWidth: 440 }}>
        {Array.from({ length: n + 1 }, (_, j) => {
          const h = (binom(n, j) / maxP) * 130;
          return (
            <g key={j}>
              <rect x={x0 + j * bw + 1} y={base - h} width={bw - 2} height={h} fill={j >= k ? PINK : PURPLE} opacity={j >= k ? 0.95 : 0.5} />
              {j % 2 === 0 && (
                <text x={x0 + j * bw + bw / 2} y={base + 13} fontSize={10} fill="var(--muted)" textAnchor="middle">
                  {j}
                </text>
              )}
            </g>
          );
        })}
        <line x1={x0} y1={base} x2={x1} y2={base} stroke="var(--muted)" />
        <Label x={x1} y={base + 28} color="var(--muted)" size={10} anchor="end">20 人中、新しいパンを選んだ人数</Label>
        <Label x={x0 + 4} y={14} color="var(--muted)" size={10} anchor="start">「おいしさが同じ」なら、何人になりやすい？</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`P(${k}\\text{ 人以上}) \\fallingdotseq ${(p * 100).toFixed(1)}\\%`}</Tex>
        <span style={{ marginLeft: 6 }}>（1000 回ためすと約 {Math.round(p * 1000)} 回）</span>
      </div>
      <div className="area-formula small-formula" style={{ color: rare ? PINK : GREEN }}>
        {rare ? '5% 以下 → 偶然とは考えにくい。「新しいパンの方が好まれる」と判断できる。' : '5% より大きい → 偶然でも起こりうる。「好まれる」とはいえない。'}
      </div>
      <div className="sliders">
        <Slider label="新しいパンを選んだ人数" value={k} min={10} max={20} onChange={setK} color={PINK} />
      </div>
      <p className="figure-note">「おいしさは同じ（どちらを選ぶかは半々）」と仮定したとき、結果がどれくらい「めずらしい」かを調べる。めずらしすぎるなら、仮定の方がまちがっていたと考える。</p>
    </div>
  );
}
