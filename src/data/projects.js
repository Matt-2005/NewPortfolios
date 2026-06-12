/* Source unique des projets — partagée entre l'accueil et la page archive. */
export const PROJECTS = [
  {
    id: 'belki', num: '01', yr: '2024', cats: ['dev'], cursor: 'voir',
    img: '/media/projets/belki.jpg',
    kind: 'Site vitrine · Web design', role: 'Rôle : design + dev',
    name: ['Cabanes ', 'Belki'],
    meta: "Hébergements nature haut de gamme. Site immersif, moteur de réservation et direction artistique complète.",
    tags: ['React', 'GSAP', 'Design'], play: false,
  },
  {
    id: 'petits-reves', num: '02', yr: '2024', cats: ['dev'], cursor: 'voir',
    img: '/media/projets/petits-reves.jpg',
    kind: 'Site associatif · Multipage', role: 'Rôle : intégration',
    name: ['Petits Rêves ', "d'Enfants"],
    meta: "Plateforme d'une association humanitaire. Collecte de dons, accessibilité et clarté du message.",
    tags: ['CMS', 'SEO', 'Don en ligne'], play: false,
  },
  {
    id: 'above-lyon', num: '03', yr: '2025', cats: ['video', 'drone'], cursor: 'play',
    img: '/media/projets/above-lyon.jpg',
    kind: 'Film FPV · Montage', role: 'Rôle : pilote + montage',
    name: ['Above ', 'Genève'],
    meta: 'Court-métrage FPV au-dessus de la ville. Tournage drone, étalonnage et montage rythmé au son.',
    tags: ['Drone', 'DaVinci', 'Sound design'], play: true,
  },
  {
    id: 'sunset-ride', num: '04', yr: '2025', cats: ['video', 'moto'], cursor: 'play',
    img: '/media/projets/sunset-ride.jpg',
    kind: 'Vidéo moto · Réalisation', role: 'Rôle : réal + montage',
    name: ['450 ', 'Sunset Ride'],
    meta: 'Une sortie au coucher du soleil avec la CFMoto 450SR. Cadrage, vitesse et lumière rasante.',
    tags: ['CFMoto', 'Color grade', 'Edit'], play: true,
  },
  {
    id: 'bde', num: '05', yr: '2025', cats: ['dev'], cursor: 'voir', wide: true,
    img: '/media/projets/bde.jpg',
    kind: 'Application web · BDE', role: 'Rôle : full-stack',
    name: ['BDE ', 'SUPINFO'],
    meta: "Plateforme d'événements pour le bureau des étudiants. Billetterie, inscriptions et gestion en temps réel.",
    tags: ['Vue', 'Node', 'UI'], play: false,
  },
];

export const FILTERS = [
  { cat: 'all', label: 'Tout' },
  { cat: 'dev', label: 'Développement' },
  { cat: 'video', label: 'Vidéo' },
  { cat: 'drone', label: 'Drone' },
  { cat: 'moto', label: 'Moto' },
];
