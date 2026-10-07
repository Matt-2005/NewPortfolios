import { useEffect, useRef, useState } from 'react';
import { onFrame } from '../lib/motion';
import { scrollToEl } from '../lib/scroller';

/* Dock flottant en liquid glass : anneau de progression (accent bleu)
   + retour en haut. Apparaît une fois passé le premier écran. */
export default function ScrollTop() {
  const [show, setShow] = useState(false);
  const btnRef = useRef(null);
  const shownRef = useRef(false);

  useEffect(() => {
    const off = onFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop || 0;
      const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      if (btnRef.current) btnRef.current.style.setProperty('--p', p.toFixed(4));
      const next = y > window.innerHeight * 0.75;
      if (next !== shownRef.current) { shownRef.current = next; setShow(next); }
    });
    return off;
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className={'scrolltop' + (show ? ' show' : '')}
      onClick={() => scrollToEl(document.body)}
      aria-label="Revenir en haut"
      data-magnetic="0.3"
    >
      <span className="st-icon lbl" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
