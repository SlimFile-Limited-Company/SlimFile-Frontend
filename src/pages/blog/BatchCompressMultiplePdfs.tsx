import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Files, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogBatchCompressMultiplePdfs() {
  useSEO({
    title: 'How to Batch Compress Multiple PDFs at Once — Free 2026 | SlimFile Blog',
    description: 'Compress multiple PDF files at the same time for free. Learn batch PDF compression using SlimFile, Automator on Mac, and PowerShell on Windows.',
    canonical: 'https://slim-file.com/blog/batch-compress-multiple-pdfs',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><Files className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Batch Compress Multiple PDFs at Once</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Don't compress PDFs one by one. Here's how to process dozens of files at once — saving hours of repetitive work.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDFs Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When You Need Batch PDF Compression</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Batch PDF compression is useful when you're dealing with monthly invoice archives, scanned document batches, client deliverable folders, or any situation where compressing files one-by-one would take far too long.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Invoice archives with 100+ PDFs per month",
                "Scanned document batches from scanners",
                "Client deliverable folders before project close",
                "Legal file preparation for submission",
                "Marketing asset libraries",
                "Academic research paper collections",
              ].map((use, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile Multi-File Upload</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
              <p className="text-red-700 font-semibold mb-1">✅ Easiest method — no setup required</p>
              <p className="text-gray-600 text-sm">SlimFile supports uploading multiple PDFs in one session. Each file is compressed and available to download individually.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open SlimFile in your browser", desc: "Go to slim-file.com/compress-pdf-online on any device." },
                { step: "2", title: "Select all your PDFs", desc: "Click the upload zone and select multiple files at once, or drag a folder of PDFs onto the page." },
                { step: "3", title: "Wait for batch processing", desc: "SlimFile compresses each file automatically. Processing time depends on file sizes." },
                { step: "4", title: "Download all compressed files", desc: "Download each compressed file individually, or use your browser's batch download if available." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Mac Automator (Desktop Batch)</h2>
            <p className="text-gray-600 mb-4">For Mac users who need offline batch processing, macOS Automator can apply a Quartz filter to an entire folder of PDFs:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open <strong>Automator</strong> from Applications</li>
              <li>Create a new <strong>Folder Action</strong> or <strong>Workflow</strong></li>
              <li>Search for and add <strong>PDF → Filter PDF Documents</strong></li>
              <li>Set the filter to <strong>Reduce File Size</strong></li>
              <li>Drag your folder of PDFs onto the workflow and run</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> Automator's Quartz filter may degrade image quality significantly. For better quality batch compression, use SlimFile.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Ghostscript (Command Line — Mac/Linux/Windows)</h2>
            <p className="text-gray-600 mb-4">Ghostscript is a free, open-source tool that can batch compress PDFs via command line. Install it from ghostscript.com, then run:</p>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-green-400 text-sm font-mono whitespace-pre">{`for f in *.pdf; do
  gs -dBATCH -dNOPAUSE -dQUIET \\
     -sDEVICE=pdfwrite \\
     -dPDFSETTINGS=/ebook \\
     -sOutputFile="compressed_$f" "$f"
done`}</code>
            </div>
            <p className="text-gray-600 text-sm mt-3">Change <code className="bg-gray-100 px-1 rounded">/ebook</code> to <code className="bg-gray-100 px-1 rounded">/screen</code> for aggressive compression or <code className="bg-gray-100 px-1 rounded">/printer</code> for higher quality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Batch Compression Method Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Method</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Setup</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quality</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Platform</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-red-50"><td className="p-3 font-semibold text-red-700">SlimFile</td><td className="p-3">None</td><td className="p-3">⭐⭐⭐⭐⭐</td><td className="p-3">Any</td></tr>
                  <tr><td className="p-3">Mac Automator</td><td className="p-3">Medium</td><td className="p-3">⭐⭐⭐</td><td className="p-3">Mac only</td></tr>
                  <tr><td className="p-3">Ghostscript</td><td className="p-3">Complex</td><td className="p-3">⭐⭐⭐⭐</td><td className="p-3">All</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Batch PDF Compression</h2>
            <ul className="space-y-3">
              {[
                "Always keep originals — compress into a separate output folder",
                "Process similar files together (all scans, all reports) for consistent results",
                "Check a sample of compressed files before distributing the whole batch",
                "For very large batches (500+ files), use Ghostscript for automation",
                "SlimFile is ideal for batches up to 20–30 files where quality control matters",
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
          <h2 className="text-3xl font-bold mb-4">Compress Multiple PDFs Right Now</h2>
          <p className="text-red-100 mb-8 text-lg">Batch upload. Free. No account needed.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDFs Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
