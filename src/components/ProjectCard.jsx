import { useEffect, useId, useState } from 'react';
import { useLang } from '../i18n/lang';

const DEV = import.meta.env.DEV;

/* Carte de la grille « expériences & projets ».
   - projet : photo si elle existe (sinon le nom en grand), flèche au survol
   - expérience : carte typographique (entreprise en grand, période, lieu)
     + missions dépliables
   Props CSS --rv / --py pilotées par la grille. */
export default function ProjectCard({ p, showYear = false, cardRef }) {
  const { t } = useLang();
  const [hasPhoto, setHasPhoto] = useState(false);
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const isExp = p.type === 'exp';

  useEffect(() => {
    if (!p.img) return;
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = p.img;
    return () => { on = false; };
  }, [p.img]);

  const name = t(p.name);
  const points = p.points ? t(p.points) : null;
  const mark = isExp ? p.company : name.join('').trim();

  return (
    <article
      ref={cardRef}
      className={'proj-card'
        + (isExp ? ' is-exp' : '')
        + (p.wide ? ' wide' : '')
        + (hasPhoto ? ' has-photo' : '')
        + (p.draft ? ' is-draft' : '')
        + (open ? ' open' : '')}
      data-cursor={isExp ? undefined : p.play ? 'play' : t('voir', 'view')}
      style={p.img ? { '--img': `url('${p.img}')` } : undefined}
    >
      <div className="proj-media">
        {!hasPhoto && <span className="proj-mark" aria-hidden={!isExp}>{mark}</span>}
        {!hasPhoto && !isExp && DEV && p.img && <span className="ph-tag">{p.img.replace(/^\//, '')}</span>}
        <span className="proj-num mono">{isExp ? t('Expérience', 'Experience') : t('Projet', 'Project')}</span>
        {(isExp || showYear) && <span className="proj-yr mono">{p.period ? t(p.period) : p.yr}</span>}
        {isExp && p.place && <span className="proj-place mono">{t(p.place)}</span>}
        {p.draft && <span className="proj-draft mono">{t('Brouillon — visible en dev uniquement', 'Draft — dev only')}</span>}
        {!isExp && (
          <span className="proj-go" aria-hidden="true">
            {p.play
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg>}
          </span>
        )}
      </div>
      <div className="proj-info">
        <span className="kind mono">{t(p.kind)}{showYear && p.role ? ' · ' + t(p.role) : ''}</span>
        <h3 className="name">{name[0]}<em>{name[1]}</em></h3>
        <p className="meta">{t(p.meta)}</p>
        <div className="proj-tags">{p.tags.map(tag => { const l = t(tag); return <span key={l}>{l}</span>; })}</div>

        {(points || p.url) && (
          <div className="exp-actions">
            {points && (
              <button
                type="button"
                className="exp-more mono"
                aria-expanded={open}
                aria-controls={detailId}
                onClick={() => setOpen(o => !o)}
              >
                {open ? t('Masquer les missions', 'Hide details') : t('Voir les missions', 'See key missions')}
                <span className="skill-plus" aria-hidden="true" />
              </button>
            )}
            {p.url && (
              <a className="exp-link mono" href={p.url} target="_blank" rel="noreferrer" data-cursor={t('voir', 'view')}>
                {t('Voir le site', 'Visit site')} ↗
              </a>
            )}
          </div>
        )}
        {points && (
          <div className="exp-detail" id={detailId}>
            <div className="exp-detail-inner">
              <ul>{points.map(pt => <li key={pt}>{pt}</li>)}</ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
