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
import Icon from '../components/Icon';

export default function APropos() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  useDocumentTitle(
    t('À propos — Matthew LE', 'About — Matthew LE'),
    t(
      'Qui est Matthew LE — étudiant en Master of Engineering (Ingénierie Data) à SUPINFO Lyon, alternant développeur & ingénieur BI à la SNCF. Parcours et compétences.',
      'Who is Matthew LE — Master of Engineering student (Data Engineering) at SUPINFO Lyon, work-study developer & BI engineer at SNCF. Background and skills.'
    )
  );
  useReveals(mainRef, lang);

  return (
    <main ref={mainRef}>
      {/* feuille du haut : elle se soulève et dévoile le film FPV épinglé dessous */}
      <div className="sheet sheet-lift sheet-clip">
        <section className="page-head wrap">
          <a href="/" className="page-back" data-cursor={t('retour', 'back')} onClick={e => { e.preventDefault(); go('/'); }}><Icon name="arrow-left" /> {t('Accueil', 'Home')}</a>
          <div className="eyebrow">{t('(02) — À propos', '(02) — About')}</div>
          <h1>{t(<>Qui <em>je suis</em></>, <>Who <em>I am</em></>)}</h1>
          <p className="page-intro">{t(
            <>Étudiant en Ingénierie Data à SUPINFO Lyon et alternant à la SNCF. Sur cette page : mon parcours année par année, mes compétences, et ce que je fais <em>en dehors du code</em>.</>,
            <>Data Engineering student at SUPINFO Lyon, on a work-study contract at SNCF. On this page: my background year by year, my skills, and what I do <em>away from the keyboard</em>.</>
          )}</p>
        </section>

        <About />
        <Parcours />
        <Skills />
      </div>

      <Showreel />

      <div className="sheet sheet-cover">
        <NextPage to="/projets" label={t('Expériences', 'Experience')} />
      </div>
      <Footer />
    </main>
  );
}
