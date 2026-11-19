import { useState } from 'react';
import { fact, fracTex, nCr, perm, reduce } from '../../engine/prob';
import { Tex } from '../RichText';
import { Slider } from './Slider';
import { Label, Toggle } from './StatsFigures';

// 場合の数と確率の図

const PINK = '#f15bb5';
const BLUE = '#00bbf9';
const GOLD = '#ffd166';
const GREEN = '#06d6a0';
const PURPLE = '#9b5de5';
const GRAY = '#4a4e69';

// ---------- 1. 樹形図と積の法則 ----------

const FOODS = ['パン', 'ごはん', 'めん', 'ピザ'];
const DRINKS = ['水', 'お茶', 'ジュース'];

export function TreeDiagram() {
  const [m, setM] = useState(3);
  const [k, setK] = useState(2);
  const rowH = 17;
  const top = 16;
  const leaves = m * k;
  const H = top * 2 + leaves * rowH;
  const leafY = (i: number) => top + i * rowH + rowH / 2;
  return (
    <div className="figure">
      <svg viewBox={`0 0 360 ${H}`} className="area-svg" style={{ maxWidth: 420 }}>
        {FOODS.slice(0, m).map((f, i) => {
          const y1 = (leafY(i * k) + leafY(i * k + k - 1)) / 2;
          return (
            <g key={f}>
              <line x1={30} y1={H / 2} x2={110} y2={y1} stroke={BLUE} strokeWidth={2} />
              {DRINKS.slice(0, k).map((d, j) => {
                const y2 = leafY(i * k + j);
                return (
                  <g key={d}>
                    <line x1={150} y1={y1} x2={210} y2={y2} stroke={PINK} strokeWidth={1.5} />
                    <Label x={215} y={y2} color={PINK} size={11} anchor="start">{d}</Label>
                    <Label x={340} y={y2} color="var(--muted)" size={10} anchor="end">{i * k + j + 1}</Label>
                  </g>
                );
              })}
              <rect x={108} y={y1 - 10} width={44} height={20} rx={6} fill="rgba(0,187,249,0.2)" />
              <Label x={130} y={y1} color={BLUE} size={11}>{f}</Label>
            </g>
          );
        })}
        <circle cx={30} cy={H / 2} r={6} fill={GOLD} />
      </svg>
      <div className="area-formula">
        <Tex>{`\\underbrace{${m}}_{\\text{主食}} \\times \\underbrace{${k}}_{\\text{飲み物}} = ${m * k}\\ \\text{通り}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="主食の種類" value={m} min={2} max={4} onChange={setM} color={BLUE} />
        <Slider label="飲み物の種類" value={k} min={2} max={3} onChange={setK} color={PINK} />
      </div>
      <p className="figure-note">主食 1 つにつき、飲み物の枝が同じ数だけ分かれる。だから全部の組み合わせは「かけ算」で数えられる（積の法則）。</p>
    </div>
  );
}

// ---------- 2. 順列（席を順にうめる） ----------

export function PermSlots() {
  const [n, setN] = useState(5);
  const [r0, setR] = useState(3);
  const r = Math.min(r0, n);
  const w = Math.min(52, 320 / r - 8);
  const factors = Array.from({ length: r }, (_, i) => n - i);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 120" className="area-svg" style={{ maxWidth: 440 }}>
        {factors.map((f, i) => {
          const x = 20 + i * (w + 8);
          return (
            <g key={i}>
              <rect x={x} y={30} width={w} height={50} rx={8} fill="rgba(155,93,229,0.2)" stroke={PURPLE} strokeWidth={2} />
              <Label x={x + w / 2} y={55} color={GOLD} size={w > 36 ? 20 : 14}>{f}</Label>
              <Label x={x + w / 2} y={18} color="var(--muted)" size={w > 36 ? 10 : 8}>{i + 1}着</Label>
            </g>
          );
        })}
        <Label x={180} y={102} color="var(--muted)" size={10}>1 つ決めるごとに、残りの候補が 1 つずつへる</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`{}_{${n}}\\mathrm{P}_{${r}} = ${factors.join(' \\times ')} = ${perm(n, r)}`}</Tex>
      </div>
      {r === n && (
        <div className="area-formula small-formula">
          <Tex>{`\\text{全員をならべる：} ${n}! = ${fact(n)}`}</Tex>
        </div>
      )}
      <div className="sliders">
        <Slider label="候補の数 n" value={n} min={3} max={8} onChange={setN} color={PURPLE} />
        <Slider label="ならべる数 r" value={r} min={1} max={n} onChange={setR} color={GOLD} />
      </div>
      <p className="figure-note">n 頭の馬から 1 着・2 着・3 着…と順番に決める。1 着は n 通り、2 着は残りの n−1 通り…とかけていく。r を n にすると、全員をならべる「階乗 n!」になる。</p>
    </div>
  );
}

// ---------- 3. 円順列 ----------

const NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEAT_COLORS = [PINK, BLUE, GOLD, GREEN, PURPLE, '#ff9f1c'];

export function CirclePerm() {
  const [n, setN] = useState(4);
  const [rot, setRot] = useState(0);
  const rr = rot % n;
  const cx = 110;
  const cy = 105;
  const R = 62;
  const reads = Array.from({ length: n }, (_, s) => Array.from({ length: n }, (_, i) => NAMES[(i - s + n) % n]).join(''));
  return (
    <div className="figure">
      <svg viewBox="0 0 360 210" className="area-svg" style={{ maxWidth: 440 }}>
        <circle cx={cx} cy={cy} r={R - 18} fill="#8d6e63" opacity={0.5} />
        {Array.from({ length: n }, (_, i) => {
          const seat = (i + rr) % n;
          const a = -Math.PI / 2 + (seat * 2 * Math.PI) / n;
          return (
            <g key={i}>
              <circle cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={15} fill={SEAT_COLORS[i]} />
              <Label x={cx + R * Math.cos(a)} y={cy + R * Math.sin(a)} color="#1b1640" size={13}>{NAMES[i]}</Label>
            </g>
          );
        })}
        <Label x={cx} y={14} color="var(--muted)" size={10}>▼ ここから時計回りに読む</Label>
        <Label x={270} y={20} color="var(--muted)" size={10}>一列にすると…</Label>
        {reads.map((s, i) => (
          <g key={i}>
            <rect x={225} y={34 + i * 28} width={90} height={22} rx={6} fill={i === rr ? 'rgba(255,209,102,0.25)' : 'transparent'} stroke={i === rr ? GOLD : 'var(--line)'} />
            <Label x={270} y={45 + i * 28} color={i === rr ? GOLD : '#fff'} size={13}>{s}</Label>
          </g>
        ))}
      </svg>
      <div className="area-formula">
        <Tex>{`\\dfrac{${n}!}{${n}} = (${n} - 1)! = ${fact(n - 1)}\\ \\text{通り}`}</Tex>
      </div>
      <Toggle label="人数" value={n} onChange={(v) => { setN(v); setRot(0); }} options={[3, 4, 5, 6].map((v) => ({ v, text: `${v}人` }))} />
      <div className="sliders">
        <Slider label="テーブルを回す" value={rr} min={0} max={n - 1} onChange={setRot} color={GOLD} />
      </div>
      <p className="figure-note">円いテーブルを回しても、となりの人は変わらない。一列のならべ方 n! 通りのうち、回すと同じになる n 通りを 1 つとみるので、n! ÷ n ＝ (n−1)! 通り。</p>
    </div>
  );
}

// ---------- 4. 組合せとパスカルの三角形 ----------

export function Pascal() {
  const [n, setN] = useState(5);
  const [r0, setR] = useState(2);
  const r = Math.min(r0, n);
  const rows = 9;
  const dx = 38;
  const dy = 22;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 215" className="area-svg" style={{ maxWidth: 440 }}>
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: i + 1 }, (_, j) => {
            const x = 180 + (j - i / 2) * dx;
            const y = 14 + i * dy;
            const on = i === n && j === r;
            const parent = n > 0 && i === n - 1 && (j === r || j === r - 1);
            return (
              <g key={`${i}-${j}`}>
                {on && <circle cx={x} cy={y} r={14} fill={GOLD} />}
                {parent && <circle cx={x} cy={y} r={13} fill="none" stroke={BLUE} strokeWidth={2} />}
                <Label x={x} y={y} color={on ? '#1b1640' : i === n ? '#fff' : 'var(--muted)'} size={i >= 7 ? 10 : 11}>{nCr(i, j)}</Label>
              </g>
            );
          }),
        )}
      </svg>
      <div className="area-formula">
        <Tex>{`{}_{${n}}\\mathrm{C}_{${r}} = \\dfrac{{}_{${n}}\\mathrm{P}_{${r}}}{${r}!} = \\dfrac{${perm(n, r)}}{${fact(r)}} = ${nCr(n, r)}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="全体の数 n" value={n} min={1} max={8} onChange={setN} color={PURPLE} />
        <Slider label="選ぶ数 r" value={r} min={0} max={n} onChange={setR} color={GOLD} />
      </div>
      <p className="figure-note">組合せは「選ぶだけ（順番は関係ない）」。順列 nPr を、選んだ r 人のならべかえ r! でわる。三角形の数は、上の 2 つ（青丸）をたしたもの。左右対称なので nCr ＝ nC(n−r)。</p>
    </div>
  );
}

// ---------- 5. 最短経路 ----------

export function GridPath() {
  const [w, setW] = useState(4);
  const [h, setH] = useState(3);
  const U = Math.min(300 / w, 150 / h, 60);
  const ox = 30;
  const oy = 30 + h * U;
  const px = (i: number) => ox + i * U;
  const py = (j: number) => oy - j * U;
  // 例の道（右・上を交互に）
  const path: [number, number][] = [[0, 0]];
  let a = 0;
  let b = 0;
  while (a < w || b < h) {
    if (a < w && (a - b <= 0 || b >= h)) a++;
    else b++;
    path.push([a, b]);
  }
  return (
    <div className="figure">
      <svg viewBox={`0 0 360 ${oy + 30}`} className="area-svg" style={{ maxWidth: 440 }}>
        {Array.from({ length: h + 1 }, (_, j) => (
          <line key={`h${j}`} x1={px(0)} y1={py(j)} x2={px(w)} y2={py(j)} stroke="var(--line)" strokeWidth={2} />
        ))}
        {Array.from({ length: w + 1 }, (_, i) => (
          <line key={`v${i}`} x1={px(i)} y1={py(0)} x2={px(i)} y2={py(h)} stroke="var(--line)" strokeWidth={2} />
        ))}
        <polyline points={path.map(([i, j]) => `${px(i)},${py(j)}`).join(' ')} fill="none" stroke={PINK} strokeWidth={4} opacity={0.7} />
        {Array.from({ length: w + 1 }, (_, i) =>
          Array.from({ length: h + 1 }, (_, j) => {
            const end = i === w && j === h;
            return (
              <g key={`${i}-${j}`}>
                <circle cx={px(i)} cy={py(j)} r={end ? 13 : 10} fill={end ? GOLD : '#2a2555'} stroke={end ? GOLD : BLUE} />
                <Label x={px(i)} y={py(j)} color={end ? '#1b1640' : '#fff'} size={nCr(i + j, i) >= 100 ? 8 : 10}>{nCr(i + j, i)}</Label>
              </g>
            );
          }),
        )}
        <Label x={px(0)} y={py(0) + 20} color={GREEN} size={11}>スタート</Label>
        <Label x={px(w)} y={py(h) - 22} color={GOLD} size={11}>宝の家</Label>
      </svg>
      <div className="area-formula">
        <Tex>{`\\dfrac{${w + h}!}{${w}!\\,${h}!} = {}_{${w + h}}\\mathrm{C}_{${w}} = ${nCr(w + h, w)}\\ \\text{通り}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="右へ進む回数" value={w} min={1} max={6} onChange={setW} color={BLUE} />
        <Slider label="上へ進む回数" value={h} min={1} max={4} onChange={setH} color={GREEN} />
      </div>
      <p className="figure-note">最短の道は「→ を {w} 回、↑ を {h} 回」ならべたもの。{w + h} 回のうち、どこで → を選ぶかを決めればよい。交差点の数は「そこへ行く道の数」で、左と下の数をたしたもの。</p>
    </div>
  );
}

// ---------- 6. 2 つのさいころの表 ----------

export function DiceTable() {
  const [s, setS] = useState(7);
  const cell = 34;
  const ox = 60;
  const oy = 34;
  const hits: number[] = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) hits.push(a);
  const [nn, dd] = reduce(hits.length, 36);
  return (
    <div className="figure">
      <svg viewBox="0 0 360 255" className="area-svg" style={{ maxWidth: 400 }}>
        <Label x={ox + 3 * cell} y={12} color={BLUE} size={11}>大きいさいころ →</Label>
        <Label x={22} y={oy + 3 * cell} color={PINK} size={11}>小</Label>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <Label x={ox + i * cell + cell / 2} y={oy - 9} color={BLUE} size={12}>{i + 1}</Label>
            <Label x={ox - 12} y={oy + i * cell + cell / 2} color={PINK} size={12}>{i + 1}</Label>
          </g>
        ))}
        {Array.from({ length: 6 }, (_, j) =>
          Array.from({ length: 6 }, (_, i) => {
            const v = i + 1 + j + 1;
            const on = v === s;
            return (
              <g key={`${i}-${j}`}>
                <rect x={ox + i * cell + 1} y={oy + j * cell + 1} width={cell - 2} height={cell - 2} rx={5} fill={on ? GOLD : GRAY} opacity={on ? 1 : 0.5} />
                <Label x={ox + i * cell + cell / 2} y={oy + j * cell + cell / 2} color={on ? '#1b1640' : '#ddd'} size={12}>{v}</Label>
              </g>
            );
          }),
        )}
      </svg>
      <div className="area-formula">
        <Tex>{`P(\\text{和が } ${s}) = \\dfrac{${hits.length}}{36}${dd !== 36 ? ` = ${nn === 0 ? '0' : `\\dfrac{${nn}}{${dd}}`}` : ''}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="目の和" value={s} min={2} max={12} onChange={setS} color={GOLD} />
      </div>
      <p className="figure-note">大小 2 つのさいころの目の出方は 6 × 6 ＝ 36 通りで、どれも同じくらい起こりやすい（同様に確からしい）。和が 7 になる出方がいちばん多い。</p>
    </div>
  );
}

// ---------- 7. 反復試行 ----------

export function RepeatTrial() {
  const [n, setN] = useState(5);
  const [pd, setPd] = useState(2);
  const [k0, setK] = useState(2);
  const k = Math.min(k0, n);
  const p = 1 / pd;
  const probs = Array.from({ length: n + 1 }, (_, j) => nCr(n, j) * p ** j * (1 - p) ** (n - j));
  const maxP = Math.max(...probs);
  const x0 = 30;
  const x1 = 340;
  const base = 160;
  const bw = (x1 - x0) / (n + 1);
  const pTex = `\\dfrac{1}{${pd}}`;
  const qTex = `\\dfrac{${pd - 1}}{${pd}}`;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 190" className="area-svg" style={{ maxWidth: 440 }}>
        {probs.map((v, j) => {
          const h = (v / maxP) * 130;
          return (
            <g key={j}>
              <rect x={x0 + j * bw + 3} y={base - h} width={bw - 6} height={h} rx={3} fill={j === k ? PINK : PURPLE} opacity={j === k ? 1 : 0.55} />
              <text x={x0 + j * bw + bw / 2} y={base + 14} fontSize={11} fill="var(--muted)" textAnchor="middle">{j}</text>
              {j === k && <Label x={x0 + j * bw + bw / 2} y={base - h - 10} color={PINK} size={11}>{(v * 100).toFixed(1)}%</Label>}
            </g>
          );
        })}
        <line x1={x0} y1={base} x2={x1} y2={base} stroke="var(--muted)" />
        <Label x={x1} y={base + 26} color="var(--muted)" size={10} anchor="end">当たった回数</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`{}_{${n}}\\mathrm{C}_{${k}} \\left(${pTex}\\right)^{${k}} \\left(${qTex}\\right)^{${n - k}} = ${nCr(n, k)} \\times \\dfrac{${(pd - 1) ** (n - k)}}{${pd ** n}} = ${fracTex(nCr(n, k) * (pd - 1) ** (n - k), pd ** n)}`}</Tex>
      </div>
      <Toggle
        label="1 回の確率"
        value={pd}
        onChange={setPd}
        options={[
          { v: 2, text: '1/2' },
          { v: 3, text: '1/3' },
          { v: 6, text: '1/6' },
        ]}
      />
      <div className="sliders">
        <Slider label="くり返す回数 n" value={n} min={1} max={8} onChange={setN} color={PURPLE} />
        <Slider label="当たる回数 k" value={k} min={0} max={n} onChange={setK} color={PINK} />
      </div>
      <p className="figure-note">「n 回のうち、どの k 回で当たるか」が nCk 通り。どの並びも確率は (当たり)^k × (はずれ)^(n−k) で同じなので、かけ合わせる。</p>
    </div>
  );
}

// ---------- 8. 条件付き確率（面積図） ----------

export function CondProb() {
  const [pa, setPa] = useState(50);
  const [ra, setRa] = useState(75);
  const [rb, setRb] = useState(25);
  const S = 200;
  const ox = 20;
  const oy = 20;
  const wa = (S * pa) / 100;
  const ha = (S * ra) / 100;
  const hb = (S * rb) / 100;
  const pRedA = (pa / 100) * (ra / 100);
  const pRedB = (1 - pa / 100) * (rb / 100);
  const pRed = pRedA + pRedB;
  const post = pRed > 0 ? pRedA / pRed : 0;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 250" className="area-svg" style={{ maxWidth: 440 }}>
        <rect x={ox} y={oy} width={S} height={S} fill="#f8f9fa" opacity={0.12} stroke="var(--line)" />
        <rect x={ox} y={oy + S - ha} width={wa} height={ha} fill={PINK} opacity={0.85} />
        <rect x={ox + wa} y={oy + S - hb} width={S - wa} height={hb} fill={PINK} opacity={0.45} />
        <line x1={ox + wa} y1={oy} x2={ox + wa} y2={oy + S} stroke="#fff" strokeWidth={2} />
        <Label x={ox + wa / 2} y={oy + S + 14} color={BLUE} size={11}>箱A {pa}%</Label>
        <Label x={ox + wa + (S - wa) / 2} y={oy + S + 14} color={GREEN} size={11}>箱B {100 - pa}%</Label>
        <Label x={ox + wa / 2} y={oy + S - ha / 2} color="#1b1640" size={10}>{wa > 40 ? 'A で赤' : ''}</Label>
        <Label x={ox + wa + (S - wa) / 2} y={oy + S - hb / 2} color="#fff" size={10}>{S - wa > 40 && hb > 14 ? 'B で赤' : ''}</Label>
        <Label x={235} y={40} color="#fff" size={12} anchor="start">赤を引く確率</Label>
        <Label x={235} y={62} color={PINK} size={16} anchor="start">{(pRed * 100).toFixed(1)}%</Label>
        <Label x={235} y={104} color="#fff" size={12} anchor="start">赤だったとき、</Label>
        <Label x={235} y={122} color="#fff" size={12} anchor="start">箱A だった確率</Label>
        <Label x={235} y={146} color={GOLD} size={16} anchor="start">{(post * 100).toFixed(1)}%</Label>
        <Label x={235} y={180} color="var(--muted)" size={10} anchor="start">＝ 濃いピンク ÷</Label>
        <Label x={235} y={196} color="var(--muted)" size={10} anchor="start">　 ピンク全体</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`P_{\\text{赤}}(A) = \\dfrac{P(A \\cap \\text{赤})}{P(\\text{赤})} = \\dfrac{${pRedA.toFixed(3)}}{${pRed.toFixed(3)}}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label="箱A を選ぶ確率（%）" value={pa} min={10} max={90} step={5} onChange={setPa} color={BLUE} />
        <Slider label="箱A の赤玉の割合（%）" value={ra} min={0} max={100} step={5} onChange={setRa} color={PINK} />
        <Slider label="箱B の赤玉の割合（%）" value={rb} min={0} max={100} step={5} onChange={setRb} color={PINK} />
      </div>
      <p className="figure-note">正方形全体が「すべての場合」。「赤だった」とわかったら、世界はピンクの部分だけにせばまる。その中で箱A の部分がしめる割合が、条件付き確率。</p>
    </div>
  );
}

// ---------- 9. 期待値（くじ 100 本） ----------

export function Expectation() {
  const [x, setX] = useState(5);
  const [y, setY] = useState(20);
  const prize1 = 1000;
  const prize2 = 100;
  const fee = 100;
  const e = (prize1 * x + prize2 * y) / 100;
  const cell = 19;
  const ox = 85;
  const oy = 8;
  return (
    <div className="figure">
      <svg viewBox="0 0 360 205" className="area-svg" style={{ maxWidth: 420 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const kind = i < x ? 1 : i < x + y ? 2 : 0;
          const cx = ox + (i % 10) * cell;
          const cy = oy + Math.floor(i / 10) * cell;
          return <rect key={i} x={cx} y={cy} width={cell - 3} height={cell - 3} rx={3} fill={kind === 1 ? GOLD : kind === 2 ? '#adb5bd' : GRAY} opacity={kind ? 1 : 0.45} />;
        })}
        <rect x={6} y={20} width={14} height={14} rx={3} fill={GOLD} />
        <Label x={24} y={27} size={10} anchor="start">1等 {prize1}円</Label>
        <rect x={6} y={44} width={14} height={14} rx={3} fill="#adb5bd" />
        <Label x={24} y={51} size={10} anchor="start">2等 {prize2}円</Label>
        <rect x={6} y={68} width={14} height={14} rx={3} fill={GRAY} opacity={0.45} />
        <Label x={24} y={75} size={10} anchor="start">はずれ</Label>
      </svg>
      <div className="area-formula small-formula">
        <Tex>{`E = ${prize1} \\times \\dfrac{${x}}{100} + ${prize2} \\times \\dfrac{${y}}{100} + 0 \\times \\dfrac{${100 - x - y}}{100} = ${e}\\ \\text{円}`}</Tex>
      </div>
      <div className="area-formula small-formula" style={{ color: e >= fee ? GREEN : PINK }}>
        1 回 {fee} 円のくじなので、平均すると 1 回あたり {Math.abs(e - fee)} 円の{e >= fee ? 'とく' : 'そん'}{e === fee ? '（とくもそんもしない）' : ''}
      </div>
      <div className="sliders">
        <Slider label="1等の本数" value={x} min={0} max={10} onChange={setX} color={GOLD} />
        <Slider label="2等の本数" value={y} min={0} max={40} onChange={setY} color="#adb5bd" />
      </div>
      <p className="figure-note">100 本のくじの賞金を全部集めて、100 本で均等に分けたら 1 本いくら？ それが期待値（1 回あたりの平均）。くり返すほど、もらえる金額の平均は期待値に近づく。</p>
    </div>
  );
}
