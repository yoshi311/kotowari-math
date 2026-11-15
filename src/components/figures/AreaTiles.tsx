import { useState } from 'react';
import { fmt } from '../../engine/format';
import { Tex } from '../RichText';
import { Slider } from './Slider';

// かけ算＝長方形の面積。長方形を切り分けると「展開」になる。

const U = 22; // 1 目もりの大きさ（px）
const PAD = 34;

const C = {
  sq: '#9b5de5',
  a: '#00bbf9',
  b: '#f15bb5',
  ab: '#fee440',
};

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  grid?: boolean;
  mistake?: boolean;
  style?: React.CSSProperties;
}

function Rect({ p }: { p: Piece }) {
  const X = PAD + p.x * U;
  const Y = PAD + p.y * U;
  const W = p.w * U;
  const H = p.h * U;
  return (
    <g className="piece" style={p.style}>
      <rect x={X} y={Y} width={W} height={H} fill={p.color} fillOpacity={0.85} stroke="#1b1640" strokeWidth={2} rx={2} />
      {p.grid &&
        Array.from({ length: p.w * p.h }, (_, i) => (
          <rect
            key={i}
            x={X + (i % p.w) * U}
            y={Y + Math.floor(i / p.w) * U}
            width={U}
            height={U}
            fill="none"
            stroke="#1b1640"
            strokeOpacity={0.35}
          />
        ))}
      {p.mistake && (
        <rect x={X + 3} y={Y + 3} width={W - 6} height={H - 6} fill="none" stroke="#ff3b3b" strokeWidth={3} strokeDasharray="6 4" className="blink" />
      )}
      <text x={X + W / 2} y={Y + H / 2} textAnchor="middle" dominantBaseline="central" className="piece-label" fontSize={Math.min(W, H) < 30 ? 11 : 16}>
        {p.label}
      </text>
    </g>
  );
}

function Dim({ x1, y1, x2, y2, text, color }: { x1: number; y1: number; x2: number; y2: number; text: string; color: string }) {
  const vertical = x1 === x2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <text
        x={vertical ? mx - 12 : mx}
        y={vertical ? my : my - 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontWeight={700}
        fontSize={15}
        fontStyle="italic"
      >
        {text}
      </text>
    </g>
  );
}

const sup = (n: number) => (n === 1 ? '' : String(n));

export function AreaTiles({ mode, showMistake = false }: { mode: 'mono' | 'binomial' | 'square' | 'diffsq'; showMistake?: boolean }) {
  const [x, setX] = useState(6);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [mistake, setMistake] = useState(false);
  const [moved, setMoved] = useState(false);

  const bb = mode === 'square' ? a : b;
  // 横幅は固定（スライダーを動かしても縮尺が変わらない）。高さは今の図に合わせる
  const maxW = 9 + 5;
  const curH = mode === 'mono' || mode === 'diffsq' ? x : x + bb;
  const vbW = PAD + maxW * U + 10;
  const vbH = PAD + curH * U + 14;

  let pieces: Piece[] = [];
  let dims: React.ReactNode = null;
  let formula = '';

  if (mode === 'mono') {
    pieces = [
      { x: 0, y: 0, w: x, h: x, color: C.sq, label: 'x²' },
      { x: x, y: 0, w: a, h: x, color: C.a, label: `${a}x` },
    ];
    dims = (
      <>
        <Dim x1={PAD} y1={PAD - 8} x2={PAD + x * U} y2={PAD - 8} text="x" color={C.sq} />
        <Dim x1={PAD + x * U + 4} y1={PAD - 8} x2={PAD + (x + a) * U} y2={PAD - 8} text={String(a)} color={C.a} />
        <Dim x1={PAD - 8} y1={PAD} x2={PAD - 8} y2={PAD + x * U} text="x" color={C.sq} />
      </>
    );
    formula = `x(x+${a}) = x^2 + ${a}x`;
  } else if (mode === 'binomial' || mode === 'square') {
    const isSq = mode === 'square';
    pieces = [
      { x: 0, y: 0, w: x, h: x, color: C.sq, label: 'x²' },
      { x: x, y: 0, w: a, h: x, color: C.a, label: `${sup(a)}x`, mistake: isSq && mistake },
      { x: 0, y: x, w: x, h: bb, color: isSq ? C.a : C.b, label: `${sup(bb)}x`, mistake: isSq && mistake },
      { x: x, y: x, w: a, h: bb, color: C.ab, label: String(a * bb), grid: true },
    ];
    dims = (
      <>
        <Dim x1={PAD} y1={PAD - 8} x2={PAD + x * U} y2={PAD - 8} text="x" color={C.sq} />
        <Dim x1={PAD + x * U + 4} y1={PAD - 8} x2={PAD + (x + a) * U} y2={PAD - 8} text={String(a)} color={C.a} />
        <Dim x1={PAD - 8} y1={PAD} x2={PAD - 8} y2={PAD + x * U} text="x" color={C.sq} />
        <Dim x1={PAD - 8} y1={PAD + x * U + 4} x2={PAD - 8} y2={PAD + (x + bb) * U} text={String(bb)} color={isSq ? C.a : C.b} />
      </>
    );
    formula = isSq
      ? `(x+${a})^2 = x^2 + ${a}x + ${a}x + ${a * a} = ${fmt([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])}`
      : `(x+${a})(x+${bb}) = x^2 + ${a}x + ${bb}x + ${a * bb} = ${fmt([[1, 'x^2'], [a + bb, 'x'], [a * bb, '']])}`;
  } else {
    // diffsq: x^2 - a^2 の L 字を切って並べかえると (x+a)(x-a) の長方形になる
    const aa = Math.min(a, x - 1);
    pieces = [
      { x: 0, y: 0, w: x, h: x - aa, color: C.sq, label: `x(x−${aa})` },
      {
        x: 0,
        y: x - aa,
        w: x - aa,
        h: aa,
        color: C.a,
        label: `${aa}(x−${aa})`,
        style: {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transition: 'transform 0.9s cubic-bezier(.5,-0.3,.4,1.3)',
          // 中心を軸に90°回転してから、上の長方形の右側へ移動する
          // 移動前の中心 ((x-a)/2, x-a/2) → 移動後の中心 (x+a/2, (x-a)/2)
          transform: moved
            ? `translate(${(x + aa / 2 - (x - aa) / 2) * U}px, ${((x - aa) / 2 - (x - aa / 2)) * U}px) rotate(90deg)`
            : 'none',
        },
      },
    ];
    dims = moved ? (
      <>
        <Dim x1={PAD} y1={PAD - 8} x2={PAD + (x + aa) * U} y2={PAD - 8} text={`x+${aa}`} color={C.sq} />
        <Dim x1={PAD - 8} y1={PAD} x2={PAD - 8} y2={PAD + (x - aa) * U} text={`x−${aa}`} color={C.sq} />
      </>
    ) : (
      <>
        <Dim x1={PAD} y1={PAD - 8} x2={PAD + x * U} y2={PAD - 8} text="x" color={C.sq} />
        <Dim x1={PAD - 8} y1={PAD} x2={PAD - 8} y2={PAD + x * U} text="x" color={C.sq} />
      </>
    );
    formula = moved ? `(x+${aa})(x-${aa})` : `x^2 - ${aa}^2 = x^2 - ${aa * aa}`;
  }

  return (
    <div className="figure area-tiles">
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="area-svg" role="img" aria-label="面積図">
        {mode === 'diffsq' && !moved && (
          <rect
            x={PAD + (x - Math.min(a, x - 1)) * U}
            y={PAD + (x - Math.min(a, x - 1)) * U}
            width={Math.min(a, x - 1) * U}
            height={Math.min(a, x - 1) * U}
            fill="none"
            stroke="#ff3b3b"
            strokeDasharray="5 4"
            strokeWidth={2}
          />
        )}
        {pieces.map((p, i) => (
          <Rect key={i} p={p} />
        ))}
        {dims}
      </svg>
      <div className="area-formula">
        <Tex>{formula}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<><Tex>x</Tex> の長さ</>} value={x} min={4} max={9} onChange={setX} color={C.sq} />
        <Slider label={<Tex>a</Tex>} value={a} min={1} max={mode === 'diffsq' ? 3 : 5} onChange={setA} color={C.a} />
        {mode === 'binomial' && <Slider label={<Tex>b</Tex>} value={b} min={1} max={5} onChange={setB} color={C.b} />}
      </div>
      {mode === 'square' && showMistake && (
        <button className={`btn small ${mistake ? 'danger' : 'ghost'}`} onClick={() => setMistake((m) => !m)}>
          {mistake ? 'カイが忘れた部分を表示中' : 'カイの答え「x² + a²」で足りない部分は？'}
        </button>
      )}
      {mode === 'diffsq' && (
        <button className="btn small" onClick={() => setMoved((m) => !m)}>
          {moved ? '元にもどす' : '✂ 下の部分を切って、右にくっつける'}
        </button>
      )}
      <p className="figure-note">
        {mode === 'diffsq'
          ? '大きな正方形から、すみの小さな正方形を切り取った形。並べかえても面積は変わらない！'
          : 'x の長さを変えても、ピースの「分け方」は変わらない。だから式がいつでも成り立つ！'}
      </p>
    </div>
  );
}
