import { useEffect, useRef } from 'react';
import { clamp, getVel, onFrame, reduce } from '../lib/motion';

/* Bandeau défilant infini, dopé à la vélocité du scroll.
   `seg` : contenu d'un segment (répété 4×). */
export default function Marquee({ seg, dark = false, dir = 'left', speed = 0.5, navDark = dark }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;
    const d = dir === 'right' ? 1 : -1;
    let x = 0, segW = 0;
    const measure = () => { segW = track.scrollWidth / 4; };
    measure();
    window.addEventListener('resize', measure);
    const off = onFrame(() => {
      if (!segW) measure();
      const boost = clamp(Math.abs(getVel()) * 0.05, 0, 2.6);
      x += d * (speed + boost);
      if (d < 0 && x <= -segW) x += segW;
      if (d > 0 && x >= 0) x -= segW;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    });
    return () => { window.removeEventListener('resize', measure); off(); };
  }, [dir, speed]);

  return (
    <div className={'marquee' + (dark ? ' dark' : '')} {...(navDark ? { 'data-navdark': '' } : {})} aria-hidden="true">
      <div className="track" ref={trackRef}>
        {[0, 1, 2, 3].map(i => <span className="seg" key={i}>{seg}</span>)}
      </div>
    </div>
  );
}
