import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressPdfForPrinting() {
  useSEO({
    title: 'How to Compress PDF for Printing Without Losing Quality 2026 | SlimFile Blog',
    description: 'Compress a PDF for printing while keeping it sharp. Learn the right DPI settings, compression strategies, and free tools to get print-ready PDFs at smaller sizes.',
    canonical: 'https://slim-file.com/blog/compress-pdf-for-printing',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mx-auto mb-6"><Printer className="w-10 h-10 text-slate-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress PDF for Printing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Sending a large PDF to a print shop doesn't mean you need a huge file. Compress it smartly — preserving print quality while cutting transfer time.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Print vs. Screen: Different Compression Goals</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When compressing for screen viewing, you can reduce image resolution to 72–96 DPI — the human eye can't tell on a monitor. But for printing, images need 150–300 DPI to look sharp on paper. This means print-optimised compression is gentler on image quality but still removes significant bloat.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-semibold text-gray-900 mb-2">Screen/Email Compression</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Target DPI: 72–96</li>
                  <li>Typical size: 200KB–2MB</li>
                  <li>Best for: web, email, sharing</li>
                </ul>
              </div>
              <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                <p className="font-semibold text-gray-900 mb-2">Print Compression</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Target DPI: 150–300</li>
                  <li>Typical size: 2–20MB</li>
                  <li>Best for: print shops, offices</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress PDF for Printing with SlimFile</h2>
            <p className="text-gray-600 mb-4">SlimFile applies balanced compression that preserves print quality while removing metadata bloat, duplicate resources, and over-compressed fonts:</p>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/compress-pdf-online", desc: "Open in any browser on your device." },
                { step: "2", title: "Upload your print-ready PDF", desc: "Drag and drop the file onto the upload zone." },
                { step: "3", title: "SlimFile compresses intelligently", desc: "The tool removes metadata and compresses images while keeping resolution appropriate for printing." },
                { step: "4", title: "Review and download", desc: "Download the output and open it at 100% zoom to verify print quality before sending to the printer." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Not to Do When Compressing for Print</h2>
            <div className="space-y-4">
              {[
                { warning: "Don't use 'screen' preset in Ghostscript", detail: "The /screen preset drops images to 72 DPI — fine for monitors, terrible for printing." },
                { warning: "Don't use aggressive online compressors", detail: "Some tools compress to the smallest possible file regardless of use case. This destroys print quality." },
                { warning: "Don't compress design files from print shops", detail: "If a print shop sent you a print-ready PDF, leave it uncompressed. Their presets are calibrated for their printers." },
                { warning: "Don't strip colour profiles", detail: "Colour profiles (CMYK/sRGB) ensure accurate colour reproduction. Some compressors remove them — SlimFile does not." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-red-500 font-bold text-lg leading-none mt-0.5">✕</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.warning}</p>
                    <p className="text-gray-600 text-xs mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Print Quality vs. File Size: What's Realistic?</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Document Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Original</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Print-Safe Compressed</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">1-page flyer with photos</td><td className="p-3">15MB</td><td className="p-3">3–5MB</td></tr>
                  <tr><td className="p-3">20-page brochure</td><td className="p-3">80MB</td><td className="p-3">15–25MB</td></tr>
                  <tr><td className="p-3">Text report (50 pages)</td><td className="p-3">8MB</td><td className="p-3">1–3MB</td></tr>
                  <tr><td className="p-3">Business card design</td><td className="p-3">5MB</td><td className="p-3">1–2MB</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Print-Ready PDF Compression</h2>
            <ul className="space-y-3">
              {[
                "Always check the compressed file at 100–200% zoom before sending to a printer",
                "Compress in the browser, not via Print to PDF — Print to PDF re-renders at screen resolution",
                "Keep the original uncompressed version as a backup",
                "If images look slightly softer after compression, they'll usually print fine — screens exaggerate compression artifacts",
                "For premium print jobs (business cards, signage), ask your print shop for their size requirements before compressing",
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
          <h2 className="text-3xl font-bold mb-4">Compress Your PDF for Print — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Quality-preserving compression. No account. Works in any browser.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
