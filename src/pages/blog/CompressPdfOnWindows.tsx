import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Monitor, CheckCircle, ArrowRight, Zap, FileText } from "lucide-react";

export default function BlogCompressPdfOnWindows() {
  useSEO({
    title: 'How to Compress PDF on Windows — Free Methods 2026 | SlimFile Blog',
    description: 'Compress PDF files on Windows 10 and 11 for free. Use SlimFile in your browser, Microsoft Print to PDF, or free desktop tools — no Adobe needed.',
    canonical: 'https://slim-file.com/blog/compress-pdf-on-windows',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><Monitor className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress PDF on Windows</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Reduce PDF file size on Windows 10 and 11 without Adobe Acrobat. Free browser-based and built-in methods covered.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Compress PDFs on Windows?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Windows is used in most offices and schools worldwide, yet many users struggle to send large PDF attachments. Outlook blocks files over 20MB by default, and uploading a 100MB scanned document to SharePoint can take minutes. Compression cuts that down to seconds.</p>
            <p className="text-gray-600 leading-relaxed">The good news: you don't need Adobe Acrobat Pro (which costs $20+/month) to compress PDFs on Windows. There are several free methods that work just as well.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile in Chrome or Edge (Best Option)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
              <p className="text-red-700 font-semibold mb-1">✅ No installation required — works in any browser</p>
              <p className="text-gray-600 text-sm">SlimFile compresses your PDF in the browser. Your files are processed securely and never stored.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/compress-pdf-online", desc: "Open Chrome, Edge, or Firefox and navigate to the page." },
                { step: "2", title: "Upload your PDF", desc: "Drag the file onto the page or click Browse to select it." },
                { step: "3", title: "Let SlimFile compress it", desc: "Processing takes a few seconds even for large files." },
                { step: "4", title: "Download and use", desc: "Save the compressed PDF to your Downloads folder." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Microsoft Print to PDF</h2>
            <p className="text-gray-600 mb-4">Windows 10 and 11 have a built-in "Microsoft Print to PDF" printer that can re-export a PDF at lower quality. This is a quick workaround but often reduces quality significantly.</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open your PDF in Microsoft Edge or Adobe Reader</li>
              <li>Press <strong>Ctrl + P</strong> to open the print dialog</li>
              <li>Select <strong>Microsoft Print to PDF</strong> as the printer</li>
              <li>Click <strong>Print</strong> and save the new file</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Limitation:</strong> This method often increases file size for text-heavy PDFs and degrades image quality. Use SlimFile for consistent, high-quality results.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Word's "Save as PDF" (For DOCX Files)</h2>
            <p className="text-gray-600 mb-4">If your PDF started as a Word document, re-save it through Word with the "Minimum size" option.</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the original .docx file in Microsoft Word</li>
              <li>Click <strong>File → Save As → PDF</strong></li>
              <li>Click <strong>Options</strong> and select <strong>Minimum size (publishing online)</strong></li>
              <li>Click <strong>Save</strong></li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Windows PDF Compression: Method Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Method</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quality</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Ease</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Cost</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-red-50"><td className="p-3 font-semibold text-red-700">SlimFile</td><td className="p-3">⭐⭐⭐⭐⭐</td><td className="p-3">Very Easy</td><td className="p-3">Free</td></tr>
                  <tr><td className="p-3">Print to PDF</td><td className="p-3">⭐⭐</td><td className="p-3">Easy</td><td className="p-3">Free</td></tr>
                  <tr><td className="p-3">Word Save as PDF</td><td className="p-3">⭐⭐⭐⭐</td><td className="p-3">Easy</td><td className="p-3">Needs Word</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips for Windows Users</h2>
            <ul className="space-y-3">
              {["Right-click any PDF in File Explorer and open with Edge to quickly print-to-PDF compress it", "Use SlimFile for scanned PDFs — it handles image compression far better than Windows built-in tools", "For bulk compression, SlimFile supports multiple files in one session", "Rename your file after compression to avoid confusion (e.g. report-compressed.pdf)"].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Your PDF on Windows Now</h2>
          <p className="text-red-100 mb-8 text-lg">Works in Chrome, Edge, and Firefox. No software to install.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
