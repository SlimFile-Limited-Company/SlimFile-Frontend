import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Files, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogMergePdfFilesOnlineFree() {
  useSEO({
    title: 'How to Merge PDF Files Online Free — Combine PDFs Instantly 2026 | SlimFile Blog',
    description: 'Merge multiple PDF files into one online for free. Combine PDFs in any order — no account, no software, works on Windows, Mac, and mobile.',
    canonical: 'https://slim-file.com/blog/merge-pdf-files-online-free',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><Files className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Merge PDF Files Online Free</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Combine multiple PDF documents into a single file — perfect for contracts, reports, portfolios, and application packages.</p>
          <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Merge PDFs Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Merge PDFs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Combine CV and cover letter into one application PDF",
                "Package multiple contract pages into a single signable file",
                "Merge monthly reports into an annual summary",
                "Combine scanned pages that were saved separately",
                "Package project deliverables into a single client PDF",
                "Combine bank statements for accountants or mortgage applications",
              ].map((use, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Merge PDFs with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/forge", desc: "Open SlimFile's PDF merge tool in any browser." },
                { step: "2", title: "Upload your PDF files", desc: "Upload all the PDFs you want to combine. Drag to reorder them before merging." },
                { step: "3", title: "Arrange the order", desc: "Drag and drop the uploaded files into the sequence you want in the final PDF." },
                { step: "4", title: "Download the merged PDF", desc: "SlimFile combines all files into a single PDF and downloads it immediately." },
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
              <li>Open the first PDF in <strong>Preview</strong></li>
              <li>Go to <strong>View → Thumbnails</strong> to show the sidebar</li>
              <li>Drag additional PDFs from Finder into the thumbnail sidebar</li>
              <li>Arrange pages in the desired order</li>
              <li>Click <strong>File → Export as PDF</strong> to save the merged file</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compress the Merged PDF</h2>
            <p className="text-gray-600 mb-4">After merging, the combined PDF can be larger than expected. Compress it with SlimFile for easy sharing:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Upload the merged PDF to slim-file.com/compress-pdf-online</li>
              <li>Download the compressed version</li>
              <li>The merged + compressed PDF is ready to email or upload</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Merge Tips</h2>
            <ul className="space-y-3">
              {[
                "Compress individual PDFs before merging for a smaller final file",
                "Use consistent page orientation (all portrait or all landscape) before merging",
                "For legal documents, check that signatures and form data are preserved after merging",
                "Name the merged file clearly before sharing (e.g., 'john-smith-application-2026.pdf')",
                "Password protection can be added after merging via SlimFile's PDF lock tool",
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
          <h2 className="text-3xl font-bold mb-4">Merge PDFs — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">Combine any number of PDFs instantly. No account needed.</p>
          <Link to="/forge"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Merge PDFs Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
