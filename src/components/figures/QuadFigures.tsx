import { useEffect, useRef, useState } from 'react';
import { fmt } from '../../engine/format';
import { Tex } from '../RichText';
import { Curve, HLine, makePlane, nice, PlaneSvg, Pt, VLine, XRange } from './Plane';
import { Slider } from './Slider';

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = 'var(--accent)';

/** a(x - p)^2 + q の TeX */
function vertexTex(a: number, p: number, q: number): string {
  const aa = a === 1 ? '' : a === -1 ? '-' : nice(a);
  const inner = p === 0 ? 'x' : `(x ${p > 0 ? '-' : '+'} ${nice(Math.abs(p))})`;
  const sq = p === 0 ? 'x^2' : `${inner}^2`;
  const qq = q === 0 ? '' : ` ${q > 0 ? '+' : '-'} ${nice(Math.abs(q))}`;
  return `${aa}${sq}${qq}`;
}

/** 係数から展開形の TeX */
function expandedTex(a: number, b: number, c: number): string {
  return fmt([
    [Number(nice(a, 3)), 'x^2'],
    [Number(nice(b, 3)), 'x'],
    [Number(nice(c, 3)), ''],
  ]);
}

// ---------- 関数マシン ----------

const FUNCS = [
  { tex: '2x + 1', f: (x: number) => 2 * x + 1 },
  { tex: 'x^2', f: (x: number) => x * x },
  { tex: '-x + 3', f: (x: number) => -x + 3 },
];

export function FuncMachine() {
  const [fi, setFi] = useState(0);
  const [x, setX] = useState(1);
  const [tried, setTried] = useState<number[]>([1]);
  const [line, setLine] = useState(false);
  const fn = FUNCS[fi];
  const y = fn.f(x);
  const p = makePlane({ xmin: -4, xmax: 4, ymin: -4, ymax: 10, h: 260 });
  const choose = (v: number) => {
    setX(v);
    setTried((t) => (t.includes(v) ? t : [...t, v]));
  };
  return (
    <div className="figure">
      <div className="row-buttons" style={{ margin: '0 0 8px' }}>
        {FUNCS.map((g, i) => (
          <button key={g.tex} className={`btn small ${fi === i ? '' : 'ghost'}`} onClick={() => (setFi(i), setTried([x]), setLine(false))}>
            <Tex>{`f(x) = ${g.tex}`}</Tex>
          </button>
        ))}
      </div>
      <div className="machine">
        <div className="machine-io in">
          <span>入れる</span>
          <strong key={`x${x}`} className="pop-in">x = {x}</strong>
        </div>
        <div className="machine-box">
          <span className="machine-gear">⚙️</span>
          <Tex>{fn.tex}</Tex>
        </div>
        <div className="machine-io out">
          <span>出てくる</span>
          <strong key={`y${fi}${x}`} className="pop-in">y = {y}</strong>
        </div>
      </div>
      <PlaneSvg p={p}>
        {line && <Curve p={p} f={fn.f} color={GOLD} />}
        {tried.map((t) => (
          <Pt key={t} p={p} x={t} y={fn.f(t)} color={t === x ? PINK : BLUE} r={t === x ? 6 : 4} />
        ))}
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`f(${x}) = ${y}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<>入れる <Tex>x</Tex></>} value={x} min={-3} max={3} onChange={choose} color={PINK} />
      </div>
      <button className="btn small ghost" onClick={() => setLine((v) => !v)}>
        {line ? '点だけにする' : '点をなめらかにつなぐ'}
      </button>
      <p className="figure-note">入れる数 x を1つ決めると、出てくる数 y がただ1つに決まる。この「しくみ」が関数。点を集めると、グラフという「しくみの地図」になる。</p>
    </div>
  );
}

// ---------- y = ax^2 ----------

export function ParabolaA() {
  const [a, setA] = useState(1);
  const p = makePlane({ xmin: -4, xmax: 4, ymin: -8, ymax: 8 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => x * x} color="var(--muted)" width={1.5} dash="4 4" />
        <Curve p={p} f={(x) => a * x * x} color={a > 0 ? PINK : BLUE} />
        <Pt p={p} x={0} y={0} color={GOLD} label="頂点" dy={a > 0 ? 18 : -10} />
        <Pt p={p} x={1} y={a} color={a > 0 ? PINK : BLUE} label={`(1, ${nice(a)})`} anchor="start" />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{a === 0 ? 'y = 0 \\ (\\text{放物線ではなく直線})' : `y = ${a === 1 ? '' : a === -1 ? '-' : nice(a)}x^2`}</Tex>
      </div>
      <div className="quad-tag">
        {a > 0 ? '下に凸（谷の形）' : a < 0 ? '上に凸（山の形）' : '—'}
        {Math.abs(a) > 1 ? '｜y = x² より細い' : Math.abs(a) < 1 && a !== 0 ? '｜y = x² より太い' : ''}
      </div>
      <div className="sliders">
        <Slider label={<Tex>a</Tex>} value={a} min={-3} max={3} step={0.5} onChange={setA} color={a > 0 ? PINK : BLUE} />
      </div>
      <p className="figure-note">点線は y = x²。a は「x = 1 のときの高さ」。a の符号で谷か山か、a の大きさで細いか太いかが決まる。</p>
    </div>
  );
}

// ---------- 平行移動 ----------

export function ParabolaShift() {
  const [a, setA] = useState(1);
  const [pp, setP] = useState(2);
  const [q, setQ] = useState(-1);
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -7, ymax: 9 });
  const aa = a === 0 ? 0.5 : a;
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={(x) => aa * x * x} color="var(--muted)" width={1.5} dash="4 4" />
        <VLine p={p} x={pp} color={GOLD} />
        <Curve p={p} f={(x) => aa * (x - pp) ** 2 + q} color={PINK} />
        <Pt p={p} x={pp} y={q} color={GOLD} label={`頂点 (${pp}, ${q})`} dy={aa > 0 ? 18 : -10} />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`y = ${vertexTex(aa, pp, q)}`}</Tex>
      </div>
      <div className="area-formula small-formula">
        <Tex>{`= ${expandedTex(aa, -2 * aa * pp, aa * pp * pp + q)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<>横に <Tex>p</Tex></>} value={pp} min={-4} max={4} onChange={setP} color={PINK} />
        <Slider label={<>たてに <Tex>q</Tex></>} value={q} min={-5} max={5} onChange={setQ} color={BLUE} />
        <Slider label={<Tex>a</Tex>} value={a} min={-2} max={2} step={0.5} onChange={(v) => setA(v === 0 ? 0.5 : v)} />
      </div>
      <p className="figure-note">点線の y = ax² を、形はそのままで右に p、上に q 動かした。<Tex>{'(x - p)'}</Tex> の「−」に注意：<Tex>{'(x-2)^2'}</Tex> は右に 2 動く。軸（金色の線）は <Tex>{`x = ${pp}`}</Tex>。</p>
    </div>
  );
}

// ---------- 平方完成：足りない角を借りて返す ----------

export function CompleteSquare() {
  const [b, setB] = useState(6);
  const [c, setC] = useState(11);
  const h = b / 2;
  const U = 16;
  const X = 6;
  const P = 26;
  const size = P + (X + 4) * U + 10;
  const vy = c - h * h;
  const pl = makePlane({ xmin: -9, xmax: 3, ymin: -12, ymax: 20, h: 220 });
  return (
    <div className="figure">
      <div className="area-formula">
        <Tex>{`x^2 + ${b}x + ${c}`}</Tex>
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} className="area-svg" style={{ maxWidth: 260 }}>
        <rect x={P} y={P} width={X * U} height={X * U} fill="#9b5de5" stroke="#1b1640" strokeWidth={2} />
        <text x={P + (X * U) / 2} y={P + (X * U) / 2} textAnchor="middle" dominantBaseline="central" className="piece-label">x²</text>
        <rect x={P + X * U} y={P} width={h * U} height={X * U} fill={BLUE} stroke="#1b1640" strokeWidth={2} />
        <text x={P + X * U + (h * U) / 2} y={P + (X * U) / 2} textAnchor="middle" dominantBaseline="central" className="piece-label" fontSize={11}>{h}x</text>
        <rect x={P} y={P + X * U} width={X * U} height={h * U} fill={BLUE} stroke="#1b1640" strokeWidth={2} />
        <text x={P + (X * U) / 2} y={P + X * U + (h * U) / 2} textAnchor="middle" dominantBaseline="central" className="piece-label" fontSize={11}>{h}x</text>
        <rect x={P + X * U} y={P + X * U} width={h * U} height={h * U} fill="none" stroke="#fee440" strokeWidth={2.5} strokeDasharray="5 3" className="blink" />
        <text x={P + X * U + (h * U) / 2} y={P + X * U + (h * U) / 2} textAnchor="middle" dominantBaseline="central" fill="#fee440" fontWeight={800} fontSize={11}>{h * h}</text>
        <text x={P + (X * U) / 2} y={P - 8} textAnchor="middle" fill="#c9b6ff" fontStyle="italic" fontWeight={800}>x</text>
        <text x={P + X * U + (h * U) / 2} y={P - 8} textAnchor="middle" fill="#5fd3ff" fontWeight={800}>{h}</text>
      </svg>
      <p className="figure-note" style={{ textAlign: 'center' }}>
        <Tex>{`${b}x`}</Tex> を半分ずつ右と下に置くと、すみの <Tex>{`${h}^2 = ${h * h}`}</Tex> だけが足りない。それを「借りて」正方形を完成させ、あとで「返す」。
      </p>
      <div className="mental-steps" style={{ display: 'block' }}>
        <div><Tex>{`x^2 + ${b}x + ${c}`}</Tex></div>
        <div><Tex>{`= (x^2 + ${b}x + ${h * h}) - ${h * h} + ${c}`}</Tex></div>
        <div className="mental-ans"><Tex>{`= (x + ${h})^2 ${vy >= 0 ? '+' : '-'} ${Math.abs(vy)}`}</Tex></div>
      </div>
      <PlaneSvg p={pl}>
        <Curve p={pl} f={(x) => x * x + b * x + c} color={PINK} />
        <Pt p={pl} x={-h} y={vy} color={GOLD} label={`頂点 (${-h}, ${vy})`} dy={18} />
      </PlaneSvg>
      <div className="sliders">
        <Slider label={<><Tex>x</Tex> の係数</>} value={b} min={2} max={8} step={2} onChange={setB} color={BLUE} />
        <Slider label="数の項" value={c} min={-5} max={20} onChange={setC} />
      </div>
    </div>
  );
}

// ---------- 定義域つきの最大・最小 ----------

export function DomainMaxMin() {
  const [up, setUp] = useState(true);
  const [s, setS] = useState(0);
  const [w, setW] = useState(3);
  const f = up ? (x: number) => (x - 2) ** 2 + 1 : (x: number) => -((x - 2) ** 2) + 6;
  const e = s + w;
  const cands = [s, e, ...(2 > s && 2 < e ? [2] : [])];
  const vals = cands.map((x) => ({ x, y: f(x) }));
  const max = vals.reduce((m, v) => (v.y > m.y ? v : m));
  const min = vals.reduce((m, v) => (v.y < m.y ? v : m));
  const p = makePlane({ xmin: -2, xmax: 7, ymin: -4, ymax: 10 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color="var(--muted)" width={1.5} dash="4 4" />
        <Curve p={p} f={f} color={PINK} width={4} from={s} to={e} />
        <VLine p={p} x={s} color="var(--muted)" />
        <VLine p={p} x={e} color="var(--muted)" />
        <XRange p={p} from={s} to={e} color="rgba(255,209,102,0.6)" />
        <Pt p={p} x={max.x} y={max.y} color="#ff8aa6" label={`最大 ${nice(max.y)}`} r={6} />
        <Pt p={p} x={min.x} y={min.y} color={BLUE} label={`最小 ${nice(min.y)}`} dy={18} r={6} />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`${up ? 'y = (x-2)^2 + 1' : 'y = -(x-2)^2 + 6'} \\quad (${s} \\le x \\le ${e})`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="左はし" value={s} min={-1} max={4} onChange={setS} />
        <Slider label="はば" value={w} min={1} max={4} onChange={setW} />
      </div>
      <button className="btn small ghost" onClick={() => setUp((v) => !v)}>
        {up ? '山の形（上に凸）にする' : '谷の形（下に凸）にする'}
      </button>
      <p className="figure-note">x が動ける範囲（定義域）だけのグラフ（太い線）を見る。いちばん高い点・低い点は「頂点」か「はし」のどれか。</p>
    </div>
  );
}

// ---------- ボールを投げる ----------

export function Throw() {
  const [v, setV] = useState(20);
  const [t, setT] = useState<number | null>(null);
  const raf = useRef(0);
  const h = (tt: number) => v * tt - 5 * tt * tt;
  const peakT = v / 10;
  const peakH = (v * v) / 20;
  const land = v / 5;
  const p = makePlane({ xmin: 0, xmax: 7, ymin: 0, ymax: 50, h: 250 });

  const throwBall = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const step = (now: number) => {
      const tt = ((now - start) / 1000) * 1.6; // 少し速めに再生
      if (tt >= land) {
        setT(land);
        return;
      }
      setT(tt);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => setT(null), [v]);

  return (
    <div className="figure">
      <PlaneSvg p={p} xLabel="t（秒）" yLabel="h（m）">
        <Curve p={p} f={h} color="var(--muted)" width={1.5} dash="4 4" from={0} to={land} />
        {t !== null && <Curve p={p} f={h} color={GOLD} width={3} from={0} to={t} />}
        <Pt p={p} x={peakT} y={peakH} color="#ff8aa6" label={`最高点 ${nice(peakH)}m`} />
        <Pt p={p} x={land} y={0} color={BLUE} label={`着地 ${nice(land)}秒`} dy={-12} anchor="end" />
        {t !== null && <circle cx={p.X(t)} cy={p.Y(h(t))} r={8} fill="#fff" stroke={PINK} strokeWidth={3} />}
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`h = ${v}t - 5t^2 = -5(t - ${nice(peakT)})^2 + ${nice(peakH)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="投げる速さ（m/秒）" value={v} min={10} max={30} step={2} onChange={setV} color={PINK} />
      </div>
      <button className="btn small" onClick={throwBall}>⚾ 真上に投げる</button>
      <p className="figure-note">
        横軸は時間 t、たて軸は高さ h（ボールは真上に投げて、まっすぐ落ちてくる）。高さは「2次関数」で表され、頂点が最高点になる。
        （地球の重力で、1秒ごとに速さが約 10m/秒 ずつ落ちるとして計算）
      </p>
    </div>
  );
}

// ---------- 2次方程式：x 軸との交点 ----------

export function Roots() {
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const f = (x: number) => x * x + b * x + c;
  const D = b * b - 4 * c;
  const roots = D > 0 ? [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2] : D === 0 ? [-b / 2] : [];
  const intRoots = roots.every((r) => Math.abs(r - Math.round(r)) < 1e-9);
  const p = makePlane({ xmin: -7, xmax: 7, ymin: -10, ymax: 10 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <HLine p={p} y={0} color={GOLD} dash="" width={2.5} />
        <Curve p={p} f={f} color={PINK} />
        {roots.map((r, i) => (
          <Pt key={i} p={p} x={r} y={0} color={GOLD} r={6} label={`x=${nice(r)}`} dy={i === 0 ? -12 : 20} />
        ))}
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`${expandedTex(1, b, c)} = 0`}</Tex>
      </div>
      <div className="area-formula small-formula">
        {roots.length === 0 ? (
          <span>グラフが x 軸と交わらない → 実数の解はない</span>
        ) : intRoots ? (
          <Tex>{`${roots.length === 2 ? `(x ${roots[0] > 0 ? '-' : '+'} ${Math.abs(roots[0])})(x ${roots[1] > 0 ? '-' : '+'} ${Math.abs(roots[1])})` : `(x ${roots[0] > 0 ? '-' : '+'} ${Math.abs(roots[0])})^2`} = 0 \\Rightarrow x = ${roots.map((r) => nice(r)).join(',\\ ')}`}</Tex>
        ) : (
          <Tex>{`x = \\dfrac{${-b} \\pm \\sqrt{${D}}}{2} \\fallingdotseq ${roots.map((r) => nice(r)).join(',\\ ')}`}</Tex>
        )}
      </div>
      <div className="sliders">
        <Slider label={<><Tex>x</Tex> の係数</>} value={b} min={-6} max={6} onChange={setB} color={BLUE} />
        <Slider label="数の項" value={c} min={-8} max={8} onChange={setC} />
      </div>
      <p className="figure-note">方程式「＝0」の解は、グラフが x 軸（高さ 0 の線）と交わる点の x 座標。</p>
    </div>
  );
}

// ---------- 判別式 ----------

export function Discriminant() {
  const [c, setC] = useState(-1);
  const f = (x: number) => x * x - 2 * x + c;
  const D = 4 - 4 * c;
  const n = D > 0 ? 2 : D === 0 ? 1 : 0;
  const p = makePlane({ xmin: -3, xmax: 5, ymin: -5, ymax: 8 });
  const roots = D > 0 ? [1 - Math.sqrt(D) / 2, 1 + Math.sqrt(D) / 2] : D === 0 ? [1] : [];
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <HLine p={p} y={0} color={GOLD} dash="" width={2.5} />
        <Curve p={p} f={f} color={n === 2 ? PINK : n === 1 ? GOLD : BLUE} />
        {roots.map((r, i) => (
          <Pt key={i} p={p} x={r} y={0} color={GOLD} r={6} />
        ))}
        <Pt p={p} x={1} y={c - 1} color="var(--muted)" r={3} />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`y = x^2 - 2x ${c >= 0 ? '+' : '-'} ${nice(Math.abs(c))}`}</Tex>
      </div>
      <div className={`disc-box d${n}`}>
        <Tex>{`D = (-2)^2 - 4 \\cdot 1 \\cdot (${nice(c)}) = ${nice(D)}`}</Tex>
        <div>{D > 0 ? 'D > 0 → x 軸と 2 点で交わる（異なる 2 つの実数解）' : D === 0 ? 'D = 0 → x 軸に接する（重解）' : 'D < 0 → x 軸と交わらない（実数解なし）'}</div>
      </div>
      <div className="sliders">
        <Slider label="数の項" value={c} min={-3} max={4} step={0.5} onChange={setC} />
      </div>
      <p className="figure-note">数の項を大きくすると、グラフが上に持ち上がる。x 軸と交わる数が 2 → 1 → 0 と変わる瞬間を、D の符号が教えてくれる。</p>
    </div>
  );
}

// ---------- 2次不等式 ----------

export function QuadIneq() {
  const [al, setAl] = useState(-1);
  const [be, setBe] = useState(3);
  const [pos, setPos] = useState(true);
  const a = Math.min(al, be);
  const b = Math.max(al, be) === a ? a + 1 : Math.max(al, be);
  const f = (x: number) => (x - a) * (x - b);
  const p = makePlane({ xmin: -6, xmax: 6, ymin: -8, ymax: 10 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color="var(--muted)" width={2} />
        {pos ? (
          <>
            <Curve p={p} f={f} color={PINK} width={4} to={a} />
            <Curve p={p} f={f} color={PINK} width={4} from={b} />
            <XRange p={p} from={p.xmin} to={a} />
            <XRange p={p} from={b} to={p.xmax} />
          </>
        ) : (
          <>
            <Curve p={p} f={f} color={BLUE} width={4} from={a} to={b} />
            <XRange p={p} from={a} to={b} />
          </>
        )}
        <Pt p={p} x={a} y={0} color={GOLD} label={String(a)} dy={18} />
        <Pt p={p} x={b} y={0} color={GOLD} label={String(b)} dy={18} />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`(x ${a >= 0 ? '-' : '+'} ${Math.abs(a)})(x ${b >= 0 ? '-' : '+'} ${Math.abs(b)}) ${pos ? '> 0' : '< 0'} \\iff ${pos ? `x < ${a},\\ ${b} < x` : `${a} < x < ${b}`}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<Tex>\alpha</Tex>} value={al} min={-5} max={4} onChange={setAl} color={GOLD} />
        <Slider label={<Tex>\beta</Tex>} value={be} min={-4} max={5} onChange={setBe} color={GOLD} />
      </div>
      <button className="btn small ghost" onClick={() => setPos((v) => !v)}>
        {pos ? '「< 0（x 軸より下）」にする' : '「> 0（x 軸より上）」にする'}
      </button>
      <p className="figure-note">{'「> 0」はグラフが x 軸より上にある範囲（外側）、「< 0」は下にある範囲（2 つの解のあいだ）。緑の線が答えの範囲。'}</p>
    </div>
  );
}

// ---------- 軸が動くときの最小値 ----------

export function AxisMove() {
  const [a, setA] = useState(1);
  const f = (x: number) => x * x - 2 * a * x + 2;
  const minX = a < 0 ? 0 : a > 2 ? 2 : a;
  const minY = f(minX);
  const kase = a < 0 ? '軸が定義域より左 → 左はし x = 0 で最小' : a > 2 ? '軸が定義域より右 → 右はし x = 2 で最小' : '軸が定義域の中 → 頂点 x = a で最小';
  const p = makePlane({ xmin: -2, xmax: 4, ymin: -8, ymax: 10 });
  return (
    <div className="figure">
      <PlaneSvg p={p}>
        <Curve p={p} f={f} color="var(--muted)" width={1.5} dash="4 4" />
        <Curve p={p} f={f} color={PINK} width={4} from={0} to={2} />
        <VLine p={p} x={0} />
        <VLine p={p} x={2} />
        <VLine p={p} x={a} color={GOLD} />
        <Pt p={p} x={minX} y={minY} color={BLUE} r={6} label={`最小 ${nice(minY)}`} dy={18} />
      </PlaneSvg>
      <div className="area-formula">
        <Tex>{`y = x^2 - 2ax + 2 = (x - a)^2 + 2 - a^2 \\quad (0 \\le x \\le 2)`}</Tex>
      </div>
      <div className={`disc-box ${a < 0 ? 'd2' : a > 2 ? 'd0' : 'd1'}`}>{kase}</div>
      <div className="sliders">
        <Slider label={<>軸 <Tex>x = a</Tex></>} value={a} min={-1.5} max={3.5} step={0.25} onChange={setA} color={GOLD} />
      </div>
      <p className="figure-note">金色の線（軸）を左右に動かしてみよう。定義域（0〜2）との位置関係によって、最小になる場所が「左はし・頂点・右はし」の 3 通りに変わる。</p>
    </div>
  );
}
