import { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { PROJECTS, FILTERS } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ContactOrb from '../three/ContactOrb';
import Footer from '../components/Footer';

export default function Projets() {
  const { go } = useApp();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  const [cat, setCat] = useState('all');
  useDocumentTitle(
    'Projets — Matthew LE',
    'Tous les projets de Matthew LE — développement web, films FPV, vidéo moto et applications.'
  );
  useReveals(mainRef);
  useProjectMotion(gridRef, [cat]);

  const visible = useMemo(
    () => PROJECTS.filter(p => cat === 'all' || p.cats.includes(cat)),
    [cat]
  );

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <a href="/" className="page-back" data-cursor="retour" onClick={e => { e.preventDefault(); go('/'); }}>← Accueil</a>
        <div className="eyebrow">(04) — Archive complète</div>
        <h1>Tous les <em>projets</em></h1>
        <p className="intro">L'ensemble de mes travaux, du <em>code</em> à l'<em>image</em>&nbsp;: sites sur-mesure, films FPV, vidéos moto et applications. Filtrez par discipline pour explorer.</p>
      </section>

      <section className="projects wrap">
        <div className="proj-toolbar">
          <div className="proj-filters">
            {FILTERS.map(f => (
              <button
                key={f.cat}
                className={cat === f.cat ? 'active' : ''}
                onClick={() => setCat(f.cat)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="proj-count mono"><b>{visible.length}</b> projet{visible.length > 1 ? 's' : ''}</div>
        </div>

        <div className="proj-grid" ref={gridRef} key={cat}>
          {visible.map(p => <ProjectCard p={p} showYear key={p.id} />)}
        </div>

        {visible.length === 0 && (
          <p className="proj-empty mono" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>
            Aucun projet dans cette catégorie pour l'instant.
          </p>
        )}
      </section>

      <section className="contact" data-navdark>
        <ContactOrb />
        <div className="wrap contact-grid">
          <div>
            <h2 className="line-mask"><span>Un projet<br /><em>en tête&nbsp;?</em></span></h2>
            <p className="lead reveal" data-d="1">Parlons-en. Du site sur-mesure au film de marque, je donne forme à vos idées.</p>
            <a
              className="contact-mail reveal"
              data-d="2"
              href="/contact"
              data-cursor="écrire"
              onClick={e => { e.preventDefault(); go('/contact'); }}
            >
              <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">Me contacter</span>
            </a>
          </div>
          <div className="contact-info">
            <div className="blk reveal"><span>Écrire</span><a href="mailto:contact@matthewle.fr">contact@matthewle.fr</a></div>
            <div className="blk reveal" data-d="1"><span>Téléphone</span><a href="tel:+33615802246">(+33) 6 15 80 22 46</a></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
