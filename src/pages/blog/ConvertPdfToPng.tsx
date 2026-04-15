import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Image, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertPdfToPng() {
  useSEO({
    title: 'How to Convert PDF to PNG Online — Free & High Quality 2026 | SlimFile Blog',
    description: 'Convert PDF pages to PNG images online for free. Extract individual pages or convert entire PDFs to PNG — no software, no account, instant results.',
    canonical: 'https://slim-file.com/blog/convert-pdf-to-png',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mx-auto mb-6"><Image className="w-10 h-10 text-indigo-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Convert PDF to PNG Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Extract PDF pages as high-quality PNG images — perfect for thumbnails, presentations, social media, and embedding in documents.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert PDF to PNG Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Convert PDF to PNG?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Share a single page of a PDF as an image on social media",
                "Create thumbnails of PDF documents for website previews",
                "Insert PDF content into a presentation as an image",
                "Share a PDF page in WhatsApp or email as a photo",
                "Use PDF content in design tools like Canva or Figma",
                "Convert a signed contract page to an image for quick review",
              ].map((use, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Convert PDF to PNG with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/convert-only", desc: "Open SlimFile's converter in any browser." },
                { step: "2", title: "Upload your PDF", desc: "Drag and drop or browse. SlimFile processes in your browser session." },
                { step: "3", title: "Select PNG as the output format", desc: "Choose the page or pages you want to convert." },
                { step: "4", title: "Download your PNG images", desc: "Each PDF page is saved as a separate high-quality PNG." },
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
              <li>Click <strong>File → Export</strong></li>
              <li>Change the Format to <strong>PNG</strong></li>
              <li>Adjust resolution if needed</li>
              <li>Click <strong>Save</strong></li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">Preview exports one page at a time. For multi-page PDFs, use SlimFile or a batch tool.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF to PNG vs PDF to JPEG — Which to Use?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-gray-900 mb-2">PNG — Choose When:</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ The PDF has text or sharp graphics</li>
                  <li>✅ You need a transparent background</li>
                  <li>✅ The image will be further edited</li>
                  <li>⚠️ Larger file sizes than JPEG</li>
                </ul>
              </div>
              <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                <p className="font-bold text-gray-900 mb-2">JPEG — Choose When:</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ The PDF is photo-heavy</li>
                  <li>✅ File size is a priority</li>
                  <li>✅ The image won't be edited further</li>
                  <li>⚠️ Slightly lower quality on text</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for High-Quality PDF to PNG Conversion</h2>
            <ul className="space-y-3">
              {[
                "Higher DPI means larger file size but sharper images — 150–200 DPI is good for most uses",
                "For print-ready images, use 300 DPI — for web or social media, 96–150 DPI is fine",
                "PNG is lossless — text will look sharp even at lower resolutions",
                "Compress the resulting PNG with SlimFile if the file size is too large for sharing",
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
          <h2 className="text-3xl font-bold mb-4">Convert PDF to PNG — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">High-quality PNG output. No account. Works on all devices.</p>
          <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Convert PDF to PNG Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
