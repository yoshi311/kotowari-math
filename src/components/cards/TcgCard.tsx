import { useRef } from 'react';
import type { CardDef } from '../../content/types';
import { cardMeta } from '../../content/course';
import { Tex } from '../RichText';
import { CardArt } from './CardArt';
import { CardBack } from './CardBack';

const SHORT: Record<string, string> = { 数学Ⅰ: '数Ⅰ', 数学A: '数A', 数学Ⅱ: '数Ⅱ', 数学B: '数B', 数学C: '数C' };

/**
 * カードゲーム風の理術カード。
 * big：効果・必殺の式・使われる場所まで出す大きいカード（指やマウスでかたむく）
 */
export function TcgCard({ card, owned = true, big = false, onClick }: { card: CardDef; owned?: boolean; big?: boolean; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  if (!owned) return <CardBack small onClick={onClick} />;
  const meta = cardMeta(card.id);

  // かたむき・光の位置をポインターに合わせる
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !big) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - py) * 14}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 16}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '30%');
  };

  return (
    <div
      ref={ref}
      className={`tcg rarity-${card.rarity} ${big ? 'big' : 'small'} ${onClick ? 'clickable' : ''}`}
      style={{ '--card': card.color } as React.CSSProperties}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="tcg-frame">
        <div className="tcg-head">
          {meta && <span className="tcg-subject">{SHORT[meta.unit.subject]}</span>}
          <span className="tcg-name">{card.name}</span>
          <span className="tcg-stars" aria-label={`レア度 ${card.rarity}`}>
            {'★'.repeat(card.rarity)}
          </span>
        </div>
        <div className="tcg-art">
          <CardArt card={card} />
        </div>
        <div className="tcg-type">理術カード／{card.term}</div>
        {big && (
          <div className="tcg-text">
            <p>
              <b>効果</b>
              {card.tool}
            </p>
            <div className="tcg-formula">
              <span className="tcg-label">必殺の式</span>
              <Tex>{card.formula}</Tex>
            </div>
            <div className="tcg-uses">
              <span className="tcg-label">使われる場所</span>
              <ul>
                {card.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {meta && (
          <div className="tcg-foot">
            <span>No.{String(meta.no).padStart(3, '0')} / {meta.total}</span>
            <span>{meta.unit.region}</span>
          </div>
        )}
      </div>
      {card.rarity === 3 && <div className="tcg-holo" />}
      <div className="tcg-shine" />
    </div>
  );
}
