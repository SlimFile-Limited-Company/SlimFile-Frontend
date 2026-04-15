import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { RotateCw, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogRotatePdfPagesOnline() {
  useSEO({
    title: 'How to Rotate PDF Pages Online Free 2026 | SlimFile Blog',
    description: 'Rotate PDF pages online for free — fix upside-down or sideways scanned pages instantly. Rotate one page or all pages without any software or account.',
    canonical: 'https://slim-file.com/blog/rotate-pdf-pages-online',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><RotateCw className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Rotate PDF Pages Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Fix upside-down or sideways pages in any PDF — instantly, free, with no software to install.</p>
          <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Rotate PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 3 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why PDF Pages Need Rotating</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Scanned documents often come out sideways or upside down — especially when scanning without carefully checking orientation. Some PDFs also mix portrait and landscape pages, making them awkward to read. Rotating pages permanently fixes them for all future viewers.</p>
            <p className="text-gray-600 leading-relaxed">Rotating in a PDF viewer (like Adobe Reader or Chrome) is only temporary — the rotation resets when you reopen the file. Permanent rotation edits the PDF itself.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Rotate PDF Pages with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/forge", desc: "Open SlimFile's PDF tool in any browser — no account needed." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop or click to select your file." },
                { step: "3", title: "Select pages and rotation direction", desc: "Choose 90° right, 90° left, or 180° (upside down flip). Apply to all pages or specific pages." },
                { step: "4", title: "Download the rotated PDF", desc: "The rotation is permanently saved in the output PDF." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Mac Preview (Permanent Rotation)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in <strong>Preview</strong></li>
              <li>Show thumbnails: <strong>View → Thumbnails</strong></li>
              <li>Select the page(s) to rotate</li>
              <li>Press <strong>⌘ + L</strong> (rotate left) or <strong>⌘ + R</strong> (rotate right)</li>
              <li>Save the file: <strong>⌘ + S</strong></li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Adobe Reader (View-Only — Not Permanent)</h2>
            <p className="text-gray-600 mb-4">Adobe Reader allows temporary rotation during viewing but doesn't save it unless you have Acrobat Pro:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in Adobe Reader</li>
              <li>Go to <strong>View → Rotate View → Clockwise / Counterclockwise</strong></li>
              <li>This rotates the view only — not the PDF itself</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> Adobe Reader's rotation is view-only. For permanent rotation (so all recipients see it correctly), use SlimFile or Mac Preview.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Rotation Tips</h2>
            <ul className="space-y-3">
              {[
                "Rotate all pages if the entire scan is sideways, or specific pages if only some are wrong",
                "After rotating, run the PDF through SlimFile's compressor — rotation processing sometimes adds file size",
                "For scanned PDFs, consider OCR after rotation to make the text searchable",
                "Preview on Mac lets you rotate individual pages without affecting others — ideal for mixed-orientation documents",
                "Rotating a PDF doesn't affect the content — text, images, and form fields remain intact",
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
          <h2 className="text-3xl font-bold mb-4">Rotate PDF Pages — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">Permanent rotation. Any page. No account needed.</p>
          <Link to="/forge"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Rotate PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
