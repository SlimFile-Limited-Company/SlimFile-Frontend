import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Scissors, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogSplitPdfIntoSeparatePages() {
  useSEO({
    title: 'How to Split PDF Into Separate Pages Online Free 2026 | SlimFile Blog',
    description: 'Split a PDF into individual pages or sections online for free. Extract specific pages from any PDF — no software, no account, works instantly in any browser.',
    canonical: 'https://slim-file.com/blog/split-pdf-into-separate-pages',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6"><Scissors className="w-10 h-10 text-orange-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Split PDF Into Separate Pages</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Extract specific pages from a large PDF — or split it into individual pages. Free, instant, and works in any browser.</p>
          <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Split PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Split a PDF</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Extract one chapter from a long report",
                "Share only specific pages with a client without revealing other content",
                "Break a 200-page document into smaller sections for different teams",
                "Extract the signature page from a contract",
                "Separate invoices from a combined PDF statement",
                "Extract a single form page to refill and resubmit",
              ].map((use, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Split PDF with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/forge", desc: "Open SlimFile's PDF tool in any browser — no account needed." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop your PDF onto the upload zone." },
                { step: "3", title: "Select pages to extract", desc: "Choose specific pages, page ranges, or split all pages into individual files." },
                { step: "4", title: "Download the split pages", desc: "Your selected pages are downloaded as a new PDF or as individual files." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Mac Preview (Built-In)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in <strong>Preview</strong></li>
              <li>Show the thumbnail sidebar: <strong>View → Thumbnails</strong></li>
              <li>Select the page(s) you want to extract</li>
              <li>Drag the selected thumbnails to your Desktop or a Finder window</li>
              <li>macOS automatically saves the dragged pages as a new PDF</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Print Specific Pages</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in any viewer</li>
              <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>⌘+P</strong> (Mac)</li>
              <li>Change the printer to <strong>Microsoft Print to PDF</strong> (Windows) or <strong>PDF → Save as PDF</strong> (Mac)</li>
              <li>In the page range, enter the specific pages: e.g., <strong>3-7</strong> or <strong>1,4,8</strong></li>
              <li>Print/Save the selected pages as a new PDF</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Split Tips</h2>
            <ul className="space-y-3">
              {[
                "Keep the original PDF intact — always split from a copy",
                "After splitting, compress the output PDFs with SlimFile if they'll be shared",
                "For password-protected PDFs, you'll need to unlock them before splitting",
                "Splitting doesn't affect the remaining pages — the original PDF is unchanged",
                "Use page labels (not just page numbers) when specifying ranges — page 1 in a PDF might be labeled 'i' or 'A-1'",
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
          <h2 className="text-3xl font-bold mb-4">Split Your PDF — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">Extract any pages from any PDF. No account. Instant.</p>
          <Link to="/forge"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Split PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
