import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogWhatIsOcr() {
  useSEO({
    title: 'What Is OCR? Optical Character Recognition Explained | SlimFile Blog',
    description: 'What is OCR (Optical Character Recognition)? Learn how OCR works, what it\'s used for, and how to extract text from scanned PDFs and images online for free.',
    canonical: 'https://slim-file.com/blog/what-is-ocr',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 mx-auto mb-6"><ScanLine className="w-10 h-10 text-teal-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">What Is OCR? Optical Character Recognition Explained</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">OCR technology reads text from images and scanned documents, converting them into editable and searchable digital text. Here's how it works and when to use it.</p>
          <Link to="/ocr-tool"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Try OCR Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OCR: Optical Character Recognition</h2>
            <p className="text-gray-600 leading-relaxed mb-4">OCR stands for Optical Character Recognition. It is the technology that converts images of text — whether from a photograph, a scanned document, or a non-searchable PDF — into actual machine-readable text that can be copied, edited, and searched.</p>
            <p className="text-gray-600 leading-relaxed">Without OCR, a scanned document is just a photograph. With OCR, that same document becomes fully searchable and editable — just like a Word document.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Does OCR Work?</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Image preprocessing", desc: "The OCR engine first cleans up the image — adjusting contrast, removing noise, straightening skewed text, and converting to black-and-white for clearer character detection." },
                { step: "2", title: "Character segmentation", desc: "The engine identifies individual characters and words by detecting regions of the image that contain text." },
                { step: "3", title: "Pattern recognition", desc: "Each character shape is compared against a library of known character patterns. Modern OCR uses neural networks trained on millions of text samples." },
                { step: "4", title: "Language and context analysis", desc: "The OCR engine uses language models to correct errors — for example, distinguishing 'O' (letter) from '0' (zero) based on context." },
                { step: "5", title: "Output", desc: "The result is a text layer — either a plain text file, a Word document, or a searchable PDF with the text embedded invisibly behind the original image." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What OCR Is Used For</h2>
            <ul className="space-y-3">
              {[
                "Making scanned PDFs searchable — find text within large document archives",
                "Extracting data from invoices, receipts, and forms into spreadsheets",
                "Digitising physical books, newspapers, and historical records",
                "Making handwritten notes editable (with modern AI-powered OCR)",
                "Accessibility — converting image-based documents for screen readers",
                "Legal and compliance workflows — processing contracts and disclosures",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OCR Accuracy: What Affects It?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="font-bold text-green-800 mb-2">Improves accuracy</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✅ High-resolution scans (300 DPI+)</li>
                  <li>✅ Clear, high-contrast text</li>
                  <li>✅ Typed (not handwritten) text</li>
                  <li>✅ Standard fonts</li>
                  <li>✅ Good lighting conditions</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="font-bold text-red-800 mb-2">Reduces accuracy</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>⚠️ Low resolution (&lt;150 DPI)</li>
                  <li>⚠️ Handwriting (varies widely)</li>
                  <li>⚠️ Skewed or rotated pages</li>
                  <li>⚠️ Complex tables and layouts</li>
                  <li>⚠️ Poor scan quality</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Free OCR — Extract Text from Any PDF or Image</h2>
          <p className="text-red-100 mb-8 text-lg">No account needed. Files stay in your browser. Unlimited use.</p>
          <Link to="/ocr-tool"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Try OCR Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
