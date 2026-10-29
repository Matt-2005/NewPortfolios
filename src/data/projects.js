/* Source unique des expériences ET des projets.
   Chaque entrée a une carte (accueil, /projets) et sa page détaillée
   (/projets/<id>). Ordre du tableau = ordre d'affichage.

   type: 'exp'  → expérience pro : carte typographique (entreprise en grand)
   type: 'proj' → projet : visuel (public/media/projets/…) ou nom en grand
   parent       → id de l'expérience dont le projet fait partie
                  (ex. les sites clients de WebDesign&Co)
   home: true   → affiché sur l'accueil      wide: true → pleine largeur
   draft: true  → projet data PROPOSÉ, non réalisé : visible en dev uniquement
   todo         → infos manquantes : liste des questions affichée en dev
                  sur la page du projet (jamais en production)

   detail : contenu de la page
     intro     paragraphe d'ouverture
     facts     fiche [{ k, v }]
     context   paragraphes « Contexte »
     missions  [{ title, text }] — « Ce que j'ai fait »
     results   paragraphes « Résultats »
     learned   paragraphes « Ce que j'en retiens »
   Tous les textes sont { fr, en }. */

const T = (fr, en) => ({ fr, en });

export const PROJECTS = [
  /* ——————————————— Expériences ——————————————— */
  {
    id: 'sncf', type: 'exp', home: true, wide: true, cats: ['exp', 'data'],
    yr: '2026',
    period: T('Juil. 2026 — aujourd’hui', 'Jul 2026 — present'),
    company: 'SNCF', place: T('SNCF Holding · Lyon', 'SNCF Holding · Lyon'),
    kind: T('Alternance · Direction Cybersécurité', 'Work-study · Cybersecurity division'),
    name: T(['Développeur & ', 'ingénieur BI'], ['Developer & ', 'BI engineer']),
    meta: T(
      "Ma 2e année d'alternance. Dans une équipe de 5 personnes, je fais évoluer PCM, l'application qui centralise la conformité cybersécurité de tous les projets du groupe (environ 1 000 projets), et je construis le reporting Power BI de la direction.",
      'My second year of work-study. In a five-person team, I develop PCM, the application that centralises cybersecurity compliance for every project in the group (around 1,000 projects), and I build the Power BI reporting for senior management.'
    ),
    tags: ['Power BI', 'DAX', 'SQL', 'PostgreSQL', 'Spring Boot', 'Angular'],
    detail: {
      intro: T(
        "Depuis juillet 2026, je travaille à la direction Cybersécurité de la SNCF Holding, à Lyon, sur un poste hybride : développement d'une application métier et Business Intelligence sous Power BI. C'est ma deuxième année d'alternance.",
        'Since July 2026 I have been working in the cybersecurity division of SNCF Holding in Lyon, in a hybrid role: developing a business application and building Business Intelligence in Power BI. This is my second year of work-study.'
      ),
      facts: [
        { k: T('Période', 'Period'), v: T('Juillet 2026 — aujourd’hui', 'July 2026 — present') },
        { k: T('Contrat', 'Contract'), v: T('Alternance · 2e année d’expérience', 'Work-study · 2nd year of experience') },
        { k: T('Lieu', 'Location'), v: T('Tour Oxygène, Lyon', 'Tour Oxygène, Lyon') },
        { k: T('Équipe', 'Team'), v: T('5 personnes, pôle cybersécurité de la Holding', '5 people, Holding cybersecurity unit') },
        { k: T('Rôle', 'Role'), v: T('Développeur & ingénieur BI', 'Developer & BI engineer') },
      ],
      context: [
        T(
          'Le groupe SNCF compte environ 284 000 collaborateurs et plusieurs sociétés (SNCF Voyageurs, SNCF Réseau…). La Holding gère les services communs à tout le groupe, dont la cybersécurité. Les infrastructures ferroviaires sont classées d’importance vitale : la SNCF est soumise aux exigences de l’ANSSI, bientôt renforcées par la directive européenne NIS 2.',
          'The SNCF group has around 284,000 employees and several companies (SNCF Voyageurs, SNCF Réseau…). The Holding runs services shared across the group, including cybersecurity. Rail infrastructure is classified as vital: SNCF must meet ANSSI requirements, soon strengthened by the EU NIS 2 directive.'
        ),
        T(
          'Mon équipe veille à ce que chaque projet informatique des 5 sociétés du groupe suive un parcours de conformité cybersécurité, du cahier des charges à la mise en production : analyse de risque, contrôles et validations.',
          'My team makes sure every IT project across the group’s five companies follows a cybersecurity compliance path, from specifications to production: risk analysis, controls and sign-offs.'
        ),
      ],
      missions: [
        {
          title: T('Reporting Power BI pour la direction', 'Power BI reporting for senior management'),
          text: T(
            'Je déploie une application Power BI qui croise les données exportées de PCM avec d’autres sources de la SNCF, pour donner à la direction une vue globale de l’avancement de la sécurité sur tous les projets. Nettoyage des tables importées, modèle en étoile, connexion de plusieurs sources, mesures DAX dynamiques qui suivent les filtres de l’utilisateur. À terme, ce volet data deviendra ma mission principale.',
            'I am rolling out a Power BI application that combines data exported from PCM with other SNCF sources, giving senior management an overall view of security progress across all projects. Cleaning imported tables, star schema, connecting several sources, dynamic DAX measures that follow the user’s filters. Over time, this data work will become my main mission.'
          ),
        },
        {
          title: T('Application PCM (Parcours Cyber Métier)', 'PCM application (Cyber compliance path)'),
          text: T(
            'J’ai repris le développement de PCM, l’outil qui centralise toutes les données de conformité cybersécurité des projets du groupe. Il remplace une application Power Apps devenue trop lente face au volume de données. J’en assure le maintien en conditions opérationnelles et j’ajoute les fonctionnalités demandées par les utilisateurs, côté ergonomie comme côté logique métier (Angular, Spring Boot).',
            'I took over development of PCM, the tool that centralises all cybersecurity compliance data for the group’s projects. It replaced a Power Apps tool that had become too slow for the data volume. I keep it running and add the features users ask for, both UX and business logic (Angular, Spring Boot).'
          ),
        },
        {
          title: T('Base de données et performance', 'Database and performance'),
          text: T(
            'La base PostgreSQL recense environ un millier de projets : la moindre erreur de conception ralentirait toute l’application. J’analyse les temps d’exécution et j’optimise les requêtes SQL pour garder un rendu fluide au quotidien. J’explore et j’édite les données avec DBGate, de préférence en SQL.',
            'The PostgreSQL database holds around a thousand projects: any design mistake would slow the whole application down. I analyse execution times and optimise SQL queries to keep it fast in daily use. I explore and edit data with DBGate, preferably in SQL.'
          ),
        },
        {
          title: T('Sécurité et habilitations', 'Security and access control'),
          text: T(
            'L’application recense les failles et mesures de sécurité de tous les projets du groupe : chaque route d’API vérifie que l’utilisateur connecté a bien les droits, et chacun ne voit que son périmètre. Un responsable cybersécurité ne doit jamais accéder aux projets d’une autre filiale.',
            'The application lists the vulnerabilities and security measures of every project in the group: each API route checks the signed-in user’s rights, and everyone only sees their own scope. A security officer must never access another subsidiary’s projects.'
          ),
        },
        {
          title: T('Priorisation et rôle produit', 'Prioritisation and product role'),
          text: T(
            'Les demandes arrivent sous forme de tickets priorisés, discutés deux fois par semaine avec mon tuteur et la cheffe de projet. Je recueille les retours lors des démonstrations, j’évalue si une demande peut servir à plus d’utilisateurs, et je décide des choix techniques avec mon tuteur. L’équipe me fait monter en compétence vers le rôle de Product Owner.',
            'Requests come in as prioritised tickets, discussed twice a week with my mentor and the project manager. I collect feedback during demos, assess whether a request can serve more users, and make technical decisions with my mentor. The team is training me towards a Product Owner role.'
          ),
        },
      ],
      results: [
        T(
          'Les responsables cybersécurité retrouvent en un seul endroit l’état d’avancement de tous les projets de leur périmètre, et la direction dispose d’une vue d’ensemble dans Power BI. Ici, la valeur se mesure au nombre d’utilisateurs qui s’appuient sur PCM, à la qualité des données et à l’usage des tableaux de bord.',
          'Security officers find the progress of every project in their scope in one place, and senior management gets an overall view in Power BI. Here, value is measured by how many users rely on PCM, by data quality and by dashboard usage.'
        ),
      ],
      learned: [
        T(
          'Travailler en autonomie dans une culture de confiance, gérer mes priorités et mon temps. Et un point à travailler : communiquer davantage en dehors des réunions prévues, pour améliorer mon travail en continu.',
          'Working autonomously in a culture of trust, managing my own priorities and time. And something I am working on: communicating more outside scheduled meetings, to keep improving my work continuously.'
        ),
      ],
    },
  },
  {
    id: 'vicat', type: 'exp', home: true, cats: ['exp'],
    yr: '2025',
    period: T('Oct. 2025 — juin 2026', 'Oct 2025 — Jun 2026'),
    company: 'VICAT', place: T('L’Isle-d’Abeau · DSI', 'L’Isle-d’Abeau · IT department'),
    kind: T('Alternance · Pôle DevOps', 'Work-study · DevOps team'),
    name: T(['Ingénieur ', 'DevOps'], ['DevOps ', 'engineer']),
    meta: T(
      "Ma 1re année d'alternance, dans un groupe cimentier international (10 000 collaborateurs, 12 pays dont la Suisse). J'ai fiabilisé les pipelines de déploiement et l'infrastructure AWS, et mené la montée de version de la passerelle d'API du groupe.",
      'My first year of work-study, in an international cement group (10,000 employees, 12 countries including Switzerland). I made deployment pipelines and AWS infrastructure more reliable, and led the upgrade of the group’s API gateway.'
    ),
    tags: ['AWS', 'Terraform', 'Docker', 'Kafka', 'GitLab CI/CD'],
    detail: {
      intro: T(
        "D'octobre 2025 à juin 2026, j'ai été ingénieur DevOps en alternance à la DSI du groupe VICAT, au siège de L'Isle-d'Abeau. Mon rôle : fluidifier, automatiser et sécuriser le déploiement des applications, entre les équipes de développement et d'exploitation.",
        "From October 2025 to June 2026 I was a work-study DevOps engineer in the IT department of the VICAT group, at its headquarters in L'Isle-d'Abeau. My job: make application deployment smoother, automated and secure, bridging development and operations teams."
      ),
      facts: [
        { k: T('Période', 'Period'), v: T('Octobre 2025 — juin 2026', 'October 2025 — June 2026') },
        { k: T('Contrat', 'Contract'), v: T('Alternance · 1re année d’expérience', 'Work-study · 1st year of experience') },
        { k: T('Lieu', 'Location'), v: T('Siège du groupe, L’Isle-d’Abeau (Isère)', 'Group HQ, L’Isle-d’Abeau (Isère)') },
        { k: T('Équipe', 'Team'), v: T('Pôle DevOps de la DSI', 'DevOps team, IT department') },
        { k: T('Rythme', 'Schedule'), v: T('2 jours à l’école, 3 jours en entreprise', '2 days at school, 3 days at work') },
      ],
      context: [
        T(
          'Fondé en 1853, VICAT est l’un des acteurs majeurs des matériaux de construction (ciment, béton, granulats) : plus de 10 000 collaborateurs, 17 cimenteries, une présence dans 12 pays dont la Suisse, et environ 3,9 milliards d’euros de chiffre d’affaires en 2025.',
          'Founded in 1853, VICAT is a major building materials player (cement, concrete, aggregates): over 10,000 employees, 17 cement plants, operations in 12 countries including Switzerland, and around €3.9 billion in revenue in 2025.'
        ),
        T(
          'Toute l’infrastructure cloud du groupe est hébergée chez AWS. Le pôle DevOps assure la disponibilité, la sécurité et la mise à jour continue des applications métier et des infrastructures qui pilotent les opérations du groupe.',
          'The group’s entire cloud infrastructure runs on AWS. The DevOps team ensures availability, security and continuous updates for the business applications and infrastructure that run the group’s operations.'
        ),
      ],
      missions: [
        {
          title: T('Montée de version de WSO2 API Manager', 'WSO2 API Manager upgrade'),
          text: T(
            'Mon projet le plus complexe : passer la passerelle d’API du groupe de la version 4.2 à 4.6, pour la sécurité et la performance. La nouvelle version sépare strictement la Gateway, le Traffic Manager et le Control Plane : j’ai restructuré les conteneurs Docker en trois images et redéfini l’architecture AWS en Terraform pour héberger les nouveaux composants.',
            'My most complex project: upgrading the group’s API gateway from version 4.2 to 4.6, for security and performance. The new version strictly separates the Gateway, Traffic Manager and Control Plane: I restructured the Docker containers into three images and redefined the AWS architecture in Terraform to host the new components.'
          ),
        },
        {
          title: T('Projet Kafka et harmonisation des environnements', 'Kafka project and environment alignment'),
          text: T(
            'Avec Kafka, les applications ne communiquent plus directement : elles publient et s’abonnent à des topics, ce qui rend l’ensemble plus résilient, notamment en cas de coupure réseau entre entités. J’ai aligné les environnements local et de production pour supprimer les bugs liés aux différences de configuration et accélérer les mises en production.',
            'With Kafka, applications no longer talk to each other directly: they publish and subscribe to topics, which makes the system more resilient, especially during network outages between sites. I aligned local and production environments to remove configuration-related bugs and speed up releases.'
          ),
        },
        {
          title: T('Migration d’un projet complet vers AWS', 'Full project migration to AWS'),
          text: T(
            'Un projet développé hors de l’infrastructure du groupe (front sur Vercel, back sur DigitalOcean, base de données en local) devait rejoindre AWS. J’ai créé toute l’infrastructure nécessaire, migré chaque partie, puis redéployé le projet en production après validation de mon tuteur.',
            'A project built outside the group’s infrastructure (front end on Vercel, back end on DigitalOcean, local database) had to move to AWS. I built all the required infrastructure, migrated each part, then redeployed it to production after my mentor’s review.'
          ),
        },
        {
          title: T('Fiabilité des pipelines CI/CD', 'CI/CD pipeline reliability'),
          text: T(
            'J’ai repris les pipelines GitLab de l’ancien alternant : analyser, trouver les points bloquants, corriger les configurations YAML ou Terraform. Un travail peu visible mais essentiel, car un pipeline défaillant bloque toutes les équipes de développement.',
            'I took over the GitLab pipelines from the previous work-study student: analysing them, finding the blockers, fixing YAML or Terraform configurations. Low-visibility but essential work, since a broken pipeline blocks every development team.'
          ),
        },
        {
          title: T('Montée en compétence', 'Ramping up'),
          text: T(
            'Le premier mois a été consacré à l’autoformation : GitLab et l’intégration continue, la syntaxe YAML, les formations officielles AWS et Terraform, indispensable pour toutes mes missions.',
            'The first month was dedicated to self-training: GitLab and continuous integration, YAML, official AWS training and Terraform, which proved essential for all my missions.'
          ),
        },
      ],
      results: [
        T(
          'Ici, la valeur se mesure surtout à l’absence d’incident : des pipelines qui passent à nouveau, moins d’erreurs, des déploiements réussis, et une gestion des API plus robuste et plus sûre grâce à la mise à jour de WSO2. J’ai reçu de très bons retours de l’équipe à mon départ.',
          'Here, value is measured mainly by the absence of incidents: pipelines passing again, fewer errors, successful deployments, and a more robust, secure API management thanks to the WSO2 upgrade. The team gave me very positive feedback when I left.'
        ),
      ],
      learned: [
        T(
          'La sécurité se prévoit dès le début : décrire une infrastructure en Terraform oblige à penser chaque règle réseau et chaque permission, et aucun secret ne doit apparaître en clair dans un pipeline. J’ai aussi appris qu’une simple migration a toujours beaucoup d’impact : il faut tester, anticiper et documenter.',
          'Security is planned from day one: describing infrastructure in Terraform forces you to think through every network rule and permission, and no secret should ever appear in plain text in a pipeline. I also learned that even a simple migration always has a wide impact: you have to test, anticipate and document.'
        ),
      ],
    },
  },
  {
    id: 'webdesignco', type: 'exp', home: true, cats: ['exp', 'dev'],
    yr: '2024',
    period: T('2024 — aujourd’hui', '2024 — present'),
    company: 'WebDesign&Co', place: T('Agence web', 'Web agency'),
    kind: T('Entrepreneuriat', 'Entrepreneurship'),
    name: T(['Co-', 'fondateur'], ['Co-', 'founder']),
    meta: T(
      "Agence de création de sites web professionnels que j'ai cofondée : design sous Figma, développement, maintenance et gestion de l'entreprise. Sites réalisés pour Hola la Déco, Thermipose et GEAE Bâtiment.",
      'Professional web design agency I co-founded: design in Figma, development, maintenance and running the business. Websites delivered for Hola la Déco, Thermipose and GEAE Bâtiment.'
    ),
    url: 'https://webdesignco.agency/',
    tags: ['React', 'WordPress', 'Figma', T('Gestion d’entreprise', 'Business management')],
    detail: {
      intro: T(
        "En 2024, j'ai cofondé WebDesign&Co, une agence de création de sites web professionnels. Je m'occupe du design, du développement et de la maintenance des sites, ainsi que de la gestion de l'entreprise, en parallèle de mes études.",
        'In 2024 I co-founded WebDesign&Co, a professional web design agency. I handle the design, development and maintenance of the websites, as well as running the business, alongside my studies.'
      ),
      facts: [
        { k: T('Période', 'Period'), v: T('2024 — aujourd’hui', '2024 — present') },
        { k: T('Rôle', 'Role'), v: T('Co-fondateur', 'Co-founder') },
        { k: T('Activité', 'Business'), v: T('Création de sites web professionnels', 'Professional website design and development') },
      ],
      missions: [
        {
          title: T('Le site de l’agence', 'The agency website'),
          text: T(
            'Conception sous Figma et développement en React du site de WebDesign&Co, puis maintenance et améliorations continues.',
            'Designed in Figma and built in React, followed by ongoing maintenance and improvements.'
          ),
        },
        {
          title: T('Les sites de nos clients', 'Client websites'),
          text: T(
            'Du besoin du client à la mise en ligne : maquettes, développement et suivi. Les projets sont détaillés ci-dessous.',
            'From the client’s needs to launch: mock-ups, development and follow-up. The projects are detailed below.'
          ),
        },
        {
          title: T('La gestion de l’entreprise', 'Running the business'),
          text: T(
            'Faire vivre une entreprise en parallèle de mes études et de mon alternance.',
            'Running a company alongside my studies and my work-study role.'
          ),
        },
      ],
    },
    todo: [
      'Date de création exacte (mois/année) et nom de ton associé·e (si tu veux le citer)',
      'Nombre de clients / de sites livrés',
      'Ce que la gestion d’entreprise implique pour toi : devis, prospection, facturation… ?',
    ],
  },

  /* ——————————————— Projets ——————————————— */
  {
    id: 'hola-la-deco', type: 'proj', parent: 'webdesignco', yr: '2025', cats: ['dev'],
    period: T('Déc. 2024 — mars 2025', 'Dec 2024 — Mar 2025'),
    img: '/media/projets/hola-la-deco.jpg',
    kind: T('Site WordPress · WebDesign&Co', 'WordPress website · WebDesign&Co'),
    role: T('Seul sur le projet', 'Sole developer'),
    name: T(['Hola ', 'la Déco'], ['Hola ', 'la Déco']),
    meta: T(
      'Conception et développement du site de Hola la Déco sous WordPress, maquettes Figma. Seul sur le projet, de la gestion à la mise en ligne.',
      'Designed and built the Hola la Déco website on WordPress, with Figma mock-ups. Sole owner of the project, from planning to launch.'
    ),
    tags: ['WordPress', 'Figma', T('Gestion de projet', 'Project management')],
    detail: {
      intro: T(
        'De décembre 2024 à mars 2025, en stage alterné à temps partiel, j’ai conçu et développé le site internet de Hola la Déco avec le CMS WordPress.',
        'From December 2024 to March 2025, as a part-time internship, I designed and built the Hola la Déco website with the WordPress CMS.'
      ),
      facts: [
        { k: T('Période', 'Period'), v: T('Décembre 2024 — mars 2025', 'December 2024 — March 2025') },
        { k: T('Cadre', 'Setting'), v: T('Stage à temps partiel', 'Part-time internship') },
        { k: T('Rôle', 'Role'), v: T('Seul en charge du projet', 'Sole owner of the project') },
      ],
      missions: [
        {
          title: T('Gestion de projet', 'Project management'),
          text: T('J’ai été seul à piloter le projet, du recueil du besoin à la mise en ligne.', 'I ran the project on my own, from gathering requirements to launch.'),
        },
        {
          title: T('Maquettes et développement', 'Mock-ups and development'),
          text: T('Maquettes sous Figma, puis développement du site sous WordPress.', 'Mock-ups in Figma, then development on WordPress.'),
        },
      ],
    },
    todo: [
      'Activité de Hola la Déco (boutique ? décoratrice ?) et URL du site',
      'Fonctionnalités clés (pages, e-commerce, formulaire, SEO…)',
      'Un résultat concret (mise en ligne, trafic, retour du client…)',
      'Une capture d’écran : public/media/projets/hola-la-deco.jpg',
    ],
  },
  {
    id: 'thermipose', type: 'proj', parent: 'webdesignco', cats: ['dev'],
    img: '/media/projets/thermipose.jpg',
    kind: T('Site web · WebDesign&Co', 'Website · WebDesign&Co'),
    role: T('Conception & développement', 'Design & development'),
    name: T(['Thermipose', ''], ['Thermipose', '']),
    meta: T('Site web réalisé pour Thermipose avec WebDesign&Co.', 'Website built for Thermipose with WebDesign&Co.'),
    tags: ['WebDesign&Co'],
    detail: {
      intro: T('Site web réalisé pour Thermipose avec WebDesign&Co.', 'Website built for Thermipose with WebDesign&Co.'),
    },
    todo: [
      'Activité de Thermipose et URL du site',
      'Année et durée du projet',
      'Ton rôle exact et la stack (React ? WordPress ?)',
      'Fonctionnalités clés et un résultat concret',
      'Une capture d’écran : public/media/projets/thermipose.jpg',
    ],
  },
  {
    id: 'geae-batiment', type: 'proj', parent: 'webdesignco', cats: ['dev'],
    img: '/media/projets/geae-batiment.jpg',
    kind: T('Site web · WebDesign&Co', 'Website · WebDesign&Co'),
    role: T('Conception & développement', 'Design & development'),
    name: T(['GEAE ', 'Bâtiment'], ['GEAE ', 'Bâtiment']),
    meta: T('Site web réalisé pour GEAE Bâtiment avec WebDesign&Co.', 'Website built for GEAE Bâtiment with WebDesign&Co.'),
    tags: ['WebDesign&Co'],
    detail: {
      intro: T('Site web réalisé pour GEAE Bâtiment avec WebDesign&Co.', 'Website built for GEAE Bâtiment with WebDesign&Co.'),
    },
    todo: [
      'Activité de GEAE Bâtiment et URL du site',
      'Année et durée du projet',
      'Ton rôle exact et la stack (React ? WordPress ?)',
      'Fonctionnalités clés et un résultat concret',
      'Une capture d’écran : public/media/projets/geae-batiment.jpg',
    ],
  },
  {
    id: 'cff', type: 'proj', draft: true, yr: '2026', cats: ['data'],
    img: '/media/projets/cff.jpg',
    kind: T('Pipeline de données · Dashboard', 'Data pipeline · Dashboard'),
    role: T('Projet personnel', 'Personal project'),
    name: T(['Ponctualité ', 'CFF'], ['SBB ', 'punctuality']),
    meta: T(
      "Ingestion quotidienne des données ouvertes de circulation (opentransportdata.swiss), modélisation dans PostgreSQL et dashboard Power BI des retards par ligne et par gare.",
      'Daily ingestion of open train data (opentransportdata.swiss), modelling in PostgreSQL and a Power BI dashboard of delays by line and station.'
    ),
    tags: ['Python', 'SQL', 'Power BI'],
  },
  {
    id: 'logement-ge', type: 'proj', draft: true, yr: '2026', cats: ['data'],
    img: '/media/projets/logement-ge.jpg',
    kind: T('Modélisation · Business intelligence', 'Data modelling · Business intelligence'),
    role: T('Projet personnel', 'Personal project'),
    name: T(['Logement à ', 'Genève'], ['Housing in ', 'Geneva']),
    meta: T(
      "Modèle en étoile construit sur les données de l'OCSTAT : loyers, taux de vacance et construction par commune, restitués dans un tableau de bord interactif.",
      'Star schema built on OCSTAT open data: rents, vacancy rates and construction by municipality, delivered as an interactive dashboard.'
    ),
    tags: ['SQL', T('Modèle en étoile', 'Star schema'), 'Power BI'],
  },
  {
    id: 'energie-ch', type: 'proj', draft: true, yr: '2026', cats: ['data'],
    img: '/media/projets/energie-ch.jpg',
    kind: T('Streaming · Qualité des données', 'Streaming · Data quality'),
    role: T('Projet personnel', 'Personal project'),
    name: T(['Énergie ', 'suisse'], ['Swiss ', 'energy']),
    meta: T(
      "Production et consommation d'électricité en Suisse (données ouvertes) : ingestion avec Kafka et Python, tests de qualité automatisés et dashboard Power BI.",
      'Electricity production and consumption in Switzerland (open data): ingestion with Kafka and Python, automated data quality checks and a Power BI dashboard.'
    ),
    tags: ['Kafka', 'Python', 'Power BI'],
  },
  {
    id: 'belki', type: 'proj', yr: '2024', cats: ['dev'],
    img: '/media/projets/belki.jpg',
    kind: T('Site vitrine · Réservation', 'Website · Booking'),
    role: T('Design + développement', 'Design + development'),
    name: T(['Cabanes ', 'Belki'], ['Cabanes ', 'Belki']),
    meta: T(
      'Hébergements nature haut de gamme. Site sur-mesure avec moteur de réservation, de la maquette à la mise en production.',
      'High-end nature lodges. Custom website with a booking engine, from mock-up to production.'
    ),
    tags: ['React', 'GSAP', 'Design'],
    todo: [
      'Projet réalisé avec WebDesign&Co ? (si oui, je le range avec les autres sites clients)',
      'URL, contexte du client et fonctionnement du moteur de réservation',
      'Une capture d’écran : public/media/projets/belki.jpg',
    ],
  },
  {
    id: 'petits-reves', type: 'proj', yr: '2024', cats: ['dev'],
    img: '/media/projets/petits-reves.jpg',
    kind: T('Site associatif · Multipage', 'Non-profit website · Multipage'),
    role: T('Intégration', 'Front-end integration'),
    name: T(['Petits Rêves ', "d'Enfants"], ['Petits Rêves ', "d'Enfants"]),
    meta: T(
      "Plateforme d'une association humanitaire : collecte de dons en ligne, accessibilité et clarté du message.",
      'Platform for a humanitarian charity: online donations, accessibility and a clear message.'
    ),
    tags: ['CMS', 'SEO', T('Dons en ligne', 'Online donations')],
    todo: [
      'Projet réalisé avec WebDesign&Co ?',
      'URL, CMS utilisé et ton rôle exact',
      'Une capture d’écran : public/media/projets/petits-reves.jpg',
    ],
  },
  {
    id: 'above-geneve', type: 'proj', yr: '2025', cats: ['creative'], play: true,
    img: '/media/projets/above-lyon.jpg',
    kind: T('Film FPV · Montage', 'FPV film · Editing'),
    role: T('Pilote + montage', 'Pilot + editor'),
    name: T(['Above ', 'Genève'], ['Above ', 'Geneva']),
    meta: T(
      'Court-métrage FPV au-dessus de la ville. Tournage drone, étalonnage et montage rythmé au son.',
      'FPV short film above the city. Drone filming, colour grading and an edit cut to the music.'
    ),
    tags: ['Drone', 'DaVinci', 'Sound design'],
  },
  {
    id: 'sunset-ride', type: 'proj', yr: '2025', cats: ['creative'], play: true,
    img: '/media/projets/sunset-ride.jpg',
    kind: T('Vidéo moto · Réalisation', 'Motorbike video · Direction'),
    role: T('Réalisation + montage', 'Director + editor'),
    name: T(['450 ', 'Sunset Ride'], ['450 ', 'Sunset Ride']),
    meta: T(
      'Une sortie au coucher du soleil avec la CFMoto 450SR. Cadrage, vitesse et lumière rasante.',
      'A sunset ride on the CFMoto 450SR. Framing, speed and low golden light.'
    ),
    tags: ['CFMoto', 'Color grade', 'Edit'],
  },
];

/* Les brouillons ne sortent jamais en production. */
const SHOW_DRAFTS = import.meta.env.DEV;
export const VISIBLE_PROJECTS = PROJECTS
  .filter(p => SHOW_DRAFTS || !p.draft)
  .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

export const HOME_PROJECTS = VISIBLE_PROJECTS.filter(p => p.home);

export const projectPath = p => '/projets/' + p.id;
export const findProject = id => VISIBLE_PROJECTS.find(p => p.id === id);
export const childProjects = id => VISIBLE_PROJECTS.filter(p => p.parent === id);

export const FILTERS = [
  { cat: 'all', label: { fr: 'Tout', en: 'All' } },
  { cat: 'exp', label: { fr: 'Expériences', en: 'Experience' } },
  { cat: 'data', label: { fr: 'Data', en: 'Data' } },
  { cat: 'dev', label: { fr: 'Web & applications', en: 'Web & apps' } },
  { cat: 'creative', label: { fr: 'Vidéo & drone', en: 'Video & drone' } },
];

/* Scène animée de l'en-tête (affichée tant qu'il n'y a pas de photo) :
   [scène, graine, couleur d'accent facultative] — voir src/lib/scenes.js */
const MOTION = {
  sncf: ['flow', 1],            // données → tableau de bord
  vicat: ['network', 2],        // messages Kafka entre serveurs
  webdesignco: ['layout', 3],   // maquettes de sites
  'hola-la-deco': ['layout', 4, 'oklch(0.64 0.11 195)'],  // bleu-vert
  thermipose: ['layout', 5, 'oklch(0.64 0.19 30)'],       // orange chaud
  'geae-batiment': ['layout', 6, 'oklch(0.74 0.15 75)'],  // ambre chantier
  belki: ['layout', 7, 'oklch(0.6 0.12 150)'],             // vert forêt
  'petits-reves': ['layout', 8, 'oklch(0.64 0.15 330)'],   // rose-violet
  cff: ['chart', 9],
  'logement-ge': ['chart', 10],
  'energie-ch': ['chart', 11],
  'above-geneve': ['flight', 12],
  'sunset-ride': ['flight', 13],
};
export const motionFor = p => MOTION[p.id] || [p.cats.includes('data') ? 'chart' : 'layout', p.id.length];
