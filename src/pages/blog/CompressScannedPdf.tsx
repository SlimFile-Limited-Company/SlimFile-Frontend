import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressScannedPdf() {
  useSEO({
    title: 'How to Compress a Scanned PDF — Reduce Size Without Losing Text 2026 | SlimFile Blog',
    description: 'Scanned PDFs are huge because they store pages as images. Learn how to compress scanned PDFs using OCR and image optimization — free with SlimFile.',
    canonical: 'https://slim-file.com/blog/compress-scanned-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 mx-auto mb-6"><ScanLine className="w-10 h-10 text-teal-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress a Scanned PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Scanned PDFs are some of the largest files you'll encounter. Here's how to shrink them dramatically without losing readability.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            <Link to="/ocr-tool"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">Try OCR Tool</Button></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Scanned PDFs Are So Large</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When you scan a document, your scanner captures each page as a photograph — a high-resolution raster image. A 10-page scanned document at 300 DPI can easily reach 30–100MB, because every page is essentially a large JPEG or TIFF embedded inside the PDF.</p>
            <p className="text-gray-600 leading-relaxed">Regular PDFs with text content are tiny in comparison, because text data compresses to almost nothing. The key to reducing scanned PDF size is to either compress those embedded images or convert the scan to real text using OCR.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Two Strategies for Scanned PDF Compression</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Strategy 1: Image Compression</p>
                <p className="text-gray-600 text-sm mb-3">Reduce the resolution of embedded scan images. Faster and simpler — good for archiving or internal use.</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ Quick to apply</li>
                  <li>✅ No OCR processing time</li>
                  <li>⚠️ Text not searchable</li>
                  <li>⚠️ Less reduction than OCR</li>
                </ul>
              </div>
              <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Strategy 2: OCR + Text Conversion</p>
                <p className="text-gray-600 text-sm mb-3">Extract text from the scan and create a true text PDF. Dramatically smaller files with searchable content.</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ 80–95% smaller file</li>
                  <li>✅ Searchable text</li>
                  <li>✅ Copy-paste works</li>
                  <li>⚠️ Takes slightly longer</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: Compress Scanned PDF with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/compress-pdf-online", desc: "Open SlimFile in Chrome, Safari, or Edge on any device." },
                { step: "2", title: "Upload your scanned PDF", desc: "Drop the file on the upload zone. SlimFile accepts files up to 50MB." },
                { step: "3", title: "SlimFile detects it's a scan", desc: "The compressor automatically applies image-optimised compression for scanned content." },
                { step: "4", title: "Download your compressed PDF", desc: "Typical reduction: 60–80%. The pages remain fully readable." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: OCR Your Scanned PDF (Best Compression)</h2>
            <p className="text-gray-600 mb-4">Using SlimFile's built-in OCR tool, you can convert a scanned image-based PDF into a proper text document — which compresses to a fraction of the original size.</p>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/ocr-tool", desc: "Open SlimFile's dedicated OCR tool." },
                { step: "2", title: "Upload your scanned PDF", desc: "The OCR engine reads each page and extracts the text content." },
                { step: "3", title: "Download the text-based PDF", desc: "The output is a searchable PDF with the same visual layout but stored as text — dramatically smaller." },
                { step: "4", title: "Optional: run compression on the output", desc: "For maximum size reduction, run the OCR output through the PDF compressor as a second pass." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Size Reductions</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Original Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">After Image Compression</th>
                  <th className="text-left p-3 font-semibold text-gray-700">After OCR Conversion</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">5MB (5 pages)</td><td className="p-3">~1.5MB</td><td className="p-3">~300KB</td></tr>
                  <tr><td className="p-3">20MB (20 pages)</td><td className="p-3">~6MB</td><td className="p-3">~1.2MB</td></tr>
                  <tr><td className="p-3">50MB (50 pages)</td><td className="p-3">~15MB</td><td className="p-3">~3MB</td></tr>
                  <tr><td className="p-3">100MB (100 pages)</td><td className="p-3">~30MB</td><td className="p-3">~6MB</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Scanned PDF Compression</h2>
            <ul className="space-y-3">
              {[
                "Scan documents at 150–200 DPI instead of 300+ DPI when possible — dramatically reduces file size at capture",
                "Use black-and-white mode for text-only documents — colour scanning adds no value for contracts or forms",
                "OCR works best on clean, clearly typed text — handwriting or poor scans may have lower accuracy",
                "SlimFile's OCR preserves the original layout so the output still looks like your document",
                "After OCR, documents become searchable and copy-paste works — a bonus beyond just smaller size",
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
          <h2 className="text-3xl font-bold mb-4">Compress Your Scanned PDF Now</h2>
          <p className="text-red-100 mb-8 text-lg">Image compression + OCR tools. Free. No signup.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <Link to="/ocr-tool"><Button className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-bold text-lg">Try OCR Tool</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
