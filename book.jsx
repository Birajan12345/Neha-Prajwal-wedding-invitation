/* ============================================================
   Neha & Prajwal — Wedding Invitation (BOOK FORMAT)
   Cover + turnable pages. Big nav buttons, page dots, swipe.
   ============================================================ */

const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } = React;

/* =============================================================
   IMAGES — to change a photo, just replace the file in /assets
   (keep the same filename) and it updates everywhere:
     • assets/couple.jpg → "The Couple" page (2nd page)
   ============================================================= */

/* ---------- SVG decorations (shared with original card) ---------- */

const BookFloralCorner = ({ color = '#c9a96e' }) => (
  <svg className="corner-floral" viewBox="0 0 64 64">
    <path d="M2 62 C 8 50, 18 38, 28 30 C 38 22, 48 14, 60 4"
          stroke={color} strokeWidth="0.9" fill="none" opacity="0.85"/>
    <path d="M14 44 C 8 42, 6 36, 10 30 C 16 34, 18 40, 14 44 Z" fill={color} opacity="0.4"/>
    <path d="M28 30 C 22 28, 20 22, 24 16 C 30 20, 32 26, 28 30 Z" fill={color} opacity="0.35"/>
    <path d="M44 16 C 38 14, 36 8, 40 2 C 46 6, 48 12, 44 16 Z" fill={color} opacity="0.45"/>
    <g transform="translate(20,52)">
      <circle r="3.2" fill="#c97d8e" opacity="0.7"/>
      <circle r="1.8" fill="#a85267" opacity="0.85"/>
      <circle r="0.8" fill="#fdf6f0" opacity="0.9"/>
    </g>
    <g transform="translate(36,36)">
      <circle r="2.6" fill="#e8b4b8" opacity="0.7"/>
      <circle r="1.4" fill="#c97d8e" opacity="0.85"/>
    </g>
    <g transform="translate(52,18)">
      <circle r="3.5" fill="#c97d8e" opacity="0.7"/>
      <circle r="2" fill="#a85267" opacity="0.85"/>
      <circle r="0.9" fill="#fdf6f0" opacity="0.9"/>
    </g>
    <ellipse cx="8" cy="56" rx="3" ry="1.4" fill={color} opacity="0.4" transform="rotate(-30 8 56)"/>
    <ellipse cx="56" cy="10" rx="3" ry="1.4" fill={color} opacity="0.4" transform="rotate(-30 56 10)"/>
  </svg>
);

const BookTorana = () => (
  <svg className="torana" viewBox="0 0 320 36" preserveAspectRatio="none">
    <path d="M 4 34 Q 4 4 24 4 Q 40 4 44 16 Q 56 4 72 4 Q 88 4 92 16 Q 104 4 120 4 Q 136 4 140 16 Q 152 4 168 4 Q 184 4 188 16 Q 200 4 216 4 Q 232 4 236 16 Q 248 4 264 4 Q 280 4 284 16 Q 296 4 316 4 Q 316 34 316 34"
          stroke="#c9a96e" strokeWidth="1.1" fill="none" opacity="0.85"/>
    {Array.from({length: 12}).map((_, i) => (
      <circle key={i} cx={20 + i * 26} cy="22" r="1.2" fill="#c9a96e" opacity="0.7"/>
    ))}
    <g transform="translate(160 6)">
      <path d="M 0 0 L -4 6 L 0 12 L 4 6 Z" fill="#c9a96e" opacity="0.85"/>
      <circle r="1.5" fill="#a85267"/>
    </g>
  </svg>
);

const BookOrnament = () => (
  <div className="ornament" aria-hidden="true">
    <span className="ornament-line"></span>
    <span className="ornament-diamond"></span>
    <span className="ornament-line"></span>
  </div>
);

/* ---------- Countdown hook ---------- */

const useBookCountdown = (target) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

/* ---------- Page contents ---------- */

const CoverPage = ({ onOpen }) => (
  <>
    <div className="cover-frame"></div>
    <div className="cover-eyebrow">THE WEDDING OF</div>
    <div className="cover-names">
      Neha<span className="cover-amp">&amp;</span>Prajwal
    </div>
    <div className="cover-rule"></div>
    <div className="cover-date">27 · JUNE · 2026</div>
    <button
      className="wax-seal cover-seal"
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      aria-label="Open the invitation book"
    >
      N<span style={{fontSize:'17px', margin:'0 2px'}}>♥</span>P
    </button>
    <div className="cover-open-label">TAP THE SEAL TO OPEN</div>
  </>
);

const InvitePage = () => (
  <>
    <BookTorana />
    <div className="eyebrow" style={{marginTop: '30px'}}>TOGETHER WITH OUR FAMILIES</div>
    <p className="body-text">
      with hearts full of joy &amp; gratitude,<br/>
      we joyfully invite you to celebrate<br/>
      the wedding of
    </p>
    <div className="names-big" style={{margin: '16px 0 10px'}}>
      <span className="first">Neha</span>
      <span className="amp">&amp;</span>
      <span className="second">Prajwal</span>
    </div>
    <BookOrnament />
  </>
);

const CouplePage = () => (
  <>
    <div className="eyebrow">THE BELOVED COUPLE</div>
    <div className="script-heading">Two Souls, One Journey</div>
    <div className="portrait-frame">
      <div className="portrait-arch">
        <img
          src={(window.__resources && window.__resources.coupleImg) || "assets/couple.jpg"}
          alt="Neha and Prajwal"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
    <p className="body-text" style={{fontSize:'16px'}}>
      &ldquo;In all the world, there is no heart for me like yours.<br/>
      In all the world, there is no love for you like mine.&rdquo;
    </p>
  </>
);

const CountdownPage = () => {
  const target = useMemo(() => new Date('2026-06-27T12:00:00').getTime(), []);
  const { days, hours, minutes, seconds } = useBookCountdown(target);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <>
      <div className="eyebrow">COUNTING THE DAYS</div>
      <div className="script-heading">Until We Say I Do</div>
      <div className="countdown-grid">
        <div className="cd-cell"><div className="cd-num">{pad(days)}</div><div className="cd-label">DAYS</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(hours)}</div><div className="cd-label">HOURS</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(minutes)}</div><div className="cd-label">MIN</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(seconds)}</div><div className="cd-label">SEC</div></div>
      </div>
      <BookOrnament />
      <p className="body-text">every moment brings us closer to forever</p>
    </>
  );
};

const DetailsPage = () => (
  <>
    <div className="script-heading" style={{marginTop: '12px'}}>The Wedding Celebrations</div>
    <div style={{marginTop:'8px'}}>
      <div className="detail-block">
        <div className="detail-key">DATE</div>
        <div className="detail-val">Saturday, 27 June 2026</div>
        <div className="detail-sub">Ashar 13, 2083 B.S.</div>
      </div>
      <div className="detail-block">
        <div className="detail-key">TIME</div>
        <div className="detail-val">12:00 PM &ndash; 2:00 PM</div>
      </div>
      <div className="detail-block">
        <div className="detail-key">VENUE</div>
        <div className="detail-val">Yala Durbar</div>
        <div className="detail-sub">Sankhamul, Lalitpur</div>
      </div>
    </div>
    <a
      className="map-link"
      href="https://maps.google.com/?q=Yala+Durbar+Sankhamul"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >VIEW ON MAP</a>
  </>
);

const ClosingPage = () => (
  <>
    <div className="eyebrow">WITH LOVE</div>
    <p className="body-text" style={{fontSize:'20px', margin:'14px 10px'}}>
      Your presence is the greatest gift<br/>we could ask for<br/>as we begin our forever.
    </p>
    <BookOrnament />
    <div className="signature">Neha &amp; Prajwal</div>
  </>
);

/* ---------- Book ---------- */

const PAGES = [
  { id: 'cover', label: 'Cover' },
  { id: 'invite', label: 'Invitation' },
  { id: 'couple', label: 'The Couple' },
  { id: 'details', label: 'Details' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'closing', label: 'With Love' },
];
const LAST = PAGES.length - 1;

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
);

const App = () => {
  // Always start at the cover each time the link is opened.
  const [page, setPage] = useState(0);

  // (Intentionally not persisting page position — every visit begins at the cover.)

  // Track which page is actively turning so it can be raised above the
  // others — without this, the page mid-flip can show through/flicker
  // against whichever page is z-ordered on top of it, especially on
  // back-navigation where the turning page is the lower index.
  const prevPage = useRef(0);
  const [flipping, setFlipping] = useState(-1);
  useEffect(() => {
    const idx = page > prevPage.current ? prevPage.current : page;
    setFlipping(idx);
    const t = setTimeout(() => setFlipping(-1), 1000);
    prevPage.current = page;
    return () => clearTimeout(t);
  }, [page]);

  // Hide the loading splash once React has mounted AND fonts are ready,
  // so guests never see the Babel-compile flash or the font swap.
  useEffect(() => {
    const splash = document.getElementById('cover-splash');
    if (!splash) return;
    let settled = false;
    const hide = () => {
      if (settled) return;
      settled = true;
      splash.classList.add('hide');
      setTimeout(() => splash.remove(), 750);
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() =>
        requestAnimationFrame(() => requestAnimationFrame(hide))
      );
    }
    setTimeout(hide, 2600); // safety cap if fonts stall
  }, []);

  // Preload + decode the couple photo up front so it's already rasterized
  // by the time the user reaches page 2.
  useEffect(() => {
    const img = new Image();
    img.src = (window.__resources && window.__resources.coupleImg) || 'assets/couple.jpg';
    img.decode().catch(() => {});
  }, []);

  // Auto-fit: scale each page's content so it always sits inside the frame,
  // no matter the screen height. Full size on roomy screens; gently scales
  // down only when the viewport is short. Uses CSS zoom (reflow) rather than
  // transform: scale — a scale transform on .page-content, nested inside the
  // rotating 3D page, forces iOS Safari/Messenger to re-rasterize that layer
  // mid-turn and flicker.
  useLayoutEffect(() => {
    let raf = null;
    const fit = () => {
      document.querySelectorAll('.page-face').forEach((face) => {
        if (face.classList.contains('cover-face')) return;
        const content = face.querySelector('.page-content');
        if (!content) return;
        content.style.zoom = '1';
        content.style.transform = '';
        const cs = getComputedStyle(face);
        const padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        const avail = face.clientHeight - padV - 6;
        const natural = content.scrollHeight;
        const z = natural > avail ? Math.max(0.62, avail / natural) : 1;
        content.style.zoom = z < 1 ? String(z) : '';
      });
    };
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    schedule();
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, []);

  const next = useCallback(() => setPage(p => Math.min(LAST, p + 1)), []);
  const prev = useCallback(() => setPage(p => Math.max(0, p - 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Swipe navigation
  const touch = useRef(null);
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (dx < -45) next();
    if (dx > 45) prev();
    touch.current = null;
  };

  const renderContent = (id) => {
    switch (id) {
      case 'cover': return <CoverPage onOpen={next} />;
      case 'invite': return <InvitePage />;
      case 'couple': return <CouplePage />;
      case 'countdown': return <CountdownPage />;
      case 'details': return <DetailsPage />;
      case 'closing': return <ClosingPage />;
      default: return null;
    }
  };

  return (
    <>
      <div className="book-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="book" data-screen-label={PAGES[page].label}>
          <div className="book-base"></div>
          {PAGES.map((p, i) => {
            const isCover = p.id === 'cover';
            return (
              <div
                key={p.id}
                className={`page ${i < page ? 'flipped' : ''}`}
                style={{ zIndex: i === flipping ? 500 : (i < page ? 200 + i : (i === page ? 100 : 50 - i)) }}
                onClick={() => { if (i === page && !isCover) next(); }}
                aria-hidden={i !== page}
              >
                <div className={`page-face ${isCover ? 'cover-face' : ''}`}>
                  {!isCover && <div className="page-frame"></div>}
                  {!isCover && <BookFloralCorner />}
                  {!isCover && <div className="corner-floral tr"><BookFloralCorner /></div>}
                  {!isCover && <div className="corner-floral bl"><BookFloralCorner /></div>}
                  {!isCover && <div className="corner-floral br"><BookFloralCorner /></div>}
                  <div className="page-content">
                    {renderContent(p.id)}
                  </div>
                  {!isCover && (
                    <div className="page-num">{i} · OF · {LAST}</div>
                  )}
                </div>
                <div className="page-face page-back"></div>
              </div>
            );
          })}
        </div>
      </div>

      <nav className="book-nav" aria-label="Book pages">
        <button className="nav-btn" onClick={prev} disabled={page === 0} aria-label="Previous page">
          <ArrowLeft /> BACK
        </button>
        <div className="nav-dots">
          {PAGES.slice(1).map((p) => {
            const idx = PAGES.indexOf(p);
            return (
              <button
                key={p.id}
                className={`nav-dot ${idx === page ? 'active' : ''}`}
                onClick={() => setPage(idx)}
                aria-label={`Go to ${p.label}`}
              ></button>
            );
          })}
        </div>
        <button className={`nav-btn ${page === 0 ? 'primary' : ''}`} onClick={next} disabled={page === LAST} aria-label="Next page">
          {page === 0 ? 'OPEN' : 'NEXT'} <ArrowRight />
        </button>
      </nav>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
