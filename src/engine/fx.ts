// 画面全体に重ねる演出（粒・浮かぶ文字・紙ふぶき・フラッシュ）。
// どこからでも fx.burst(...) のように呼び、FxLayer が描く。

export type FxItem =
  | { id: number; kind: 'particle'; x: number; y: number; dx: number; dy: number; rot: number; color: string; shape: 'star' | 'dot' | 'rect'; size: number; dur: number; delay: number }
  | { id: number; kind: 'text'; x: number; y: number; text: string; color: string; big: boolean }
  | { id: number; kind: 'banner'; text: string; tier: number }
  | { id: number; kind: 'flash'; color: string };

type Listener = (items: FxItem[]) => void;

let items: FxItem[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(items);
}
function add(list: FxItem[], life: number) {
  items = [...items, ...list];
  emit();
  const ids = new Set(list.map((i) => i.id));
  setTimeout(() => {
    items = items.filter((i) => !ids.has(i.id));
    emit();
  }, life);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  l(items);
  return () => listeners.delete(l);
}

/** 動きを減らす設定のときは控えめにする */
const calm = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const COLORS = ['#ffd166', '#06d6a0', '#00bbf9', '#f15bb5', '#c77dff', '#ffffff'];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/** 要素の中心（なければ画面の中央） */
function center(el?: Element | null): { x: number; y: number } {
  if (el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 80) };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export const fx = {
  /** 正解のときに粒が飛びちる。perfect なら多め、combo が多いほど派手 */
  burst(el: Element | null | undefined, opts: { perfect?: boolean; combo?: number } = {}) {
    const { x, y } = center(el);
    const n = calm() ? 6 : 14 + (opts.perfect ? 8 : 0) + Math.min(opts.combo ?? 0, 10) * 2;
    const list: FxItem[] = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 60 + Math.random() * (90 + Math.min(opts.combo ?? 0, 10) * 8);
      list.push({
        id: nextId++,
        kind: 'particle',
        x,
        y,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 30,
        rot: Math.random() * 540 - 270,
        color: pick(COLORS),
        shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'dot' : 'rect',
        size: 6 + Math.random() * 8,
        dur: 650 + Math.random() * 350,
        delay: Math.random() * 60,
      });
    }
    add(list, 1200);
  },

  /** 浮かび上がる文字（+10 XP、ダメージの数字など） */
  text(el: Element | null | undefined, text: string, color = '#ffd166', big = false) {
    const { x, y } = center(el);
    add([{ id: nextId++, kind: 'text', x, y: y - 10, text, color, big }], 1300);
  },

  /** 画面中央の大きな文字（コンボなど）。tier が大きいほど派手 */
  banner(text: string, tier = 1) {
    add([{ id: nextId++, kind: 'banner', text, tier }], 1500);
  },

  /** 画面が一瞬光る */
  flash(color = 'rgba(255,255,255,0.35)') {
    if (calm()) return;
    add([{ id: nextId++, kind: 'flash', color }], 450);
  },

  /** 上から紙ふぶきが降る（クリアのとき） */
  confetti(count = 70) {
    const n = calm() ? 12 : count;
    const w = window.innerWidth;
    const list: FxItem[] = [];
    for (let i = 0; i < n; i++) {
      list.push({
        id: nextId++,
        kind: 'particle',
        x: Math.random() * w,
        y: -20,
        dx: Math.random() * 120 - 60,
        dy: window.innerHeight * (0.7 + Math.random() * 0.4),
        rot: Math.random() * 720 - 360,
        color: pick(COLORS),
        shape: i % 4 === 0 ? 'star' : 'rect',
        size: 7 + Math.random() * 7,
        dur: 1800 + Math.random() * 1400,
        delay: Math.random() * 900,
      });
    }
    add(list, 4300);
  },
};
