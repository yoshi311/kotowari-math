import { describe, expect, it } from 'vitest';
import { binomTail, correlation, mean, median, modes, quartiles, variance } from './stats';
import { WHEAT } from '../components/figures/StatsFigures';

describe('データの分析の計算', () => {
  it('代表値', () => {
    const d = [2, 3, 3, 4, 5, 6, 19];
    expect(mean(d)).toBe(6);
    expect(median(d)).toBe(4);
    expect(modes(d)).toEqual([3]);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('四分位数（教科書の決め方）', () => {
    expect(quartiles([2, 4, 6, 8, 10, 12, 14, 16])).toMatchObject({ q1: 5, q2: 9, q3: 13 });
    expect(quartiles([3, 4, 6, 7, 9, 10, 12, 13, 15, 17, 19])).toMatchObject({ q1: 6, q2: 10, q3: 15 });
    expect(quartiles([3, 5, 6, 6, 7, 8, 8, 8, 12])).toMatchObject({ q1: 5.5, q2: 7, q3: 8 });
    expect(quartiles([12, 14, 15, 15, 16, 17, 18, 18, 19, 20, 24])).toMatchObject({ q1: 15, q3: 19 });
  });

  it('分散', () => {
    expect(variance([6, 7, 8, 9, 10])).toBe(2);
    expect(variance([4, 6, 8, 10, 12])).toBe(8);
    expect(variance([1, 3, 5, 7])).toBe(5);
    expect(variance([2, 4, 6, 8])).toBe(5);
  });

  it('相関係数', () => {
    expect(correlation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(correlation([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1);
  });

  it('二項分布の確率', () => {
    expect(binomTail(20, 15)).toBeCloseTo(0.0207, 3);
    expect(binomTail(20, 14)).toBeCloseTo(0.0577, 3);
    expect(binomTail(10, 9) * 1024).toBeCloseTo(11);
  });

  it('麦のデータは 30 本で、幅 10cm の度数が 3, 9, 13, 5', () => {
    expect(WHEAT.length).toBe(30);
    const c = [40, 50, 60, 70].map((a) => WHEAT.filter((v) => v >= a && v < a + 10).length);
    expect(c).toEqual([3, 9, 13, 5]);
  });
});
