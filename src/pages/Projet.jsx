import { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import { useReveals } from '../hooks/useReveals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectMotion } from '../hooks/useProjectMotion';
import { VISIBLE_PROJECTS, childProjects, findProject, projectPath } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import NextPage from '../components/NextPage';
import Footer from '../components/Footer';

const DEV = import.meta.env.DEV;

/* Page détaillée d'une expérience ou d'un projet : /projets/:id */
export default function Projet() {
  const { id } = useParams();
  const p = findProject(id);
  if (!p) return <Navigate to="/projets" replace />;
  return <ProjetPage p={p} key={p.id} />;
}

/* Un bloc « titre à gauche, texte à droite », aligné sur la grille du parcours */
function Block({ title, children }) {
  return (
    <section className="pp-block wrap">
      <h2 className="pp-block-title reveal">{title}</h2>
      <div className="pp-block-body reveal" data-d="1">{children}</div>
    </section>
  );
}

function ProjetPage({ p }) {
  const { go } = useApp();
  const { lang, t } = useLang();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const isExp = p.type === 'exp';
  const d = p.detail || {};
  const name = t(p.name);
  const title = name.join('').trim();
  const parent = p.parent ? findProject(p.parent) : null;
  const children = childProjects(p.id);
  const idx = VISIBLE_PROJECTS.findIndex(x => x.id === p.id);
  const next = VISIBLE_PROJECTS[(idx + 1) % VISIBLE_PROJECTS.length];
  const nextName = next.type === 'exp' ? next.company : t(next.name).join('').trim();
  const backTo = parent ? projectPath(parent) : '/projets';
  const backLabel = parent ? parent.company : t('Expériences & projets', 'Experience & projects');

  useDocumentTitle(
    (isExp ? p.company + ' — ' + title : title) + ' — Matthew LE',
    t(d.intro || p.meta)
  );
  useReveals(mainRef, lang);
  useProjectMotion(gridRef, [p.id]);

  useEffect(() => {
    if (!p.img) return;
    let on = true;
    const img = new Image();
    img.onload = () => { if (on) setHasPhoto(true); };
    img.src = p.img;
    return () => { on = false; };
  }, [p.img]);

  /* fiche : les infos du projet + les outils */
  const facts = [...(d.facts || [])];
  if (!d.facts && p.period) facts.push({ k: { fr: 'Période', en: 'Period' }, v: p.period });
  if (!d.facts && p.role) facts.push({ k: { fr: 'Rôle', en: 'Role' }, v: p.role });

  return (
    <main ref={mainRef}>
      <section className="page-head wrap pp-head">
        <a href={backTo} className="page-back" data-cursor={t('retour', 'back')} onClick={e => { e.preventDefault(); go(backTo); }}>← {backLabel}</a>
        <div className="eyebrow">
          {isExp ? t('Expérience', 'Experience') : t('Projet', 'Project')} — {isExp ? p.company + ' · ' + t(p.place) : t(p.kind)}
        </div>
        <h1>{name[0]}<em>{name[1]}</em></h1>
        <p className="page-intro">{t(d.intro || p.meta)}</p>
        {p.url && (
          <div className="pp-actions">
            <a className="btn" href={p.url} target="_blank" rel="noreferrer" data-cursor={t('voir', 'view')}>
              <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Voir le site', 'Visit website')} ↗</span>
            </a>
          </div>
        )}
      </section>

      <section className="wrap">
        <div
          className={'pp-banner reveal' + (isExp ? ' is-exp' : '') + (hasPhoto ? ' has-photo' : '')}
          style={p.img ? { '--img': `url('${p.img}')` } : undefined}
          data-navdark={isExp ? '' : undefined}
        >
          {!hasPhoto && <span className="proj-mark" aria-hidden="true">{isExp ? p.company : title}</span>}
          {p.period && <span className="proj-yr mono">{t(p.period)}</span>}
        </div>
      </section>

      {(facts.length > 0 || p.tags) && (
        <section className="wrap pp-facts">
          <dl className="facts">
            {facts.map(f => (
              <div className="fact reveal" key={f.k.fr}>
                <dt>{t(f.k)}</dt>
                <dd>{t(f.v)}</dd>
              </div>
            ))}
            <div className="fact reveal">
              <dt>{t('Outils', 'Tools')}</dt>
              <dd className="pp-chips">{p.tags.map(tag => { const l = t(tag); return <span key={l}>{l}</span>; })}</dd>
            </div>
          </dl>
        </section>
      )}

      {d.context && (
        <Block title={t('Contexte', 'Context')}>
          {d.context.map((c, i) => <p key={i}>{t(c)}</p>)}
        </Block>
      )}

      {d.missions && (
        <section className="wrap pp-missions">
          <div className="sec-head">
            <h2 className="line-mask"><span>{t(<>Ce que <em>j'ai fait</em></>, <>What <em>I did</em></>)}</span></h2>
            <span className="num reveal">({String(d.missions.length).padStart(2, '0')}) — {t('missions', 'missions')}</span>
          </div>
          <ol className="par-list">
            {d.missions.map((m, i) => (
              <li className="par-row" key={i}>
                <div className="par-yr-mask"><div className="par-yr mono">{String(i + 1).padStart(2, '0')}</div></div>
                <div className="par-text">
                  <h3>{t(m.title)}</h3>
                  <p>{t(m.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {children.length > 0 && (
        <section className="projects wrap pp-children">
          <div className="sec-head">
            <h2 className="line-mask"><span>{t(<>Sites <em>réalisés</em></>, <>Websites <em>delivered</em></>)}</span></h2>
            <span className="num reveal">({String(children.length).padStart(2, '0')}) — {p.company}</span>
          </div>
          <div className="proj-grid" ref={gridRef}>
            {children.map(c => <ProjectCard p={c} key={c.id} />)}
          </div>
        </section>
      )}

      {d.results && (
        <Block title={t('Résultats', 'Results')}>
          {d.results.map((c, i) => <p key={i}>{t(c)}</p>)}
        </Block>
      )}

      {d.learned && (
        <Block title={t("Ce que j'en retiens", 'What I take away')}>
          {d.learned.map((c, i) => <p key={i}>{t(c)}</p>)}
        </Block>
      )}

      {DEV && p.todo && (
        <section className="wrap">
          <div className="pp-todo mono">
            <b>À compléter — visible en développement uniquement</b>
            <ul>{p.todo.map(q => <li key={q}>{q}</li>)}</ul>
          </div>
        </section>
      )}

      <NextPage to={projectPath(next)} label={nextName} kicker={t('Suivant', 'Next')} />
      <Footer />
    </main>
  );
}
