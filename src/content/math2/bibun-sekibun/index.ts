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
import { d10 } from './lesson10';

export const unitBibunSekibun: Unit = {
  id: 'm2-bibun-sekibun',
  subject: '数学Ⅱ',
  title: '微分・積分',
  region: '時の流れる塔',
  description: '平均変化率と極限、導関数、接線、増減と極値、最大・最小、不定積分・定積分、面積。変化の瞬間と積み重ねの理術を取りもどそう。',
  lessons: [d01, d02, d03, d04, d05, d06, d07, d08, d09, d10],
  upcoming: [],
};
