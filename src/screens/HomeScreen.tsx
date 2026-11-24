import { useState } from 'react';
import { go } from '../app/router';
import { futureRegions, recommendedLesson, units } from '../content/course';
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

  // はじめは「おすすめの依頼（物語順で最初の未クリア）」がある地方を開く
  const recommended = recommendedLesson(lessons);
  const [ui, setUi] = useState(() => {
    const i = recommended ? units.findIndex((u) => u.lessons.some((l) => l.id === recommended.id)) : -1;
    return i === -1 ? units.length - 1 : i;
  });
  const [mapOpen, setMapOpen] = useState(false);
  const unit = units[ui];
  const total = unit.lessons.length + unit.upcoming.length;
  const cleared = unit.lessons.filter((l) => lessons[l.id]).length;
  const nextLesson = unit.lessons.find((l) => !lessons[l.id]);
  const recUnit = recommended ? units.find((u) => u.lessons.some((l) => l.id === recommended.id)) : undefined;

  const tip = due > 0
    ? `${name}、復習の時間だよ！ ${due} 問が「そろそろ忘れそう」になってる。今やると一気に定着するよ。`
    : nextLesson
      ? `おすすめは「${nextLesson.quest}」。でも、どの依頼から挑戦してもOKだよ！ 上の「地方をえらぶ」から、好きな地方へも行けるよ。`
      : recUnit
        ? `${unit.region}に灯がもどったよ！ 物語の続きは「${recUnit.region}」。もちろん好きな地方を選んでもいいよ。`
        : futureRegions.length === 0
          ? `${unit.region}に灯がもどって、12 の灯がぜんぶそろったよ！ あとは星3つ集めと復習クエストで、共通テスト 9 割を目指そう！`
          : `${unit.region}に灯がもどったよ！ 次の地方は準備中。星3つ集めや復習クエストで、理術をみがいておこう！`;

  const subjects = [...new Set(units.map((u) => u.subject))];

  return (
    <div className="home">
      <button className="map-toggle" aria-expanded={mapOpen} onClick={() => setMapOpen(!mapOpen)}>
        <span>🗺️ 地方をえらぶ</span>
        <span className="map-current">{unit.region} {mapOpen ? '▲' : '▼'}</span>
      </button>
      {mapOpen && (
        <div className="region-map pop-in">
          {subjects.map((sub) => (
            <section key={sub}>
              <h4 className="map-subject">{sub}</h4>
              <div className="map-grid">
                {units.map((u, i) => {
                  if (u.subject !== sub) return null;
                  const n = u.lessons.filter((l) => lessons[l.id]).length;
                  const done = n === u.lessons.length;
                  return (
                    <button
                      key={u.id}
                      className={`map-card ${i === ui ? 'active' : ''} ${done ? 'done' : ''}`}
                      onClick={() => {
                        setUi(i);
                        setMapOpen(false);
                      }}
                    >
                      <strong>{done ? '🏮 ' : ''}{u.region}</strong>
                      <span>{u.title}</span>
                      <span className="map-progress">
                        <span style={{ width: `${(n / u.lessons.length) * 100}%` }} />
                      </span>
                      <span className="map-count">{n}/{u.lessons.length}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      <section className="region-card">
        <div className="region-head">
          <span className="subject-tag">{unit.subject}</span>
          <h2>{unit.region}</h2>
          <span className="region-sub">{unit.title}</span>
        </div>
        <Village lit={cleared} total={total} />
        <div className="restore">
          復興度
          <div className="restore-bar">
            <div style={{ width: `${(cleared / total) * 100}%` }} />
          </div>
          <span>{cleared}/{total}</span>
        </div>
      </section>

      <div
        className="zero-tip"
        onClick={() => {
          if (due > 0) go('/review');
          else if (!nextLesson && recUnit) setUi(units.indexOf(recUnit));
        }}
      >
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
          const isNext = nextLesson?.id === l.id;
          const isBoss = l.steps.some((st) => st.kind === 'boss');
          return (
            <li key={l.id}>
              <button
                className={`lesson-node ${rec ? 'done' : ''} ${isNext ? 'next' : ''} ${isBoss ? 'boss' : ''}`}
                onClick={() => go(`/lesson/${l.id}`)}
              >
                <span className="node-no">{rec ? '✓' : isBoss ? '👹' : l.no}</span>
                <span className="node-body">
                  <span className="node-quest">
                    {l.quest}
                    {isNext && <span className="rec-badge">おすすめ</span>}
                  </span>
                  <span className="node-title">{l.title}</span>
                  <span className="node-sub">{l.subtitle}</span>
                </span>
                {rec ? <Stars n={rec.stars} /> : <span className="node-go">{isNext ? 'GO!' : '▶'}</span>}
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

      {futureRegions.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}
