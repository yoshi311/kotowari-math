import { useEffect, useMemo, useRef, useState } from 'react';
import { go } from '../app/router';
import { allLessons, findLesson, itemId, materialize } from '../content/course';
import type { CardStep, ConceptStep, ExploreStep, Lesson, PracticeStep, Step, StoryStep, UsageStep } from '../content/types';
import { starsFor, useProgress } from '../engine/progress';
import { play } from '../engine/sound';
import { Figure } from '../components/figures/Figure';
import { QuestionView } from '../components/questions/QuestionView';
import { RichText, Tex } from '../components/RichText';
import { Dialogue } from '../components/story/Dialogue';
import { SceneBanner } from '../components/story/Scenes';
import { BossView } from './BossView';
import { TcgCard } from '../components/cards/TcgCard';
import { CardBack } from '../components/cards/CardBack';
import { fx } from '../engine/fx';
import { PracticeSession, type SessionResult } from './PracticeSession';

const STEP_META: Record<Step['kind'], { icon: string; label: string }> = {
  story: { icon: '❓', label: 'なぞ' },
  explore: { icon: '🖐', label: 'さわって発見' },
  concept: { icon: '💡', label: 'ことばにする' },
  usage: { icon: '🌍', label: 'どこで使う？' },
  practice: { icon: '⚔️', label: '練習' },
  card: { icon: '🃏', label: 'カード獲得' },
  boss: { icon: '👹', label: 'ボス戦' },
};

export function LessonScreen({ id }: { id: string }) {
  const found = findLesson(id);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);

  if (!found) {
    return (
      <div className="empty">
        <p>この依頼は見つかりませんでした。</p>
        <button className="btn" onClick={() => go('/')}>村へもどる</button>
      </div>
    );
  }
  const { lesson } = found;
  const step = lesson.steps[stepIdx];
  const next = () => {
    play('tap');
    setStepIdx((i) => Math.min(i + 1, lesson.steps.length - 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="lesson">
      <header className="lesson-head">
        <button
          className="icon-btn"
          aria-label="村へもどる"
          onClick={() => {
            if (step.kind === 'card' || confirm('依頼を中断して村へもどる？（このレッスンの進み具合は保存されません）')) go('/');
          }}
        >
          ✕
        </button>
        <div className="lesson-progress">
          {lesson.steps.map((s, i) => (
            <span key={i} className={`lp-seg ${i < stepIdx ? 'past' : ''} ${i === stepIdx ? 'now' : ''}`} title={STEP_META[s.kind].label} />
          ))}
        </div>
        <span className="lesson-no">依頼 {lesson.no}</span>
      </header>

      <div className="step-tag">
        <span>{STEP_META[step.kind].icon}</span> {STEP_META[step.kind].label}
      </div>

      <div className="step-body" key={stepIdx}>
        {step.kind === 'story' && <StoryView step={step} lesson={lesson} onNext={next} />}
        {step.kind === 'explore' && <ExploreView step={step} lessonId={lesson.id} onNext={next} />}
        {step.kind === 'concept' && <ConceptView step={step} onNext={next} />}
        {step.kind === 'usage' && <UsageView step={step} onNext={next} />}
        {step.kind === 'practice' && (
          <PracticeView
            step={step}
            lessonId={lesson.id}
            onDone={(r) => {
              setResult(r);
              next();
            }}
          />
        )}
        {step.kind === 'boss' && (
          <BossView
            step={step}
            lessonId={lesson.id}
            onWin={(r) => {
              setResult(r);
              next();
            }}
          />
        )}
        {step.kind === 'card' && <CardView step={step} lesson={lesson} result={result} />}
      </div>
    </div>
  );
}

function NextButton({ onClick, label = 'つぎへ ▶', show = true }: { onClick: () => void; label?: string; show?: boolean }) {
  if (!show) return null;
  return (
    <button className="btn primary wide next-btn pop-in" onClick={onClick}>
      {label}
    </button>
  );
}

// ---------- なぞ ----------

function StoryView({ step, lesson, onNext }: { step: StoryStep; lesson: Lesson; onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <>
      <div className="scene-wrap">
        <SceneBanner scene={step.scene} />
        <div className="scene-caption">
          <span className="quest-label">依頼</span>
          <strong>{lesson.quest}</strong>
          <span>{lesson.title}</span>
        </div>
      </div>
      <h2 className="step-title">{step.title}</h2>
      <Dialogue lines={step.lines} onDone={() => setDone(true)} />
      <NextButton onClick={onNext} show={done} label="調べてみよう ▶" />
    </>
  );
}

// ---------- さわって発見 ----------

function ExploreView({ step, lessonId, onNext }: { step: ExploreStep; lessonId: string; onNext: () => void }) {
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const gainXp = useProgress((s) => s.gainXp);
  const [introDone, setIntroDone] = useState(step.lines.length === 0);
  const [checked, setChecked] = useState(!step.check);
  const [afterDone, setAfterDone] = useState(!step.after?.length);

  return (
    <>
      <h2 className="step-title">{step.title}</h2>
      <Dialogue lines={step.lines} onDone={() => setIntroDone(true)} />
      {introDone && (
        <div className="pop-in">
          <Figure spec={step.figure} />
          <ul className="prompts">
            {step.prompts.map((p, i) => (
              <li key={i}>
                <RichText text={p} inline />
              </li>
            ))}
          </ul>
          {step.check && (
            <div className="check-box">
              <div className="check-title">🔍 気づいたかな？</div>
              <QuestionView
                q={step.check}
                combo={0}
                onFinish={(ok) => {
                  recordAnswer(step.check!.id, lessonId, ok, true);
                  if (ok) gainXp(5);
                  setChecked(true);
                }}
              />
            </div>
          )}
          {checked && step.after && step.after.length > 0 && <Dialogue lines={step.after} onDone={() => setAfterDone(true)} />}
          <NextButton onClick={onNext} show={checked && afterDone} />
        </div>
      )}
    </>
  );
}

// ---------- ことばにする ----------

function ConceptView({ step, onNext }: { step: ConceptStep; onNext: () => void }) {
  const [done, setDone] = useState(!step.lines?.length);
  return (
    <>
      <h2 className="step-title">{step.title}</h2>
      <div className="tool-box">
        <div className="tool-label">この理術は…</div>
        <div className="tool-text">{step.tool}</div>
      </div>
      {step.formulas && (
        <div className="formula-box">
          {step.formulas.map((f, i) => (
            <Tex key={i} block>{f}</Tex>
          ))}
        </div>
      )}
      <div className="analogy">
        <div className="analogy-title">🍀 {step.analogy.title}</div>
        <RichText text={step.analogy.text} />
      </div>
      {step.figure && <Figure spec={step.figure} />}
      <ul className="points">
        {step.points.map((p, i) => (
          <li key={i}>
            <RichText text={p} inline />
          </li>
        ))}
      </ul>
      {step.lines && step.lines.length > 0 && <Dialogue lines={step.lines} onDone={() => setDone(true)} />}
      <NextButton onClick={onNext} show={done} />
    </>
  );
}

// ---------- どこで使われている？ ----------

function UsageView({ step, onNext }: { step: UsageStep; onNext: () => void }) {
  return (
    <>
      <h2 className="step-title">{step.title}</h2>
      {step.lines && <Dialogue lines={step.lines} auto />}
      <div className="usage-grid">
        {step.items.map((it, i) => (
          <article key={i} className="usage-card pop-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="usage-icon">{it.icon}</div>
            <h3>{it.title}</h3>
            <RichText text={it.text} />
            {it.formula && (
              <div className="usage-formula">
                <Tex>{it.formula}</Tex>
              </div>
            )}
          </article>
        ))}
      </div>
      <NextButton onClick={onNext} label="修行へ ▶" />
    </>
  );
}

// ---------- 練習 ----------

function PracticeView({ step, lessonId, onDone }: { step: PracticeStep; lessonId: string; onDone: (r: SessionResult) => void }) {
  const items = useMemo(
    () => step.questions.map((q) => ({ q: materialize(q), qid: itemId(q), lessonId })),
    [step, lessonId],
  );
  return (
    <>
      <h2 className="step-title">{step.title}</h2>
      <PracticeSession items={items} onDone={onDone} />
    </>
  );
}

// ---------- カード獲得 ----------

const CLEAR_XP = 30;
const FIRST_CLEAR_XP = 20;

function CardView({ step, lesson, result }: { step: CardStep; lesson: Lesson; result: SessionResult | null }) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const gainXp = useProgress((s) => s.gainXp);
  // 保存する前の状態を、最初の表示のときに読んでおく
  const [firstClear] = useState(() => !useProgress.getState().lessons[lesson.id]);
  const [newCard] = useState(() => !useProgress.getState().cards.includes(lesson.card.id));
  const savedRef = useRef(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const accuracy = result ? result.firstOk / Math.max(result.total, 1) : 1;
  const bonus = CLEAR_XP + (firstClear ? FIRST_CLEAR_XP : 0);

  useEffect(() => {
    if (!savedRef.current) {
      savedRef.current = true;
      completeLesson(lesson.id, accuracy, lesson.card.id);
      gainXp(bonus);
      play('clear');
    }
    const stars = starsFor(accuracy);
    const timers = [
      setTimeout(() => fx.confetti(), 150),
      // 星を 1 つずつ、音つきで
      ...[0, 1, 2].filter((i) => i < stars).map((i) => setTimeout(() => play('star', i), 500 + i * 250)),
      setTimeout(() => {
        setRevealed(true);
        play('reveal');
        if (lesson.card.rarity === 3) play('rare');
        else play('card');
      }, 1700),
      setTimeout(() => fx.burst(revealRef.current, { perfect: true, combo: lesson.card.rarity * 3 }), 2150),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stars = starsFor(accuracy);
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = allLessons[idx + 1];

  return (
    <div className="card-step">
      <div className="clear-banner pop-in">依頼達成！</div>
      <div className="result-stars">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`big-star ${i <= stars ? 'on' : ''}`} style={{ animationDelay: `${0.2 + i * 0.25}s` }}>
            ★
          </span>
        ))}
      </div>
      <div className="result-stats">
        <div>
          <span>一発正解</span>
          <strong>{result ? `${result.firstOk} / ${result.total}` : '-'}</strong>
        </div>
        <div>
          <span>最大コンボ</span>
          <strong>{result?.maxCombo ?? 0}</strong>
        </div>
        <div>
          <span>獲得 XP</span>
          <strong>
            +<CountUp to={(result?.xp ?? 0) + bonus} />
          </strong>
        </div>
      </div>
      {stars < 3 && <p className="retry-note">一発正解 9 割以上で星3つ。もう一度挑戦すると、記録が更新されるよ。</p>}

      <div className={`card-reveal ${revealed ? 'revealed' : ''}`} ref={revealRef}>
        <div className={`card-get ${revealed ? 'show' : ''}`}>{newCard ? '✨ 新しい理術カードを手に入れた！ ✨' : '理術カード（獲得ずみ）'}</div>
        <div className={`flip-card ${revealed ? 'flipped' : ''} rarity-${lesson.card.rarity}`}>
          <div className="flip-rays" />
          <div className="flip-inner">
            <div className="flip-face flip-back">
              <CardBack />
            </div>
            <div className="flip-face flip-front">{revealed && <TcgCard card={lesson.card} big />}</div>
          </div>
        </div>
      </div>

      {revealed && <Dialogue lines={step.lines} />}

      <div className="row-buttons">
        <button className="btn ghost" onClick={() => go('/')}>村へもどる</button>
        {nextLesson ? (
          <button className="btn primary" onClick={() => go(`/lesson/${nextLesson.id}`)}>次の依頼へ ▶</button>
        ) : (
          <button className="btn primary" onClick={() => go('/review')}>復習クエストへ ▶</button>
        )}
      </div>
    </div>
  );
}

/** 数字を 0 からカウントアップして見せる */
function CountUp({ to, ms = 900 }: { to: number; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const r = Math.min((t - t0) / ms, 1);
      setN(Math.round(to * (1 - (1 - r) ** 3)));
      if (r < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{n}</>;
}
