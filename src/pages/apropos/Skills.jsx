import { useState } from 'react';
import { SKILLS } from '../../data/content';
import { useLang } from '../../i18n/lang';

function SkillItem({ s, d }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className={'skill reveal' + (open ? ' open' : '')} data-d={d || undefined}>
      <button className="skill-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <h3>
          {t(s.title)}{' '}
          {s.learning
            ? <span className="skill-learning mono">{t('en cours', 'learning')}</span>
            : <span className="pm">++</span>}
        </h3>
        <span className="skill-plus" aria-hidden="true" />
      </button>
      <p>{t(s.desc)}</p>
      <div className="chips">{s.chips.map(c => <span key={c}>{c}</span>)}</div>
      <div className="skill-detail">
        <div className="skill-detail-inner">
          <div className="skill-detail-body">
            <p>{t(s.detail)}</p>
            <ul>{t(s.points).map(pt => <li key={pt}>{pt}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLang();
  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="line-mask"><span>{t(<>Ce que je <em>fais</em></>, <>What I <em>do</em></>)}</span></h2>
          <span className="num reveal">{t('(02) — Compétences', '(02) — Skills')}</span>
        </div>
        <div className="skills-grid">
          {SKILLS.map((s, i) => <SkillItem s={s} d={i ? String(i) : ''} key={s.title.fr} />)}
        </div>
      </div>
    </section>
  );
}
