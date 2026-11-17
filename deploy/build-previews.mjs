// Link previews for WhatsApp, LinkedIn, X, Facebook and the like, on our own server.
//
// Those bots read the raw HTML and never run the app. After `vite build`, this writes a
// copy of dist/index.html for each known page with that page's title, description and
// preview image, under dist/_preview/. nginx serves these copies to bots only
// (see deploy/nginx-slim-file.conf); everyone else gets the normal app.
//
// The page list lives in middleware.js (PAGES, AI_FEATURES, NEWS).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, PAGES, AI_FEATURES, NEWS } from '../middleware.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const base = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function render(path, search, [image, title, description], story) {
  let html = base;
  const pageUrl = `${SITE}${path}${search}`;
  const imageUrl = image.startsWith('http') ? image : image.startsWith('/') ? `${SITE}${image}` : `${SITE}/og/${image}.jpg`;
  const setMeta = (attr, key, value) => {
    const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, 'i');
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
  };
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'og:image:type', 'image/jpeg');
  if (story) {
    setMeta('property', 'og:type', 'article');
  } else {
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
  }
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', imageUrl);
  return html;
}

let count = 0;
function write(file, html) {
  const out = join(dist, '_preview', file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  count++;
}

// /compress -> _preview/compress.html
for (const [path, page] of Object.entries(PAGES)) write(`${path.slice(1)}.html`, render(path, '', page, false));
// /ai-lab?feature=translate -> _preview/ai-lab/translate.html
for (const [feature, page] of Object.entries(AI_FEATURES)) {
  write(`ai-lab/${feature}.html`, render('/ai-lab', `?feature=${feature}`, page, false));
}
// /news/<id> -> _preview/news/<id>.html
for (const n of NEWS) {
  write(`news/${n.id}.html`, render(`/news/${n.id}`, '', [n.image, `${n.title} — SlimFile Newsroom`, n.subtitle], true));
}

console.log(`build-previews: wrote ${count} preview pages`);
