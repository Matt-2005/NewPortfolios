import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { PROJECTS } from '../data/projects';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import Hero from './home/Hero';
import Manifesto from './home/Manifesto';
import Immersive from './home/Immersive';
import About from './home/About';
import Parcours from './home/Parcours';
import Skills from './home/Skills';
import ContactSection from './home/ContactSection';

export default function Home() {
  const { go } = useApp();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  useDocumentTitle(
    'Matthew LE — Portfolio · En mouvement',
    "Matthew LE — étudiant en informatique & créateur d'expériences numériques. Toujours en mouvement : code, drone FPV, vidéo, moto."
  );
  useReveals(mainRef);
  useProjectMotion(gridRef);

  return (
    <main ref={mainRef}>
      <Hero />

      <Marquee
        seg={<>
          <span>Développement web</span><span className="star serif-it">✦</span>
          <span>Drone FPV</span><span className="star serif-it">✦</span>
          <span>Motion &amp; <em>montage</em></span><span className="star serif-it">✦</span>
          <span>UI / UX</span><span className="star serif-it">✦</span>
          <span>CFMoto 450SR</span><span className="star serif-it">✦</span>
        </>}
      />

      <Manifesto />
      <Immersive />
      <About />
      <Parcours />

      <Marquee
        dark dir="right" speed={0.6}
        seg={<>
          <span>Sélection de <em>travaux</em></span><span className="star">✦</span>
          <span>Last works</span><span className="star">✦</span>
          <span>2023 — 2026</span><span className="star">✦</span>
        </>}
      />

      <section className="projects wrap" id="work">
        <div className="sec-head">
          <h2 className="line-mask"><span>Projets <em>sélectionnés</em></span></h2>
          <span className="num reveal">(04) — IT &amp; créatif mêlés</span>
        </div>
        <div className="proj-grid" ref={gridRef}>
          {PROJECTS.map(p => <ProjectCard p={p} key={p.id} />)}
        </div>
        <div style={{ marginTop: 'clamp(40px,6vh,64px)' }} className="reveal">
          <a
            className="btn accent"
            href="/projets"
            data-magnetic="0.45"
            onClick={e => { e.preventDefault(); go('/projets'); }}
          >
            <span className="fill" /><span className="dot-arrow" /><span className="lbl">Voir tous les projets</span>
          </a>
        </div>
      </section>

      <Skills />
      <ContactSection />
      <Footer />
    </main>
  );
}
