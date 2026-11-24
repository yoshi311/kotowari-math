import type { Unit } from '../../types';
import { c01 } from './lesson01';
import { c02 } from './lesson02';
import { c03 } from './lesson03';
import { c04 } from './lesson04';
import { c05 } from './lesson05';
import { c06 } from './lesson06';
import { c07 } from './lesson07';
import { c08 } from './lesson08';
import { c09 } from './lesson09';
import { c10 } from './lesson10';

export const unitVectorComplex: Unit = {
  id: 'mc-vector-complex',
  subject: '数学C',
  title: 'ベクトル・平面上の曲線と複素数平面',
  region: '虚空の天空城',
  description: 'ベクトルと成分、内積、位置ベクトル、空間ベクトル、2 次曲線、媒介変数表示と極座標、複素数平面とド・モアブルの定理。向きと形と回転の理術を取りもどそう。',
  lessons: [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10],
  upcoming: [],
};
