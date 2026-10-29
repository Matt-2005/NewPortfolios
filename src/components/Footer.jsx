import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduce } from '../lib/motion';
import { scrollToEl } from '../lib/scroller';
import { useApp } from '../context/AppContext';
import { PAGES } from '../data/pages';
import { useLang } from '../i18n/lang';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footRef = useRef(null);
  const { go } = useApp();
  const { t } = useLang();

  /* parallaxe du grand nom */
  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.big-name', { yPercent: 26 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: footRef.current, start: 'top bottom', end: 'top 45%', scrub: 0.5 },
      });
    }, footRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="foot" data-navdark ref={footRef}>
      <div className="wrap">
        <div className="big-name serif">Matthew <em>Le</em> ↗</div>
        <div className="foot-row">
          <nav className="foot-nav" aria-label="Pages">
            {PAGES.map(l => (
              <a key={l.to} href={l.to} onClick={e => { e.preventDefault(); go(l.to); }}>{t(l.label)}</a>
            ))}
          </nav>
          <small>{t('© 2026 Matthew LE — conçu & développé par mes soins.', '© 2026 Matthew LE — designed & built by me.')}<br />{t('Lyon — cap sur la Suisse', 'Lyon — heading for Switzerland')}</small>
          <a
            href="#top"
            className="totop"
            data-cursor={t('haut', 'top')}
            onClick={e => { e.preventDefault(); scrollToEl(document.body); }}
          >
            {t('↑ Retour en haut', '↑ Back to top')}
          </a>
        </div>
      </div>
    </footer>
  );
}
