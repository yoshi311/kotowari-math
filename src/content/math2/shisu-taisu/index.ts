import type { Unit } from '../../types';
import { e01 } from './lesson01';
import { e02 } from './lesson02';
import { e03 } from './lesson03';
import { e04 } from './lesson04';
import { e05 } from './lesson05';
import { e06 } from './lesson06';
import { e07 } from './lesson07';
import { e08 } from './lesson08';
import { e09 } from './lesson09';
import { e10 } from './lesson10';

export const unitShisuTaisu: Unit = {
  id: 'm2-shisu-taisu',
  subject: '数学Ⅱ',
  title: '指数関数・対数関数',
  region: 'ログの大樹海',
  description: '0 乗・マイナス乗・分数の指数、指数関数のグラフ、対数とその性質、底の変換、常用対数。倍々にふえるものを読みとく理術を取りもどそう。',
  lessons: [e01, e02, e03, e04, e05, e06, e07, e08, e09, e10],
  upcoming: [],
};
