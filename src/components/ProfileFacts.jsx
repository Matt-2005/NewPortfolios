import { FACTS } from '../data/profile';
import { useLang } from '../i18n/lang';

/* « Profil en bref » — les réponses aux questions qu'un recruteur
   se pose en premier, lisibles en un coup d'œil. */
export default function ProfileFacts({ compact = false }) {
  const { t } = useLang();
  return (
    <dl className={'facts' + (compact ? ' compact' : '')}>
      {FACTS.map((f, i) => (
        <div className={'fact reveal' + (f.accent ? ' accent' : '')} data-d={!compact && i % 3 ? String(i % 3) : undefined} key={f.k.fr}>
          <dt>{t(f.k)}</dt>
          <dd>{t(f.v)}</dd>
        </div>
      ))}
    </dl>
  );
}
