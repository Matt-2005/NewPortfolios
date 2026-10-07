import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PAGES } from '../data/pages';

export default function FsMenu() {
  const { go } = useApp();
  const { pathname } = useLocation();

  return (
    <nav className="fsmenu" aria-label="Navigation principale">
      <div className="fsmenu-list">
        {PAGES.map(l => (
          <a
            key={l.idx}
            href={l.to}
            className={pathname === l.to ? 'current' : undefined}
            aria-current={pathname === l.to ? 'page' : undefined}
            onClick={e => { e.preventDefault(); go(l.to); }}
          >
            <span className="idx">{l.idx}</span>{l.label}<span className="serif-it arrow">↗</span>
          </a>
        ))}
      </div>
      <div className="fsmenu-foot">
        <div className="col">
          <span>Disponible</span>
          <p>Stage / freelance — 2026</p>
        </div>
        <div className="col socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="voir">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="voir">LinkedIn</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" data-cursor="voir">YouTube</a>
        </div>
        <div className="col">
          <span>Écrire</span>
          <a href="mailto:contact@matthewle.fr">contact@matthewle.fr</a>
        </div>
      </div>
    </nav>
  );
}
