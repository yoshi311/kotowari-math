import { describe, expect, it } from 'vitest';
import { fact, fracStr, fracTex, nCr, perm } from './prob';

describe('場合の数と確率の計算', () => {
  it('階乗・順列・組合せ', () => {
    expect(fact(0)).toBe(1);
    expect(fact(5)).toBe(120);
    expect(perm(5, 3)).toBe(60);
    expect(nCr(8, 3)).toBe(56);
    expect(nCr(10, 8)).toBe(45);
    expect(nCr(43, 6)).toBe(6096454);
    expect(nCr(3, 5)).toBe(0);
  });

  it('分数の約分', () => {
    expect(fracStr(6, 36)).toBe('1/6');
    expect(fracStr(75, 216)).toBe('25/72');
    expect(fracStr(4, 2)).toBe('2');
    expect(fracTex(24, 81)).toBe('\\dfrac{8}{27}');
  });
});
