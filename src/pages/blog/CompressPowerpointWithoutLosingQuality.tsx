import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Presentation, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressPowerpointWithoutLosingQuality() {
  useSEO({
    title: 'How to Compress PowerPoint Without Losing Quality 2026 | SlimFile Blog',
    description: 'Compress PowerPoint presentations (PPTX) without losing slide quality. Free methods using SlimFile, built-in PowerPoint tools, and slide-by-slide image compression.',
    canonical: 'https://slim-file.com/blog/compress-powerpoint-without-losing-quality',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6"><Presentation className="w-10 h-10 text-orange-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Document Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress PowerPoint Without Losing Quality</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">A 50-slide presentation with images can be 100MB+. Share it as a crisp, compressed file that emails easily and loads fast on any device.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pptx-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PPTX Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why PowerPoint Files Are Huge</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Each slide in a PPTX file is its own XML document. When you paste high-res images, embed videos, or copy content from websites, the original full-resolution data comes along. A single background image at 5MB × 30 slides = 150MB presentation.</p>
            <p className="text-gray-600 leading-relaxed">The good news: most of that size comes from images, and images can be compressed significantly without any visible quality loss on screen or in projectors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile PPTX Compressor (Fastest)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
              <p className="text-red-700 font-semibold mb-1">✅ Compress full presentations in one click — no PowerPoint needed</p>
              <p className="text-gray-600 text-sm">SlimFile compresses PPTX files directly in your browser, optimising every embedded image across all slides automatically.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/compress-pptx-online", desc: "Open SlimFile's PPTX compressor in any browser." },
                { step: "2", title: "Upload your presentation", desc: "Drag your .pptx file onto the upload zone. Files up to 100MB supported." },
                { step: "3", title: "Wait for compression", desc: "SlimFile optimises each image across every slide automatically." },
                { step: "4", title: "Download and present", desc: "Your compressed PPTX is ready to email, upload to Drive, or present directly." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Compress Images in PowerPoint Directly</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Click on any image in your presentation</li>
              <li>Go to <strong>Picture Format → Compress Pictures</strong></li>
              <li>Select the target resolution:
                <ul className="ml-6 mt-2 space-y-1">
                  <li><strong>HD (150 ppi)</strong> — Good for presentations viewed on screen</li>
                  <li><strong>Email (96 ppi)</strong> — Maximum compression for sharing</li>
                </ul>
              </li>
              <li>Check <strong>"Apply to all pictures in this presentation"</strong></li>
              <li>Uncheck <strong>"Delete cropped areas of pictures"</strong> if you may need to re-crop later</li>
              <li>Click OK and save</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Save as PDF for Read-Only Sharing</h2>
            <p className="text-gray-600 mb-4">If recipients only need to view (not edit) the presentation, a PDF is far smaller:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Click <strong>File → Export → Create PDF/XPS</strong></li>
              <li>Click <strong>Options</strong> and select <strong>Minimum size (publishing online)</strong></li>
              <li>Save the PDF, then upload to SlimFile for further compression</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">A 50MB PPTX often becomes a 2–5MB PDF this way — perfect for email attachments.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Keeping Presentations Small</h2>
            <ul className="space-y-3">
              {[
                "Use images at display resolution (1920×1080px max) — don't insert 4K images onto a 1080p slide",
                "Link to videos instead of embedding them — keeps the PPTX tiny while videos load from URL",
                "Use SmartArt and native shapes instead of image screenshots of diagrams",
                "Remove speaker notes with sensitive info before compressing for external sharing",
                "SlimFile supports PPTX files — no need to convert to PDF if you need to keep it editable",
                "Check File → Info → Compress Media for embedded audio/video reduction in PowerPoint",
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
          <h2 className="text-3xl font-bold mb-4">Compress Your Presentation — Free</h2>
          <p className="text-red-100 mb-8 text-lg">PPTX and PDF compression. No account. Instant results.</p>
          <Link to="/compress-pptx-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PPTX Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
