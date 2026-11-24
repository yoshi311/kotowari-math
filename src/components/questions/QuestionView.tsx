import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChoiceQuestion, InputQuestion, MarkQuestion, Question } from '../../content/types';
import { checkInput, checkMark, markLabels } from '../../engine/answerCheck';
import { play } from '../../engine/sound';
import { fx } from '../../engine/fx';
import { Figure } from '../figures/Figure';
import { RichText } from '../RichText';
import { Bubble } from '../story/Dialogue';

const LEVEL_LABEL = { meaning: '意味をつかむ', calc: '計算の技', exam: '共通テスト風' } as const;

type Phase = 'answering' | 'retry' | 'correct' | 'reveal';

/**
 * 1 問ぶんの画面。
 * 1 回目に間違えたら「カイの失敗例＋ヒント」を見せてもう一度。2 回目も違えば解説を見せる。
 * onFinish(firstTryOk) で次の問題へ。
 */
export function QuestionView({ q, combo, onFinish }: { q: Question; combo: number; onFinish: (firstTryOk: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>('answering');
  const [notice, setNotice] = useState('');
  const answerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstTry = useRef(true);

  /** 問題のカードを光らせる（クラスを付けなおしてアニメーションをやり直す） */
  const glow = (cls: 'glow-ok' | 'glow-ng') => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.remove('glow-ok', 'glow-ng');
    void el.offsetWidth;
    el.classList.add(cls);
  };

  // 作り直さずに揺らす（作り直すと、選んだ選択肢や入力した式が消えてしまう）
  const shake = () =>
    answerRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 400 },
    );

  const judge = (ok: boolean) => {
    if (ok) {
      const perfect = firstTry.current;
      const c = perfect ? combo + 1 : 0;
      play('ok', c);
      if (perfect) play('perfect', c);
      glow('glow-ok');
      fx.burst(answerRef.current, { perfect, combo: c });
      // 3・5 コンボと、その先は 5 コンボごとに大きな演出
      if (c === 3 || (c >= 5 && c % 5 === 0)) {
        setTimeout(() => {
          fx.banner(`🔥 ${c} コンボ！`, c >= 10 ? 3 : c >= 5 ? 2 : 1);
          fx.flash('rgba(255, 209, 102, 0.25)');
          play('combo', c);
        }, 180);
      }
      setPhase('correct');
    } else {
      play('ng');
      glow('glow-ng');
      shake();
      if (firstTry.current) {
        firstTry.current = false;
        setPhase('retry');
      } else {
        setPhase('reveal');
      }
    }
  };

  const done = phase === 'correct' || phase === 'reveal';

  return (
    <div className="question" ref={rootRef}>
      <div className={`q-level lv-${q.level}`}>{LEVEL_LABEL[q.level]}</div>
      <div className="q-prompt">
        {q.type !== 'mark' && <RichText text={q.prompt} />}
      </div>
      {q.figure && <Figure spec={q.figure} />}

      <div ref={answerRef}>
        {q.type === 'choice' && <ChoiceInput q={q} done={done} onJudge={judge} />}
        {q.type === 'input' && <ExprInput q={q} done={done} onJudge={judge} setNotice={setNotice} />}
        {q.type === 'mark' && <MarkInput q={q} done={done} onJudge={judge} setNotice={setNotice} />}
      </div>

      {notice && !done && <div className="notice">{notice}</div>}

      {phase === 'retry' && (
        <div className="feedback retry pop-in">
          {q.kaiMistake && <Bubble line={{ who: 'kai', mood: 'surprised', text: q.kaiMistake }} />}
          <Bubble
            line={{ who: 'zero', mood: 'think', text: q.hint ? `ヒントだよ！ ${q.hint}` : 'おしい！ もう一度考えてみよう。' }}
          />
        </div>
      )}

      {done && (
        <div className={`feedback ${phase} pop-in`}>
          <div className="fb-title">
            {phase === 'correct' ? (firstTry.current ? (combo + 1 >= 3 ? `正解！ ${combo + 1} コンボ！` : '正解！') : '正解！ 次は一発でいこう') : '答えを確認しよう'}
          </div>
          {phase === 'reveal' && q.kaiMistake && <Bubble line={{ who: 'kai', mood: 'sad', text: q.kaiMistake }} />}
          <div className="fb-explain">
            <RichText text={q.explain} />
          </div>
          <button className="btn primary wide" onClick={() => onFinish(firstTry.current && phase === 'correct')} autoFocus>
            つぎへ ▶
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- 選択式 ----------

function ChoiceInput({ q, done, onJudge }: { q: ChoiceQuestion; done: boolean; onJudge: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  return (
    <div className="choices">
      {q.choices.map((c, i) => {
        const wrong = picked.includes(i) && i !== q.answer;
        const right = done && i === q.answer;
        return (
          <button
            key={i}
            className={`choice ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
            disabled={done || wrong}
            onClick={() => {
              setPicked((p) => [...p, i]);
              onJudge(i === q.answer);
            }}
          >
            <span className="choice-no">{String.fromCharCode(9312 + i)}</span>
            <span className="choice-text">
              <RichText text={c} inline />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- 式・数の入力 ----------

const EXPR_KEYS = ['x', 'a', 'b', '²', '³', '^', '(', ')', '+', '−'];

function ExprInput({
  q,
  done,
  onJudge,
  setNotice,
}: {
  q: InputQuestion;
  done: boolean;
  onJudge: (ok: boolean) => void;
  setNotice: (s: string) => void;
}) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const keys = useMemo(() => (q.mode === 'number' ? ['−', '/', '.'] : EXPR_KEYS), [q.mode]);

  useEffect(() => {
    if (!done) ref.current?.focus({ preventScroll: true });
  }, [done]);

  const insert = (k: string) => {
    const el = ref.current;
    const s = el?.selectionStart ?? val.length;
    const e = el?.selectionEnd ?? val.length;
    const next = val.slice(0, s) + k + val.slice(e);
    setVal(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(s + k.length, s + k.length);
    });
  };

  const submit = () => {
    if (done) return;
    const r = checkInput(q, val);
    if (r.ok) {
      setNotice('');
      onJudge(true);
    } else if (r.reason === 'wrong') {
      setNotice('');
      onJudge(false);
    } else {
      setNotice(r.message);
    }
  };

  return (
    <div className="expr-input">
      <form
        className="expr-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {q.before && <span className="affix">{q.before}</span>}
        <input
          ref={ref}
          value={val}
          disabled={done}
          onChange={(e) => setVal(e.target.value)}
          inputMode={q.mode === 'number' ? 'decimal' : 'text'}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={q.mode === 'number' ? '数を入力' : '例： x^2+5x+6'}
          aria-label="答え"
        />
        {q.after && <span className="affix">{q.after}</span>}
        <button className="btn primary" type="submit" disabled={done}>
          こたえる
        </button>
      </form>
      {!done && (
        <div className="keypad">
          {keys.map((k) => (
            <button key={k} type="button" className="key" onClick={() => insert(k)}>
              {k}
            </button>
          ))}
          <button type="button" className="key" onClick={() => setVal((v) => v.slice(0, -1))}>
            ⌫
          </button>
        </div>
      )}
      {q.mode === 'expr' && !done && <div className="input-tip">2乗は「²」ボタンか「^2」。かけ算の記号は省略してOK（2x）。</div>}
    </div>
  );
}

// ---------- 共通テスト風マーク式 ----------

function MarkInput({
  q,
  done,
  onJudge,
  setNotice,
}: {
  q: MarkQuestion;
  done: boolean;
  onJudge: (ok: boolean) => void;
  setNotice: (s: string) => void;
}) {
  const labels = useMemo(() => markLabels(q.prompt), [q.prompt]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);

  const put = (ch: string) => {
    if (done) return;
    const label = labels[active];
    setVals((v) => ({ ...v, [label]: ch }));
    setActive((a) => Math.min(a + 1, labels.length - 1));
  };
  const back = () => {
    if (done) return;
    const label = labels[active];
    if (vals[label]) setVals((v) => ({ ...v, [label]: '' }));
    else setActive((a) => Math.max(a - 1, 0));
  };
  const submit = () => {
    if (done) return;
    if (labels.some((l) => !vals[l])) {
      setNotice('すべての欄をうめてね');
      return;
    }
    setNotice('');
    const ok = checkMark(q, vals);
    if (!ok) {
      // まちがえた欄だけ消して、もう一度
      setVals((v) => {
        const nv = { ...v };
        for (const l of labels) if (q.answers[l] !== v[l]) nv[l] = '';
        return nv;
      });
      setActive(Math.max(0, labels.findIndex((l) => q.answers[l] !== vals[l])));
    }
    onJudge(ok);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (/^[0-9]$/.test(e.key)) put(e.key);
      else if (e.key === '-') put('-');
      else if (e.key === 'Backspace') back();
      else if (e.key === 'Enter') submit();
      else if (e.key === 'ArrowLeft') setActive((a) => Math.max(a - 1, 0));
      else if (e.key === 'ArrowRight') setActive((a) => Math.min(a + 1, labels.length - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="mark-input">
      <div className="q-prompt mark-prompt">
        <RichText
          text={q.prompt}
          mark={(label) => {
            const idx = labels.indexOf(label);
            const v = done ? q.answers[label] : vals[label];
            return (
              <button
                type="button"
                className={`mark-box ${idx === active && !done ? 'active' : ''} ${v ? 'filled' : ''}`}
                onClick={() => setActive(idx)}
                disabled={done}
              >
                <span className="mark-label">{label}</span>
                <span className="mark-val">{v === '-' ? '−' : v}</span>
              </button>
            );
          }}
        />
      </div>
      {!done && (
        <>
          <div className="keypad mark-keys">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'].map((k) => (
              <button key={k} type="button" className="key" onClick={() => put(k)}>
                {k === '-' ? '−' : k}
              </button>
            ))}
            <button type="button" className="key" onClick={back}>
              ⌫
            </button>
          </div>
          <button className="btn primary wide" onClick={submit}>
            こたえる
          </button>
          <div className="input-tip">共通テストと同じく、1つの欄に数字1文字（または −）が入るよ。</div>
        </>
      )}
    </div>
  );
}
