import { useApp } from '../context/AppContext';

/* Grand lien de fin de page vers la page suivante. */
export default function NextPage({ to, label, kicker = 'Page suivante' }) {
  const { go } = useApp();
  return (
    <section className="next-page wrap">
      <a
        href={to}
        className="next-link"
        data-cursor="go"
        onClick={e => { e.preventDefault(); go(to); }}
      >
        <span className="next-kicker mono reveal">{kicker}</span>
        <span className="next-title line-mask"><span>{label} <em className="serif-it">↗</em></span></span>
      </a>
    </section>
  );
}
