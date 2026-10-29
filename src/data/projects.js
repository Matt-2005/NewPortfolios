/* Source unique des expériences ET des projets — partagée entre l'accueil
   et la page « Expériences & projets ». Ordre = ordre d'affichage.

   type: 'exp'  → expérience professionnelle : carte typographique
                  (entreprise en grand), période, lieu, missions dépliables.
   type: 'proj' → projet : visuel (public/media/projets/…) ou nom en grand.
   draft: true  → projet data PROPOSÉ, pas encore réalisé : visible
                  uniquement en développement (npm run dev).
   home: true   → affiché sur l'accueil.
   wide: true   → la carte prend toute la largeur. */
export const PROJECTS = [
  /* ——————————————— Expériences ——————————————— */
  {
    id: 'sncf', type: 'exp', home: true, wide: true, cats: ['exp', 'data'],
    yr: '2026',
    period: { fr: 'Juil. 2026 — aujourd’hui', en: 'Jul 2026 — present' },
    company: 'SNCF', place: { fr: 'SNCF Holding · Lyon', en: 'SNCF Holding · Lyon' },
    kind: { fr: 'Alternance · Direction Cybersécurité', en: 'Work-study · Cybersecurity division' },
    name: { fr: ['Développeur & ', 'ingénieur BI'], en: ['Developer & ', 'BI engineer'] },
    meta: {
      fr: "Dans une équipe de 5 personnes, je fais évoluer PCM, l'application qui centralise la conformité cybersécurité de tous les projets du groupe (environ 1 000 projets), et je construis le reporting Power BI de la direction.",
      en: 'In a five-person team, I develop PCM, the application that centralises cybersecurity compliance for every project in the group (around 1,000 projects), and I build the Power BI reporting for senior management.',
    },
    points: {
      fr: [
        'Application Power BI qui croise les exports de PCM avec d’autres sources SNCF : nettoyage des données, modèle en étoile, mesures DAX dynamiques, tableaux de bord pour la direction',
        'Optimisation des requêtes SQL (PostgreSQL) pour garder l’application fluide au quotidien',
        'Développement et maintien en conditions opérationnelles de PCM (Angular, Spring Boot), qui remplace une application Power Apps devenue trop lente',
        'Gestion fine des habilitations : chaque utilisateur ne voit que son périmètre, dans un cadre ANSSI / NIS 2',
        'Priorisation des besoins utilisateurs avec la cheffe de projet ; montée en compétence vers le rôle de Product Owner',
        'Deux formations Power BI suivies (intermédiaire et expert)',
      ],
      en: [
        'Power BI application combining PCM exports with other SNCF sources: data cleaning, star schema, dynamic DAX measures, dashboards for senior management',
        'SQL query optimisation (PostgreSQL) to keep the application fast in daily use',
        'Development and maintenance of PCM (Angular, Spring Boot), which replaced a Power Apps tool that had become too slow',
        'Fine-grained access control: each user only sees their own scope, within an ANSSI / NIS 2 framework',
        'Prioritising user needs with the project manager; growing into a Product Owner role',
        'Two Power BI training courses completed (intermediate and expert)',
      ],
    },
    tags: ['Power BI', 'DAX', 'SQL', 'PostgreSQL', 'Spring Boot', 'Angular'],
  },
  {
    id: 'vicat', type: 'exp', home: true, cats: ['exp'],
    yr: '2025',
    period: { fr: 'Oct. 2025 — juin 2026', en: 'Oct 2025 — Jun 2026' },
    company: 'VICAT', place: { fr: 'L’Isle-d’Abeau · DSI', en: 'L’Isle-d’Abeau · IT department' },
    kind: { fr: 'Alternance · Pôle DevOps', en: 'Work-study · DevOps team' },
    name: { fr: ['Ingénieur ', 'DevOps'], en: ['DevOps ', 'engineer'] },
    meta: {
      fr: "Groupe cimentier international (10 000 collaborateurs, 12 pays dont la Suisse). J'ai fiabilisé les pipelines de déploiement et l'infrastructure AWS, et mené la montée de version de la passerelle d'API du groupe.",
      en: 'International cement group (10,000 employees, 12 countries including Switzerland). I made deployment pipelines and AWS infrastructure more reliable, and led the upgrade of the group’s API gateway.',
    },
    points: {
      fr: [
        'Projet interne Kafka : communication résiliente entre entités en cas de coupure réseau, environnements local et production alignés',
        'Montée de version de WSO2 API Manager (4.2 → 4.6) : architecture découpée en 3 composants, conteneurs Docker et infrastructure Terraform repensés',
        'Migration complète d’une application (front Vercel, back DigitalOcean, base locale) vers l’infrastructure AWS du groupe',
        'Maintien et correction des pipelines CI/CD GitLab (YAML) et de l’infrastructure AWS décrite en Terraform',
      ],
      en: [
        'Internal Kafka project: resilient communication between sites during network outages, with local and production environments aligned',
        'WSO2 API Manager upgrade (4.2 → 4.6): architecture split into 3 components, Docker containers and Terraform infrastructure redesigned',
        'Full migration of an application (Vercel front end, DigitalOcean back end, local database) to the group’s AWS infrastructure',
        'Maintaining and fixing GitLab CI/CD pipelines (YAML) and AWS infrastructure defined in Terraform',
      ],
    },
    tags: ['AWS', 'Terraform', 'Docker', 'Kafka', 'GitLab CI/CD'],
  },
  {
    id: 'webdesignco', type: 'exp', home: true, cats: ['exp', 'dev'],
    yr: '2024',
    period: { fr: '2024 — aujourd’hui', en: '2024 — present' },
    company: 'WebDesign&Co', place: { fr: 'Agence web', en: 'Web agency' },
    kind: { fr: 'Entrepreneuriat', en: 'Entrepreneurship' },
    name: { fr: ['Co-', 'fondateur'], en: ['Co-', 'founder'] },
    meta: {
      fr: "Agence de création de sites web que j'ai cofondée : design sous Figma, développement React, maintenance et gestion de l'entreprise.",
      en: 'Web design agency I co-founded: design in Figma, development in React, maintenance and running the business.',
    },
    url: 'https://webdesignco.agency/',
    tags: ['React', 'Figma', { fr: 'Gestion d’entreprise', en: 'Business management' }],
  },
  {
    id: 'hola', type: 'exp', home: true, cats: ['exp', 'dev'],
    yr: '2024',
    period: { fr: 'Déc. 2024 — mars 2025', en: 'Dec 2024 — Mar 2025' },
    company: 'Hola la Déco', place: { fr: 'Stage à temps partiel', en: 'Part-time internship' },
    kind: { fr: 'Stage', en: 'Internship' },
    name: { fr: ['Développeur ', 'web'], en: ['Web ', 'developer'] },
    meta: {
      fr: 'Conception et développement du site de Hola la Déco sous WordPress, maquettes Figma. Seul sur le projet, de la gestion à la mise en ligne.',
      en: 'Designed and built the Hola la Déco website on WordPress, with Figma mock-ups. Sole owner of the project, from planning to launch.',
    },
    tags: ['WordPress', 'Figma', { fr: 'Gestion de projet', en: 'Project management' }],
  },

  /* ——————————————— Projets ——————————————— */
  {
    id: 'istore', type: 'proj', home: true, wide: true, cats: ['data', 'dev'],
    yr: '2025', period: { fr: 'Février 2025', en: 'February 2025' },
    img: '/media/projets/istore.jpg',
    kind: { fr: 'Projet académique · Application', en: 'Academic project · Application' },
    role: { fr: 'Développeur & data', en: 'Developer & data' },
    name: { fr: ['Application ', 'iStore'], en: ['iStore ', 'application'] },
    meta: {
      fr: "Application de gestion de magasins, d'employés et d'articles : modèle de données relationnel en SQL, logique métier en Java, code documenté avec JavaDoc.",
      en: 'Store, staff and inventory management application: relational data model in SQL, business logic in Java, code documented with JavaDoc.',
    },
    tags: ['Java', 'SQL', { fr: 'Modélisation', en: 'Data modelling' }],
  },
  {
    id: 'cff', type: 'proj', draft: true, yr: '2026', cats: ['data'],
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
    id: 'logement-ge', type: 'proj', draft: true, yr: '2026', cats: ['data'],
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
    id: 'energie-ch', type: 'proj', draft: true, yr: '2026', cats: ['data'],
    img: '/media/projets/energie-ch.jpg',
    kind: { fr: 'Streaming · Qualité des données', en: 'Streaming · Data quality' },
    role: { fr: 'Projet personnel', en: 'Personal project' },
    name: { fr: ['Énergie ', 'suisse'], en: ['Swiss ', 'energy'] },
    meta: {
      fr: "Production et consommation d'électricité en Suisse (données ouvertes) : ingestion avec Kafka et Python, tests de qualité automatisés et dashboard Power BI.",
      en: 'Electricity production and consumption in Switzerland (open data): ingestion with Kafka and Python, automated data quality checks and a Power BI dashboard.',
    },
    tags: ['Kafka', 'Python', 'Power BI'],
  },
  {
    id: 'bde', type: 'proj', yr: '2025', cats: ['dev'],
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
    id: 'belki', type: 'proj', yr: '2024', cats: ['dev'],
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
    id: 'petits-reves', type: 'proj', yr: '2024', cats: ['dev'],
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
    id: 'above-geneve', type: 'proj', yr: '2025', cats: ['creative'], play: true,
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
    id: 'sunset-ride', type: 'proj', yr: '2025', cats: ['creative'], play: true,
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

export const HOME_PROJECTS = VISIBLE_PROJECTS.filter(p => p.home);

export const FILTERS = [
  { cat: 'all', label: { fr: 'Tout', en: 'All' } },
  { cat: 'exp', label: { fr: 'Expériences', en: 'Experience' } },
  { cat: 'data', label: { fr: 'Data', en: 'Data' } },
  { cat: 'dev', label: { fr: 'Web & applications', en: 'Web & apps' } },
  { cat: 'creative', label: { fr: 'Vidéo & drone', en: 'Video & drone' } },
];
