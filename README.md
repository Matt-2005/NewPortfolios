# Portfolio « En mouvement » — Matthew LE

Portfolio immersif : React 19 + Vite, GSAP/ScrollTrigger, Lenis et Three.js.

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
  App.jsx               layout global : préchargeur, rideau de transition,
                        curseur, nav, menu, magnétisme, Lenis
  context/AppContext    ready / menu / navigation avec rideau
  lib/
    motion.js           boucle rAF partagée + vélocité de scroll + easings
    scroller.js         Lenis (singleton) branché sur le ticker GSAP
    flight.js           vol FPV procédural (canvas 2D, piloté au scroll)
    flow2d.js           champ de vecteurs 2D (repli si WebGL absent)
  three/
    HeroField.jsx       particules « vent » WebGL du hero (souris + scroll)
    ContactOrb.jsx      orbe d'énergie vert FPV (bruit simplex + fresnel)
  components/           Nav, FsMenu, Cursor, Preloader, Marquee, Footer, ProjectCard…
  hooks/                useReveals, useProjectMotion, useDocumentTitle
  pages/                Home (+ sections), Projets (filtres), Contact (formulaire)
  data/                 projets, parcours, compétences (source unique)
legacy/                 l'ancienne version statique (référence — supprimable)
```

## Notes

- **Médias** : déposez `immersive.mp4`, `portrait.jpg` et `projets/*.jpg`
  dans `public/media/` (détails dans `public/media/README.txt`).
  Tout fonctionne sans eux (placeholders + vol FPV procédural).
- **Accessibilité / robustesse** : `prefers-reduced-motion` désactive les
  animations, le contenu reste lisible sans WebGL (repli 2D dans le hero).
- **Déploiement** : c'est une SPA — configurez votre hébergeur pour
  rediriger toutes les routes vers `index.html`
  (Netlify/Vercel le font automatiquement)
