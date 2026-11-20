import type { Unit } from '../../types';
import { b01 } from './lesson01';
import { b02 } from './lesson02';
import { b03 } from './lesson03';
import { b04 } from './lesson04';
import { b05 } from './lesson05';
import { b06 } from './lesson06';
import { b07 } from './lesson07';
import { b08 } from './lesson08';
import { b09 } from './lesson09';
import { b10 } from './lesson10';

export const unitSuretsuToukei: Unit = {
  id: 'mb-suretsu-toukei',
  subject: '数学B',
  title: '数列・統計的な推測',
  region: '連なる星の天文台',
  description: '等差・等比数列、Σ、階差数列、漸化式、確率変数と期待値、二項分布、正規分布、推定と検定。星のきまりと、ノイズの中の真実を取りもどそう。',
  lessons: [b01, b02, b03, b04, b05, b06, b07, b08, b09, b10],
  upcoming: [],
};
