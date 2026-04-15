import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogExtractTextFromPdfUsingOcr() {
  useSEO({
    title: 'How to Extract Text from PDF Using OCR — Free Online 2026 | SlimFile Blog',
    description: 'Extract text from scanned PDFs using OCR (Optical Character Recognition). Free online tool — make scanned documents searchable and editable in seconds.',
    canonical: 'https://slim-file.com/blog/extract-text-from-pdf-using-ocr',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 mx-auto mb-6"><ScanLine className="w-10 h-10 text-teal-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Extract Text from PDF Using OCR</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Scanned PDFs store pages as images — you can't select or search the text. OCR reads those images and converts them to real, searchable text.</p>
          <Link to="/ocr-tool"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Try OCR Tool Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is OCR?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">OCR stands for Optical Character Recognition. It's a technology that analyses images of text — such as scanned pages, photographs of documents, or screenshots — and identifies the characters, words, and layout to produce editable, searchable digital text.</p>
            <p className="text-gray-600 leading-relaxed">Modern OCR engines achieve over 99% accuracy on clearly printed text in standard fonts. Handwriting recognition is also possible, though accuracy varies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Extract Text with SlimFile OCR</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/ocr-tool", desc: "Open SlimFile's OCR tool in any browser — no account, no extension needed." },
                { step: "2", title: "Upload your scanned PDF or image", desc: "Supports PDF, JPEG, PNG, TIFF, and BMP files." },
                { step: "3", title: "OCR runs on each page", desc: "SlimFile's engine reads the text from each image and reconstructs the document layout." },
                { step: "4", title: "Download the searchable PDF", desc: "The output is a PDF where all text is selectable, searchable, and copy-pasteable." },
                { step: "5", title: "Copy the text you need", desc: "Select all (Ctrl+A / ⌘+A) and copy to use the text in any application." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What OCR Enables</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { feature: "Searchable PDFs", desc: "Use Ctrl+F to search for any word in the document" },
                { feature: "Copy-paste text", desc: "Select and copy text from scanned pages like any regular document" },
                { feature: "Smaller file size", desc: "Text-based PDFs compress dramatically — often 80% smaller than scanned" },
                { feature: "Accessibility", desc: "Screen readers can read OCR-processed text aloud" },
                { feature: "Editable documents", desc: "Import OCR output into Word or Google Docs for further editing" },
                { feature: "Data extraction", desc: "Extract invoice totals, contract terms, and form data automatically" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.feature}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OCR Accuracy — What to Expect</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Document Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Expected Accuracy</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Typed document, clean scan</td><td className="p-3">98–99%+</td></tr>
                  <tr><td className="p-3">Printed book or report</td><td className="p-3">95–99%</td></tr>
                  <tr><td className="p-3">Low-quality scan or photocopy</td><td className="p-3">85–95%</td></tr>
                  <tr><td className="p-3">Handwritten text</td><td className="p-3">60–85% (varies by handwriting clarity)</td></tr>
                  <tr><td className="p-3">Mixed languages</td><td className="p-3">90–98% (language detection dependent)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Better OCR Results</h2>
            <ul className="space-y-3">
              {[
                "Scan at 300 DPI minimum — 150 DPI scans will produce lower accuracy",
                "Use straight, flat scans — curved or tilted pages reduce recognition accuracy",
                "High contrast is better — black text on white background gives best results",
                "Clean the scanner glass before scanning to avoid smudge artifacts",
                "For old or faded documents, increase scan contrast in your scanner settings",
                "OCR handles multiple languages well — specify the language if accuracy is critical",
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
          <h2 className="text-3xl font-bold mb-4">Extract Text from PDFs — Free OCR</h2>
          <p className="text-red-100 mb-8 text-lg">Make scanned documents searchable and copyable. No account.</p>
          <Link to="/ocr-tool"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Try OCR Tool Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
