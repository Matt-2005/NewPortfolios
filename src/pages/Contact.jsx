import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Footer from '../components/Footer';

export default function Contact() {
  const { go } = useApp();
  const mainRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [missing, setMissing] = useState([]);
  useDocumentTitle(
    'Contact — Matthew LE',
    "Contactez Matthew LE — étudiant en informatique & créateur d'expériences numériques. Genève · Suisse."
  );
  useReveals(mainRef);

  /* Formulaire → compose un email (sans backend) */
  const onSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const subject = (data.get('subject') || '').toString().trim() || 'Prise de contact';
    const message = (data.get('message') || '').toString().trim();
    const miss = [];
    if (!name) miss.push('name');
    if (!email) miss.push('email');
    if (!message) miss.push('message');
    setMissing(miss);
    if (miss.length) return;
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    const subj = encodeURIComponent(subject + ' — via le portfolio');
    setSent(true);
    window.location.href = 'mailto:contact@matthewle.fr?subject=' + subj + '&body=' + body;
  };

  const errStyle = f => (missing.includes(f) ? { borderColor: 'var(--fpv-deep)' } : undefined);

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <a href="/" className="page-back" data-cursor="retour" onClick={e => { e.preventDefault(); go('/'); }}>← Accueil</a>
        <div className="eyebrow">(04) — Contact</div>
        <h1>Travaillons<br /><em>ensemble</em></h1>
        <p className="page-intro">Une idée, un projet, une envie de bouger&nbsp;? Dites-m'en plus — je réponds vite, et toujours avec curiosité. Du <em>code</em> à l'<em>image</em>.</p>
      </section>

      <section className="contactpage wrap">
        <div className="cgrid">
          <form className="cform reveal" onSubmit={onSubmit} noValidate>
            <div className="crow">
              <div className="cfield">
                <label htmlFor="f-name">Votre nom</label>
                <input id="f-name" name="name" type="text" placeholder="Jean Dupont" required style={errStyle('name')} />
              </div>
              <div className="cfield">
                <label htmlFor="f-email">Votre email</label>
                <input id="f-email" name="email" type="email" placeholder="jean@exemple.fr" required style={errStyle('email')} />
              </div>
            </div>
            <div className="cfield">
              <label htmlFor="f-subject">Sujet</label>
              <input id="f-subject" name="subject" type="text" placeholder="Site vitrine, film FPV, collaboration…" />
            </div>
            <div className="cfield">
              <label htmlFor="f-message">Votre message</label>
              <textarea id="f-message" name="message" placeholder="Parlez-moi de votre projet, du contexte, des délais…" required style={errStyle('message')} />
            </div>
            <div className="cform-foot">
              <button type="submit" className="btn accent" data-magnetic="0.4">
                <span className="fill" /><span className="dot-arrow" /><span className="lbl">Envoyer le message</span>
              </button>
              <span className={'ok mono' + (sent ? ' show' : '')}>✦ Merci — votre client mail va s'ouvrir.</span>
            </div>
          </form>

          <aside className="cinfo reveal" data-d="1">
            <div className="blk">
              <span>Email direct</span>
              <a className="big-mail" href="mailto:contact@matthewle.fr" data-cursor="écrire">
                <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">contact@matthewle.fr</span>
              </a>
            </div>
            <div className="blk">
              <span>Téléphone</span>
              <a href="tel:+33615802246">(+33) 6 15 80 22 46</a>
            </div>
            <div className="blk">
              <span>Localisation</span>
              <p>Genève, Suisse — 1201</p>
            </div>
            <div className="blk">
              <span>Réseaux</span>
              <div className="socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="voir">Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="voir">LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" data-cursor="voir">YouTube</a>
              </div>
            </div>
            <div className="blk">
              <span>Disponibilité</span>
              <div className="avail">Ouvert — stage / freelance 2026</div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
