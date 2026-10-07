import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../../context/AppContext';
import { lerp, onFrame, reduce, coarse } from '../../lib/motion';
import { scrollToEl } from '../../lib/scroller';
import { Chars } from '../../components/text';
import HeroField from '../../three/HeroField';

gsap.registerPlugin(ScrollTrigger);

const VERBS = ['coder', 'piloter', 'monter', 'rouler', 'créer'];

function VerbCycle() {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(-1);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setActive(a => {
        setLeaving(a);
        setTimeout(() => setLeaving(-1), 650);
        return (a + 1) % VERBS.length;
      });
    }, 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="verb-cycle">
      {VERBS.map((v, i) => (
        <b key={v} className={i === active ? 'active' : i === leaving ? 'exit' : ''}>
          {v}<span className="tld">.</span>
        </b>
      ))}
    </span>
  );
}

export default function Hero() {
  const { ready } = useApp();
  const heroRef = useRef(null);
  const lightRef = useRef(null);

  /* — états initiaux posés avant peinture (l'intro les animera) — */
  useLayoutEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.set('.hero-ghost', { scale: 1.14, opacity: 0 });
      gsap.set('.hero-grid', { opacity: 0 });
      gsap.set('.hero-title .ln', { yPercent: 115, rotate: 2.4, transformOrigin: '0% 100%' });
      gsap.set('.hero-sweep', { scaleX: 0 });
      gsap.set(['.hero-top > *', '.hero-sub > *'], { y: 26, opacity: 0 });
      gsap.set('.hero-side', { opacity: 0 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* — intro chorégraphiée, déclenchée à la fin du préchargeur — */
  useEffect(() => {
    if (!ready || reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to('.hero-ghost', { scale: 1, opacity: 1, duration: 1.7, ease: 'power2.out' }, 0)
        .to('.hero-grid', { opacity: 1, duration: 1.3 }, 0)
        .to('.hero-title .ln', { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.095 }, 0.1)
        .to('.hero-sweep', { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0.5)
        .to('.hero-top > *', { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'opacity,transform' }, 0.55)
        .to('.hero-sub > *', { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, clearProps: 'opacity,transform' }, 0.7)
        .to('.hero-side', { opacity: 1, duration: 1.4 }, 0.95);
    }, heroRef);
    return () => ctx.revert();
  }, [ready]);

  /* — parallaxe de sortie au scroll — */
  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      const stHero = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.4 };
      gsap.to('.hero-main', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: stHero });
      gsap.to('.hero-top', { yPercent: -80, opacity: 0, ease: 'none', scrollTrigger: { ...stHero, end: '55% top' } });
      gsap.to('.hero-ghost-w', { yPercent: 24, scale: 1.16, ease: 'none', scrollTrigger: stHero });
      gsap.to(['.hero-grid', '.hero-sweep', '.hero-fx', '.hero-side'], {
        opacity: 0, ease: 'none',
        scrollTrigger: { ...stHero, start: '12% top', end: '70% top' },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* — le monogramme fantôme suit la souris — */
  useEffect(() => {
    if (reduce || coarse) return;
    const hero = heroRef.current;
    const ghost = hero.querySelector('.hero-ghost');
    const gx = gsap.quickTo(ghost, 'x', { duration: 0.9, ease: 'power3' });
    const gy = gsap.quickTo(ghost, 'y', { duration: 0.9, ease: 'power3' });
    const onMove = e => {
      gx((e.clientX / window.innerWidth * 2 - 1) * 16);
      gy((e.clientY / window.innerHeight * 2 - 1) * 10);
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  /* — halo lumineux : suit le curseur, dérive seul au tactile — */
  useEffect(() => {
    if (reduce) return;
    const hero = heroRef.current, light = lightRef.current;
    let mx = -1, my = -1, x = window.innerWidth * 0.6, y = window.innerHeight * 0.4, oo = 0;
    const onMove = e => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -1; };
    if (!coarse) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    }
    const off = onFrame(() => {
      const r = hero.getBoundingClientRect();
      if (r.bottom < 0) { if (oo > 0.01) { oo = 0; light.style.opacity = '0'; } return; }
      let tx, ty, o;
      if (mx >= 0) { tx = mx; ty = my; o = 0.95; }
      else {
        const t = performance.now();
        tx = r.width * (0.5 + 0.3 * Math.sin(t * 0.00021));
        ty = r.height * (0.42 + 0.26 * Math.cos(t * 0.00017));
        o = 0.6;
      }
      x = lerp(x, tx, 0.07); y = lerp(y, ty, 0.07);
      oo = lerp(oo, o, 0.04);
      light.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
      light.style.opacity = oo.toFixed(3);
    });
    return () => {
      off();
      if (!coarse) { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); }
    };
  }, []);

  /* — titre vivant : la graisse des lettres répond au curseur — */
  useEffect(() => {
    if (reduce || coarse) return;
    const hero = heroRef.current;
    const chs = Array.from(hero.querySelectorAll('.hero-title .ch'))
      .filter(el => !el.closest('em'))
      .map(el => ({ el, w: 800, applied: 800 }));
    if (!chs.length) return;
    let mx = -1, my = 0;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -1; };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    const R2 = 140 * 140;
    const off = onFrame(() => {
      if (mx < 0) {
        let busy = false;
        for (let i = 0; i < chs.length; i++) if (Math.abs(chs[i].w - 800) > 0.4) { busy = true; break; }
        if (!busy) return;
      }
      const targets = [];
      for (let i = 0; i < chs.length; i++) { // lectures d'abord, écritures ensuite
        let t = 800;
        if (mx >= 0) {
          const r = chs[i].el.getBoundingClientRect();
          const dx = r.left + r.width / 2 - mx;
          const dy = r.top + r.height / 2 - my;
          t = 800 + 100 * Math.exp(-(dx * dx + dy * dy) / R2);
        }
        targets.push(t);
      }
      for (let i = 0; i < chs.length; i++) {
        const c = chs[i];
        c.w = lerp(c.w, targets[i], 0.18);
        if (Math.abs(c.w - c.applied) < 0.3) continue;
        c.applied = c.w;
        c.el.style.fontVariationSettings = '"wght" ' + c.w.toFixed(1);
      }
    });
    return () => {
      off();
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-ghost-w"><div className="hero-ghost serif-it">ML</div></div>
        <div className="hero-sweep" />
      </div>
      <div className="hero-light" ref={lightRef} aria-hidden="true" />
      <HeroField heroRef={heroRef} />
      <div className="hero-side left mono" aria-hidden="true">46.2044° N — 6.1432° E <span className="tick">/</span> GENÈVE</div>
      <div className="hero-side right mono" aria-hidden="true">Scène 01 <span className="tick">/</span> Ouverture — En mouvement</div>

      <div className="hero-top wrap">
        <p>Étudiant en informatique à SUPINFO Genève, je conçois des expériences numériques où la technique rencontre l'instinct.</p>
        <div className="meta">
          PORTFOLIO — V.2026<br />
          GENÈVE · SUISSE<br />
          <span className="avail-chip"><i aria-hidden="true" />Disponible</span>
        </div>
      </div>

      <div className="hero-main wrap">
        <h1 className="hero-title">
          <span className="hm"><span className="ln"><Chars text="Matthew " /><em><Chars text="Le" /></em></span></span>
          <span className="hm"><span className="ln"><Chars text="en mouvement" /></span></span>
        </h1>

        <div className="hero-sub">
          <div className="hero-verbs">
            <span className="lead serif-it">Je passe mes journées à&nbsp;</span>
            <VerbCycle />
          </div>
          <a
            href="#showreel"
            className="scroll-cue"
            aria-label="Faire défiler"
            onClick={e => { e.preventDefault(); scrollToEl(document.getElementById('showreel')); }}
          >
            <span className="track" />Faites défiler
          </a>
        </div>
      </div>
    </section>
  );
}
