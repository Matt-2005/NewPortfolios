/* Source unique des projets — partagée entre l'accueil et la page archive.

   draft: true  → projet data PROPOSÉ, pas encore réalisé. Il n'apparaît
                  qu'en développement (npm run dev), avec un badge
                  « Brouillon ». Une fois le projet fait, adaptez le texte
                  et supprimez `draft` : il passe en ligne.
   home: true   → éligible à l'accueil (les 4 premiers visibles s'affichent). */
export const PROJECTS = [
  {
    id: 'cff', draft: true, home: true, yr: '2026', cats: ['data'],
    img: '/media/projets/cff.jpg',
    kind: { fr: 'Pipeline de données · Dashboard', en: 'Data pipeline · Dashboard' },
    role: { fr: 'Projet personnel', en: 'Personal project' },
    name: { fr: ['Ponctualité ', 'CFF'], en: ['SBB ', 'punctuality'] },
    meta: {
      fr: "Ingestion quotidienne des données ouvertes de circulation (opentransportdata.swiss), modélisation dans PostgreSQL et dashboard Power BI des retards par ligne et par gare.",
      en: 'Daily ingestion of open train data (opentransportdata.swiss), modelling in PostgreSQL and a Power BI dashboard of delays by line and station.',
    },
    tags: ['Python', 'SQL', 'Power BI'],
  },
  {
    id: 'logement-ge', draft: true, home: true, yr: '2026', cats: ['data'],
    img: '/media/projets/logement-ge.jpg',
    kind: { fr: 'Modélisation · Business intelligence', en: 'Data modelling · Business intelligence' },
    role: { fr: 'Projet personnel', en: 'Personal project' },
    name: { fr: ['Logement à ', 'Genève'], en: ['Housing in ', 'Geneva'] },
    meta: {
      fr: "Modèle en étoile construit sur les données de l'OCSTAT : loyers, taux de vacance et construction par commune, restitués dans un tableau de bord interactif.",
      en: 'Star schema built on OCSTAT open data: rents, vacancy rates and construction by municipality, delivered as an interactive dashboard.',
    },
    tags: ['SQL', { fr: 'Modèle en étoile', en: 'Star schema' }, 'Power BI'],
  },
  {
    id: 'belki', home: true, yr: '2024', cats: ['dev'],
    img: '/media/projets/belki.jpg',
    kind: { fr: 'Site vitrine · Réservation', en: 'Website · Booking' },
    role: { fr: 'Design + développement', en: 'Design + development' },
    name: { fr: ['Cabanes ', 'Belki'], en: ['Cabanes ', 'Belki'] },
    meta: {
      fr: 'Hébergements nature haut de gamme. Site sur-mesure avec moteur de réservation, de la maquette à la mise en production.',
      en: 'High-end nature lodges. Custom website with a booking engine, from mock-up to production.',
    },
    tags: ['React', 'GSAP', 'Design'],
  },
  {
    id: 'petits-reves', home: true, yr: '2024', cats: ['dev'],
    img: '/media/projets/petits-reves.jpg',
    kind: { fr: 'Site associatif · Multipage', en: 'Non-profit website · Multipage' },
    role: { fr: 'Intégration', en: 'Front-end integration' },
    name: { fr: ['Petits Rêves ', "d'Enfants"], en: ['Petits Rêves ', "d'Enfants"] },
    meta: {
      fr: "Plateforme d'une association humanitaire : collecte de dons en ligne, accessibilité et clarté du message.",
      en: "Platform for a humanitarian charity: online donations, accessibility and a clear message.",
    },
    tags: ['CMS', 'SEO', { fr: 'Dons en ligne', en: 'Online donations' }],
  },
  {
    id: 'bde', home: true, yr: '2025', cats: ['dev'], wide: true,
    img: '/media/projets/bde.jpg',
    kind: { fr: 'Application web · Full-stack', en: 'Web application · Full-stack' },
    role: { fr: 'Full-stack', en: 'Full-stack' },
    name: { fr: ['BDE ', 'SUPINFO'], en: ['SUPINFO ', 'student union'] },
    meta: {
      fr: "Plateforme d'événements du bureau des étudiants : billetterie, inscriptions et suivi en temps réel, sur un modèle de données relationnel.",
      en: "Events platform for the student union: ticketing, registrations and real-time tracking, built on a relational data model.",
    },
    tags: ['Vue', 'Node', { fr: 'Base de données', en: 'Database' }],
  },
  {
    id: 'energie-ch', draft: true, yr: '2026', cats: ['data'],
    img: '/media/projets/energie-ch.jpg',
    kind: { fr: 'Qualité des données · Data viz', en: 'Data quality · Data viz' },
    role: { fr: 'Projet personnel', en: 'Personal project' },
    name: { fr: ['Énergie ', 'suisse'], en: ['Swiss ', 'energy'] },
    meta: {
      fr: "Production et consommation d'électricité en Suisse (données ouvertes) : scripts d'ingestion Python, tests de qualité automatisés et visualisation Tableau.",
      en: 'Electricity production and consumption in Switzerland (open data): Python ingestion scripts, automated data quality checks and a Tableau visualisation.',
    },
    tags: ['Python', { fr: 'Qualité', en: 'Data quality' }, 'Tableau'],
  },
  {
    id: 'above-geneve', yr: '2025', cats: ['creative'], play: true,
    img: '/media/projets/above-lyon.jpg',
    kind: { fr: 'Film FPV · Montage', en: 'FPV film · Editing' },
    role: { fr: 'Pilote + montage', en: 'Pilot + editor' },
    name: { fr: ['Above ', 'Genève'], en: ['Above ', 'Geneva'] },
    meta: {
      fr: 'Court-métrage FPV au-dessus de la ville. Tournage drone, étalonnage et montage rythmé au son.',
      en: 'FPV short film above the city. Drone filming, colour grading and an edit cut to the music.',
    },
    tags: ['Drone', 'DaVinci', 'Sound design'],
  },
  {
    id: 'sunset-ride', yr: '2025', cats: ['creative'], play: true,
    img: '/media/projets/sunset-ride.jpg',
    kind: { fr: 'Vidéo moto · Réalisation', en: 'Motorbike video · Direction' },
    role: { fr: 'Réalisation + montage', en: 'Director + editor' },
    name: { fr: ['450 ', 'Sunset Ride'], en: ['450 ', 'Sunset Ride'] },
    meta: {
      fr: 'Une sortie au coucher du soleil avec la CFMoto 450SR. Cadrage, vitesse et lumière rasante.',
      en: 'A sunset ride on the CFMoto 450SR. Framing, speed and low golden light.',
    },
    tags: ['CFMoto', 'Color grade', 'Edit'],
  },
];

/* Les brouillons ne sortent jamais en production. */
const SHOW_DRAFTS = import.meta.env.DEV;
export const VISIBLE_PROJECTS = PROJECTS
  .filter(p => SHOW_DRAFTS || !p.draft)
  .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

export const HOME_PROJECTS = VISIBLE_PROJECTS.filter(p => p.home).slice(0, 4);

export const FILTERS = [
  { cat: 'all', label: { fr: 'Tout', en: 'All' } },
  { cat: 'data', label: { fr: 'Data', en: 'Data' } },
  { cat: 'dev', label: { fr: 'Web & applications', en: 'Web & apps' } },
  { cat: 'creative', label: { fr: 'Vidéo & drone', en: 'Video & drone' } },
];
