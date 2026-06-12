/* ============================================================
   Lenis (défilement inertiel) — singleton branché sur le ticker
   GSAP pour rester en phase avec ScrollTrigger.
   ============================================================ */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduce } from './motion';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initScroller() {
  if (reduce || lenis) return () => {};
  try {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = t => lenis && lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; };
  } catch (e) {
    lenis = null;
    return () => {};
  }
}

export const getLenis = () => lenis;
export const stopScroll = () => lenis && lenis.stop();
export const startScroll = () => lenis && lenis.start();

export function scrollToEl(t, offset = 0) {
  if (!t) return;
  if (lenis) lenis.scrollTo(t, { offset, duration: 1.5, easing: x => 1 - Math.pow(1 - x, 4) });
  else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

export function scrollTopImmediate() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}
