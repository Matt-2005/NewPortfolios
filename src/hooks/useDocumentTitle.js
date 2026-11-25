import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://matthewle.fr';

/* Description lisible en entier dans Google (~155 caractères max). */
function clip(s, max = 155) {
  if (!s || s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

/* Met à jour une balise <meta> (la crée si besoin). */
function setMeta(attr, key, content) {
  let m = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.appendChild(m); }
  m.setAttribute('content', content);
}

/* Référencement de la page courante : titre, description, adresse
   canonique, aperçu de partage (Open Graph / Twitter) et indexation.
   `noindex` : page à ne pas indexer (ex. 404). */
export function useDocumentTitle(title, description, { noindex = false } = {}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
    document.title = title;
    if (description) {
      description = clip(description);
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('property', 'og:url', url);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, pathname, noindex]);
}
