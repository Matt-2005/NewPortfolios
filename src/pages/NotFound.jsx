import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Icon from '../components/Icon';
import Footer from '../components/Footer';

/* Page introuvable : jamais indexée par les moteurs de recherche. */
export default function NotFound() {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  useDocumentTitle(t('Page introuvable — Matthew LE', 'Page not found — Matthew LE'), null, { noindex: true });
  useReveals(mainRef, lang);

  return (
    <main ref={mainRef}>
      <section className="page-head wrap">
        <div className="eyebrow">404</div>
        <h1>{t(<>Page <em>introuvable</em></>, <>Page <em>not found</em></>)}</h1>
        <p className="page-intro">{t(
          "Cette adresse n'existe pas ou a changé. Mes expériences et mes coordonnées sont à un clic.",
          'This address does not exist or has moved. My experience and contact details are one click away.'
        )}</p>
        <div className="pp-actions" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a className="btn accent" href="/" onClick={e => { e.preventDefault(); go('/'); }}>
            <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t("Retour à l'accueil", 'Back to home')}</span>
          </a>
          <a className="btn" href="/projets" onClick={e => { e.preventDefault(); go('/projets'); }}>
            <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Expériences', 'Experience')} <Icon name="arrow-right" /></span>
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
