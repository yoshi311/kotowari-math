import { go } from '../app/router';
import { allLessons } from '../content/course';
import { levelInfo, rankName, RANKS, useProgress } from '../engine/progress';
import { mastery } from '../engine/srs';
import { CharacterSvg } from '../components/story/CharacterSvg';

export function StatsScreen() {
  const s = useProgress();
  const lv = levelInfo(s.xp);
  const rank = rankName(lv.level);
  const nextRank = RANKS.find((r) => r.min > lv.level);

  const rows = allLessons.map((l) => {
    const st = s.lessonStats[l.id];
    const acc = st && st.tries > 0 ? st.firstOk / st.tries : null;
    const items = Object.values(s.srs).filter((it) => it.lessonId === l.id);
    return { lesson: l, acc, tries: st?.tries ?? 0, mastery: mastery(items), rec: s.lessons[l.id] };
  });
  const weak = rows.filter((r) => r.acc !== null && r.tries >= 3).sort((a, b) => a.acc! - b.acc!)[0];
  const totalTries = rows.reduce((n, r) => n + r.tries, 0);
  const totalOk = Object.values(s.lessonStats).reduce((n, st) => n + st.firstOk, 0);

  return (
    <div className="stats">
      <h2 className="page-title">冒険の記録</h2>
      <section className="profile">
        <CharacterSvg who="zero" mood="happy" size={64} />
        <div>
          <div className="profile-name">{s.playerName || 'きみ'}</div>
          <div className="profile-rank">{rank}</div>
          {nextRank && <div className="profile-next">Lv {nextRank.min} で「{nextRank.name}」</div>}
        </div>
      </section>

      <div className="stat-grid">
        <div className="stat"><span>レベル</span><strong>{lv.level}</strong></div>
        <div className="stat"><span>累計 XP</span><strong>{s.xp}</strong></div>
        <div className="stat"><span>連続学習</span><strong>{s.streak.count} 日</strong></div>
        <div className="stat"><span>最高コンボ</span><strong>{s.bestCombo}</strong></div>
        <div className="stat"><span>理術カード</span><strong>{s.cards.length}</strong></div>
        <div className="stat"><span>一発正解率</span><strong>{totalTries ? Math.round((totalOk / totalTries) * 100) : 0}%</strong></div>
      </div>

      {weak && weak.acc! < 0.8 && (
        <div className="weak-box">
          <strong>🔎 苦手かも：</strong>「{weak.lesson.title}」の一発正解率は {Math.round(weak.acc! * 100)}%。
          <button className="btn small" onClick={() => go(`/lesson/${weak.lesson.id}`)}>もう一度挑戦</button>
        </div>
      )}

      <h3 className="section-title">依頼ごとの成績</h3>
      <table className="stat-table">
        <thead>
          <tr>
            <th>依頼</th>
            <th>一発正解率</th>
            <th>定着度</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.lesson.id}>
              <td>
                {r.lesson.no}. {r.lesson.title}
                {r.rec && <span className="mini-stars"> {'★'.repeat(r.rec.stars)}</span>}
              </td>
              <td>
                <Bar v={r.acc} />
              </td>
              <td>
                <Bar v={r.tries ? r.mastery : null} color="var(--good)" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="page-sub">定着度は、復習で正解を重ねるほど上がるよ。共通テスト9割には、全依頼の定着度を高めることが近道！</p>

      <details className="danger-zone">
        <summary>設定</summary>
        <button
          className="btn danger small"
          onClick={() => {
            if (confirm('すべての記録を消して、最初からやり直しますか？（元にもどせません）')) {
              s.resetAll();
              go('/');
            }
          }}
        >
          記録をリセット
        </button>
      </details>
    </div>
  );
}

function Bar({ v, color = 'var(--accent)' }: { v: number | null; color?: string }) {
  if (v === null) return <span className="muted">—</span>;
  return (
    <div className="mini-bar" title={`${Math.round(v * 100)}%`}>
      <div style={{ width: `${v * 100}%`, background: color }} />
      <span>{Math.round(v * 100)}%</span>
    </div>
  );
}
