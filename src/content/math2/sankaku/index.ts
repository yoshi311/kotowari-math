import type { Unit } from '../../types';
import { s01 } from './lesson01';
import { s02 } from './lesson02';
import { s03 } from './lesson03';
import { s04 } from './lesson04';
import { s05 } from './lesson05';
import { s06 } from './lesson06';
import { s07 } from './lesson07';
import { s08 } from './lesson08';
import { s09 } from './lesson09';
import { s10 } from './lesson10';

export const unitSankaku: Unit = {
  id: 'm2-sankaku',
  subject: '数学Ⅱ',
  title: '三角関数',
  region: '波音の海岸',
  description: '弧度法と一般角、単位円で決める sin・cos・tan、波のグラフ、方程式・不等式、加法定理・2 倍角・合成。回転と波の理術を取りもどそう。',
  lessons: [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10],
  upcoming: [],
};
