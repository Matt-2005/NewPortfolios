/* Génère dist/sitemap.xml après chaque build (npm run build → postbuild).
   Pages fixes + une page par expérience / projet publié (les brouillons
   `draft: true` sont exclus). */
import fs from 'fs';

const SITE = 'https://matthewle.fr';
const src = fs.readFileSync(new URL('../src/data/projects.js', import.meta.url), 'utf8');
const projects = [...src.matchAll(/^\s+id: '([^']+)',([^\n]*)$/gm)]
  .filter(([, , rest]) => !/draft:\s*true/.test(rest))
  .map(([, id]) => id);

const today = new Date().toISOString().slice(0, 10);
const pages = [
  { loc: '/', priority: '1.0' },
  { loc: '/projets', priority: '0.9' },
  { loc: '/a-propos', priority: '0.8' },
  { loc: '/contact', priority: '0.7' },
  ...projects.map(id => ({ loc: '/projets/' + id, priority: ['sncf', 'vicat'].includes(id) ? '0.8' : '0.6' })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${SITE}${p.loc}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
fs.mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../dist/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml : ${pages.length} pages (${projects.length} projets publiés)`);
