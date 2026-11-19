import type { Unit } from '../../types';
import { t01 } from './lesson01';
import { t02 } from './lesson02';
import { t03 } from './lesson03';
import { t04 } from './lesson04';
import { t05 } from './lesson05';
import { t06 } from './lesson06';
import { t07 } from './lesson07';
import { t08 } from './lesson08';
import { t09 } from './lesson09';

export const unitZukeiKeiryou: Unit = {
  id: 'm1-zukei-keiryou',
  subject: '数学Ⅰ',
  title: '図形と計量',
  region: 'サイン灯台',
  description: '三角比・単位円・正弦定理・余弦定理・面積・空間図形。測れない長さや角を計算する理術を取り戻そう。',
  lessons: [t01, t02, t03, t04, t05, t06, t07, t08, t09],
  upcoming: [],
};
