import { useEffect, useRef, useState } from 'react';
import { clamp } from '../lib/motion';
import { stopScroll, startScroll } from '../lib/scroller';

const VERBS = ['coder', 'piloter', 'monter', 'rouler', 'créer'];

/* Préchargeur — compteur + monogramme, une fois par session.
   La classe html.preload est posée avant la première peinture
   par le script de index.html. */
export default function Preloader({ onDone }) {
  const [gone, setGone] = useState(false);
  const preRef = useRef(null);
  const cntRef = useRef(null);
  const barRef = useRef(null);
  const verbRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const finishOnce = () => { if (!doneRef.current) { doneRef.current = true; onDone(); } };

    if (!root.classList.contains('preload')) {
      setGone(true);
      finishOnce();
      return;
    }
    stopScroll();

    let vi = 0, raf = 0;
    const vTimer = setInterval(() => {
      vi = (vi + 1) % VERBS.length;
      if (verbRef.current) verbRef.current.textContent = VERBS[vi];
    }, 235);

    const T = 1550, t0 = performance.now();
    const timers = [];
    const step = now => {
      const t = clamp((now - t0) / T, 0, 1);
      const e = 1 - Math.pow(1 - t, 4);
      if (cntRef.current) cntRef.current.innerHTML = String(Math.round(e * 100)).padStart(3, '0') + '<small>%</small>';
      if (barRef.current) barRef.current.style.transform = 'scaleX(' + e.toFixed(3) + ')';
      if (t < 1) raf = requestAnimationFrame(step);
      else finish();
    };
    raf = requestAnimationFrame(step);

    function finish() {
      clearInterval(vTimer);
      try { sessionStorage.setItem('ml-seen', '1'); } catch (e) {}
      timers.push(setTimeout(() => {
        if (preRef.current) preRef.current.classList.add('done');
        timers.push(setTimeout(finishOnce, 360));
        timers.push(setTimeout(() => {
          setGone(true);
          root.classList.remove('preload');
          startScroll();
        }, 1050));
      }, 200));
    }

    return () => {
      clearInterval(vTimer);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  if (gone) return null;
  return (
    <div className="preloader" ref={preRef} aria-hidden="true">
      <div className="pl-center">
        <div className="pl-mono">ML<sup>®</sup></div>
        <div className="pl-bar"><i ref={barRef} /></div>
        <div className="pl-verb" ref={verbRef}>coder</div>
      </div>
      <div className="pl-foot">©2026 — En mouvement</div>
      <div className="pl-count" ref={cntRef}>000<small>%</small></div>
    </div>
  );
}
