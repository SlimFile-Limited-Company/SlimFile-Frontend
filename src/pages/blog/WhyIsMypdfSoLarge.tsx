import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogWhyIsMypdfSoLarge() {
  useSEO({
    title: 'Why Is My PDF So Large? Causes & Fixes 2026 | SlimFile Blog',
    description: "Understand why your PDF file is so large and what you can do to reduce its size. Common causes include embedded images, fonts, and metadata — all fixable for free.",
    canonical: 'https://slim-file.com/blog/why-is-my-pdf-so-large',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6"><HelpCircle className="w-10 h-10 text-orange-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Education</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Why Is My PDF So Large?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">A one-page document shouldn't be 50MB. Here's what's actually making your PDF huge — and how to fix it fast.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Fix It Now — Compress Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The 7 Reasons Your PDF Is Huge</h2>
            <div className="space-y-5">
              {[
                {
                  num: "1",
                  title: "High-Resolution Embedded Images",
                  desc: "The most common culprit. When you paste or insert a photo into a Word document or design file and export to PDF, the full-resolution image is embedded. A single 12-megapixel photo can be 8MB. Three of them? 24MB — just for the images.",
                  fix: "Compress with SlimFile, which optimises embedded images to screen resolution without visible quality loss.",
                },
                {
                  num: "2",
                  title: "Scanned Pages (Raster Images)",
                  desc: "When you scan a physical document, each page becomes a photo. A 300 DPI scan of a full page creates a large raster image — 10 scanned pages can equal 30–80MB.",
                  fix: "Use SlimFile's OCR tool to convert scanned images to searchable text, reducing size by 80–95%.",
                },
                {
                  num: "3",
                  title: "Embedded Full Font Sets",
                  desc: "PDFs often embed entire font files to ensure text looks correct on any device. Some font families are several MB each — and if a document uses 5 fonts, that's 5 font files embedded.",
                  fix: "Compression tools subset fonts to include only the characters actually used, cutting font data by 90%.",
                },
                {
                  num: "4",
                  title: "Metadata and Document History",
                  desc: "Word documents save edit history, comments, revisions, and author info. When exported to PDF, some of this metadata comes along for the ride.",
                  fix: "SlimFile strips unnecessary metadata during compression without affecting the visible content.",
                },
                {
                  num: "5",
                  title: "Uncompressed or Losslessly Saved Content",
                  desc: "Some apps export PDFs without applying any compression to the content streams. The PDF structure is valid but bloated.",
                  fix: "Re-compress with SlimFile to apply modern compression algorithms to all content streams.",
                },
                {
                  num: "6",
                  title: "Multiple Layers and Transparency",
                  desc: "Design files exported from Illustrator or InDesign often preserve layers and transparent overlays, adding significant complexity and size.",
                  fix: "Flatten layers in the source app before exporting, or let SlimFile flatten them during compression.",
                },
                {
                  num: "7",
                  title: "Duplicated Resources",
                  desc: "If the same image appears on 10 pages, some poorly-built PDFs embed it 10 times instead of once. This is a common bug in older document generators.",
                  fix: "SlimFile's compression pass deduplicates shared resources automatically.",
                },
              ].map(item => (
                <div key={item.num} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex gap-3 items-start mb-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm shrink-0">{item.num}</div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 ml-10">{item.desc}</p>
                  <div className="ml-10 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm"><strong>Fix:</strong> {item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Diagnose Your PDF's Size</h2>
            <p className="text-gray-600 mb-4">Before compressing, it helps to know what's causing the bloat. Here's a quick mental checklist:</p>
            <ul className="space-y-3">
              {[
                "Does the PDF have photos or screenshots on every page? → Image compression needed",
                "Was it created by scanning paper documents? → OCR + image compression needed",
                "Does it have many pages (50+) even with simple text? → Font embedding or metadata bloat",
                "Was it exported from Photoshop, Illustrator, or InDesign? → Layer flattening needed",
                "Did it start as a PowerPoint? → Embedded images and fonts from each slide",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /><span>{item}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Much Can You Reduce PDF Size?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { type: "Text documents", reduction: "40–70%" },
                { type: "Reports with images", reduction: "50–85%" },
                { type: "Scanned PDFs", reduction: "70–95%" },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-red-600 mb-2">{item.reduction}</p>
                  <p className="text-gray-600 text-sm">{item.type}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Fix: Compress in 30 Seconds</h2>
            <p className="text-gray-600 mb-4">You don't need to diagnose the exact cause. Just upload to SlimFile and it handles everything automatically:</p>
            <ul className="space-y-3">
              {["Detects and compresses embedded images", "Subsets embedded fonts", "Strips unnecessary metadata", "Deduplicates repeated resources", "Flattens unnecessary transparency layers"].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Fix Your Large PDF Right Now</h2>
          <p className="text-red-100 mb-8 text-lg">Automatic compression. No account. No cost.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
