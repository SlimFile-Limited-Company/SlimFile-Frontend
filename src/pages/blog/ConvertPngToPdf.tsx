import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Image, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertPngToPdf() {
  useSEO({
    title: 'How to Convert PNG to PDF Online — Free & Instant 2026 | SlimFile Blog',
    description: 'Convert PNG images to PDF online for free. Combine multiple PNGs into one PDF, or convert a single image. Works on Windows, Mac, and mobile — no software needed.',
    canonical: 'https://slim-file.com/blog/convert-png-to-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mx-auto mb-6"><Image className="w-10 h-10 text-purple-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Convert PNG to PDF Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Turn one or multiple PNG images into a single PDF document — free, instant, and no software to install.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert PNG to PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Convert PNG to PDF</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Submitting screenshots as supporting documents",
                "Combining scanned form pages into one file",
                "Creating a photo portfolio as a single PDF",
                "Converting WhiteBoard or diagram screenshots for professional sharing",
                "Submitting signature images with contracts",
                "Packaging design mockups for client review",
              ].map((use, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile Online Converter</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/convert-only", desc: "Open SlimFile's converter in any browser — no account or extension needed." },
                { step: "2", title: "Upload your PNG files", desc: "Upload one PNG or multiple PNGs to combine into one PDF." },
                { step: "3", title: "Download the PDF", desc: "SlimFile converts instantly and downloads the resulting PDF." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Windows — Print to PDF</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PNG in the Windows Photos app or Paint</li>
              <li>Press <strong>Ctrl + P</strong> to print</li>
              <li>Select <strong>Microsoft Print to PDF</strong> as the printer</li>
              <li>Click Print and save the file</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">For multiple PNGs, select all files in File Explorer, right-click → Print → set printer to Microsoft Print to PDF. Windows will combine them into a single PDF.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Mac — Print to PDF</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the PNG in Preview</li>
              <li>Press <strong>⌘ + P</strong> to print</li>
              <li>Click <strong>PDF</strong> in the bottom-left corner</li>
              <li>Choose <strong>Save as PDF</strong></li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">For multiple images, select all in Finder, right-click → Open With → Preview. In Preview, File → Export as PDF.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PNG to PDF Conversion Tips</h2>
            <ul className="space-y-3">
              {[
                "Compress the resulting PDF with SlimFile — PNG-based PDFs are often large due to lossless image data",
                "For multiple images, ensure they're in the correct order before converting — reordering after conversion requires a merge tool",
                "Use PNG for images with transparency, text, or logos — the transparency is preserved in the PDF",
                "For screenshots, reduce the resolution before converting if the PDF is for screen viewing only",
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
          <h2 className="text-3xl font-bold mb-4">Convert PNG to PDF — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">Instant conversion. No account. Works on all devices.</p>
          <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Convert PNG to PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
