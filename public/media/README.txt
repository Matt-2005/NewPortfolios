DÉPOSEZ VOS MÉDIAS ICI (public/media/)
=======================================

0) public/media/cv-matthew-le.pdf   ← LE PLUS IMPORTANT
   - Votre CV en PDF. Dès qu'il est là, un bouton « Télécharger le CV »
     apparaît dans le hero, le profil en bref et la page contact.
   - Conseil Suisse : 1–2 pages, photo, nationalité / statut, langues
     avec niveaux, dates précises (mois/année).

1) public/media/immersive.mp4
   - Votre vidéo drone (fin de la page « À propos »), format paysage 16:9.
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
       public/media/projets/istore.jpg         (projet iStore — sinon le nom s'affiche en grand)
       public/media/projets/cff.jpg            (projet data, brouillon)
       public/media/projets/logement-ge.jpg    (projet data, brouillon)
       public/media/projets/energie-ch.jpg     (projet data, brouillon)
       public/media/projets/belki.jpg
       public/media/projets/petits-reves.jpg
       public/media/projets/above-lyon.jpg
       public/media/projets/sunset-ride.jpg
       public/media/projets/bde.jpg
   - Tant qu'aucune image n'est déposée, le nom du projet s'affiche en grand
     (le chemin du fichier attendu n'apparaît qu'en développement).
   - Les EXPÉRIENCES (SNCF, VICAT…) n'ont pas besoin d'image : la carte
     affiche le nom de l'entreprise en grand.

Gardez exactement ces noms, ou modifiez les chemins dans
src/data/projects.js (projets), src/data/profile.js (CV),
src/pages/apropos/About.jsx (portrait)
et src/pages/home/Showreel.jsx (vidéo).

LANCEMENT : `npm run dev` puis http://localhost:5173 — la détection
des fichiers se fait par requête HTTP, le serveur Vite s'en charge.
