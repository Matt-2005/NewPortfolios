import { useState } from 'react';
import { SKILLS } from '../../data/content';

function SkillItem({ s, d }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={'skill reveal' + (open ? ' open' : '')} data-d={d || undefined}>
      <button className="skill-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <h3>{s.title} <span className="pm">++</span></h3>
        <span className="skill-plus" aria-hidden="true" />
      </button>
      <p>{s.desc}</p>
      <div className="chips">{s.chips.map(c => <span key={c}>{c}</span>)}</div>
      <div className="skill-detail">
        <div className="skill-detail-inner">
          <div className="skill-detail-body">
            <p>{s.detail}</p>
            <ul>{s.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="line-mask"><span>Ce que je <em>fais</em></span></h2>
          <span className="num reveal">(03) — La boîte à outils</span>
        </div>
        <div className="skills-grid">
          {SKILLS.map((s, i) => <SkillItem s={s} d={i ? String(i) : ''} key={s.title} />)}
        </div>
      </div>
    </section>
  );
}
