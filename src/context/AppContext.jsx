import { createContext, useContext } from 'react';

/* ready    : le préchargeur a terminé (les intros peuvent jouer)
   menuOpen : état du menu plein écran
   setMenuOpen(open)
   go(to)   : navigation avec rideau — accepte "/", "/projets",
              "/contact" ou "/#ancre" */
export const AppContext = createContext({
  ready: false,
  menuOpen: false,
  setMenuOpen: () => {},
  go: () => {},
});

export const useApp = () => useContext(AppContext);
