import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduce } from '../../lib/motion';
import { Words } from '../../components/text';
import { useLang } from '../../i18n/lang';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { count: 5, suffix: '+', label: { fr: 'années à coder', en: 'years of coding' } },
  { count: 12, suffix: '+', label: { fr: 'projets livrés', en: 'projects delivered' } },
  { count: 3, suffix: '', label: { fr: 'langues · FR EN RU', en: 'languages · FR EN RU' } },
  { count: 2028, pop: true, suffix: '', label: { fr: 'fin du Master', en: "Master's graduation" } },
];

export default function Manifesto() {
  const ref = useRef(null);
  const { t } = useLang();

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
        if (raw === 'inf' || el.hasAttribute('data-pop')) { // une année ne se « compte » pas : elle apparaît
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
        {t(
          <><span className="muted"><Words text="Une donnée qui dort ne vaut rien." /></span>{' '}
            <Words text="Je construis les flux qui la mettent en" /> <span className="hl"><Words text="mouvement" /></span><Words text=" — de la source brute au" />{' '}
            <em><Words text="dashboard" /></em> <Words text="qui aide à décider. Fiables, documentés," /> <em><Words text="précis" /></em><Words text="." /></>,
          <><span className="muted"><Words text="Data at rest is worth nothing." /></span>{' '}
            <Words text="I build the pipelines that put it in" /> <span className="hl"><Words text="motion" /></span><Words text=" — from raw source to the" />{' '}
            <em><Words text="dashboard" /></em> <Words text="that drives decisions. Reliable, documented," /> <em><Words text="precise" /></em><Words text="." /></>
        )}
      </p>
      <div className="manifesto-foot">
        {STATS.map((s, i) => (
          <div className="stat reveal" data-d={i ? String(i) : undefined} key={s.count}>
            <div className="n">
              <span data-count={s.count} data-pop={s.pop ? '' : undefined}>{s.count === 'inf' ? '∞' : s.count}</span>
              {s.suffix && <span className="serif-it">{s.suffix}</span>}
            </div>
            <p>{t(s.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
