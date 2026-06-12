import { useApp } from '../context/AppContext';

const LINKS = [
  { idx: '01', label: 'Accueil', to: '/' },
  { idx: '02', label: 'À propos', to: '/#about' },
  { idx: '03', label: 'Parcours', to: '/#parcours' },
  { idx: '04', label: 'Projets', to: '/projets' },
  { idx: '05', label: 'Compétences', to: '/#skills' },
  { idx: '06', label: 'Contact', to: '/contact' },
];

export default function FsMenu() {
  const { go } = useApp();

  return (
    <nav className="fsmenu" aria-label="Navigation principale">
      <div className="fsmenu-list">
        {LINKS.map(l => (
          <a
            key={l.idx}
            href={l.to}
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
