import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { projectPath } from '../data/projects';
import Icon from './Icon';

const DEV = import.meta.env.DEV;

/* Carte de la grille « expériences & projets » — toute la carte mène
   à la page détaillée du projet.
   - projet : photo si elle existe (sinon le nom en grand)
   - expérience : carte typographique (entreprise en grand, période, lieu)
   Props CSS --rv / --py pilotées par la grille. */
export default function ProjectCard({ p, showYear = false, cardRef }) {
  const { go } = useApp();
  const { t } = useLang();
  const [hasPhoto, setHasPhoto] = useState(false);
  const isExp = p.type === 'exp';
  const href = projectPath(p);

  useEffect(() => {
    if (!p.img) return;
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = p.img;
    return () => { on = false; };
  }, [p.img]);

  const name = t(p.name);
  const mark = isExp ? p.company : name.join('').trim();

  return (
    <article
      ref={cardRef}
      className={'proj-card'
        + (isExp ? ' is-exp' : '')
        + (p.wide ? ' wide' : '')
        + (hasPhoto ? ' has-photo' : '')
        + (p.draft ? ' is-draft' : '')}
      data-cursor={t('voir', 'view')}
      onClick={() => go(href)}
      style={p.img ? { '--img': `url('${p.img}')` } : undefined}
    >
      <div className="proj-media">
        {!hasPhoto && <span className="proj-mark" aria-hidden="true">{mark}</span>}
        {!hasPhoto && !isExp && DEV && p.img && <span className="ph-tag">{p.img.replace(/^\//, '')}</span>}
        <span className="proj-num mono">{isExp ? t('Expérience', 'Experience') : t('Projet', 'Project')}</span>
        {(p.period || (showYear && p.yr)) && <span className="proj-yr mono">{p.period ? t(p.period) : p.yr}</span>}
        {isExp && p.place && <span className="proj-place mono">{t(p.place)}</span>}
        {p.draft && <span className="proj-draft mono">{t('Brouillon — visible en dev uniquement', 'Draft — dev only')}</span>}
        <span className="proj-go" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </span>
      </div>
      <div className="proj-info">
        <span className="kind mono">{isExp ? p.company + ' · ' : ''}{t(p.kind)}{showYear && p.role ? ' · ' + t(p.role) : ''}</span>
        <h3 className="name">
          {/* toute la carte est cliquable ; le lien sert au clavier et au clic droit */}
          <a className="proj-link" href={href} onClick={e => { e.preventDefault(); e.stopPropagation(); go(href); }}>
            {name[0]}<em>{name[1]}</em>
          </a>
        </h3>
        <p className="meta">{t(p.meta)}</p>
        <div className="proj-tags">{p.tags.map(tag => { const l = t(tag); return <span key={l}>{l}</span>; })}</div>
        <span className="proj-more mono" aria-hidden="true">{t('Voir le détail', 'See details')} <Icon name="arrow-right" /></span>
      </div>
    </article>
  );
}
