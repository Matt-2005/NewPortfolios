/* Icônes SVG du site. Elles remplacent les flèches et symboles en texte
   (↗ → ← ✦ ✕…), que les iPhone affichent en emoji couleur.
   Taille : 1em (suit la taille du texte), couleur : currentColor. */
const STROKES = {
  'arrow-up-right': <path d="M7 17 17 7M8.5 7H17v8.5" />,
  'arrow-right': <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  'arrow-left': <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  'arrow-up': <path d="M12 19.5v-15M6 10.5l6-6 6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export default function Icon({ name, className = '', strokeWidth = 1.7 }) {
  const cls = 'icon' + (className ? ' ' + className : '');
  if (name === 'spark') {
    return (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 1.5c.7 5.6 3 9 10.5 10.5C15 13.5 12.7 16.9 12 22.5 11.3 16.9 9 13.5 1.5 12 9 10.5 11.3 7.1 12 1.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false"
    >
      {STROKES[name]}
    </svg>
  );
}
