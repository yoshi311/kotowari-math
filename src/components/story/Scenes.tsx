import type { SceneId } from '../../content/types';

// 背景イラストもすべて SVG で自作

function Sky({ id, top = '#1b1640', bottom = '#4a3f8c' }: { id: string; top?: string; bottom?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill={`url(#${id})`} />
      {[
        [30, 20], [80, 40], [140, 15], [210, 30], [270, 12], [330, 35], [370, 18], [110, 60], [300, 55],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#fff" opacity={0.8} className="twinkle" style={{ animationDelay: `${i * 0.37}s` }} />
      ))}
    </>
  );
}

function Market() {
  const stalls = [
    { x: 20, c: '#ff6b6b' },
    { x: 150, c: '#ffd166' },
    { x: 280, c: '#4ecdc4' },
  ];
  return (
    <>
      <Sky id="sky-market" top="#ffb38a" bottom="#ffe3c2" />
      <circle cx="340" cy="40" r="22" fill="#fff4d6" opacity="0.9" />
      <rect y="110" width="400" height="30" fill="#c99b6d" />
      {stalls.map((s, i) => (
        <g key={i}>
          <rect x={s.x + 8} y="70" width="6" height="45" fill="#6d4c41" />
          <rect x={s.x + 96} y="70" width="6" height="45" fill="#6d4c41" />
          <path d={`M${s.x} 70 L${s.x + 110} 70 L${s.x + 100} 50 L${s.x + 10} 50 Z`} fill={s.c} />
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} d={`M${s.x + k * 22} 70 q11 10 22 0`} fill={s.c} stroke="#fff" strokeWidth="1.5" />
          ))}
          <rect x={s.x + 10} y="92" width="90" height="20" fill="#8d6e63" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <circle key={k} cx={s.x + 20 + k * 14} cy="90" r="6" fill={i === 0 ? '#e63946' : i === 1 ? '#f4a261' : '#90be6d'} />
          ))}
          {/* 白紙の値札 */}
          <rect x={s.x + 40} y="76" width="30" height="12" fill="#fff" stroke="#6d4c41" />
          <text x={s.x + 55} y="85" fontSize="8" textAnchor="middle" fill="#bbb">？円</text>
        </g>
      ))}
    </>
  );
}

function Workshop() {
  return (
    <>
      <Sky id="sky-ws" top="#87ceeb" bottom="#d8f3ff" />
      <rect y="112" width="400" height="28" fill="#7cb342" />
      <path d="M90 60 L200 18 L310 60 Z" fill="#8d4f2f" />
      <rect x="105" y="60" width="190" height="55" fill="#e9c46a" />
      <rect x="185" y="78" width="30" height="37" fill="#6d4c41" />
      <rect x="125" y="72" width="30" height="22" fill="#bde0fe" stroke="#6d4c41" strokeWidth="2" />
      <rect x="245" y="72" width="30" height="22" fill="#bde0fe" stroke="#6d4c41" strokeWidth="2" />
      {/* タイルの山 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + i * 6} y={95 - i * 8} width="34" height="8" fill={['#9b5de5', '#00bbf9', '#fee440', '#9b5de5'][i]} stroke="#1b1640" />
      ))}
      <rect x="330" y="80" width="30" height="30" fill="#9b5de5" stroke="#1b1640" />
      <rect x="362" y="80" width="8" height="30" fill="#00bbf9" stroke="#1b1640" />
      <rect x="372" y="102" width="8" height="8" fill="#fee440" stroke="#1b1640" />
    </>
  );
}

function Plaza() {
  return (
    <>
      <Sky id="sky-plaza" top="#6a4c93" bottom="#f9c74f" />
      <path d="M0 112 L400 112 L400 140 L0 140 Z" fill="#a8a29e" />
      {/* 正方形の広場（ななめから） */}
      <path d="M120 112 L280 112 L320 136 L80 136 Z" fill="#d6d3d1" stroke="#78716c" />
      <path d="M100 112 L300 112 L350 140 L50 140 Z" fill="none" stroke="#ff6b6b" strokeDasharray="6 4" strokeWidth="2" />
      {/* 噴水 */}
      <ellipse cx="200" cy="120" rx="26" ry="6" fill="#90e0ef" stroke="#78716c" />
      <rect x="196" y="96" width="8" height="24" fill="#a8a29e" />
      <path d="M200 96 Q188 84 182 104 M200 96 Q212 84 218 104" stroke="#90e0ef" strokeWidth="3" fill="none" />
      {/* 家並み */}
      {[10, 50, 330, 365].map((x, i) => (
        <g key={i}>
          <rect x={x} y={70 + (i % 2) * 8} width="32" height={42 - (i % 2) * 8} fill={['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a'][i]} />
          <path d={`M${x - 4} ${70 + (i % 2) * 8} L${x + 16} ${52 + (i % 2) * 8} L${x + 36} ${70 + (i % 2) * 8} Z`} fill="#6d4c41" />
          <rect x={x + 11} y={84} width="10" height="10" fill="#fff3b0" />
        </g>
      ))}
    </>
  );
}

function Night() {
  return (
    <>
      <Sky id="sky-night" />
      <circle cx="320" cy="40" r="18" fill="#fff3b0" />
      <circle cx="328" cy="34" r="16" fill="#2a2360" />
      <path d="M0 115 Q100 90 200 110 T400 105 L400 140 L0 140 Z" fill="#2d2a5a" />
    </>
  );
}

function Valley() {
  return (
    <>
      <Sky id="sky-valley" top="#3a6ea5" bottom="#ffcf99" />
      {/* 渓谷の崖 */}
      <path d="M0 40 L60 50 L90 140 L0 140 Z" fill="#8d5a3b" />
      <path d="M400 35 L330 48 L300 140 L400 140 Z" fill="#8d5a3b" />
      <path d="M0 60 L50 66 L75 140 L0 140 Z" fill="#6d4128" />
      <path d="M400 58 L345 64 L320 140 L400 140 Z" fill="#6d4128" />
      {/* 川 */}
      <path d="M90 140 Q200 118 300 140 Z" fill="#48cae4" />
      {/* 放物線の吊り橋 */}
      <path d="M60 50 Q200 150 330 48" fill="none" stroke="#2b2d42" strokeWidth="3" />
      <line x1="60" y1="62" x2="330" y2="60" stroke="#6d4c41" strokeWidth="5" />
      {[100, 140, 180, 220, 260, 300].map((x) => {
        const t = (x - 60) / 270;
        const y = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 150 + t * t * 48;
        return <line key={x} x1={x} y1={61} x2={x} y2={Math.min(y, 140)} stroke="#2b2d42" strokeWidth="1.2" opacity="0.4" />;
      })}
      {/* 霧の中の竜の影 */}
      <path d="M200 30 q12 -14 24 0 q-6 4 -12 2 q-6 2 -12 -2 Z" fill="#2b2d42" opacity="0.35" />
    </>
  );
}

function Fountain() {
  return (
    <>
      <Sky id="sky-fountain" top="#90e0ef" bottom="#e0fbfc" />
      <rect y="112" width="400" height="28" fill="#a3b18a" />
      <ellipse cx="200" cy="120" rx="80" ry="12" fill="#48cae4" stroke="#6c757d" strokeWidth="3" />
      {/* 放物線の水の線 */}
      {[-60, -35, 35, 60].map((d, i) => (
        <path key={i} d={`M200 112 Q${200 + d / 2} ${20 + Math.abs(d) / 2} ${200 + d} 118`} fill="none" stroke="#0096c7" strokeWidth="3" opacity="0.8" />
      ))}
      <rect x="194" y="104" width="12" height="12" fill="#6c757d" />
    </>
  );
}

function Lighthouse() {
  return (
    <>
      <Sky id="sky-lh" top="#14213d" bottom="#3d5a80" />
      {/* 海 */}
      <rect y="100" width="400" height="40" fill="#1d3557" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${i * 90 - 20} ${112 + (i % 2) * 10} q20 -6 40 0 t40 0`} fill="none" stroke="#a8dadc" strokeWidth="1.5" opacity="0.5" />
      ))}
      {/* 岬 */}
      <path d="M240 140 L260 96 Q300 80 340 92 L400 100 L400 140 Z" fill="#4a4e69" />
      {/* 灯台 */}
      <polygon points="296,92 316,92 312,30 300,30" fill="#f8f9fa" />
      <rect x="298" y="50" width="16" height="7" fill="#e63946" />
      <rect x="298" y="70" width="16" height="7" fill="#e63946" />
      <rect x="297" y="20" width="18" height="10" fill="#ffd166" />
      <path d="M306 25 L120 0 L120 45 Z" fill="#ffd166" opacity="0.12" />
      {/* 船 */}
      <path d="M60 104 L100 104 L94 112 L66 112 Z" fill="#e9c46a" />
      <line x1="80" y1="104" x2="80" y2="84" stroke="#e9c46a" strokeWidth="2" />
      <path d="M80 86 L94 100 L80 100 Z" fill="#f1faee" />
    </>
  );
}

function Fort() {
  // 方眼の石垣と、座標軸の旗が立つ砦
  return (
    <>
      <Sky id="sky-fort" top="#1d3557" bottom="#a8dadc" />
      <rect x="60" y="50" width="280" height="90" fill="#6c757d" />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`v${i}`} x1={60 + i * 20} y1="50" x2={60 + i * 20} y2="140" stroke="#495057" strokeWidth="1" />
      ))}
      {Array.from({ length: 5 }, (_, j) => (
        <line key={`h${j}`} x1="60" y1={50 + j * 20} x2="340" y2={50 + j * 20} stroke="#495057" strokeWidth="1" />
      ))}
      {[60, 100, 140, 180, 220, 260, 300].map((x) => (
        <rect key={x} x={x} y="38" width="20" height="12" fill="#6c757d" />
      ))}
      <rect x="180" y="96" width="40" height="44" rx="20" fill="#343a40" />
      {/* 座標軸の旗 */}
      <line x1="90" y1="38" x2="90" y2="6" stroke="#dee2e6" strokeWidth="2" />
      <path d="M90 8 L114 14 L90 20 Z" fill="#00bbf9" />
      <line x1="310" y1="38" x2="310" y2="6" stroke="#dee2e6" strokeWidth="2" />
      <path d="M310 8 L334 14 L310 20 Z" fill="#f15bb5" />
      {/* 石垣にえがかれた放物線と円 */}
      <path d="M240 70 Q270 130 300 70" fill="none" stroke="#ffd166" strokeWidth="2" opacity="0.8" />
      <circle cx="110" cy="90" r="18" fill="none" stroke="#06d6a0" strokeWidth="2" opacity="0.8" />
      <rect y="132" width="400" height="8" fill="#3a5a40" />
    </>
  );
}

/** 枝が 2 本ずつに分かれる木（倍々にふえる枝） */
function branches(x: number, y: number, len: number, ang: number, depth: number, out: { x1: number; y1: number; x2: number; y2: number; w: number }[]) {
  const x2 = x + len * Math.cos(ang);
  const y2 = y - len * Math.sin(ang);
  out.push({ x1: x, y1: y, x2, y2, w: depth * 1.4 + 0.6 });
  if (depth > 0) {
    branches(x2, y2, len * 0.72, ang + 0.42, depth - 1, out);
    branches(x2, y2, len * 0.72, ang - 0.42, depth - 1, out);
  }
  return out;
}

function Forest() {
  // 倍々に枝分かれする大樹と、光るキノコの樹海
  const tree = branches(200, 140, 34, Math.PI / 2, 6, []);
  return (
    <>
      <Sky id="sky-forest" top="#081c15" bottom="#2d6a4f" />
      {[20, 70, 120, 280, 330, 380].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={80 + (i % 2) * 8} width="10" height="60" fill="#1b4332" />
          <circle cx={x} cy={74 + (i % 2) * 8} r={22 + (i % 3) * 4} fill={i % 2 ? '#2d6a4f' : '#40916c'} opacity="0.9" />
        </g>
      ))}
      {tree.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#7f5539" strokeWidth={s.w} strokeLinecap="round" />
      ))}
      {tree.filter((_, i) => i % 3 === 0).map((s, i) => (
        <circle key={i} cx={s.x2} cy={s.y2} r="3" fill="#95d5b2" opacity="0.7" />
      ))}
      {[[90, 128], [130, 132], [270, 130], [310, 127]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 2} y={y - 6} width="4" height="8" fill="#f1faee" />
          <path d={`M${x - 8} ${y - 5} Q${x} ${y - 16} ${x + 8} ${y - 5} Z`} fill={i % 2 ? '#ffd166' : '#f15bb5'} opacity="0.9" />
        </g>
      ))}
      <rect y="132" width="400" height="8" fill="#1b4332" />
    </>
  );
}

function Coast() {
  // 夕暮れの海岸。サインカーブの波が重なり、水車が回る
  const wave = (y: number, amp: number, len: number, phase: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= 400; x += 8) d += ` L${x} ${(y + amp * Math.sin((x / len) * 2 * Math.PI + phase)).toFixed(1)}`;
    return d;
  };
  return (
    <>
      <Sky id="sky-coast" top="#3d348b" bottom="#f7b267" />
      <circle cx="300" cy="78" r="22" fill="#f4845f" opacity="0.9" />
      <path d={`${wave(86, 3, 90, 0)} L400 140 L0 140 Z`} fill="#277da1" />
      <path d={`${wave(100, 4, 70, 1)} L400 140 L0 140 Z`} fill="#4d908e" opacity="0.9" />
      <path d={wave(112, 5, 55, 2)} fill="none" stroke="#f1faee" strokeWidth="2" opacity="0.7" />
      <path d="M0 122 Q80 112 160 124 L160 140 L0 140 Z" fill="#e9c46a" />
      {/* 水車：回転が波になる */}
      <g transform="translate(70 100)">
        <circle r="20" fill="none" stroke="#8d5524" strokeWidth="3" />
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1={-20 * Math.cos((a * Math.PI) / 180)} y1={-20 * Math.sin((a * Math.PI) / 180)} x2={20 * Math.cos((a * Math.PI) / 180)} y2={20 * Math.sin((a * Math.PI) / 180)} stroke="#8d5524" strokeWidth="2" />
        ))}
        <circle r="3" fill="#8d5524" />
      </g>
      <rect x="66" y="100" width="8" height="26" fill="#6d4c41" />
    </>
  );
}

function Tower() {
  // 夜明け前の時計塔。歯車が回り、空には放物線の軌跡と接線
  const gear = (cx: number, cy: number, r: number, teeth: number, color: string) => {
    let d = '';
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i * Math.PI) / teeth;
      const rr = i % 2 === 0 ? r : r * 0.78;
      const a2 = ((i + 1) * Math.PI) / teeth;
      d += `${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} L${(cx + rr * Math.cos(a2)).toFixed(1)} ${(cy + rr * Math.sin(a2)).toFixed(1)} `;
    }
    return <path d={`${d}Z`} fill={color} opacity="0.85" />;
  };
  return (
    <>
      <Sky id="sky-tower" top="#14213d" bottom="#7b2cbf" />
      {/* 放物線の軌跡と接線 */}
      <path d="M20 120 Q110 -10 200 120" fill="none" stroke="#ffd166" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
      <line x1="31" y1="90.4" x2="117" y2="40.4" stroke="#f15bb5" strokeWidth="2" opacity="0.9" />
      <circle cx="74" cy="65.4" r="3" fill="#f15bb5" />
      {/* 時計塔 */}
      <rect x="262" y="34" width="64" height="106" fill="#3c096c" stroke="#9d4edd" strokeWidth="2" />
      <polygon points="256,36 332,36 294,6" fill="#5a189a" stroke="#9d4edd" strokeWidth="2" />
      <circle cx="294" cy="64" r="20" fill="#f8f9fa" stroke="#ffd166" strokeWidth="3" />
      <line x1="294" y1="64" x2="294" y2="50" stroke="#14213d" strokeWidth="2.5" />
      <line x1="294" y1="64" x2="305" y2="69" stroke="#14213d" strokeWidth="2" />
      <rect x="282" y="104" width="24" height="36" rx="12" fill="#240046" />
      {gear(350, 104, 16, 8, '#ffd166')}
      {gear(372, 82, 11, 6, '#06d6a0')}
      <rect y="132" width="400" height="8" fill="#10002b" />
    </>
  );
}

function Observatory() {
  // 星空の天文台。等比で明るさが変わる星の列と、つりがね形の星雲
  const bell = (x: number) => 84 - 52 * Math.exp(-((x - 205) ** 2) / (2 * 22 * 22));
  let d = 'M140 84';
  for (let x = 140; x <= 270; x += 5) d += ` L${x} ${bell(x).toFixed(1)}`;
  return (
    <>
      <Sky id="sky-observatory" top="#03045e" bottom="#3a0ca3" />
      {/* 等差に並ぶ星の列（だんだん大きく） */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={24 + i * 30} cy={70 - i * 9} r={1.2 + i * 0.7} fill="#ffd166" />
      ))}
      <path d={`${d} L270 84 Z`} fill="#f15bb5" opacity="0.25" />
      <path d={d} fill="none" stroke="#f15bb5" strokeWidth="2" opacity="0.8" />
      {/* 天文台のドームと望遠鏡 */}
      <g transform="translate(220 0)">
        <path d="M60 112 A44 44 0 0 1 148 112 Z" fill="#adb5bd" stroke="#e9ecef" strokeWidth="2" />
        <rect x="99" y="68" width="10" height="44" fill="#495057" />
        <rect x="96" y="58" width="44" height="10" rx="4" fill="#ced4da" transform="rotate(-30 100 70)" />
        <rect x="52" y="112" width="104" height="22" fill="#6c757d" />
      </g>
      <rect y="132" width="400" height="8" fill="#10002b" />
    </>
  );
}

function SkyCastle() {
  // 雲の上にうかぶ城。矢印（ベクトル）の光と、回転する複素数の環
  return (
    <>
      <Sky id="sky-skycastle" top="#0b132b" bottom="#5bc0be" />
      {/* 回転する環（複素数平面の単位円と 8 つの点） */}
      <circle cx="190" cy="46" r="26" fill="none" stroke="#c77dff" strokeWidth="1.5" opacity="0.8" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <circle key={k} cx={190 + 26 * Math.cos((k * Math.PI) / 4)} cy={46 - 26 * Math.sin((k * Math.PI) / 4)} r={k === 1 ? 4 : 2.5} fill={k === 1 ? '#f15bb5' : '#ffd166'} />
      ))}
      <line x1="190" y1="46" x2={190 + 26 * Math.cos(Math.PI / 4)} y2={46 - 26 * Math.sin(Math.PI / 4)} stroke="#f15bb5" strokeWidth="2" />
      {/* 光の矢印 */}
      <line x1="60" y1="62" x2="120" y2="28" stroke="#ffd166" strokeWidth="2.5" />
      <polygon points="120,28 108,29 113,38" fill="#ffd166" />
      {/* 雲 */}
      <ellipse cx="300" cy="118" rx="90" ry="18" fill="#e0fbfc" opacity="0.9" />
      <ellipse cx="250" cy="112" rx="40" ry="14" fill="#ffffff" opacity="0.9" />
      {/* 城 */}
      <rect x="262" y="58" width="76" height="52" fill="#3a506b" stroke="#c77dff" strokeWidth="2" />
      <rect x="252" y="40" width="18" height="70" fill="#3a506b" stroke="#c77dff" strokeWidth="2" />
      <rect x="330" y="40" width="18" height="70" fill="#3a506b" stroke="#c77dff" strokeWidth="2" />
      <polygon points="249,40 261,22 273,40" fill="#6930c3" />
      <polygon points="327,40 339,22 351,40" fill="#6930c3" />
      <polygon points="282,58 300,30 318,58" fill="#6930c3" />
      <rect x="292" y="84" width="16" height="26" rx="8" fill="#1c2541" />
      <ellipse cx="200" cy="132" rx="200" ry="10" fill="#e0fbfc" opacity="0.6" />
    </>
  );
}

function Ruins() {
  // 円と三角形が刻まれた古代の遺跡
  return (
    <>
      <Sky id="sky-ruins" top="#264653" bottom="#e9c46a" />
      <path d="M0 112 Q120 100 220 110 T400 106 L400 140 L0 140 Z" fill="#a98467" />
      {/* 神殿の柱 */}
      <polygon points="230,40 330,40 280,18" fill="#d6ccc2" stroke="#8d7b68" />
      <rect x="228" y="40" width="104" height="8" fill="#d6ccc2" stroke="#8d7b68" />
      {[236, 260, 284, 308].map((x, i) => (
        <rect key={x} x={x} y="48" width="12" height={i === 2 ? 40 : 66} fill="#e3d5ca" stroke="#8d7b68" />
      ))}
      <rect x="282" y="96" width="18" height="10" fill="#d6ccc2" transform="rotate(20 291 101)" />
      {/* 石板に刻まれた円と三角形 */}
      <rect x="60" y="46" width="84" height="66" rx="4" fill="#cdb4a0" stroke="#8d7b68" strokeWidth="2" />
      <circle cx="102" cy="80" r="24" fill="none" stroke="#6d597a" strokeWidth="2" />
      <polygon points="102,56 81,92 123,92" fill="none" stroke="#6d597a" strokeWidth="2" />
      <circle cx="102" cy="80" r="2.5" fill="#6d597a" />
      <rect y="128" width="400" height="12" fill="#7f5539" />
    </>
  );
}

function DiceTown() {
  // 夜の賭場の町。屋根の上に大きなさいころの看板
  return (
    <>
      <Sky id="sky-dice" top="#2b1055" bottom="#7597de" />
      {[[30, 60, 70], [110, 44, 60], [180, 70, 80], [270, 50, 64], [340, 66, 60]].map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x - 20} y={140 - h - 20} width={w} height={h + 20} fill={['#3d2c8d', '#5b2a86', '#432371', '#6a4c93', '#3d2c8d'][i]} />
          {[0, 1].map((r) =>
            [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={x - 12 + c * (w / 3.2)} y={140 - h - 8 + r * 20} width="8" height="10" fill="#ffd166" opacity={(i + r + c) % 3 ? 0.9 : 0.3} />),
          )}
        </g>
      ))}
      {/* さいころの看板 */}
      <g transform="translate(170 18) rotate(-12)">
        <rect width="44" height="44" rx="8" fill="#f8f9fa" stroke="#e63946" strokeWidth="3" />
        {[[11, 11], [33, 11], [22, 22], [11, 33], [33, 33]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4.5" fill={i === 2 ? '#e63946' : '#1b1640'} />
        ))}
      </g>
      <g transform="translate(232 36) rotate(18)">
        <rect width="30" height="30" rx="6" fill="#f8f9fa" stroke="#e63946" strokeWidth="2" />
        <circle cx="15" cy="15" r="5" fill="#e63946" />
      </g>
      <rect y="132" width="400" height="8" fill="#22223b" />
    </>
  );
}

function Plain() {
  // ヒストグラムのような麦畑と風車
  const bars = [3, 5, 8, 12, 15, 13, 9, 6, 4, 2];
  return (
    <>
      <Sky id="sky-plain" top="#ffb703" bottom="#ffe8a3" />
      <circle cx="70" cy="34" r="16" fill="#fff3b0" />
      <path d="M0 96 Q100 82 200 92 T400 88 L400 140 L0 140 Z" fill="#90a955" />
      {bars.map((h, i) => (
        <rect key={i} x={150 + i * 18} y={110 - h * 3} width="16" height={h * 3 + 30} fill="#e9c46a" stroke="#c9a227" strokeWidth="1" />
      ))}
      {/* 風車 */}
      <polygon points="76,120 92,120 88,70 80,70" fill="#f1faee" stroke="#6c757d" />
      <g transform="translate(84 70)">
        {[0, 90, 180, 270].map((a) => (
          <rect key={a} x="-3" y="-34" width="6" height="34" fill="#bc6c25" transform={`rotate(${a + 20})`} />
        ))}
        <circle r="4" fill="#6c757d" />
      </g>
      <rect y="128" width="400" height="12" fill="#606c38" />
    </>
  );
}

export function SceneBanner({ scene }: { scene?: SceneId }) {
  return (
    <svg className="scene-banner" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {scene === 'market' && <Market />}
      {scene === 'workshop' && <Workshop />}
      {scene === 'plaza' && <Plaza />}
      {scene === 'valley' && <Valley />}
      {scene === 'fountain' && <Fountain />}
      {scene === 'lighthouse' && <Lighthouse />}
      {scene === 'plain' && <Plain />}
      {scene === 'dice' && <DiceTown />}
      {scene === 'ruins' && <Ruins />}
      {scene === 'fort' && <Fort />}
      {scene === 'forest' && <Forest />}
      {scene === 'coast' && <Coast />}
      {scene === 'tower' && <Tower />}
      {scene === 'observatory' && <Observatory />}
      {scene === 'skycastle' && <SkyCastle />}
      {(scene === 'night' || scene === 'gate' || !scene) && <Night />}
    </svg>
  );
}

/** ホーム画面の村。クリアしたレッスンの数だけ家に灯がともる */
export function Village({ lit, total }: { lit: number; total: number }) {
  const houses = Array.from({ length: total }, (_, i) => {
    const row = i < 7 ? 0 : 1;
    const col = row === 0 ? i : i - 7;
    const x = row === 0 ? 18 + col * 54 : 44 + col * 54;
    const y = row === 0 ? 92 : 122;
    return { x, y, on: i < lit, i };
  });
  const ratio = total ? lit / total : 0;
  return (
    <svg className="village" viewBox="0 0 400 170" aria-label={`村の復興度 ${lit}/${total}`}>
      <defs>
        <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#120e2e" />
          <stop offset="100%" stopColor={ratio > 0.5 ? '#5a4fa8' : '#2c2560'} />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="170" fill="url(#vsky)" />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={(i * 67) % 400} cy={(i * 29) % 70 + 6} r={i % 4 === 0 ? 1.4 : 0.8} fill="#fff" className="twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      {/* 中央の「理の灯」の塔 */}
      <rect x="192" y="34" width="16" height="60" fill="#3d3577" />
      <path d="M186 36 L200 18 L214 36 Z" fill="#4c4391" />
      <circle cx="200" cy="44" r={8 + ratio * 30} fill="url(#glow)" />
      <circle cx="200" cy="44" r="5" fill={lit > 0 ? '#ffd166' : '#555'} className={lit > 0 ? 'pulse' : ''} />
      <path d="M0 105 Q120 85 200 98 T400 95 L400 170 L0 170 Z" fill="#1f1a45" />
      {houses.map((h) => (
        <g key={h.i} className={h.on ? 'house on' : 'house'}>
          {h.on && <circle cx={h.x + 14} cy={h.y + 6} r="22" fill="url(#glow)" />}
          <rect x={h.x} y={h.y} width="28" height="22" fill={h.on ? '#6b5bb8' : '#3a3470'} />
          <path d={`M${h.x - 4} ${h.y} L${h.x + 14} ${h.y - 14} L${h.x + 32} ${h.y} Z`} fill={h.on ? '#8b5e3c' : '#2a2555'} />
          <rect x={h.x + 9} y={h.y + 6} width="10" height="9" fill={h.on ? '#ffd166' : '#1a1640'} />
          <text x={h.x + 14} y={h.y + 31} fontSize="7" textAnchor="middle" fill={h.on ? '#ffd166' : '#6f68a8'}>
            {h.i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
