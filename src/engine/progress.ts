import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { review, type SrsItem } from './srs';

export interface LessonRecord {
  stars: number; // 1〜3
  bestAccuracy: number; // 0〜1
  clears: number;
}

export interface QStat {
  tries: number;
  firstOk: number;
}

interface State {
  playerName: string;
  prologueSeen: boolean;
  xp: number;
  lessons: Record<string, LessonRecord>;
  cards: string[];
  srs: Record<string, SrsItem>;
  /** レッスンごとの正答の記録（苦手分析用） */
  lessonStats: Record<string, QStat>;
  streak: { count: number; last: string };
  daily: { date: string; xp: number };
  bestCombo: number;
  sound: boolean;

  setName: (n: string) => void;
  finishPrologue: () => void;
  gainXp: (n: number) => void;
  recordAnswer: (qid: string, lessonId: string, ok: boolean, firstTry: boolean) => void;
  completeLesson: (lessonId: string, accuracy: number, cardId: string) => { stars: number; newCard: boolean };
  setBestCombo: (n: number) => void;
  toggleSound: () => void;
  resetAll: () => void;
}

export const DAILY_GOAL = 60;

export function today(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return today(d);
}

// ---------- レベルとランク ----------

/** レベル n になるのに必要な累計経験値 */
export function xpForLevel(n: number): number {
  return 50 * (n - 1) * n; // 1:0, 2:100, 3:300, 4:600, …
}

export function levelInfo(xp: number) {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const cur = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, into: xp - cur, need: next - cur, ratio: (xp - cur) / (next - cur) };
}

export const RANKS = [
  { min: 1, name: '見習い理術師' },
  { min: 3, name: '駆け出し理術師' },
  { min: 6, name: '一人前の理術師' },
  { min: 10, name: '熟練の理術師' },
  { min: 15, name: '上級理術師' },
  { min: 20, name: '理術マスター' },
  { min: 30, name: '大理術師' },
];

export function rankName(level: number): string {
  return [...RANKS].reverse().find((r) => level >= r.min)!.name;
}

export function starsFor(accuracy: number): number {
  return accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;
}

const initial = {
  playerName: '',
  prologueSeen: false,
  xp: 0,
  lessons: {} as Record<string, LessonRecord>,
  cards: [] as string[],
  srs: {} as Record<string, SrsItem>,
  lessonStats: {} as Record<string, QStat>,
  streak: { count: 0, last: '' },
  daily: { date: '', xp: 0 },
  bestCombo: 0,
  sound: true,
};

export const useProgress = create<State>()(
  persist(
    (set, get) => ({
      ...initial,

      setName: (n) => set({ playerName: n.trim().slice(0, 10) }),
      finishPrologue: () => set({ prologueSeen: true }),

      gainXp: (n) => {
        const t = today();
        const s = get();
        // 連続学習日数：今日はじめて経験値を得たときに更新
        let streak = s.streak;
        if (streak.last !== t) {
          streak = { count: streak.last === yesterday() ? streak.count + 1 : 1, last: t };
        }
        const daily = s.daily.date === t ? { date: t, xp: s.daily.xp + n } : { date: t, xp: n };
        set({ xp: s.xp + n, streak, daily });
      },

      recordAnswer: (qid, lessonId, ok, firstTry) => {
        const s = get();
        const stat = s.lessonStats[lessonId] ?? { tries: 0, firstOk: 0 };
        set({
          srs: firstTry ? { ...s.srs, [qid]: review(s.srs[qid], ok, lessonId) } : s.srs,
          lessonStats: firstTry
            ? { ...s.lessonStats, [lessonId]: { tries: stat.tries + 1, firstOk: stat.firstOk + (ok ? 1 : 0) } }
            : s.lessonStats,
        });
      },

      completeLesson: (lessonId, accuracy, cardId) => {
        const s = get();
        const prev = s.lessons[lessonId];
        const stars = starsFor(accuracy);
        const newCard = !s.cards.includes(cardId);
        set({
          lessons: {
            ...s.lessons,
            [lessonId]: {
              stars: Math.max(stars, prev?.stars ?? 0),
              bestAccuracy: Math.max(accuracy, prev?.bestAccuracy ?? 0),
              clears: (prev?.clears ?? 0) + 1,
            },
          },
          cards: newCard ? [...s.cards, cardId] : s.cards,
        });
        return { stars, newCard };
      },

      setBestCombo: (n) => set((s) => ({ bestCombo: Math.max(s.bestCombo, n) })),
      toggleSound: () => set((s) => ({ sound: !s.sound })),
      resetAll: () => set({ ...initial }),
    }),
    { name: 'kotowari-progress-v1' },
  ),
);
