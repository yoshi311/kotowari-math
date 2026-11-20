import { useState } from 'react';
import { Tex } from '../RichText';
import { Curve, makePlane, nice, PlaneSvg, Pt, VLine } from './Plane';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 数学B「数列」「統計的な推測」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';

/** 正規分布の密度 */
const dens = (x: number, m = 0, s = 1) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
/** P(0 ≤ Z ≤ z)（シンプソン法） */
function phi0(z: number): number {
  if (z === 0) return 0;
  const n = 400;
  const h = z / n;
  let s = dens(0) + dens(z);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * dens(i * h);
  return (s * h) / 3;
}
/** 横に並んだ棒グラフ（値は 0 以上でも負でもよい） */
function Bars({ vals, colors, w = 340, h = 170, labels, zeroLine = 0, refLine }: { vals: number[]; colors: string[]; w?: number; h?: number; labels?: string[]; zeroLine?: number; refLine?: { v: number; color: string; text: string } }) {
  const hi = Math.max(0, ...vals, refLine?.v ?? 0);
  const lo = Math.min(0, ...vals, refLine?.v ?? 0);
  const top = 16;
  const bottom = h - 22;
  const Y = (v: number) => (hi === lo ? bottom : bottom - ((v - lo) / (hi - lo)) * (bottom - top));
  const bw = (w - 20) / vals.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="area-svg" style={{ maxWidth: 460 }}>
      <line x1={10} y1={Y(zeroLine)} x2={w - 10} y2={Y(zeroLine)} stroke="var(--muted)" strokeWidth={1.5} />
      {vals.map((v, i) => (
        <g key={i}>
          <rect x={10 + i * bw + bw * 0.12} y={Math.min(Y(v), Y(0))} width={bw * 0.76} height={Math.max(1, Math.abs(Y(v) - Y(0)))} rx={3} fill={colors[i % colors.length]} opacity={0.85} />
          {vals.length <= 12 && (
            <Label x={10 + i * bw + bw / 2} y={v >= 0 ? Y(v) - 4 : Y(v) + 12} color="#fff" size={10}>
              {nice(v, 2)}
            </Label>
          )}
          {labels && (
            <Label x={10 + i * bw + bw / 2} y={h - 6} color="var(--muted)" size={10}>
              {labels[i]}
            </Label>
          )}
        </g>
      ))}
      {refLine && (
        <g>
          <line x1={10} y1={Y(refLine.v)} x2={w - 10} y2={Y(refLine.v)} stroke={refLine.color} strokeWidth={2} strokeDasharray="6 4" />
          <Label x={12} y={Y(refLine.v) - 4} color={refLine.color} size={11} anchor="start">
            {refLine.text}
          </Label>
        </g>
      )}
    </svg>
  );
}

// ---------- 1. 等差数列と和 ----------

export function ArithSeq() {
  const [a1, setA1] = useState(2);
  const [d, setD] = useState(3);
  const [n, setN] = useState(6);
  const [mode, setMode] = useState<'one' | 'two'>('one');
  const terms = Array.from({ length: n }, (_, k) => a1 + k * d);
  const an = terms[n - 1];
  const W = 320;
  const H = 180;
  const total = a1 + an;
  const U = (H - 30) / (mode === 'two' ? total : an);
  const bw = W / n;
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${W + 20} ${H}`} className="area-svg" style={{ maxWidth: 460 }}>
        {terms.map((t, i) => {
          const x = 10 + i * bw;
          const rev = terms[n - 1 - i];
          return (
            <g key={i}>
              <rect x={x + 2} y={H - 18 - t * U} width={bw - 4} height={t * U} fill={BLUE} opacity={0.85} rx={3} />
              <Label x={x + bw / 2} y={H - 22 - t * U + (mode === 'two' ? t * U / 2 + 8 : 0)} color="#fff" size={11}>
                {t}
              </Label>
              {mode === 'two' && (
                <>
                  <rect x={x + 2} y={H - 18 - (t + rev) * U} width={bw - 4} height={rev * U} fill={PINK} opacity={0.8} rx={3} />
                  <Label x={x + bw / 2} y={H - 18 - (t + rev / 2) * U + 4} color="#fff" size={11}>
                    {rev}
                  </Label>
                </>
              )}
              <Label x={x + bw / 2} y={H - 4} color="var(--muted)" size={10}>{`a${i + 1}`}</Label>
            </g>
          );
        })}
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`a_n = ${a1} + (n - 1) \\times ${d},\\quad a_{${n}} = ${an}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{mode === 'two' ? `2S = ${n} \\times (${a1} + ${an}) = ${n * total}\\ \\Rightarrow\\ S = ${(n * total) / 2}` : `S = ${terms.join(' + ')} = ${(n * total) / 2}`}</Tex>
      </div>
      <Toggle label="見かた" options={[{ v: 'one', text: '1 列' }, { v: 'two', text: '逆向きに重ねる' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="初項 a₁" value={a1} min={1} max={6} onChange={setA1} color={BLUE} />
        <Slider label="公差 d" value={d} min={1} max={4} onChange={setD} color={GREEN} />
        <Slider label="項の数 n" value={n} min={3} max={10} onChange={setN} color={GOLD} />
      </div>
      <p className="figure-note">等差数列は、同じ数（公差）ずつ増える列。逆向きに並べた列（桃色）を重ねると、どの列も「初項 + 末項」の同じ高さになる。だから和は、n ×（初項 + 末項）÷ 2。</p>
    </div>
  );
}

// ---------- 2. 等比数列と和 ----------

export function GeoSeq() {
  const [r, setR] = useState<'2' | '3' | 'h'>('2');
  const [a, setA] = useState(1);
  const [n, setN] = useState(5);
  const rv = r === 'h' ? 0.5 : +r;
  const rTex = r === 'h' ? '\\frac{1}{2}' : r;
  const terms = Array.from({ length: n }, (_, k) => a * rv ** k);
  const S = terms.reduce((s, t) => s + t, 0);
  return (
    <div className="figure">
      <Bars vals={terms} colors={[BLUE, GREEN]} labels={terms.map((_, i) => `a${i + 1}`)} />
      <div className="area-formula small-formula">
        <Tex>{`\\begin{array}{rcl} S &=& a + ar + ar^2 + \\cdots + ar^{n-1} \\\\ rS &=& \\phantom{a + {}} ar + ar^2 + \\cdots + ar^{n-1} + ar^n \\\\ \\hline S - rS &=& a - ar^n \\end{array}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`S_{${n}} = ${terms.map((t) => nice(t, 4)).join(' + ')} = ${nice(S, 4)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\dfrac{a(1 - r^n)}{1 - r} = \\dfrac{${a}\\left\\{1 - ${r === 'h' ? `\\left(${rTex}\\right)` : rTex}^{${n}}\\right\\}}{1 - ${rTex}} = ${nice(S, 4)}`}</Tex>
      </div>
      <Toggle label="公比 r" options={[{ v: '2', text: '2' }, { v: '3', text: '3' }, { v: 'h', text: '1/2' }]} value={r} onChange={setR} />
      <div className="sliders">
        <Slider label="初項 a" value={a} min={1} max={3} onChange={setA} color={BLUE} />
        <Slider label="項の数 n" value={n} min={2} max={7} onChange={setN} color={GOLD} />
      </div>
      <p className="figure-note">等比数列は、同じ数（公比）ずつかけていく列。S と rS を 1 つずらして並べると、まん中の項がすべて消えて、最初の a と最後の arⁿ だけが残る。これが和の公式のしくみ。</p>
    </div>
  );
}

// ---------- 3. Σ と和の公式 ----------

export function SigmaDots() {
  const [mode, setMode] = useState<'k' | 'odd'>('k');
  const [n, setN] = useState(5);
  const C = 22;
  const W = (n + 1) * C + 20;
  const H = n * C + 20;
  const dots = [];
  if (mode === 'k') {
    for (let row = 0; row < n; row++) {
      for (let col = 0; col <= n; col++) {
        const mine = col <= row; // 上から row 行目は row + 1 個
        dots.push(<circle key={`${row}-${col}`} cx={10 + col * C + C / 2} cy={10 + row * C + C / 2} r={C * 0.36} fill={mine ? BLUE : PINK} opacity={mine ? 0.95 : 0.7} />);
      }
    }
  } else {
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const layer = Math.max(row, col); // L 字の何番目か
        dots.push(<circle key={`${row}-${col}`} cx={10 + col * C + C / 2} cy={10 + row * C + C / 2} r={C * 0.36} fill={layer % 2 ? GOLD : GREEN} opacity={0.9} />);
      }
    }
  }
  const sum = mode === 'k' ? (n * (n + 1)) / 2 : n * n;
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${mode === 'k' ? W : W - C} ${H}`} className="area-svg" style={{ maxWidth: 300 }}>
        {dots}
      </svg>
      <div className="area-formula small-formula">
        <Tex>
          {mode === 'k'
            ? `\\sum_{k=1}^{${n}} k = ${Array.from({ length: n }, (_, i) => i + 1).join(' + ')} = \\dfrac{${n} \\times ${n + 1}}{2} = ${sum}`
            : `\\sum_{k=1}^{${n}} (2k - 1) = ${Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ')} = ${n}^2 = ${sum}`}
        </Tex>
      </div>
      <Toggle label="和" options={[{ v: 'k', text: '1 + 2 + … + n' }, { v: 'odd', text: '1 + 3 + 5 + …' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="n" value={n} min={1} max={10} onChange={setN} color={GOLD} />
      </div>
      <p className="figure-note">
        {mode === 'k'
          ? '青い点は上から 1 個、2 個、…、n 個。同じ形（桃色）を逆さに組み合わせると、たて n、よこ n + 1 の長方形になる。だから 1 から n までの和は n(n + 1) ÷ 2。'
          : '1、3、5、…と奇数を L 字の形で順に足していくと、いつも正方形になる。だから奇数を n 個足すと n²。'}
      </p>
    </div>
  );
}

// ---------- 4. 階差数列 ----------

export function DiffSeq() {
  const [a1, setA1] = useState(1);
  const [p, setP] = useState(2);
  const [q, setQ] = useState(0);
  const [k, setK] = useState(5);
  const b = (n: number) => p * n + q;
  const a = [a1];
  for (let i = 1; i < 6; i++) a.push(a[i - 1] + b(i));
  const W = 340;
  const cw = W / 6;
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${W} 120`} className="area-svg" style={{ maxWidth: 460 }}>
        <Label x={6} y={30} color={BLUE} size={11} anchor="start">aₙ</Label>
        <Label x={6} y={92} color={PINK} size={11} anchor="start">bₙ</Label>
        {a.map((v, i) => {
          const on = i < k;
          return (
            <g key={i}>
              <rect x={22 + i * cw * 0.94} y={14} width={cw * 0.7} height={26} rx={6} fill={i === k - 1 ? 'rgba(255,209,102,0.35)' : 'rgba(0,187,249,0.18)'} stroke={i === k - 1 ? GOLD : BLUE} strokeWidth={i === k - 1 ? 2.5 : 1.5} />
              <Label x={22 + i * cw * 0.94 + cw * 0.35} y={32} color="#fff" size={13}>{v}</Label>
              {i < 5 && (
                <g>
                  <line x1={22 + i * cw * 0.94 + cw * 0.5} y1={42} x2={22 + (i + 0.5) * cw * 0.94 + cw * 0.35} y2={74} stroke={on && i < k - 1 ? PINK : 'var(--line)'} strokeWidth={1.5} />
                  <line x1={22 + (i + 1) * cw * 0.94 + cw * 0.2} y1={42} x2={22 + (i + 0.5) * cw * 0.94 + cw * 0.35} y2={74} stroke={on && i < k - 1 ? PINK : 'var(--line)'} strokeWidth={1.5} />
                  <circle cx={22 + (i + 0.5) * cw * 0.94 + cw * 0.35} cy={88} r={14} fill={i < k - 1 ? 'rgba(241,91,181,0.35)' : 'rgba(255,255,255,0.06)'} stroke={PINK} strokeWidth={1.5} />
                  <Label x={22 + (i + 0.5) * cw * 0.94 + cw * 0.35} y={92} color="#fff" size={12}>{b(i + 1)}</Label>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`b_n = a_{n+1} - a_n = ${p === 1 ? '' : p}n${q === 0 ? '' : q > 0 ? ` + ${q}` : ` - ${-q}`}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{k === 1 ? `a_1 = ${a1}` : `a_{${k}} = a_1 + \\sum_{j=1}^{${k - 1}} b_j = ${a1} ${Array.from({ length: k - 1 }, (_, j) => (b(j + 1) < 0 ? `- ${-b(j + 1)}` : `+ ${b(j + 1)}`)).join(' ')} = ${a[k - 1]}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="初項 a₁" value={a1} min={-2} max={5} onChange={setA1} color={BLUE} />
        <Slider label="bₙ の係数" value={p} min={1} max={3} onChange={setP} color={PINK} />
        <Slider label="bₙ の定数" value={q} min={-2} max={3} onChange={setQ} color={PINK} />
        <Slider label="見る項 k" value={k} min={1} max={6} onChange={setK} color={GOLD} />
      </div>
      <p className="figure-note">となりどうしの差を並べた列を「階差数列」という。第 k 項は、初項に階差を k − 1 個足したもの。足す個数が k ではなく k − 1 なのがポイント。</p>
    </div>
  );
}

// ---------- 5. 漸化式 ----------

export function Recurrence() {
  const [p, setP] = useState<'2' | 'h' | 'm'>('h');
  const [q, setQ] = useState(3);
  const [a1, setA1] = useState(0);
  const pv = p === '2' ? 2 : p === 'h' ? 0.5 : -0.5;
  const pTex = p === '2' ? '2' : p === 'h' ? '\\frac{1}{2}' : '-\\frac{1}{2}';
  const al = q / (1 - pv);
  const a = [a1];
  for (let i = 1; i < 8; i++) a.push(pv * a[i - 1] + q);
  return (
    <div className="figure">
      <Bars vals={a} colors={[BLUE]} labels={a.map((_, i) => `a${i + 1}`)} refLine={{ v: al, color: GOLD, text: `α = ${nice(al, 2)}` }} />
      <div className="area-formula small-formula">
        <Tex>{`a_{n+1} = ${pTex}a_n ${q < 0 ? `- ${-q}` : `+ ${q}`},\\quad \\alpha = ${pTex}\\alpha ${q < 0 ? `- ${-q}` : `+ ${q}`}\\ \\Rightarrow\\ \\alpha = ${nice(al, 3)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`a_{n+1} - \\alpha = ${pTex}(a_n - \\alpha)`}</Tex>
      </div>
      <Toggle label="かける数 p" options={[{ v: 'h', text: '1/2' }, { v: 'm', text: '−1/2' }, { v: '2', text: '2' }]} value={p} onChange={setP} />
      <div className="sliders">
        <Slider label="足す数 q" value={q} min={-3} max={3} onChange={setQ} color={GREEN} />
        <Slider label="初項 a₁" value={a1} min={-4} max={6} onChange={setA1} color={BLUE} />
      </div>
      <p className="figure-note">漸化式は「前の項から次の項を作るルール」。α = pα + q となる数 α（金の線）を見つけると、α からのずれは毎回 p 倍になる。つまり「aₙ − α」は等比数列で、一般項が求められる。</p>
    </div>
  );
}

// ---------- 6. 確率変数と期待値・分散 ----------

const DISTS: Record<'die' | 'coin' | 'lot', { xs: number[]; ps: number[]; name: string }> = {
  die: { xs: [1, 2, 3, 4, 5, 6], ps: [1, 1, 1, 1, 1, 1].map((v) => v / 6), name: 'さいころの目' },
  coin: { xs: [0, 1, 2], ps: [0.25, 0.5, 0.25], name: 'コイン 2 枚の表の数' },
  lot: { xs: [0, 10, 50], ps: [0.6, 0.3, 0.1], name: 'くじの賞金' },
};

export function RandVar() {
  const [k, setK] = useState<'die' | 'coin' | 'lot'>('coin');
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const { xs, ps, name } = DISTS[k];
  const ys = xs.map((x) => a * x + b);
  const E = xs.reduce((s, x, i) => s + x * ps[i], 0);
  const V = xs.reduce((s, x, i) => s + (x - E) ** 2 * ps[i], 0);
  const EY = a * E + b;
  const VY = a * a * V;
  const lo = Math.min(...ys, 0) - 1;
  const hi = Math.max(...ys) + 1;
  const W = 340;
  const H = 170;
  const X = (v: number) => 20 + ((v - lo) / (hi - lo)) * (W - 40);
  const pm = Math.max(...ps);
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="area-svg" style={{ maxWidth: 460 }}>
        <line x1={14} y1={H - 30} x2={W - 14} y2={H - 30} stroke="var(--muted)" strokeWidth={2} />
        {/* 期待値はつりあいの点 */}
        <polygon points={`${X(EY)},${H - 30} ${X(EY) - 7},${H - 21} ${X(EY) + 7},${H - 21}`} fill={GOLD} />
        {ys.map((y, i) => (
          <g key={i}>
            <rect x={X(y) - 9} y={H - 30 - (ps[i] / pm) * 96} width={18} height={(ps[i] / pm) * 96} rx={3} fill={BLUE} opacity={0.85} />
            <Label x={X(y)} y={H - 35 - (ps[i] / pm) * 96} color="#fff" size={10}>{nice(ps[i], 3)}</Label>
            <Label x={X(y)} y={H - 16} color="#fff" size={10}>{nice(y, 2)}</Label>
          </g>
        ))}
        <line x1={X(EY - Math.sqrt(VY))} y1={22} x2={X(EY + Math.sqrt(VY))} y2={22} stroke={PINK} strokeWidth={3} />
        <Label x={X(EY)} y={14} color={PINK} size={10}>± 標準偏差</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`E(X) = ${nice(E, 3)},\\quad V(X) = ${nice(V, 3)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`Y = ${a === 1 ? '' : a}X ${b < 0 ? `- ${-b}` : b > 0 ? `+ ${b}` : ''}:\\ E(Y) = ${a === 1 ? '' : `${a} \\times `}${nice(E, 3)} ${b < 0 ? `- ${-b}` : b > 0 ? `+ ${b}` : ''} = ${nice(EY, 3)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`V(Y) = ${a}^2 \\times ${nice(V, 3)} = ${nice(VY, 3)}`}</Tex>
      </div>
      <Toggle label={name} options={[{ v: 'coin', text: 'コイン' }, { v: 'die', text: 'さいころ' }, { v: 'lot', text: 'くじ' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="何倍 a" value={a} min={1} max={3} onChange={setA} color={GREEN} />
        <Slider label="ずらす b" value={b} min={-3} max={3} onChange={setB} color={GREEN} />
      </div>
      <p className="figure-note">棒の高さが確率。期待値（金の三角）は、棒グラフがつりあう点で、「平均するとどのくらいか」を表す。a 倍すると期待値は a 倍、ちらばり（分散）は a² 倍。b ずらしても、ちらばりは変わらない。</p>
    </div>
  );
}

// ---------- 7. 二項分布 ----------

export function BinomDist() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [curve, setCurve] = useState<'off' | 'on'>('off');
  const pr: number[] = [];
  let c = 1;
  for (let k = 0; k <= n; k++) {
    pr.push(c * p ** k * (1 - p) ** (n - k));
    c = (c * (n - k)) / (k + 1);
  }
  const E = n * p;
  const V = n * p * (1 - p);
  const W = 340;
  const H = 180;
  const pm = Math.max(...pr, dens(E, E, Math.sqrt(V)));
  const bw = (W - 20) / (n + 1);
  const Y = (v: number) => H - 22 - (v / pm) * (H - 40);
  let path = '';
  if (curve === 'on') {
    for (let i = 0; i <= 120; i++) {
      const x = -0.5 + ((n + 1) * i) / 120;
      path += `${i === 0 ? 'M' : 'L'}${(10 + (x + 0.5) * bw).toFixed(1)} ${Y(dens(x, E, Math.sqrt(V))).toFixed(1)}`;
    }
  }
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="area-svg" style={{ maxWidth: 460 }}>
        <line x1={10} y1={H - 22} x2={W - 10} y2={H - 22} stroke="var(--muted)" strokeWidth={1.5} />
        {pr.map((v, k) => (
          <g key={k}>
            <rect x={10 + k * bw + bw * 0.1} y={Y(v)} width={bw * 0.8} height={H - 22 - Y(v)} fill={Math.abs(k - E) <= Math.sqrt(V) ? BLUE : 'rgba(0,187,249,0.45)'} rx={2} />
            {(n <= 20 || k % 5 === 0) && (
              <Label x={10 + (k + 0.5) * bw} y={H - 8} color="var(--muted)" size={9}>{k}</Label>
            )}
          </g>
        ))}
        <line x1={10 + (E + 0.5) * bw} y1={14} x2={10 + (E + 0.5) * bw} y2={H - 22} stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" />
        <Label x={10 + (E + 0.5) * bw} y={12} color={GOLD} size={10}>期待値</Label>
        {curve === 'on' && <path d={path} fill="none" stroke={PINK} strokeWidth={2.5} />}
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`B(${n},\\ ${p}):\\quad E(X) = np = ${nice(E, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`V(X) = np(1 - p) = ${nice(V, 3)},\\quad \\sigma(X) \\approx ${nice(Math.sqrt(V), 2)}`}</Tex>
      </div>
      <Toggle label="正規分布の曲線" options={[{ v: 'off', text: 'かくす' }, { v: 'on', text: '重ねる' }]} value={curve} onChange={setCurve} />
      <div className="sliders">
        <Slider label="回数 n" value={n} min={1} max={40} onChange={setN} color={BLUE} />
        <Slider label="確率 p" value={p} min={0.1} max={0.9} step={0.1} onChange={(v) => setP(Math.round(v * 10) / 10)} color={GREEN} />
      </div>
      <p className="figure-note">成功する確率 p の試行を n 回くり返したときの成功回数の分布が「二項分布」。山の中心（期待値）は np。n を大きくすると、山の形は左右対称なつりがねの形（正規分布）に近づいていく。</p>
    </div>
  );
}

// ---------- 8. 正規分布 ----------

export function Normal() {
  const [z, setZ] = useState(1);
  const [mode, setMode] = useState<'half' | 'both'>('half');
  const p = makePlane({ xmin: -3.6, xmax: 3.6, ymin: -0.04, ymax: 0.46, h: 220 });
  const a = mode === 'half' ? 0 : -z;
  const P = mode === 'half' ? phi0(z) : 2 * phi0(z);
  let d = `M${p.X(a)} ${p.Y(0)}`;
  for (let i = 0; i <= 60; i++) {
    const x = a + ((z - a) * i) / 60;
    d += ` L${p.X(x).toFixed(1)} ${p.Y(dens(x)).toFixed(1)}`;
  }
  d += ` L${p.X(z)} ${p.Y(0)} Z`;
  const m = 50;
  const s = 10;
  return (
    <div className="figure">
      <PlaneSvg p={p} xLabel="z" yLabel="">
        <path d={d} fill={GREEN} opacity={0.45} />
        <Curve p={p} f={(x) => dens(x)} color={BLUE} />
        <VLine p={p} x={z} color={PINK} dash="" />
        {mode === 'both' && <VLine p={p} x={-z} color={PINK} dash="" />}
      </PlaneSvg>
      <svg viewBox="0 0 340 26" className="area-svg" style={{ maxWidth: 460 }}>
        <Label x={8} y={16} color="var(--muted)" size={10} anchor="start">X</Label>
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <Label key={k} x={p.X(k)} y={16} color={GOLD} size={10}>{m + k * s}</Label>
        ))}
      </svg>
      <div className="area-formula small-formula">
        <Tex>{mode === 'half' ? `P(0 \\le Z \\le ${z}) \\approx ${P.toFixed(4)}` : `P(-${z} \\le Z \\le ${z}) \\approx ${P.toFixed(4)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`Z = \\dfrac{X - ${m}}{${s}}:\\quad X = ${nice(m + z * s, 1)} \\leftrightarrow Z = ${z}`}</Tex>
      </div>
      <Toggle label="ぬる範囲" options={[{ v: 'half', text: '0 〜 z' }, { v: 'both', text: '−z 〜 z' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="z" value={z} min={0} max={3} step={0.01} onChange={setZ} color={PINK} />
      </div>
      <p className="figure-note">標準正規分布 N(0, 1) の曲線の下の面積が確率で、全体は 1、左右半分ずつ 0.5。どんな正規分布も Z = (X − 平均) ÷ 標準偏差 と「標準化」すれば、この 1 つの曲線（と正規分布表）で確率がわかる。z = 1.96 にすると、−z 〜 z がほぼ 0.95 になる。</p>
    </div>
  );
}

// ---------- 9. 推定と検定 ----------

/** 決まった種から作る正規乱数（毎回同じ結果になる） */
function normals(seed: number, count: number): number[] {
  let s = seed * 9301 + 49297;
  const u = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s + 1) / 233281;
  };
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()));
  return out;
}

export function Estimate() {
  const [mode, setMode] = useState<'ci' | 'test'>('ci');
  const [n, setN] = useState<25 | 100 | 400>(100);
  const [seed, setSeed] = useState(3);
  const [z, setZ] = useState(1.2);
  const mu = 50;
  const sig = 10;
  const se = sig / Math.sqrt(n);
  const w = 1.96 * se;
  const means = normals(seed, 20).map((e) => mu + e * se);
  const hit = means.filter((x) => Math.abs(x - mu) <= w).length;
  const W = 340;
  const X = (v: number) => 20 + ((v - (mu - 9)) / 18) * (W - 40);
  const p = makePlane({ xmin: -3.6, xmax: 3.6, ymin: -0.04, ymax: 0.46, h: 200 });
  const tail = (from: number, to: number) => {
    let d = `M${p.X(from)} ${p.Y(0)}`;
    for (let i = 0; i <= 30; i++) {
      const x = from + ((to - from) * i) / 30;
      d += ` L${p.X(x).toFixed(1)} ${p.Y(dens(x)).toFixed(1)}`;
    }
    return `${d} L${p.X(to)} ${p.Y(0)} Z`;
  };
  const reject = Math.abs(z) > 1.96;
  return (
    <div className="figure">
      {mode === 'ci' ? (
        <>
          <svg viewBox={`0 0 ${W} 250`} className="area-svg" style={{ maxWidth: 460 }}>
            <line x1={X(mu)} y1={6} x2={X(mu)} y2={226} stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" />
            {means.map((x, i) => {
              const ok = Math.abs(x - mu) <= w;
              return (
                <g key={i}>
                  <line x1={X(x - w)} y1={12 + i * 10.8} x2={X(x + w)} y2={12 + i * 10.8} stroke={ok ? BLUE : PINK} strokeWidth={3} strokeLinecap="round" />
                  <circle cx={X(x)} cy={12 + i * 10.8} r={2.5} fill="#fff" />
                </g>
              );
            })}
            {[41, 45, 50, 55, 59].map((v) => (
              <Label key={v} x={X(v)} y={244} color="var(--muted)" size={10}>{v}</Label>
            ))}
          </svg>
          <div className="area-formula small-formula">
            <Tex>{`\\overline{X} \\pm 1.96 \\times \\dfrac{${sig}}{\\sqrt{${n}}} = \\overline{X} \\pm ${nice(w, 2)}`}</Tex>
          </div>
          <div className="area-formula small-formula">
            <Tex>{`20 \\text{ 本中 } ${hit} \\text{ 本が母平均 } ${mu} \\text{ をふくむ}`}</Tex>
          </div>
          <Toggle label="標本の大きさ n" options={[{ v: 25, text: '25' }, { v: 100, text: '100' }, { v: 400, text: '400' }]} value={n} onChange={setN} />
          <div className="sliders">
            <Slider label="標本の番号" value={seed} min={1} max={30} onChange={setSeed} color={GREEN} />
          </div>
          <p className="figure-note">母平均 50（金の線）の母集団から標本を 20 回とり、それぞれ信頼度 95% の信頼区間をかいた。およそ 20 本中 19 本が母平均をふくむ（桃色はふくまない区間）。n を 4 倍にすると、区間のはばは半分になる。</p>
        </>
      ) : (
        <>
          <PlaneSvg p={p} xLabel="z" yLabel="">
            <path d={tail(-3.6, -1.96)} fill={PINK} opacity={0.5} />
            <path d={tail(1.96, 3.6)} fill={PINK} opacity={0.5} />
            <Curve p={p} f={(x) => dens(x)} color={BLUE} />
            <Pt p={p} x={z} y={0} color={reject ? PINK : GREEN} label={`z = ${z}`} dy={-12} />
          </PlaneSvg>
          <div className="area-formula small-formula">
            <Tex>{`|z| = ${nice(Math.abs(z), 2)}\\ ${reject ? '> 1.96\\ \\Rightarrow\\ \\text{棄却域に入る：帰無仮説を棄却}' : '\\le 1.96\\ \\Rightarrow\\ \\text{棄却域の外：帰無仮説は棄却しない}'}`}</Tex>
          </div>
          <div className="sliders">
            <Slider label="観測した z" value={z} min={-3} max={3} step={0.1} onChange={(v) => setZ(Math.round(v * 10) / 10)} color={reject ? PINK : GREEN} />
          </div>
          <p className="figure-note">「かたよりはない」（帰無仮説）が正しいとすると、z が両はしの桃色の部分（合わせて 5%）に入るのは、めったに起きないこと。そこに入ったら「帰無仮説は正しくなさそう」と判断して棄却する。入らなければ「かたよりがあるとはいえない」。</p>
        </>
      )}
      <Toggle label="見るもの" options={[{ v: 'ci', text: '区間推定' }, { v: 'test', text: '仮説検定' }]} value={mode} onChange={setMode} />
    </div>
  );
}
