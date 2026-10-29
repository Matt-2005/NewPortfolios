import { useEffect, useRef } from 'react';
import { onFrame, reduce } from '../lib/motion';
import { SCENES, rng } from '../lib/scenes';
import { createFlight } from '../lib/flight';

/* Couleurs lues dans le CSS du canvas (suivent le thème clair / sombre). */
function readPalette(canvas, ctx, accent) {
  const cs = getComputedStyle(canvas);
  const bg = getComputedStyle(canvas.parentElement).backgroundColor;
  const rgb = (cs.color.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
  const inkLum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  const pick = (value, fallback) => {
    ctx.fillStyle = '#010203';
    ctx.fillStyle = value;
    return ctx.fillStyle === '#010203' ? fallback : value; // couleur non reconnue → repli
  };
  return {
    ink: cs.color,
    accent: pick(accent || cs.getPropertyValue('--fpv').trim(), '#4f6bff'),
    accent2: pick('oklch(0.74 0.13 205)', '#3cc6d8'),
    bg: !bg || bg === 'rgba(0, 0, 0, 0)' ? (inkLum < 0.5 ? '#f4f2ea' : '#0f1115') : bg,
    lightSurface: inkLum < 0.5, // trait sombre ⇒ fond clair
  };
}

/* En-tête animé d'un projet : `scene` ∈ flow | network | layout | chart | flight,
   `accent` : couleur propre au projet (sinon le bleu du site),
   `logo`   : { src, tone } — logo de l'entreprise, intégré à la scène.
   Ne tourne que lorsqu'il est visible ; figé si « réduire les animations ». */
export default function MotionScene({ scene, seed = 1, accent, logo }) {
  const logoSrc = logo ? logo.src : null, logoTone = logo ? logo.tone : null;
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isFlight = scene === 'flight';
    const make = SCENES[scene];
    if (!isFlight && !make) return;

    const flight = isFlight ? createFlight(canvas) : null;
    let inst = null, W = 0, H = 0, visible = false, logoImg = null;
    let pal = readPalette(canvas, ctx, accent);
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
    const mo = new MutationObserver(() => { pal = { ...readPalette(canvas, ctx, accent), logo: logoImg }; if (reduce) still(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let alive = true;
    if (logoSrc) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { if (!alive) return; logoImg = { img, tone: logoTone }; pal.logo = logoImg; if (reduce) still(); };
      img.src = logoSrc;
    }

    resize();
    let off = null;
    if (reduce) still();
    else off = onFrame(() => { if (visible) render((performance.now() - t0) / 1000); });

    return () => { alive = false; if (off) off(); ro.disconnect(); io.disconnect(); mo.disconnect(); };
  }, [scene, seed, accent, logoSrc, logoTone]);

  return <canvas ref={ref} className="motion-scene" aria-hidden="true" />;
}
