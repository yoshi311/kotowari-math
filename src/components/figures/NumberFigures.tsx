import { useState, type ReactNode } from 'react';
import { Tex } from '../RichText';
import { Slider } from './Slider';

// ---------- 共通の数直線 ----------

const W = 360;
const PADX = 34; // 端の目もりの数字が切れないよう余白を多めに

function makeX(min: number, max: number) {
  return (v: number) => PADX + ((v - min) / (max - min)) * (W - 2 * PADX);
}

function Axis({ min, max, y, step = 1, labelEvery = 1, fmt = (v: number) => String(v) }: { min: number; max: number; y: number; step?: number; labelEvery?: number; fmt?: (v: number) => string }) {
  const x = makeX(min, max);
  const ticks: number[] = [];
  const n = Math.round((max - min) / step);
  for (let i = 0; i <= n; i++) ticks.push(min + i * step);
  return (
    <g>
      <line x1={PADX - 10} y1={y} x2={W - PADX + 10} y2={y} stroke="var(--muted)" strokeWidth={2} markerEnd="url(#arrow)" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={x(t)} y1={y - 5} x2={x(t)} y2={y + 5} stroke="var(--muted)" strokeWidth={Math.abs(t) < 1e-9 ? 3 : 1.5} />
          {i % labelEvery === 0 && (
            <text x={x(t)} y={y + 20} textAnchor="middle" fontSize={11} fill={Math.abs(t) < 1e-9 ? 'var(--accent)' : 'var(--muted)'}>
              {fmt(t)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
      </marker>
    </defs>
  );
}

function Svg({ h, children }: { h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="nl-svg" role="img" aria-label="数直線">
      <ArrowDefs />
      {children}
    </svg>
  );
}

function Dot({ x, y, color, label, open = false }: { x: number; y: number; color: string; label?: string; open?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={open ? 'var(--bg2)' : color} stroke={color} strokeWidth={3} />
      {label && (
        <text x={x} y={y - 14} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

// ---------- 絶対値：0 からの距離 / 2 点の距離 / 範囲 ----------

export function AbsLine({ mode }: { mode: 'zero' | 'two' | 'range' }) {
  const [a, setA] = useState(-5);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);
  const [r, setR] = useState(3);
  const [inside, setInside] = useState(true);
  const min = -10;
  const max = 10;
  const x = makeX(min, max);
  const y = 70;

  if (mode === 'zero') {
    return (
      <div className="figure">
        <Svg h={100}>
          <Axis min={min} max={max} y={y} labelEvery={2} />
          <line x1={x(0)} y1={y - 22} x2={x(a)} y2={y - 22} stroke="var(--accent)" strokeWidth={4} />
          <text x={(x(0) + x(a)) / 2} y={y - 30} textAnchor="middle" fill="var(--accent)" fontWeight={800} fontSize={13}>
            距離 {Math.abs(a)}
          </text>
          <Dot x={x(a)} y={y} color="#f15bb5" label={`a=${a}`} />
        </Svg>
        <div className="area-formula">
          <Tex>{`|${a}| = ${Math.abs(a)}`}</Tex>
        </div>
        <div className="sliders">
          <Slider label={<Tex>a</Tex>} value={a} min={min} max={max} onChange={setA} color="#f15bb5" />
        </div>
        <p className="figure-note">マイナスの数でも、0 からの「距離」はプラス。絶対値は「向きを忘れて、遠さだけを見る」ものさし。</p>
      </div>
    );
  }

  if (mode === 'two') {
    return (
      <div className="figure">
        <Svg h={100}>
          <Axis min={min} max={max} y={y} labelEvery={2} />
          <line x1={x(a)} y1={y - 22} x2={x(b)} y2={y - 22} stroke="var(--accent)" strokeWidth={4} />
          <text x={(x(a) + x(b)) / 2} y={y - 30} textAnchor="middle" fill="var(--accent)" fontWeight={800} fontSize={13}>
            距離 {Math.abs(a - b)}
          </text>
          <Dot x={x(a)} y={y} color="#f15bb5" label="A" />
          <Dot x={x(b)} y={y} color="#00bbf9" label="B" />
        </Svg>
        <div className="area-formula">
          <Tex>{`AB = |${a} - (${b})| = |${a - b}| = ${Math.abs(a - b)}`}</Tex>
        </div>
        <div className="sliders">
          <Slider label={<>A の位置</>} value={a} min={min} max={max} onChange={setA} color="#f15bb5" />
          <Slider label={<>B の位置</>} value={b} min={min} max={max} onChange={setB} color="#00bbf9" />
        </div>
        <p className="figure-note">どちらから引いても、絶対値をつければ同じ距離になる。</p>
      </div>
    );
  }

  // range: |x - c| < r または > r
  const lo = c - r;
  const hi = c + r;
  return (
    <div className="figure">
      <Svg h={110}>
        <Axis min={min} max={max} y={y} labelEvery={2} />
        {inside ? (
          <line x1={x(lo)} y1={y} x2={x(hi)} y2={y} stroke="var(--good)" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
        ) : (
          <>
            <line x1={x(min) - 10} y1={y} x2={x(lo)} y2={y} stroke="var(--good)" strokeWidth={8} opacity={0.8} />
            <line x1={x(hi)} y1={y} x2={x(max) + 10} y2={y} stroke="var(--good)" strokeWidth={8} opacity={0.8} />
          </>
        )}
        <line x1={x(c)} y1={y - 24} x2={x(hi)} y2={y - 24} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 3" />
        <line x1={x(c)} y1={y - 24} x2={x(lo)} y2={y - 24} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 3" />
        <text x={(x(c) + x(hi)) / 2} y={y - 30} textAnchor="middle" fill="var(--accent)" fontSize={12}>r={r}</text>
        <text x={(x(c) + x(lo)) / 2} y={y - 30} textAnchor="middle" fill="var(--accent)" fontSize={12}>r={r}</text>
        <Dot x={x(lo)} y={y} color="var(--good)" open />
        <Dot x={x(hi)} y={y} color="var(--good)" open />
        <Dot x={x(c)} y={y} color="#f15bb5" label={`中心 ${c}`} />
      </Svg>
      <div className="area-formula">
        <Tex>
          {inside
            ? `|x - (${c})| < ${r} \\iff ${lo} < x < ${hi}`
            : `|x - (${c})| > ${r} \\iff x < ${lo},\\ ${hi} < x`}
        </Tex>
      </div>
      <div className="sliders">
        <Slider label="中心 c" value={c} min={-5} max={5} onChange={setC} color="#f15bb5" />
        <Slider label="距離 r" value={r} min={1} max={5} onChange={setR} color="var(--accent)" />
      </div>
      <button className="btn small ghost" onClick={() => setInside((v) => !v)}>
        {inside ? '「r より遠い」にする（>）' : '「r より近い」にする（<）'}
      </button>
      <p className="figure-note">
        <Tex>{'|x - c|'}</Tex> は「<Tex>x</Tex> と <Tex>c</Tex> の距離」。「距離が r より小さい」は、中心から左右に r 以内の範囲になる。
      </p>
    </div>
  );
}

// ---------- √2 にズームイン ----------

export function SqrtZoom() {
  const [n, setN] = useState(2);
  const [level, setLevel] = useState(0);
  const root = Math.sqrt(n);
  const step = Math.pow(10, -level);
  const lo = Math.floor(root / step) * step;
  const hi = lo + step;
  const sub = step / 10;
  const x = makeX(lo, hi);
  const dec = level + 1;
  const f = (v: number) => v.toFixed(dec);
  const lo2 = Math.floor(root / sub) * sub;
  const hi2 = lo2 + sub;

  return (
    <div className="figure">
      <div className="row-buttons" style={{ margin: '0 0 6px' }}>
        {[2, 3, 5].map((k) => (
          <button key={k} className={`btn small ${n === k ? '' : 'ghost'}`} onClick={() => (setN(k), setLevel(0))}>
            √{k}
          </button>
        ))}
      </div>
      <Svg h={110}>
        <Axis min={lo} max={hi} y={70} step={sub} labelEvery={5} fmt={f} />
        <rect x={x(lo2)} y={60} width={x(hi2) - x(lo2)} height={20} fill="var(--accent)" opacity={0.25} />
        <Dot x={x(root)} y={70} color="#f15bb5" label={`√${n}`} />
      </Svg>
      <div className="area-formula">
        <Tex>{`${lo2.toFixed(dec + 0)}^2 = ${(lo2 * lo2).toFixed(2 * dec)} < ${n} < ${(hi2 * hi2).toFixed(2 * dec)} = ${hi2.toFixed(dec)}^2`}</Tex>
      </div>
      <div className="area-formula">
        <Tex>{`\\sqrt{${n}} = ${root.toFixed(level + 2)}\\cdots`}</Tex>
      </div>
      <div className="row-buttons">
        <button className="btn small" disabled={level >= 4} onClick={() => setLevel((l) => l + 1)}>
          🔍 黄色の範囲にズームイン
        </button>
        <button className="btn small ghost" disabled={level === 0} onClick={() => setLevel(0)}>
          最初にもどす
        </button>
      </div>
      <p className="figure-note">何回ズームしても、ぴったりの目もりには止まらない。小数がくり返しもせず、終わりもせずに続く数を「無理数」という。</p>
    </div>
  );
}

// ---------- 予算と不等式 ----------

export function Budget({ unit, base, limit }: { unit: number; base: number; limit: number }) {
  const [n, setN] = useState(3);
  const cost = unit * n + base;
  const ok = cost <= limit;
  const maxN = Math.floor((limit - base) / unit);
  const range = maxN + 4;
  const x = makeX(0, range);
  // 代金（左の皿）が予算より軽いと左が上がる（SVG の回転は正の角度で時計回り）
  const tilt = Math.max(-12, Math.min(12, ((limit - cost) / limit) * 40));
  return (
    <div className="figure">
      <svg viewBox="0 0 360 130" className="nl-svg" aria-label="てんびん">
        <polygon points="180,120 165,128 195,128" fill="var(--muted)" />
        <rect x="177" y="40" width="6" height="82" fill="var(--muted)" />
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '180px 40px', transition: 'transform .4s' }}>
          <rect x="50" y="37" width="260" height="6" rx="3" fill="var(--muted)" />
          <line x1="80" y1="40" x2="80" y2="70" stroke="var(--muted)" />
          <line x1="280" y1="40" x2="280" y2="70" stroke="var(--muted)" />
          <rect x="35" y="70" width="90" height="34" rx="6" fill="#f15bb5" />
          <text x="80" y="92" textAnchor="middle" fontWeight={800} fill="#1b1640" fontSize={14}>代金 {cost}円</text>
          <rect x="235" y="70" width="90" height="34" rx="6" fill="var(--accent2)" />
          <text x="280" y="92" textAnchor="middle" fontWeight={800} fill="#1b1640" fontSize={14}>予算 {limit}円</text>
        </g>
      </svg>
      <div className={`budget-status ${ok ? 'ok' : 'ng'}`}>{ok ? '✓ 予算内！' : '✗ 予算オーバー'}</div>
      <Svg h={70}>
        <Axis min={0} max={range} y={35} />
        {Array.from({ length: range + 1 }, (_, i) => (
          <circle key={i} cx={x(i)} cy={35} r={5} fill={unit * i + base <= limit ? 'var(--good)' : 'var(--bad)'} opacity={0.85} />
        ))}
        <circle cx={x(n)} cy={35} r={9} fill="none" stroke="var(--accent)" strokeWidth={3} />
      </Svg>
      <div className="area-formula">
        <Tex>{`${unit}x + ${base} \\le ${limit} \\quad (x = ${n} \\text{ のとき } ${cost} ${ok ? '\\le' : '>'} ${limit})`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<>個数 <Tex>x</Tex></>} value={n} min={0} max={range} onChange={setN} />
      </div>
      <p className="figure-note">緑の点が「予算内」になる個数。不等式を解くことは、この緑の範囲の境目を一度に見つけること。</p>
    </div>
  );
}

// ---------- 負の数をかけると向きが逆になる ----------

export function FlipLine() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [k, setK] = useState(-2);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const ka = k * lo;
  const kb = k * hi;
  const x = makeX(-12, 12);
  const sym = (p: number, q: number) => (p < q ? '<' : p > q ? '>' : '=');
  return (
    <div className="figure">
      <Svg h={180}>
        <text x={8} y={36} fontSize={12} fill="var(--muted)">かける前</text>
        <Axis min={-12} max={12} y={60} labelEvery={4} />
        <Dot x={x(lo)} y={60} color="#f15bb5" label="a" />
        <Dot x={x(hi)} y={60} color="#00bbf9" label="b" />
        <text x={8} y={116} fontSize={12} fill="var(--muted)">{k} をかけた後</text>
        <Axis min={-12} max={12} y={140} labelEvery={4} />
        <Dot x={x(ka)} y={140} color="#f15bb5" label={`${k}a`} />
        <Dot x={x(kb)} y={140} color="#00bbf9" label={`${k}b`} />
      </Svg>
      <div className="area-formula">
        <Tex>{`a ${sym(lo, hi)} b \\quad\\Longrightarrow\\quad ${k}a ${sym(ka, kb)} ${k}b`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<Tex>a</Tex>} value={a} min={-4} max={4} onChange={setA} color="#f15bb5" />
        <Slider label={<Tex>b</Tex>} value={b} min={-4} max={4} onChange={setB} color="#00bbf9" />
        <Slider label="かける数" value={k} min={-3} max={3} onChange={(v) => setK(v === 0 ? 1 : v)} />
      </div>
      <p className="figure-note">負の数をかけると、数直線が 0 を中心に「裏返し」になる。だから大小の向き（不等号）が逆になる。</p>
    </div>
  );
}
