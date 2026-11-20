import { useState } from 'react';
import { nCr } from '../../engine/prob';
import { Tex } from '../RichText';
import { Curve, makePlane, nice, PlaneSvg, Pt, VLine } from './Plane';
import { Slider } from './Slider';
import { Toggle } from './StatsFigures';

// 数学Ⅱ「いろいろな式」「図形と方程式」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#9b5de5';

/** 係数つきの項を TeX に（1 は省略、符号つき） */
function term(c: number, body: string, first: boolean): string {
  if (c === 0) return '';
  const sign = c < 0 ? '-' : first ? '' : '+';
  const abs = Math.abs(c);
  return `${sign}${abs === 1 && body ? '' : nice(abs, 2)}${body}`;
}
function polyTex(cs: number[], v = 'x'): string {
  // cs[i] は v^i の係数（高い次数から並べる）
  let s = '';
  for (let i = cs.length - 1; i >= 0; i--) {
    const body = i === 0 ? '' : i === 1 ? v : `${v}^{${i}}`;
    const t = term(cs[i], body, s === '');
    s += t;
  }
  return s || '0';
}

// ---------- 1. 二項定理 ----------

/** a^0 は消す、a^1 は a と書く */
const pw = (v: string, e: number) => (e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`);

export function Binomial() {
  const [n, setN] = useState(4);
  const [k0, setK] = useState(1);
  const k = Math.min(k0, n);
  const terms = Array.from({ length: n + 1 }, (_, j) => {
    const c = nCr(n, j);
    const a = n - j === 0 ? '' : n - j === 1 ? 'a' : `a^{${n - j}}`;
    const b = j === 0 ? '' : j === 1 ? 'b' : `b^{${j}}`;
    const body = `${c === 1 ? '' : c}${a}${b}`;
    return j === k ? `\\color{${PINK}}{${body}}` : body;
  });
  const w = Math.min(46, 330 / n);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 90" className="area-svg" style={{ maxWidth: 440 }}>
        {Array.from({ length: n }, (_, i) => {
          const x = 180 - (n * w) / 2 + i * w;
          const pickB = i >= n - k;
          return (
            <g key={i}>
              <rect x={x + 2} y={20} width={w - 4} height={36} rx={8} fill={pickB ? 'rgba(241,91,181,0.25)' : 'rgba(0,187,249,0.2)'} stroke={pickB ? PINK : BLUE} strokeWidth={2} />
              <text x={x + w / 2} y={43} fill={pickB ? PINK : BLUE} fontSize={w > 36 ? 16 : 12} fontWeight={800} textAnchor="middle">{pickB ? 'b' : 'a'}</text>
            </g>
          );
        })}
        <text x={180} y={76} fill="var(--muted)" fontSize={11} textAnchor="middle">{n} 個の (a + b) から、b を {k} 個選ぶ</text>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`(a + b)^{${n}} = ${terms.join(' + ')}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{{}_{${n}}\\mathrm{C}_{${k}}\\, a^{${n - k}} b^{${k}} = ${nCr(n, k)}${pw('a', n - k)}${pw('b', k)}}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="n（何乗）" value={n} min={1} max={7} onChange={setN} color={PURPLE} />
        <Slider label="b を選ぶ個数" value={k} min={0} max={n} onChange={setK} color={PINK} />
      </div>
      <p className="figure-note">(a + b) を n 個かけるとき、それぞれのかっこから a か b を 1 つ選んでかける。b を k 個選ぶ選び方は nCk 通りなので、a^(n−k) b^k の係数は nCk になる。</p>
    </div>
  );
}

// ---------- 2. 相加平均と相乗平均 ----------

export function AmGm() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(2);
  const am = (a + b) / 2;
  const gm = Math.sqrt(a * b);
  const S = 18;
  const ox = 40;
  const oy = 190;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 420 }}>
        <rect x={ox} y={oy - am * S} width={am * S} height={am * S} fill="rgba(255,209,102,0.15)" stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />
        <rect x={ox} y={oy - b * S} width={a * S} height={b * S} fill="rgba(0,187,249,0.3)" stroke={BLUE} strokeWidth={2.5} />
        <text x={ox + (a * S) / 2} y={oy + 14} fill={BLUE} fontSize={11} fontWeight={800} textAnchor="middle">a = {a}</text>
        <text x={ox - 6} y={oy - (b * S) / 2} fill={BLUE} fontSize={11} fontWeight={800} textAnchor="end">b = {b}</text>
        <text x={ox + am * S + 4} y={oy - am * S + 12} fill={GOLD} fontSize={11} fontWeight={800}>正方形（1 辺 {nice(am, 1)}）</text>
      </svg>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: GOLD }}>
          <span>相加平均 (a+b)/2</span>
          <strong>{nice(am, 2)}</strong>
        </div>
        <div style={{ borderColor: BLUE }}>
          <span>相乗平均 √ab</span>
          <strong>{nice(gm, 2)}</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{面積：長方形 } ab = ${a * b} \\ \\le\\ \\text{正方形 } \\left(\\dfrac{a + b}{2}\\right)^2 = ${nice(am * am, 2)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="a" value={a} min={1} max={9} onChange={setA} color={BLUE} />
        <Slider label="b" value={b} min={1} max={9} onChange={setB} color={BLUE} />
      </div>
      <p className="figure-note">まわりの長さが同じなら、長方形より正方形の方が面積が大きい。だから (a + b) ÷ 2 ≧ √(ab)。a と b が等しい（正方形になる）ときだけ等号が成り立つ。</p>
    </div>
  );
}

// ---------- 3. 2 次方程式と虚数解 ----------

export function ComplexRoots() {
  const [b, setB] = useState(-2);
  const [c, setC] = useState(5);
  const D = b * b - 4 * c;
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -4, ymax: 10, h: 240 });
  const f = (x: number) => x * x + b * x + c;
  const re = -b / 2;
  const im = Math.sqrt(Math.abs(D)) / 2;
  const sq = Math.abs(D);
  const sqTex = Number.isInteger(Math.sqrt(sq)) ? String(Math.sqrt(sq)) : `\\sqrt{${sq}}`;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color={D < 0 ? PINK : BLUE} />
        {D >= 0 && <Pt p={p} x={re - im} y={0} color={GOLD} />}
        {D > 0 && <Pt p={p} x={re + im} y={0} color={GOLD} />}
        <Pt p={p} x={re} y={f(re)} color="#fff" r={3} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`${polyTex([c, b, 1])} = 0,\\quad D = ${b < 0 ? `(${b})` : b}^2 - 4 \\cdot ${c < 0 ? `(${c})` : c} = ${D}`}</Tex>
      </div>
      <div className="area-formula small-formula" style={{ color: D < 0 ? PINK : GOLD }}>
        <Tex>{D > 0 ? `x = \\dfrac{${-b} \\pm ${sqTex}}{2}\\ (\\text{異なる 2 つの実数解})` : D === 0 ? `x = ${nice(re)}\\ (\\text{重解})` : `x = \\dfrac{${-b} \\pm ${sqTex}\\,i}{2} = ${nice(re, 2)} \\pm ${nice(im, 2)}\\,i\\ (\\text{虚数解})`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="b（x の係数）" value={b} min={-6} max={6} onChange={setB} />
        <Slider label="c（定数項）" value={c} min={-4} max={10} onChange={setC} color={PINK} />
      </div>
      <p className="figure-note">グラフが x 軸と交わらない（D &lt; 0）とき、実数の解はない。でも i² = −1 となる数 i を使えば、解は「実部 ± 虚部 i」の形で表せる。実部は、グラフの頂点の x 座標と同じ。</p>
    </div>
  );
}

// ---------- 4. 解と係数の関係 ----------

export function Vieta() {
  const [al, setAl] = useState(-1);
  const [be, setBe] = useState(3);
  const p = makePlane({ xmin: -5, xmax: 5, ymin: -8, ymax: 8, h: 240 });
  const s = al + be;
  const q = al * be;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => (x - al) * (x - be)} color={BLUE} />
        <Pt p={p} x={al} y={0} color={PINK} label="α" dy={16} />
        <Pt p={p} x={be} y={0} color={GOLD} label="β" dy={16} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`(x - \\alpha)(x - \\beta) = x^2 - (\\alpha + \\beta)x + \\alpha\\beta = ${polyTex([q, -s, 1])}`}</Tex>
      </div>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: PINK }}>
          <span>2 つの解の和 α + β</span>
          <strong>{s}</strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>2 つの解の積 αβ</span>
          <strong>{q}</strong>
        </div>
      </div>
      <div className="sliders">
        <Slider label="α" value={al} min={-4} max={4} onChange={setAl} color={PINK} />
        <Slider label="β" value={be} min={-4} max={4} onChange={setBe} color={GOLD} />
      </div>
      <p className="figure-note">解が α、β の 2 次方程式は (x − α)(x − β) = 0。展開すると、x の係数に「−（和）」、定数項に「積」があらわれる。解を求めなくても、和と積は係数からすぐわかる。</p>
    </div>
  );
}

// ---------- 5. 剰余の定理・因数定理 ----------

export function Remainder() {
  const [a, setA] = useState(2);
  const P = (x: number) => x ** 3 - 2 * x * x - 5 * x + 6;
  const p = makePlane({ xmin: -4, xmax: 5, ymin: -12, ymax: 14, h: 250 });
  const r = P(a);
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={P} color={BLUE} />
        <VLine p={p} x={a} color={GOLD} />
        <line x1={p.X(a)} y1={p.Y(0)} x2={p.X(a)} y2={p.Y(r)} stroke={r === 0 ? GREEN : PINK} strokeWidth={4} />
        <Pt p={p} x={a} y={r} color={r === 0 ? GREEN : PINK} label={`P(${nice(a)}) = ${nice(r)}`} dy={r >= 0 ? -10 : 18} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`P(x) = x^3 - 2x^2 - 5x + 6 \\text{ を } x ${a < 0 ? '+' : '-'} ${nice(Math.abs(a))} \\text{ で割った余り} = P(${nice(a)}) = ${nice(r)}`}</Tex>
      </div>
      <div className="area-formula small-formula" style={{ color: r === 0 ? GREEN : 'inherit' }}>
        {r === 0 ? `余りが 0 → P(x) は x ${a < 0 ? '+' : '−'} ${Math.abs(a)} で割り切れる（因数定理）。グラフは x 軸と交わる。` : '余りは、グラフの高さ P(a) と同じ。'}
      </div>
      <div className="sliders">
        <Slider label="a（x − a で割る）" value={a} min={-3} max={4} step={0.5} onChange={setA} color={GOLD} />
      </div>
      <p className="figure-note">P(x) = (x − a)Q(x) + R の x に a を入れると、(x − a) が 0 になって R だけが残る。だから余りは P(a)。a を 1、−2、3 にすると余りが 0 になり、P(x) = (x − 1)(x + 2)(x − 3) と因数分解できる。</p>
    </div>
  );
}

// ---------- 6. 内分点・外分点 ----------

export function DivPoint() {
  const [m, setM] = useState(2);
  const [n, setN] = useState(1);
  const [ext, setExt] = useState<'in' | 'ex'>('in');
  const A = [-3, -1];
  const B = [3, 2];
  const p = makePlane({ xmin: -8, xmax: 10, ymin: -6, ymax: 8, h: 240 });
  let Px = 0;
  let Py = 0;
  if (ext === 'in') {
    Px = (n * A[0] + m * B[0]) / (m + n);
    Py = (n * A[1] + m * B[1]) / (m + n);
  } else if (m !== n) {
    Px = (-n * A[0] + m * B[0]) / (m - n);
    Py = (-n * A[1] + m * B[1]) / (m - n);
  }
  const ok = ext === 'in' || m !== n;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {ok && <line x1={p.X(Math.min(A[0], B[0], Px))} y1={p.Y(A[1] + ((Math.min(A[0], B[0], Px) - A[0]) * (B[1] - A[1])) / (B[0] - A[0]))} x2={p.X(Math.max(A[0], B[0], Px))} y2={p.Y(A[1] + ((Math.max(A[0], B[0], Px) - A[0]) * (B[1] - A[1])) / (B[0] - A[0]))} stroke="var(--muted)" strokeDasharray="4 3" />}
        <line x1={p.X(A[0])} y1={p.Y(A[1])} x2={p.X(B[0])} y2={p.Y(B[1])} stroke={BLUE} strokeWidth={3} />
        <Pt p={p} x={A[0]} y={A[1]} color={BLUE} label="A(−3, −1)" dy={18} />
        <Pt p={p} x={B[0]} y={B[1]} color={BLUE} label="B(3, 2)" dy={-10} />
        {ok && <Pt p={p} x={Px} y={Py} color={PINK} label="P" dy={-10} />}
      </PlaneSvg>
      <div className="area-formula small-formula">
        {ok ? (
          <Tex>{ext === 'in' ? `P\\left(\\dfrac{${n} \\cdot (-3) + ${m} \\cdot 3}{${m} + ${n}},\\ \\dfrac{${n} \\cdot (-1) + ${m} \\cdot 2}{${m} + ${n}}\\right) = (${nice(Px, 2)},\\ ${nice(Py, 2)})` : `P\\left(\\dfrac{-${n} \\cdot (-3) + ${m} \\cdot 3}{${m} - ${n}},\\ \\dfrac{-${n} \\cdot (-1) + ${m} \\cdot 2}{${m} - ${n}}\\right) = (${nice(Px, 2)},\\ ${nice(Py, 2)})`}</Tex>
        ) : (
          '外分では m と n が等しいと、点 P はできない（AB と平行に遠くへ行ってしまう）。'
        )}
      </div>
      <Toggle
        label="分け方"
        value={ext}
        onChange={setExt}
        options={[
          { v: 'in', text: '内分' },
          { v: 'ex', text: '外分' },
        ]}
      />
      <div className="sliders">
        <Slider label="m（A 側の比）" value={m} min={1} max={5} onChange={setM} color={PINK} />
        <Slider label="n（B 側の比）" value={n} min={1} max={5} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">内分は AB の間を m : n に分ける点。外分は AB の延長上で、A からと B からの距離の比が m : n になる点。外分の公式は、内分の公式の n を −n にかえたもの。</p>
    </div>
  );
}

// ---------- 7. 直線の方程式と点と直線の距離 ----------

export function LineEq() {
  const [m2, setM2] = useState(1);
  const [k, setK] = useState(-1);
  const m = m2 / 2;
  const P = [-2, 4];
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -5, ymax: 7, h: 250 });
  // 直線 mx − y + k = 0
  const d = Math.abs(m * P[0] - P[1] + k) / Math.sqrt(m * m + 1);
  const t = (P[0] + m * (P[1] - k)) / (1 + m * m);
  const H = [t, m * t + k];
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => m * x + k} color={BLUE} />
        {m !== 0 && <Curve p={p} f={(x) => (-1 / m) * (x - P[0]) + P[1]} color={GOLD} width={1.5} dash="5 4" />}
        <line x1={p.X(P[0])} y1={p.Y(P[1])} x2={p.X(H[0])} y2={p.Y(H[1])} stroke={PINK} strokeWidth={3} />
        <Pt p={p} x={P[0]} y={P[1]} color={PINK} label="P(−2, 4)" />
        <Pt p={p} x={H[0]} y={H[1]} color={GOLD} r={4} label="H" dy={16} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{直線：} y = ${polyTex([k, m])},\\quad \\text{垂直な直線の傾き } ${m === 0 ? '\\text{（なし：たての線）}' : nice(-1 / m, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`d = \\dfrac{|${nice(m, 2)} \\cdot (-2) - 4 ${k < 0 ? '-' : '+'} ${Math.abs(k)}|}{\\sqrt{${nice(m, 2)}^2 + 1}} \\fallingdotseq ${nice(d, 2)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="傾き ×0.5" value={m2} min={-6} max={6} onChange={setM2} color={BLUE} />
        <Slider label="y 切片" value={k} min={-4} max={5} onChange={setK} color={BLUE} />
      </div>
      <p className="figure-note">点 P から直線への最短距離は、垂直に下ろした線分 PH の長さ。直線を ax + by + c = 0 の形にすれば、公式 d ＝ |ax₀ + by₀ + c| ÷ √(a² + b²) で一発で求められる。垂直な 2 直線は、傾きの積が −1。</p>
    </div>
  );
}

// ---------- 8. 円と直線 ----------

export function CircleLine() {
  const [r, setR] = useState(3);
  const [m2, setM2] = useState(-1);
  const [k, setK] = useState(4);
  const m = m2 / 2;
  const C = [1, 1];
  const p = makePlane({ xmin: -6, xmax: 7, ymin: -5, ymax: 7, h: 260 });
  const d = Math.abs(m * C[0] - C[1] + k) / Math.sqrt(m * m + 1);
  const eps = 0.02;
  const kind = d < r - eps ? 2 : Math.abs(d - r) <= eps ? 1 : 0;
  // 交点（x の 2 次方程式）
  const A2 = 1 + m * m;
  const B2 = 2 * (m * (k - C[1]) - C[0]);
  const C2 = C[0] * C[0] + (k - C[1]) ** 2 - r * r;
  const disc = B2 * B2 - 4 * A2 * C2;
  const xs = disc >= 0 ? [(-B2 - Math.sqrt(Math.max(0, disc))) / (2 * A2), (-B2 + Math.sqrt(Math.max(0, disc))) / (2 * A2)] : [];
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <circle cx={p.X(C[0])} cy={p.Y(C[1])} r={p.X(r) - p.X(0)} fill="rgba(0,187,249,0.1)" stroke={BLUE} strokeWidth={2.5} />
        <Curve p={p} f={(x) => m * x + k} color={GOLD} />
        <Pt p={p} x={C[0]} y={C[1]} color={BLUE} r={3} />
        {kind > 0 && xs.map((x, i) => <Pt key={i} p={p} x={x} y={m * x + k} color={PINK} />)}
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`(x - 1)^2 + (y - 1)^2 = ${r * r},\\quad y = ${polyTex([k, m])}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{中心と直線の距離 } d \\fallingdotseq ${nice(d, 2)}\\ ${kind === 2 ? '<' : kind === 1 ? '=' : '>'}\\ r = ${r}`}</Tex>
        <span style={{ marginLeft: 6, fontWeight: 800, color: PINK }}>{['共有点なし', '接する（1 点）', '2 点で交わる'][kind]}</span>
      </div>
      <div className="sliders">
        <Slider label="円の半径 r" value={r} min={1} max={5} onChange={setR} color={BLUE} />
        <Slider label="直線の傾き ×0.5" value={m2} min={-6} max={6} onChange={setM2} color={GOLD} />
        <Slider label="直線の y 切片" value={k} min={-5} max={7} step={0.5} onChange={setK} color={GOLD} />
      </div>
      <p className="figure-note">円と直線の関係は、「中心から直線までの距離 d」と半径 r をくらべるだけでわかる。d &lt; r なら 2 点、d = r なら接する、d &gt; r なら共有点なし。連立して判別式を使う方法と同じ結果になる。</p>
    </div>
  );
}

// ---------- 9. 不等式の表す領域と最大・最小 ----------

const VERTS = [
  [0, 0],
  [4, 0],
  [3, 2],
  [0, 3.5],
];

export function Region() {
  const [a4, setA4] = useState(4);
  const [kk, setKk] = useState(4);
  const a = a4 / 4;
  const p = makePlane({ xmin: -1, xmax: 6, ymin: -1, ymax: 6, h: 260 });
  const vals = VERTS.map(([x, y]) => a * x + y);
  const best = vals.indexOf(Math.max(...vals));
  const maxV = vals[best];
  const poly = VERTS.map(([x, y]) => `${p.X(x)},${p.Y(y)}`).join(' ');
  const inside = kk <= maxV + 1e-9;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <polygon points={poly} fill="rgba(6,214,160,0.25)" stroke={GREEN} strokeWidth={2} />
        <Curve p={p} f={(x) => 8 - 2 * x} color="var(--muted)" width={1.2} dash="4 3" />
        <Curve p={p} f={(x) => (7 - x) / 2} color="var(--muted)" width={1.2} dash="4 3" />
        <Curve p={p} f={(x) => kk - a * x} color={inside ? GOLD : PINK} width={2.5} />
        {VERTS.map(([x, y], i) => (
          <Pt key={i} p={p} x={x} y={y} color={i === best ? GOLD : '#fff'} r={i === best ? 6 : 3.5} label={i === best ? `(${x}, ${y})` : undefined} />
        ))}
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`2x + y \\le 8,\\ x + 2y \\le 7,\\ x \\ge 0,\\ y \\ge 0`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`${a === 1 ? '' : nice(a, 2)}x + y = k\\ \\text{の最大値は、頂点 } (${VERTS[best][0]}, ${VERTS[best][1]}) \\text{ で } k = ${nice(maxV, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula" style={{ color: inside ? GOLD : PINK }}>
        {inside ? `直線（k = ${kk}）は領域と共有点をもつ` : `k = ${kk} では直線が領域から外れてしまう`}
      </div>
      <div className="sliders">
        <Slider label="k（直線をずらす）" value={kk} min={0} max={10} step={0.5} onChange={setKk} color={GOLD} />
        <Slider label="x の係数 ×0.25" value={a4} min={1} max={12} onChange={setA4} color={BLUE} />
      </div>
      <p className="figure-note">緑の部分が、4 つの不等式を同時にみたす点の集まり（領域）。直線 ax + y = k を k を大きくしながら平行にずらし、領域から離れる直前にふれる頂点で k が最大になる。</p>
    </div>
  );
}
