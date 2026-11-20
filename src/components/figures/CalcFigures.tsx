import { useState } from 'react';
import { Tex } from '../RichText';
import { fmt } from '../../engine/format';
import { Curve, HLine, makePlane, nice, PlaneSvg, Pt, VLine, XRange, type Plane } from './Plane';
import { Slider } from './Slider';
import { Toggle } from './StatsFigures';

// 数学Ⅱ「微分・積分」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';

type F = (x: number) => number;
/** 数値を TeX 用に（−0 を 0 に） */
const n2 = (v: number, d = 2) => nice(Math.abs(v) < 1e-9 ? 0 : v, d);
/** 小数 3 けた以内で表せれば「=」、そうでなければ「≈」 */
const exactEq = (v: number) => (Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6 ? '=' : '\\approx');
/** 一次式 mx + c の TeX */
const lineTex = (m: number, c: number) => fmt([[+n2(m), 'x'], [+n2(c), '']]);

/** 点 (a, f(a)) を通る傾き m の直線（線分） */
function TanLine({ p, a, fa, m, color = GOLD, dash, half = 1.6 }: { p: Plane; a: number; fa: number; m: number; color?: string; dash?: string; half?: number }) {
  return <Curve p={p} f={(x) => fa + m * (x - a)} from={a - half} to={a + half} color={color} width={2.5} dash={dash} />;
}

/** 区間 [a, b] で、f と g（下側）のあいだを塗る */
function Fill({ p, f, g = () => 0, a, b, color = GREEN, opacity = 0.35 }: { p: Plane; f: F; g?: F; a: number; b: number; color?: string; opacity?: number }) {
  const n = 80;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    d += `${i === 0 ? 'M' : 'L'}${p.X(x).toFixed(1)} ${p.Y(f(x)).toFixed(1)}`;
  }
  for (let i = n; i >= 0; i--) {
    const x = a + ((b - a) * i) / n;
    d += `L${p.X(x).toFixed(1)} ${p.Y(g(x)).toFixed(1)}`;
  }
  return <path d={`${d}Z`} fill={color} opacity={opacity} />;
}

// ---------- 1. 平均変化率から微分係数へ ----------

export function AvgRate() {
  const [a, setA] = useState(1);
  const [h, setH] = useState(1.5);
  const f: F = (x) => x * x;
  const p = makePlane({ xmin: -1, xmax: 4, ymin: -1, ymax: 12 });
  const b = a + h;
  const s = (f(b) - f(a)) / h;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color={BLUE} />
        <Curve p={p} f={(x) => f(a) + s * (x - a)} color={PINK} width={2.5} />
        <TanLine p={p} a={a} fa={f(a)} m={2 * a} dash="6 4" half={3} />
        <VLine p={p} x={b} color={PINK} />
        <Pt p={p} x={a} y={f(a)} color={GOLD} label="A" dy={16} />
        <Pt p={p} x={b} y={f(b)} color={PINK} label="B" anchor="end" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{平均変化率} = \\dfrac{f(${n2(b, 1)}) - f(${n2(a, 1)})}{${n2(b, 1)} - ${n2(a, 1)}} = \\dfrac{${n2(f(b) - f(a), 3)}}{${n2(h, 1)}} = ${n2(s, 3)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\text{接線の傾き（金の点線）} = ${n2(2 * a, 1)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="点 A の x" value={a} min={0} max={2} step={0.5} onChange={setA} color={GOLD} />
        <Slider label="はば h" value={h} min={0.1} max={2} step={0.1} onChange={setH} color={PINK} />
      </div>
      <p className="figure-note">曲線は y = x²。h を小さくして点 B を A に近づけると、桃色の直線（2 点を結ぶ線）の傾きが、金色の接線の傾きに近づいていく。この近づく先が「微分係数」。</p>
    </div>
  );
}

// ---------- 2. 接線の傾きを集めると導関数 ----------

const DG: Record<'sq' | 'cu', { f: F; d: F; tex: string; dtex: string }> = {
  sq: { f: (x) => x * x, d: (x) => 2 * x, tex: 'x^2', dtex: '2x' },
  cu: { f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, tex: 'x^3 - 3x', dtex: '3x^2 - 3' },
};

export function DerivGraph() {
  const [k, setK] = useState<'sq' | 'cu'>('cu');
  const [t, setT] = useState(-1.5);
  const { f, d, tex, dtex } = DG[k];
  const p1 = makePlane({ xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 5, h: 220 });
  const p2 = makePlane({ xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 5, h: 220 });
  return (
    <div className="figure">
      <PlaneSvg p={p1}>
        <Curve p={p1} f={f} color={BLUE} />
        <TanLine p={p1} a={t} fa={f(t)} m={d(t)} half={1.2} />
        <Pt p={p1} x={t} y={f(t)} color={GOLD} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{上：}y = ${tex}\\qquad\\text{点の接線の傾き} = ${n2(d(t))}`}</Tex>
      </div>
      <PlaneSvg p={p2} yLabel="傾き">
        <Curve p={p2} f={d} color={PINK} opacity={0.25} />
        <Curve p={p2} f={d} color={PINK} to={t} />
        <VLine p={p2} x={t} />
        <Pt p={p2} x={t} y={d(t)} color={PINK} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{下（傾きのグラフ）：}y' = ${dtex}`}</Tex>
      </div>
      <Toggle label="関数" options={[{ v: 'sq', text: 'x²' }, { v: 'cu', text: 'x³ − 3x' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="点の x" value={t} min={-2} max={2} step={0.1} onChange={setT} color={GOLD} />
      </div>
      <p className="figure-note">点を左から右へ動かすと、その点の接線の傾きが下のグラフにかきこまれていく。x ごとに傾きを返す関数が「導関数」。接線が水平な点では、下のグラフは 0 になる。</p>
    </div>
  );
}

// ---------- 3. (x^n)' = n x^(n−1) のわけ ----------

export function PowerRule() {
  const [x, setX] = useState(3);
  const [h, setH] = useState(0.8);
  const U = 46;
  const x0 = 30;
  const y0 = 20;
  return (
    <div className="figure">
      <svg viewBox="0 0 300 250" className="area-svg" style={{ maxWidth: 360 }}>
        <rect x={x0} y={y0 + h * U} width={x * U} height={x * U} fill="rgba(0,187,249,0.3)" stroke={BLUE} strokeWidth={2} />
        <rect x={x0 + x * U} y={y0 + h * U} width={h * U} height={x * U} fill="rgba(241,91,181,0.35)" stroke={PINK} strokeWidth={2} />
        <rect x={x0} y={y0} width={x * U} height={h * U} fill="rgba(241,91,181,0.35)" stroke={PINK} strokeWidth={2} />
        <rect x={x0 + x * U} y={y0} width={h * U} height={h * U} fill="rgba(255,209,102,0.5)" stroke={GOLD} strokeWidth={2} />
        <text x={x0 + (x * U) / 2} y={y0 + h * U + (x * U) / 2 + 5} fill="#fff" fontSize={15} fontWeight={800} textAnchor="middle" className="plane-label">
          x²
        </text>
        <text x={x0 + (x * U) / 2} y={y0 + (h * U) / 2 + 5} fill={PINK} fontSize={13} fontWeight={800} textAnchor="middle" className="plane-label">
          xh
        </text>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`(x + h)^2 - x^2 = \\underbrace{2xh}_{\\text{桃色 2 本}} + \\underbrace{h^2}_{\\text{金}} = ${n2(2 * x * h, 2)} + ${n2(h * h, 2)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\dfrac{(x + h)^2 - x^2}{h} = 2x + h = ${n2(2 * x + h, 2)}\\ \\xrightarrow{h \\to 0}\\ 2x = ${2 * x}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="一辺 x" value={x} min={1} max={4} step={0.5} onChange={setX} color={BLUE} />
        <Slider label="のび h" value={h} min={0.1} max={1} step={0.1} onChange={setH} color={PINK} />
      </div>
      <p className="figure-note">正方形の一辺を h だけのばすと、面積は桃色の細長い板 2 枚と、金色の小さな正方形の分だけ増える。h を小さくすると金色はほとんど消えて、増え方は「2 × x」だけが残る。だから x² を微分すると 2x。立方体なら板が 3 枚で 3x² になる。</p>
    </div>
  );
}

// ---------- 4. 接線の方程式 ----------

const TL: Record<'sq' | 'cu', { f: F; d: F; tex: string; ymin: number; ymax: number }> = {
  sq: { f: (x) => x * x - 2 * x, d: (x) => 2 * x - 2, tex: 'x^2 - 2x', ymin: -3, ymax: 8 },
  cu: { f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, tex: 'x^3 - 3x', ymin: -5, ymax: 6 },
};

export function TangentLine() {
  const [k, setK] = useState<'sq' | 'cu'>('sq');
  const [a, setA] = useState(2);
  const { f, d, tex, ymin, ymax } = TL[k];
  const p = makePlane({ xmin: -3, xmax: 3.5, ymin, ymax });
  const m = d(a);
  const fa = f(a);
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color={BLUE} />
        <Curve p={p} f={(x) => fa + m * (x - a)} color={GOLD} width={2.5} />
        <Pt p={p} x={a} y={fa} color={PINK} label={`(${a}, ${fa})`} anchor="start" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`y = ${tex}\\quad \\Rightarrow\\quad y' = ${k === 'sq' ? '2x - 2' : '3x^2 - 3'},\\quad f'(${a}) = ${m}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`y - ${fa < 0 ? `(${fa})` : fa} = ${m}(x - ${a < 0 ? `(${a})` : a})\\ \\Rightarrow\\ y = ${lineTex(m, fa - m * a)}`}</Tex>
      </div>
      <Toggle label="曲線" options={[{ v: 'sq', text: 'x² − 2x' }, { v: 'cu', text: 'x³ − 3x' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="接点の x（a）" value={a} min={-2} max={3} onChange={setA} color={PINK} />
      </div>
      <p className="figure-note">接線は「点 (a, f(a)) を通り、傾きが f'(a) の直線」。傾きを微分で求めてから、直線の式 y − f(a) = f'(a)(x − a) に入れればよい。</p>
    </div>
  );
}

// ---------- 5. 増減と極値 ----------

interface IncFn {
  f: F;
  d: F;
  tex: string;
  dtex: string;
  crit: number[];
  ymin: number;
  ymax: number;
  table: { x: string[]; d: string[]; f: string[] };
}
const INC: Record<'a' | 'b' | 'c', IncFn> = {
  a: {
    f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, tex: 'x^3 - 3x', dtex: '3(x + 1)(x - 1)', crit: [-1, 1], ymin: -4, ymax: 4,
    table: { x: ['…', '−1', '…', '1', '…'], d: ['＋', '0', '−', '0', '＋'], f: ['↗', '極大 2', '↘', '極小 −2', '↗'] },
  },
  b: {
    f: (x) => -(x ** 3) + 3 * x * x, d: (x) => -3 * x * x + 6 * x, tex: '-x^3 + 3x^2', dtex: '-3x(x - 2)', crit: [0, 2], ymin: -2, ymax: 6,
    table: { x: ['…', '0', '…', '2', '…'], d: ['−', '0', '＋', '0', '−'], f: ['↘', '極小 0', '↗', '極大 4', '↘'] },
  },
  c: {
    f: (x) => x ** 3 / 3 - x * x + x, d: (x) => (x - 1) ** 2, tex: '\\dfrac{1}{3}x^3 - x^2 + x', dtex: '(x - 1)^2', crit: [], ymin: -3, ymax: 3,
    table: { x: ['…', '1', '…'], d: ['＋', '0', '＋'], f: ['↗', '1/3', '↗'] },
  },
};

export function Increase() {
  const [k, setK] = useState<'a' | 'b' | 'c'>('a');
  const [t, setT] = useState(-1.8);
  const { f, d, tex, dtex, crit, ymin, ymax, table } = INC[k];
  const p = makePlane({ xmin: -2.5, xmax: 3.2, ymin, ymax, h: 240 });
  const cuts = [p.xmin, ...crit, p.xmax];
  const up = d(t) > 1e-9;
  const down = d(t) < -1e-9;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {cuts.slice(0, -1).map((a, i) => {
          const mid = (a + cuts[i + 1]) / 2;
          return <Curve key={a} p={p} f={f} from={a} to={cuts[i + 1]} color={d(mid) > 0 ? GREEN : PINK} />;
        })}
        {crit.map((c) => (
          <Pt key={c} p={p} x={c} y={f(c)} color={GOLD} label={d(c - 0.1) > 0 ? '極大' : '極小'} dy={d(c - 0.1) > 0 ? -10 : 20} />
        ))}
        <TanLine p={p} a={t} fa={f(t)} m={d(t)} half={0.8} color="#fff" />
        <Pt p={p} x={t} y={f(t)} color="#fff" r={4} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`f(x) = ${tex},\\quad f'(x) = ${dtex}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`f'(${n2(t, 1)}) = ${n2(d(t))}\\ ${up ? '> 0\\ \\text{（増加）}' : down ? '< 0\\ \\text{（減少）}' : '= 0\\ \\text{（水平）}'}`}</Tex>
      </div>
      <table className="pb-table">
        <tbody>
          <tr>
            <th>x</th>
            {table.x.map((v, i) => <td key={i}>{v}</td>)}
          </tr>
          <tr>
            <th>f&apos;(x)</th>
            {table.d.map((v, i) => <td key={i} style={{ color: v === '＋' ? GREEN : v === '−' ? PINK : undefined }}>{v}</td>)}
          </tr>
          <tr>
            <th>f(x)</th>
            {table.f.map((v, i) => <td key={i} className={v.startsWith('極') ? 'hl' : undefined}>{v}</td>)}
          </tr>
        </tbody>
      </table>
      <Toggle label="関数" options={[{ v: 'a', text: 'A' }, { v: 'b', text: 'B' }, { v: 'c', text: 'C' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="点の x" value={t} min={-2.2} max={3} step={0.1} onChange={setT} color="#fff" />
      </div>
      <p className="figure-note">緑は上り坂（f′ がプラス）、桃色は下り坂（f′ がマイナス）。上り坂から下り坂に変わる山の頂上が極大、下り坂から上り坂に変わる谷の底が極小。C のように f′ が 0 になっても上り坂のまま続くときは、極値にならない。</p>
    </div>
  );
}

// ---------- 6. 最大・最小と、方程式の解の個数 ----------

export function MaxMin() {
  const [mode, setMode] = useState<'mm' | 'k'>('mm');
  const [lo, setLo] = useState(-2);
  const [hi, setHi] = useState(2.5);
  const [k, setK] = useState(1);
  const f: F = (x) => x ** 3 - 3 * x;
  const p = makePlane({ xmin: -3, xmax: 3, ymin: -6, ymax: 6, h: 260 });
  // 区間の最大・最小（極値と両はしをくらべる）
  const cand = [lo, hi, -1, 1].filter((x) => x >= lo && x <= hi);
  const vals = cand.map(f);
  const mx = Math.max(...vals);
  const mn = Math.min(...vals);
  const xMx = cand[vals.indexOf(mx)];
  const xMn = cand[vals.indexOf(mn)];
  // 横線との交点
  const roots: number[] = [];
  if (mode === 'k') {
    for (const c of [-1, 1]) if (Math.abs(f(c) - k) < 1e-9) roots.push(c);
    const g = (x: number) => f(x) - k;
    for (let i = 0; i < 600; i++) {
      const a = -3 + i * 0.01;
      const b = a + 0.01;
      if (g(a) * g(b) < 0) {
        let l = a, r = b;
        for (let j = 0; j < 40; j++) {
          const m = (l + r) / 2;
          if (g(l) * g(m) <= 0) r = m;
          else l = m;
        }
        if (!roots.some((x) => Math.abs(x - l) < 1e-3)) roots.push(l);
      }
    }
  }
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color={BLUE} opacity={mode === 'mm' ? 0.3 : 1} />
        {mode === 'mm' ? (
          <>
            <Curve p={p} f={f} from={lo} to={hi} color={BLUE} />
            <XRange p={p} from={lo} to={hi} />
            <Pt p={p} x={xMx} y={mx} color={GOLD} label={`最大 ${n2(mx, 3)}`} />
            <Pt p={p} x={xMn} y={mn} color={PINK} label={`最小 ${n2(mn, 3)}`} dy={20} />
          </>
        ) : (
          <>
            <HLine p={p} y={k} color={GOLD} dash="" width={2.5} />
            {roots.map((x) => (
              <Pt key={x} p={p} x={x} y={k} color={PINK} />
            ))}
          </>
        )}
      </PlaneSvg>
      <div className="area-formula small-formula">
        {mode === 'mm' ? (
          <Tex>{`${n2(lo, 1)} \\le x \\le ${n2(hi, 1)}\\ \\text{で　最大値}\\ ${n2(mx, 3)},\\ \\text{最小値}\\ ${n2(mn, 3)}`}</Tex>
        ) : (
          <Tex>{`x^3 - 3x = ${n2(k, 1)}\\ \\text{の実数解は}\\ ${roots.length}\\ \\text{個}`}</Tex>
        )}
      </div>
      <Toggle label="見るもの" options={[{ v: 'mm', text: '最大・最小' }, { v: 'k', text: '解の個数' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        {mode === 'mm' ? (
          <>
            <Slider label="区間の左はし" value={lo} min={-2.5} max={0} step={0.5} onChange={setLo} color={GREEN} />
            <Slider label="区間の右はし" value={hi} min={0.5} max={2.5} step={0.5} onChange={setHi} color={GREEN} />
          </>
        ) : (
          <Slider label="横線の高さ k" value={k} min={-4} max={4} step={0.5} onChange={setK} color={GOLD} />
        )}
      </div>
      <p className="figure-note">
        {mode === 'mm'
          ? '曲線は y = x³ − 3x（極大 2、極小 −2）。最大・最小になるのは、極値の点か、区間の両はしのどれか。両はしを忘れずにくらべよう。'
          : '方程式 f(x) = k の解の個数は、グラフと横線 y = k の交点の個数。横線が極大と極小の高さのあいだなら 3 個、ちょうど極値の高さなら 2 個、外側なら 1 個。'}
      </p>
    </div>
  );
}

// ---------- 7. 不定積分（微分の逆） ----------

const AD: Record<'a' | 'b' | 'c', { F: F; d: F; tex: string; Ftex: string }> = {
  a: { F: (x) => x * x, d: (x) => 2 * x, tex: '2x', Ftex: 'x^2' },
  b: { F: (x) => x ** 3, d: (x) => 3 * x * x, tex: '3x^2', Ftex: 'x^3' },
  c: { F: (x) => x * x - 2 * x, d: (x) => 2 * x - 2, tex: '2x - 2', Ftex: 'x^2 - 2x' },
};

export function Antideriv() {
  const [k, setK] = useState<'a' | 'b' | 'c'>('a');
  const [C, setC] = useState(0);
  const { F, d, tex, Ftex } = AD[k];
  const p = makePlane({ xmin: -2.5, xmax: 2.5, ymin: -5, ymax: 7 });
  const t = 1;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {[-3, -2, -1, 0, 1, 2, 3].filter((c) => c !== C).map((c) => (
          <Curve key={c} p={p} f={(x) => F(x) + c} color={BLUE} width={1.5} opacity={0.35} />
        ))}
        <Curve p={p} f={(x) => F(x) + C} color={BLUE} />
        {[-3, -2, -1, 0, 1, 2, 3].map((c) => (
          <TanLine key={c} p={p} a={t} fa={F(t) + c} m={d(t)} half={0.5} color={c === C ? GOLD : 'rgba(255,209,102,0.4)'} />
        ))}
        <VLine p={p} x={t} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\left(${Ftex} ${C === 0 ? '' : C > 0 ? `+ ${C}` : `- ${-C}`}\\right)' = ${tex}\\qquad \\displaystyle\\int (${tex})\\,dx = ${Ftex} + C`}</Tex>
      </div>
      <Toggle label="f(x)" options={[{ v: 'a', text: '2x' }, { v: 'b', text: '3x²' }, { v: 'c', text: '2x − 2' }]} value={k} onChange={setK} />
      <div className="sliders">
        <Slider label="ずれ C" value={C} min={-3} max={3} onChange={setC} color={BLUE} />
      </div>
      <p className="figure-note">C を動かしてグラフを上下にずらしても、x = 1 での接線（金色）の傾きはどれも同じ。だから「微分すると f(x) になる関数」は 1 つに決まらず、最後に + C（積分定数）をつける。</p>
    </div>
  );
}

// ---------- 8. 定積分と面積（長方形で近づける） ----------

export function Riemann() {
  const [n, setN] = useState(4);
  const [b, setB] = useState(2);
  const f: F = (x) => x * x;
  const p = makePlane({ xmin: -0.5, xmax: 3.3, ymin: -0.8, ymax: 10 });
  const w = b / n;
  let sum = 0;
  const rects = [];
  for (let i = 1; i <= n; i++) {
    const hgt = f(i * w);
    sum += hgt * w;
    rects.push(
      <rect key={i} x={p.X((i - 1) * w)} y={p.Y(hgt)} width={p.X(w) - p.X(0)} height={p.Y(0) - p.Y(hgt)} fill="rgba(241,91,181,0.3)" stroke={PINK} strokeWidth={n > 20 ? 0.5 : 1.2} />,
    );
  }
  const exact = b ** 3 / 3;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {rects}
        <Fill p={p} f={f} a={0} b={b} color={GREEN} opacity={0.35} />
        <Curve p={p} f={f} color={BLUE} />
        <VLine p={p} x={b} color={GREEN} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\text{長方形 ${n} 本の合計} \\approx ${nice(sum, 3)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\displaystyle\\int_0^{${b}} x^2\\,dx = \\Big[\\dfrac{x^3}{3}\\Big]_0^{${b}} = \\dfrac{${nice(b ** 3, 3)}}{3} ${exactEq(exact)} ${nice(exact, 3)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="長方形の数" value={n} min={1} max={40} onChange={setN} color={PINK} />
        <Slider label="右はし b" value={b} min={1} max={3} step={0.5} onChange={setB} color={GREEN} />
      </div>
      <p className="figure-note">y = x² の下の面積（緑）を、細い長方形（桃色）の合計で近づける。本数をふやすほど、合計は x³/3 の差で求めた値に近づく。面積を「たし算の積み重ね」で求めるのが積分。</p>
    </div>
  );
}

// ---------- 9. 囲まれた部分の面積 ----------

export function AreaBetween() {
  const [mode, setMode] = useState<'axis' | 'line'>('axis');
  const [al, setAl] = useState(-1);
  const [be, setBe] = useState(2);
  const par: F = mode === 'axis' ? (x) => -(x - al) * (x - be) : (x) => x * x;
  const low: F = mode === 'axis' ? () => 0 : (x) => (al + be) * x - al * be;
  const S = (be - al) ** 3 / 6;
  const p = makePlane({ xmin: -3.5, xmax: 3.5, ymin: mode === 'axis' ? -3 : -1, ymax: mode === 'axis' ? 6 : 10 });
  const facTex = (r: number) => (r === 0 ? 'x' : `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`);
  const parTex = mode === 'axis' ? `y = -${facTex(al)}${facTex(be)}` : 'y = x^2';
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Fill p={p} f={mode === 'axis' ? par : low} g={mode === 'axis' ? low : par} a={al} b={be} />
        <Curve p={p} f={par} color={BLUE} />
        {mode === 'line' && <Curve p={p} f={low} color={GOLD} width={2.5} />}
        <Pt p={p} x={al} y={mode === 'axis' ? 0 : al * al} color={PINK} label="α" anchor="end" />
        <Pt p={p} x={be} y={mode === 'axis' ? 0 : be * be} color={PINK} label="β" anchor="start" />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`${parTex}${mode === 'line' ? `,\\quad y = ${lineTex(al + be, -al * be)}` : ''}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`S = \\dfrac{(\\beta - \\alpha)^3}{6} = \\dfrac{(${be} - ${al < 0 ? `(${al})` : al})^3}{6} = \\dfrac{${nice((be - al) ** 3, 3)}}{6} ${exactEq(S)} ${nice(S, 3)}`}</Tex>
      </div>
      <Toggle label="囲むもの" options={[{ v: 'axis', text: 'x 軸' }, { v: 'line', text: '直線' }]} value={mode} onChange={setMode} />
      <div className="sliders">
        <Slider label="α" value={al} min={-3} max={0} step={0.5} onChange={setAl} color={PINK} />
        <Slider label="β" value={be} min={0.5} max={3} step={0.5} onChange={setBe} color={PINK} />
      </div>
      <p className="figure-note">放物線（x² の係数が 1 か −1）と、x 軸や直線で囲まれた部分の面積は、交点 α、β のはばだけで決まり、(β − α)³ ÷ 6。上にあるほうから下にあるほうを引いて積分すると、この形になる。</p>
    </div>
  );
}
