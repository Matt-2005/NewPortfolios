import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../i18n/lang';
import { reduce } from '../../lib/motion';
import { scrollToEl } from '../../lib/scroller';
import Icon from '../../components/Icon';
import { buildFaces, loadPageFonts } from './pages';
import { createBook } from './engine';

/* Écran d'entrée (ordinateur) : un livre posé sur un bureau, à feuilleter.
   Clic sur le livre pour l'ouvrir, clic / glisser / flèches pour tourner
   les pages. `onFail` : appelé si WebGL est indisponible (on revient au hero). */
export default function BookStage({ onFail }) {
  const { go } = useApp();
  const { lang, t } = useLang();
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const bookRef = useRef(null);
  const [state, setState] = useState({ spread: 0, total: 5, open: false });
  const [loaded, setLoaded] = useState(false);
  const tRef = useRef(t); tRef.current = t;

  const toSite = () => {
    const next = stageRef.current && stageRef.current.nextElementSibling;
    if (next) scrollToEl(next);
  };

  /* — création du livre (après le chargement des polices) — */
  useEffect(() => {
    let alive = true;
    const host = hostRef.current;
    const labels = {
      open: () => tRef.current('ouvrir', 'open'), next: () => tRef.current('suivant', 'next'),
      prev: () => tRef.current('précédent', 'back'), link: () => tRef.current('voir', 'view'),
    };
    loadPageFonts().then(() => {
      if (!alive) return;
      try {
        bookRef.current = createBook(host, {
          faces: buildFaces(tRef.current),
          reduce,
          onState: s => setState(s),
          onHover: kind => {
            // le curseur du site lit data-cursor au survol : on le relance
            if (kind) host.setAttribute('data-cursor', labels[kind]()); else host.removeAttribute('data-cursor');
            host.style.cursor = kind ? 'pointer' : '';
            host.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          },
          onAction: a => {
            if (a.type === 'go') go(a.to);
            else if (a.type === 'href') window.location.href = a.href;
            else if (a.type === 'link') window.open(a.href, '_blank', 'noopener');
            else if (a.type === 'site') toSite();
          },
        });
        setLoaded(true);
      } catch (e) {
        if (onFail) onFail();
      }
    });
    return () => { alive = false; if (bookRef.current) { bookRef.current.dispose(); bookRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* — langue : on repeint les pages — */
  useEffect(() => { if (bookRef.current) bookRef.current.setFaces(buildFaces(t)); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /* — rendu seulement quand l'écran est visible ; flèches du clavier — */
  useEffect(() => {
    const stage = stageRef.current;
    let inView = false;
    const io = new IntersectionObserver(([e]) => {
      inView = e.intersectionRatio > 0.5;
      const b = bookRef.current; if (!b) return;
      if (e.isIntersecting) b.start(); else b.stop();
    }, { threshold: [0, 0.5, 1] });
    io.observe(stage);
    const onKey = e => {
      if (!inView || !bookRef.current) return;
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === 'ArrowRight') { bookRef.current.next(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { bookRef.current.prev(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { io.disconnect(); window.removeEventListener('keydown', onKey); };
  }, [loaded]);

  const b = bookRef.current;
  const { spread, total, open } = state;

  return (
    <section className={'book-stage' + (open ? ' is-open' : '') + (loaded ? ' is-ready' : '')} ref={stageRef} data-navdark aria-label={t('Portfolio à feuilleter', 'Flip-through portfolio')}>
      <div className="book-canvas" ref={hostRef} />
      <div className="book-vignette" aria-hidden="true" />

      <div className="book-intro">
        <p className="book-eyebrow mono">{t('Portfolio — 2026', 'Portfolio — 2026')}</p>
        <h1>Matthew LE <em>— Data Engineer</em></h1>
        <p className="book-lead">{t(
          'Un portfolio à feuilleter. Ouvrez le livre, puis cliquez ou faites glisser les pages pour découvrir mes expériences.',
          'A portfolio to leaf through. Open the book, then click or drag the pages to discover my experience.'
        )}</p>
      </div>

      <div className="book-controls">
        {!open ? (
          <button type="button" className="book-btn" onClick={() => b && b.open()}>
            {t('Ouvrir le livre', 'Open the book')}
          </button>
        ) : (
          <>
            <button type="button" className="book-arrow" onClick={() => b && b.prev()} aria-label={t('Page précédente', 'Previous page')}><Icon name="arrow-left" /></button>
            <span className="book-count mono">{String(spread).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button type="button" className="book-arrow" onClick={() => b && b.next()} disabled={spread >= total} aria-label={t('Page suivante', 'Next page')}><Icon name="arrow-right" /></button>
            <button type="button" className="book-close mono" onClick={() => b && b.close()}>{t('Refermer', 'Close')}</button>
          </>
        )}
      </div>
      <p className="book-hint mono" aria-hidden="true">{t('← → pour tourner les pages', '← → to turn the pages')}</p>

      <button type="button" className="book-skip mono" onClick={toSite}>
        {t('Passer au site', 'Skip to the site')} <Icon name="arrow-down" />
      </button>
    </section>
  );
}
