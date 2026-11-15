import type { InputQuestion, MarkQuestion } from '../content/types';
import { constValue, isTidy, normalizeInput, parsePoly, polyEqual } from './poly';

export type CheckResult =
  | { ok: true }
  | { ok: false; reason: 'wrong' }
  | { ok: false; reason: 'form'; message: string }
  | { ok: false; reason: 'parse'; message: string };

export function checkInput(q: InputQuestion, raw: string): CheckResult {
  if (normalizeInput(raw) === '') {
    return { ok: false, reason: 'parse', message: '答えを入力してね' };
  }
  let given;
  try {
    given = parsePoly(raw);
  } catch (e) {
    return { ok: false, reason: 'parse', message: (e as Error).message };
  }
  const expected = parsePoly(q.answer);

  if (q.mode === 'number') {
    const g = constValue(given);
    const x = constValue(expected);
    if (g === null) return { ok: false, reason: 'parse', message: '数で答えてね' };
    return x !== null && Math.abs(g - x) < 1e-7 ? { ok: true } : { ok: false, reason: 'wrong' };
  }

  if (!polyEqual(given, expected)) return { ok: false, reason: 'wrong' };
  if (q.tidy && !isTidy(raw)) {
    return {
      ok: false,
      reason: 'form',
      message: '値は合っているよ！でも、かっこや×を使わず、同じ種類の項をまとめた形にしてね',
    };
  }
  return { ok: true };
}

export function checkMark(q: MarkQuestion, values: Record<string, string>): boolean {
  return Object.entries(q.answers).every(
    ([k, v]) => normalizeInput(values[k] ?? '') === normalizeInput(v),
  );
}

/** prompt 中の［アイ］から、マーク欄のラベルを順番に取り出す */
export function markLabels(prompt: string): string[] {
  const out: string[] = [];
  const re = /［([ァ-ヶ]+)］/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt))) for (const ch of m[1]) out.push(ch);
  return out;
}
