import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertWordToPdf() {
  useSEO({
    title: 'How to Convert Word to PDF — Free Online & Built-In Methods 2026 | SlimFile Blog',
    description: 'Convert Word documents (DOCX) to PDF for free. Use SlimFile, Microsoft Word, LibreOffice, or Google Docs — all methods covered with step-by-step guides.',
    canonical: 'https://slim-file.com/blog/convert-word-to-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><FileText className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Convert Word to PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Converting a Word document to PDF ensures it looks identical on every device — no font issues, no layout shifts, no accidental edits.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Convert Word to PDF?</h2>
            <ul className="space-y-3">
              {[
                "PDF looks identical on every device — fonts, layout, and images are locked in place",
                "Recipients can't accidentally edit the content",
                "PDFs are universally openable without Microsoft Word",
                "PDF is the required format for most official submissions (CVs, contracts, applications)",
                "PDF files can be compressed further — DOCX compression is limited",
              ].map((reason, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{reason}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: Microsoft Word (Built-In)</h2>
            <div className="space-y-3">
              {[
                { os: "Windows", steps: "File → Save As → choose PDF from the format dropdown → Save" },
                { os: "Mac", steps: "File → Save As → Format: PDF → Save (or File → Export as PDF)" },
                { os: "Word for Web", steps: "File → Save As → Download as PDF" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.os}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.steps}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: SlimFile Online Converter</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/convert-only", desc: "Open SlimFile's conversion tool in any browser." },
                { step: "2", title: "Upload your DOCX file", desc: "Drag and drop or click to browse. Supports .doc and .docx formats." },
                { step: "3", title: "Download the PDF", desc: "Conversion takes seconds. Download the PDF directly." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Google Docs (Free, No Software)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Go to <strong>docs.google.com</strong></li>
              <li>Upload your DOCX: File → Open → Upload</li>
              <li>Google Docs opens it automatically</li>
              <li>Click <strong>File → Download → PDF Document (.pdf)</strong></li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 4: LibreOffice (Free Desktop App)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Download LibreOffice from libreoffice.org (free)</li>
              <li>Open your Word document in LibreOffice Writer</li>
              <li>Click <strong>File → Export as PDF</strong></li>
              <li>Configure quality settings and click Export</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">LibreOffice is best for bulk conversions and offline use. For one-off conversions, Google Docs or SlimFile are faster.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">After Converting: Compress the PDF</h2>
            <p className="text-gray-600 leading-relaxed">Word-to-PDF conversions often produce larger files than necessary due to embedded fonts and uncompressed images. After converting, run the PDF through SlimFile's compressor to get the smallest possible file for sharing.</p>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Convert Word to PDF — Then Compress It Free</h2>
          <p className="text-red-100 mb-8 text-lg">Convert and compress in one workflow. No account needed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-bold text-lg">Convert Files Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <Link to="/compress-pdf-online"><Button className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-bold text-lg">Compress PDF Free</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
