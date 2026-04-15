import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogWhatIsAPdf() {
  useSEO({
    title: 'What Is a PDF File? Everything You Need to Know | SlimFile Blog',
    description: 'What is a PDF? Learn what PDF files are, how they work, why they\'re the standard for documents, and how to compress, convert, and manage them online for free.',
    canonical: 'https://slim-file.com/blog/what-is-a-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6"><FileText className="w-10 h-10 text-red-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">What Is a PDF File?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">PDF is the world's most widely used document format. Here's everything you need to know about what PDF files are, how they work, and how to manage them.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Stands For Portable Document Format</h2>
            <p className="text-gray-600 leading-relaxed mb-4">PDF was developed by Adobe in 1992 and became an open standard (ISO 32000) in 2008. The "portable" part is what makes it powerful: a PDF looks exactly the same on every device, operating system, and screen size — regardless of the fonts, software, or settings on the viewer's machine.</p>
            <p className="text-gray-600 leading-relaxed">When you create a Word document and send it to someone else, it might look different on their screen if they have different fonts or an older version of Word. PDFs solve this entirely.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Can a PDF Contain?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Text and formatted content",
                "Images (JPEG, PNG, TIFF)",
                "Vector graphics and diagrams",
                "Embedded fonts",
                "Hyperlinks and bookmarks",
                "Form fields (fillable forms)",
                "Digital signatures",
                "Video and audio (rare)",
                "Password protection",
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Are PDF Files So Large?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">PDFs can become large for several reasons:</p>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>High-resolution embedded images</strong> — a PDF from a scanner stores full-resolution images</li>
              <li><strong>Embedded fonts</strong> — the full font file is sometimes stored inside the PDF</li>
              <li><strong>Scanned pages</strong> — each scanned page is essentially a large image</li>
              <li><strong>Redundant data</strong> — some PDF creators include revision history or metadata</li>
              <li><strong>Uncompressed content streams</strong> — not all PDF writers compress their output</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">SlimFile's PDF compressor addresses all of these to significantly reduce file size while keeping your document readable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of PDF Files</h2>
            <div className="space-y-4">
              {[
                { type: "Text-based PDF", desc: "Created from Word, Google Docs, or other software. Contains actual text that can be selected, copied, and searched. Best for compression." },
                { type: "Scanned PDF", desc: "A photograph or scan of a physical document. Contains images rather than actual text. Requires OCR to make the text searchable." },
                { type: "Searchable PDF", desc: "A scanned PDF that has had OCR applied — it has an invisible text layer behind the image, making it searchable." },
                { type: "PDF/A", desc: "An archival format for long-term preservation. Fonts and colors are embedded for consistent rendering decades from now." },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common PDF Tasks — Done Free with SlimFile</h2>
            <ul className="space-y-3">
              {[
                "Compress PDF — reduce file size without losing quality",
                "OCR — convert scanned PDFs to searchable text",
                "AI Summarize — get a concise summary of any PDF",
                "Merge — combine multiple PDFs into one",
                "Split — separate a PDF into individual pages",
                "Convert — PDF to Word, PNG, JPEG, and more",
                "Lock/Unlock — add or remove password protection",
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
          <h2 className="text-3xl font-bold mb-4">Manage Your PDFs — Free with SlimFile</h2>
          <p className="text-red-100 mb-8 text-lg">Compress, OCR, summarize, merge, convert. No account. No limits.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
