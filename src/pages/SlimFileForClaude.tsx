import { useSEO } from '@/hooks/useSEO';
import { ArrowUpRight, Check, Copy, Lock, Upload, Wand2, Download } from 'lucide-react';
import { useState } from 'react';

const MCP_URL = 'https://mcp.slim-file.com/mcp';

const tools = [
  ['Compress', 'Make PDFs, images, Word, Excel and PowerPoint files smaller.'],
  ['Convert', 'PDF to Word or PowerPoint, Office and images to PDF, and between JPG, PNG and WebP.'],
  ['Merge PDFs', 'Join up to 20 PDFs into one, and optionally compress the result.'],
  ['Split a PDF', 'Cut a PDF into page ranges or single pages.'],
  ['Photos to PDF', 'Turn photos of paper pages into one small PDF.'],
  ['Scan to Word, Excel or PowerPoint', 'Turn photos of pages into editable documents.'],
  ['Extract text', 'Read the text in scans and photos (OCR).'],
  ['Lock and unlock PDFs', 'Add a password, or remove one when you know it.'],
  ['Zip files', 'Put several files into one ZIP.'],
  ['Text to PDF', 'Turn text Claude wrote into a clean, print-ready PDF.'],
  ['QR codes', 'Make a QR code for a link, text, Wi-Fi details and more.'],
];

const prompts = [
  'Open SlimFile so I can compress a PDF',
  'Merge these PDFs with SlimFile',
  'Use SlimFile to turn my photos into one PDF',
  'Make a QR code for my website with SlimFile',
  'Turn this summary into a PDF with SlimFile',
];

const SlimFileForClaude = () => {
  useSEO({
    title: 'SlimFile for Claude: compress, convert and merge files in Claude | SlimFile',
    description:
      'Use SlimFile inside Claude. Compress, convert, merge, split, lock and scan files without leaving the chat. Free, no account needed.',
  });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the URL is shown, so it can be copied by hand */
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-28 pb-24 text-[#1d1d1f]">
      <div className="mx-auto max-w-3xl px-4">
        <header className="text-center">
          <img src="/favicon.png" alt="" className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-white p-2 shadow-sm" />
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#e5302f]">SlimFile for Claude</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your file tools, right inside Claude.</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#6e6e73]">
            Compress, convert, merge, split, lock and scan files without leaving the conversation. Free, and no account needed.
          </p>
        </header>

        <section className="mt-14 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Set it up</h2>
          <ol className="mt-5 space-y-4 text-[17px] leading-relaxed">
            <li className="flex gap-4">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#1d1d1f] text-sm font-semibold text-white">1</span>
              <span>
                In Claude, open <strong>Settings → Connectors</strong>. Find <strong>SlimFile</strong> in the directory and click <strong>Connect</strong>.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#1d1d1f] text-sm font-semibold text-white">2</span>
              <span>
                Or add it yourself: click <strong>Add custom connector</strong>, name it SlimFile, and paste this address. No sign-in is needed.
              </span>
            </li>
          </ol>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f5f5f7] p-2 pl-4">
            <code className="flex-1 truncate font-mono text-[15px]">{MCP_URL}</code>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-4 text-[15px] text-[#6e6e73]">
            Works on claude.ai, the Claude desktop app and the Claude mobile apps. In a chat, turn SlimFile on from the <strong>+</strong> menu
            under Connectors.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              [Upload, 'Drop your files', 'Ask Claude to open SlimFile. A SlimFile card appears in the chat. Drop your files into it.'],
              [Wand2, 'Choose what to do', 'Pick Compress, Convert, Merge, Split and more, then tap the button.'],
              [Download, 'Download', 'Download the result straight from the card. Claude can see what was done.'],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof Upload;
              return (
                <div key={title as string}>
                  <I className="h-7 w-7 text-[#e5302f]" strokeWidth={1.7} />
                  <h3 className="mt-3 font-semibold">{title as string}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#6e6e73]">{text as string}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
            Files that are already online can be used by link: just give Claude the link. In apps that can't show the card, Claude gives you a
            private upload page instead.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">What you can do</h2>
          <ul className="mt-5 divide-y divide-gray-100">
            {tools.map(([name, text]) => (
              <li key={name} className="py-3.5">
                <p className="font-semibold">{name}</p>
                <p className="text-[15px] text-[#6e6e73]">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Things to try</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {prompts.map((p) => (
              <span key={p} className="rounded-full bg-[#f5f5f7] px-4 py-2 text-[15px]">
                “{p}”
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-[#e5302f]" strokeWidth={1.8} />
            <h2 className="text-2xl font-semibold tracking-tight">Privacy</h2>
          </div>
          <ul className="mt-5 space-y-3 text-[16px] leading-relaxed text-[#424245]">
            <li>Your files are sent only to SlimFile's own servers, and only to do what you asked.</li>
            <li>Uploaded files are deleted as soon as SlimFile has processed them. Each result is deleted once it's downloaded, and anything left unused is deleted after 15 minutes.</li>
            <li>SlimFile can't see your Claude conversations, and doesn't sell or share your files with anyone.</li>
            <li>No account, no sign-in, no tracking inside Claude.</li>
          </ul>
          <a href="/privacy" className="mt-5 inline-flex items-center gap-1 font-semibold text-[#e5302f] hover:underline">
            Read the full privacy policy <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Limits and help</h2>
          <ul className="mt-5 space-y-3 text-[16px] leading-relaxed text-[#424245]">
            <li>Up to 30 files at a time, 500 MB each. Text extraction takes files up to 25 MB.</li>
            <li>Password-protected PDFs need to be unlocked first, with their password.</li>
            <li>
              Questions or problems? Email{' '}
              <a href="mailto:administration@slim-file.com" className="font-semibold text-[#e5302f] hover:underline">
                administration@slim-file.com
              </a>
              .
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SlimFileForClaude;
