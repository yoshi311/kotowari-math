import { DAILY_GOAL, levelInfo, today, useProgress } from '../engine/progress';
import { dueIds } from '../engine/srs';
import { go, type Route } from './router';

export function TopBar() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const daily = useProgress((s) => s.daily);
  const sound = useProgress((s) => s.sound);
  const toggleSound = useProgress((s) => s.toggleSound);
  const lv = levelInfo(xp);
  const todayXp = daily.date === today() ? daily.xp : 0;
  const goalRatio = Math.min(todayXp / DAILY_GOAL, 1);
  const streakAlive = streak.last === today();

  return (
    <header className="topbar">
      <div className="lv-badge" title={`レベル ${lv.level}`}>
        <span className="lv-label">Lv</span>
        <span className="lv-num">{lv.level}</span>
      </div>
      <div className="xp-wrap" title={`次のレベルまで ${lv.need - lv.into} XP`}>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${lv.ratio * 100}%` }} />
        </div>
        <div className="xp-text">
          {lv.into} / {lv.need} XP
        </div>
      </div>
      <div className={`streak ${streakAlive ? 'alive' : ''}`} title="連続学習日数">
        🔥<span>{streak.count}</span>
      </div>
      <div className="goal-ring" title={`今日の目標 ${todayXp}/${DAILY_GOAL} XP`}>
        <svg viewBox="0 0 36 36" width="34" height="34">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={goalRatio >= 1 ? 'var(--good)' : 'var(--accent)'}
            strokeWidth="4"
            strokeDasharray={`${goalRatio * 94.2} 94.2`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="19" textAnchor="middle" dominantBaseline="middle" fontSize="11">
            {goalRatio >= 1 ? '✓' : '🎯'}
          </text>
        </svg>
      </div>
      <button className="icon-btn" onClick={toggleSound} aria-label={sound ? '音を消す' : '音を出す'}>
        {sound ? '🔊' : '🔇'}
      </button>
    </header>
  );
}

export function BottomNav({ current }: { current: Route['name'] }) {
  const srs = useProgress((s) => s.srs);
  const due = dueIds(srs).length;
  const items: { name: Route['name']; path: string; icon: string; label: string; badge?: number }[] = [
    { name: 'home', path: '/', icon: '🗺️', label: '冒険' },
    { name: 'review', path: '/review', icon: '🔁', label: '復習', badge: due },
    { name: 'cards', path: '/cards', icon: '🃏', label: '図鑑' },
    { name: 'stats', path: '/stats', icon: '📈', label: '記録' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button key={it.name} className={`nav-item ${current === it.name ? 'active' : ''}`} onClick={() => go(it.path)}>
          <span className="nav-icon">
            {it.icon}
            {!!it.badge && <span className="badge">{it.badge}</span>}
          </span>
          <span className="nav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
