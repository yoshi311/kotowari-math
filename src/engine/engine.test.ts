import { describe, expect, it } from 'vitest';
import { isFactored, isTidy, parsePoly, polyEqual } from './poly';
import { checkInput, checkMark, markLabels } from './answerCheck';
import { generators } from '../content/generators';
import { dueIds, review } from './srs';
import { levelInfo, starsFor } from './progress';
import type { InputQuestion, MarkQuestion } from '../content/types';

const eq = (a: string, b: string) => polyEqual(parsePoly(a), parsePoly(b));

describe('parsePoly', () => {
  it('展開して比べられる', () => {
    expect(eq('(x+2)(x+3)', 'x^2+5x+6')).toBe(true);
    expect(eq('(x-4)^2', 'x^2-8x+16')).toBe(true);
    expect(eq('3ab', 'a*b*3')).toBe(true);
    expect(eq('2x(x+3)', '2x^2+6x')).toBe(true);
    expect(eq('x^2+5x+6', 'x^2+5x+7')).toBe(false);
  });
  it('入力のゆれを吸収する', () => {
    expect(eq('ｘ²＋５ｘ−６', 'x^2+5x-6')).toBe(true);
    expect(eq('3×a', '3a')).toBe(true);
    expect(eq('a÷4', '0.25a')).toBe(true);
    expect(eq('x³', 'xxx')).toBe(true);
  });
  it('おかしな式はエラー', () => {
    expect(() => parsePoly('x+')).toThrow();
    expect(() => parsePoly('(x+1')).toThrow();
    expect(() => parsePoly('1/x')).toThrow();
    expect(() => parsePoly('x?')).toThrow();
  });
});

describe('isTidy', () => {
  it('整理された形かどうか', () => {
    expect(isTidy('x^2+5x+6')).toBe(true);
    expect(isTidy('-x^2-8x')).toBe(true);
    expect(isTidy('3ab')).toBe(true);
    expect(isTidy('0')).toBe(true);
    expect(isTidy('(x+2)(x+3)')).toBe(false);
    expect(isTidy('3x+2x')).toBe(false);
    expect(isTidy('a*b*3')).toBe(false);
    expect(isTidy('xx')).toBe(false);
    expect(isTidy('x2')).toBe(false);
  });
});

describe('isFactored', () => {
  it('かけ算の形かどうか', () => {
    expect(isFactored('(x+2)(x+3)')).toBe(true);
    expect(isFactored('x(2x-1)')).toBe(true);
    expect(isFactored('-(x-1)^2')).toBe(true);
    expect(isFactored('(x-4)^2')).toBe(true);
    expect(isFactored('x^2+5x+6')).toBe(false);
    expect(isFactored('(x+1)(x+2)+1')).toBe(false);
  });
});

describe('checkInput', () => {
  const q: InputQuestion = {
    id: 't', level: 'calc', type: 'input', mode: 'expr', tidy: true,
    prompt: '', explain: '', answer: 'x^2+5x+6',
  };
  it('正解・形がちがう・不正解', () => {
    expect(checkInput(q, 'x²+5x+6').ok).toBe(true);
    expect(checkInput(q, '5x+x^2+6').ok).toBe(true);
    const form = checkInput(q, '(x+2)(x+3)');
    expect(form.ok === false && form.reason).toBe('form');
    const wrong = checkInput(q, 'x^2+6');
    expect(wrong.ok === false && wrong.reason).toBe('wrong');
  });
  it('数の問題', () => {
    const n: InputQuestion = { ...q, mode: 'number', answer: '-7', tidy: false };
    expect(checkInput(n, '−7').ok).toBe(true);
    expect(checkInput(n, '7').ok).toBe(false);
  });
});

describe('マーク式', () => {
  const q: MarkQuestion = {
    id: 'm', level: 'exam', type: 'mark', explain: '',
    prompt: '$x^2+$［ア］$x-$［イウ］', answers: { ア: '2', イ: '1', ウ: '5' },
  };
  it('ラベルを取り出す', () => {
    expect(markLabels(q.prompt)).toEqual(['ア', 'イ', 'ウ']);
  });
  it('判定', () => {
    expect(checkMark(q, { ア: '2', イ: '1', ウ: '5' })).toBe(true);
    expect(checkMark(q, { ア: '２', イ: '1', ウ: '5' })).toBe(true);
    expect(checkMark(q, { ア: '2', イ: '1', ウ: '6' })).toBe(false);
  });
});

describe('問題生成', () => {
  for (const [name, gen] of Object.entries(generators)) {
    it(`${name}: 200 回生成して、答えが正しく整理された形になっている`, () => {
      for (let i = 0; i < 200; i++) {
        const q = gen('calc');
        if (q.type === 'choice') {
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(new Set(q.choices).size).toBe(q.choices.length);
          continue;
        }
        if (q.type !== 'input') continue;
        expect(checkInput(q, q.answer).ok).toBe(true);
        if (q.source) expect(eq(q.source, q.answer)).toBe(true);
        if (q.factored) expect(checkInput(q, q.source!).ok).toBe(false);
      }
    });
  }
});

describe('間隔反復', () => {
  it('正解で間隔がのび、まちがいで戻る', () => {
    const now = 1_000_000;
    let it1 = review(undefined, true, 'L1', now);
    expect(it1.box).toBe(1);
    expect(dueIds({ a: it1 }, now)).toEqual([]);
    expect(dueIds({ a: it1 }, now + 86_400_000)).toEqual(['a']);
    it1 = review(it1, false, 'L1', now);
    expect(it1.box).toBe(0);
    expect(dueIds({ a: it1 }, now)).toEqual(['a']);
  });
});

describe('レベル', () => {
  it('経験値からレベル', () => {
    expect(levelInfo(0).level).toBe(1);
    expect(levelInfo(100).level).toBe(2);
    expect(levelInfo(299).level).toBe(2);
    expect(levelInfo(300).level).toBe(3);
    expect(starsFor(0.95)).toBe(3);
    expect(starsFor(0.75)).toBe(2);
    expect(starsFor(0.5)).toBe(1);
  });
});
