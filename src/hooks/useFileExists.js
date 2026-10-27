import { useEffect, useState } from 'react';

/* Vrai si le fichier public existe vraiment (le serveur d'une SPA
   renvoie index.html pour une URL inconnue : on l'écarte). */
export function useFileExists(src) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let on = true;
    fetch(src, { method: 'HEAD' })
      .then(r => {
        const type = r.headers.get('content-type') || '';
        if (on) setOk(r.ok && !type.includes('text/html'));
      })
      .catch(() => {});
    return () => { on = false; };
  }, [src]);
  return ok;
}
