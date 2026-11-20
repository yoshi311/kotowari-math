import type { Unit } from '../../types';
import { z01 } from './lesson01';
import { z02 } from './lesson02';
import { z03 } from './lesson03';
import { z04 } from './lesson04';
import { z05 } from './lesson05';
import { z06 } from './lesson06';
import { z07 } from './lesson07';
import { z08 } from './lesson08';
import { z09 } from './lesson09';
import { z10 } from './lesson10';

export const unitShikiZukei: Unit = {
  id: 'm2-shiki-zukei',
  subject: '数学Ⅱ',
  title: 'いろいろな式・図形と方程式',
  region: '座標の砦',
  description: '二項定理・証明・複素数・解と係数の関係・因数定理、そして点・直線・円・軌跡と領域。式と図形を自在に行き来する理術を取りもどそう。',
  lessons: [z01, z02, z03, z04, z05, z06, z07, z08, z09, z10],
  upcoming: [],
};
