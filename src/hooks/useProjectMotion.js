import { useEffect } from 'react';
import { clamp, onFrame, reduce } from '../lib/motion';

/* Apparition / disparition (--rv) + parallaxe interne (--py)
   des cartes projets visibles dans `gridRef`. */
export function useProjectMotion(gridRef, deps = []) {
  useEffect(() => {
    if (reduce) return;
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.proj-card'));
    const off = onFrame(() => {
      const h = window.innerHeight;
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (c.classList.contains('is-hidden')) continue;
        const r = c.getBoundingClientRect();
        if (r.bottom < -140 || r.top > h + 140) continue;
        const appear = clamp((h * 0.94 - r.top) / (h * 0.30), 0, 1);
        const leave = clamp((h * 0.16 - r.bottom) / (h * 0.18), 0, 1);
        c.style.setProperty('--rv', clamp(appear - leave, 0, 1).toFixed(3));
        const offc = r.top + r.height / 2 - h / 2;
        c.style.setProperty('--py', clamp(-offc * 0.045, -26, 26).toFixed(1) + 'px');
      }
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
