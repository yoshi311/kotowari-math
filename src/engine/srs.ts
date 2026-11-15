// 間隔反復（忘れかけたころにもう一度出す）。ライトナー方式。
// 正解するたびに次に出すまでの間隔をのばし、間違えたら最初からやり直す。

export interface SrsItem {
  box: number; // 0〜5
  due: number; // 次に出す時刻（ミリ秒）
  correct: number;
  wrong: number;
  lessonId: string;
}

export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
const DAY = 24 * 60 * 60 * 1000;

export function review(item: SrsItem | undefined, ok: boolean, lessonId: string, now = Date.now()): SrsItem {
  const prev: SrsItem = item ?? { box: 0, due: now, correct: 0, wrong: 0, lessonId };
  if (ok) {
    const box = Math.min(prev.box + 1, INTERVAL_DAYS.length - 1);
    return { ...prev, box, due: now + INTERVAL_DAYS[box] * DAY, correct: prev.correct + 1 };
  }
  // 間違えたら箱 0 に戻して、すぐ（今日のうちに）復習対象にする
  return { ...prev, box: 0, due: now, wrong: prev.wrong + 1 };
}

export function dueIds(items: Record<string, SrsItem>, now = Date.now()): string[] {
  return Object.entries(items)
    .filter(([, it]) => it.due <= now)
    .sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due)
    .map(([id]) => id);
}

/** 定着度（0〜1）。箱の位置の平均 */
export function mastery(items: SrsItem[]): number {
  if (items.length === 0) return 0;
  const max = INTERVAL_DAYS.length - 1;
  return items.reduce((s, it) => s + it.box / max, 0) / items.length;
}
