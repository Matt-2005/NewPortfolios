import { useEffect, useRef, useState } from 'react';
import { clamp, coarse, lerp, onFrame, reduce } from '../../lib/motion';

const PORTRAIT = '/media/portrait.jpg';

/* Portrait — la photo reste toujours entière et lisible :
   1. dévoilement unique au premier passage (rideau + léger recul)
   2. parallaxe interne très douce au scroll
   3. au survol : inclinaison de quelques degrés + reflet qui suit le curseur */
function Portrait() {
  const stageRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [inView, setInView] = useState(reduce);

  useEffect(() => {
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = PORTRAIT;
    return () => { on = false; };
  }, []);

  /* dévoilement : une seule fois */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* parallaxe + inclinaison + reflet (valeurs lissées) */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, hov = 0, hovT = 0, mx = 50, my = 40;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width, 0, 1) - 0.5;
      ty = clamp((e.clientY - r.top) / r.height, 0, 1) - 0.5;
      hovT = 1;
    };
    const onLeave = () => { tx = 0; ty = 0; hovT = 0; };
    if (!coarse) {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    }
    const off = onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -80 || r.top > vh + 80) return;
      const prog = clamp((vh - r.top) / (vh + r.height), 0, 1); // 0 → 1 pendant la traversée
      cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08); hov = lerp(hov, hovT, 0.08);
      mx = 50 + cx * 100; my = 50 + cy * 100;
      el.style.setProperty('--py', ((prog - 0.5) * -7).toFixed(2) + '%');
      el.style.setProperty('--rx', (-cy * 5).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (cx * 6).toFixed(2) + 'deg');
      el.style.setProperty('--mx', mx.toFixed(1) + '%');
      el.style.setProperty('--my', my.toFixed(1) + '%');
      el.style.setProperty('--hov', hov.toFixed(3));
    });
    return () => {
      off();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={'portrait-stage' + (hasPhoto ? ' has-photo' : '') + (inView ? ' in' : '')}
    >
      <div className="portrait-tilt">
        <div className="portrait-clip">
          {hasPhoto
            ? <img className="portrait-img" src={PORTRAIT} alt="Portrait de Matthew LE" />
            : <span className="ph-tag">portrait — public/media/portrait.jpg</span>}
          <span className="portrait-glare" aria-hidden="true" />
        </div>
        <span className="portrait-corners" aria-hidden="true"><i /><i /><i /><i /></span>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div>
            <p className="about-lead reveal">Bienvenue. Je suis <em>Matthew LE</em>, étudiant en informatique basé à <span className="hl">Genève</span>, en <span className="hl">Suisse</span>. Je construis des choses qui doivent tenir en l'air — du code propre aux lignes de vol d'un drone.</p>
            <p className="about-body reveal" data-d="1">Le développement web et le design interactif sont mon terrain de jeu, mais ma façon de penser vient d'ailleurs&nbsp;: du cadrage d'un montage vidéo, de la trajectoire d'une moto en courbe, du calme qu'il faut pour piloter en FPV. La même rigueur, le même goût du détail, le même instinct du mouvement — appliqués à l'écran.</p>
          </div>
          <div className="about-portrait">
            <Portrait />
            <div className="badge"><span>EST. 2005</span><span>GENÈVE · 46.20°N</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
