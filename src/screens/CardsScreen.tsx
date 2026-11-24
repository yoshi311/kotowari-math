import { useState } from 'react';
import { allCards, units } from '../content/course';
import type { CardDef } from '../content/types';
import { useProgress } from '../engine/progress';
import { TcgCard } from '../components/cards/TcgCard';
import { CardBack } from '../components/cards/CardBack';

export function CardsScreen() {
  const owned = useProgress((s) => s.cards);
  const [open, setOpen] = useState<CardDef | null>(null);
  const totalPlanned = units.reduce((n, u) => n + u.lessons.length + u.upcoming.length, 0);

  return (
    <div className="cards-screen">
      <h2 className="page-title">理術カード図鑑</h2>
      <p className="page-sub">
        集めたカード {owned.length} / {totalPlanned}（この地方）。カードをタップすると「何の道具か」「どこで使うか」が見られるよ。
      </p>
      {units.map((u) => (
        <section key={u.id}>
          <h3 className="section-title">{u.region}｜{u.title}</h3>
          <div className="card-grid">
            {u.lessons.map((l) => (
              <TcgCard key={l.card.id} card={l.card} owned={owned.includes(l.card.id)} onClick={owned.includes(l.card.id) ? () => setOpen(l.card) : undefined} />
            ))}
            {u.upcoming.map((x) => (
              <CardBack key={x.no} small />
            ))}
          </div>
        </section>
      ))}
      {open && (
        <div className="modal" onClick={() => setOpen(null)}>
          <div className="modal-body pop-in" onClick={(e) => e.stopPropagation()}>
            <TcgCard card={open} big />
            <button className="btn wide" onClick={() => setOpen(null)}>とじる</button>
          </div>
        </div>
      )}
      {allCards.length === 0 && <p>まだカードがありません。</p>}
    </div>
  );
}
