import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { PROJECTS } from '../data/projects';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import NextPage from '../components/NextPage';
import Hero from './home/Hero';
import Manifesto from './home/Manifesto';
import Showreel from './home/Showreel';
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
      {/* feuille du haut : elle se soulève et dévoile le showreel épinglé dessous */}
      <div className="sheet sheet-lift">
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
      </div>
      <Showreel />

      <div className="sheet sheet-cover">
        <section className="projects wrap" id="work">
          <div className="sec-head">
            <h2 className="line-mask"><span>Projets <em>sélectionnés</em></span></h2>
            <span className="num reveal">(02) — IT &amp; créatif mêlés</span>
          </div>
          <div className="proj-grid" ref={gridRef}>
            {PROJECTS.slice(0, 4).map(p => <ProjectCard p={p} key={p.id} />)}
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

        <NextPage to="/a-propos" label="À propos" kicker="Qui est derrière l'écran ?" />
      </div>

      <Marquee
        dark dir="right" speed={0.6}
        seg={<>
          <span>Travaillons <em>ensemble</em></span><span className="star">✦</span>
          <span>Disponible 2026</span><span className="star">✦</span>
          <span>Genève · Suisse</span><span className="star">✦</span>
        </>}
      />

      <ContactSection />
      <Footer />
    </main>
  );
}
