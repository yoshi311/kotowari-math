import { useState } from 'react';
import { fmt } from '../../engine/format';
import { Tex } from '../RichText';
import { Slider } from './Slider';

// ---------- 因数分解：タイルを長方形に並べ直す ----------

const PUZZLES = [
  { n: 5, m: 6 },
  { n: 7, m: 12 },
  { n: 6, m: 8 },
  { n: 8, m: 15 },
  { n: 7, m: 10 },
  { n: 6, m: 9 },
];

export function FactorTiles() {
  const [pi, setPi] = useState(0);
  const [a, setA] = useState(1);
  const { n, m } = PUZZLES[pi];
  const b = n - a;
  const need = a * b;
  const ok = need === m;
  const U = 18;
  const X = 6; // x の長さ（見た目）
  const P = 30;
  const w = P + (X + n) * U + 10;
  const h = P + (X + n) * U + 10;

  const rect = (x: number, y: number, ww: number, hh: number, fill: string, label: string, grid = false) => (
    <g>
      <rect x={P + x * U} y={P + y * U} width={ww * U} height={hh * U} fill={fill} stroke="#1b1640" strokeWidth={2} />
      {grid &&
        Array.from({ length: ww * hh }, (_, i) => (
          <rect key={i} x={P + (x + (i % ww)) * U} y={P + (y + Math.floor(i / ww)) * U} width={U} height={U} fill="none" stroke="#1b1640" strokeOpacity={0.4} />
        ))}
      {ww > 0 && hh > 0 && (
        <text x={P + (x + ww / 2) * U} y={P + (y + hh / 2) * U} textAnchor="middle" dominantBaseline="central" className="piece-label" fontSize={ww * hh < 4 ? 10 : 14}>
          {label}
        </text>
      )}
    </g>
  );

  return (
    <div className="figure factor-tiles">
      <div className="area-formula">
        <Tex>{`${fmt([[1, 'x^2'], [n, 'x'], [m, '']])}`}</Tex>
        <span className="muted"> を長方形にしたい</span>
      </div>
      <div className="tile-stock">
        持っているタイル：<span className="tile tile-x2 mini">x²</span>×1　<span className="tile tile-x mini">x</span>×{n}
        <span className="tile tile-1 mini">1</span>×{m}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="area-svg" style={{ maxWidth: 320 }}>
        {rect(0, 0, X, X, '#9b5de5', 'x²')}
        {a > 0 && rect(X, 0, a, X, '#00bbf9', `${a === 1 ? '' : a}x`)}
        {b > 0 && rect(0, X, X, b, '#00bbf9', `${b === 1 ? '' : b}x`)}
        {a > 0 && b > 0 && rect(X, X, a, b, ok ? '#fee440' : '#ff8fab', String(need), true)}
        <text x={P + (X / 2) * U} y={P - 8} textAnchor="middle" fill="#c9b6ff" fontStyle="italic" fontWeight={800}>x</text>
        {a > 0 && <text x={P + (X + a / 2) * U} y={P - 8} textAnchor="middle" fill="#5fd3ff" fontWeight={800}>{a}</text>}
        <text x={P - 10} y={P + (X / 2) * U} textAnchor="middle" fill="#c9b6ff" fontStyle="italic" fontWeight={800}>x</text>
        {b > 0 && <text x={P - 10} y={P + (X + b / 2) * U} textAnchor="middle" fill="#5fd3ff" fontWeight={800}>{b}</text>}
      </svg>
      <div className={`budget-status ${ok ? 'ok' : 'ng'}`}>
        {ok ? (
          <>
            ✓ ぴったり！ <Tex>{`${fmt([[1, 'x^2'], [n, 'x'], [m, '']])} = (x+${a})(x+${b})`}</Tex>
          </>
        ) : (
          <>すみに必要な 1 タイル：{a}×{b} = {need} 個（持っているのは {m} 個）</>
        )}
      </div>
      <div className="sliders">
        <Slider label="右に置く x の数" value={a} min={1} max={n - 1} onChange={setA} color="#00bbf9" />
      </div>
      <button className="btn small ghost" onClick={() => (setPi((i) => (i + 1) % PUZZLES.length), setA(1))}>
        別の式でためす
      </button>
      <p className="figure-note">
        右と下に分けた細長いタイルの数は「たして {n}」、すみの小さいタイルは「かけて {m}」。この2つを同時に満たす分け方が答え！
      </p>
    </div>
  );
}

// ---------- √：面積から一辺を求める ----------

function bigSquareFactor(n: number): [number, number] {
  for (let k = Math.floor(Math.sqrt(n)); k >= 1; k--) if (n % (k * k) === 0) return [k, n / (k * k)];
  return [1, n];
}

export function SqrtSquare() {
  const [n, setN] = useState(12);
  const [k, rest] = bigSquareFactor(n);
  const side = Math.sqrt(n);
  const S = 200;
  const scale = S / Math.sqrt(50);
  const L = side * scale;
  const cell = L / k;
  const simplified = k === 1 ? `\\sqrt{${n}}` : rest === 1 ? `${k}` : `${k}\\sqrt{${rest}}`;
  return (
    <div className="figure">
      <svg viewBox={`0 0 ${S + 60} ${L + 40}`} className="area-svg" style={{ maxWidth: 300 }}>
        <rect x={40} y={10} width={L} height={L} fill="#9b5de5" fillOpacity={0.85} stroke="#1b1640" strokeWidth={2} />
        {k > 1 &&
          Array.from({ length: k * k }, (_, i) => (
            <rect key={i} x={40 + (i % k) * cell} y={10 + Math.floor(i / k) * cell} width={cell} height={cell} fill="none" stroke="#fee440" strokeWidth={1.5} />
          ))}
        <text x={40 + L / 2} y={10 + L / 2} textAnchor="middle" dominantBaseline="central" fontWeight={800} fill="#fff" fontSize={14}>
          面積 {n}
        </text>
        <text x={40 + L / 2} y={10 + L + 22} textAnchor="middle" fill="var(--accent)" fontWeight={800} fontSize={13}>
          一辺 = √{n} ≒ {side.toFixed(3)}
        </text>
      </svg>
      <div className="area-formula">
        <Tex>{`\\sqrt{${n}} = ${simplified}`}</Tex>
      </div>
      {k > 1 && rest > 1 && (
        <p className="figure-note" style={{ textAlign: 'center' }}>
          面積 {rest} の小さな正方形が {k}×{k} 個 → 一辺は「√{rest} が {k} 個ぶん」= <Tex>{`${k}\\sqrt{${rest}}`}</Tex>
        </p>
      )}
      <div className="sliders">
        <Slider label="面積" value={n} min={1} max={50} onChange={setN} />
      </div>
      <p className="figure-note">√ は「面積がわかっているとき、正方形の一辺の長さ」を表す記号。2乗すると中身になる、正の数。</p>
    </div>
  );
}

// ---------- 集合：ベン図 ----------

const U_ALL = Array.from({ length: 12 }, (_, i) => i + 1);
const inA = (v: number) => v % 2 === 0;
const inB = (v: number) => v % 3 === 0;

type Op = 'and' | 'or' | 'notA' | 'aNotB' | 'notOr' | 'notAnotB';
const OPS: { op: Op; tex: string; test: (v: number) => boolean }[] = [
  { op: 'and', tex: 'A \\cap B', test: (v) => inA(v) && inB(v) },
  { op: 'or', tex: 'A \\cup B', test: (v) => inA(v) || inB(v) },
  { op: 'notA', tex: '\\overline{A}', test: (v) => !inA(v) },
  { op: 'aNotB', tex: 'A \\cap \\overline{B}', test: (v) => inA(v) && !inB(v) },
  { op: 'notOr', tex: '\\overline{A \\cup B}', test: (v) => !(inA(v) || inB(v)) },
  { op: 'notAnotB', tex: '\\overline{A} \\cap \\overline{B}', test: (v) => !inA(v) && !inB(v) },
];

// 各領域の中での数の置き場所
const SLOTS: Record<string, [number, number][]> = {
  a: [[70, 80], [95, 115], [70, 140], [95, 165]],
  ab: [[165, 105], [165, 150]],
  b: [[245, 105], [245, 150]],
  out: [[22, 30], [318, 30], [22, 205], [318, 205]],
};

export function Venn() {
  const [op, setOp] = useState<Op>('and');
  const cur = OPS.find((o) => o.op === op)!;
  const counters: Record<string, number> = { a: 0, ab: 0, b: 0, out: 0 };
  const pos = U_ALL.map((v) => {
    const key = inA(v) && inB(v) ? 'ab' : inA(v) ? 'a' : inB(v) ? 'b' : 'out';
    return { v, p: SLOTS[key][counters[key]++] };
  });
  const members = U_ALL.filter(cur.test);

  // 塗る範囲は mask で作る（白＝塗る、黒＝塗らない）。A∩B だけは「B を A の形で切り抜く」
  const outside = op === 'notA' || op === 'notOr' || op === 'notAnotB';
  const whiteA = op === 'or' || op === 'aNotB';
  const whiteB = op === 'or';
  const blackA = outside;
  const blackB = op === 'aNotB' || op === 'notOr' || op === 'notAnotB';
  return (
    <div className="figure">
      <svg viewBox="0 0 340 230" className="area-svg" style={{ maxWidth: 380 }}>
        <defs>
          <clipPath id="clipA">
            <circle cx={125} cy={125} r={85} />
          </clipPath>
          <mask id="vennMask">
            <rect width={340} height={230} fill={outside ? 'white' : 'black'} />
            {whiteA && <circle cx={125} cy={125} r={85} fill="white" />}
            {whiteB && <circle cx={215} cy={125} r={85} fill="white" />}
            {blackA && <circle cx={125} cy={125} r={85} fill="black" />}
            {blackB && <circle cx={215} cy={125} r={85} fill="black" />}
          </mask>
        </defs>
        <rect x={2} y={2} width={336} height={226} rx={10} fill="none" stroke="var(--muted)" strokeWidth={2} />
        <text x={14} y={20} fill="var(--muted)" fontSize={13} fontWeight={800}>U</text>
        {op === 'and' ? (
          <circle cx={215} cy={125} r={85} fill="var(--accent)" opacity={0.4} clipPath="url(#clipA)" />
        ) : (
          <rect width={340} height={230} fill="var(--accent)" opacity={0.4} mask="url(#vennMask)" />
        )}
        <circle cx={125} cy={125} r={85} fill="none" stroke="#f15bb5" strokeWidth={3} />
        <circle cx={215} cy={125} r={85} fill="none" stroke="#00bbf9" strokeWidth={3} />
        <text x={60} y={50} fill="#f15bb5" fontWeight={800}>A（2の倍数）</text>
        <text x={205} y={50} fill="#00bbf9" fontWeight={800}>B（3の倍数）</text>
        {pos.map(({ v, p }) => (
          <text key={v} x={p[0]} y={p[1]} textAnchor="middle" dominantBaseline="central" fontWeight={800} fontSize={15} fill={cur.test(v) ? '#fff' : 'var(--muted)'}>
            {v}
          </text>
        ))}
      </svg>
      <div className="row-buttons venn-ops">
        {OPS.map((o) => (
          <button key={o.op} className={`btn small ${op === o.op ? '' : 'ghost'}`} onClick={() => setOp(o.op)}>
            <Tex>{o.tex}</Tex>
          </button>
        ))}
      </div>
      <div className="area-formula">
        <Tex>{`${cur.tex} = \\{${members.join(',\\ ')}\\},\\quad n(${cur.tex}) = ${members.length}`}</Tex>
      </div>
      <p className="figure-note">U は 1〜12 の整数全体。ぬられた部分に入る数が、その集合の要素。<Tex>{'\\overline{A \\cup B}'}</Tex> と <Tex>{'\\overline{A} \\cap \\overline{B}'}</Tex> を見比べてみよう（ド・モルガンの法則）。</p>
    </div>
  );
}

// ---------- 必要条件・十分条件：小さい円は大きい円の中 ----------

const NESTED = [
  { p: '東京都に住んでいる', q: '日本に住んでいる', counter: '大阪府に住んでいる人' },
  { p: '$x = 2$', q: '$x^2 = 4$', counter: '$x = -2$' },
  { p: '四角形が正方形', q: '四角形が長方形', counter: '細長い長方形' },
  { p: '$x > 3$', q: '$x > 1$', counter: '$x = 2$' },
];

export function Nested({ renderText }: { renderText: (s: string) => React.ReactNode }) {
  const [i, setI] = useState(0);
  const [rev, setRev] = useState(false);
  const ex = NESTED[i];
  return (
    <div className="figure">
      <svg viewBox="0 0 340 200" className="area-svg" style={{ maxWidth: 380 }}>
        <ellipse cx={170} cy={105} rx={150} ry={88} fill="#00bbf9" fillOpacity={0.18} stroke="#00bbf9" strokeWidth={3} />
        <ellipse cx={130} cy={115} rx={70} ry={50} fill="#f15bb5" fillOpacity={0.3} stroke="#f15bb5" strokeWidth={3} />
        <text x={250} y={45} fill="#00bbf9" fontWeight={800} fontSize={16}>Q</text>
        <text x={125} y={120} fill="#f15bb5" fontWeight={800} fontSize={16} textAnchor="middle">P</text>
        {rev && (
          <g className="pop-in">
            <circle cx={260} cy={120} r={8} fill="var(--accent)" />
            <text x={260} y={146} textAnchor="middle" fill="var(--accent)" fontSize={12} fontWeight={800}>反例</text>
          </g>
        )}
      </svg>
      <div className="nested-text">
        <div>
          <span className="tag-p">p</span> {renderText(ex.p)}
        </div>
        <div>
          <span className="tag-q">q</span> {renderText(ex.q)}
        </div>
      </div>
      <div className="area-formula">
        {rev ? (
          <span>
            <Tex>{'q \\Longrightarrow p'}</Tex> は<strong className="bad">偽</strong>（反例：{renderText(ex.counter)}）
          </span>
        ) : (
          <span>
            <Tex>{'p \\Longrightarrow q'}</Tex> は<strong className="good">真</strong>（P は Q の中にすっぽり入っている）
          </span>
        )}
      </div>
      <div className="row-buttons">
        <button className="btn small" onClick={() => setRev((v) => !v)}>
          {rev ? 'p ⇒ q にもどす' : '逆向き（q ⇒ p）は？'}
        </button>
        <button className="btn small ghost" onClick={() => (setI((v) => (v + 1) % NESTED.length), setRev(false))}>
          別の例
        </button>
      </div>
      <p className="figure-note">
        小さい円 P が大きい円 Q の中に入っているとき、p ⇒ q は真。このとき <strong>p は q であるための十分条件</strong>（p なら十分）、
        <strong>q は p であるための必要条件</strong>（p であるには q が必要）。
      </p>
    </div>
  );
}

// ---------- 逆・裏・対偶 ----------

const CONTRA = [
  {
    p: 'x = 2',
    q: 'x^2 = 4',
    np: 'x \\neq 2',
    nq: 'x^2 \\neq 4',
    truth: { orig: true, conv: false, inv: false, contra: true },
    note: '逆「$x^2 = 4$ ならば $x = 2$」は、$x = -2$ が反例で偽。',
  },
  {
    p: '\\text{雨が降った}',
    q: '\\text{地面がぬれている}',
    np: '\\text{雨が降らなかった}',
    nq: '\\text{地面がぬれていない}',
    truth: { orig: true, conv: false, inv: false, contra: true },
    note: '逆「地面がぬれているならば雨が降った」は、水まきをしただけかもしれないので偽。',
  },
];

export function Contra({ renderText }: { renderText: (s: string) => React.ReactNode }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const ex = CONTRA[i];
  const cards: { key: keyof typeof ex.truth; name: string; tex: string; cls: string }[] = [
    { key: 'orig', name: 'もとの命題', tex: `${ex.p} \\Rightarrow ${ex.q}`, cls: 'c-orig' },
    { key: 'conv', name: '逆', tex: `${ex.q} \\Rightarrow ${ex.p}`, cls: 'c-conv' },
    { key: 'inv', name: '裏', tex: `${ex.np} \\Rightarrow ${ex.nq}`, cls: 'c-inv' },
    { key: 'contra', name: '対偶', tex: `${ex.nq} \\Rightarrow ${ex.np}`, cls: 'c-contra' },
  ];
  return (
    <div className="figure">
      <div className="contra-grid">
        {cards.map((c) => (
          <button key={c.key} className={`contra-card ${c.cls} ${open[c.key] ? 'open' : ''}`} onClick={() => setOpen((o) => ({ ...o, [c.key]: !o[c.key] }))}>
            <span className="contra-name">{c.name}</span>
            <Tex>{c.tex}</Tex>
            <span className={`contra-truth ${open[c.key] ? (ex.truth[c.key] ? 'good' : 'bad') : ''}`}>
              {open[c.key] ? (ex.truth[c.key] ? '真' : '偽') : 'タップで真偽'}
            </span>
          </button>
        ))}
      </div>
      {Object.keys(open).length >= 4 && <p className="figure-note pop-in">{renderText(ex.note)}</p>}
      <button className="btn small ghost" onClick={() => (setI((v) => (v + 1) % CONTRA.length), setOpen({}))}>
        別の例
      </button>
      <p className="figure-note">
        <strong>もとの命題と対偶</strong>は、真偽がいつも一致する（左上と右下）。逆と裏も、たがいに対偶の関係なので真偽が一致する。
      </p>
    </div>
  );
}
