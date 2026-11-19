import type { Unit } from '../../types';
import { d01 } from './lesson01';
import { d02 } from './lesson02';
import { d03 } from './lesson03';
import { d04 } from './lesson04';
import { d05 } from './lesson05';
import { d06 } from './lesson06';
import { d07 } from './lesson07';
import { d08 } from './lesson08';
import { d09 } from './lesson09';

export const unitDataBunseki: Unit = {
  id: 'm1-data-bunseki',
  subject: '数学Ⅰ',
  title: 'データの分析',
  region: 'ヒストグラム平原',
  description: '代表値・ヒストグラム・箱ひげ図・分散・相関・仮説検定。たくさんのデータから真実を見ぬく理術を取りもどそう。',
  lessons: [d01, d02, d03, d04, d05, d06, d07, d08, d09],
  upcoming: [],
};
