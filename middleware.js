/**
 * Link previews for WhatsApp, LinkedIn, X, Facebook and the like.
 *
 * Those bots read the raw HTML and never run the app, so every page would
 * preview with the same title and logo. For known pages, bots get index.html
 * with that page's title, description and red preview card (public/og).
 * Everyone else is passed straight through.
 */
const SITE = 'https://www.slim-file.com';

const PAGES = {
  '/compress': ['compress-files', 'Compress Files Instantly | SlimFile', 'Shrink images, PDFs, Word, PowerPoint and Excel files while keeping their quality. Free, fast and no sign-up.'],
  '/convert-only': ['convert-formats', 'Convert Files Online — Free Format Converter | SlimFile', 'Convert PDFs, images and Office documents between formats for free. JPG to PDF, PDF to Word, PNG to WebP and more.'],
  '/convert-compress': ['convert-compress', 'Convert & Compress in One Step | SlimFile', 'Convert your file to a new format and compress it in one step. Save time and get a smaller file.'],
  '/forge': ['pdf-merger-splitter', 'Merge & Split PDF Files Online | SlimFile', 'Merge several PDFs into one or split a PDF into separate pages. Free, fast and secure.'],
  '/merge-compress': ['merge-compress-pdfs', 'Merge & Compress PDFs | SlimFile', 'Combine several PDFs into one and compress it in a single step. One file, smaller than the originals combined.'],
  '/split-compress': ['split-compress-pdfs', 'Split & Compress PDFs | SlimFile', 'Split a PDF into pages or ranges and compress every piece in one step.'],
  '/lock': ['pdf-password-protect', 'Password Protect & Unlock PDFs | SlimFile', 'Add or remove password protection on PDF files in seconds, with no software to install.'],
  '/ocr-tool': ['ocr-tool', 'OCR — Extract Text From Images & PDFs | SlimFile', 'Turn scanned images and PDFs into editable text that keeps headings, lists and tables. Free.'],
  '/zip': ['zip-files-folders', 'Zip & Unzip Files and Folders Online | SlimFile', 'Upload files or whole folders and get a ZIP back with the folders intact. Unzip any archive too.'],
  '/qr-code': ['qr-code-generator', 'Free QR Code Generator | SlimFile', 'Create QR codes for links, text, WhatsApp, Wi-Fi and email. Download as PNG or SVG, no sign-up.'],
  '/scan-compress': ['scan-compress', 'Scan & Compress | SlimFile', 'Photograph paper with your phone and get a small, clean PDF.'],
  '/scan-convert': ['scan-convert', 'Scan & Convert | SlimFile', 'Photograph pages and turn them into editable documents.'],
  '/scan-merge': ['batch-scan-merge', 'Batch Scan & Merge | SlimFile', 'Scan many pages with your phone and merge them into one PDF.'],
  '/scan-split': ['batch-scan-split', 'Batch Scan & Split | SlimFile', 'Scan pages with your phone and split them into separate PDFs.'],
  '/my-whiteboards': ['whiteboards', 'Free Online Whiteboard | SlimFile', 'Sketch ideas, diagrams and plans on an endless canvas. Boards save automatically to your account.'],
  '/workspaces': ['team-workspaces', 'Team Workspaces | SlimFile', 'Share files, plan projects and work together with your team in one place.'],
  '/feed': ['activity-feed', 'Live Feed — Files Being Compressed Right Now | SlimFile', 'Watch files being compressed on SlimFile in real time, and how much space they save.'],
  '/ai-lab': ['summarize-document', 'AI Lab — Summarise, Translate & Rewrite | SlimFile', 'Free AI tools to summarise documents, translate text, rewrite content, answer questions and more.'],
};

// AI Lab links carry the tool in ?feature=
const AI_FEATURES = {
  summarize: ['summarize-document', 'Summarise Documents with AI | SlimFile', 'Get the key points of a PDF, Word file or long text in seconds.'],
  translate: ['translate-text', 'Translate Text with AI | SlimFile', 'Translate text into more than 12 languages, free.'],
  rewrite: ['rewrite-content', 'Rewrite Content with AI | SlimFile', 'Rewrite text to sound clearer, more formal or more casual.'],
  question: ['ask-questions', 'Ask Questions About Your Documents | SlimFile', 'Ask anything about a document or text and get answers straight away.'],
  keywords: ['extract-keywords', 'Extract Keywords with AI | SlimFile', 'Pull out the main keywords and topics from any text.'],
  sentiment: ['analyze-sentiment', 'Analyse Sentiment with AI | SlimFile', 'See whether a text reads positive, negative or neutral.'],
  compare: ['compare-texts', 'Compare Texts with AI | SlimFile', 'Spot the differences between two texts in seconds.'],
  email: ['email-generator', 'AI Email Writer | SlimFile', 'Turn a few bullet points into a clear, well-written email.'],
};

const BOT = /facebookexternalhit|facebot|linkedinbot|twitterbot|whatsapp|slackbot|telegrambot|discordbot|skypeuripreview|pinterest|redditbot|embedly|applebot|vkshare|snapchat/i;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export const config = {
  matcher: Object.keys(PAGES),
};

export default async function middleware(request) {
  try {
    if (!BOT.test(request.headers.get('user-agent') || '')) return;

    const url = new URL(request.url);
    const page = (url.pathname === '/ai-lab' && AI_FEATURES[url.searchParams.get('feature')]) || PAGES[url.pathname];
    if (!page) return;
    const [image, title, description] = page;

    // The home page is plain index.html and isn't matched here, so this can't loop.
    const res = await fetch(new URL('/', url));
    if (!res.ok) return;
    let html = await res.text();

    const pageUrl = `${SITE}${url.pathname}${url.search}`;
    const imageUrl = `${SITE}/og/${image}.jpg`;
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
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=3600' },
    });
  } catch {
    // Any problem: serve the normal page.
    return;
  }
}
