import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppContext } from './context/AppContext';
import { initScroller, scrollTopImmediate, scrollToEl, stopScroll, startScroll } from './lib/scroller';
import { coarse } from './lib/motion';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import FsMenu from './components/FsMenu';
import Home from './pages/Home';
import Projets from './pages/Projets';
import Contact from './pages/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const curtainRef = useRef(null);
  const pendingRef = useRef(null); // { hash } en attente après navigation

  /* — Lenis + rafraîchissement ScrollTrigger — */
  useEffect(() => {
    const cleanup = initScroller();
    const onLoad = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onLoad);
    window.addEventListener('load', onLoad);
    return () => { window.removeEventListener('load', onLoad); cleanup(); };
  }, []);

  /* — Menu plein écran : verrou de scroll + classe body — */
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (menuOpen) stopScroll(); else startScroll();
  }, [menuOpen]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* — Navigation avec rideau — */
  const go = useCallback(to => {
    const cur = curtainRef.current;
    const [path, hash] = to.split('#');
    const samePage = (path || '/') === location.pathname;
    if (samePage) {
      setMenuOpen(false);
      if (hash) setTimeout(() => scrollToEl(document.getElementById(hash)), menuOpen ? 620 : 0);
      else scrollToEl(document.body);
      return;
    }
    if (!cur || cur.classList.contains('cover')) {
      navigate(path || '/');
      return;
    }
    setMenuOpen(false);
    pendingRef.current = { hash: hash || null };
    cur.classList.add('cover');
    setTimeout(() => navigate(path || '/'), 640);
  }, [location.pathname, menuOpen, navigate]);

  /* — Arrivée sur une nouvelle route : remise à zéro + levée du rideau — */
  useEffect(() => {
    const cur = curtainRef.current;
    const pending = pendingRef.current;
    pendingRef.current = null;
    scrollTopImmediate();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (cur && cur.classList.contains('cover')) {
        cur.classList.add('lift');
        setTimeout(() => {
          cur.style.transition = 'none';
          cur.classList.remove('cover', 'lift');
          void cur.offsetHeight;
          cur.style.transition = '';
        }, 1050);
      }
      if (pending && pending.hash) {
        setTimeout(() => scrollToEl(document.getElementById(pending.hash)), 350);
      }
    }));
  }, [location.pathname]);

  /* — Éléments magnétiques (délégation globale) — */
  useEffect(() => {
    if (coarse) return;
    let active = null, activeInner = null;
    const reset = () => {
      if (active) { active.style.transform = ''; if (activeInner) activeInner.style.transform = ''; }
      active = null; activeInner = null;
    };
    const onMove = e => {
      const el = e.target.closest ? e.target.closest('[data-magnetic]') : null;
      if (el !== active) { reset(); active = el; activeInner = el ? el.querySelector('.lbl') : null; }
      if (!active) return;
      const strength = parseFloat(active.getAttribute('data-magnetic')) || 0.4;
      const r = active.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      active.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      if (activeInner) activeInner.style.transform = 'translate(' + (x * strength * 0.35) + 'px,' + (y * strength * 0.35) + 'px)';
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
      reset();
    };
  }, []);

  const ctx = useMemo(() => ({ ready, menuOpen, setMenuOpen, go }), [ready, menuOpen, go]);

  return (
    <AppContext.Provider value={ctx}>
      <Preloader onDone={() => setReady(true)} />
      <div className="curtain" ref={curtainRef} aria-hidden="true"><div className="c-mono">ML</div></div>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <FsMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContext.Provider>
  );
}
