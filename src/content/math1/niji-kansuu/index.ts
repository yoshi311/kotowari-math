import type { Unit } from '../../types';
import { q01 } from './lesson01';
import { q02 } from './lesson02';
import { q03 } from './lesson03';
import { q04 } from './lesson04';
import { q05 } from './lesson05';
import { q06 } from './lesson06';
import { q07 } from './lesson07';
import { q08 } from './lesson08';
import { q09 } from './lesson09';
import { q10 } from './lesson10';

export const unitNijiKansuu: Unit = {
  id: 'm1-niji-kansuu',
  subject: '数学Ⅰ',
  title: '2次関数',
  region: 'パラボラ渓谷',
  description: '関数・放物線・平方完成・最大最小・2次方程式・判別式・2次不等式。「変化」を読み解く理術を取り戻そう。',
  lessons: [q01, q02, q03, q04, q05, q06, q07, q08, q09, q10],
  upcoming: [],
};
