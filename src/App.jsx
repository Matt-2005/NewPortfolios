import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppContext } from './context/AppContext';
import { initScroller, scrollTopImmediate, scrollToEl, stopScroll, startScroll } from './lib/scroller';
import ScrollTop from './components/ScrollTop';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import FsMenu from './components/FsMenu';
import Home from './pages/Home';
import APropos from './pages/APropos';
import Projets from './pages/Projets';
import Projet from './pages/Projet';
import Contact from './pages/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const curtainRef = useRef(null);
  const pendingRef = useRef(null); // { hash } en attente après navigation

  /* — Prêt dès la première image : les entrées (hero, nav) jouent tout de suite — */
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

  const ctx = useMemo(() => ({ ready, menuOpen, setMenuOpen, go }), [ready, menuOpen, go]);

  return (
    <AppContext.Provider value={ctx}>
      <div className="curtain" ref={curtainRef} aria-hidden="true"><div className="c-mono">ML</div></div>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <FsMenu />
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/projets/:id" element={<Projet />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContext.Provider>
  );
}
