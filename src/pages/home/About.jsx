import { useEffect, useRef, useState } from 'react';
import { reduce } from '../../lib/motion';

const PORTRAIT = '/media/portrait.jpg';
const COLS = 4, ROWS = 5, GAP = 5;

/* Portrait en taquin : un carré est retiré, les tuiles glissent
   vers le vide toutes les 1,7 s. */
function PortraitPuzzle() {
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = PORTRAIT;
    return () => { on = false; };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = '';
    const cells = COLS * ROWS;
    const emptyStart = cells - 1; // carré retiré : bas-droite
    let W = 0, H = 0, cw = 0, ch = 0;

    const grid = new Array(cells).fill(null);
    const tiles = [];
    for (let idx = 0; idx < cells; idx++) {
      if (idx === emptyStart) continue;
      const t = document.createElement('span');
      t.className = 'pz-tile';
      const tile = { el: t, oc: idx % COLS, or: Math.floor(idx / COLS), cell: idx };
      tiles.push(tile);
      grid[idx] = tile;
      host.appendChild(t);
    }
    let emptyCell = emptyStart;

    function place(t, animate) {
      const c = t.cell % COLS, r = Math.floor(t.cell / COLS);
      t.el.style.width = (cw - GAP) + 'px';
      t.el.style.height = (ch - GAP) + 'px';
      t.el.style.backgroundSize = W + 'px ' + H + 'px';
      t.el.style.backgroundPosition = '-' + (t.oc * cw + GAP / 2).toFixed(1) + 'px -' + (t.or * ch + GAP / 2).toFixed(1) + 'px';
      const tx = (c * cw + GAP / 2).toFixed(1) + 'px';
      const tyy = (r * ch + GAP / 2).toFixed(1) + 'px';
      if (!animate) {
        const prev = t.el.style.transition;
        t.el.style.transition = 'none';
        t.el.style.transform = 'translate(' + tx + ',' + tyy + ')';
        void t.el.offsetHeight;
        t.el.style.transition = prev;
      } else {
        t.el.style.transform = 'translate(' + tx + ',' + tyy + ')';
      }
    }
    function layout() {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height; cw = W / COLS; ch = H / ROWS;
      tiles.forEach(t => place(t, false));
    }
    layout();
    window.addEventListener('resize', layout);

    function slide() {
      const ec = emptyCell % COLS, er = Math.floor(emptyCell / COLS);
      const cands = [];
      if (er > 0) cands.push(emptyCell - COLS);
      if (er < ROWS - 1) cands.push(emptyCell + COLS);
      if (ec > 0) cands.push(emptyCell - 1);
      if (ec < COLS - 1) cands.push(emptyCell + 1);
      const from = cands[Math.floor(Math.random() * cands.length)];
      const t = grid[from];
      if (!t) return;
      grid[emptyCell] = t; grid[from] = null;
      t.cell = emptyCell; emptyCell = from;
      place(t, true);
    }

    let timer = null;
    if (!reduce) timer = setInterval(slide, 1700);

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener('resize', layout);
      host.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={'portrait-stage' + (hasPhoto ? ' has-photo' : '')}
      style={{ '--portrait': `url('${PORTRAIT}')` }}
    >
      <div className="portrait-puzzle" ref={hostRef} />
      {!hasPhoto && <span className="ph-tag">portrait — public/media/portrait.jpg</span>}
    </div>
  );
}

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="line-mask"><span>À propos <em>— qui je suis</em></span></h2>
          <span className="num reveal">(02) — Le pilote</span>
        </div>
        <div className="about-grid">
          <div>
            <p className="about-lead reveal">Bienvenue. Je suis <em>Matthew LE</em>, étudiant en informatique basé à <span className="hl">Genève</span>, en <span className="hl">Suisse</span>. Je construis des choses qui doivent tenir en l'air — du code propre aux lignes de vol d'un drone.</p>
            <p className="about-body reveal" data-d="1">Le développement web et le design interactif sont mon terrain de jeu, mais ma façon de penser vient d'ailleurs&nbsp;: du cadrage d'un montage vidéo, de la trajectoire d'une moto en courbe, du calme qu'il faut pour piloter en FPV. La même rigueur, le même goût du détail, le même instinct du mouvement — appliqués à l'écran.</p>
          </div>
          <div className="about-portrait reveal" data-d="2">
            <PortraitPuzzle />
            <div className="badge"><span>EST. 2005</span><span>GENÈVE · 46.20°N</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
