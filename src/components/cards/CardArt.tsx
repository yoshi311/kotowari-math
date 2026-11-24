import { useId } from 'react';
import type { CardDef, Lesson } from '../../content/types';
import { cardMeta } from '../../content/course';

// カードの絵。依頼の「さわって発見」の図の種類から、モチーフを自動で決めて SVG で描く。

export type Motif =
  | 'blocks' | 'numberline' | 'venn' | 'parabola' | 'triangle' | 'circle' | 'wave' | 'histogram' | 'scatter'
  | 'dice' | 'tree' | 'log' | 'tangent' | 'area' | 'bars' | 'bell' | 'vector' | 'solid' | 'ellipse' | 'spiral' | 'poly' | 'lantern';

const GROUPS: Record<Exclude<Motif, 'lantern'>, string[]> = {
  blocks: ['area', 'likeTerms', 'factorTiles', 'power', 'priceBox', 'nested', 'sqrtSquare', 'amgm'],
  numberline: ['absLine', 'budget', 'sqrtZoom'],
  venn: ['venn', 'contra'],
  parabola: ['parabolaA', 'parabolaShift', 'axisMove', 'completeSquare', 'roots', 'discriminant', 'quadIneq', 'throw', 'funcMachine'],
  triangle: ['rightTriangle', 'sinLaw', 'cosLaw', 'triArea', 'measure', 'bisector', 'centers', 'ceva', 'inscribedAngle', 'tangentChord', 'twoCircles'],
  circle: ['unitCircle', 'trigCircle', 'trigSym', 'radian', 'trigEq', 'addition', 'doubleAngle', 'circleLine'],
  wave: ['sinWave', 'waveTransform', 'synthesis'],
  histogram: ['histogram', 'boxPlot', 'outlier', 'meanBalance', 'variance', 'transform', 'hypothesis'],
  scatter: ['scatter', 'lineEq', 'region'],
  dice: ['diceTable', 'expectation', 'condProb', 'repeatTrial', 'randVar'],
  tree: ['treeDiagram', 'permSlots', 'circlePerm', 'gridPath', 'pascal', 'binomial'],
  log: ['expExtend', 'expGraph', 'expIneq', 'logGraph', 'logIneq', 'logScale', 'slideRule', 'baseChange', 'digits'],
  tangent: ['avgRate', 'derivGraph', 'powerRule', 'tangentLine', 'increase', 'maxMin'],
  area: ['antideriv', 'riemann', 'areaBetween'],
  bars: ['arithSeq', 'geoSeq', 'sigmaDots', 'diffSeq', 'recurrence'],
  bell: ['binomDist', 'normal', 'estimate'],
  vector: ['vecAdd', 'dotProduct', 'vecMin', 'vecDiv', 'divPoint'],
  solid: ['cuboid', 'polyhedron', 'space3d'],
  ellipse: ['conics', 'paramCurve'],
  spiral: ['complexPlane', 'deMoivre', 'complexRoots'],
  poly: ['remainder', 'vieta'],
};
const BY_FIGURE = new Map<string, Motif>();
for (const [m, types] of Object.entries(GROUPS)) for (const t of types) BY_FIGURE.set(t, m as Motif);

/** 依頼から絵のモチーフを決める（ボス戦は灯） */
export function motifOf(lesson: Lesson): Motif | undefined {
  if (lesson.steps.some((s) => s.kind === 'boss')) return 'lantern';
  const ex = lesson.steps.find((s) => s.kind === 'explore');
  return ex && ex.kind === 'explore' ? BY_FIGURE.get(ex.figure.type) : undefined;
}

/** 科目ごとの空の色 */
const SKY: Record<string, [string, string]> = {
  数学Ⅰ: ['#1d3557', '#3a86ff'],
  数学A: ['#3c096c', '#9d4edd'],
  数学Ⅱ: ['#0b3d2e', '#2a9d8f'],
  数学B: ['#03045e', '#4361ee'],
  数学C: ['#1b1b3a', '#7b2cbf'],
};

const W = '#ffffff';

/** モチーフごとの絵（viewBox 0 0 160 112） */
function Draw({ m, c, v }: { m: Motif; c: string; v: number }) {
  const s = { stroke: c, strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const w = { ...s, stroke: W, strokeWidth: 2 };
  const axes = (
    <g stroke="rgba(255,255,255,0.45)" strokeWidth={1.4}>
      <line x1={12} y1={88} x2={148} y2={88} />
      <line x1={30} y1={100} x2={30} y2={12} />
    </g>
  );
  switch (m) {
    case 'parabola': {
      const k = 0.018 + (v % 3) * 0.006;
      let d = '';
      for (let x = 14; x <= 146; x += 4) d += `${x === 14 ? 'M' : 'L'}${x} ${(26 + k * (x - 80) ** 2).toFixed(1)}`;
      return (
        <>
          {axes}
          <line x1={80} y1={14} x2={80} y2={100} stroke={W} strokeDasharray="4 4" opacity={0.5} />
          <path d={d} {...s} />
          <circle cx={80} cy={26} r={5} fill={W} />
          <circle cx={80 - Math.sqrt(62 / k)} cy={88} r={3.5} fill={c} />
          <circle cx={80 + Math.sqrt(62 / k)} cy={88} r={3.5} fill={c} />
        </>
      );
    }
    case 'blocks': {
      // (x + a)(x + b) のタイル。番号によって a、b の数を変える
      const a = 1 + (v % 3);
      const b = 1 + ((v + 1) % 2);
      const S = 46;
      const T = 13;
      const x0 = 80 - (S + a * (T + 3)) / 2;
      const y0 = 56 - (S + b * (T + 3)) / 2;
      return (
        <g strokeWidth={2} stroke={W}>
          <rect x={x0} y={y0} width={S} height={S} fill={c} opacity={0.9} />
          {Array.from({ length: a }, (_, i) => (
            <rect key={`v${i}`} x={x0 + S + 3 + i * (T + 3)} y={y0} width={T} height={S} fill={c} opacity={0.55} />
          ))}
          {Array.from({ length: b }, (_, j) => (
            <rect key={`h${j}`} x={x0} y={y0 + S + 3 + j * (T + 3)} width={S} height={T} fill={c} opacity={0.55} />
          ))}
          {Array.from({ length: a * b }, (_, k) => (
            <rect key={`u${k}`} x={x0 + S + 3 + (k % a) * (T + 3)} y={y0 + S + 3 + Math.floor(k / a) * (T + 3)} width={T} height={T} fill={W} opacity={0.8} />
          ))}
          <text x={x0 + S / 2} y={y0 + S / 2 + 6} fill={W} stroke="none" fontSize={16} fontWeight={800} textAnchor="middle">x²</text>
        </g>
      );
    }
    case 'numberline':
      return (
        <>
          <line x1={10} y1={66} x2={150} y2={66} {...w} />
          {[20, 40, 60, 80, 100, 120, 140].map((x) => (
            <line key={x} x1={x} y1={60} x2={x} y2={72} stroke={W} strokeWidth={2} />
          ))}
          <line x1={46} y1={66} x2={114} y2={66} stroke={c} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          <circle cx={46} cy={66} r={6} fill={W} stroke={c} strokeWidth={3} />
          <circle cx={114} cy={66} r={6} fill={W} stroke={c} strokeWidth={3} />
          <text x={80} y={42} fill={W} fontSize={24} fontWeight={800} textAnchor="middle">√ | |</text>
        </>
      );
    case 'venn':
      return (
        <>
          <circle cx={64} cy={58} r={34} fill={c} opacity={0.45} stroke={W} strokeWidth={2} />
          <circle cx={98} cy={58} r={34} fill={c} opacity={0.45} stroke={W} strokeWidth={2} />
          <text x={50} y={64} fill={W} fontSize={16} fontWeight={800} textAnchor="middle">A</text>
          <text x={112} y={64} fill={W} fontSize={16} fontWeight={800} textAnchor="middle">B</text>
          <text x={81} y={63} fill={W} fontSize={12} fontWeight={800} textAnchor="middle">∩</text>
        </>
      );
    case 'triangle':
      return (
        <>
          <circle cx={80} cy={58} r={44} {...w} opacity={0.5} />
          <polygon points={`${42 + (v % 3) * 4},84 124,84 ${70 + (v % 4) * 6},16`} {...s} fill={c} fillOpacity={0.3} />
          <path d="M112 84 L112 74 L124 74" stroke={W} strokeWidth={1.5} fill="none" opacity={0.7} />
          <text x={80} y={104} fill={W} fontSize={11} fontWeight={800} textAnchor="middle">a² = b² + c² − 2bc cosA</text>
        </>
      );
    case 'circle': {
      const a = ((30 + (v % 4) * 15) * Math.PI) / 180;
      const px = 80 + 40 * Math.cos(a);
      const py = 58 - 40 * Math.sin(a);
      return (
        <>
          <line x1={30} y1={58} x2={130} y2={58} stroke="rgba(255,255,255,0.45)" />
          <line x1={80} y1={10} x2={80} y2={106} stroke="rgba(255,255,255,0.45)" />
          <circle cx={80} cy={58} r={40} {...w} />
          <path d={`M100 58 A20 20 0 0 0 ${80 + 20 * Math.cos(a)} ${58 - 20 * Math.sin(a)}`} stroke={c} strokeWidth={2.5} fill="none" />
          <line x1={80} y1={58} x2={px} y2={py} {...s} />
          <line x1={px} y1={py} x2={px} y2={58} stroke={c} strokeWidth={2} strokeDasharray="3 3" />
          <circle cx={px} cy={py} r={5} fill={W} />
        </>
      );
    }
    case 'wave': {
      const wave = (amp: number, ph: number) => {
        let d = '';
        for (let x = 10; x <= 150; x += 3) d += `${x === 10 ? 'M' : 'L'}${x} ${(56 - amp * Math.sin((x / 22) + ph)).toFixed(1)}`;
        return d;
      };
      return (
        <>
          <line x1={10} y1={56} x2={150} y2={56} stroke="rgba(255,255,255,0.4)" />
          <path d={wave(22, v)} {...s} />
          <path d={wave(14, v + 1.6)} {...w} opacity={0.7} />
        </>
      );
    }
    case 'histogram':
      return (
        <>
          {axes}
          {[18, 34, 56, 70, 52, 30, 14].map((h, i) => (
            <rect key={i} x={36 + i * 16} y={88 - h} width={14} height={h} fill={c} opacity={0.85} stroke={W} strokeWidth={1} />
          ))}
          <path d="M36 74 Q60 30 92 18 Q124 30 148 76" stroke={W} strokeWidth={2} fill="none" strokeDasharray="5 3" />
        </>
      );
    case 'scatter':
      return (
        <>
          {axes}
          {[[44, 76], [52, 70], [60, 72], [68, 60], [76, 62], [84, 50], [92, 52], [100, 42], [110, 40], [118, 30], [128, 32]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y + ((i * 7 + v) % 5) - 2} r={4} fill={i % 2 ? c : W} />
          ))}
          <line x1={38} y1={82} x2={138} y2={24} stroke={c} strokeWidth={2.5} strokeDasharray="6 4" />
        </>
      );
    case 'dice': {
      const die = (x: number, y: number, n: number, rot: number) => {
        const pips: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
        return (
          <g transform={`translate(${x} ${y}) rotate(${rot})`}>
            <rect x={-20} y={-20} width={40} height={40} rx={8} fill={W} stroke={c} strokeWidth={3} />
            {pips[n].map(([a, b], i) => (
              <circle key={i} cx={a * 10} cy={b * 10} r={4} fill={n === 1 ? '#e63946' : '#1b1640'} />
            ))}
          </g>
        );
      };
      return (
        <>
          {die(60, 58, 1 + (v % 6), -12)}
          {die(104, 52, 1 + ((v + 3) % 6), 14)}
        </>
      );
    }
    case 'tree': {
      const nodes: [number, number, number, number][] = [[22, 56, 70, 28], [22, 56, 70, 84], [70, 28, 124, 16], [70, 28, 124, 40], [70, 84, 124, 72], [70, 84, 124, 96]];
      return (
        <>
          {nodes.map(([a, b, x, y], i) => (
            <line key={i} x1={a} y1={b} x2={x} y2={y} stroke={i < 2 ? c : W} strokeWidth={2.5} />
          ))}
          {[[22, 56], [70, 28], [70, 84], [124, 16], [124, 40], [124, 72], [124, 96]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 5.5} fill={i < 3 ? c : W} stroke={W} strokeWidth={1.5} />
          ))}
        </>
      );
    }
    case 'log': {
      // 原点 (56, 92)、1 目もり 18。y = 2^x と y = log₂x は直線 y = x について対称
      const U = 18;
      let e = '', l = '';
      for (let i = 0; i <= 50; i++) {
        const t = -3 + i * 0.12;
        e += `${i === 0 ? 'M' : 'L'}${(56 + U * t).toFixed(1)} ${(92 - U * 2 ** t).toFixed(1)}`;
        l += `${i === 0 ? 'M' : 'L'}${(56 + U * 2 ** t).toFixed(1)} ${(92 - U * t).toFixed(1)}`;
      }
      return (
        <>
          <line x1={2} y1={146} x2={150} y2={-2} stroke="rgba(255,255,255,0.4)" strokeDasharray="4 4" />
          <path d={e} {...s} />
          <path d={l} {...w} />
        </>
      );
    }
    case 'tangent': {
      const g = (x: number) => 56 + 30 * Math.sin((x - 80) / 26);
      let d = '';
      for (let x = 12; x <= 148; x += 4) d += `${x === 12 ? 'M' : 'L'}${x} ${g(x).toFixed(1)}`;
      const t = 60 + (v % 4) * 8;
      const m = (g(t + 0.5) - g(t - 0.5)) / 1;
      return (
        <>
          {axes}
          <path d={d} {...s} />
          <line x1={t - 40} y1={g(t) - 40 * m} x2={t + 40} y2={g(t) + 40 * m} stroke={W} strokeWidth={2.5} />
          <circle cx={t} cy={g(t)} r={5} fill={W} />
        </>
      );
    }
    case 'area': {
      const g = (x: number) => 88 - 0.006 * (x - 30) ** 2;
      let d = 'M40 88';
      for (let x = 40; x <= 120; x += 4) d += ` L${x} ${g(x).toFixed(1)}`;
      let c2 = '';
      for (let x = 20; x <= 140; x += 4) c2 += `${x === 20 ? 'M' : 'L'}${x} ${g(x).toFixed(1)}`;
      return (
        <>
          {axes}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={40 + i * 10} y={g(50 + i * 10)} width={10} height={88 - g(50 + i * 10)} fill={c} opacity={0.35} stroke={W} strokeWidth={0.8} />
          ))}
          <path d={`${d} L120 88 Z`} fill={c} opacity={0.4} />
          <path d={c2} {...w} />
          <text x={70} y={80} fill={W} fontSize={22} fontWeight={800} textAnchor="middle">∫</text>
        </>
      );
    }
    case 'bars':
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const h = v % 2 ? 8 * 1.45 ** i : 10 + i * 11;
            return <rect key={i} x={22 + i * 18} y={96 - Math.min(h, 84)} width={14} height={Math.min(h, 84)} rx={2} fill={i % 2 ? W : c} opacity={0.9} />;
          })}
          <text x={34} y={30} fill={W} fontSize={22} fontWeight={800} textAnchor="middle">Σ</text>
        </>
      );
    case 'bell': {
      let d = '';
      for (let x = 12; x <= 148; x += 3) d += `${x === 12 ? 'M' : 'L'}${x} ${(90 - 70 * Math.exp(-((x - 80) ** 2) / (2 * 20 * 20))).toFixed(1)}`;
      let fill = 'M58 90';
      for (let x = 58; x <= 102; x += 2) fill += ` L${x} ${(90 - 70 * Math.exp(-((x - 80) ** 2) / (2 * 20 * 20))).toFixed(1)}`;
      return (
        <>
          <line x1={10} y1={90} x2={150} y2={90} stroke="rgba(255,255,255,0.5)" />
          <path d={`${fill} L102 90 Z`} fill={c} opacity={0.6} />
          <path d={d} {...w} strokeWidth={2.6} />
          <line x1={80} y1={18} x2={80} y2={90} stroke={c} strokeDasharray="4 3" strokeWidth={2} />
        </>
      );
    }
    case 'vector': {
      const arrow = (x2: number, y2: number, color: string, x1 = 34, y1 = 88) => {
        const a = Math.atan2(y2 - y1, x2 - x1);
        return (
          <g>
            <line x1={x1} y1={y1} x2={x2 - 8 * Math.cos(a)} y2={y2 - 8 * Math.sin(a)} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
            <polygon points={`${x2},${y2} ${x2 - 12 * Math.cos(a - 0.45)},${y2 - 12 * Math.sin(a - 0.45)} ${x2 - 12 * Math.cos(a + 0.45)},${y2 - 12 * Math.sin(a + 0.45)}`} fill={color} />
          </g>
        );
      };
      return (
        <>
          <polygon points="34,88 104,72 134,24 64,40" fill={c} opacity={0.18} />
          {arrow(104, 72, W)}
          {arrow(64, 40, W)}
          {arrow(134, 24, c)}
          <line x1={104} y1={72} x2={134} y2={24} stroke={W} strokeDasharray="4 4" opacity={0.6} />
          <line x1={64} y1={40} x2={134} y2={24} stroke={W} strokeDasharray="4 4" opacity={0.6} />
        </>
      );
    }
    case 'solid':
      return (
        <g {...s}>
          <polygon points="46,44 98,44 98,96 46,96" fill={c} fillOpacity={0.25} />
          <polygon points="46,44 72,20 124,20 98,44" fill={c} fillOpacity={0.4} />
          <polygon points="98,44 124,20 124,72 98,96" fill={c} fillOpacity={0.15} />
          <line x1={46} y1={96} x2={124} y2={20} stroke={W} strokeWidth={2} strokeDasharray="5 4" />
          <circle cx={124} cy={20} r={4.5} fill={W} stroke="none" />
        </g>
      );
    case 'ellipse':
      return (
        <>
          <ellipse cx={80} cy={58} rx={60} ry={34} {...s} />
          <circle cx={48} cy={58} r={4.5} fill={W} />
          <circle cx={112} cy={58} r={4.5} fill={W} />
          <circle cx={80 + 60 * Math.cos(1 + v)} cy={58 - 34 * Math.sin(1 + v)} r={6} fill={c} stroke={W} strokeWidth={2} />
          <line x1={48} y1={58} x2={80 + 60 * Math.cos(1 + v)} y2={58 - 34 * Math.sin(1 + v)} stroke={W} strokeWidth={1.5} opacity={0.7} />
          <line x1={112} y1={58} x2={80 + 60 * Math.cos(1 + v)} y2={58 - 34 * Math.sin(1 + v)} stroke={W} strokeWidth={1.5} opacity={0.7} />
        </>
      );
    case 'spiral': {
      const pts = Array.from({ length: 9 }, (_, k) => {
        const r = 8 * 1.22 ** k;
        const a = (k * Math.PI) / 4;
        return [80 + r * Math.cos(a), 56 - r * Math.sin(a)];
      });
      return (
        <>
          <line x1={10} y1={56} x2={150} y2={56} stroke="rgba(255,255,255,0.4)" />
          <line x1={80} y1={6} x2={80} y2={108} stroke="rgba(255,255,255,0.4)" />
          <circle cx={80} cy={56} r={20} stroke={W} fill="none" strokeWidth={1.2} opacity={0.6} />
          <polyline points={pts.map((p) => p.join(',')).join(' ')} stroke={c} strokeWidth={2.4} fill="none" strokeDasharray="4 3" />
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5.5 : 3.5} fill={i === pts.length - 1 ? c : W} />
          ))}
        </>
      );
    }
    case 'poly': {
      const g = (x: number) => 58 - 0.00006 * (x - 40) * (x - 80) * (x - 124);
      let d = '';
      for (let x = 14; x <= 146; x += 3) d += `${x === 14 ? 'M' : 'L'}${x} ${g(x).toFixed(1)}`;
      return (
        <>
          <line x1={10} y1={58} x2={150} y2={58} stroke="rgba(255,255,255,0.45)" />
          <path d={d} {...s} />
          {[40, 80, 124].map((x) => (
            <circle key={x} cx={x} cy={58} r={4.5} fill={W} />
          ))}
        </>
      );
    }
    case 'lantern':
      return (
        <>
          {/* 光の輪と光線 */}
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * Math.PI) / 8;
            return <line key={i} x1={80 + 24 * Math.cos(a)} y1={56 + 24 * Math.sin(a)} x2={80 + 70 * Math.cos(a)} y2={56 + 70 * Math.sin(a)} stroke={i % 2 ? c : W} strokeWidth={i % 2 ? 2 : 1.2} opacity={0.5} />;
          })}
          <circle cx={80} cy={56} r={34} fill="none" stroke={W} strokeWidth={1.5} opacity={0.6} />
          {/* 王冠 */}
          <polygon points="62,22 68,10 74,18 80,6 86,18 92,10 98,22" fill="#ffd166" stroke="#fff3c4" strokeWidth={1.2} />
          {/* 灯 */}
          <rect x={68} y={26} width={24} height={6} rx={2} fill="#8d5524" />
          <path d="M66 32 Q80 30 94 32 L98 74 Q80 80 62 74 Z" fill="#ffd166" stroke="#fff3c4" strokeWidth={2} />
          <ellipse cx={80} cy={54} rx={10} ry={14} fill="#fff8e1" opacity={0.9} />
          <rect x={68} y={76} width={24} height={6} rx={2} fill="#8d5524" />
        </>
      );
  }
}

/** カードの絵の窓 */
export function CardArt({ card }: { card: CardDef }) {
  const uid = useId().replace(/:/g, '');
  const meta = cardMeta(card.id);
  const m = (meta && motifOf(meta.lesson)) ?? 'lantern';
  const [top, bottom] = SKY[meta?.unit.subject ?? '数学Ⅰ'] ?? SKY['数学Ⅰ'];
  const v = meta?.no ?? 0;
  const boss = m === 'lantern';
  return (
    <svg viewBox="0 0 160 112" className="tcg-art-svg" role="img" aria-label={`${card.term} の絵`}>
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor={card.color} stopOpacity={boss ? 0.75 : 0.45} />
          <stop offset="1" stopColor={card.color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width="160" height="112" fill={`url(#sky-${uid})`} />
      <rect width="160" height="112" fill={`url(#glow-${uid})`} />
      {/* 星のまたたき */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={(i * 47 + v * 13) % 160} cy={(i * 29 + v * 7) % 112} r={i % 4 === 0 ? 1.4 : 0.8} fill="#fff" opacity={0.6} />
      ))}
      <Draw m={m} c={card.color} v={v} />
    </svg>
  );
}
