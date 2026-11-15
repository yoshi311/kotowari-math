import { useState } from 'react';
import { go } from '../app/router';
import { allLessons, itemId, lookupQuestion } from '../content/course';
import { useProgress } from '../engine/progress';
import { dueIds, INTERVAL_DAYS } from '../engine/srs';
import { play } from '../engine/sound';
import { CharacterSvg } from '../components/story/CharacterSvg';
import { PracticeSession, type SessionItem, type SessionResult } from './PracticeSession';

const MAX = 10;

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildItems(ids: string[]): SessionItem[] {
  return ids
    .map((id) => {
      const hit = lookupQuestion(id);
      return hit ? { q: hit.q, qid: id, lessonId: hit.lessonId } : null;
    })
    .filter((x): x is SessionItem => !!x);
}

export function ReviewScreen() {
  const srs = useProgress((s) => s.srs);
  const lessons = useProgress((s) => s.lessons);
  const [session, setSession] = useState<{ items: SessionItem[]; kind: 'due' | 'drill' } | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  const due = dueIds(srs);
  const clearedLessons = allLessons.filter((l) => lessons[l.id]);
  const nextDue = Object.values(srs)
    .map((s) => s.due)
    .filter((d) => d > Date.now())
    .sort((a, b) => a - b)[0];

  const startDue = () => {
    setResult(null);
    setSession({ items: buildItems(due.slice(0, MAX)), kind: 'due' });
  };

  const startDrill = () => {
    const ids = clearedLessons.flatMap((l) =>
      l.steps.flatMap((s) => (s.kind === 'practice' ? s.questions.map(itemId) : [])),
    );
    setResult(null);
    setSession({ items: buildItems(shuffle([...new Set(ids)]).slice(0, 8)), kind: 'drill' });
  };

  if (session && !result) {
    return (
      <div className="review">
        <h2 className="page-title">{session.kind === 'due' ? '🔁 復習クエスト' : '⚔️ おさらい特訓'}</h2>
        <PracticeSession
          items={session.items}
          onDone={(r) => {
            play('clear');
            setResult(r);
          }}
        />
      </div>
    );
  }

  return (
    <div className="review">
      <h2 className="page-title">復習クエスト</h2>

      {result && (
        <div className="review-result pop-in">
          <div className="clear-banner">おつかれさま！</div>
          <p>
            一発正解 <strong>{result.firstOk} / {result.total}</strong>　獲得 <strong>+{result.xp} XP</strong>
          </p>
        </div>
      )}

      <div className="zero-tip">
        <CharacterSvg who="michiru" mood="normal" size={56} />
        <div className="bubble small">
          人は、覚えたことを1日で半分以上忘れてしまうと言われているわ。でも「忘れかけたころ」に思い出すと、記憶はぐっと長持ちするの。
          正解するたびに、次の復習は <strong>{INTERVAL_DAYS.slice(1).join('日→')}日後</strong> とのびていくわ。
        </div>
      </div>

      <div className="review-actions">
        <button className="review-big" disabled={due.length === 0} onClick={startDue}>
          <span className="rb-icon">🔁</span>
          <span className="rb-title">今日の復習</span>
          <span className="rb-sub">
            {due.length > 0
              ? `${Math.min(due.length, MAX)} 問（たまっている数：${due.length}）`
              : nextDue
                ? `次の復習は ${new Date(nextDue).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })} ごろ`
                : 'レッスンで問題を解くと、ここにたまるよ'}
          </span>
        </button>
        <button className="review-big alt" disabled={clearedLessons.length === 0} onClick={startDrill}>
          <span className="rb-icon">⚔️</span>
          <span className="rb-title">おさらい特訓</span>
          <span className="rb-sub">{clearedLessons.length > 0 ? 'クリアした依頼からランダムに 8 問' : '依頼をクリアすると挑戦できるよ'}</span>
        </button>
      </div>

      {clearedLessons.length === 0 && (
        <button className="btn primary wide" onClick={() => go('/')}>
          最初の依頼へ
        </button>
      )}
    </div>
  );
}
