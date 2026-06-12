/* Découpages typographiques pré-rendus côté JSX :
   - Chars : chaque lettre dans un <span class="ch"> (titre vivant du hero)
   - Words : chaque mot dans un <span class="w"> (manifeste mot à mot) */

export function Chars({ text }) {
  return text.split('').map((c, i) =>
    /\s/.test(c) ? c : <span className="ch" key={i}>{c}</span>
  );
}

export function Words({ text }) {
  return text.split(/(\s+)/).map((p, i) =>
    /^\s*$/.test(p) ? p : <span className="w" key={i}>{p}</span>
  );
}
