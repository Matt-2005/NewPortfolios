/* ============================================================
   Boucle partagée + vélocité de scroll + petites maths d'easing.
   Tous les moteurs (immersive, marquees, particules…) s'y
   abonnent : un seul rAF, un seul calcul de vélocité.
   ============================================================ */

export const lerp = (a, b, n) => a + (b - a) * n;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
export const smooth = (p, a, b) => { const t = clamp((p - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const bell = (p, c, w) => Math.exp(-Math.pow((p - c) / w, 2));

export const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

const cbs = new Set();
let vel = 0, velS = 0, lastY = 0, running = false;

export const getVel = () => velS;

function runCbs() {
  cbs.forEach(fn => { try { fn(); } catch (e) { /* un effet ne tue jamais la boucle */ } });
}

function start() {
  if (running) return;
  running = true;
  lastY = window.scrollY;
  (function tick() {
    const y = window.scrollY;
    vel = y - lastY; lastY = y;
    velS = lerp(velS, vel, 0.12);
    if (Math.abs(velS) < 0.01) velS = 0;
    runCbs();
    requestAnimationFrame(tick);
  })();
  // filet : si rAF est ralenti (onglet en arrière-plan), le scroll met à jour
  window.addEventListener('scroll', runCbs, { passive: true });
}

/** S'abonne à la boucle partagée ; renvoie la fonction de désabonnement. */
export function onFrame(fn) {
  cbs.add(fn);
  start();
  return () => cbs.delete(fn);
}
