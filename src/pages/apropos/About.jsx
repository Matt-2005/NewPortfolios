import { useEffect, useRef, useState } from 'react';
import { clamp, coarse, lerp, onFrame, reduce } from '../../lib/motion';
import { useLang } from '../../i18n/lang';

const DEV = import.meta.env.DEV;

const PORTRAIT = '/media/portrait.jpg';

/* Portrait — la photo reste toujours entière et lisible :
   1. dévoilement unique au premier passage (rideau + léger recul)
   2. parallaxe interne très douce au scroll
   3. au survol : inclinaison de quelques degrés + reflet qui suit le curseur */
function Portrait() {
  const { t } = useLang();
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
            ? <img className="portrait-img" src={PORTRAIT} alt={t('Portrait de Matthew LE', 'Portrait of Matthew LE')} />
            : DEV && <span className="ph-tag">portrait — public/media/portrait.jpg</span>}
          <span className="portrait-glare" aria-hidden="true" />
        </div>
        <span className="portrait-corners" aria-hidden="true"><i /><i /><i /><i /></span>
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useLang();
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div>
            <p className="about-lead reveal">{t(
              <>Bonjour, je suis <em>Matthew LE</em>, étudiant en 4e année à SUPINFO Lyon (Master of Engineering, Ingénierie Data) et alternant développeur & <span className="hl">ingénieur BI</span> à la SNCF. Mon objectif : devenir <span className="hl">data engineer</span> en <span className="hl">Suisse</span>, construire des flux de données fiables et les rendre utiles à ceux qui décident.</>,
              <>Hi, I'm <em>Matthew LE</em>, a fourth-year student at SUPINFO Lyon (Master of Engineering, Data Engineering) and a work-study developer & <span className="hl">BI engineer</span> at SNCF. My goal: becoming a <span className="hl">data engineer</span> in <span className="hl">Switzerland</span>, building reliable data flows and making them useful to decision-makers.</>
            )}</p>
            <p className="about-body reveal" data-d="1">{t(
              <>Un an d'alternance dans deux grands groupes — ingénieur DevOps chez VICAT, puis développeur et ingénieur BI à la SNCF — m'a appris ce que demande un système d'information de grande taille&nbsp;: comprendre l'existant, documenter, tester, ne rien casser. Avant ça, il y a eu le web, avec la cofondation de WebDesign&amp;Co, et la vidéo&nbsp;: montage et drone FPV.</>,
              <>A year of work-study in two large groups — DevOps engineer at VICAT, then developer and BI engineer at SNCF — taught me what large information systems demand: understand what exists, document, test, break nothing. Before that came the web, co-founding WebDesign&amp;Co, and video: editing and FPV drone flying.</>
            )}</p>
            <p className="about-body reveal" data-d="2">{t(
              <>Je parle français et russe (langues maternelles) ainsi qu'anglais, et je vise un premier poste en Suisse à la fin de mon Master, en 2028.</>,
              <>I'm a native speaker of French and Russian, I also speak English, and I'm aiming for a first role in Switzerland after my Master's, in 2028.</>
            )}</p>
          </div>
          <div className="about-portrait">
            <Portrait />
            <div className="badge"><span>EST. 2005</span><span>LYON · 45.76°N</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
