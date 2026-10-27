import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* Langue du site (fr / en).
   t('texte FR', 'EN text')  → la version de la langue courante
   t({ fr, en })             → idem, pour les contenus des fichiers data
   Fonctionne aussi avec du JSX. */
const KEY = 'ml-lang';

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch (e) {}
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'fr';
  return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

const LangContext = createContext({ lang: 'fr', setLang: () => {}, t: a => a });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback(next => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  }, []);

  const t = useCallback((a, b) => {
    if (b === undefined && a && typeof a === 'object' && ('fr' in a || 'en' in a)) {
      return a[lang] !== undefined ? a[lang] : a.fr;
    }
    return lang === 'en' && b !== undefined ? b : a;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
