import { useEffect } from 'react';
import { clamp, onFrame, reduce } from '../lib/motion';

/* Apparition / disparition (--rv) + parallaxe interne (--py)
   des cartes projets visibles dans `gridRef`.
   Performance : on ne calcule que si la page a défilé, on lit toutes les
   positions d'abord puis on écrit (pas d'aller-retour lecture/écriture
   qui forcerait le navigateur à tout recalculer), et seulement si la
   valeur a changé. */
export function useProjectMotion(gridRef, deps = []) {
  useEffect(() => {
    if (reduce) return;
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.proj-card')).map(el => ({ el, rv: '', py: '' }));
    let lastY = null, lastH = 0;
    const off = onFrame(() => {
      const h = window.innerHeight, y = window.scrollY;
      if (y === lastY && h === lastH) return;
      lastY = y; lastH = h;
      // 1) lectures
      const rects = cards.map(c => c.el.getBoundingClientRect());
      // 2) écritures
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i], r = rects[i];
        if (r.bottom < -140 || r.top > h + 140) continue;
        const appear = clamp((h * 0.94 - r.top) / (h * 0.30), 0, 1);
        const leave = clamp((h * 0.16 - r.bottom) / (h * 0.18), 0, 1);
        const rv = clamp(appear - leave, 0, 1).toFixed(3);
        const py = clamp(-(r.top + r.height / 2 - h / 2) * 0.045, -26, 26).toFixed(1) + 'px';
        if (rv !== c.rv) { c.rv = rv; c.el.style.setProperty('--rv', rv); }
        if (py !== c.py) { c.py = py; c.el.style.setProperty('--py', py); }
      }
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
