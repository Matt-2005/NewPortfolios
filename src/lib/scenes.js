/* ============================================================
   SCÈNES ANIMÉES des en-têtes de projet (canvas 2D, sans dépendance).
   Chaque scène raconte le projet :
     flow     données qui convergent vers un tableau de bord (BI)
     network  messages qui circulent entre des nœuds (Kafka, infra)
     layout   maquette de site qui se construit (projets web)
     chart    séries temporelles qui défilent (projets data)
   Une scène = fabrique (W, H, rand) → { draw(ctx, t, pal) }
   pal = { ink, accent, accent2 } ; t en secondes.
   ============================================================ */
import { clamp, easeOutCubic } from './motion';

const TAU = Math.PI * 2;

/* pseudo-aléatoire déterministe : la même graine donne la même scène */
export function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  else ctx.rect(x, y, w, h);
}

/* ---------- flow : pipelines → dashboard ---------- */
function flow(W, H, rand) {
  const N = 7, cx = W * 0.6, cy = H * 0.5;
  const tracks = [];
  for (let i = 0; i < N; i++) {
    const y0 = H * (0.06 + 0.88 * i / (N - 1)) + (rand() - 0.5) * H * 0.05;
    const y1 = cy + (i - (N - 1) / 2) * H * 0.03;
    tracks.push([[-W * 0.04, y0], [W * 0.26, y0], [W * 0.36, y1], [cx, y1]]);
  }
  const bez = (p, u) => {
    const v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
    return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
  };
  const bars = Array.from({ length: 9 }, () => ({ base: 0.25 + rand() * 0.45, ph: rand() * TAU, bump: 0 }));
  const packets = [];
  tracks.forEach((tr, i) => { for (let k = 0; k < 3; k++) packets.push({ tr, ph: rand(), sp: 0.06 + rand() * 0.06, last: 0, bar: (i * 3 + k) % bars.length }); });

  return {
    draw(ctx, t, pal) {
      // voies
      ctx.lineWidth = 1; ctx.strokeStyle = pal.ink; ctx.globalAlpha = 0.14;
      for (const p of tracks) {
        ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
        ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
        ctx.lineTo(W * 0.66, p[3][1]);
        ctx.stroke();
      }
      // paquets de données (avec traînée) ; à l'arrivée, une barre monte
      for (const p of packets) {
        const u = (t * p.sp + p.ph) % 1;
        if (u < p.last) bars[p.bar].bump = 1;
        p.last = u;
        const fade = clamp(u * 8, 0, 1) * clamp((1 - u) * 10, 0, 1);
        for (let j = 0; j < 7; j++) {
          const uu = u - j * 0.011;
          if (uu < 0) break;
          const [x, y] = bez(p.tr, uu);
          ctx.globalAlpha = (1 - j / 7) * 0.9 * fade;
          ctx.fillStyle = j ? pal.accent2 : pal.accent;
          dot(ctx, x, y, j ? 1.5 : 2.4);
        }
      }
      // tableau de bord : barres + courbe
      const x0 = W * 0.68, x1 = W * 0.95, base = H * 0.8, top = H * 0.2;
      const slot = (x1 - x0) / bars.length, bw = slot * 0.58;
      ctx.globalAlpha = 0.22; ctx.fillStyle = pal.ink; ctx.fillRect(x0, base, x1 - x0, 1);
      const tops = [];
      bars.forEach((b, i) => {
        const v = clamp(b.base + 0.1 * Math.sin(t * 0.8 + b.ph) + 0.2 * b.bump, 0.08, 1);
        b.bump *= 0.965;
        const h = v * (base - top), x = x0 + i * slot + (slot - bw) / 2;
        ctx.globalAlpha = 0.26 + 0.3 * b.bump; ctx.fillStyle = pal.accent;
        rrect(ctx, x, base - h, bw, h, 3); ctx.fill();
        ctx.globalAlpha = 0.9; ctx.fillRect(x, base - h, bw, 2);
        tops.push([x + bw / 2, base - h - 14]);
      });
      ctx.globalAlpha = 0.75; ctx.strokeStyle = pal.accent2; ctx.lineWidth = 1.5;
      ctx.beginPath(); tops.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.fillStyle = pal.accent2;
      tops.forEach(([x, y]) => dot(ctx, x, y, 2));
    },
  };
}

/* ---------- network : messages entre nœuds ---------- */
function network(W, H, rand) {
  const step = clamp(Math.min(W, H) / 3.4, 54, 120);
  const nodes = [];
  for (let y = step * 0.55; y < H; y += step) {
    for (let x = step * 0.5; x < W; x += step) {
      nodes.push({ x: x + (rand() - 0.5) * step * 0.6, y: y + (rand() - 0.5) * step * 0.55, pulse: 0, big: rand() < 0.2, nb: [] });
    }
  }
  const edges = [];
  nodes.forEach((n, i) => {
    const near = nodes.map((m, j) => [j, (m.x - n.x) ** 2 + (m.y - n.y) ** 2]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
    near.forEach(([j]) => {
      if (!n.nb.includes(j)) { n.nb.push(j); nodes[j].nb.push(i); edges.push([i, j]); }
    });
  });
  const packets = Array.from({ length: Math.max(4, Math.round(nodes.length * 0.45)) }, () => {
    const a = Math.floor(rand() * nodes.length);
    const b = nodes[a].nb[Math.floor(rand() * nodes[a].nb.length)];
    return { a, b, u: rand(), sp: 0.5 + rand() * 0.6 };
  });
  let last = null;

  return {
    draw(ctx, t, pal) {
      const dt = last === null ? 0 : clamp(t - last, 0, 0.1);
      last = t;
      ctx.lineWidth = 1; ctx.strokeStyle = pal.ink; ctx.globalAlpha = 0.12;
      ctx.beginPath();
      for (const [i, j] of edges) { ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); }
      ctx.stroke();
      // messages
      for (const p of packets) {
        p.u += dt * p.sp;
        if (p.u >= 1) {
          const n = nodes[p.b];
          n.pulse = 1;
          const next = n.nb.filter(j => j !== p.a);
          p.a = p.b; p.b = (next.length ? next : n.nb)[Math.floor(rand() * (next.length || n.nb.length))];
          p.u = 0;
        }
        const A = nodes[p.a], B = nodes[p.b];
        for (let k = 0; k < 4; k++) {
          const u = p.u - k * 0.06;
          if (u < 0) break;
          ctx.globalAlpha = (1 - k / 4) * 0.95; ctx.fillStyle = k ? pal.accent2 : pal.accent;
          dot(ctx, A.x + (B.x - A.x) * u, A.y + (B.y - A.y) * u, k ? 1.4 : 2.3);
        }
      }
      // nœuds (serveurs) + onde à la réception
      for (const n of nodes) {
        if (n.pulse > 0.02) {
          ctx.globalAlpha = n.pulse * 0.5; ctx.strokeStyle = pal.accent;
          ctx.beginPath(); ctx.arc(n.x, n.y, 5 + (1 - n.pulse) * 20, 0, TAU); ctx.stroke();
          n.pulse *= 0.955;
        }
        if (n.big) {
          ctx.globalAlpha = 0.5; ctx.strokeStyle = pal.ink; rrect(ctx, n.x - 5, n.y - 5, 10, 10, 2); ctx.stroke();
          ctx.globalAlpha = 0.25 + n.pulse * 0.7; ctx.fillStyle = pal.accent; rrect(ctx, n.x - 3, n.y - 3, 6, 6, 1); ctx.fill();
        } else {
          ctx.globalAlpha = 0.35 + n.pulse * 0.6; ctx.fillStyle = n.pulse > 0.1 ? pal.accent : pal.ink; dot(ctx, n.x, n.y, 2);
        }
      }
    },
  };
}

/* ---------- layout : maquette de site qui se construit ---------- */
function layout(W, H, rand, seed) {
  const CYCLE = 10;
  let built = -1, blocks = [], targets = [];
  const fx = W * 0.07, fy = H * 0.1, fw = W * 0.86, fh = H * 0.84;

  function build(k) {
    const r = rng(seed * 97 + k * 13 + 1);
    blocks = []; targets = [];
    const add = (b, d) => blocks.push({ ...b, d });
    const barH = fh * 0.1;
    add({ k: 'frame', x: fx, y: fy, w: fw, h: fh }, 0);
    for (let i = 0; i < 3; i++) add({ k: 'dot', x: fx + 14 + i * 12, y: fy + barH / 2, w: 0, h: 0 }, 0.1 + i * 0.05);
    const navN = 3 + Math.floor(r() * 2);
    for (let i = 0; i < navN; i++) {
      const w = fw * (0.06 + r() * 0.03), x = fx + fw - 16 - (navN - i) * (fw * 0.1);
      add({ k: 'pill', x, y: fy + barH * 0.32, w, h: barH * 0.36 }, 0.25 + i * 0.06);
      targets.push([x + w / 2, fy + barH / 2]);
    }
    add({ k: 'rule', x: fx, y: fy + barH, w: fw, h: 0 }, 0.3);

    // trois mises en page qui alternent d'un cycle à l'autre : le site « se redessine »
    const variant = (seed + k) % 3;
    if (variant === 0) {
      // accueil centré : accroche, (titre = nom du projet), bouton, rangée de cartes
      add({ k: 'line', x: fx + fw * 0.4, y: fy + fh * 0.27, w: fw * 0.2, h: 3 }, 0.55);
      const ctaW = fw * (0.14 + r() * 0.06), ctaX = r() < 0.5 ? fx + fw / 2 - ctaW / 2 : fx + fw * 0.08;
      add({ k: 'cta', x: ctaX, y: fy + fh * 0.64, w: ctaW, h: fh * 0.075 }, 0.75);
      targets.push([ctaX + ctaW / 2, fy + fh * 0.64 + fh * 0.0375]);
      const n = 3 + Math.floor(r() * 2), gap = fw * 0.025, cw = (fw - 32 - gap * (n - 1)) / n;
      for (let i = 0; i < n; i++) {
        const x = fx + 16 + i * (cw + gap), y = fy + fh * 0.76;
        add({ k: 'card', x, y, w: cw, h: fh * 0.2 }, 0.95 + i * 0.12);
        targets.push([x + cw / 2, y + fh * 0.1]);
      }
      if (r() < 0.7) add({ k: 'img', x: r() < 0.5 ? fx + fw * 0.8 : fx + fw * 0.05, y: fy + fh * 0.2, w: fw * 0.15, h: fh * 0.36 }, 0.65);
    } else if (variant === 1) {
      // page coupée en deux : texte à gauche, grande image à droite
      const left = r() < 0.5;
      const tx = left ? fx + 20 : fx + fw * 0.55, ix = left ? fx + fw * 0.52 : fx + 20;
      for (let i = 0; i < 3; i++) add({ k: 'text', x: tx, y: fy + fh * (0.22 + i * 0.07), w: fw * (0.36 - i * 0.07), h: 4 }, 0.5 + i * 0.1);
      add({ k: 'cta', x: tx, y: fy + fh * 0.48, w: fw * 0.14, h: fh * 0.075 }, 0.85);
      targets.push([tx + fw * 0.07, fy + fh * 0.52]);
      add({ k: 'img', x: ix, y: fy + fh * 0.18, w: fw * 0.43, h: fh * 0.74 }, 0.6);
      targets.push([ix + fw * 0.2, fy + fh * 0.5]);
      for (let i = 0; i < 3; i++) add({ k: 'text', x: tx, y: fy + fh * (0.7 + i * 0.06), w: fw * 0.3, h: 3 }, 1 + i * 0.08);
    } else {
      // galerie : grille de visuels
      add({ k: 'line', x: fx + 20, y: fy + fh * 0.2, w: fw * 0.18, h: 3 }, 0.5);
      const cols = 4, rows = 2, gap = fw * 0.02;
      const gw = (fw - 40 - gap * (cols - 1)) / cols, gh = fh * 0.3;
      for (let rI = 0; rI < rows; rI++) {
        for (let c = 0; c < cols; c++) {
          const x = fx + 20 + c * (gw + gap), y = fy + fh * 0.28 + rI * (gh + gap);
          add({ k: 'img', x, y, w: gw, h: gh * (rI === 0 && c % 2 ? 1 : 0.9) }, 0.55 + (rI * cols + c) * 0.08);
          if ((rI + c) % 3 === 0) targets.push([x + gw / 2, y + gh / 2]);
        }
      }
    }
  }

  const cur = { x: W * 0.5, y: H * 0.5, tx: 0, ty: 0, ti: -1, click: 0 };

  return {
    draw(ctx, t, pal) {
      const k = Math.floor(t / CYCLE), local = t - k * CYCLE;
      if (k !== built) { build(k); built = k; }
      const out = clamp((local - (CYCLE - 0.9)) / 0.9, 0, 1);
      for (const b of blocks) {
        const e = easeOutCubic(clamp((local - b.d) / 0.7, 0, 1)) * (1 - out);
        if (e <= 0) continue;
        ctx.lineWidth = 1;
        if (b.k === 'frame') {
          ctx.globalAlpha = 0.22 * e; ctx.strokeStyle = pal.ink; rrect(ctx, b.x, b.y, b.w, b.h * e, 10); ctx.stroke();
        } else if (b.k === 'dot') {
          ctx.globalAlpha = 0.4 * e; ctx.fillStyle = pal.ink; dot(ctx, b.x, b.y, 2.6);
        } else if (b.k === 'pill') {
          ctx.globalAlpha = 0.18 * e; ctx.fillStyle = pal.ink; rrect(ctx, b.x, b.y, b.w * e, b.h, 20); ctx.fill();
        } else if (b.k === 'rule') {
          ctx.globalAlpha = 0.16 * e; ctx.fillStyle = pal.ink; ctx.fillRect(b.x, b.y, b.w * e, 1);
        } else if (b.k === 'line') {
          ctx.globalAlpha = 0.5 * e; ctx.fillStyle = pal.accent; rrect(ctx, b.x + b.w * (1 - e) / 2, b.y, b.w * e, b.h, 2); ctx.fill();
        } else if (b.k === 'text') {
          ctx.globalAlpha = 0.2 * e; ctx.fillStyle = pal.ink; rrect(ctx, b.x, b.y, b.w * e, b.h, 2); ctx.fill();
        } else if (b.k === 'cta') {
          ctx.globalAlpha = 0.55 * e; ctx.fillStyle = pal.accent; rrect(ctx, b.x, b.y + (1 - e) * 8, b.w, b.h, b.h / 2); ctx.fill();
        } else if (b.k === 'card' || b.k === 'img') {
          const y = b.y + (1 - e) * 14;
          ctx.globalAlpha = 0.2 * e; ctx.strokeStyle = pal.ink; rrect(ctx, b.x, y, b.w, b.h, 6); ctx.stroke();
          ctx.globalAlpha = 0.15 * e; ctx.fillStyle = pal.accent;
          rrect(ctx, b.x + 4, y + 4, b.w - 8, (b.k === 'img' ? b.h : b.h * 0.55) - 8, 4); ctx.fill();
          if (b.k === 'card') {
            ctx.globalAlpha = 0.18 * e; ctx.fillStyle = pal.ink;
            rrect(ctx, b.x + 8, y + b.h * 0.64, (b.w - 16) * 0.7, 3, 2); ctx.fill();
            rrect(ctx, b.x + 8, y + b.h * 0.78, (b.w - 16) * 0.45, 3, 2); ctx.fill();
          }
        }
      }
      // reflet qui balaie la maquette une fois construite
      const sw = clamp((local - 2.2) / 2.4, 0, 1);
      if (sw > 0 && sw < 1) {
        const x = fx + sw * fw;
        const g = ctx.createLinearGradient(x - 80, 0, x + 80, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, pal.accent2); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = 0.08; ctx.fillStyle = g; ctx.fillRect(Math.max(fx, x - 80), fy, 160, fh);
      }
      // curseur qui navigue et clique
      if (local > 1.6 && out < 1 && targets.length) {
        const ti = Math.floor((local - 1.6) / 1.7) % targets.length;
        if (ti !== cur.ti) { cur.ti = ti; [cur.tx, cur.ty] = targets[(ti * 3 + built) % targets.length]; }
        cur.x += (cur.tx - cur.x) * 0.06; cur.y += (cur.ty - cur.y) * 0.06;
        const near = Math.hypot(cur.tx - cur.x, cur.ty - cur.y) < 2;
        if (near && cur.click <= 0) cur.click = 1;
        if (!near && cur.click < 0.05) cur.click = 0;
        ctx.globalAlpha = 0.9 * (1 - out); ctx.fillStyle = pal.ink;
        ctx.beginPath(); ctx.moveTo(cur.x, cur.y); ctx.lineTo(cur.x, cur.y + 15); ctx.lineTo(cur.x + 4, cur.y + 11); ctx.lineTo(cur.x + 10, cur.y + 11); ctx.closePath(); ctx.fill();
        if (cur.click > 0.02) {
          ctx.globalAlpha = cur.click * 0.6; ctx.strokeStyle = pal.accent;
          ctx.beginPath(); ctx.arc(cur.x, cur.y, 4 + (1 - cur.click) * 18, 0, TAU); ctx.stroke();
          cur.click *= 0.93;
        }
      }
    },
  };
}

/* ---------- chart : séries temporelles ---------- */
function chart(W, H, rand) {
  const ph = [rand() * TAU, rand() * TAU, rand() * TAU];
  const series = (x, t, k) => H * (0.55 + 0.16 * Math.sin(x * 0.011 + t * 0.5 + ph[k]) + 0.07 * Math.sin(x * 0.029 - t * 0.9 + ph[k] * 2) - k * 0.12);
  return {
    draw(ctx, t, pal) {
      ctx.lineWidth = 1; ctx.strokeStyle = pal.ink;
      for (let i = 1; i < 5; i++) { ctx.globalAlpha = 0.07; ctx.beginPath(); ctx.moveTo(0, H * i / 5); ctx.lineTo(W, H * i / 5); ctx.stroke(); }
      const step = 8;
      // aire sous la première série
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W + step; x += step) ctx.lineTo(x, series(x, t, 0));
      ctx.lineTo(W, H); ctx.closePath();
      ctx.globalAlpha = 0.12; ctx.fillStyle = pal.accent; ctx.fill();
      [[0, pal.accent, 2, 0.85], [1, pal.accent2, 1.3, 0.6]].forEach(([k, c, lw, a]) => {
        ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath();
        for (let x = 0; x <= W + step; x += step) (x ? ctx.lineTo(x, series(x, t, k)) : ctx.moveTo(x, series(x, t, k)));
        ctx.stroke();
      });
      // curseur de lecture
      const x = (t * 70) % (W + 120) - 60, y = series(x, t, 0);
      ctx.globalAlpha = 0.25; ctx.strokeStyle = pal.ink; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = pal.accent; dot(ctx, x, y, 3.5);
      ctx.globalAlpha = 0.3; dot(ctx, x, y, 8);
    },
  };
}

export const SCENES = { flow, network, layout, chart };
