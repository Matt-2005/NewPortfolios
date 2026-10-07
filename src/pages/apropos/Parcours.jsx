import { PARCOURS } from '../../data/content';

export default function Parcours() {
  return (
    <section className="parcours" id="parcours">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="line-mask"><span>Le parcours <em>— année par année</em></span></h2>
          <span className="num reveal">(02) — Repères</span>
        </div>

        <ol className="par-list">
          {PARCOURS.map(item => (
            <li className="par-row" key={item.yr}>
              <div className="par-yr-mask"><div className="par-yr mono">{item.yr}</div></div>
              <div className="par-text">
                <span className="par-tag">{item.tag}</span>
                <h3>{item.title[0]}<em>{item.title[1]}</em>{item.title[2]}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
