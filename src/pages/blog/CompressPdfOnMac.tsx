import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Monitor, FileText, CheckCircle, ArrowRight, Zap, Shield, Download, Star } from "lucide-react";

export default function BlogCompressPdfOnMac() {
  useSEO({
    title: 'How to Compress PDF on Mac — Free & Easy Methods 2026 | SlimFile Blog',
    description: 'Learn how to compress PDF files on a Mac for free. Use SlimFile, Preview, or Automator to shrink PDFs instantly without losing quality.',
    canonical: 'https://slim-file.com/blog/compress-pdf-on-mac',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6">
            <Monitor className="w-10 h-10 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress PDF on Mac</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Three proven methods to shrink PDF files on macOS — no paid software needed. Works on MacBook, iMac, and Mac Mini.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">All Compression Tools</Button></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Compress a PDF on Mac?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Mac users deal with large PDFs every day — scanned documents, design files, reports, and contracts. A 50MB PDF is impossible to email (Gmail's limit is 25MB), slow to upload to Google Drive, and frustrating to share with clients. Compressing it down to 2–5MB solves all of that instantly.</p>
            <p className="text-gray-600 leading-relaxed">Whether you're a student submitting assignments, a freelancer sending proposals, or a business professional managing contracts, knowing how to compress PDFs on your Mac is an essential skill in 2026.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: Use SlimFile (Fastest — Works in Browser)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
              <p className="text-red-700 font-semibold mb-2">✅ Recommended — No download, no signup, instant results</p>
              <p className="text-gray-600">SlimFile runs entirely in your Safari or Chrome browser. No app to install, no files stored on any server.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open SlimFile in Safari or Chrome", desc: "Navigate to slim-file.com/compress-pdf-online on your Mac." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop your PDF onto the upload zone, or click to browse your files." },
                { step: "3", title: "Wait for compression", desc: "SlimFile compresses your PDF in seconds using smart optimization." },
                { step: "4", title: "Download the compressed file", desc: "Click Download and your smaller PDF is saved to your Downloads folder." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Use Mac Preview (Built-In)</h2>
            <p className="text-gray-600 mb-4">macOS comes with Preview, which has a Quartz filter that reduces PDF size. It's free and requires no downloads, but results are less predictable than SlimFile.</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open your PDF in Preview (double-click the file)</li>
              <li>Click <strong>File</strong> → <strong>Export as PDF</strong></li>
              <li>Click the <strong>Quartz Filter</strong> dropdown and select <strong>Reduce File Size</strong></li>
              <li>Click <strong>Save</strong></li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> Preview's Reduce File Size filter can make images look blurry. For best quality, use SlimFile instead.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Use Automator (Batch Compress)</h2>
            <p className="text-gray-600 mb-4">If you need to compress multiple PDFs at once, macOS Automator can do it in a workflow. This is a good option for power users who regularly process large batches.</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open <strong>Automator</strong> from Applications</li>
              <li>Choose <strong>Workflow</strong> as the document type</li>
              <li>Search for <strong>PDF → Filter PDF Documents</strong></li>
              <li>Add the <strong>Reduce File Size</strong> Quartz filter</li>
              <li>Run the workflow on your folder of PDFs</li>
            </ol>
            <p className="text-gray-600 mt-3">For batch compression with better quality control, <Link to="/compress" className="text-red-600 underline">SlimFile supports multiple files</Link> in one session.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparison: Which Mac Method Is Best?</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Method</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Quality</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Speed</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Batch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-red-50"><td className="p-3 font-semibold text-red-700">SlimFile</td><td className="p-3">⭐⭐⭐⭐⭐</td><td className="p-3">Instant</td><td className="p-3">✅ Yes</td></tr>
                  <tr><td className="p-3">Preview</td><td className="p-3">⭐⭐⭐</td><td className="p-3">Fast</td><td className="p-3">❌ No</td></tr>
                  <tr><td className="p-3">Automator</td><td className="p-3">⭐⭐⭐</td><td className="p-3">Slow setup</td><td className="p-3">✅ Yes</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Getting the Smallest PDF on Mac</h2>
            <ul className="space-y-3">
              {["Remove unnecessary pages before compressing", "Flatten form fields if the PDF won't be edited", "Use SlimFile for image-heavy PDFs — it optimizes embedded images without visible quality loss", "For scanned PDFs, try SlimFile's OCR tool to convert them to text-based PDFs which compress much smaller"].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I compress a PDF on Mac without losing quality?", a: "Yes. SlimFile uses smart compression that removes hidden metadata and optimizes images without visible degradation." },
                { q: "Does Mac have a free built-in PDF compressor?", a: "Yes — Preview's Export as PDF with the Reduce File Size Quartz filter. But for better results, SlimFile is recommended." },
                { q: "How small can I make a PDF on Mac?", a: "Typically 50–90% smaller depending on content. Image-heavy PDFs compress the most." },
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
          <h2 className="text-3xl font-bold mb-4">Compress Your PDF on Mac Right Now</h2>
          <p className="text-red-100 mb-8 text-lg">No app needed. Works in Safari and Chrome. Files are never stored.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
