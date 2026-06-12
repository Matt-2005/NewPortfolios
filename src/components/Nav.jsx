import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { onFrame } from '../lib/motion';

export default function Nav() {
  const { go, menuOpen, setMenuOpen } = useApp();
  const location = useLocation();
  const navRef = useRef(null);
  const [clock, setClock] = useState('GENÈVE / —');

  /* — horloge — */
  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' });
      setClock('GENÈVE / ' + t);
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  /* — pastilles au scroll + bascule de couleur sur zones sombres — */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let zones = [];
    let sc = null, dk = null;
    const raf = requestAnimationFrame(() => {
      zones = Array.from(document.querySelectorAll('[data-navdark]'));
    });
    const off = onFrame(() => {
      const s = (window.scrollY || 0) > 24;
      if (s !== sc) { sc = s; nav.classList.toggle('scrolled', s); }
      let dark = false;
      for (let i = 0; i < zones.length; i++) {
        const r = zones[i].getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) { dark = true; break; }
      }
      if (dark !== dk) { dk = dark; nav.classList.toggle('on-dark', dark); }
    });
    return () => { cancelAnimationFrame(raf); off(); };
  }, [location.pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ml-theme', next); } catch (e) {}
  };

  return (
    <header className="nav" ref={navRef}>
      <a
        href="/"
        className="brand"
        aria-label="Matthew LE — accueil"
        onClick={e => { e.preventDefault(); go('/'); }}
      >
        ML<span className="reg">®</span>
      </a>
      <div className="nav-right">
        <span className="nav-clock hidden-clock mono">{clock.split(' / ')[0]} <span className="dot">/</span> {clock.split(' / ')[1]}</span>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Basculer jour / nuit" data-magnetic="0.3">
          <svg className="ic-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          <svg className="ic-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4.4" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M19.2 4.8l-2.1 2.1M6.9 17.1l-2.1 2.1" /></svg>
        </button>
        <button
          className="menu-btn"
          aria-expanded={menuOpen}
          data-cursor={menuOpen ? 'fermer' : 'ouvrir'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span>MENU</span>
          <span className="bars"><span /><span /></span>
        </button>
      </div>
    </header>
  );
}
