import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { AlignLeft, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertPdfToText() {
  useSEO({
    title: 'How to Convert PDF to Text Online — Extract Text Free 2026 | SlimFile Blog',
    description: 'Extract and convert PDF content to plain text online. Free tools for copying text from PDFs, including scanned documents using OCR. Works in any browser.',
    canonical: 'https://slim-file.com/blog/convert-pdf-to-text',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mx-auto mb-6"><AlignLeft className="w-10 h-10 text-slate-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Convert PDF to Text Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Extract all text from a PDF — whether it's a typed document or a scanned image. Free, private, and works in any browser.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ocr-tool"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Extract Text with OCR <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Two Types of PDFs — Two Different Methods</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Text-Based PDF</p>
                <p className="text-gray-600 text-sm mb-3">Created from Word, Excel, or typed content. Text is stored as actual characters — copy and paste works.</p>
                <p className="text-green-700 text-sm font-semibold">Method: Select → Copy</p>
              </div>
              <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Scanned/Image PDF</p>
                <p className="text-gray-600 text-sm mb-3">Created by scanning paper. Pages are stored as photos — text can't be copied directly. OCR is needed.</p>
                <p className="text-red-700 text-sm font-semibold">Method: OCR Tool</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: Copy Text Directly (Text-Based PDFs)</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open the PDF in any viewer", desc: "Chrome, Edge, Adobe Reader, Preview — any PDF viewer works." },
                { step: "2", title: "Select all text", desc: "Press Ctrl+A (Windows) or ⌘+A (Mac) to select all text in the document." },
                { step: "3", title: "Copy and paste", desc: "Ctrl+C / ⌘+C to copy, then paste into Word, Notepad, Google Docs, or anywhere else." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Can't select text?</strong> The PDF is scanned — use OCR (Method 2).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: OCR for Scanned PDFs (SlimFile)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-4">
              <p className="text-red-700 font-semibold mb-1">✅ Works on scanned documents — no text selection needed</p>
              <p className="text-gray-600 text-sm">SlimFile's OCR engine reads the images in your PDF and converts them to real, selectable text.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/ocr-tool", desc: "Open SlimFile's OCR tool in any browser." },
                { step: "2", title: "Upload your scanned PDF", desc: "The OCR engine processes each page and detects the text content." },
                { step: "3", title: "Download the text-based PDF", desc: "The output is a searchable PDF where all text is selectable and copyable." },
                { step: "4", title: "Copy the text you need", desc: "Open the output PDF and copy any section — or use Ctrl+A → Ctrl+C to get all text." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF to Text Use Cases</h2>
            <ul className="space-y-3">
              {[
                "Extracting data from scanned invoices or receipts for accounting",
                "Converting physical contracts to editable digital text",
                "Digitising old research papers or books for editing",
                "Extracting text from government forms to fill digitally",
                "Converting scanned meeting notes to editable documents",
                "Making PDFs searchable for internal document management",
              ].map((use, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{use}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Extract Text from PDF — Free OCR</h2>
          <p className="text-red-100 mb-8 text-lg">Works on scanned PDFs. No account. Instant results.</p>
          <Link to="/ocr-tool"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Try OCR Tool Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
