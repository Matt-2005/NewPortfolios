import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PAGES } from '../data/pages';
import { PROFILE } from '../data/profile';
import { useLang } from '../i18n/lang';
import Socials from './Socials';

export default function FsMenu() {
  const { go } = useApp();
  const { pathname } = useLocation();
  const { t } = useLang();

  return (
    <nav className="fsmenu" aria-label={t('Navigation principale', 'Main navigation')}>
      <div className="fsmenu-list">
        {PAGES.map(l => (
          <a
            key={l.idx}
            href={l.to}
            className={pathname === l.to ? 'current' : undefined}
            aria-current={pathname === l.to ? 'page' : undefined}
            onClick={e => { e.preventDefault(); go(l.to); }}
          >
            <span className="idx">{l.idx}</span>{t(l.label)}<span className="serif-it arrow">↗</span>
          </a>
        ))}
      </div>
      <div className="fsmenu-foot">
        <div className="col">
          <span>{t('Recherche', 'Looking for')}</span>
          <p>{t('Premier poste data — 2028', 'First data role — 2028')}</p>
        </div>
        <Socials className="col socials" />
        <div className="col">
          <span>{t('Écrire', 'Email')}</span>
          <a href={'mailto:' + PROFILE.email}>{PROFILE.email}</a>
        </div>
      </div>
    </nav>
  );
}
