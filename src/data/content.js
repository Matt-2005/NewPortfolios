/* Contenus éditoriaux : parcours + compétences (FR / EN). */

export const PARCOURS = [
  {
    yr: '2020', tag: { fr: 'Code', en: 'Code' },
    title: { fr: ['Les premières lignes de ', 'code', ''], en: ['First lines of ', 'code', ''] },
    text: {
      fr: "HTML, CSS, JavaScript, puis mes premières bases de données. Je comprends vite que coder, c'est structurer : poser les bonnes fondations avant d'empiler quoi que ce soit.",
      en: 'HTML, CSS, JavaScript, then my first databases. I quickly learned that coding is about structure: laying the right foundations before stacking anything on top.',
    },
  },
  {
    yr: '2023', tag: { fr: 'Formation', en: 'Education' },
    title: { fr: ['Entrée à ', 'SUPINFO', ' Lyon'], en: ['Joining ', 'SUPINFO', ' Lyon'] },
    text: {
      fr: "Cycle Bachelor en informatique : algorithmique, bases de données relationnelles, systèmes, réseaux et développement. La rigueur technique devient une méthode.",
      en: "Bachelor's cycle in computer science: algorithms, relational databases, systems, networking and software development. Technical rigour becomes a method.",
    },
  },
  {
    yr: '2024', tag: { fr: 'Projets clients', en: 'Client work' },
    title: { fr: ['Premiers ', 'projets', ' livrés'], en: ['First ', 'projects', ' delivered'] },
    text: {
      fr: "Sites et applications web pour de vrais clients : cahier des charges, modèle de données, délais tenus et mise en production. J'apprends à livrer, pas seulement à coder.",
      en: 'Websites and web apps for real clients: specifications, data models, deadlines met and production releases. I learned to ship, not just to code.',
    },
  },
  {
    yr: '2026', tag: { fr: 'Master · Data', en: "Master's · Data" },
    title: { fr: ['Master, cap sur la ', 'data', ''], en: ["Master's, heading for ", 'data', ''] },
    text: {
      fr: "4e année sur 5 à SUPINFO Lyon, première année du cycle Master. Je me concentre sur la donnée : SQL, Python, modélisation, dashboards Power BI — et je monte en compétence sur le cloud et les pipelines (dbt, Airflow).",
      en: "Year 4 of 5 at SUPINFO Lyon, the first year of the Master's cycle. My focus is data: SQL, Python, data modelling, Power BI dashboards — while building up cloud and pipeline skills (dbt, Airflow).",
    },
  },
  {
    yr: '2028', tag: { fr: 'Objectif', en: 'Goal' },
    title: { fr: ['Diplôme & premier poste ', 'data', ' en Suisse'], en: ['Degree & first ', 'data', ' role in Switzerland'] },
    text: {
      fr: "Fin du Master et premier poste de Data Engineer ou d'ingénieur BI, en Suisse romande ou ailleurs en Suisse. Je suis ouvert aux échanges dès aujourd'hui ↓",
      en: "Finishing my Master's and starting a first role as a Data Engineer or BI Engineer, in French-speaking Switzerland or elsewhere in the country. Happy to talk today ↓",
    },
  },
];

export const SKILLS = [
  {
    title: { fr: 'Data engineering', en: 'Data engineering' },
    desc: {
      fr: 'Extraire, nettoyer et structurer la donnée pour qu’elle soit fiable et prête à l’emploi.',
      en: 'Extracting, cleaning and structuring data so it is reliable and ready to use.',
    },
    chips: ['SQL', 'Python', 'pandas', 'ETL', 'API'],
    detail: {
      fr: 'Une donnée fausse coûte plus cher qu’une donnée absente. Je construis des traitements lisibles, testables et reproductibles.',
      en: 'Wrong data costs more than missing data. I build processing that is readable, testable and reproducible.',
    },
    points: {
      fr: ['Requêtes SQL analytiques (jointures, agrégations)', 'Nettoyage et transformation avec Python / pandas', 'Modélisation relationnelle', 'Scripts d’ingestion depuis fichiers et API'],
      en: ['Analytical SQL queries (joins, aggregations)', 'Cleaning and transforming with Python / pandas', 'Relational data modelling', 'Ingestion scripts from files and APIs'],
    },
  },
  {
    title: { fr: 'BI & data visualisation', en: 'BI & data visualisation' },
    desc: {
      fr: 'Transformer des tables en décisions : des dashboards clairs, que l’on comprend en dix secondes.',
      en: 'Turning tables into decisions: clear dashboards you understand in ten seconds.',
    },
    chips: ['Power BI', 'Tableau', 'KPI', 'Modèle en étoile'],
    detail: {
      fr: 'Des années de montage vidéo m’ont appris à raconter : un bon dashboard, c’est aussi un récit, avec un rythme et une chute.',
      en: 'Years of video editing taught me storytelling: a good dashboard is a story too, with pace and a punchline.',
    },
    points: {
      fr: ['Dashboards Power BI et Tableau', 'Modèles en étoile (faits / dimensions)', 'Définition et suivi d’indicateurs (KPI)', 'Mise en forme pensée pour les décideurs'],
      en: ['Power BI and Tableau dashboards', 'Star schemas (facts / dimensions)', 'Defining and tracking KPIs', 'Design built for decision-makers'],
    },
  },
  {
    title: { fr: 'Cloud & pipelines', en: 'Cloud & pipelines' },
    desc: {
      fr: 'En cours d’apprentissage pendant mon Master : l’industrialisation des flux de données.',
      en: "Currently learning during my Master's: running data flows at production scale.",
    },
    chips: ['Azure', 'AWS', 'dbt', 'Airflow', 'Docker'],
    detail: {
      fr: 'Mon objectif d’ici la fin du Master : savoir concevoir et opérer un pipeline de bout en bout, de l’ingestion à l’entrepôt.',
      en: "My goal by the end of my Master's: designing and running an end-to-end pipeline, from ingestion to warehouse.",
    },
    points: {
      fr: ['Orchestration de pipelines (Airflow)', 'Transformations versionnées (dbt)', 'Services data cloud (Azure, AWS)', 'Conteneurisation (Docker)'],
      en: ['Pipeline orchestration (Airflow)', 'Version-controlled transformations (dbt)', 'Cloud data services (Azure, AWS)', 'Containerisation (Docker)'],
    },
    learning: true,
  },
  {
    title: { fr: 'Développement & méthode', en: 'Development & method' },
    desc: {
      fr: 'Un bagage de développeur web et une façon de travailler structurée, transparente et fiable.',
      en: 'A web developer background and a way of working that is structured, transparent and reliable.',
    },
    chips: ['JavaScript', 'React', 'Node', 'Git'],
    detail: {
      fr: 'Avoir livré des projets à de vrais clients m’a appris l’essentiel : comprendre le besoin, documenter, tenir les délais.',
      en: 'Shipping projects to real clients taught me the essentials: understand the need, document, meet deadlines.',
    },
    points: {
      fr: ['Versioning et travail en équipe (Git)', 'Applications web full-stack', 'Documentation et maintenabilité', 'Communication claire avec les métiers'],
      en: ['Version control and teamwork (Git)', 'Full-stack web applications', 'Documentation and maintainability', 'Clear communication with business teams'],
    },
  },
];
