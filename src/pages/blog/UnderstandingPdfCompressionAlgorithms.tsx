import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Cpu, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogUnderstandingPdfCompressionAlgorithms() {
  useSEO({
    title: 'Understanding PDF Compression Algorithms — How PDFs Get Smaller | SlimFile Blog',
    description: 'How do PDF compressors actually work? Learn about Flate, JPEG, JBIG2, and other algorithms used to reduce PDF file sizes, explained simply.',
    canonical: 'https://slim-file.com/blog/understanding-pdf-compression-algorithms',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mx-auto mb-6"><Cpu className="w-10 h-10 text-violet-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Understanding PDF Compression Algorithms</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">What actually happens inside a PDF compressor? Here's a plain-English explanation of the algorithms that make PDF files smaller.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDFs Are Made of Streams</h2>
            <p className="text-gray-600 leading-relaxed mb-4">A PDF is not a single blob of data — it's a collection of "content streams": text, images, fonts, vector graphics, and metadata. Each stream can be compressed independently using different algorithms. A PDF compressor works by re-compressing these streams more aggressively than the original PDF creator did.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Main PDF Compression Algorithms</h2>
            <div className="space-y-5">
              {[
                {
                  name: "Flate (Deflate / ZIP)",
                  type: "Lossless",
                  used: "Text, vector graphics, metadata",
                  desc: "The same algorithm used in ZIP files. It finds repeating patterns in data and stores them efficiently. Ideal for text because text is highly repetitive — the word 'the' might appear thousands of times in a document.",
                  savings: "10–50% on text streams",
                },
                {
                  name: "JPEG (DCT)",
                  type: "Lossy",
                  used: "Photographic images embedded in PDFs",
                  desc: "Discrete Cosine Transform — the basis of JPEG compression. It divides images into 8×8 pixel blocks and discards high-frequency detail that the human eye doesn't notice. A PDF compressor re-encodes images at a lower quality level (e.g. 85% → 70%).",
                  savings: "40–80% on photographic images",
                },
                {
                  name: "JBIG2",
                  type: "Lossy or Lossless",
                  used: "Scanned black-and-white text pages",
                  desc: "Specifically designed for scanned documents. It identifies repeated character shapes (because the letter 'e' appears hundreds of times) and stores them once, referencing the pattern everywhere else. Dramatically reduces file size for scanned text.",
                  savings: "Up to 95% on scanned B&W pages",
                },
                {
                  name: "CCITT Group 4 (Fax compression)",
                  type: "Lossless",
                  used: "Black-and-white scanned images",
                  desc: "An older lossless algorithm originally designed for fax machines. Very efficient for pure black-and-white (1-bit) images with large areas of solid color.",
                  savings: "50–80% on B&W scans",
                },
                {
                  name: "LZW",
                  type: "Lossless",
                  used: "GIF images embedded in PDFs",
                  desc: "Lempel-Ziv-Welch — another pattern-finding algorithm. Less common in modern PDFs but still encountered in legacy documents.",
                  savings: "20–40%",
                },
              ].map((algo, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900 text-lg">{algo.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${algo.type === 'Lossless' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{algo.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2"><strong>Used for:</strong> {algo.used}</p>
                  <p className="text-gray-600 text-sm mb-2">{algo.desc}</p>
                  <p className="text-xs text-green-700 font-semibold">Typical savings: {algo.savings}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What a PDF Compressor Actually Does</h2>
            <ul className="space-y-3">
              {[
                "Re-encodes JPEG images at lower quality (e.g., 85% → 60%) — biggest size reduction",
                "Downsamples high-resolution images (e.g., 600 DPI → 150 DPI) for screen viewing",
                "Applies Flate compression to uncompressed text and vector streams",
                "Removes redundant metadata, revision history, and embedded thumbnails",
                "Subsets embedded fonts — only stores the characters actually used in the document",
                "Flattens transparency where possible — simplifies the PDF structure",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Some PDFs Can't Be Compressed Much</h2>
            <p className="text-gray-600 leading-relaxed mb-4">If a PDF is already well-optimised — with JPEG images at 80% quality and Flate-compressed text streams — there's little room for further reduction. Running it through a compressor again might only save 5–10%.</p>
            <p className="text-gray-600 leading-relaxed">The biggest gains come from PDFs created by scanners (which store full-resolution, uncompressed images) or older PDF creators that didn't apply modern compression at creation time.</p>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Your PDF — Free, Instantly</h2>
          <p className="text-red-100 mb-8 text-lg">Advanced compression. No account. Files stay in your browser.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
