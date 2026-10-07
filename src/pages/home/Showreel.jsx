import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, easeOutCubic, onFrame, reduce, smooth } from '../../lib/motion';
import { createFlight } from '../../lib/flight';
import { startScroll, stopScroll } from '../../lib/scroller';

const VIDEO_SRC = '/media/immersive.mp4';

/* ============================================================
   SHOWREEL — la vidéo n'est pas « traversée », elle est DÉVOILÉE.
   Elle attend, épinglée sous la page : la feuille du manifeste
   se soulève et la découvre, elle respire plein cadre le temps
   d'un titre, puis la feuille suivante vient la recouvrir.
   La lecture est continue (boucle muette), jamais scrubbée.

   u = défilement dans la piste, en hauteurs d'écran :
   0 → 1        dévoilement (la feuille du dessus part)
   1 → TOTAL-2  plein cadre, titre
   TOTAL-2 → -1 recouvrement par la section suivante
   ============================================================ */
export default function Showreel() {
  const [hasVideo, setHasVideo] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const shadeRef = useRef(null);
  const copyRef = useRef(null);
  const metaRef = useRef(null);
  const tcRef = useRef(null);
  const lbRef = useRef(false);
  lbRef.current = lightbox;

  /* — vidéo réelle si le fichier existe (sinon : vol procédural) — */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let on = true;
    fetch(VIDEO_SRC, { method: 'HEAD' })
      .then(r => {
        const type = r.headers.get('content-type') || '';
        if (on && r.ok && !type.includes('text/html')) video.src = VIDEO_SRC;
      })
      .catch(() => {});
    const onMeta = () => { if (on && video.duration && isFinite(video.duration)) setHasVideo(true); };
    const onErr = () => { if (on) setHasVideo(false); };
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('error', onErr);
    return () => {
      on = false;
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('error', onErr);
    };
  }, []);

  /* — moteur : dévoilement / respiration / recouvrement — */
  useEffect(() => {
    const track = trackRef.current;
    const media = mediaRef.current, video = videoRef.current, canvas = canvasRef.current;
    const flight = !hasVideo && canvas ? createFlight(canvas) : null;
    const onResize = () => { if (flight) flight.resize(); };
    window.addEventListener('resize', onResize);
    const lines = copyRef.current ? Array.from(copyRef.current.querySelectorAll('[data-l]')) : [];
    const p2 = n => String(n).padStart(2, '0');

    let idle = 0, last = performance.now();

    const off = onFrame(() => {
      if (!track) return;
      const vh = window.innerHeight;
      const r = track.getBoundingClientRect();
      const total = r.height / vh;          // longueur de la piste (en écrans)
      const u = -r.top / vh;
      const visible = u > -1.05 && u < total - 0.95;

      // lecture uniquement quand la scène est à l'écran
      if (hasVideo && video) {
        const want = visible && !lbRef.current;
        if (want && video.paused) { const pr = video.play(); if (pr && pr.catch) pr.catch(() => {}); }
        else if (!want && !video.paused) video.pause();
        if (visible && tcRef.current) {
          const t = video.currentTime || 0;
          tcRef.current.textContent = p2(Math.floor(t / 60)) + ':' + p2(Math.floor(t % 60)) + ':' + p2(Math.floor((t % 1) * 30));
        }
      }
      const now = performance.now();
      const dt = Math.min(now - last, 64) / 1000; last = now;
      if (!visible) return;

      if (reduce) {
        if (flight) { idle += dt * 0.12; flight.draw(0.35, 0, idle); }
        return;
      }

      const rev = easeOutCubic(smooth(u, -0.05, 1));     // dévoilement
      const cov = smooth(u, total - 2, total - 1);        // recouvrement

      if (media) {
        const sc = 1.12 - 0.12 * rev + 0.04 * cov;   // jamais < 1 : pas de bords vides
        const ty = (1 - rev) * 7 - cov * 6;              // en % de la hauteur
        media.style.transform = 'translate3d(0,' + ty.toFixed(2) + '%,0) scale(' + sc.toFixed(4) + ')';
      }
      if (shadeRef.current) shadeRef.current.style.opacity = (0.62 * (1 - rev) + 0.55 * cov).toFixed(3);

      // titre : ligne par ligne, en douceur, puis s'efface avant le recouvrement
      const outP = smooth(u, total - 2.25, total - 1.85);
      for (let i = 0; i < lines.length; i++) {
        const a = smooth(u, 0.55 + i * 0.12, 1.05 + i * 0.12) * (1 - outP);
        lines[i].style.opacity = a.toFixed(3);
        lines[i].style.transform = 'translate3d(0,' + ((1 - a) * 28).toFixed(1) + 'px,0)';
      }
      if (metaRef.current) metaRef.current.style.opacity = (smooth(u, 0.7, 1.1) * (1 - outP)).toFixed(3);

      // vol procédural : avance au scroll + dérive lente en continu
      if (flight) {
        idle += dt * 0.09;
        flight.draw(clamp(u / Math.max(total - 1, 1), 0, 1), 0, idle);
      }
    });

    if (flight) { flight.resize(); flight.draw(0, 0, 0); }
    return () => { off(); window.removeEventListener('resize', onResize); if (video) video.pause(); };
  }, [hasVideo]);

  const openFilm = useCallback(() => setLightbox(true), []);
  const closeFilm = useCallback(() => setLightbox(false), []);

  return (
    <section className={'reel' + (hasVideo ? ' has-video' : '')} id="showreel" data-navdark>
      <div className="reel-track" ref={trackRef}>
        <div className="reel-sticky">
          <div className="reel-media" ref={mediaRef}>
            <video className="reel-video" ref={videoRef} muted loop playsInline preload="metadata" disablePictureInPicture aria-hidden="true" />
            <canvas className="reel-canvas" ref={canvasRef} aria-hidden="true" />
          </div>
          <div className="reel-grade" aria-hidden="true" />
          <div className="reel-shade" ref={shadeRef} aria-hidden="true" />

          <div className="reel-copy wrap" ref={copyRef}>
            <span className="reel-eye" data-l>(01) — Séquence FPV</span>
            <h2>
              <span className="reel-ln" data-l>Au-dessus</span>
              <span className="reel-ln" data-l>de <em>Genève.</em></span>
            </h2>
            <div className="reel-actions" data-l>
              <p>Pilotée, filmée et montée par moi — un vol FPV entre lac et Salève.</p>
              {hasVideo && (
                <button className="reel-play" onClick={openFilm} data-cursor="play" data-magnetic="0.35">
                  <span className="reel-play-ic" aria-hidden="true" />
                  <span className="lbl">Regarder le film</span>
                </button>
              )}
            </div>
          </div>

          <div className="reel-meta wrap" ref={metaRef} aria-hidden="true">
            <span><i className="reel-rec" />{hasVideo ? <span ref={tcRef}>00:00:00</span> : 'Aperçu'}</span>
            <span>Drone FPV · 4K</span>
            <span>46.20°N — 6.14°E</span>
          </div>

          {!hasVideo && (
            <div className="reel-note" aria-hidden="true">
              Aperçu procédural — déposez <b>public/media/immersive.mp4</b>
            </div>
          )}
        </div>
      </div>

      {lightbox && <FilmLightbox src={VIDEO_SRC} onClose={closeFilm} />}
    </section>
  );
}

/* Lecteur plein écran, avec le son et les contrôles natifs. */
function FilmLightbox({ src, onClose }) {
  const [shown, setShown] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    stopScroll();
    document.body.classList.add('lb-open');
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('lb-open');
      startScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => { setShown(false); setTimeout(onClose, 520); };

  return (
    <div className={'reel-lb' + (shown ? ' show' : '')} role="dialog" aria-modal="true" aria-label="Film FPV — Au-dessus de Genève" onClick={close}>
      <div className="reel-lb-frame" onClick={e => e.stopPropagation()}>
        <video src={src} controls autoPlay playsInline />
      </div>
      <button className="reel-lb-close" ref={closeRef} onClick={close} data-cursor="fermer">
        Fermer <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
