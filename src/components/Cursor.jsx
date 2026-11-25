import { useEffect, useRef } from 'react';
import { lerp, coarse } from '../lib/motion';

/* Curseur — délégation globale : aucun rebind par page.
   La boucle d'animation s'arrête dès que l'anneau a rejoint la souris. */
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (coarse) return;
    const ring = ringRef.current, dot = dotRef.current;
    if (!ring || !dot) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    let alive = true, running = false;

    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (!running) { running = true; requestAnimationFrame(loop); }
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onOver = e => {
      const el = e.target.closest ? e.target.closest('a, button, .proj-card, [data-cursor]') : null;
      if (!el) { ring.classList.remove('is-hover', 'is-text'); return; }
      const lab = el.getAttribute('data-cursor');
      if (lab) { ring.classList.add('is-text'); ring.classList.remove('is-hover'); ring.setAttribute('data-label', lab); }
      else { ring.classList.add('is-hover'); ring.classList.remove('is-text'); }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver, { passive: true });

    function loop() {
      if (!alive) { running = false; return; }
      rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      if (Math.abs(mx - rx) < 0.15 && Math.abs(my - ry) < 0.15) { running = false; return; } // au repos
      requestAnimationFrame(loop);
    }

    return () => {
      alive = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  if (coarse) return null;
  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
