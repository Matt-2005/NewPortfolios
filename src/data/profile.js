/* Fiche profil — source unique des infos que les recruteurs cherchent
   (contact, statut, langues, disponibilité). Tout le site lit ce fichier. */

export const PROFILE = {
  email: 'contact@matthewle.fr',
  phone: '+33 6 15 80 22 46',
  phoneHref: 'tel:+33615802246',
  location: { fr: 'Lyon, France · mobile en Suisse', en: 'Lyon, France · open to relocating to Switzerland' },

  /* CV : déposez le fichier PDF à cet endroit — le bouton
     « Télécharger le CV » n'apparaît que si le fichier existe. */
  cv: '/media/cv-matthew-le.pdf',

  /* Liens : remplacez par vos vraies URL de profil.
     Une entrée avec url: '' est masquée. */
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/matthewle' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'YouTube', url: 'https://youtube.com' },
  ],
};

/* « Profil en bref » — affiché sur l'accueil et la page contact. */
export const FACTS = [
  {
    k: { fr: 'Poste visé', en: 'Target role' },
    v: { fr: 'Data Engineer · BI Engineer', en: 'Data Engineer · BI Engineer' },
  },
  {
    k: { fr: 'Expérience', en: 'Experience' },
    v: {
      fr: '1 an d’alternance : ingénieur DevOps chez VICAT, puis développeur & ingénieur BI à la SNCF',
      en: '1 year of work-study: DevOps engineer at VICAT, then developer & BI engineer at SNCF',
    },
  },
  {
    k: { fr: 'Formation', en: 'Education' },
    v: {
      fr: 'Master of Engineering, Ingénierie Data — SUPINFO Lyon (4e année sur 5)',
      en: 'Master of Engineering, Data Engineering — SUPINFO Lyon (year 4 of 5)',
    },
  },
  {
    k: { fr: 'Data & BI', en: 'Data & BI' },
    v: { fr: 'SQL · PostgreSQL · Python · Power BI (DAX, modèle en étoile)', en: 'SQL · PostgreSQL · Python · Power BI (DAX, star schema)' },
  },
  {
    k: { fr: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    v: { fr: 'AWS · Terraform · Docker · Kafka · GitLab CI/CD', en: 'AWS · Terraform · Docker · Kafka · GitLab CI/CD' },
  },
  {
    k: { fr: 'Langues', en: 'Languages' },
    v: { fr: 'Français et russe (langues maternelles) · Anglais (B1–B2)', en: 'French and Russian (native) · English (B1–B2)' },
  },
  {
    k: { fr: 'Statut', en: 'Work status' },
    v: {
      fr: 'Nationalité française — permis G ou B délivré à l’embauche (libre circulation UE)',
      en: 'French citizen — G or B permit issued on hiring (EU free movement)',
    },
  },
  {
    k: { fr: 'Localisation', en: 'Location' },
    v: { fr: 'Lyon · mobile en Suisse romande (Genève, Lausanne)', en: 'Lyon · open to French-speaking Switzerland (Geneva, Lausanne)' },
  },
  {
    k: { fr: 'Disponibilité', en: 'Availability' },
    v: { fr: 'Premier poste à la fin du Master — 2028', en: "First full-time role after my Master's — 2028" },
    accent: true,
  },
];
