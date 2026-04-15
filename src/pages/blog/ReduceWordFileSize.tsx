import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogReduceWordFileSize() {
  useSEO({
    title: 'How to Reduce Word File Size — 7 Proven Methods 2026 | SlimFile Blog',
    description: 'Reduce the size of large Word documents with 7 proven methods. Remove images, tracked changes, embedded fonts, and more — free tips for Windows and Mac.',
    canonical: 'https://slim-file.com/blog/reduce-word-file-size',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><FileText className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Document Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Reduce Word File Size</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Seven proven methods to shrink bloated Word documents — from quick fixes inside Word to converting formats for sharing.</p>
          <Link to="/compress"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7 Methods to Reduce Word File Size</h2>
            <div className="space-y-5">
              {[
                {
                  num: "1", title: "Compress Embedded Images",
                  desc: "This single step often reduces file size by 50–90%. Click any image → Picture Format → Compress Pictures → select 'Email (96 ppi)' → apply to all.",
                },
                {
                  num: "2", title: "Accept or Reject All Tracked Changes",
                  desc: "Tracked changes store both the original and changed text. Accept all via Review → Accept → Accept All Changes, then save.",
                },
                {
                  num: "3", title: "Remove Embedded Fonts",
                  desc: "Go to File → Options → Save → uncheck 'Embed fonts in the file' (unless recipients need a rare font). Save the document.",
                },
                {
                  num: "4", title: "Save as .docx Instead of .doc",
                  desc: "The modern DOCX format compresses content internally. If you have a legacy .doc file, Save As → DOCX to gain 20–40% size reduction immediately.",
                },
                {
                  num: "5", title: "Remove Hidden Data with Document Inspector",
                  desc: "Go to File → Info → Check for Issues → Inspect Document. Remove hidden text, comments, revision history, and personal info.",
                },
                {
                  num: "6", title: "Delete Unused Styles",
                  desc: "Styles copied from other documents accumulate. Home → Styles panel → right-click unused styles → Delete.",
                },
                {
                  num: "7", title: "Convert to PDF for Sharing",
                  desc: "If recipients only need to read — not edit — convert to PDF. A 20MB DOCX often becomes 2MB as PDF. Compress further with SlimFile.",
                },
              ].map(item => (
                <div key={item.num} className="flex gap-4 items-start p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.num}</div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Size Reductions by Method</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Method</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Typical Reduction</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Best For</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Compress images</td><td className="p-3">50–90%</td><td className="p-3">Image-heavy docs</td></tr>
                  <tr><td className="p-3">Remove tracked changes</td><td className="p-3">10–30%</td><td className="p-3">Collaborative drafts</td></tr>
                  <tr><td className="p-3">Remove embedded fonts</td><td className="p-3">5–20%</td><td className="p-3">Docs with many fonts</td></tr>
                  <tr><td className="p-3">DOC → DOCX conversion</td><td className="p-3">20–40%</td><td className="p-3">Legacy files</td></tr>
                  <tr><td className="p-3">Convert to PDF + compress</td><td className="p-3">70–90%</td><td className="p-3">Read-only sharing</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Wins for Word File Size</h2>
            <ul className="space-y-3">
              {[
                "Use 'Save As' to create a clean copy without revision history artifacts",
                "Right-click images in your doc → Format Picture → Size to check if they're unnecessarily large",
                "Remove any embedded Excel objects by right-clicking → Edit Object → close and re-paste as a regular table",
                "Check page count — sometimes old content is hidden in long white space below the main document",
                "Reduce page margins if the document has a lot of whitespace — fewer pages = smaller file",
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
          <h2 className="text-3xl font-bold mb-4">Share Word Docs as Compressed PDFs — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Convert to PDF and compress in seconds. No account needed.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
