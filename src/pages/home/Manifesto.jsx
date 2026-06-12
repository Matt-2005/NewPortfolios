import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduce } from '../../lib/motion';
import { Words } from '../../components/text';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { count: 5, suffix: '+', label: 'années à coder' },
  { count: 12, suffix: '+', label: 'projets livrés' },
  { count: 'inf', suffix: '', label: 'heures de vol FPV' },
  { count: 450, suffix: 'cc', label: 'sous le réservoir' },
];

export default function Manifesto() {
  const ref = useRef(null);

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      /* la phrase s'allume mot à mot */
      const words = ref.current.querySelectorAll('.big .w');
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.05,
        scrollTrigger: { trigger: '.big', start: 'top 80%', end: 'bottom 46%', scrub: 0.4 },
      });
      /* compteurs */
      ref.current.querySelectorAll('[data-count]').forEach(el => {
        const raw = el.getAttribute('data-count');
        if (raw === 'inf') {
          gsap.from(el, {
            scale: 0.2, opacity: 0, duration: 1.1, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
          return;
        }
        const target = parseInt(raw, 10) || 0;
        const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, {
          v: target, duration: 1.8, ease: 'expo.out',
          onUpdate: () => { el.textContent = Math.round(o.v); },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto wrap" ref={ref}>
      <p className="big">
        <span className="muted"><Words text="Je ne fais pas une chose à la fois." /></span>{' '}
        <Words text="Le code, le" /> <em><Words text="drone" /></em><Words text=", la vidéo, la moto — c'est la même obsession : le" />{' '}
        <span className="hl"><Words text="mouvement" /></span><Words text=", la précision, et ce moment où tout" /> <em><Words text="s'aligne" /></em><Words text="." />
      </p>
      <div className="manifesto-foot">
        {STATS.map((s, i) => (
          <div className="stat reveal" data-d={i ? String(i) : undefined} key={s.label}>
            <div className="n">
              <span data-count={s.count}>{s.count === 'inf' ? '∞' : s.count}</span>
              {s.suffix && <span className="serif-it">{s.suffix}</span>}
            </div>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
