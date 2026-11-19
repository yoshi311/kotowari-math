// コース全体の目次と、問題の検索（復習クエスト用）
import { generate } from './generators';
import { unitNijiKansuu } from './math1/niji-kansuu';
import { unitSuuToShiki } from './math1/suu-to-shiki';
import { unitZukeiKeiryou } from './math1/zukei-keiryou';
import type { CardDef, Lesson, Question, QuestionItem, Unit } from './types';

export const units: Unit[] = [unitSuuToShiki, unitNijiKansuu, unitZukeiKeiryou];

/** まだ作っていない地方（ワールドマップでの予告） */
const plannedRegions: { subject: string; title: string; region: string }[] = [
  { subject: '数学Ⅰ', title: '2次関数', region: 'パラボラ渓谷' },
  { subject: '数学Ⅰ', title: '図形と計量', region: 'サイン灯台' },
  { subject: '数学Ⅰ', title: 'データの分析', region: 'ヒストグラム平原' },
  { subject: '数学A', title: '場合の数と確率', region: 'サイコロ賭場の町' },
  { subject: '数学A', title: '図形の性質', region: 'ユークリッド遺跡' },
  { subject: '数学Ⅱ', title: 'いろいろな式・図形と方程式', region: '座標の砦' },
  { subject: '数学Ⅱ', title: '指数関数・対数関数', region: 'ログの大樹海' },
  { subject: '数学Ⅱ', title: '三角関数', region: '波音の海岸' },
  { subject: '数学Ⅱ', title: '微分・積分', region: '時の流れる塔' },
  { subject: '数学B', title: '数列・統計的な推測', region: '連なる星の天文台' },
  { subject: '数学C', title: 'ベクトル・平面上の曲線と複素数平面', region: '虚空の天空城' },
];

/** まだ作っていない地方（できた地方は自動で外れる） */
export const futureRegions = plannedRegions.filter((r) => !units.some((u) => u.region === r.region));

export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);

export function findLesson(id: string): { lesson: Lesson; unit: Unit } | undefined {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, unit };
  }
  return undefined;
}

export const allCards: CardDef[] = allLessons.map((l) => l.card);

/** 問題 ID → (問題, レッスン ID)。生成問題は「gen:名前」 */
const qIndex = new Map<string, { item: QuestionItem; lessonId: string }>();
for (const l of allLessons) {
  for (const s of l.steps) {
    if (s.kind === 'practice' || s.kind === 'boss') {
      // 同じ生成問題が複数のレッスンで使われるときは、最初に出てきたレッスンの問題として扱う
      for (const q of s.questions) if (!qIndex.has(itemId(q))) qIndex.set(itemId(q), { item: q, lessonId: l.id });
    }
    if (s.kind === 'explore' && s.check) qIndex.set(s.check.id, { item: s.check, lessonId: l.id });
  }
}

export function itemId(q: QuestionItem): string {
  return q.type === 'gen' ? `gen:${q.gen}` : q.id;
}

/** 実際に出す問題に変換（生成問題は毎回ちがう数字で作る） */
export function materialize(q: QuestionItem): Question {
  return q.type === 'gen' ? generate(q.gen, q.level) : q;
}

export function lookupQuestion(id: string): { q: Question; lessonId: string } | undefined {
  const hit = qIndex.get(id);
  if (!hit) return undefined;
  return { q: materialize(hit.item), lessonId: hit.lessonId };
}

/** レッスンが遊べるか：1つ前のレッスンをクリアしていればOK */
export function isUnlocked(lessonId: string, cleared: Record<string, unknown>): boolean {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  return idx <= 0 || !!cleared[allLessons[idx - 1].id];
}
