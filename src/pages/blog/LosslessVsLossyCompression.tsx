import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogLosslessVsLossyCompression() {
  useSEO({
    title: 'Lossless vs Lossy Compression — What\'s the Difference? | SlimFile Blog',
    description: 'Lossless vs lossy compression explained clearly. Understand when to use each type for images, PDFs, and audio — and how it affects quality and file size.',
    canonical: 'https://slim-file.com/blog/lossless-vs-lossy-compression',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mx-auto mb-6"><BookOpen className="w-10 h-10 text-slate-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Lossless vs Lossy Compression</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Two fundamentally different approaches to making files smaller. Understanding the difference will help you choose the right tool for every situation.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Core Difference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-800 text-lg mb-2">Lossless Compression</p>
                <p className="text-gray-600 text-sm mb-3">Reduces file size without discarding any data. The original file can be perfectly reconstructed from the compressed version.</p>
                <p className="text-xs text-blue-700 font-semibold">Think of it like: zipping a folder — all files are still there when you unzip.</p>
              </div>
              <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                <p className="font-bold text-orange-800 text-lg mb-2">Lossy Compression</p>
                <p className="text-gray-600 text-sm mb-3">Reduces file size by permanently discarding data deemed "imperceptible" to the human eye or ear. Cannot be reversed.</p>
                <p className="text-xs text-orange-700 font-semibold">Think of it like: making a photocopy — close to the original, but not identical.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparison at a Glance</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Property</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Lossless</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Lossy</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Data preservation</td><td className="p-3 text-center text-green-600">100% — no data lost</td><td className="p-3 text-center text-orange-600">Some data discarded</td></tr>
                  <tr><td className="p-3">File size reduction</td><td className="p-3 text-center">Moderate (10–50%)</td><td className="p-3 text-center text-green-600">High (50–95%)</td></tr>
                  <tr><td className="p-3">Quality after compression</td><td className="p-3 text-center text-green-600">Identical to original</td><td className="p-3 text-center">Slightly reduced</td></tr>
                  <tr><td className="p-3">Reversible?</td><td className="p-3 text-center text-green-600">Yes</td><td className="p-3 text-center text-red-600">No</td></tr>
                  <tr><td className="p-3">Common formats</td><td className="p-3 text-center">PNG, ZIP, FLAC, PDF (text)</td><td className="p-3 text-center">JPEG, MP3, WebP, HEIC</td></tr>
                  <tr><td className="p-3">Best for</td><td className="p-3 text-center">Documents, graphics, code</td><td className="p-3 text-center">Photos, audio, video</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use Lossless Compression</h2>
            <ul className="space-y-3">
              {[
                "Text documents, spreadsheets, or code files — data integrity is essential",
                "PNG images with transparent backgrounds or sharp edges (logos, icons)",
                "Medical imaging (X-rays, MRI scans) where precision is critical",
                "Legal or financial documents that must match the original exactly",
                "Source files you'll edit later — lossy compression degrades further with each save",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use Lossy Compression</h2>
            <ul className="space-y-3">
              {[
                "Photographs intended for websites — human eyes can't detect the quality loss at 80-85% JPEG quality",
                "Social media uploads where bandwidth and load speed matter",
                "Videos and audio files where file size must be minimised",
                "Any image where the output quality at high compression ratios is still visually acceptable",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What About PDFs?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">PDFs are complex — they can contain text (lossless), embedded images (lossy or lossless), and vector graphics (always lossless). When you compress a PDF, the tool typically:</p>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>Re-compresses embedded images at lower quality (lossy)</li>
              <li>Removes metadata, embedded fonts, and redundant data (lossless)</li>
              <li>Downsizes high-resolution images to screen resolution (lossy)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">SlimFile's PDF compressor applies a combination of both — maximising size reduction while keeping text crisp and readable.</p>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Smarter — Free with SlimFile</h2>
          <p className="text-red-100 mb-8 text-lg">PDF, images, PPTX — optimised compression for every file type.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Files Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
