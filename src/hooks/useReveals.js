import { useEffect } from 'react';
import { reduce } from '../lib/motion';

/* Révélations au scroll (classes + IntersectionObserver + filet).
   À appeler une fois par page, avec la ref de son conteneur.
   `key` : changer sa valeur (ex. la langue) relance un scan pour
   les éléments remontés ; ceux déjà révélés le restent. */
export function useReveals(scopeRef, key) {
  useEffect(() => {
    if (reduce) return;
    document.documentElement.classList.add('anim-ready');
    const scope = scopeRef.current || document;
    const els = Array.from(scope.querySelectorAll('.reveal, .line-mask, .par-row'))
      .filter(el => !el.classList.contains('in-view'));
    const show = el => el.classList.add('in-view');
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
      els.forEach(el => io.observe(el));
    } else els.forEach(show);
    const failsafe = setTimeout(() => els.forEach(show), 3200);
    return () => { if (io) io.disconnect(); clearTimeout(failsafe); };
  }, [scopeRef, key]);
}
