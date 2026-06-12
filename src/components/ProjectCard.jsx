import { useEffect, useRef, useState } from 'react';

/* Carte projet — photo si elle existe (sinon cadre rayé + chemin),
   flèche au survol, props CSS --rv / --py pilotées par la grille. */
export default function ProjectCard({ p, showYear = false, cardRef }) {
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = p.img;
    return () => { on = false; };
  }, [p.img]);

  return (
    <article
      ref={cardRef}
      className={'proj-card' + (p.wide ? ' wide' : '') + (hasPhoto ? ' has-photo' : '')}
      data-cursor={p.cursor}
      style={{ '--img': `url('${p.img}')` }}
    >
      <div className="proj-media">
        {!hasPhoto && <span className="ph-tag">{p.img.replace(/^\//, '')}</span>}
        <span className="proj-num mono">{p.num}</span>
        {showYear && <span className="proj-yr mono">{p.yr}</span>}
        <span className="proj-go" aria-hidden="true">
          {p.play
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg>}
        </span>
      </div>
      <div className="proj-info">
        <span className="kind mono">{p.kind}{showYear ? ' · ' + p.role : ''}</span>
        <h3 className="name">{p.name[0]}<em>{p.name[1]}</em></h3>
        <p className="meta">{p.meta}</p>
        <div className="proj-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
      </div>
    </article>
  );
}
