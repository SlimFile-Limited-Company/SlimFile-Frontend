import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Presentation, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertPptxToPdf() {
  useSEO({
    title: 'How to Convert PPTX to PDF — Free & Fast 2026 | SlimFile Blog',
    description: 'Convert PowerPoint presentations (PPTX) to PDF for easy sharing. Built-in PowerPoint, Google Slides, and online converters — all free methods explained.',
    canonical: 'https://slim-file.com/blog/convert-pptx-to-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6"><Presentation className="w-10 h-10 text-orange-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Convert PPTX to PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Share your PowerPoint presentation as a PDF so it looks perfect on any device — even without Microsoft Office installed.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert PPTX to PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Convert PowerPoint to PDF?</h2>
            <ul className="space-y-3">
              {[
                "PDF opens on any device — no PowerPoint or Google Slides needed",
                "Fonts, animations, and layout are preserved exactly",
                "PDFs are significantly smaller than PPTX files after compression",
                "Prevents recipients from accidentally editing your slides",
                "PDFs can be password protected for confidential presentations",
              ].map((reason, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{reason}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: PowerPoint Built-In Export</h2>
            <div className="space-y-3">
              {[
                { os: "Windows", steps: "File → Save As → PDF, or File → Export → Create PDF/XPS" },
                { os: "Mac", steps: "File → Export → File Format: PDF → Export" },
                { os: "PowerPoint Online", steps: "File → Save As → Download as PDF" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.os}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.steps}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: Google Slides (Free, No Software)</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Upload your PPTX to Google Drive", desc: "Drag the file into drive.google.com and open it with Google Slides." },
                { step: "2", title: "Export as PDF", desc: "File → Download → PDF Document (.pdf)" },
                { step: "3", title: "Download and share", desc: "The PDF saves locally. Compress with SlimFile before emailing if large." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PPTX to PDF Conversion Options Explained</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Setting</th>
                  <th className="text-left p-3 font-semibold text-gray-700">What It Does</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Recommended</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Standard quality</td><td className="p-3">Full slide quality, larger file</td><td className="p-3">For printing</td></tr>
                  <tr><td className="p-3">Minimum size</td><td className="p-3">Compressed images, smaller file</td><td className="p-3">For email/web</td></tr>
                  <tr><td className="p-3">Include speaker notes</td><td className="p-3">Adds notes below each slide</td><td className="p-3">For internal sharing</td></tr>
                  <tr><td className="p-3">Slides per page</td><td className="p-3">Multiple slides on one PDF page</td><td className="p-3">For handouts</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">After Converting: Compress the PDF</h2>
            <p className="text-gray-600 leading-relaxed mb-4">PPTX-to-PDF exports can be large, especially with image-heavy slides. Use SlimFile to compress the PDF further:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Export your PPTX as PDF from PowerPoint or Google Slides</li>
              <li>Open slim-file.com/compress-pdf-online</li>
              <li>Upload the PDF and download the compressed version</li>
              <li>Typical result: 50MB PPTX PDF → 5–10MB compressed PDF</li>
            </ol>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Convert PPTX to PDF — Then Compress Free</h2>
          <p className="text-red-100 mb-8 text-lg">Smaller presentations. Instant. No account needed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-bold text-lg">Convert Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <Link to="/compress-pdf-online"><Button className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-bold text-lg">Compress PDF Free</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
