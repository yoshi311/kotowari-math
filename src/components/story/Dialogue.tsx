import { useEffect, useState } from 'react';
import type { Line } from '../../content/types';
import { play } from '../../engine/sound';
import { RichText } from '../RichText';
import { CHAR_INFO, CharacterSvg } from './CharacterSvg';

/** 1 行ずつ「タップで進む」会話。全部読み終えたら onDone */
export function Dialogue({ lines, onDone, auto = false }: { lines: Line[]; onDone?: () => void; auto?: boolean }) {
  const [shown, setShown] = useState(auto ? lines.length : 1);
  const finished = shown >= lines.length;

  useEffect(() => {
    if (finished) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const next = () => {
    if (!finished) {
      play('tap');
      setShown((n) => n + 1);
    }
  };

  return (
    <div className="dialogue" onClick={next}>
      {lines.slice(0, shown).map((l, i) => (
        <Bubble key={i} line={l} latest={i === shown - 1} />
      ))}
      {!finished && (
        <button className="tap-next" onClick={(e) => (e.stopPropagation(), next())}>
          ▼ タップしてつづき
        </button>
      )}
    </div>
  );
}

export function Bubble({ line, latest = false }: { line: Line; latest?: boolean }) {
  const info = CHAR_INFO[line.who];
  if (line.who === 'narrator') {
    return (
      <div className={`narration ${latest ? 'pop-in' : ''}`}>
        <RichText text={line.text} />
      </div>
    );
  }
  const right = line.who === 'kai';
  return (
    <div className={`bubble-row ${right ? 'right' : ''} ${latest ? 'pop-in' : ''}`}>
      <div className="avatar">
        <CharacterSvg who={line.who} mood={line.mood} size={56} />
      </div>
      <div className="bubble" style={{ borderColor: info.color }}>
        <div className="speaker" style={{ color: info.color }}>
          {line.npcName ?? info.name}
        </div>
        <RichText text={line.text} />
      </div>
    </div>
  );
}
