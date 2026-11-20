import { useState } from 'react';
import { Tex } from '../RichText';
import { Curve, HLine, makePlane, nice, PlaneSvg, Pt, VLine, XRange } from './Plane';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 数学Ⅱ「指数関数・対数関数」の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';

/** a^k の値（TeX）。k が負なら分数 */
const powTex = (a: number, k: number) => (k >= 0 ? String(a ** k) : `\\dfrac{1}{${a ** -k}}`);
/** a^k の値（ふつうの文字） */
const powText = (a: number, k: number) => (k >= 0 ? String(a ** k) : `1/${a ** -k}`);

/** SVG の中で「底の右上に指数」を書く（text の最後に置く） */
function PowText({ x, y, b, e, color, size = 14 }: { x: number; y: number; b: string | number; e: string | number; color: string; size?: number }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={800} textAnchor="middle" className="plane-label">
      {b}
      <tspan dy={-size * 0.45} fontSize={size * 0.68}>
        {e}
      </tspan>
    </text>
  );
}

// ---------- 1. 指数の拡張 ----------

export function ExpExtend() {
  const [a, setA] = useState<2 | 3>(2);
  const [n, setN] = useState(-2);
  const ks = [-3, -2, -1, 0, 1, 2, 3, 4];
  const W = 42;
  const x0 = 180 - (ks.length * W) / 2;
  const formula =
    n > 0
      ? `${a}^{${n}} = ${Array(n).fill(a).join(' \\times ')} = ${a ** n}`
      : n === 0
        ? `${a}^{0} = 1\\ \\text{（1 回もかけない）}`
        : `${a}^{${n}} = \\dfrac{1}{${a}^{${-n}}} = ${powTex(a, n)}`;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 132" className="area-svg" style={{ maxWidth: 460 }}>
        {ks.slice(0, -1).map((k, i) => (
          <g key={k}>
            <Label x={x0 + (i + 1) * W} y={20} color={GOLD} size={11}>{`×${a} →`}</Label>
            <Label x={x0 + (i + 1) * W} y={114} color={BLUE} size={11}>{`← ÷${a}`}</Label>
          </g>
        ))}
        {ks.map((k, i) => {
          const on = k === n;
          return (
            <g key={k}>
              <rect x={x0 + i * W + 2} y={32} width={W - 4} height={68} rx={8} fill={on ? 'rgba(241,91,181,0.3)' : 'rgba(255,255,255,0.06)'} stroke={on ? PINK : 'var(--line)'} strokeWidth={on ? 2.5 : 1.5} />
              <PowText x={x0 + i * W + W / 2} y={58} b={a} e={k} color={on ? PINK : '#fff'} />
              <Label x={x0 + i * W + W / 2} y={84} color={on ? PINK : GREEN} size={k < 0 && a === 3 ? 10 : 12}>{powText(a, k)}</Label>
            </g>
          );
        })}
      </svg>
      <div className="area-formula small-formula">
        <Tex>{formula}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`${a}^{\\frac{1}{2}} = \\sqrt{${a}} \\approx ${nice(Math.sqrt(a), 3)},\\quad ${a}^{\\frac{1}{3}} = \\sqrt[3]{${a}} \\approx ${nice(Math.cbrt(a), 3)}`}</Tex>
      </div>
      <Toggle label="底" options={[{ v: 2, text: '2' }, { v: 3, text: '3' }]} value={a} onChange={setA} />
      <div className="sliders">
        <Slider label="指数 n" value={n} min={-3} max={4} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">右へ 1 つ進むと ×{a}、左へ 1 つもどると ÷{a}。だから 0 乗は 1、マイナス 1 乗は 1/{a}。また、2 回かけて {a} になる数（√{a}）を {a} の 1/2 乗と決めると、指数法則がそのまま使える。</p>
    </div>
  );
}

// ---------- 2. 指数関数のグラフ ----------

export function ExpGraph() {
  const [a, setA] = useState(2);
  const [mirror, setMirror] = useState<'off' | 'on'>('off');
  const p = makePlane({ xmin: -4, xmax: 4, ymin: -1, ymax: 8, h: 260 });
  const trend = a > 1 ? '右上がり（増加）' : a < 1 ? '右下がり（減少）' : '水平（a = 1 は底にしない）';
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        {mirror === 'on' && <Curve p={p} f={(x) => (1 / a) ** x} color={BLUE} dash="6 4" width={2.5} />}
        <Curve p={p} f={(x) => a ** x} color={PINK} />
        <Pt p={p} x={0} y={1} color={GOLD} label="(0, 1)" anchor="end" dy={-8} />
        {a <= 7.5 && <Pt p={p} x={1} y={a} color={PINK} label={`(1, ${nice(a, 1)})`} anchor="start" dy={4} />}
      </PlaneSvg>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderColor: PINK }}>
          <span>底 a</span>
          <strong>{nice(a, 1)}</strong>
        </div>
        <div style={{ borderColor: GOLD }}>
          <span>グラフ</span>
          <strong style={{ fontSize: '0.9rem' }}>{trend}</strong>
        </div>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{y = ${nice(a, 1)}^{x}}${mirror === 'on' ? `\\qquad \\color{${BLUE}}{y = \\left(\\dfrac{1}{${nice(a, 1)}}\\right)^{x}}` : ''}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="底 a" value={a} min={0.2} max={4} step={0.1} onChange={setA} color={PINK} />
      </div>
      <Toggle label="y = (1/a)ˣ" options={[{ v: 'off', text: 'かくす' }, { v: 'on', text: '表示' }]} value={mirror} onChange={setMirror} />
      <p className="figure-note">どんな a でも点 (0, 1) を通る。a が 1 より大きいと右上がり、1 より小さいと右下がり。グラフは x 軸に近づくが、決してまじわらない（値はいつも正）。</p>
    </div>
  );
}

// ---------- 3. 指数不等式 ----------

export function ExpIneq() {
  const [base, setBase] = useState<'2' | 'half'>('2');
  const [op, setOp] = useState<'>' | '<'>('>');
  const [t, setT] = useState(2);
  const up = base === '2';
  const f = (x: number) => (up ? 2 ** x : 0.5 ** x);
  const N = 2 ** t;
  const bound = up ? t : -t;
  // 解：増加なら同じ向き、減少なら逆向き
  const right = (op === '>') === up;
  const p = makePlane({ xmin: -4, xmax: 4, ymin: -1, ymax: 9, h: 250 });
  const bTex = up ? '2' : '\\left(\\dfrac{1}{2}\\right)';
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <HLine p={p} y={N} color={GOLD} dash="6 4" width={2} />
        <VLine p={p} x={bound} color={GREEN} />
        <XRange p={p} from={right ? bound : -4} to={right ? 4 : bound} color={GREEN} />
        <Curve p={p} f={f} color={PINK} />
        <Pt p={p} x={bound} y={N} color={GOLD} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`${bTex}^{x} ${op} ${powTex(2, t)} \\iff ${bTex}^{x} ${op} ${bTex}^{${up ? t : -t}} \\iff \\color{${GREEN}}{x ${right ? '>' : '<'} ${bound}}`}</Tex>
      </div>
      <Toggle label="底" options={[{ v: '2', text: '2' }, { v: 'half', text: '1/2' }]} value={base} onChange={setBase} />
      <Toggle label="不等号" options={[{ v: '>', text: '＞' }, { v: '<', text: '＜' }]} value={op} onChange={setOp} />
      <div className="sliders">
        <Slider label="右辺 = 2 の t 乗" value={t} min={-2} max={3} onChange={setT} color={GOLD} />
      </div>
      <p className="figure-note">右辺も同じ底の累乗に直して、指数どうしをくらべる。底が 1 より大きいと不等号の向きはそのまま、底が 1 より小さい（右下がり）と向きが逆になる。</p>
    </div>
  );
}

// ---------- 4. 対数とは（2 種類の目もり） ----------

export function LogScale() {
  const [N, setN] = useState(10);
  const L = Math.log2(N);
  const x0 = 24;
  const len = 312;
  const lin = (v: number) => x0 + (v / 64) * len;
  const lg = (v: number) => x0 + (Math.log2(v) / 6) * len;
  const isInt = Math.abs(L - Math.round(L)) < 1e-9;
  const eq = isInt ? '=' : '\\approx';
  return (
    <div className="figure">
      <svg viewBox="0 0 360 160" className="area-svg" style={{ maxWidth: 460 }}>
        <Label x={x0} y={14} color="var(--muted)" size={11} anchor="start">ふつうの目もり（1 目もりで +8）</Label>
        <line x1={x0} y1={40} x2={x0 + len} y2={40} stroke="var(--muted)" strokeWidth={2} />
        {[0, 8, 16, 24, 32, 40, 48, 56, 64].map((v) => (
          <g key={v}>
            <line x1={lin(v)} y1={35} x2={lin(v)} y2={45} stroke="var(--muted)" strokeWidth={1.5} />
            <Label x={lin(v)} y={56} color="var(--muted)" size={9}>{v}</Label>
          </g>
        ))}
        <circle cx={lin(N)} cy={40} r={6} fill={BLUE} stroke="#1b1640" strokeWidth={1.5} />
        <Label x={x0} y={84} color="var(--muted)" size={11} anchor="start">対数の目もり（1 目もりで ×2）</Label>
        <line x1={x0} y1={110} x2={x0 + len} y2={110} stroke="var(--muted)" strokeWidth={2} />
        {[1, 2, 4, 8, 16, 32, 64].map((v, i) => (
          <g key={v}>
            <line x1={lg(v)} y1={105} x2={lg(v)} y2={115} stroke="var(--muted)" strokeWidth={1.5} />
            <Label x={lg(v)} y={126} color="var(--muted)" size={9}>{v}</Label>
            <Label x={lg(v)} y={146} color={GOLD} size={10}>{i}</Label>
          </g>
        ))}
        <line x1={x0} y1={110} x2={lg(N)} y2={110} stroke={PINK} strokeWidth={5} strokeLinecap="round" />
        <circle cx={lg(N)} cy={110} r={6} fill={PINK} stroke="#1b1640" strokeWidth={1.5} />
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{\\log_2 ${N} ${eq} ${nice(L, 3)}}\\quad \\left(2^{${nice(L, 3)}} ${eq} ${N}\\right)`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="真数 N" value={N} min={1} max={64} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">
        {isInt ? `2 を ${Math.round(L)} 回かけると ${N}。` : `${N} は 2 の累乗ではないけれど、2 を ${nice(L, 3)} 乗すると ${N} になる。`}
        log₂N は「2 を何乗すれば N になるか」を表す数で、下の目もりで 1 から N までの長さ（金色の数）にあたる。
      </p>
    </div>
  );
}

// ---------- 5. 対数の性質（計算尺） ----------

export function SlideRule() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const x0 = 20;
  const len = 320;
  const pos = (v: number) => x0 + (Math.log10(v) / 2) * len;
  const shift = pos(a) - x0;
  const top = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const labeled = new Set([1, 2, 3, 5, 10, 20, 30, 50, 100]);
  const la = Math.log10(a);
  const lb = Math.log10(b);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 150" className="area-svg" style={{ maxWidth: 460 }}>
        <rect x={x0 - 6} y={18} width={len + 12} height={30} rx={4} fill="#d4a373" opacity={0.85} />
        {top.map((v) => (
          <g key={v}>
            <line x1={pos(v)} y1={48} x2={pos(v)} y2={labeled.has(v) ? 36 : 41} stroke="#1b1640" strokeWidth={1.2} />
            {labeled.has(v) && <Label x={pos(v)} y={28} color="#1b1640" size={9}>{v}</Label>}
          </g>
        ))}
        <g transform={`translate(${shift} 0)`}>
          <rect x={x0 - 6} y={50} width={len / 2 + 12} height={30} rx={4} fill="#faedcd" opacity={0.92} />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
            <g key={v}>
              <line x1={pos(v)} y1={50} x2={pos(v)} y2={v === b ? 66 : 58} stroke={v === b ? PINK : '#1b1640'} strokeWidth={v === b ? 2.5 : 1.2} />
              <Label x={pos(v)} y={72} color={v === b ? PINK : '#1b1640'} size={9}>{v}</Label>
            </g>
          ))}
        </g>
        <line x1={pos(a * b)} y1={14} x2={pos(a * b)} y2={84} stroke={PINK} strokeWidth={1.5} strokeDasharray="3 3" />
        <line x1={x0} y1={100} x2={pos(a)} y2={100} stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
        <line x1={pos(a)} y1={100} x2={pos(a * b)} y2={100} stroke={PINK} strokeWidth={6} strokeLinecap="round" />
        <line x1={x0} y1={122} x2={pos(a * b)} y2={122} stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
        <Label x={x0} y={140} color={GOLD} size={10} anchor="start">{`log ${a * b} の長さ ＝ log ${a}（青）＋ log ${b}（桃）`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${BLUE}}{\\log_{10} ${a}} + \\color{${PINK}}{\\log_{10} ${b}} = ${la.toFixed(3)} + ${lb.toFixed(3)} = ${(la + lb).toFixed(3)} = \\color{${GOLD}}{\\log_{10} ${a * b}}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="a" value={a} min={1} max={10} onChange={setA} color={BLUE} />
        <Slider label="b" value={b} min={1} max={10} onChange={setB} color={PINK} />
      </div>
      <p className="figure-note">目もりが log の長さで刻まれた 2 本の棒。下の棒の 1 を上の a に合わせると、下の b の真上に a × b が来る。長さのたし算が、数のかけ算になっている。</p>
    </div>
  );
}

// ---------- 6. 底の変換公式 ----------

export function BaseChange() {
  const [a, setA] = useState<2 | 3 | 5>(2);
  const [N, setN] = useState(10);
  const S = 150;
  const x0 = 20;
  const lenN = Math.log10(N) * S;
  const unit = Math.log10(a) * S;
  const count = Math.log10(N) / Math.log10(a);
  const pieces = Math.ceil(count);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 120" className="area-svg" style={{ maxWidth: 460 }}>
        <defs>
          <clipPath id="bc-clip">
            <rect x={x0} y={30} width={lenN} height={30} />
          </clipPath>
        </defs>
        <g clipPath="url(#bc-clip)">
          {Array.from({ length: pieces }, (_, i) => (
            <rect key={i} x={x0 + i * unit} y={30} width={unit} height={30} fill={i % 2 ? 'rgba(155,93,229,0.55)' : 'rgba(0,187,249,0.55)'} stroke="#1b1640" strokeWidth={1} />
          ))}
        </g>
        <rect x={x0} y={30} width={lenN} height={30} fill="none" stroke={GOLD} strokeWidth={2.5} />
        {Array.from({ length: Math.floor(count + 1e-9) }, (_, i) => (
          <Label key={i} x={x0 + i * unit + unit / 2} y={45} color="#fff" size={unit > 26 ? 11 : 8}>{i + 1}</Label>
        ))}
        <Label x={x0} y={16} color={GOLD} size={11} anchor="start">{`log₁₀ ${N} の長さ`}</Label>
        <line x1={x0} y1={84} x2={x0 + unit} y2={84} stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
        <Label x={x0 + unit + 8} y={84} color={BLUE} size={11} anchor="start">{`1 本 ＝ log₁₀ ${a} の長さ`}</Label>
        <Label x={x0} y={106} color={PINK} size={12} anchor="start">{`約 ${nice(count, 3)} 本分 → log${a === 2 ? '₂' : a === 3 ? '₃' : '₅'} ${N} ≈ ${nice(count, 3)}`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\color{${PINK}}{\\log_{${a}} ${N}} = \\dfrac{\\log_{10} ${N}}{\\log_{10} ${a}} = \\dfrac{${Math.log10(N).toFixed(3)}}{${Math.log10(a).toFixed(3)}} \\approx ${nice(count, 3)}`}</Tex>
      </div>
      <Toggle label="底 a" options={[{ v: 2, text: '2' }, { v: 3, text: '3' }, { v: 5, text: '5' }]} value={a} onChange={setA} />
      <div className="sliders">
        <Slider label="真数 N" value={N} min={2} max={100} onChange={setN} color={GOLD} />
      </div>
      <p className="figure-note">logₐN は「log a の長さのものさしで、log N の長さを測ると何本分か」。だから どんな底の log も、底 10 の log どうしのわり算で求められる。</p>
    </div>
  );
}

// ---------- 7. 対数関数のグラフ ----------

export function LogGraph() {
  const [a, setA] = useState(2);
  const [showExp, setShowExp] = useState<'on' | 'off'>('on');
  const p = makePlane({ xmin: -3, xmax: 6, ymin: -3, ymax: 6, w: 300, h: 300 });
  const bad = Math.abs(a - 1) < 1e-9;
  const lg = (x: number) => Math.log(x) / Math.log(a);
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => x} color="var(--muted)" dash="4 5" width={1.5} />
        {showExp === 'on' && <Curve p={p} f={(x) => a ** x} color={BLUE} width={2.5} opacity={0.7} />}
        {!bad && <Curve p={p} f={lg} color={PINK} from={0.003} />}
        {!bad && <Pt p={p} x={1} y={0} color={GOLD} label="(1, 0)" anchor="start" dy={18} />}
        {!bad && a <= 5.5 && <Pt p={p} x={a} y={1} color={PINK} label={`(${nice(a, 1)}, 1)`} anchor="start" dy={-8} />}
        {showExp === 'on' && <Pt p={p} x={0} y={1} color={BLUE} r={4} />}
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{bad ? '\\text{a = 1 は底にできない}' : `\\color{${PINK}}{y = \\log_{${nice(a, 1)}} x}${showExp === 'on' ? `\\qquad \\color{${BLUE}}{y = ${nice(a, 1)}^{x}}` : ''}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="底 a" value={a} min={0.2} max={4} step={0.1} onChange={setA} color={PINK} />
      </div>
      <Toggle label="指数関数" options={[{ v: 'on', text: '表示' }, { v: 'off', text: 'かくす' }]} value={showExp} onChange={setShowExp} />
      <p className="figure-note">y = logₐx は、y = aˣ のグラフを点線（y = x）を鏡にしてうつしたもの。かならず点 (1, 0) を通り、x が正のところにしかない。a が 1 より大きいとゆっくり右上がり。</p>
    </div>
  );
}

// ---------- 8. 対数不等式 ----------

export function LogIneq() {
  const [base, setBase] = useState<'2' | 'half'>('2');
  const [op, setOp] = useState<'>' | '<'>('<');
  const [k, setK] = useState(2);
  const up = base === '2';
  const N = up ? 2 ** k : 2 ** -k;
  const NTex = up ? powTex(2, k) : powTex(2, -k);
  const right = (op === '>') === up;
  const p = makePlane({ xmin: -1, xmax: 9, ymin: -4, ymax: 4, h: 240 });
  const f = (x: number) => (up ? Math.log2(x) : -Math.log2(x));
  const bTex = up ? '2' : '\\frac{1}{2}';
  const sol = right ? `x > ${NTex}` : `0 < x < ${NTex}`;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <HLine p={p} y={k} color={GOLD} dash="6 4" width={2} />
        <VLine p={p} x={N} color={GREEN} />
        <XRange p={p} from={right ? N : 0} to={right ? 9 : N} color={GREEN} />
        <Curve p={p} f={f} color={PINK} from={0.004} />
        <circle cx={p.X(N)} cy={p.Y(0)} r={5} fill="#1b1640" stroke={GREEN} strokeWidth={2.5} />
        {!right && <circle cx={p.X(0)} cy={p.Y(0)} r={5} fill="#1b1640" stroke={GREEN} strokeWidth={2.5} />}
        <Pt p={p} x={N} y={k} color={GOLD} />
      </PlaneSvg>
      <div className="area-formula small-formula">
        <Tex>{`\\log_{${bTex}} x ${op} ${k} \\iff \\log_{${bTex}} x ${op} \\log_{${bTex}} ${NTex} \\iff \\color{${GREEN}}{${sol}}`}</Tex>
      </div>
      <Toggle label="底" options={[{ v: '2', text: '2' }, { v: 'half', text: '1/2' }]} value={base} onChange={setBase} />
      <Toggle label="不等号" options={[{ v: '>', text: '＞' }, { v: '<', text: '＜' }]} value={op} onChange={setOp} />
      <div className="sliders">
        <Slider label="右辺 k" value={k} min={-2} max={3} onChange={setK} color={GOLD} />
      </div>
      <p className="figure-note">log のグラフは x が正のところにしかないので、解はかならず x &gt; 0 の中（真数条件）。底が 1 より小さいとグラフは右下がりになり、不等号の向きが逆になる。</p>
    </div>
  );
}

// ---------- 9. 常用対数とけた数 ----------

const LOG10: Record<number, number> = { 2: 0.301, 3: 0.4771, 6: 0.7781 };

export function Digits() {
  const [b, setB] = useState<2 | 3 | 6>(2);
  const [n, setN] = useState(50);
  const L = LOG10[b];
  const v = n * L;
  const f = Math.floor(v);
  const exact = (BigInt(b) ** BigInt(n)).toString();
  const shown = exact.length <= 22 ? exact : `${exact.slice(0, 10)}…${exact.slice(-4)}`;
  const from = Math.max(0, f - 2);
  const to = from + 5;
  const x0 = 24;
  const len = 312;
  const X = (u: number) => x0 + ((u - from) / (to - from)) * len;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 110" className="area-svg" style={{ maxWidth: 460 }}>
        <rect x={X(f)} y={30} width={X(f + 1) - X(f)} height={30} fill="rgba(6,214,160,0.25)" stroke={GREEN} strokeWidth={1.5} />
        <line x1={x0} y1={60} x2={x0 + len} y2={60} stroke="var(--muted)" strokeWidth={2} />
        {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((u) => (
          <g key={u}>
            <line x1={X(u)} y1={54} x2={X(u)} y2={66} stroke="var(--muted)" strokeWidth={1.5} />
            <Label x={X(u)} y={78} color="var(--muted)" size={10}>{u}</Label>
          </g>
        ))}
        <line x1={X(v)} y1={22} x2={X(v)} y2={62} stroke={PINK} strokeWidth={2.5} />
        <circle cx={X(v)} cy={60} r={5} fill={PINK} stroke="#1b1640" strokeWidth={1.5} />
        <Label x={X(v)} y={14} color={PINK} size={11}>{nice(v, 4)}</Label>
        <Label x={180} y={98} color={GREEN} size={11}>{`log₁₀ の値が ${f} 以上 ${f + 1} 未満 → ${f + 1} けた`}</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`\\log_{10} ${b}^{${n}} = ${n} \\times ${L.toFixed(4)} = ${v.toFixed(4)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`10^{${f}} \\le ${b}^{${n}} < 10^{${f + 1}}\\ \\Rightarrow\\ \\color{${GREEN}}{${f + 1}\\ \\text{けた}}`}</Tex>
      </div>
      <div className="trig-ratios" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ borderColor: GOLD }}>
          <span>{`実際の ${b} の ${n} 乗（${exact.length} けた）`}</span>
          <strong style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{shown}</strong>
        </div>
      </div>
      <Toggle label="底" options={[{ v: 2, text: '2' }, { v: 3, text: '3' }, { v: 6, text: '6' }]} value={b} onChange={setB} />
      <div className="sliders">
        <Slider label="指数 n" value={n} min={1} max={100} onChange={setN} color={PINK} />
      </div>
      <p className="figure-note">10 の 1 乗は 2 けた、10 の 2 乗は 3 けた…。だから log₁₀ の値の整数部分に 1 を足すとけた数になる。大きな数を実際に計算しなくても、けた数がわかる。</p>
    </div>
  );
}
