import type { Unit } from '../../types';
import { lesson01 } from './lesson01';
import { lesson02 } from './lesson02';
import { lesson03 } from './lesson03';

export const unitSuuToShiki: Unit = {
  id: 'm1-suu-to-shiki',
  subject: '数学Ⅰ',
  title: '数と式・集合と命題',
  region: 'カズノハ村',
  description: '文字式・展開・因数分解・実数・不等式・集合と論理。すべての数学の土台になる「ことば」を取り戻そう。',
  lessons: [lesson01, lesson02, lesson03],
  upcoming: [
    { no: 4, title: '因数分解' },
    { no: 5, title: '実数と数直線' },
    { no: 6, title: '絶対値' },
    { no: 7, title: '根号の計算・有理化' },
    { no: 8, title: '1次不等式' },
    { no: 9, title: '絶対値つき方程式・不等式' },
    { no: 10, title: '集合' },
    { no: 11, title: '命題・必要条件と十分条件' },
    { no: 12, title: '逆・裏・対偶と背理法' },
    { no: 13, title: 'ボス戦：カズノハの番人' },
  ],
};
