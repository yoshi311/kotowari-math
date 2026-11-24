import { useEffect, useMemo, useRef, useState } from 'react';
import { itemId, materialize } from '../content/course';
import type { BossStep } from '../content/types';
import { useProgress } from '../engine/progress';
import { play } from '../engine/sound';
import { fx } from '../engine/fx';
import { QuestionView } from '../components/questions/QuestionView';
import { Dialogue } from '../components/story/Dialogue';
import { xpForAnswer, type SessionResult } from './PracticeSession';

type Phase = 'intro' | 'fight' | 'lose';

/**
 * ボス戦。ボスの HP を 0 にすれば勝ち。
 * まちがえるとライフが減り、ライフか時間がなくなると負け（何度でも再挑戦できる）。
 */
export function BossView({ step, lessonId, onWin }: { step: BossStep; lessonId: string; onWin: (r: SessionResult) => void }) {
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const gainXp = useProgress((s) => s.gainXp);
  const setBestCombo = useProgress((s) => s.setBestCombo);
  const [phase, setPhase] = useState<Phase>('intro');
  const [introDone, setIntroDone] = useState(false);
  const [round, setRound] = useState(0);
  const [idx, setIdx] = useState(0);
  const [hp, setHp] = useState(step.boss.hp);
  const [lives, setLives] = useState(step.lives);
  const [left, setLeft] = useState(step.timeLimit);
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ firstOk: 0, total: 0, maxCombo: 0, xp: 0 });
  const [hit, setHit] = useState(0);
  const bossRef = useRef<HTMLDivElement>(null);
  const [loseReason, setLoseReason] = useState<'time' | 'lives'>('lives');

  // 挑戦のたびに、生成問題の数字を作り直す
  const items = useMemo(
    () => step.questions.map((q) => ({ q: materialize(q), qid: itemId(q) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, round],
  );

  useEffect(() => {
    if (phase !== 'fight') return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'fight' && left <= 0) {
      play('ng');
      setLoseReason('time');
      setPhase('lose');
    }
  }, [left, phase]);

  const start = () => {
    setRound((r) => r + 1);
    setIdx(0);
    setHp(step.boss.hp);
    setLives(step.lives);
    setLeft(step.timeLimit);
    setCombo(0);
    setStats({ firstOk: 0, total: 0, maxCombo: 0, xp: 0 });
    setPhase('fight');
    window.scrollTo(0, 0);
  };

  const finish = (ok: boolean) => {
    const item = items[idx];
    recordAnswer(item.qid, lessonId, ok, true);
    const nextCombo = ok ? combo + 1 : 0;
    const gained = ok ? xpForAnswer(nextCombo) : 0;
    if (ok) {
      gainXp(gained);
      setHit((h) => h + 1);
      // 画面がボスのほうへもどってから、打撃の演出
      setTimeout(() => {
        play('hit', nextCombo);
        fx.flash('rgba(255, 255, 255, 0.4)');
        fx.text(bossRef.current, '-1', '#ff5d8f', true);
        fx.burst(bossRef.current, { combo: nextCombo });
      }, 280);
    } else {
      setTimeout(() => fx.flash('rgba(239, 71, 111, 0.25)'), 280);
    }
    setBestCombo(nextCombo);
    const s = {
      firstOk: stats.firstOk + (ok ? 1 : 0),
      total: stats.total + 1,
      maxCombo: Math.max(stats.maxCombo, nextCombo),
      xp: stats.xp + gained,
    };
    setStats(s);
    setCombo(nextCombo);
    const nextHp = ok ? hp - 1 : hp;
    const nextLives = ok ? lives : lives - 1;
    setHp(nextHp);
    setLives(nextLives);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (nextHp <= 0) {
      onWin(s);
    } else if (nextLives <= 0 || idx + 1 >= items.length) {
      play('ng');
      setLoseReason('lives');
      setPhase('lose');
    } else {
      setIdx(idx + 1);
    }
  };

  const mm = Math.floor(Math.max(left, 0) / 60);
  const ss = String(Math.max(left, 0) % 60).padStart(2, '0');

  return (
    <>
      <h2 className="step-title">{step.title}</h2>
      <div className="boss-arena">
        <div key={hit} ref={bossRef} className={`boss-figure ${hit ? 'hit' : ''}`}>{phase === 'lose' ? '😈' : '👹'}</div>
        <div className="boss-name">{step.boss.name}</div>
        <div className="hp-bar">
          <div style={{ width: `${(hp / step.boss.hp) * 100}%` }} />
        </div>
        <div className="boss-status">
          <span>{'❤️'.repeat(Math.max(lives, 0))}{'🖤'.repeat(step.lives - Math.max(lives, 0))}</span>
          <span>HP {hp}/{step.boss.hp}</span>
          <span className={`timer ${left <= 60 ? 'low' : ''}`}>⏱ {mm}:{ss}</span>
        </div>
      </div>

      {phase === 'intro' && (
        <>
          <Dialogue lines={step.intro} onDone={() => setIntroDone(true)} />
          {introDone && (
            <div className="pop-in">
              <ul className="points">
                <li>正解するたびにボスに 1 ダメージ。HP を 0 にすれば勝ち！</li>
                <li>まちがえるとライフ ❤️ が減る（{step.lives} 回まで）。</li>
                <li>制限時間は {Math.round(step.timeLimit / 60)} 分。共通テスト本番のつもりで！</li>
              </ul>
              <button className="btn primary wide" onClick={start}>
                ⚔️ 戦いをはじめる
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'fight' && items[idx] && (
        <QuestionView key={`${round}-${idx}`} q={items[idx].q} combo={combo} onFinish={finish} />
      )}

      {phase === 'lose' && (
        <div className="pop-in">
          <div className="clear-banner" style={{ color: '#ff8aa6' }}>{loseReason === 'time' ? '時間切れ…' : 'ライフがなくなった…'}</div>
          <Dialogue lines={step.lose} />
          <p className="retry-note">
            一発正解 {stats.firstOk} / {stats.total}。まちがえた問題は「復習クエスト」にたまっているよ。
          </p>
          <button className="btn primary wide" onClick={start}>
            もう一度挑戦する
          </button>
        </div>
      )}
    </>
  );
}
