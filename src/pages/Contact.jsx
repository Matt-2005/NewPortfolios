import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PROFILE } from '../data/profile';
import ProfileFacts from '../components/ProfileFacts';
import CvButton from '../components/CvButton';
import Socials from '../components/Socials';
import Footer from '../components/Footer';

export default function Contact() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [missing, setMissing] = useState([]);
  useDocumentTitle(
    t('Contact — Matthew LE', 'Contact — Matthew LE'),
    t(
      'Contacter Matthew LE — futur Data Engineer / ingénieur BI, basé à Lyon, mobile en Suisse.',
      'Contact Matthew LE — aspiring Data Engineer / BI Engineer based in Lyon, open to Switzerland.'
    )
  );
  useReveals(mainRef, lang);

  /* Formulaire → compose un email (sans backend) */
  const onSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const company = (data.get('company') || '').toString().trim();
    const subject = (data.get('subject') || '').toString().trim() || t('Prise de contact', 'Getting in touch');
    const message = (data.get('message') || '').toString().trim();
    const miss = [];
    if (!name) miss.push('name');
    if (!email) miss.push('email');
    if (!message) miss.push('message');
    setMissing(miss);
    if (miss.length) return;
    const sig = '— ' + name + (company ? ', ' + company : '') + ' (' + email + ')';
    const body = encodeURIComponent(message + '\n\n' + sig);
    const subj = encodeURIComponent(subject + t(' — via le portfolio', ' — via portfolio'));
    setSent(true);
    window.location.href = 'mailto:' + PROFILE.email + '?subject=' + subj + '&body=' + body;
  };

  const errStyle = f => (missing.includes(f) ? { borderColor: 'var(--fpv-deep)' } : undefined);

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <a href="/" className="page-back" data-cursor={t('retour', 'back')} onClick={e => { e.preventDefault(); go('/'); }}>{t('← Accueil', '← Home')}</a>
        <div className="eyebrow">{t('(04) — Contact', '(04) — Contact')}</div>
        <h1>{t(<>Travaillons<br /><em>ensemble</em></>, <>Let's work<br /><em>together</em></>)}</h1>
        <p className="page-intro">{t(
          <>Un poste en <em>data engineering</em> ou en <em>BI</em>, une question sur mon parcours, un échange en visio ou à Genève&nbsp;? Écrivez-moi : je réponds rapidement.</>,
          <>A role in <em>data engineering</em> or <em>BI</em>, a question about my background, a video call or a coffee in Geneva? Drop me a line: I reply quickly.</>
        )}</p>
      </section>

      <section className="contactpage wrap">
        <div className="cgrid">
          <form className="cform reveal" onSubmit={onSubmit} noValidate>
            <div className="crow">
              <div className="cfield">
                <label htmlFor="f-name">{t('Votre nom', 'Your name')}</label>
                <input id="f-name" name="name" type="text" placeholder={t('Jean Dupont', 'Jane Smith')} required style={errStyle('name')} />
              </div>
              <div className="cfield">
                <label htmlFor="f-email">{t('Votre email', 'Your email')}</label>
                <input id="f-email" name="email" type="email" placeholder={t('jean@entreprise.ch', 'jane@company.ch')} required style={errStyle('email')} />
              </div>
            </div>
            <div className="crow">
              <div className="cfield">
                <label htmlFor="f-company">{t('Entreprise (facultatif)', 'Company (optional)')}</label>
                <input id="f-company" name="company" type="text" placeholder={t('Votre entreprise', 'Your company')} />
              </div>
              <div className="cfield">
                <label htmlFor="f-subject">{t('Sujet', 'Subject')}</label>
                <input id="f-subject" name="subject" type="text" placeholder={t('Poste data, entretien, échange…', 'Data role, interview, chat…')} />
              </div>
            </div>
            <div className="cfield">
              <label htmlFor="f-message">{t('Votre message', 'Your message')}</label>
              <textarea id="f-message" name="message" placeholder={t("Le poste, l'équipe, le contexte…", 'The role, the team, the context…')} required style={errStyle('message')} />
            </div>
            <div className="cform-foot">
              <button type="submit" className="btn accent">
                <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Envoyer le message', 'Send message')}</span>
              </button>
              <span className={'ok mono' + (sent ? ' show' : '')}>{t("✦ Merci — votre client mail va s'ouvrir.", '✦ Thanks — your email app will open.')}</span>
            </div>
          </form>

          <aside className="cinfo reveal" data-d="1">
            <div className="blk">
              <span>{t('Email direct', 'Direct email')}</span>
              <a className="big-mail" href={'mailto:' + PROFILE.email} data-cursor={t('écrire', 'write')}>
                <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">{PROFILE.email}</span>
              </a>
            </div>
            <div className="blk">
              <span>{t('Téléphone', 'Phone')}</span>
              <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
            </div>
            <div className="blk">
              <span>{t('Profils', 'Profiles')}</span>
              <Socials />
            </div>
            <div className="cinfo-cv">
              <CvButton />
            </div>
          </aside>
        </div>

        <div className="contact-facts">
          <div className="sec-head">
            <h2 className="line-mask"><span>{t(<>Profil <em>en bref</em></>, <>At a <em>glance</em></>)}</span></h2>
          </div>
          <ProfileFacts compact />
        </div>
      </section>

      <Footer />
    </main>
  );
}
