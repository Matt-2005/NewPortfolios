import { useApp } from '../context/AppContext';
import { useLang } from '../i18n/lang';
import Icon from './Icon';

/* Grand lien de fin de page vers la page suivante. */
export default function NextPage({ to, label, kicker }) {
  const { go } = useApp();
  const { t } = useLang();
  return (
    <section className="next-page wrap">
      <a
        href={to}
        className="next-link"
        data-cursor="go"
        onClick={e => { e.preventDefault(); go(to); }}
      >
        <span className="next-kicker mono reveal">{kicker || t('Page suivante', 'Next page')}</span>
        <span className="next-title line-mask"><span>{label} <em className="next-arrow"><Icon name="arrow-up-right" strokeWidth={1.4} /></em></span></span>
      </a>
    </section>
  );
}
