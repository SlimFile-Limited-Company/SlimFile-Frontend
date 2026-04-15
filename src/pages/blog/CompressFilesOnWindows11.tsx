import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Monitor, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressFilesOnWindows11() {
  useSEO({
    title: 'How to Compress Files on Windows 11 — Built-In & Free Tools 2026 | SlimFile Blog',
    description: 'Compress PDF, image, and document files on Windows 11 using built-in ZIP, SlimFile, and other free tools. No third-party software required for most tasks.',
    canonical: 'https://slim-file.com/blog/compress-files-on-windows-11',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mx-auto mb-6"><Monitor className="w-10 h-10 text-indigo-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress Files on Windows 11</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Windows 11 has several built-in compression tools — and for PDFs and images, SlimFile in Edge takes seconds with zero setup.</p>
          <Link to="/compress"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Windows 11 Built-In Compression Tools</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Windows 11 includes several compression features out of the box. The right tool depends on what you're compressing and why.</p>
            <div className="space-y-4">
              {[
                { tool: "Built-in ZIP (Send to Compressed folder)", best: "Compressing folders to send via email", limit: "Doesn't compress PDF or image content — just packages files" },
                { tool: "Microsoft Edge (Print to PDF)", best: "Quick re-export of a PDF to potentially smaller size", limit: "Results are unpredictable — sometimes increases size" },
                { tool: "Word/Excel Image Compression", best: "Shrinking Office documents", limit: "Only works inside Office apps" },
                { tool: "SlimFile in Edge or Chrome", best: "PDFs, images, PPTX — real content compression", limit: "Requires internet connection" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.tool}</p>
                  <p className="text-green-700 text-xs"><strong>Best for:</strong> {item.best}</p>
                  <p className="text-red-600 text-xs mt-0.5"><strong>Limit:</strong> {item.limit}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: ZIP Files in Windows 11</h2>
            <p className="text-gray-600 mb-4">Right-click any file or folder to ZIP it — no third-party software needed:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Select one or more files in File Explorer</li>
              <li>Right-click → <strong>Compress to ZIP file</strong></li>
              <li>Windows 11 creates a .zip archive immediately</li>
              <li>Rename the ZIP and attach it to email or upload to cloud storage</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> ZIP compresses text and data files well but has minimal effect on already-compressed files like JPEG, MP4, and ZIP itself. For PDFs and images, use SlimFile for real compression.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: Compress PDFs with SlimFile in Edge</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open Microsoft Edge", desc: "Edge comes pre-installed on Windows 11." },
                { step: "2", title: "Go to slim-file.com/compress-pdf-online", desc: "Type the URL in the address bar and press Enter." },
                { step: "3", title: "Upload your PDF", desc: "Drag the file onto the page or click to browse your files." },
                { step: "4", title: "Download compressed PDF", desc: "Click Download. The file saves to your Downloads folder automatically." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: NTFS File System Compression</h2>
            <p className="text-gray-600 mb-4">Windows 11 supports transparent NTFS compression for files on your hard drive. This reduces the amount of disk space a file uses, though the file remains the same size when transferred:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Right-click a file or folder → <strong>Properties</strong></li>
              <li>Click <strong>Advanced</strong> on the General tab</li>
              <li>Check <strong>"Compress contents to save disk space"</strong></li>
              <li>Click OK → Apply → OK</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">NTFS compression is transparent — compressed files open normally. Best for archiving data you access infrequently.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Windows 11 File Compression Tips</h2>
            <ul className="space-y-3">
              {[
                "For PDFs — use SlimFile in Edge, not Print to PDF (Print to PDF doesn't truly compress)",
                "For images — SlimFile compresses JPEG, PNG, WebP, and HEIC in seconds",
                "For Office files — use the built-in Picture Compression tool then convert to PDF via SlimFile",
                "For sharing folders — ZIP natively, then compress individual large files inside with SlimFile before zipping",
                "Install SlimFile as a PWA via Edge (Settings → Apps → Install this site as an app) for quick access",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Files on Windows 11 — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Works in Microsoft Edge. No install. Instant results.</p>
          <Link to="/compress"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Files Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
