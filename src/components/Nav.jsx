import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { gsap } from 'gsap';
import { onFrame, reduce } from '../lib/motion';
import { PAGES } from '../data/pages';

export default function Nav() {
  const { ready, go, menuOpen, setMenuOpen } = useApp();
  const location = useLocation();
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const pillRef = useRef(null);
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

  /* — entrée unique, à la fin du préchargeur. Gérée ici (la nav ne se
     démonte jamais) et non par le hero : le nettoyage GSAP du hero
     la laissait invisible en quittant l'accueil. — */
  const enteredRef = useRef(false);
  useEffect(() => {
    const nav = navRef.current;
    if (!ready || !nav || enteredRef.current) return;
    enteredRef.current = true;
    if (reduce) return;
    gsap.fromTo(nav, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease: 'power4.out', clearProps: 'transform,opacity' });
  }, [ready]);

  /* — pastilles au scroll + bascule de couleur sur zones sombres —
     On teste l'élément réellement visible sous la nav (et non les
     rectangles des sections) : les feuilles qui se recouvrent
     (showreel) restent ainsi correctes. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let sc = null, dk = null, lastY = -1, n = 0;
    const off = onFrame(() => {
      const y = window.scrollY || 0;
      const s = y > 24;
      if (s !== sc) { sc = s; nav.classList.toggle('scrolled', s); }
      if (y === lastY && (n++ % 20)) return;
      lastY = y;
      let dark = false;
      const hits = document.elementsFromPoint(window.innerWidth / 2, 40);
      for (let i = 0; i < hits.length; i++) {
        const el = hits[i];
        if (el.closest('.nav, .cursor, .curtain, .fsmenu, .intro, .preloader, .reel-lb')) continue;
        dark = !!el.closest('[data-navdark]');
        break;
      }
      if (dark !== dk) { dk = dark; nav.classList.toggle('on-dark', dark); }
    });
    return off;
  }, [location.pathname]);

  /* — pastille active : glisse sous le lien de la page courante — */
  useEffect(() => {
    const wrap = linksRef.current, pill = pillRef.current;
    if (!wrap || !pill) return;
    const place = () => {
      const a = wrap.querySelector('a[aria-current="page"]');
      if (!a) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.width = a.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    return () => ro.disconnect();
  }, [location.pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ml-theme-v2', next); } catch (e) {}
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
      <nav className="nav-links" ref={linksRef} aria-label="Pages">
        <span className="nav-pill" ref={pillRef} aria-hidden="true" />
        {PAGES.map(l => (
          <a
            key={l.to}
            href={l.to}
            aria-current={location.pathname === l.to ? 'page' : undefined}
            onClick={e => { e.preventDefault(); go(l.to); }}
          >
            {l.label}
          </a>
        ))}
      </nav>
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
