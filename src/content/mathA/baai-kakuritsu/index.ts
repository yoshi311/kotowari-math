import type { Unit } from '../../types';
import { k01 } from './lesson01';
import { k02 } from './lesson02';
import { k03 } from './lesson03';
import { k04 } from './lesson04';
import { k05 } from './lesson05';
import { k06 } from './lesson06';
import { k07 } from './lesson07';
import { k08 } from './lesson08';
import { k09 } from './lesson09';
import { k10 } from './lesson10';

export const unitBaaiKakuritsu: Unit = {
  id: 'ma-baai-kakuritsu',
  subject: '数学A',
  title: '場合の数と確率',
  region: 'サイコロ賭場の町',
  description: '数え方の法則・順列・組合せ・確率・反復試行・条件付き確率・期待値。運に見えるしかけを、数で見やぶる理術を取りもどそう。',
  lessons: [k01, k02, k03, k04, k05, k06, k07, k08, k09, k10],
  upcoming: [],
};
