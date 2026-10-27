import ContactOrb from '../../three/ContactOrb';
import { PROFILE } from '../../data/profile';
import { useLang } from '../../i18n/lang';
import Socials from '../../components/Socials';

/* Section contact de l'accueil — avec l'orbe d'énergie Three.js. */
export default function ContactSection() {
  const { t } = useLang();
  return (
    <section className="contact" id="contact" data-navdark>
      <ContactOrb />
      <div className="wrap contact-grid">
        <div>
          <h2 className="line-mask"><span>{t(<>Parlons<br /><em>data</em></>, <>Let's talk<br /><em>data</em></>)}</span></h2>
          <p className="lead reveal" data-d="1">{t(
            'Recruteur, manager ou équipe data en Suisse ? Je suis ouvert aux échanges dès maintenant — et à un premier poste à la fin de mon Master, en 2028.',
            "Recruiter, hiring manager or data team in Switzerland? I'm happy to talk right now — and I'm looking for a first full-time role after my Master's, in 2028."
          )}</p>
          <a className="contact-mail reveal" data-d="2" href={'mailto:' + PROFILE.email} data-cursor={t('écrire', 'write')}>
            <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">{PROFILE.email}</span>
          </a>
        </div>
        <div className="contact-info">
          <div className="blk reveal"><span>{t('Téléphone', 'Phone')}</span><a href={PROFILE.phoneHref}>{PROFILE.phone}</a></div>
          <div className="blk reveal" data-d="1"><span>{t('Localisation', 'Location')}</span><p>{t(PROFILE.location)}</p></div>
          <div className="blk reveal" data-d="2">
            <span>{t('Profils', 'Profiles')}</span>
            <Socials />
          </div>
        </div>
      </div>
    </section>
  );
}
