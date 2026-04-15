import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogExtractPagesFromPdf() {
  useSEO({
    title: 'How to Extract Pages from a PDF Online Free 2026 | SlimFile Blog',
    description: 'Extract specific pages from any PDF online for free. Save individual pages or a custom page range as a new PDF — no software, no account required.',
    canonical: 'https://slim-file.com/blog/extract-pages-from-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><FileText className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Extract Pages from a PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Pull specific pages out of any PDF and save them as a new document — without opening or editing the original.</p>
          <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Extract PDF Pages Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Extract Pages with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/forge", desc: "Open SlimFile in any browser. No account or installation needed." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop the file. SlimFile shows a page preview for easy selection." },
                { step: "3", title: "Select pages to extract", desc: "Enter page numbers or ranges (e.g., 1, 3, 5-10). Select all if splitting into separate files." },
                { step: "4", title: "Download extracted pages", desc: "Your selected pages are saved as a new PDF document." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Page Extraction Scenarios</h2>
            <div className="space-y-3">
              {[
                { scenario: "Extract pages 1–5 from a 200-page report", use: "Share only the executive summary" },
                { scenario: "Extract page 12 from a contract", use: "Share the signature page for signing" },
                { scenario: "Extract pages 10, 20, 30", use: "Pull specific invoice pages from a combined statement" },
                { scenario: "Extract all odd pages", use: "Recover a double-sided scan that scanned pages in order" },
                { scenario: "Extract last 5 pages", use: "Share the bibliography of an academic paper" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.scenario}</p>
                  <p className="text-gray-600 text-xs mt-1">Use case: {item.use}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Mac Preview</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in <strong>Preview</strong></li>
              <li>View → Thumbnails to show page sidebar</li>
              <li>Click the pages you want (Cmd+click for multiple)</li>
              <li>Drag the selected thumbnails to your Desktop or Finder folder</li>
              <li>macOS automatically creates a new PDF with just those pages</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Print Specific Pages</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF and press <strong>Ctrl+P</strong> (or ⌘+P on Mac)</li>
              <li>In the page range field, enter your page numbers</li>
              <li>Set destination to <strong>Save as PDF</strong></li>
              <li>Save — only the specified pages are included</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Extraction Tips</h2>
            <ul className="space-y-3">
              {[
                "Page numbers in PDFs may differ from printed page labels — count from the start of the file",
                "After extraction, compress the result with SlimFile for easy sharing",
                "Original PDF is never altered — extraction creates a new file",
                "For password-protected PDFs, you'll need to unlock them first with SlimFile's unlock tool",
                "If extracting to share sensitive content, remember other pages remain in the original — share only the extracted version",
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
          <h2 className="text-3xl font-bold mb-4">Extract PDF Pages — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">Any pages, any PDF. No account. Instant download.</p>
          <Link to="/forge"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Extract Pages Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
