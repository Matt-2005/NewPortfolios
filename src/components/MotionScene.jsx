import { useEffect, useRef } from 'react';
import { onFrame, reduce } from '../lib/motion';
import { SCENES, rng } from '../lib/scenes';
import { createFlight } from '../lib/flight';

/* Couleurs lues dans le CSS du canvas (suivent le thème clair / sombre). */
function readPalette(canvas, ctx, accent) {
  const cs = getComputedStyle(canvas);
  const pick = (value, fallback) => {
    ctx.fillStyle = '#010203';
    ctx.fillStyle = value;
    return ctx.fillStyle === '#010203' ? fallback : value; // couleur non reconnue → repli
  };
  return {
    ink: cs.color,
    accent: pick(accent || cs.getPropertyValue('--fpv').trim(), '#4f6bff'),
    accent2: pick('oklch(0.74 0.13 205)', '#3cc6d8'),
  };
}

/* En-tête animé d'un projet : `scene` ∈ flow | network | layout | chart | flight,
   `accent` : couleur propre au projet (sinon le bleu du site).
   Ne tourne que lorsqu'il est visible ; figé si « réduire les animations ». */
export default function MotionScene({ scene, seed = 1, accent }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isFlight = scene === 'flight';
    const make = SCENES[scene];
    if (!isFlight && !make) return;

    const flight = isFlight ? createFlight(canvas) : null;
    let inst = null, W = 0, H = 0, visible = false, pal = readPalette(canvas, ctx, accent);
    const t0 = performance.now() - seed * 1370; // décalage : les scènes ne sont pas synchrones
    const STILL = 6.5; // instant affiché quand l'animation est coupée

    const resize = () => {
      if (flight) { flight.resize(); return; }
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w !== W || h !== H) { W = w; H = h; inst = make(W, H, rng(seed), seed); }
    };

    const render = t => {
      if (flight) { flight.draw(0.35, 0, t * 0.09); return; }
      if (!inst) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      inst.draw(ctx, t, pal);
      ctx.globalAlpha = 1;
    };
    const still = () => render(STILL); // une seule image, scène déjà construite

    const ro = new ResizeObserver(() => { resize(); if (reduce) still(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '120px' });
    io.observe(canvas);
    const mo = new MutationObserver(() => { pal = readPalette(canvas, ctx, accent); if (reduce) still(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    let off = null;
    if (reduce) still();
    else off = onFrame(() => { if (visible) render((performance.now() - t0) / 1000); });

    return () => { if (off) off(); ro.disconnect(); io.disconnect(); mo.disconnect(); };
  }, [scene, seed, accent]);

  return <canvas ref={ref} className="motion-scene" aria-hidden="true" />;
}
