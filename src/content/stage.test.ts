import { describe, expect, it } from 'vitest';
import { allCards, allLessons, cardMeta, isUnlocked, recommendedLesson } from './course';
import { motifOf } from '../components/cards/CardArt';

describe('ステージ選択とカード', () => {
  it('どの依頼も最初から選べる', () => {
    for (const l of allLessons) expect(isUnlocked(l.id, {})).toBe(true);
  });

  it('おすすめは物語順で最初の未クリア依頼', () => {
    expect(recommendedLesson({})?.id).toBe(allLessons[0].id);
    const cleared = Object.fromEntries(allLessons.slice(0, 5).map((l) => [l.id, true]));
    expect(recommendedLesson(cleared)?.id).toBe(allLessons[5].id);
    // とびとびにクリアしても、物語順で最初の未クリアを返す
    expect(recommendedLesson({ [allLessons[0].id]: true, [allLessons[2].id]: true })?.id).toBe(allLessons[1].id);
    expect(recommendedLesson(Object.fromEntries(allLessons.map((l) => [l.id, true])))).toBeUndefined();
  });

  it('全カードに番号と絵のモチーフがある', () => {
    allCards.forEach((c, i) => {
      const m = cardMeta(c.id);
      expect(m?.no).toBe(i + 1);
      expect(motifOf(m!.lesson), c.id).toBeDefined();
    });
  });
});
