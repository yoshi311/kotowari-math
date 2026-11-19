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

export function SceneBanner({ scene }: { scene?: SceneId }) {
  return (
    <svg className="scene-banner" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {scene === 'market' && <Market />}
      {scene === 'workshop' && <Workshop />}
      {scene === 'plaza' && <Plaza />}
      {scene === 'valley' && <Valley />}
      {scene === 'fountain' && <Fountain />}
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
