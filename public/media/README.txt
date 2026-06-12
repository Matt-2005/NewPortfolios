DÉPOSEZ VOS MÉDIAS ICI (public/media/)
=======================================

1) public/media/immersive.mp4
   - Votre vidéo immersive (drone / moto), 10 à 20 secondes.
   - Format paysage (16:9 idéal), muette de préférence, 30 ou 60 fps
     pour un scrub bien fluide.
   - Elle se lira IMAGE PAR IMAGE au scroll : verrouillage, compte à
     rebours, percée plein écran, puis la séquence sous votre doigt.
   - EN ATTENDANT : un vol FPV procédural (canvas) joue le même rôle,
     piloté par le scroll lui aussi. Dès que immersive.mp4 existe,
     il est utilisé automatiquement à la place.

2) public/media/portrait.jpg
   - Votre portrait, format portrait (ratio 4:5 idéal).
   - Il est découpé en taquin : un carré est retiré et les tuiles
     glissent vers le vide.

3) public/media/projets/*.jpg
   - Les visuels des projets (ratio 4:3 ; la carte "BDE" est large).
   - Noms attendus :
       public/media/projets/belki.jpg
       public/media/projets/petits-reves.jpg
       public/media/projets/above-lyon.jpg
       public/media/projets/sunset-ride.jpg
       public/media/projets/bde.jpg
   - Tant qu'aucune image n'est déposée, un cadre rayé avec le chemin
     du fichier s'affiche à la place.

Gardez exactement ces noms, ou modifiez les chemins dans
src/data/projects.js (projets), src/pages/home/About.jsx (portrait)
et src/pages/home/Immersive.jsx (vidéo).

LANCEMENT : `npm run dev` puis http://localhost:5173 — la détection
des fichiers se fait par requête HTTP, le serveur Vite s'en charge.
