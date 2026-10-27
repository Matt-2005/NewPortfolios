import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import About from './apropos/About';
import Parcours from './apropos/Parcours';
import Skills from './apropos/Skills';
import Showreel from './home/Showreel';
import NextPage from '../components/NextPage';
import Footer from '../components/Footer';

export default function APropos() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  useDocumentTitle(
    t('À propos — Matthew LE', 'About — Matthew LE'),
    t(
      'Qui est Matthew LE — étudiant en Master informatique à SUPINFO Lyon, orienté data engineering et BI. Parcours, compétences et projets.',
      "Who is Matthew LE — Master's student in Computer Science at SUPINFO Lyon, focused on data engineering and BI. Background, skills and projects."
    )
  );
  useReveals(mainRef, lang);

  return (
    <main ref={mainRef}>
      {/* feuille du haut : elle se soulève et dévoile le film FPV épinglé dessous */}
      <div className="sheet sheet-lift sheet-clip">
        <section className="page-head wrap">
          <a href="/" className="page-back" data-cursor={t('retour', 'back')} onClick={e => { e.preventDefault(); go('/'); }}>{t('← Accueil', '← Home')}</a>
          <div className="eyebrow">{t('(02) — À propos', '(02) — About')}</div>
          <h1>{t(<>Qui <em>je suis</em></>, <>Who <em>I am</em></>)}</h1>
          <p className="page-intro">{t(
            <>Étudiant en Master informatique à SUPINFO Lyon, futur <em>data engineer</em>. J'aime quand la donnée circule proprement — de la source au tableau de bord.</>,
            <>Master's student in Computer Science at SUPINFO Lyon, future <em>data engineer</em>. I like data that flows cleanly — from source to dashboard.</>
          )}</p>
        </section>

        <About />
        <Parcours />
        <Skills />
      </div>

      <Showreel />

      <div className="sheet sheet-cover">
        <NextPage to="/projets" label={t('Projets', 'Projects')} />
      </div>
      <Footer />
    </main>
  );
}
