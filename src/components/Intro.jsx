import { useEffect, useRef, useState } from 'react';
import { reduce } from '../lib/motion';

/* « Bonjour » dans plein de langues — façon allumage d'un produit Apple.
   On commence et on finit par le français (langue du site). */
const HELLOS = [
  'Bonjour', 'Hello', 'Hola', 'Ciao', 'Olá', 'Hallo', 'Hej',
  'こんにちは', '안녕하세요', '你好', 'Привет', 'مرحبا', 'नमस्ते',
  'Merhaba', 'Xin chào', 'Salut',
];

/* Écran d'accueil : il couvre la page, puis « Accéder » fait entrer dans la home.
   onEnter() est appelé une fois l'animation de sortie terminée. */
export default function Intro({ onEnter }) {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const goneRef = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI(n => (n + 1) % HELLOS.length), 1150);
    return () => clearInterval(id);
  }, []);

  const enter = () => {
    if (goneRef.current) return;
    goneRef.current = true;
    setLeaving(true);
    setTimeout(onEnter, reduce ? 0 : 900); // attend la levée (clip-path)
  };

  useEffect(() => {
    const onKey = e => { if (e.key === 'Enter' || e.key === 'Escape') enter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={'intro' + (leaving ? ' leaving' : '')} role="dialog" aria-label="Bienvenue">
      <div className="intro-aurora" aria-hidden="true">
        <span className="ia ia-1" /><span className="ia ia-2" /><span className="ia ia-3" />
      </div>
      <div className="intro-grain" aria-hidden="true" />

      <div className="intro-inner">
        <div className="intro-eyebrow mono">Matthew LE — Portfolio · En mouvement</div>
        <div className="intro-hello" aria-live="polite">
          <span className="ih-word serif-it" key={i}>{HELLOS[i]}</span>
        </div>
        <p className="intro-sub">Une seule obsession&nbsp;: <em className="serif-it">le mouvement</em>.</p>
        <button className="intro-enter" type="button" onClick={enter} data-magnetic="0.4" aria-label="Accéder au site">
          <span className="lbl">Accéder</span>
          <span className="ie-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
