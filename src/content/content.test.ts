import { describe, expect, it } from 'vitest';
import { allLessons, itemId, lookupQuestion } from './course';
import { checkInput, markLabels } from '../engine/answerCheck';
import { generators } from './generators';
import type { Question } from './types';

// 教材データのまちがい（正解の書き忘れ・マーク欄のずれ・ID の重複など）を自動で見つける

function allQuestions(): Question[] {
  const out: Question[] = [];
  for (const l of allLessons) {
    for (const s of l.steps) {
      if (s.kind === 'practice') for (const q of s.questions) if (q.type !== 'gen') out.push(q);
      if (s.kind === 'explore' && s.check) out.push(s.check);
    }
  }
  return out;
}

describe('教材データ', () => {
  it('問題 ID が重複していない', () => {
    const ids = allQuestions().map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('レッスン ID・カード ID が重複していない', () => {
    expect(new Set(allLessons.map((l) => l.id)).size).toBe(allLessons.length);
    expect(new Set(allLessons.map((l) => l.card.id)).size).toBe(allLessons.length);
  });

  for (const q of allQuestions()) {
    it(`${q.id}: 正解データが正しい形`, () => {
      if (q.type === 'choice') {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.choices.length);
      } else if (q.type === 'input') {
        expect(checkInput(q, q.answer).ok).toBe(true);
      } else {
        const labels = markLabels(q.prompt);
        expect(labels.length).toBeGreaterThan(0);
        expect([...labels].sort()).toEqual(Object.keys(q.answers).sort());
        for (const v of Object.values(q.answers)) expect(v).toMatch(/^[0-9-]$/);
      }
      expect(q.explain.length).toBeGreaterThan(0);
    });
  }

  it('生成問題の名前がすべて存在する', () => {
    for (const l of allLessons) {
      for (const s of l.steps) {
        if (s.kind !== 'practice') continue;
        for (const q of s.questions) {
          if (q.type === 'gen') expect(generators[q.gen], q.gen).toBeTruthy();
          expect(lookupQuestion(itemId(q))).toBeTruthy();
        }
      }
    }
  });

  it('どのレッスンも6ステップの流れを持つ', () => {
    for (const l of allLessons) {
      const kinds = new Set(l.steps.map((s) => s.kind));
      for (const k of ['story', 'explore', 'concept', 'usage', 'practice', 'card']) expect(kinds.has(k as any), `${l.id}:${k}`).toBe(true);
    }
  });
});
