import { PARCOURS } from '../../data/content';
import { useLang } from '../../i18n/lang';

export default function Parcours() {
  const { t } = useLang();
  return (
    <section className="parcours" id="parcours">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="line-mask"><span>{t(<>Le parcours <em>— année par année</em></>, <>My path <em>— year by year</em></>)}</span></h2>
          <span className="num reveal">{t('(01) — Repères', '(01) — Milestones')}</span>
        </div>

        <ol className="par-list">
          {PARCOURS.map(item => {
            const title = t(item.title);
            return (
              <li className="par-row" key={item.yr}>
                <div className="par-yr-mask"><div className="par-yr mono">{item.yr}</div></div>
                <div className="par-text">
                  <span className="par-tag">{t(item.tag)}</span>
                  <h3>{title[0]}<em>{title[1]}</em>{title[2]}</h3>
                  <p>{t(item.text)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
