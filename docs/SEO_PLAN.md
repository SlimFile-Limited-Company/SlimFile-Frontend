# SEO plan: full pages for Google, then one page per search

Status (16 Nov 2026): **plan only, not started.**

## Where we are

Already in place: 138 URLs in `public/sitemap.xml` (every tool, about 90 blog posts,
news), schema markup, `useSEO` titles and descriptions, link previews for social
apps (`middleware.js`).

What Google gets today, checked as Googlebot on `/`, `/compress` and
`/compress-pdf`: **the same 20 KB HTML shell, 1 visible word, title "SlimFile"**.
Titles, descriptions and text only appear after JavaScript runs (`useSEO` sets
them in a `useEffect`). Google does run JavaScript, but later and less reliably,
so pages are indexed more slowly and rank weaker than pages that arrive as full
HTML. `middleware.js` only rewrites previews for social bots, not Google.

## Part 1: send Google full HTML for every public page

Goal: every public URL returns its own title, description, canonical, H1 and main
text in the first HTML response. Users see no change.

### Recommended: prerender at build time (headless browser)

1. After `vite build`, a script opens each public URL (the list from
   `public/sitemap.xml`) in headless Chrome, waits until the page has rendered
   (`useSEO` has run), and saves the HTML to `dist/<path>/index.html`.
2. Vercel serves real files before the catch-all rewrite in `vercel.json`, so
   `/compress` gets `dist/compress/index.html`. Unknown routes still fall back
   to the app shell.
3. The app keeps using `createRoot`: React replaces the prerendered HTML with the
   live app, so nothing in the app has to change for this to work.
4. Exclude private pages (dashboard, Internal, workspaces, whiteboards,
   documents): only what is in the sitemap is prerendered.

Why this way: it captures exactly what users see, including `useSEO` titles, with
no change to the 180+ routes. The main risk is running Chrome during the Vercel
build. Options, in order: `puppeteer` with `@sparticuz/chromium` in the Vercel
build, or prerender in a GitHub Action and deploy with `vercel deploy --prebuilt`.
Try the first on a preview deploy.

### Fallback if Chrome in the build is a problem: static head + summary per route

A build script copies `dist/index.html` once per public route and fills in that
route's `<title>`, meta description, canonical, Open Graph tags, schema and a short
visible text block (H1, two sentences, links to related tools) from one data file
(`src/data/seo-routes.json`). No browser needed. Less complete than full
prerendering, but every page gets its own title and real text.

### Not recommended

- Dynamic rendering (serving Googlebot something different in `middleware.js`):
  Google calls it a workaround and it is easy to get wrong (cloaking).
- Moving to Next.js or another SSR framework: big rewrite for the same result.

### Checks before and after

- `curl -A Googlebot https://www.slim-file.com/compress`: own title, H1 and text.
- Search Console: URL Inspection on 5 pages ("View crawled page"), then watch
  Pages → Indexed over 2 to 4 weeks.
- Lighthouse SEO score, Core Web Vitals unchanged or better.
- Private pages are not in the prerendered set.

Effort: about 3 to 5 days including testing on a preview deploy.

## Part 2: one page per search (after Part 1)

Today there is one page per tool (`/compress`). People search for exact needs:
"compress PDF to 100 KB", "compress PDF for email", "reduce image size to 50 KB",
"compress video for WhatsApp", "JPG to PDF". Those searches are where most
traffic is.

1. **Pick the first 30 to 50 searches from real data**: Search Console queries
   that already bring impressions, plus Google autocomplete for "compress pdf…",
   "reduce image size…", "convert … to pdf".
2. **One data file, one template**: `src/data/seo-pages.json` with slug, tool,
   preset (for example a target size where the tool supports it), title, H1,
   intro, 3 steps and 4 to 6 FAQs per page. One `IntentPage` component renders
   the working tool with that preset, the how-to and the FAQs, plus FAQ / HowTo
   schema.
3. **Every page must be genuinely useful and different** (its own preset,
   steps and answers). No near-copies: Google can demote the whole site for
   thin, repeated pages.
4. Link them: each tool page lists its search pages, each blog post links to the
   matching ones, and all go in the sitemap (and through Part 1's prerendering).
5. Measure monthly in Search Console; add more pages like the ones that work.

## Later

- French version (West and Central Africa, France, Canada), then Portuguese and
  Spanish, with `hreflang`.
- Real links: campus ambassadors on university resource pages, Product Hunt,
  tool directories, press, Wikidata.

## Order of work

1. Part 1 on a preview deploy, check with Search Console, then production.
2. Part 2: first 30 pages, measure for a month, then the next batch.
3. Languages and links.
