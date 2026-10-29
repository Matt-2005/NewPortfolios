import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { HOME_PROJECTS } from '../data/projects';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import ProfileFacts from '../components/ProfileFacts';
import CvButton from '../components/CvButton';
import Footer from '../components/Footer';
import NextPage from '../components/NextPage';
import Hero from './home/Hero';
import Manifesto from './home/Manifesto';
import ContactSection from './home/ContactSection';

export default function Home() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  useDocumentTitle(
    t('Matthew LE — Data Engineer & BI · Lyon → Suisse', 'Matthew LE — Data Engineer & BI · Lyon → Switzerland'),
    t(
      'Matthew LE — étudiant en Master of Engineering (Ingénierie Data) à SUPINFO Lyon, alternant développeur & ingénieur BI à la SNCF. SQL, Power BI, AWS. Mobile en Suisse.',
      'Matthew LE — Master of Engineering student (Data Engineering) at SUPINFO Lyon, work-study developer & BI engineer at SNCF. SQL, Power BI, AWS. Open to Switzerland.'
    )
  );
  useReveals(mainRef, lang);
  useProjectMotion(gridRef);

  return (
    <main ref={mainRef}>
      {/* Hero et manifeste sont remontés au changement de langue (texte découpé) */}
      <Hero key={'hero-' + lang} />

      <Marquee
        seg={<>
          <span>SQL</span><span className="star serif-it">✦</span>
          <span>Python</span><span className="star serif-it">✦</span>
          <span>Power BI</span><span className="star serif-it">✦</span>
          <span>AWS</span><span className="star serif-it">✦</span>
          <span>Kafka</span><span className="star serif-it">✦</span>
          <span>ETL <em>&amp;</em> pipelines</span><span className="star serif-it">✦</span>
          <span>{t('Modélisation', 'Data modelling')}</span><span className="star serif-it">✦</span>
          <span>Data <em>viz</em></span><span className="star serif-it">✦</span>
        </>}
      />

      <Manifesto key={'manifesto-' + lang} />

      <section className="profile wrap" id="profil">
        <div className="sec-head">
          <h2 className="line-mask"><span>{t(<>Profil <em>en bref</em></>, <>At a <em>glance</em></>)}</span></h2>
          <span className="num reveal">{t('(01) — Pour les recruteurs', '(01) — For recruiters')}</span>
        </div>
        <ProfileFacts />
        <div className="profile-actions reveal">
          <CvButton />
          <a className="btn" href="/a-propos" onClick={e => { e.preventDefault(); go('/a-propos'); }}>
            <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Parcours & compétences', 'Background & skills')}</span>
          </a>
        </div>
      </section>

      <section className="projects wrap" id="work">
        <div className="sec-head">
          <h2 className="line-mask"><span>{t(<>Expériences <em>&amp; projets</em></>, <>Experience <em>&amp; projects</em></>)}</span></h2>
          <span className="num reveal">{t('(02) — Alternances, entrepreneuriat & projets', '(02) — Work-study, entrepreneurship & projects')}</span>
        </div>
        <div className="proj-grid" ref={gridRef}>
          {HOME_PROJECTS.map(p => <ProjectCard p={p} key={p.id} />)}
        </div>
        <div style={{ marginTop: 'clamp(40px,6vh,64px)' }} className="reveal">
          <a
            className="btn accent"
            href="/projets"
            onClick={e => { e.preventDefault(); go('/projets'); }}
          >
            <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Tout le parcours', 'Full background')}</span>
          </a>
        </div>
      </section>

      <NextPage to="/a-propos" label={t('À propos', 'About')} kicker={t("Qui est derrière l'écran ?", "Who's behind the screen?")} />

      <Marquee
        dark dir="right" speed={0.6}
        seg={<>
          <span>{t(<>Parlons <em>data</em></>, <>Let's talk <em>data</em></>)}</span><span className="star">✦</span>
          <span>Data Engineer · BI</span><span className="star">✦</span>
          <span>{t(<>Cap sur la <em>Suisse</em></>, <>Next stop <em>Switzerland</em></>)}</span><span className="star">✦</span>
        </>}
      />

      <ContactSection />
      <Footer />
    </main>
  );
}
