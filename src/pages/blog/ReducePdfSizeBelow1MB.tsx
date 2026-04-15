import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ArrowRight, Zap, Target } from "lucide-react";

export default function BlogReducePdfSizeBelow1MB() {
  useSEO({
    title: 'How to Reduce PDF Size Below 1MB — Step-by-Step 2026 | SlimFile Blog',
    description: 'Learn how to compress a PDF to under 1MB for email, uploads, and forms. Free methods that actually work — no quality loss for most documents.',
    canonical: 'https://slim-file.com/blog/reduce-pdf-size-below-1mb',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mx-auto mb-6"><Target className="w-10 h-10 text-purple-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Reduce PDF Size Below 1MB</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Many forms and email systems reject PDFs over 1MB. Here's how to get your PDF under that limit — without destroying quality.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Now <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why 1MB Is the Magic Number</h2>
            <p className="text-gray-600 leading-relaxed mb-4">A lot of government portals, HR systems, university application forms, and job boards limit PDF uploads to 1MB or 2MB. Even Gmail warns when attachments exceed 25MB, and WhatsApp limits documents to 100MB — but many users want much smaller files for fast loading.</p>
            <p className="text-gray-600 leading-relaxed">Getting a PDF under 1MB is achievable for most documents. Scanned image-heavy PDFs are the hardest — but even those can usually be compressed to 2–5MB with proper tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes PDFs Large?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { cause: "Embedded high-res images", fix: "Compress image DPI to 96–150 for screen viewing" },
                { cause: "Scanned pages (raster)", fix: "Use OCR to convert to text-based PDF" },
                { cause: "Embedded fonts", fix: "Subset fonts to include only used characters" },
                { cause: "Hidden metadata & layers", fix: "Flatten and strip metadata during compression" },
                { cause: "Form fields & annotations", fix: "Flatten interactive elements if editing is done" },
                { cause: "Duplicate resources", fix: "Deduplicate shared image/font assets" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.cause}</p>
                  <p className="text-gray-600 text-xs mt-1">Fix: {item.fix}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step: Get Your PDF Under 1MB</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Check what's making it large", desc: "Open the PDF in any viewer and check the page count and image density. Scanned PDFs are the biggest culprit." },
                { step: "2", title: "Remove unnecessary pages", desc: "Delete blank pages, cover sheets, or attachments you don't need to send. Fewer pages = smaller file." },
                { step: "3", title: "Upload to SlimFile", desc: "Go to slim-file.com/compress-pdf-online. SlimFile automatically applies the best compression for your file type." },
                { step: "4", title: "Check the result size", desc: "If still over 1MB, try compressing the output again (double compression) or remove more pages." },
                { step: "5", title: "For scanned PDFs: use OCR", desc: "SlimFile's OCR tool converts scanned images to searchable text PDFs, which compress far smaller." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Realistic Expectations by PDF Type</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">PDF Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Typical Original</th>
                  <th className="text-left p-3 font-semibold text-gray-700">After SlimFile</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Under 1MB?</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Text-only document</td><td className="p-3">500KB–2MB</td><td className="p-3">100–500KB</td><td className="p-3 text-green-600 font-semibold">✅ Yes</td></tr>
                  <tr><td className="p-3">Word/report with charts</td><td className="p-3">2–10MB</td><td className="p-3">500KB–2MB</td><td className="p-3 text-yellow-600 font-semibold">Usually</td></tr>
                  <tr><td className="p-3">Scanned (10 pages)</td><td className="p-3">10–50MB</td><td className="p-3">2–8MB</td><td className="p-3 text-orange-600 font-semibold">Requires OCR</td></tr>
                  <tr><td className="p-3">Design/brochure</td><td className="p-3">20–100MB</td><td className="p-3">3–15MB</td><td className="p-3 text-red-600 font-semibold">Unlikely</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips for Extreme Compression</h2>
            <ul className="space-y-3">
              {[
                "Split the PDF into sections and submit each part separately if the form allows",
                "Convert scanned pages to text using SlimFile's OCR — text-based PDFs are 80–90% smaller",
                "If the PDF has embedded fonts for rarely-used glyphs, try re-saving through Word or LibreOffice first",
                "Remove annotations, comments, and highlights before compressing",
                "For design PDFs, export from the source app at screen resolution (72–96 DPI) rather than print resolution (300 DPI)",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can any PDF be compressed to under 1MB?", a: "Most text-based PDFs can. Scanned image PDFs with many pages are harder — use OCR first or split the file." },
                { q: "Does compressing reduce quality?", a: "For text PDFs, no visible quality loss. For image-heavy PDFs, slight image compression may occur. SlimFile minimises this." },
                { q: "Can I compress the same PDF twice?", a: "Yes, but diminishing returns apply after the first compression. The second pass will compress less." },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Reduce Your PDF Below 1MB — Free</h2>
          <p className="text-red-100 mb-8 text-lg">No signup. Instant results. Files never stored.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
