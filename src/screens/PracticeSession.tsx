import { useState } from 'react';
import type { Question } from '../content/types';
import { useProgress } from '../engine/progress';
import { play } from '../engine/sound';
import { QuestionView } from '../components/questions/QuestionView';

export interface SessionItem {
  q: Question;
  qid: string;
  lessonId: string;
}

export interface SessionResult {
  total: number;
  firstOk: number;
  maxCombo: number;
  xp: number;
}

/** コンボが続くほど、もらえる経験値がふえる */
export function xpForAnswer(combo: number): number {
  return 10 + Math.min(Math.max(combo - 1, 0), 5) * 2;
}

export function PracticeSession({ items, onDone }: { items: SessionItem[]; onDone: (r: SessionResult) => void }) {
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const gainXp = useProgress((s) => s.gainXp);
  const setBestCombo = useProgress((s) => s.setBestCombo);
  const [idx, setIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ firstOk: 0, maxCombo: 0, xp: 0 });
  const [pop, setPop] = useState<{ key: number; text: string } | null>(null);

  const item = items[idx];

  const finish = (ok: boolean) => {
    recordAnswer(item.qid, item.lessonId, ok, true);
    const nextCombo = ok ? combo + 1 : 0;
    let gained = 0;
    if (ok) {
      gained = xpForAnswer(nextCombo);
      gainXp(gained);
      setPop({ key: Date.now(), text: `+${gained} XP` });
      if (nextCombo > 0 && nextCombo % 5 === 0) play('combo');
    }
    setBestCombo(nextCombo);
    const s = {
      firstOk: stats.firstOk + (ok ? 1 : 0),
      maxCombo: Math.max(stats.maxCombo, nextCombo),
      xp: stats.xp + gained,
    };
    setStats(s);
    setCombo(nextCombo);
    if (idx + 1 >= items.length) onDone({ total: items.length, ...s });
    else {
      setIdx(idx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!item) return null;

  return (
    <div className="practice">
      <div className="practice-head">
        <div className="dots">
          {items.map((_, i) => (
            <span key={i} className={`dot ${i < idx ? 'past' : ''} ${i === idx ? 'now' : ''}`} />
          ))}
        </div>
        <div className={`combo ${combo >= 3 ? 'hot' : ''}`} key={combo}>
          {combo >= 2 ? `🔥 ${combo} コンボ` : `${idx + 1} / ${items.length}`}
        </div>
      </div>
      {pop && (
        <div key={pop.key} className="xp-pop">
          {pop.text}
        </div>
      )}
      <QuestionView key={`${idx}-${item.qid}`} q={item.q} combo={combo} onFinish={finish} />
    </div>
  );
}
