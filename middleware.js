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

// News stories for /news/:id previews. Keep in step with src/data/news.json
// (written out here because Vercel bundles this file on its own).
const NEWS = [
  { id: "slimfile-atlas-on-the-app-store", title: "SlimFile Atlas Is Now on the App Store", subtitle: "Compress your videos right on your iPhone. Nothing is uploaded, there's no account, and it's free to download.", image: "/news/slimfile-atlas-app-store.jpg" },
  { id: "esign-pdfs-on-slimfile", title: "You Can Now Sign PDFs on SlimFile", subtitle: "Draw, type or upload your signature, add the date and your initials, and download the signed PDF. It all happens in your browser, so your document is never uploaded.", image: "/news/esign.jpg" },
  { id: "chinelo-adaugo-nnamdi-kanu-alche", title: "Meet Chinelo Adaugo Nnamdi Kanu, SlimFile's Second University Ambassador at ALCHE in Mauritius", subtitle: "Chinelo, a Nigerian student at the African Leadership College of Higher Education in Mauritius, joins Christabel as SlimFile's second ambassador on campus.", image: "/news/chinelo-adaugo-nnamdi-kanu-alche.jpg" },
  { id: "cinderella-takoradi-technical-university", title: "Meet Cinderella Agbolosoo, SlimFile's University Ambassador at Takoradi Technical University", subtitle: "Cinderella Agbolosoo represents SlimFile at Takoradi Technical University, helping students at TTU handle their assignments, documents and group work with free tools built for campus life.", image: "/news/cinderella-takoradi-technical-university.jpg" },
  { id: "emmanuel-twentoh-takoradi-technical-university", title: "Meet Emmanuel Twentoh, SlimFile's University Ambassador at Takoradi Technical University", subtitle: "Emmanuel Twentoh represents SlimFile at Takoradi Technical University, helping students at TTU handle their assignments, documents and group work with free tools built for campus life.", image: "/news/emmanuel-twentoh-takoradi-technical-university.jpg" },
  { id: "ann-apeani-university-of-ghana", title: "Meet Ann Apeani, SlimFile's University Ambassador at the University of Ghana, Legon", subtitle: "Ann represents SlimFile at the University of Ghana, helping students at Legon handle their assignments, documents and group work with free tools built for campus life.", image: "/news/ann-apeani-university-of-ghana.jpg" },
  { id: "christabel-maame-yaa-dekyem-alc-mauritius", title: "Meet Christabel Maame Yaa Dekyem, SlimFile University Ambassador at African Leadership College of Higher Education in Mauritius", subtitle: "Christabel is helping students on her campus work smarter with their files. We're proud to have her in our global ambassador network.", image: "/news/ambassador-program.jpg" },
  { id: "ambassador-of-the-month-october-2026", title: "Hagar Agyapomaa Boakye Is SlimFile's Ambassador of the Month for October 2026", subtitle: "Hagar, our University Ambassador at the University of Cape Coast, is October's Ambassador of the Month, recognised for her work bringing SlimFile to students on campus.", image: "/news/ambassador-of-the-month-october-2026.jpg" },
  { id: "introducing-slimfile-atlas", title: "Introducing SlimFile Atlas: Offline Video Compression for Media Houses and Businesses", subtitle: "SlimFile Atlas compresses large video files without an internet connection, so newsrooms, production teams and businesses can shrink their footage on their own machines and keep it private.", image: "/news/slimfile-atlas.jpg" },
  { id: "slimfile-university-ambassador-program", title: "Introducing the SlimFile University Ambassador Program", subtitle: "Students at 13 universities in Ghana, Mauritius and the United States now represent SlimFile on their campuses, helping classmates work faster with their files.", image: "/news/ambassador-program.jpg" },
  { id: "introducing-slimdocx", title: "Meet SlimDocx: A Full Word-Style Editor, Free on SlimFile", subtitle: "Write and edit documents with pages, tables and track changes, open Word files, and download as Word or PDF, all in your browser. Powered by ONLYOFFICE.", image: "/news/slimdocx.jpg" },
  { id: "new-slimfile-whiteboards", title: "New SlimFile Whiteboards: An Endless Canvas for Your Ideas", subtitle: "SlimFile Whiteboards has been rebuilt from the ground up, with a smooth, endless canvas for sketching, diagrams and planning.", image: "/og/whiteboards.jpg" },
  { id: "slimfile-whatsapp-channel", title: "Follow SlimFile on WhatsApp", subtitle: "SlimFile now has an official WhatsApp Channel, with news, new features, file tips and job openings, straight to your phone.", image: "/news/whatsapp-channel.jpg" },
  { id: "slimfile-mobile-app-launch", title: "SlimFile Mobile App Now Available on Google Play Store", subtitle: "SlimFile launches its official Android app, bringing file compression and conversion to your pocket. Compress images, PDFs and Office documents on the go, free on the Google Play Store.", image: "/news/slimfile-android.jpg" },
  { id: "ai-lab-launch", title: "Introducing SlimFile AI Lab: 9 AI Tools in One Place", subtitle: "SlimFile launches AI Lab, a suite of free AI tools to translate, summarise, rewrite, analyse sentiment, compare texts, write emails and more.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop" },
  { id: "10k-users-milestone", title: "SlimFile Reaches 10,000 New Users", subtitle: "A major growth milestone: 10,000 new users and 9,700 active users, with 468,113 events and 59,332 views across SlimFile.", image: "/news/10k-milestone-card.jpg" },
  { id: "gtv-ghana", title: "SlimFile Featured on GTV Ghana", subtitle: "SlimFile was featured on the GTV Ghana breakfast show, a television spotlight on how SlimFile helps people compress and convert files faster and more securely.", image: "/news/gtv-ghana.jpg" },
  { id: "ghana-youth-tech-summit", title: "SlimFile at the Ghana Youth Tech Summit", subtitle: "Showcasing SlimFile's vision and tools to students, builders and the wider tech community.", image: "/news/ghana-youth-tech-summit.jpeg" },
];

const BOT = /facebookexternalhit|facebot|linkedinbot|twitterbot|whatsapp|slackbot|telegrambot|discordbot|skypeuripreview|pinterest|redditbot|embedly|applebot|vkshare|snapchat/i;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Vercel reads this at build time, so it must be written out, not computed.
// Keep it in step with PAGES.
export const config = {
  matcher: [
    '/compress',
    '/convert-only',
    '/convert-compress',
    '/forge',
    '/merge-compress',
    '/split-compress',
    '/lock',
    '/ocr-tool',
    '/zip',
    '/qr-code',
    '/scan-compress',
    '/scan-convert',
    '/scan-merge',
    '/scan-split',
    '/my-whiteboards',
    '/workspaces',
    '/feed',
    '/ai-lab',
    '/news/:path*',
  ],
};

export default async function middleware(request) {
  try {
    if (!BOT.test(request.headers.get('user-agent') || '')) return;

    const url = new URL(request.url);
    const story = url.pathname.startsWith('/news/') && NEWS.find(n => n.id === url.pathname.slice(6));
    const page = story
      ? [story.image, `${story.title} — SlimFile Newsroom`, story.subtitle]
      : (url.pathname === '/ai-lab' && AI_FEATURES[url.searchParams.get('feature')]) || PAGES[url.pathname];
    if (!page) return;
    const [image, title, description] = page;

    // The home page is plain index.html and isn't matched here, so this can't loop.
    const res = await fetch(new URL('/', url));
    if (!res.ok) return;
    let html = await res.text();

    const pageUrl = `${SITE}${url.pathname}${url.search}`;
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
    if (!story) {
      setMeta('property', 'og:image:width', '1200');
      setMeta('property', 'og:image:height', '630');
    }
    if (story) setMeta('property', 'og:type', 'article');
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
