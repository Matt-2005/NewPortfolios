/* Fiche profil — source unique des infos que les recruteurs cherchent
   (contact, statut, langues, disponibilité). Tout le site lit ce fichier. */

export const PROFILE = {
  email: 'contact@matthewle.fr',
  phone: '+33 6 15 80 22 46',
  phoneHref: 'tel:+33615802246',
  location: { fr: 'Genève, Suisse', en: 'Geneva, Switzerland' },

  /* CV : déposez le fichier PDF à cet endroit — le bouton
     « Télécharger le CV » n'apparaît que si le fichier existe. */
  cv: '/media/cv-matthew-le.pdf',

  /* Liens : remplacez par vos vraies URL de profil.
     Une entrée avec url: '' est masquée. */
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com' },
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
    k: { fr: 'Formation', en: 'Education' },
    v: { fr: 'Master en informatique — SUPINFO Lyon (4e année sur 5)', en: "Master's in Computer Science — SUPINFO Lyon (year 4 of 5)" },
  },
  {
    k: { fr: 'Stack', en: 'Stack' },
    v: { fr: 'SQL · Python (pandas) · Power BI · Tableau', en: 'SQL · Python (pandas) · Power BI · Tableau' },
  },
  {
    k: { fr: 'En apprentissage', en: 'Currently learning' },
    v: { fr: 'Cloud (Azure / AWS) · dbt · Airflow', en: 'Cloud (Azure / AWS) · dbt · Airflow' },
  },
  {
    k: { fr: 'Langues', en: 'Languages' },
    v: { fr: 'Français (langue maternelle) · Anglais (B1–B2) · Russe', en: 'French (native) · English (B1–B2) · Russian' },
  },
  {
    k: { fr: 'Statut', en: 'Work status' },
    v: {
      fr: 'Nationalité française — permis G ou B délivré à l’embauche (libre circulation UE)',
      en: 'French citizen — G or B permit issued on hiring (EU free movement)',
    },
  },
  {
    k: { fr: 'Disponibilité', en: 'Availability' },
    v: { fr: 'Premier poste à la fin du Master — 2028', en: "First full-time role after my Master's — 2028" },
    accent: true,
  },
];
