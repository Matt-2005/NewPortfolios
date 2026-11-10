/* Contenus éditoriaux : parcours + compétences (FR / EN). */

export const PARCOURS = [
  {
    yr: '2023', tag: { fr: 'Formation', en: 'Education' },
    title: { fr: ['Entrée à ', 'SUPINFO', ' Lyon'], en: ['Joining ', 'SUPINFO', ' Lyon'] },
    text: {
      fr: "Master of Engineering en 5 ans, spécialité Ingénierie Data : bases de données, développement, réseaux, cloud. En parallèle, je deviens président du BDE et ambassadeur de l'école.",
      en: 'Five-year Master of Engineering, majoring in Data Engineering: databases, software development, networking, cloud. Alongside, I become student union president and a school ambassador.',
    },
  },
  {
    yr: '2024', tag: { fr: 'Entrepreneuriat', en: 'Entrepreneurship' },
    title: { fr: ['Cofondation de ', 'WebDesign&Co', ''], en: ['Co-founding ', 'WebDesign&Co', ''] },
    text: {
      fr: "Je cofonde une agence de création de sites web et j'enchaîne avec un stage chez Hola la Déco, seul sur le projet. J'y apprends à mener un site pour un client, du besoin à la mise en ligne.",
      en: 'I co-found a web design agency, then take on an internship at Hola la Déco as the only person on the project. I learn to take a client website from brief to launch.',
    },
  },
  {
    yr: '2025', tag: { fr: 'Alternance', en: 'Work-study' },
    title: { fr: ['Ingénieur ', 'DevOps', ' chez VICAT'], en: ['DevOps ', 'engineer', ' at VICAT'] },
    text: {
      fr: "Premier pas dans un grand groupe industriel international : pipelines GitLab CI/CD, infrastructure AWS en Terraform, Docker, Kafka et la montée de version de la passerelle d'API du groupe.",
      en: "My first role in a large international industrial group: GitLab CI/CD pipelines, AWS infrastructure in Terraform, Docker, Kafka and the upgrade of the group's API gateway.",
    },
  },
  {
    yr: '2026', tag: { fr: 'Alternance · Data', en: 'Work-study · Data' },
    title: { fr: ['Développeur & ', 'ingénieur BI', ' à la SNCF'], en: ['Developer & ', 'BI engineer', ' at SNCF'] },
    text: {
      fr: "À la direction Cybersécurité de la SNCF Holding : je développe l'application qui suit la conformité de tous les projets du groupe et je construis son reporting Power BI. C'est ma 2e année d'alternance, et j'entre en cycle Master (4e année sur 5).",
      en: "In SNCF Holding's cybersecurity division, I develop the application that tracks compliance for every project in the group and build its Power BI reporting. This is my second year of work-study, as I start the Master's cycle (year 4 of 5).",
    },
  },
  {
    yr: '2028', tag: { fr: 'Objectif', en: 'Goal' },
    title: { fr: ['Diplôme & premier poste ', 'data', ' en Suisse'], en: ['Degree & first ', 'data', ' role in Switzerland'] },
    text: {
      fr: "Fin du Master et premier poste de Data Engineer ou d'ingénieur BI, en Suisse romande ou ailleurs en Suisse. Je suis ouvert aux échanges dès aujourd'hui.",
      en: "Finishing my Master's and starting a first role as a Data Engineer or BI Engineer, in French-speaking Switzerland or elsewhere in the country. I'm open to a conversation now.",
    },
  },
];

export const SKILLS = [
  {
    title: { fr: 'BI & data visualisation', en: 'BI & data visualisation' },
    desc: {
      fr: 'Des tableaux de bord Power BI pour la direction de la SNCF, construits sur un modèle en étoile.',
      en: 'Power BI dashboards for senior management at SNCF, built on a star schema.',
    },
    chips: ['Power BI', 'DAX', { fr: 'Modèle en étoile', en: 'Star schema' }, 'KPI'],
    detail: {
      fr: 'Formé en Power BI aux niveaux intermédiaire et expert pendant mon alternance.',
      en: 'Trained in Power BI at intermediate and expert level during my work-study.',
    },
    points: {
      fr: ['Croisement de plusieurs sources de données', 'Nettoyage des tables avant modélisation', 'Modèles en étoile (faits / dimensions)', 'Mesures DAX dynamiques qui suivent les filtres'],
      en: ['Combining several data sources', 'Cleaning tables before modelling', 'Star schemas (facts / dimensions)', 'Dynamic DAX measures that follow filters'],
    },
  },
  {
    title: { fr: 'Data engineering', en: 'Data engineering' },
    desc: {
      fr: 'Modéliser une base, écrire et optimiser des requêtes SQL, faire circuler des messages avec Kafka.',
      en: 'Modelling databases, writing and tuning SQL queries, moving messages with Kafka.',
    },
    chips: ['SQL', 'PostgreSQL', 'Python', 'Kafka'],
    detail: {
      fr: 'En cours d’apprentissage pendant le Master : dbt, Airflow et Spark.',
      en: 'Currently learning during my Master’s: dbt, Airflow and Spark.',
    },
    points: {
      fr: ['Requêtes SQL et optimisation des temps d’exécution', 'Modélisation relationnelle (entités, associations)', 'Messagerie distribuée avec Kafka (topics, abonnements)', 'Scripts Python de traitement'],
      en: ['SQL queries and execution-time optimisation', 'Relational modelling (entities, relationships)', 'Distributed messaging with Kafka (topics, subscriptions)', 'Python processing scripts'],
    },
  },
  {
    title: { fr: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    desc: {
      fr: 'Neuf mois de pratique en alternance chez VICAT : déployer, automatiser et sécuriser l’infrastructure.',
      en: 'Nine months of hands-on practice at VICAT: deploying, automating and securing infrastructure.',
    },
    chips: ['AWS', 'Terraform', 'Docker', 'GitLab CI/CD'],
    detail: {
      fr: 'Avec Terraform, chaque règle réseau et chaque permission est écrite et relue avant d’être déployée.',
      en: 'With Terraform, every network rule and permission is written down and reviewed before it is deployed.',
    },
    points: {
      fr: ['Infrastructure AWS décrite en Terraform', 'Pipelines CI/CD GitLab (YAML)', 'Conteneurisation et architecture Docker', 'Migrations vers le cloud et montées de version'],
      en: ['AWS infrastructure defined in Terraform', 'GitLab CI/CD pipelines (YAML)', 'Docker containerisation and architecture', 'Cloud migrations and version upgrades'],
    },
  },
  {
    title: { fr: 'Développement & méthode', en: 'Development & method' },
    desc: {
      fr: 'Des applications full-stack en production : Angular et Spring Boot à la SNCF, React pour WebDesign&Co.',
      en: 'Full-stack applications in production: Angular and Spring Boot at SNCF, React for WebDesign&Co.',
    },
    chips: ['Angular', 'Spring Boot', 'React', 'Java', 'Git'],
    detail: {
      fr: 'J’ai souvent repris le code de quelqu’un d’autre : comprendre l’existant avant de le faire évoluer, sans rien casser, est devenu un réflexe.',
      en: 'I have often taken over someone else’s code: understanding what exists before changing it, without breaking anything, has become second nature.',
    },
    points: {
      fr: ['Reprise et évolution de projets existants', 'Gestion des droits et sécurité des API', 'Documentation et versioning (Git)', 'Priorisation des besoins avec les utilisateurs'],
      en: ['Taking over and evolving existing projects', 'Access rights and API security', 'Documentation and version control (Git)', 'Prioritising needs with users'],
    },
  },
];
