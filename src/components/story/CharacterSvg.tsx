import type { Mood, Speaker } from '../../content/types';

// キャラクターはすべて SVG で自作（外部素材なし）

export const CHAR_INFO: Record<Speaker, { name: string; color: string }> = {
  zero: { name: 'ゼロ', color: '#ffd166' },
  michiru: { name: 'ミチル', color: '#4ecdc4' },
  kai: { name: 'カイ', color: '#ff6b6b' },
  narrator: { name: '', color: '#9aa0c8' },
  npc: { name: '村人', color: '#c3a6ff' },
};

function Eyes({ mood, cx1, cx2, cy, r = 3, color = '#1b1640' }: { mood: Mood; cx1: number; cx2: number; cy: number; r?: number; color?: string }) {
  const sw = r * 0.9;
  switch (mood) {
    case 'happy':
      return (
        <g stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round">
          <path d={`M${cx1 - r} ${cy + 1} Q${cx1} ${cy - r - 1} ${cx1 + r} ${cy + 1}`} />
          <path d={`M${cx2 - r} ${cy + 1} Q${cx2} ${cy - r - 1} ${cx2 + r} ${cy + 1}`} />
        </g>
      );
    case 'surprised':
      return (
        <g fill={color}>
          <circle cx={cx1} cy={cy} r={r * 1.35} />
          <circle cx={cx2} cy={cy} r={r * 1.35} />
          <circle cx={cx1 + 1} cy={cy - 1} r={r * 0.45} fill="#fff" />
          <circle cx={cx2 + 1} cy={cy - 1} r={r * 0.45} fill="#fff" />
        </g>
      );
    case 'smug':
      return (
        <g stroke={color} strokeWidth={sw} strokeLinecap="round">
          <line x1={cx1 - r} y1={cy} x2={cx1 + r} y2={cy - 0.5} />
          <line x1={cx2 - r} y1={cy - 0.5} x2={cx2 + r} y2={cy} />
        </g>
      );
    case 'sad':
      return (
        <g fill={color}>
          <circle cx={cx1} cy={cy + 1} r={r * 0.9} />
          <circle cx={cx2} cy={cy + 1} r={r * 0.9} />
          <g stroke={color} strokeWidth={sw * 0.7} strokeLinecap="round">
            <line x1={cx1 - r} y1={cy - r} x2={cx1 + r} y2={cy - r - 2} />
            <line x1={cx2 - r} y1={cy - r - 2} x2={cx2 + r} y2={cy - r} />
          </g>
        </g>
      );
    case 'think':
      return (
        <g fill={color}>
          <circle cx={cx1} cy={cy} r={r} />
          <path d={`M${cx2 - r} ${cy} L${cx2 + r} ${cy}`} stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g fill={color}>
          <circle cx={cx1} cy={cy} r={r} />
          <circle cx={cx2} cy={cy} r={r} />
          <circle cx={cx1 + 0.9} cy={cy - 0.9} r={r * 0.35} fill="#fff" />
          <circle cx={cx2 + 0.9} cy={cy - 0.9} r={r * 0.35} fill="#fff" />
        </g>
      );
  }
}

function Mouth({ mood, cx, cy, w = 6, color = '#1b1640' }: { mood: Mood; cx: number; cy: number; w?: number; color?: string }) {
  const p = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const };
  switch (mood) {
    case 'happy':
      return <path d={`M${cx - w} ${cy - 1} Q${cx} ${cy + w} ${cx + w} ${cy - 1} Z`} fill="#c0392b" stroke={color} strokeWidth={1.5} />;
    case 'surprised':
      return <ellipse cx={cx} cy={cy + 1} rx={w * 0.4} ry={w * 0.55} fill="#c0392b" stroke={color} strokeWidth={1.5} />;
    case 'smug':
      return <path d={`M${cx - w} ${cy} Q${cx + 1} ${cy + 3} ${cx + w} ${cy - 3}`} {...p} />;
    case 'sad':
      return <path d={`M${cx - w * 0.7} ${cy + 2} Q${cx} ${cy - 2} ${cx + w * 0.7} ${cy + 2}`} {...p} />;
    case 'think':
      return <path d={`M${cx - w * 0.5} ${cy + 1} L${cx + w * 0.6} ${cy}`} {...p} />;
    default:
      return <path d={`M${cx - w * 0.7} ${cy} Q${cx} ${cy + 4} ${cx + w * 0.7} ${cy}`} {...p} />;
  }
}

function Zero({ mood }: { mood: Mood }) {
  return (
    <g>
      <defs>
        <radialGradient id="zglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="54" r="46" fill="url(#zglow)" />
      {/* 頭の上の小さな灯 */}
      <path d="M50 8 Q58 18 50 24 Q42 18 50 8 Z" fill="#ff9f1c" />
      <path d="M50 13 Q54 19 50 22 Q46 19 50 13 Z" fill="#fff3b0" />
      {/* 「0」の形の体 */}
      <ellipse cx="50" cy="56" rx="30" ry="34" fill="#ffd166" stroke="#e0a800" strokeWidth="2.5" />
      <ellipse cx="50" cy="57" rx="18" ry="22" fill="#2a2360" />
      <Eyes mood={mood} cx1={43} cx2={57} cy={53} r={3.2} color="#fff3b0" />
      <Mouth mood={mood} cx={50} cy={64} w={4.5} color="#fff3b0" />
      <ellipse cx="38" cy="62" rx="3" ry="2" fill="#ff8fab" opacity="0.6" />
      <ellipse cx="62" cy="62" rx="3" ry="2" fill="#ff8fab" opacity="0.6" />
      {/* 手 */}
      <circle cx="18" cy="66" r="5" fill="#ffd166" stroke="#e0a800" strokeWidth="2" />
      <circle cx="82" cy="66" r="5" fill="#ffd166" stroke="#e0a800" strokeWidth="2" />
    </g>
  );
}

function Michiru({ mood }: { mood: Mood }) {
  return (
    <g>
      {/* 体（測量士のコート） */}
      <path d="M18 100 Q20 76 50 74 Q80 76 82 100 Z" fill="#2a9d8f" />
      <path d="M44 74 L50 90 L56 74 Z" fill="#f4f1de" />
      <circle cx="50" cy="86" r="2" fill="#e9c46a" />
      {/* 髪（後ろ） */}
      <path d="M26 50 Q24 76 34 78 L66 78 Q76 76 74 50 Z" fill="#5c3d2e" />
      {/* 顔 */}
      <ellipse cx="50" cy="52" rx="20" ry="22" fill="#ffe0c2" />
      {/* 前髪 */}
      <path d="M30 46 Q34 30 50 30 Q66 30 70 46 Q60 38 52 42 Q44 36 30 46 Z" fill="#5c3d2e" />
      {/* 帽子 */}
      <ellipse cx="50" cy="33" rx="34" ry="7" fill="#264653" />
      <path d="M32 33 Q34 14 50 13 Q66 14 68 33 Z" fill="#264653" />
      <rect x="33" y="27" width="34" height="4" fill="#e9c46a" />
      {/* 丸めがね */}
      <g stroke="#264653" strokeWidth="1.6" fill="rgba(255,255,255,0.25)">
        <circle cx="42" cy="53" r="6" />
        <circle cx="58" cy="53" r="6" />
        <line x1="48" y1="53" x2="52" y2="53" />
      </g>
      <Eyes mood={mood} cx1={42} cx2={58} cy={53} r={2.2} />
      <Mouth mood={mood} cx={50} cy={64} w={4} />
      <ellipse cx="36" cy="61" rx="3" ry="1.8" fill="#ff8fab" opacity="0.5" />
      <ellipse cx="64" cy="61" rx="3" ry="1.8" fill="#ff8fab" opacity="0.5" />
    </g>
  );
}

function Kai({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M20 100 Q22 78 50 76 Q78 78 80 100 Z" fill="#3d348b" />
      {/* マフラー */}
      <path d="M30 76 Q50 84 70 76 L70 84 Q50 92 30 84 Z" fill="#e63946" />
      <path d="M62 82 L70 100 L60 100 L56 84 Z" fill="#c1121f" />
      <ellipse cx="50" cy="54" rx="19" ry="21" fill="#ffd9b8" />
      {/* とがった髪 */}
      <path
        d="M28 52 L24 36 L34 40 L32 24 L42 34 L46 18 L54 32 L62 20 L64 36 L76 30 L70 44 L78 50 Q70 40 50 40 Q36 40 28 52 Z"
        fill="#1d3557"
      />
      <path d="M36 46 L48 44" stroke="#1d3557" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M52 44 L64 46" stroke="#1d3557" strokeWidth="2.4" strokeLinecap="round" />
      <Eyes mood={mood} cx1={42} cx2={58} cy={54} r={2.6} />
      <Mouth mood={mood} cx={50} cy={65} w={4.5} />
    </g>
  );
}

function Npc({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M20 100 Q22 78 50 76 Q78 78 80 100 Z" fill="#8d6e63" />
      <ellipse cx="50" cy="54" rx="20" ry="21" fill="#ffd3a8" />
      <path d="M28 46 Q30 28 50 28 Q70 28 72 46 Z" fill="#a1887f" />
      <rect x="26" y="42" width="48" height="5" rx="2" fill="#6d4c41" />
      <Eyes mood={mood} cx1={42} cx2={58} cy={55} r={2.4} />
      <Mouth mood={mood} cx={50} cy={65} w={4} />
      <ellipse cx="50" cy="60" rx="3" ry="2.2" fill="#f4a582" />
    </g>
  );
}

export function CharacterSvg({ who, mood = 'normal', size = 72 }: { who: Speaker; mood?: Mood; size?: number }) {
  if (who === 'narrator') return null;
  return (
    <svg className={`char char-${who}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {who === 'zero' && <Zero mood={mood} />}
      {who === 'michiru' && <Michiru mood={mood} />}
      {who === 'kai' && <Kai mood={mood} />}
      {who === 'npc' && <Npc mood={mood} />}
    </svg>
  );
}
