import { PROFILE } from '../data/profile';
import { useLang } from '../i18n/lang';

/* Liens de profil (LinkedIn, GitHub…) — lus depuis data/profile.js. */
export default function Socials({ className = 'socials' }) {
  const { t } = useLang();
  return (
    <div className={className}>
      {PROFILE.socials.filter(s => s.url).map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noreferrer" data-cursor={t('voir', 'view')}>{s.label}</a>
      ))}
    </div>
  );
}
