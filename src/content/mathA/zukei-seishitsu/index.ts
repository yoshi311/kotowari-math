import type { Unit } from '../../types';
import { g01 } from './lesson01';
import { g02 } from './lesson02';
import { g03 } from './lesson03';
import { g04 } from './lesson04';
import { g05 } from './lesson05';
import { g06 } from './lesson06';
import { g07 } from './lesson07';
import { g08 } from './lesson08';
import { g09 } from './lesson09';
import { g10 } from './lesson10';

export const unitZukeiSeishitsu: Unit = {
  id: 'ma-zukei-seishitsu',
  subject: '数学A',
  title: '図形の性質',
  region: 'ユークリッド遺跡',
  description: '辺の比・三角形の五心・チェバとメネラウス・円周角・接線・方べき・2 円の関係・空間図形。図形にかくされた関係を見ぬく理術を取りもどそう。',
  lessons: [g01, g02, g03, g04, g05, g06, g07, g08, g09, g10],
  upcoming: [],
};
