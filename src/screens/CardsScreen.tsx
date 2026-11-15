import { useState } from 'react';
import { allCards, units } from '../content/course';
import type { CardDef } from '../content/types';
import { useProgress } from '../engine/progress';
import { Tex } from '../components/RichText';

export function RiCard({ card, owned, big = false, onClick }: { card: CardDef; owned: boolean; big?: boolean; onClick?: () => void }) {
  if (!owned) {
    return (
      <div className="ri-card locked" onClick={onClick}>
        <div className="ri-card-inner">
          <div className="ri-q">？</div>
          <div className="ri-name">？？？</div>
        </div>
      </div>
    );
  }
  return (
    <div className={`ri-card ${big ? 'big' : ''} rarity-${card.rarity}`} style={{ '--card': card.color } as React.CSSProperties} onClick={onClick}>
      <div className="ri-card-inner">
        <div className="ri-rarity">{'★'.repeat(card.rarity)}</div>
        <div className="ri-name">{card.name}</div>
        <div className="ri-term">{card.term}</div>
        <div className="ri-formula">
          <Tex>{card.formula}</Tex>
        </div>
        {big && (
          <>
            <div className="ri-section">なにを求める道具？</div>
            <div className="ri-tool">{card.tool}</div>
            <div className="ri-section">どこで使われている？</div>
            <ul className="ri-uses">
              {card.uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

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
              <RiCard key={l.card.id} card={l.card} owned={owned.includes(l.card.id)} onClick={() => owned.includes(l.card.id) && setOpen(l.card)} />
            ))}
            {u.upcoming.map((x) => (
              <div key={x.no} className="ri-card locked soon">
                <div className="ri-card-inner">
                  <div className="ri-q">？</div>
                  <div className="ri-name">近日公開</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {open && (
        <div className="modal" onClick={() => setOpen(null)}>
          <div className="modal-body pop-in" onClick={(e) => e.stopPropagation()}>
            <RiCard card={open} owned big />
            <button className="btn wide" onClick={() => setOpen(null)}>とじる</button>
          </div>
        </div>
      )}
      {allCards.length === 0 && <p>まだカードがありません。</p>}
    </div>
  );
}
