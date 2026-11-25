# Portfolio « En mouvement » — Matthew LE

Portfolio : React 19 + Vite, GSAP/ScrollTrigger et Lenis. Pensé pour rester
fluide : pas de WebGL, animations légères qui ne tournent que lorsqu'elles
sont visibles.

## Commandes

```bash
npm install      # première fois
npm run dev      # développement → http://localhost:5173
npm run build    # build de production → dist/
npm run preview  # prévisualiser le build → http://localhost:4173
```

## Structure

```
index.html              entrée Vite (thème + préchargeur avant peinture)
public/media/           VOS médias (vidéo immersive, portrait, projets) — voir le README dedans
src/
  main.jsx              montage React (Router + styles)
  App.jsx               layout global : rideau de transition, curseur,
                        nav, menu, Lenis
  i18n/lang.jsx         langue FR / EN (bouton dans la nav) — t('fr', 'en')
  context/AppContext    ready / menu / navigation avec rideau
  lib/
    motion.js           boucle rAF partagée + vélocité de scroll + easings
    scroller.js         Lenis (singleton) branché sur le ticker GSAP
    flight.js           vol FPV procédural (aperçu du showreel sans vidéo)
    scenes.js           scènes animées des en-têtes de projet (canvas 2D)
  components/           Nav, FsMenu, Cursor, Marquee, Footer, ProjectCard,
                        ProfileFacts (profil en bref), CvButton, Socials…
  hooks/                useReveals, useProjectMotion, useDocumentTitle
  pages/                une page par route :
                          /          Home (hero, manifeste, profil en bref, projets choisis)
                          /a-propos  APropos (portrait, parcours, compétences, film FPV)
                          /projets   Expériences & projets (filtres)
                          /projets/:id  page détaillée d'une expérience ou d'un projet
                          /contact   Contact (formulaire)
  data/                 profile.js (contact, statut, langues, liens, CV),
                        projets, parcours, compétences — FR + EN
legacy/                 l'ancienne version statique (référence — supprimable)
```

## Notes

- **SEO** : balises de partage (Open Graph / Twitter, image `public/og-image.jpg`),
  fiche schema.org « Person » et contenu de secours sans JavaScript dans
  `index.html` ; titre, description, adresse canonique et indexation mis à
  jour à chaque page (`src/hooks/useDocumentTitle.js`) ; `public/robots.txt` ;
  `sitemap.xml` généré à chaque build (`scripts/sitemap.mjs`, brouillons exclus).
  Le domaine est défini dans `SITE_URL` et dans `index.html` (matthewle.fr).

- **Infos perso** : tout ce qu'un recruteur cherche (email, téléphone,
  statut, langues, disponibilité, LinkedIn/GitHub, CV) est dans
  `src/data/profile.js`.
- **Projets data « brouillon »** : dans `src/data/projects.js`, les projets
  marqués `draft: true` sont des propositions. Ils ne s'affichent qu'en
  `npm run dev`. Une fois réalisés, adaptez le texte et retirez `draft`.

- **Médias** : déposez `cv-matthew-le.pdf`, `immersive.mp4`, `portrait.jpg` et `projets/*.jpg`
  dans `public/media/` (détails dans `public/media/README.txt`).
  Tout fonctionne sans eux (placeholders + vol FPV procédural).
- **Accessibilité / robustesse** : `prefers-reduced-motion` désactive les
  animations, le contenu reste lisible sans WebGL (repli 2D dans le hero).
- **Déploiement** : c'est une SPA. Sur Vercel, `vercel.json` renvoie toutes
  les routes vers `index.html` (sans lui, ouvrir directement /a-propos
  ou /projets/sncf donne une erreur 404).
