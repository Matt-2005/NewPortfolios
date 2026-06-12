import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduce } from '../lib/motion';
import { scrollToEl } from '../lib/scroller';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footRef = useRef(null);

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
          <small>© 2026 — Conçu &amp; développé avec passion.<br />Toujours en mouvement.</small>
          <a
            href="#top"
            className="totop"
            data-cursor="haut"
            onClick={e => { e.preventDefault(); scrollToEl(document.body); }}
          >
            ↑ Retour en haut
          </a>
        </div>
      </div>
    </footer>
  );
}
