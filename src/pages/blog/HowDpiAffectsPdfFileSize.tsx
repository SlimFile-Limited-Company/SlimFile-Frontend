import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogHowDpiAffectsPdfFileSize() {
  useSEO({
    title: 'How DPI Affects PDF File Size — And What to Do About It | SlimFile Blog',
    description: 'DPI (dots per inch) is the biggest factor in scanned PDF file size. Learn what DPI means, how to choose the right setting, and how to compress high-DPI PDFs free.',
    canonical: 'https://slim-file.com/blog/how-dpi-affects-pdf-file-size',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mx-auto mb-6"><Settings className="w-10 h-10 text-amber-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How DPI Affects PDF File Size</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">DPI is the number one reason scanned PDFs are so large. Understanding it helps you choose the right scan settings and compress existing files effectively.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is DPI?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">DPI stands for Dots Per Inch. It measures the resolution of a scanned or printed document — how many individual dots of information are captured per inch of the physical page. Higher DPI means more detail captured, and a much larger file.</p>
            <p className="text-gray-600 leading-relaxed">For example, an A4 page scanned at 600 DPI produces approximately <strong>4× the data</strong> of the same page scanned at 300 DPI — because both the width and height have twice as many pixels.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">DPI vs File Size: The Numbers</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">DPI Setting</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Pixels (A4 page)</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Approx. File Size (per page)</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Best For</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">72 DPI</td><td className="p-3 text-center">595 × 842</td><td className="p-3 text-center">~50–100 KB</td><td className="p-3 text-center">Web display only</td></tr>
                  <tr><td className="p-3">150 DPI</td><td className="p-3 text-center">1240 × 1754</td><td className="p-3 text-center">~200–400 KB</td><td className="p-3 text-center">Email, web sharing</td></tr>
                  <tr className="bg-green-50"><td className="p-3 font-semibold text-green-700">300 DPI</td><td className="p-3 text-center font-semibold">2480 × 3508</td><td className="p-3 text-center font-semibold">~500 KB – 2 MB</td><td className="p-3 text-center font-semibold text-green-700">Standard — archive & OCR</td></tr>
                  <tr><td className="p-3">600 DPI</td><td className="p-3 text-center">4960 × 7016</td><td className="p-3 text-center">~2–8 MB</td><td className="p-3 text-center">Fine print, technical drawings</td></tr>
                  <tr><td className="p-3">1200 DPI</td><td className="p-3 text-center">9920 × 14032</td><td className="p-3 text-center">~10–40 MB</td><td className="p-3 text-center">High-end archival only</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm mt-3">Note: actual file sizes vary based on content complexity and compression applied by the scanner software.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Right DPI for Each Use Case</h2>
            <ul className="space-y-3">
              {[
                "Email or web sharing: 150 DPI — readable, fast to load, email-friendly size",
                "General archiving and OCR: 300 DPI — the sweet spot for quality vs. size",
                "Text-heavy documents (legal, contracts): 300 DPI minimum for clear OCR results",
                "Photographs and artwork in documents: 300–600 DPI to preserve detail",
                "Printing reproductions: 300 DPI — matches print resolution",
                "Fine line technical drawings: 600 DPI if precision is critical",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Have a High-DPI PDF? Compress It</h2>
            <p className="text-gray-600 leading-relaxed mb-4">If your scanner produced a 600 DPI scan that's now 50 MB, you can significantly reduce it without re-scanning. PDF compressors like SlimFile downsample the embedded images from 600 DPI to 150–300 DPI — invisible at normal reading size but dramatically smaller.</p>
            <div className="space-y-4">
              {[
                { step: "1", desc: "Upload your large scanned PDF to SlimFile." },
                { step: "2", desc: "SlimFile automatically detects and re-compresses embedded high-resolution images." },
                { step: "3", desc: "Download the compressed PDF — typically 60–85% smaller while remaining fully readable." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Your Scanned PDF — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Reduce massive scanned PDFs by up to 90%. No account needed.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
