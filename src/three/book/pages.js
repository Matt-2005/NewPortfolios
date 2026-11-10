/* ============================================================
   PAGES DU LIVRE — chaque face est dessinée dans un canvas 2D
   (puis plaquée en texture sur la page 3D).
   Le contenu vient des fichiers data/ : il suit la langue du site.

   Une face = { side, dark, animated, paint(ctx, time), hotspots }
   hotspots : zones cliquables en px de page
              { x, y, w, h, action: { type, … } }
   ============================================================ */
import { SCENES, rng } from '../../lib/scenes';
import { findProject, logoFor, motionFor } from '../../data/projects';
import { FACTS, PROFILE } from '../../data/profile';
import { SKILLS } from '../../data/content';

export const PW = 1400, PH = 1030; // taille d'une page en px (ratio de la page 3D)

const SANS = '"Schibsted Grotesk", system-ui, sans-serif';
const SERIF = '"Instrument Serif", Georgia, serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const C = {
  paper: '#f1ede4', ink: '#15161b', soft: '#5d6068', faint: '#9a9ca3',
  accent: '#3552e0', line: 'rgba(21,22,27,0.14)',
  dark: '#0d0f14', on: '#ecebe4', onSoft: 'rgba(236,235,228,0.62)',
};

/* ---------- petits outils de dessin ---------- */
function setFont(ctx, family, size, weight = 400, style = 'normal') {
  ctx.font = `${style} ${weight} ${size}px ${family}`;
}
function spacing(ctx, px) { try { ctx.letterSpacing = px + 'px'; } catch (e) { /* non supporté */ } }
function txt(ctx, s, x, y, { family = SANS, size = 24, weight = 400, style = 'normal', color = C.ink, align = 'left', ls = 0 } = {}) {
  setFont(ctx, family, size, weight, style); spacing(ctx, ls);
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
  const w = ctx.measureText(s).width;
  spacing(ctx, 0);
  return w;
}
/* texte sur plusieurs lignes ; renvoie l'ordonnée sous le bloc */
function wrap(ctx, s, x, y, maxW, lh, opts = {}) {
  setFont(ctx, opts.family || SANS, opts.size || 24, opts.weight || 400, opts.style || 'normal');
  const words = String(s).split(/\s+/);
  let line = '', lines = 0;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      txt(ctx, line, x, y, opts); y += lh; line = w; lines++;
      if (opts.maxLines && lines >= opts.maxLines) return y;
    } else line = test;
  }
  if (line) { txt(ctx, line, x, y, opts); y += lh; }
  return y;
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function arrow(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s, y); ctx.moveTo(x + s * 0.6, y - s * 0.38); ctx.lineTo(x + s, y); ctx.lineTo(x + s * 0.6, y + s * 0.38); ctx.stroke();
}

/* grain du papier, généré une fois */
let grain = null;
function grainCanvas() {
  if (grain) return grain;
  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return grain;
}

/* fond papier + ombre de reliure côté dos + en-tête courant */
function paper(ctx, side, pageNo, t) {
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, PW, PH);
  ctx.globalAlpha = 0.05; ctx.fillStyle = ctx.createPattern(grainCanvas(), 'repeat'); ctx.fillRect(0, 0, PW, PH); ctx.globalAlpha = 1;
  const spine = side === 'left' ? PW : 0;
  const g = ctx.createLinearGradient(spine, 0, side === 'left' ? PW - 170 : 170, 0);
  g.addColorStop(0, 'rgba(40,30,20,0.22)'); g.addColorStop(1, 'rgba(40,30,20,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH);
  const mx = side === 'left' ? 90 : 120;
  txt(ctx, t('MATTHEW LE — PORTFOLIO', 'MATTHEW LE — PORTFOLIO'), mx, 74, { family: MONO, size: 17, color: C.faint, ls: 2 });
  if (pageNo != null) txt(ctx, String(pageNo).padStart(2, '0'), side === 'left' ? 90 : PW - 90, PH - 58, { family: MONO, size: 18, color: C.faint, align: side === 'left' ? 'left' : 'right' });
  ctx.fillStyle = C.line; ctx.fillRect(mx, 96, PW - mx - (side === 'left' ? 120 : 90), 1.5);
}

function chips(ctx, labels, x, y, maxW, dark = false) {
  let cx = x, cy = y;
  for (const l of labels) {
    setFont(ctx, MONO, 17, 500); spacing(ctx, 1);
    const w = ctx.measureText(l.toUpperCase()).width + 30;
    spacing(ctx, 0);
    if (cx + w > x + maxW) { cx = x; cy += 50; }
    rr(ctx, cx, cy, w, 38, 19); ctx.strokeStyle = dark ? 'rgba(236,235,228,0.3)' : 'rgba(21,22,27,0.28)'; ctx.lineWidth = 1.5; ctx.stroke();
    txt(ctx, l.toUpperCase(), cx + 15, cy + 25, { family: MONO, size: 17, weight: 500, color: dark ? C.onSoft : C.soft, ls: 1 });
    cx += w + 10;
  }
  return cy + 38;
}

/* bouton plein ; renvoie sa zone cliquable */
function button(ctx, label, x, y, action, { dark = false } = {}) {
  setFont(ctx, SANS, 26, 600);
  const w = ctx.measureText(label).width + 110, h = 66;
  rr(ctx, x, y, w, h, 33); ctx.fillStyle = dark ? C.on : C.ink; ctx.fill();
  ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 6, 0, Math.PI * 2); ctx.fill();
  txt(ctx, label, x + 56, y + 42, { size: 26, weight: 600, color: dark ? C.ink : C.paper });
  arrow(ctx, x + w - 44, y + h / 2, 20, dark ? C.ink : C.paper);
  return { x, y, w, h, action };
}

/* ---------- les faces ---------- */

function cover(t) {
  return {
    side: 'right', dark: true,
    paint(ctx) {
      ctx.fillStyle = '#121419'; ctx.fillRect(0, 0, PW, PH);
      ctx.globalAlpha = 0.07; ctx.fillStyle = ctx.createPattern(grainCanvas(), 'repeat'); ctx.fillRect(0, 0, PW, PH); ctx.globalAlpha = 1;
      const g = ctx.createRadialGradient(PW * 0.78, PH * 0.2, 10, PW * 0.78, PH * 0.2, PW * 0.7);
      g.addColorStop(0, 'rgba(80,105,255,0.22)'); g.addColorStop(1, 'rgba(80,105,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH);
      ctx.strokeStyle = 'rgba(236,235,228,0.16)'; ctx.lineWidth = 2; rr(ctx, 46, 46, PW - 92, PH - 92, 10); ctx.stroke();
      // monogramme gravé (ombre + reflet)
      txt(ctx, 'ML', PW / 2 + 3, PH * 0.56 + 4, { family: SERIF, style: 'italic', size: 360, color: 'rgba(0,0,0,0.55)', align: 'center' });
      txt(ctx, 'ML', PW / 2, PH * 0.56, { family: SERIF, style: 'italic', size: 360, color: C.on, align: 'center' });
      txt(ctx, 'MATTHEW LE', PW / 2, PH * 0.7, { family: MONO, size: 30, color: C.on, align: 'center', ls: 12 });
      txt(ctx, t('Data Engineer · BI', 'Data Engineer · BI'), PW / 2, PH * 0.77, { family: SERIF, style: 'italic', size: 50, color: '#8fa0ff', align: 'center' });
      txt(ctx, t('PORTFOLIO — 2026', 'PORTFOLIO — 2026'), PW / 2, PH - 100, { family: MONO, size: 20, color: C.onSoft, align: 'center', ls: 6 });
    },
    hotspots: [],
  };
}

function contents(t, entries) {
  const hs = [];
  return {
    side: 'left',
    paint(ctx) {
      paper(ctx, 'left', 1, t);
      txt(ctx, t('Sommaire', 'Contents'), 90, 250, { family: SERIF, style: 'italic', size: 130 });
      txt(ctx, t('Cliquez sur une ligne pour y aller.', 'Click a line to jump there.'), 94, 305, { size: 24, color: C.soft });
      hs.length = 0;
      entries.forEach((e, i) => {
        const y = 400 + i * 96;
        ctx.fillStyle = C.line; ctx.fillRect(90, y - 54, PW - 210, 1.5);
        txt(ctx, String(i + 1).padStart(2, '0'), 94, y, { family: MONO, size: 22, color: C.accent });
        const w = txt(ctx, e.title, 160, y, { size: 38, weight: 600, ls: -0.5 });
        if (e.sub) txt(ctx, e.sub, 160 + w + 18, y, { family: SERIF, style: 'italic', size: 34, color: C.soft });
        txt(ctx, String(e.page).padStart(2, '0'), PW - 120, y, { family: MONO, size: 22, color: C.soft, align: 'right' });
        hs.push({ x: 80, y: y - 52, w: PW - 190, h: 84, action: { type: 'goto', spread: e.spread } });
      });
    },
    hotspots: hs,
  };
}

function profile(t) {
  const pick = ['Expérience', 'Formation', 'Langues', 'Statut', 'Localisation', 'Disponibilité'];
  const facts = pick.map(k => FACTS.find(f => f.k.fr === k)).filter(Boolean);
  return {
    side: 'right',
    paint(ctx) {
      paper(ctx, 'right', 2, t);
      txt(ctx, 'Matthew LE', 120, 240, { size: 96, weight: 800, ls: -3 });
      txt(ctx, t('Data Engineer · BI', 'Data Engineer · BI'), 124, 312, { family: SERIF, style: 'italic', size: 60, color: C.accent });
      let y = wrap(ctx, t(
        'Étudiant en Master of Engineering (Ingénierie Data) à SUPINFO Lyon, alternant développeur & ingénieur BI à la SNCF. Je cherche mon premier poste en Suisse pour 2028.',
        'Master of Engineering student (Data Engineering) at SUPINFO Lyon, work-study developer & BI engineer at SNCF. Looking for my first role in Switzerland in 2028.'
      ), 124, 390, PW - 260, 38, { size: 27, color: C.soft });
      y += 24;
      const colW = (PW - 260) / 2;
      facts.forEach((f, i) => {
        const x = 124 + (i % 2) * (colW + 20), yy = y + Math.floor(i / 2) * 150;
        ctx.fillStyle = C.line; ctx.fillRect(x, yy, colW - 20, 1.5);
        txt(ctx, t(f.k).toUpperCase(), x, yy + 36, { family: MONO, size: 16, color: C.faint, ls: 2 });
        wrap(ctx, t(f.v), x, yy + 74, colW - 40, 31, { size: 23, color: f.accent ? C.accent : C.ink, maxLines: 3 });
      });
    },
    hotspots: [],
  };
}

/* page illustrée : la scène animée du projet + son logo */
function visual(t, id, no, pageNo) {
  const p = findProject(id);
  const [scene, seed, accent] = motionFor(p);
  const logo = logoFor(p);
  const fx = 70, fy = 130, fw = PW - 140, fh = PH - 250;
  const inst = SCENES[scene] ? SCENES[scene](fw, fh, rng(seed), seed) : null;
  const face = {
    side: 'left', dark: true, animated: !!inst, logoSrc: logo && logo.src, logoTone: logo && logo.tone,
    logoImg: null,
    paint(ctx, time = 6.5) {
      ctx.fillStyle = C.dark; ctx.fillRect(0, 0, PW, PH);
      const g1 = ctx.createRadialGradient(PW * 0.82, PH * 0.18, 10, PW * 0.82, PH * 0.18, PW * 0.6);
      g1.addColorStop(0, 'rgba(70,95,255,0.32)'); g1.addColorStop(1, 'rgba(70,95,255,0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, PW, PH);
      const g2 = ctx.createRadialGradient(PW * 0.1, PH * 0.9, 10, PW * 0.1, PH * 0.9, PW * 0.5);
      g2.addColorStop(0, 'rgba(40,190,210,0.18)'); g2.addColorStop(1, 'rgba(40,190,210,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, PW, PH);
      txt(ctx, `${no} — ${p.company || t(p.name).join('')}`.toUpperCase(), 70, 82, { family: MONO, size: 19, color: C.onSoft, ls: 3 });
      if (p.period) txt(ctx, t(p.period), PW - 120, 82, { family: MONO, size: 19, color: C.onSoft, align: 'right' });
      if (inst) {
        ctx.save(); ctx.translate(fx, fy);
        ctx.beginPath(); ctx.rect(0, 0, fw, fh); ctx.clip();
        inst.draw(ctx, time, {
          ink: C.on, accent: accent || '#5a74ff', accent2: '#3cc6d8', bg: C.dark, lightSurface: false,
          logo: face.logoImg ? { img: face.logoImg, tone: face.logoTone } : null,
        });
        ctx.restore(); ctx.globalAlpha = 1;
      }
      txt(ctx, t(p.kind).toUpperCase(), 70, PH - 62, { family: MONO, size: 17, color: C.onSoft, ls: 2 });
      txt(ctx, String(pageNo).padStart(2, '0'), PW - 120, PH - 62, { family: MONO, size: 18, color: C.onSoft, align: 'right' });
    },
    hotspots: [],
  };
  return face;
}

/* page de texte d'un projet ; `extra` : liste de sous-projets cliquables */
function projectText(t, id, pageNo, extra = null) {
  const p = findProject(id);
  const hs = [];
  return {
    side: 'right',
    paint(ctx) {
      paper(ctx, 'right', pageNo, t);
      hs.length = 0;
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(128, 170, 7, 0, Math.PI * 2); ctx.fill();
      txt(ctx, t(p.kind).toUpperCase(), 148, 177, { family: MONO, size: 18, color: C.soft, ls: 2 });
      const name = t(p.name);
      let x = txt(ctx, name[0], 120, 272, { size: 78, weight: 800, ls: -2 });
      txt(ctx, name[1], 120 + x, 272, { family: SERIF, style: 'italic', size: 80, color: C.accent });
      txt(ctx, [p.company, p.place && t(p.place), p.period && t(p.period)].filter(Boolean).join('  ·  '), 122, 322, { family: MONO, size: 19, color: C.faint });
      let y = wrap(ctx, t(p.meta), 122, 386, PW - 250, 36, { size: 25, color: C.soft, maxLines: extra ? 4 : 5 });
      y += 16;
      if (extra) {
        txt(ctx, t('SITES RÉALISÉS', 'WEBSITES DELIVERED'), 122, y + 10, { family: MONO, size: 16, color: C.faint, ls: 2 });
        y += 34;
        extra.forEach(e => {
          ctx.fillStyle = C.line; ctx.fillRect(122, y, PW - 250, 1.5);
          if (e.img && e.img.naturalWidth) {
            const ar = e.img.naturalWidth / e.img.naturalHeight, h = 46, w = Math.min(h * ar, 110);
            if (e.tone === 'light') { rr(ctx, 122, y + 14, w + 16, h + 12, 8); ctx.fillStyle = C.dark; ctx.fill(); }
            ctx.drawImage(e.img, 130, y + 20, w, w / ar);
          }
          txt(ctx, e.title, 270, y + 52, { size: 30, weight: 600 });
          txt(ctx, e.sub, 270 + 10 + ctx.measureText(e.title).width + 12, y + 52, { family: SERIF, style: 'italic', size: 28, color: C.soft });
          arrow(ctx, PW - 170, y + 42, 22, C.ink);
          hs.push({ x: 112, y, w: PW - 230, h: 76, action: { type: 'go', to: '/projets/' + e.id } });
          y += 76;
        });
        y += 10;
      } else if (p.detail && p.detail.missions) {
        txt(ctx, t('MISSIONS CLÉS', 'KEY MISSIONS'), 122, y + 10, { family: MONO, size: 16, color: C.faint, ls: 2 });
        y += 50;
        p.detail.missions.slice(0, 4).forEach((m, i) => {
          txt(ctx, String(i + 1).padStart(2, '0'), 122, y, { family: MONO, size: 19, color: C.accent });
          txt(ctx, t(m.title), 170, y, { size: 26, weight: 600 });
          y += 44;
        });
        y += 8;
      }
      chips(ctx, p.tags.map(tag => t(tag)), 122, Math.min(y, PH - 230), PW - 250);
      hs.push(button(ctx, t('Voir le détail', 'See details'), 122, PH - 150, { type: 'go', to: '/projets/' + p.id }));
    },
    hotspots: hs,
  };
}

function skills(t, pageNo) {
  return {
    side: 'left',
    paint(ctx) {
      paper(ctx, 'left', pageNo, t);
      txt(ctx, t('Compétences', 'Skills'), 90, 230, { family: SERIF, style: 'italic', size: 110 });
      const colW = (PW - 210) / 2;
      SKILLS.forEach((s, i) => {
        const x = 90 + (i % 2) * (colW + 30), y = 320 + Math.floor(i / 2) * 330;
        ctx.fillStyle = C.line; ctx.fillRect(x, y, colW - 30, 1.5);
        txt(ctx, t(s.title), x, y + 54, { size: 34, weight: 700, ls: -0.5 });
        const yy = wrap(ctx, t(s.desc), x, y + 100, colW - 50, 32, { size: 22, color: C.soft, maxLines: 3 });
        chips(ctx, s.chips.map(c => t(c)), x, yy + 4, colW - 40);
      });
    },
    hotspots: [],
  };
}

function contact(t, pageNo) {
  const hs = [];
  const linkedin = PROFILE.socials.find(s => s.label === 'LinkedIn');
  return {
    side: 'right',
    paint(ctx) {
      paper(ctx, 'right', pageNo, t);
      hs.length = 0;
      const w = txt(ctx, t('Parlons', "Let's talk"), 120, 270, { size: 120, weight: 800, ls: -4 });
      txt(ctx, 'data', 120 + w + 26, 270, { family: SERIF, style: 'italic', size: 124, color: C.accent });
      wrap(ctx, t(
        'Recruteur, manager ou équipe data en Suisse ? Je suis ouvert aux échanges dès maintenant, et à un premier poste à la fin de mon Master, en 2028.',
        "Recruiter, hiring manager or data team in Switzerland? I'm happy to talk now, and I'm looking for a first role after my Master's, in 2028."
      ), 124, 350, PW - 260, 38, { size: 27, color: C.soft });
      const rows = [
        [t('EMAIL', 'EMAIL'), PROFILE.email, { type: 'href', href: 'mailto:' + PROFILE.email }],
        [t('TÉLÉPHONE', 'PHONE'), PROFILE.phone, { type: 'href', href: PROFILE.phoneHref }],
        linkedin && linkedin.url ? ['LINKEDIN', linkedin.url.replace(/^https?:\/\/(www\.)?/, ''), { type: 'link', href: linkedin.url }] : null,
      ].filter(Boolean);
      let y = 500;
      rows.forEach(([k, v, action]) => {
        ctx.fillStyle = C.line; ctx.fillRect(124, y, PW - 250, 1.5);
        txt(ctx, k, 124, y + 50, { family: MONO, size: 17, color: C.faint, ls: 2 });
        txt(ctx, v, 380, y + 52, { size: 32, weight: 500 });
        arrow(ctx, PW - 170, y + 42, 22, C.ink);
        hs.push({ x: 114, y, w: PW - 230, h: 80, action });
        y += 80;
      });
      hs.push(button(ctx, t('Continuer vers le site', 'Continue to the site'), 124, PH - 170, { type: 'site' }));
      setFont(ctx, SANS, 26, 600);
      const bw = ctx.measureText(t('Continuer vers le site', 'Continue to the site')).width + 110;
      const cw = txt(ctx, t('Refermer le livre', 'Close the book'), 124 + bw + 40, PH - 126, { family: MONO, size: 19, color: C.soft, ls: 1 });
      hs.push({ x: 124 + bw + 30, y: PH - 168, w: cw + 20, h: 66, action: { type: 'close' } });
    },
    hotspots: hs,
  };
}

/* ---------- assemblage du livre ----------
   faces dans l'ordre de lecture : 0 = couverture, puis doubles pages
   (gauche, droite)… ; la dernière face est l'intérieur du 4e de couverture. */
export function buildFaces(t) {
  const spreadOf = faceIndex => Math.ceil(faceIndex / 2); // face → double page
  const wdc = findProject('webdesignco');
  const clients = ['hola-la-deco', 'thermipose', 'geae-batiment'].map(findProject).filter(Boolean);
  const sncf = findProject('sncf'), vicat = findProject('vicat');
  const entries = [
    { title: t('Profil', 'Profile'), sub: t('en bref', 'at a glance'), page: 2, spread: spreadOf(2) },
    { title: 'SNCF', sub: t(sncf.name).join(''), page: 3, spread: spreadOf(3) },
    { title: 'VICAT', sub: t(vicat.name).join(''), page: 5, spread: spreadOf(5) },
    { title: 'WebDesign&Co', sub: t(wdc.name).join(''), page: 7, spread: spreadOf(7) },
    { title: t('Compétences', 'Skills'), sub: '', page: 9, spread: spreadOf(9) },
    { title: 'Contact', sub: t('parlons data', "let's talk data"), page: 10, spread: spreadOf(10) },
  ];
  const extra = clients.map(c => {
    const lg = logoFor(c);
    return { id: c.id, title: t(c.name).join('').trim(), sub: c.period ? t(c.period) : '', src: lg && lg.src, tone: lg && lg.tone, img: null };
  });
  return [
    cover(t),
    contents(t, entries),
    profile(t),
    visual(t, 'sncf', '01', 3),
    projectText(t, 'sncf', 4),
    visual(t, 'vicat', '02', 5),
    projectText(t, 'vicat', 6),
    visual(t, 'webdesignco', '03', 7),
    Object.assign(projectText(t, 'webdesignco', 8, extra), { extraImages: extra }),
    skills(t, 9),
    contact(t, 10),
  ];
}

/* polices du site : on attend qu'elles soient prêtes avant de dessiner */
export function loadPageFonts() {
  if (!document.fonts) return Promise.resolve();
  return Promise.all([
    document.fonts.load(`800 40px ${SANS}`), document.fonts.load(`600 40px ${SANS}`), document.fonts.load(`400 40px ${SANS}`),
    document.fonts.load(`italic 400 40px ${SERIF}`), document.fonts.load(`400 40px ${MONO}`), document.fonts.load(`500 40px ${MONO}`),
  ]).catch(() => {});
}
