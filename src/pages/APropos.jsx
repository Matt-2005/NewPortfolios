import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import About from './apropos/About';
import Parcours from './apropos/Parcours';
import Skills from './apropos/Skills';
import NextPage from '../components/NextPage';
import Footer from '../components/Footer';

export default function APropos() {
  const { go } = useApp();
  const mainRef = useRef(null);
  useDocumentTitle(
    'À propos — Matthew LE',
    "Qui est Matthew LE — étudiant en informatique à Genève, développeur web, pilote FPV et vidéaste. Parcours et compétences."
  );
  useReveals(mainRef);

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <a href="/" className="page-back" data-cursor="retour" onClick={e => { e.preventDefault(); go('/'); }}>← Accueil</a>
        <div className="eyebrow">(02) — À propos</div>
        <h1>Qui <em>je suis</em></h1>
        <p className="page-intro">Étudiant en informatique, pilote FPV, monteur à mes heures — et toujours la même idée fixe&nbsp;: le <em>mouvement</em>.</p>
      </section>

      <About />
      <Parcours />
      <Skills />
      <NextPage to="/projets" label="Projets" />
      <Footer />
    </main>
  );
}
