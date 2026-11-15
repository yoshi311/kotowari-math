// 効果音は Web Audio API で合成（音声ファイル不要）
import { useProgress } from './progress';

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = ctx.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export type Sfx = 'ok' | 'ng' | 'combo' | 'tap' | 'clear' | 'card';

export function play(kind: Sfx, combo = 0) {
  if (!useProgress.getState().sound) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    return;
  }
  switch (kind) {
    case 'tap':
      tone(660, 0, 0.06, 'triangle', 0.06);
      break;
    case 'ok': {
      const up = Math.min(combo, 8) * 40;
      tone(784 + up, 0, 0.12, 'triangle');
      tone(1046 + up, 0.08, 0.2, 'triangle');
      break;
    }
    case 'combo':
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.06, 0.15, 'square', 0.06));
      break;
    case 'ng':
      tone(220, 0, 0.18, 'sawtooth', 0.07);
      tone(185, 0.12, 0.25, 'sawtooth', 0.07);
      break;
    case 'clear':
      [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.25, 'triangle'));
      break;
    case 'card':
      [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, i * 0.08, 0.4, 'sine', 0.1));
      break;
  }
}
