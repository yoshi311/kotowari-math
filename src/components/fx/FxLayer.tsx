import { useEffect, useState } from 'react';
import { subscribe, type FxItem } from '../../engine/fx';

/** 演出を描く層（画面いちばん上に重ね、タップは下へ通す） */
export function FxLayer() {
  const [items, setItems] = useState<FxItem[]>([]);
  useEffect(() => subscribe(setItems), []);
  return (
    <div className="fx-layer" aria-hidden="true">
      {items.map((it) => {
        if (it.kind === 'particle') {
          return (
            <span
              key={it.id}
              className={`fx-p fx-${it.shape}`}
              style={
                {
                  left: it.x,
                  top: it.y,
                  width: it.size,
                  height: it.shape === 'rect' ? it.size * 0.55 : it.size,
                  background: it.shape === 'star' ? undefined : it.color,
                  color: it.color,
                  '--dx': `${it.dx}px`,
                  '--dy': `${it.dy}px`,
                  '--rot': `${it.rot}deg`,
                  animationDuration: `${it.dur}ms`,
                  animationDelay: `${it.delay}ms`,
                } as React.CSSProperties
              }
            >
              {it.shape === 'star' ? '★' : null}
            </span>
          );
        }
        if (it.kind === 'text') {
          return (
            <span key={it.id} className={`fx-text ${it.big ? 'big' : ''}`} style={{ left: it.x, top: it.y, color: it.color }}>
              {it.text}
            </span>
          );
        }
        if (it.kind === 'banner') {
          return (
            <div key={it.id} className={`fx-banner tier-${Math.min(it.tier, 3)}`}>
              <span>{it.text}</span>
            </div>
          );
        }
        return <div key={it.id} className="fx-flash" style={{ background: it.color }} />;
      })}
    </div>
  );
}
