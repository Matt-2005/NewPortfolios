/* ============================================================
   Champ de vecteurs 2D — filaments d'air du hero.
   Sert de REPLI si WebGL n'est pas disponible : la scène
   Three.js (HeroField) le remplace en temps normal.
   ============================================================ */
import { clamp, lerp, getVel, coarse } from './motion';

export function createFlowField(canvas, hero) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  let W = 0, H = 0, run = true, theme = '', alive = true;
  const root = document.documentElement;
  const N = coarse ? 64 : 118;
  const P = [];
  function seed(pt) {
    pt.x = Math.random() * W; pt.y = Math.random() * H;
    pt.px = pt.x; pt.py = pt.y;
    pt.sp = 0.45 + Math.random() * 0.9;
    pt.life = 90 + Math.random() * 220;
  }
  for (let i = 0; i < N; i++) P.push({ fpv: i % 9 === 0 });

  let mx = -1, my = -1;
  const onMove = e => {
    const r = hero.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  };
  const onLeave = () => { mx = -1; };
  if (!coarse) {
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P.forEach(seed);
  }
  resize();
  window.addEventListener('resize', resize);
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(en => { run = en[0].isIntersecting; }, { rootMargin: '120px' })
    : null;
  if (io) io.observe(hero);

  const field = (x, y, t) =>
    (Math.sin(x * 0.0014 + t) * 0.85 +
     Math.cos(y * 0.0012 - t * 0.7) * 0.85 +
     Math.sin((x + y) * 0.0006 + t * 0.45) * 0.6);

  let tt = Math.random() * 90, lastT = performance.now();
  (function frame(now) {
    if (!alive) return;
    requestAnimationFrame(frame);
    if (!run || !W) { lastT = now; return; }
    const dt = Math.min((now - lastT) / 16.7, 3); lastT = now;
    tt += 0.0035 * dt;

    const dark = root.getAttribute('data-theme') === 'dark';
    const th = dark ? 'd' : 'l';
    if (th !== theme) { theme = th; ctx.clearRect(0, 0, W, H); P.forEach(seed); }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.075)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    const velS = getVel();
    const wind = clamp(velS * 0.05, -2.6, 2.6);
    const ink = dark ? '238,238,246' : '31,33,47';
    const grn = dark ? '105,140,255' : '40,75,200'; // accent bleu roi
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    for (let i = 0; i < P.length; i++) {
      const pt = P[i];
      if (pt.life == null) seed(pt);
      const a = field(pt.x, pt.y, tt) * Math.PI;
      let vx = Math.cos(a) * pt.sp * dt * 1.15;
      let vy = (Math.sin(a) * 0.62 - 0.22) * pt.sp * dt * 1.15 + wind * 0.5 * dt;
      if (mx >= 0) {
        const dx = pt.x - mx, dy = pt.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 19600 && d2 > 1) {
          const f = (1 - d2 / 19600) * 2.3 / Math.sqrt(d2);
          vx += dx * f * dt; vy += dy * f * dt;
        }
      }
      pt.px = pt.x; pt.py = pt.y;
      pt.x += vx; pt.y += vy;
      pt.life -= dt;
      if (pt.life <= 0 || pt.x < -8 || pt.x > W + 8 || pt.y < -8 || pt.y > H + 8) { seed(pt); continue; }
      ctx.strokeStyle = pt.fpv
        ? 'rgba(' + grn + ',' + (dark ? 0.5 : 0.42) + ')'
        : 'rgba(' + ink + ',' + (dark ? 0.13 : 0.11) + ')';
      ctx.beginPath();
      ctx.moveTo(pt.px, pt.py);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  })(lastT);

  return () => {
    alive = false;
    window.removeEventListener('resize', resize);
    if (!coarse) { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); }
    if (io) io.disconnect();
  };
}
