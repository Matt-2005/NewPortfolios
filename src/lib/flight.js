/* ============================================================
   VOL FPV PROCÉDURAL — rendu canvas 2D piloté par le scroll.
   Sert de séquence immersive tant qu'aucune vidéo n'est déposée
   dans public/media/immersive.mp4.
   ============================================================ */
import { clamp, smooth } from './motion';

export function createFlight(canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  const stars = [];
  for (let i = 0; i < 70; i++) {
    stars.push({ x: Math.random(), y: Math.random() * 0.42, r: Math.random() * 1.3 + 0.3, a: Math.random() * 0.5 + 0.2 });
  }
  const seeds = [];
  for (let i = 0; i < 16; i++) seeds.push(Math.random());

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ridge(col, amp, speed, freq, hor, t) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(-W * 0.06, hor + 2);
    const off = t * speed;
    for (let xi = 0; xi <= 72; xi++) {
      const u = xi / 72;
      const x = -W * 0.06 + u * W * 1.12;
      const env = smooth(Math.abs(u - 0.5), 0.13, 0.5); // vallée plate au centre
      const n = Math.sin(u * 6.3 * freq + off * 2.1) * 0.5 +
                Math.sin(u * 13.7 * freq - off * 3.3) * 0.3 +
                Math.sin(u * 29 * freq + off * 1.2) * 0.2;
      ctx.lineTo(x, hor + 2 - env * amp * (0.55 + 0.45 * n));
    }
    ctx.lineTo(W * 1.06, hor + 2);
    ctx.closePath();
    ctx.fill();
  }

  function draw(p, v, tx) {
    if (!W || !H) { resize(); if (!W) return; }
    const hor = H * 0.60;
    const t = p * 7 + (tx || 0); // distance parcourue (+ ralenti d'attente)
    const roll = Math.sin(p * Math.PI * 2.4) * 0.028 + clamp(v * 0.00045, -0.03, 0.03);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, hor); ctx.rotate(roll); ctx.scale(1.06, 1.06); ctx.translate(-W / 2, -hor);

    // ciel crépusculaire
    const sky = ctx.createLinearGradient(0, 0, 0, hor * 1.05);
    sky.addColorStop(0, '#120f20');
    sky.addColorStop(0.42, '#251638');
    sky.addColorStop(0.66, '#5e2c44');
    sky.addColorStop(0.84, '#b54e2e');
    sky.addColorStop(1, '#ef9950');
    ctx.fillStyle = sky;
    ctx.fillRect(-W * 0.06, -H * 0.06, W * 1.12, hor * 1.05 + H * 0.06);

    // étoiles qui s'effacent à mesure qu'on plonge vers le soleil
    const starA = (1 - p) * 0.7;
    if (starA > 0.02) {
      ctx.fillStyle = '#e8e6f2';
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        ctx.globalAlpha = st.a * starA;
        ctx.fillRect(st.x * W, st.y * H, st.r, st.r);
      }
      ctx.globalAlpha = 1;
    }

    // soleil — il grossit : on vole littéralement dedans
    const sr = Math.min(W, H) * (0.13 + p * 0.36);
    const sx = W * 0.5, sy = hor - sr * 0.16;
    const glow = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 2.6);
    glow.addColorStop(0, 'rgba(255,170,90,0.55)');
    glow.addColorStop(0.5, 'rgba(255,130,60,0.18)');
    glow.addColorStop(1, 'rgba(255,120,60,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - sr * 2.7, sy - sr * 2.7, sr * 5.4, sr * 5.4);
    ctx.save();
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.clip();
    const sg = ctx.createLinearGradient(0, sy - sr, 0, sy + sr);
    sg.addColorStop(0, '#ffe9c4'); sg.addColorStop(0.55, '#ffc173'); sg.addColorStop(1, '#ff7e3c');
    ctx.fillStyle = sg;
    ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    ctx.fillStyle = 'rgba(37,22,56,0.85)';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(sx - sr, sy + sr * (0.06 + i * 0.16), sr * 2, sr * (0.022 + i * 0.015));
    }
    ctx.restore();

    // brume chaude à l'horizon
    const haze = ctx.createLinearGradient(0, hor - H * 0.05, 0, hor + H * 0.06);
    haze.addColorStop(0, 'rgba(255,150,80,0)');
    haze.addColorStop(0.5, 'rgba(255,150,80,0.30)');
    haze.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(-W * 0.06, hor - H * 0.05, W * 1.12, H * 0.11);

    // sol
    const gnd = ctx.createLinearGradient(0, hor, 0, H * 1.06);
    gnd.addColorStop(0, '#2a1622'); gnd.addColorStop(0.3, '#190f18'); gnd.addColorStop(1, '#0b070d');
    ctx.fillStyle = gnd;
    ctx.fillRect(-W * 0.06, hor, W * 1.12, H * 1.06 - hor);

    // lignes filantes vers le point de fuite
    ctx.lineWidth = 1;
    for (let k = -9; k <= 9; k++) {
      if (!k) continue;
      const a = 0.04 + 0.07 * (1 - Math.abs(k) / 9);
      ctx.strokeStyle = 'rgba(243,156,92,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(sx, hor);
      ctx.lineTo(W / 2 + k * W * 0.135, H + 30);
      ctx.stroke();
    }
    // lignes transversales — le scroll fait avancer le terrain
    const ROWS = 12;
    for (let i = 0; i < ROWS; i++) {
      let f = (i / ROWS + t) % 1; if (f < 0) f += 1;
      const y = hor + (H - hor) * Math.pow(f, 2.5);
      const a = 0.04 + 0.34 * Math.pow(f, 1.6);
      ctx.strokeStyle = 'rgba(245,160,95,' + a.toFixed(3) + ')';
      ctx.lineWidth = 1 + f * 1.8;
      ctx.beginPath(); ctx.moveTo(-W * 0.06, y); ctx.lineTo(W * 1.06, y); ctx.stroke();
    }
    ctx.lineWidth = 1;

    // crêtes latérales — la vallée qu'on traverse (2 plans de parallaxe)
    ridge('#1c1330', H * 0.15, 0.35, 1.7, hor, t);
    ridge('#0e0a17', H * 0.24, 0.8, 1.0, hor, t);

    // traînées de vitesse (réagissent à la vélocité du scroll)
    const k2 = clamp(Math.abs(v) / 46, 0, 1);
    if (k2 > 0.03) {
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.30 * k2).toFixed(3) + ')';
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < seeds.length; i++) {
        const ang = seeds[i] * Math.PI * 2;
        const r0 = Math.min(W, H) * (0.28 + seeds[(i + 5) % 16] * 0.3);
        const len = Math.min(W, H) * (0.10 + 0.35 * k2) * (0.5 + seeds[(i + 9) % 16]);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
        ctx.lineTo(cx + Math.cos(ang) * (r0 + len), cy + Math.sin(ang) * (r0 + len));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  return { draw, resize };
}
