DÉPOSEZ VOS MÉDIAS ICI (public/media/)
=======================================

1) public/media/immersive.mp4
   - Votre vidéo drone (showreel de l'accueil), format paysage 16:9.
   - Elle est épinglée sous la page et se DÉVOILE quand la feuille du
     dessus se soulève ; elle tourne en boucle, muette, puis la section
     projets vient la recouvrir. Un bouton « Regarder le film » l'ouvre
     en plein écran, avec le son et les contrôles.
   - Conseil : H.264 MP4, 1080p (ou 4K légère), ~20–60 s, < 25 Mo,
     exportée avec « fast start » (moov au début) pour démarrer vite.
   - EN ATTENDANT : un vol FPV procédural (canvas) s'affiche à la place.

2) public/media/portrait.jpg
   - Votre portrait, format portrait (ratio 4:5 idéal).
   - Page « À propos » : dévoilement en rideau, parallaxe douce et
     légère inclinaison au survol — l'image reste toujours entière.

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
src/data/projects.js (projets), src/pages/apropos/About.jsx (portrait)
et src/pages/home/Showreel.jsx (vidéo).

LANCEMENT : `npm run dev` puis http://localhost:5173 — la détection
des fichiers se fait par requête HTTP, le serveur Vite s'en charge.
