// 効果音は Web Audio API で合成（音声ファイル不要・著作権の心配なし）
import { useProgress } from './progress';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wet: GainNode | null = null;

/** 音の出口：マスター音量と、軽い残響（ディレイのくり返し） */
function setup(): boolean {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      // 残響：少し遅らせた音を小さくくり返す
      const delay = ctx.createDelay(1);
      delay.delayTime.value = 0.13;
      const fb = ctx.createGain();
      fb.gain.value = 0.28;
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 3200;
      wet = ctx.createGain();
      wet.gain.value = 0.32;
      wet.connect(delay);
      delay.connect(tone);
      tone.connect(fb);
      fb.connect(delay);
      tone.connect(master);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return true;
  } catch {
    return false;
  }
}

function out(g: GainNode, reverb: boolean) {
  g.connect(master!);
  if (reverb) g.connect(wet!);
}

/** 1 つの音（エンベロープつき） */
function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, reverb = true, slideTo?: number) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t = c.currentTime + start;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  out(g, reverb);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** 鐘のような音色（基音＋高い倍音） */
function bell(freq: number, start: number, dur = 0.6, vol = 0.12) {
  tone(freq, start, dur, 'sine', vol);
  tone(freq * 2, start, dur * 0.6, 'sine', vol * 0.35);
  tone(freq * 3.01, start, dur * 0.35, 'sine', vol * 0.18);
}

/** ノイズ（打撃音・「シュッ」という音） */
function noise(start: number, dur: number, vol: number, from: number, to: number, type: BiquadFilterType = 'bandpass') {
  const c = ctx!;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type;
  const t = c.currentTime + start;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g);
  out(g, false);
  src.start(t);
}

/** ド・ミ・ソ…の周波数（半音 n 個上） */
const note = (base: number, n: number) => base * 2 ** (n / 12);
const C5 = 523.25;

export type Sfx = 'ok' | 'perfect' | 'ng' | 'combo' | 'tap' | 'clear' | 'card' | 'reveal' | 'rare' | 'xp' | 'star' | 'hit';

/** スマホの振動（使える端末だけ） */
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* 振動できない端末 */
  }
}

/**
 * 効果音を鳴らす。
 * combo：今のコンボ数（ok の音程が上がる）、n：星の番号など
 */
export function play(kind: Sfx, combo = 0) {
  if (!useProgress.getState().sound) return;
  if (!setup()) return;
  const up = Math.min(combo, 10); // 半音ずつ上がる
  switch (kind) {
    case 'tap':
      tone(880, 0, 0.05, 'triangle', 0.05, false);
      break;
    case 'ok':
      // 明るい 2 音のチャイム（コンボで音程が上がる）
      bell(note(C5, 7 + up), 0, 0.45, 0.13);
      bell(note(C5, 12 + up), 0.07, 0.7, 0.13);
      buzz(18);
      break;
    case 'perfect':
      // 一発正解のキラキラ（ok に重ねる）
      [19, 24, 28, 31].forEach((n, i) => tone(note(C5, n + up), 0.12 + i * 0.045, 0.25, 'sine', 0.045));
      break;
    case 'combo': {
      // 3・5・10 コンボで長くなるアルペジオ
      const steps = combo >= 10 ? [0, 4, 7, 12, 16, 19, 24] : combo >= 5 ? [0, 4, 7, 12, 16] : [0, 4, 7, 12];
      steps.forEach((n, i) => tone(note(C5 * 2, n), 0.18 + i * 0.055, 0.22, 'square', 0.035));
      tone(note(C5, 0), 0.18, 0.5, 'triangle', 0.06);
      buzz([20, 40, 20]);
      break;
    }
    case 'ng':
      // やわらかい「ポン」と下がる音（責めない）
      tone(392, 0, 0.22, 'triangle', 0.09, false, 300);
      tone(311, 0.12, 0.28, 'sine', 0.07, false, 260);
      buzz(40);
      break;
    case 'xp':
      // コインの音
      [0, 0.07, 0.14].forEach((s, i) => {
        tone(note(C5 * 2, 7 + i * 2), s, 0.08, 'square', 0.03, false);
        tone(note(C5 * 2, 12 + i * 2), s + 0.035, 0.12, 'square', 0.03);
      });
      break;
    case 'star': {
      // 星が 1 つ出るごとに音程が上がる（combo に星の番号 0〜2 を入れる）
      const n = [7, 12, 16][Math.min(combo, 2)];
      bell(note(C5, n), 0, 0.6, 0.12);
      tone(note(C5, n + 12), 0.03, 0.3, 'sine', 0.04);
      break;
    }
    case 'hit':
      // ボスへの打撃（ノイズ＋低い音）
      noise(0, 0.18, 0.35, 2500, 400);
      tone(140, 0, 0.25, 'sine', 0.22, false, 60);
      tone(note(C5, 12 + up), 0.06, 0.25, 'triangle', 0.06);
      buzz(45);
      break;
    case 'clear':
      // 依頼達成のファンファーレ
      [[0, 0], [4, 0.12], [7, 0.24], [12, 0.36]].forEach(([n, s]) => tone(note(C5, n), s, 0.28, 'triangle', 0.1));
      [0, 4, 7, 12].forEach((n) => tone(note(C5, n), 0.52, 0.9, 'triangle', 0.06));
      bell(note(C5, 24), 0.52, 1.0, 0.07);
      break;
    case 'reveal':
      // カードがめくれる「シュッ」＋和音
      noise(0, 0.35, 0.18, 600, 6000, 'highpass');
      [0, 4, 7, 11].forEach((n) => bell(note(C5, n + 12), 0.3, 0.9, 0.05));
      break;
    case 'card':
      [12, 16, 19, 24].forEach((n, i) => bell(note(C5, n), i * 0.08, 0.6, 0.07));
      break;
    case 'rare':
      // ★3 のファンファーレ（キラキラ上昇）
      [0, 4, 7, 12, 16, 19, 24, 28].forEach((n, i) => tone(note(C5, n), 0.35 + i * 0.05, 0.3, 'sine', 0.06));
      [12, 16, 19].forEach((n) => tone(note(C5, n), 0.8, 1.2, 'triangle', 0.05));
      buzz([30, 50, 30, 50, 60]);
      break;
  }
}
