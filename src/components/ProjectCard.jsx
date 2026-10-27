import { useEffect, useState } from 'react';
import { useLang } from '../i18n/lang';

const DEV = import.meta.env.DEV;

/* Carte projet — photo si elle existe (sinon cadre rayé ; le chemin du
   fichier attendu n'est affiché qu'en développement), flèche au survol,
   props CSS --rv / --py pilotées par la grille. */
export default function ProjectCard({ p, showYear = false, cardRef }) {
  const { t } = useLang();
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = p.img;
    return () => { on = false; };
  }, [p.img]);

  const name = t(p.name);

  return (
    <article
      ref={cardRef}
      className={'proj-card' + (p.wide ? ' wide' : '') + (hasPhoto ? ' has-photo' : '') + (p.draft ? ' is-draft' : '')}
      data-cursor={p.play ? 'play' : t('voir', 'view')}
      style={{ '--img': `url('${p.img}')` }}
    >
      <div className="proj-media">
        {!hasPhoto && DEV && <span className="ph-tag">{p.img.replace(/^\//, '')}</span>}
        <span className="proj-num mono">{p.num}</span>
        {showYear && <span className="proj-yr mono">{p.yr}</span>}
        {p.draft && <span className="proj-draft mono">{t('Brouillon — visible en dev uniquement', 'Draft — dev only')}</span>}
        <span className="proj-go" aria-hidden="true">
          {p.play
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg>}
        </span>
      </div>
      <div className="proj-info">
        <span className="kind mono">{t(p.kind)}{showYear ? ' · ' + t(p.role) : ''}</span>
        <h3 className="name">{name[0]}<em>{name[1]}</em></h3>
        <p className="meta">{t(p.meta)}</p>
        <div className="proj-tags">{p.tags.map(tag => { const l = t(tag); return <span key={l}>{l}</span>; })}</div>
      </div>
    </article>
  );
}
