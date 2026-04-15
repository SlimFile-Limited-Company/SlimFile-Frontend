import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Image, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertPdfToJpeg() {
  useSEO({
    title: 'How to Convert PDF to JPEG Online — Free & High Quality 2026 | SlimFile Blog',
    description: 'Convert PDF pages to JPEG images online for free. Extract pages from any PDF as high-quality JPEGs for sharing, editing, or using in documents.',
    canonical: 'https://slim-file.com/blog/convert-pdf-to-jpeg',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mx-auto mb-6"><Image className="w-10 h-10 text-yellow-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Convert PDF to JPEG Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Turn any PDF page into a JPEG image — perfect for sharing individual pages, creating thumbnails, or posting content on social media.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert PDF to JPEG Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Convert PDF to JPEG with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/convert-only", desc: "Open SlimFile in any browser — no download or account required." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop or click to browse. Any PDF file is supported." },
                { step: "3", title: "Select JPEG as output", desc: "Choose which pages to convert — one, several, or all pages." },
                { step: "4", title: "Download your JPEG images", desc: "Each page is saved as a separate high-quality JPEG file." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Mac Preview</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open your PDF in <strong>Preview</strong></li>
              <li>Click <strong>File → Export</strong></li>
              <li>Change Format to <strong>JPEG</strong></li>
              <li>Adjust quality slider if needed</li>
              <li>Click <strong>Save</strong></li>
            </ol>
            <p className="text-gray-600 text-sm mt-3">Preview exports one page at a time. Navigate between pages before exporting to save each page individually.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Windows — Snipping Tool or Print to PDF Workaround</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PDF in <strong>Microsoft Edge</strong></li>
              <li>Navigate to the page you want</li>
              <li>Press <strong>Windows + Shift + S</strong> to open Snipping Tool</li>
              <li>Select the page area and save as JPEG</li>
            </ol>
            <p className="text-gray-600 text-sm mt-3">This method is quick for single pages. For multi-page or high-quality conversion, use SlimFile.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">JPEG vs PNG — Which to Use for PDF Conversion?</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Use Case</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Best Format</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Reason</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Social media sharing</td><td className="p-3">JPEG</td><td className="p-3">Smaller file, great for photos</td></tr>
                  <tr><td className="p-3">Email as image</td><td className="p-3">JPEG</td><td className="p-3">Wide compatibility, smaller size</td></tr>
                  <tr><td className="p-3">Text/graphics documents</td><td className="p-3">PNG</td><td className="p-3">Lossless — sharper text</td></tr>
                  <tr><td className="p-3">Design editing</td><td className="p-3">PNG</td><td className="p-3">Lossless, supports transparency</td></tr>
                  <tr><td className="p-3">Web thumbnails</td><td className="p-3">JPEG or WebP</td><td className="p-3">Smaller files load faster</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF to JPEG Tips</h2>
            <ul className="space-y-3">
              {[
                "For sharing on Instagram or Facebook, use 1080px wide at 80% JPEG quality — optimal for social platforms",
                "JPEG doesn't support transparency — if your PDF has a transparent background, choose PNG instead",
                "After converting, compress the JPEG with SlimFile if it's still too large for your use case",
                "For presentations, convert at 150–200 DPI for crisp text on screens",
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
          <h2 className="text-3xl font-bold mb-4">Convert PDF to JPEG — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">High-quality image output. No account. Works instantly.</p>
          <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Convert PDF to JPEG Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
