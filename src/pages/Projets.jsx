import { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { VISIBLE_PROJECTS, FILTERS } from '../data/projects';
import { PROFILE } from '../data/profile';
import ProjectCard from '../components/ProjectCard';
import ContactOrb from '../three/ContactOrb';
import Footer from '../components/Footer';

/* On ne propose que les filtres qui ont au moins un projet. */
const ACTIVE_FILTERS = FILTERS.filter(f => f.cat === 'all' || VISIBLE_PROJECTS.some(p => p.cats.includes(f.cat)));

export default function Projets() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  const [cat, setCat] = useState('all');
  useDocumentTitle(
    t('Expériences & projets — Matthew LE', 'Experience & projects — Matthew LE'),
    t(
      'Expériences et projets de Matthew LE — alternances à la SNCF et chez VICAT, entrepreneuriat, data et développement.',
      "Matthew LE's experience and projects — work-study at SNCF and VICAT, entrepreneurship, data and development."
    )
  );
  useReveals(mainRef, lang);
  useProjectMotion(gridRef, [cat]);

  const visible = useMemo(
    () => VISIBLE_PROJECTS.filter(p => cat === 'all' || p.cats.includes(cat)),
    [cat]
  );

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <a href="/" className="page-back" data-cursor={t('retour', 'back')} onClick={e => { e.preventDefault(); go('/'); }}>{t('← Accueil', '← Home')}</a>
        <div className="eyebrow">{t('(03) — Expériences & projets', '(03) — Experience & projects')}</div>
        <h1>{t(<>Expériences <em>&amp; projets</em></>, <>Experience <em>&amp; projects</em></>)}</h1>
        <p className="page-intro">{t(
          <>Deux alternances en grand groupe, une agence web cofondée et une sélection de <em>projets</em>. Ouvrez une expérience pour voir le détail des missions.</>,
          <>Two work-study roles in large groups, a web agency I co-founded and a selection of <em>projects</em>. Open an experience to see the key missions.</>
        )}</p>
      </section>

      <section className="projects wrap">
        <div className="proj-toolbar">
          <div className="proj-filters">
            {ACTIVE_FILTERS.map(f => (
              <button
                key={f.cat}
                className={cat === f.cat ? 'active' : ''}
                onClick={() => setCat(f.cat)}
              >
                {t(f.label)}
              </button>
            ))}
          </div>
          <div className="proj-count mono">
            <b>{visible.length}</b> {t('élément', 'item')}{visible.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="proj-grid" ref={gridRef} key={cat}>
          {visible.map(p => <ProjectCard p={p} showYear key={p.id} />)}
        </div>

        {visible.length === 0 && (
          <p className="proj-empty mono" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>
            {t("Rien dans cette catégorie pour l'instant.", 'Nothing in this category yet.')}
          </p>
        )}
      </section>

      <section className="contact" data-navdark>
        <ContactOrb />
        <div className="wrap contact-grid">
          <div>
            <h2 className="line-mask"><span>{t(<>Un poste<br /><em>data&nbsp;?</em></>, <>A data<br /><em>role?</em></>)}</span></h2>
            <p className="lead reveal" data-d="1">{t(
              'Parlons-en. Je suis ouvert aux échanges dès maintenant, et disponible pour un premier poste à la fin de mon Master (2028).',
              "Let's talk. I'm open to a chat right now, and available for a first full-time role after my Master's (2028)."
            )}</p>
            <a
              className="contact-mail reveal"
              data-d="2"
              href="/contact"
              data-cursor={t('écrire', 'write')}
              onClick={e => { e.preventDefault(); go('/contact'); }}
            >
              <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">{t('Me contacter', 'Get in touch')}</span>
            </a>
          </div>
          <div className="contact-info">
            <div className="blk reveal"><span>{t('Écrire', 'Email')}</span><a href={'mailto:' + PROFILE.email}>{PROFILE.email}</a></div>
            <div className="blk reveal" data-d="1"><span>{t('Téléphone', 'Phone')}</span><a href={PROFILE.phoneHref}>{PROFILE.phone}</a></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
