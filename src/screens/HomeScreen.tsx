import { go } from '../app/router';
import { futureRegions, isUnlocked, units } from '../content/course';
import { DAILY_GOAL, today, useProgress } from '../engine/progress';
import { dueIds } from '../engine/srs';
import { Village } from '../components/story/Scenes';
import { CharacterSvg } from '../components/story/CharacterSvg';

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`星${n}つ`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  );
}

export function HomeScreen() {
  const lessons = useProgress((s) => s.lessons);
  const srs = useProgress((s) => s.srs);
  const daily = useProgress((s) => s.daily);
  const name = useProgress((s) => s.playerName);
  const due = dueIds(srs).length;
  const todayXp = daily.date === today() ? daily.xp : 0;

  const unit = units[0];
  const total = unit.lessons.length + unit.upcoming.length;
  const cleared = unit.lessons.filter((l) => lessons[l.id]).length;
  const nextLesson = unit.lessons.find((l) => !lessons[l.id]);

  const tip = due > 0
    ? `${name}、復習の時間だよ！ ${due} 問が「そろそろ忘れそう」になってる。今やると一気に定着するよ。`
    : nextLesson
      ? `次の依頼は「${nextLesson.quest}」だよ。行ってみよう！`
      : '今ある依頼はぜんぶクリア！ 星3つを目指して、もう一度挑戦するのもアリだね。';

  return (
    <div className="home">
      <section className="region-card">
        <div className="region-head">
          <span className="subject-tag">{unit.subject}</span>
          <h2>{unit.region}</h2>
          <span className="region-sub">{unit.title}</span>
        </div>
        <Village lit={cleared} total={total} />
        <div className="restore">
          村の復興度
          <div className="restore-bar">
            <div style={{ width: `${(cleared / total) * 100}%` }} />
          </div>
          <span>{cleared}/{total}</span>
        </div>
      </section>

      <div className="zero-tip" onClick={() => due > 0 && go('/review')}>
        <CharacterSvg who="zero" mood={due > 0 ? 'surprised' : 'happy'} size={52} />
        <div className="bubble small">{tip}</div>
      </div>

      <div className="quick-row">
        <button className="quick" onClick={() => go('/review')}>
          <span className="quick-icon">🔁</span>
          <span>復習クエスト</span>
          <strong>{due > 0 ? `${due} 問` : 'なし'}</strong>
        </button>
        <div className="quick">
          <span className="quick-icon">🎯</span>
          <span>今日の目標</span>
          <strong>{Math.min(todayXp, DAILY_GOAL)}/{DAILY_GOAL} XP</strong>
        </div>
      </div>

      <h3 className="section-title">依頼リスト</h3>
      <ol className="lesson-path">
        {unit.lessons.map((l) => {
          const rec = lessons[l.id];
          const open = isUnlocked(l.id, lessons);
          const isNext = nextLesson?.id === l.id;
          return (
            <li key={l.id}>
              <button
                className={`lesson-node ${rec ? 'done' : ''} ${isNext ? 'next' : ''}`}
                disabled={!open}
                onClick={() => go(`/lesson/${l.id}`)}
              >
                <span className="node-no">{rec ? '✓' : l.no}</span>
                <span className="node-body">
                  <span className="node-quest">{l.quest}</span>
                  <span className="node-title">{l.title}</span>
                  <span className="node-sub">{l.subtitle}</span>
                </span>
                {rec ? <Stars n={rec.stars} /> : open ? <span className="node-go">{isNext ? 'GO!' : '▶'}</span> : <span>🔒</span>}
              </button>
            </li>
          );
        })}
        {unit.upcoming.map((u) => (
          <li key={u.no}>
            <div className="lesson-node soon">
              <span className="node-no">{u.no}</span>
              <span className="node-body">
                <span className="node-title">{u.title}</span>
                <span className="node-sub">近日公開</span>
              </span>
              <span>🔒</span>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="section-title">この先の地方</h3>
      <div className="future-grid">
        {futureRegions.map((r) => (
          <div key={r.region} className="future-card">
            <span className="subject-tag small">{r.subject}</span>
            <strong>{r.region}</strong>
            <span>{r.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
