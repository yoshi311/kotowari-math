/** カードの裏面（まだ持っていないカード・めくる前のカード） */
export function CardBack({ small = false, onClick }: { small?: boolean; onClick?: () => void }) {
  return (
    <div className={`tcg-back ${small ? 'small' : 'big'}`} onClick={onClick} aria-label="まだ手に入れていないカード">
      <svg viewBox="0 0 100 140" className="tcg-back-svg">
        <defs>
          <pattern id="back-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0 L0 0 0 10" fill="none" stroke="rgba(255,209,102,0.18)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100" height="140" fill="url(#back-grid)" />
        <rect x="6" y="6" width="88" height="128" rx="6" fill="none" stroke="#ffd166" strokeWidth="1.2" opacity="0.8" />
        {/* 円とコンパスの紋章 */}
        <circle cx="50" cy="62" r="28" fill="none" stroke="#ffd166" strokeWidth="1.5" />
        <circle cx="50" cy="62" r="20" fill="none" stroke="#c77dff" strokeWidth="1" opacity="0.8" />
        <polygon points="50,34 74,76 26,76" fill="none" stroke="#ffd166" strokeWidth="1.2" />
        <path d="M30 62 Q40 40 50 62 T70 62" fill="none" stroke="#06d6a0" strokeWidth="1.4" />
        <circle cx="50" cy="62" r="3" fill="#ffd166" />
        <text x="50" y="106" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffd166" letterSpacing="2">
          理術
        </text>
        <text x="50" y="120" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)" letterSpacing="1">
          KOTOWARI
        </text>
      </svg>
      {small && <span className="tcg-back-q">？</span>}
    </div>
  );
}
