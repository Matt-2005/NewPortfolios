import ContactOrb from '../../three/ContactOrb';

/* Section contact de l'accueil — avec l'orbe d'énergie Three.js. */
export default function ContactSection() {
  return (
    <section className="contact" id="contact" data-navdark>
      <ContactOrb />
      <div className="wrap contact-grid">
        <div>
          <h2 className="line-mask"><span>Lancez-vous<br /><em>avec moi</em></span></h2>
          <p className="lead reveal" data-d="1">Une idée, un projet, une envie de bouger&nbsp;? Je suis là pour lui donner vie — du code à l'image.</p>
          <a className="contact-mail reveal" data-d="2" href="mailto:contact@matthewle.fr" data-cursor="écrire">
            <span className="dot-arrow" style={{ width: 9, height: 9 }} /><span className="u">contact@matthewle.fr</span>
          </a>
        </div>
        <div className="contact-info">
          <div className="blk reveal"><span>Téléphone</span><a href="tel:+33615802246">(+33) 6 15 80 22 46</a></div>
          <div className="blk reveal" data-d="1"><span>Localisation</span><p>Genève, Suisse — 1201</p></div>
          <div className="blk reveal" data-d="2">
            <span>Réseaux</span>
            <div className="socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="voir">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="voir">LinkedIn</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" data-cursor="voir">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
