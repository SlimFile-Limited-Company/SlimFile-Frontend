import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Image, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogWhatIsWebp() {
  useSEO({
    title: 'What Is WebP? The Modern Image Format Explained | SlimFile Blog',
    description: 'What is WebP and should you use it? Learn how WebP compares to JPEG and PNG, why Google created it, and how to convert and compress WebP images online for free.',
    canonical: 'https://slim-file.com/blog/what-is-webp',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><Image className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">What Is WebP? The Modern Image Format Explained</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">WebP is a modern image format designed to make web images smaller and faster without sacrificing quality. Here's everything you need to know.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WebP: Created by Google in 2010</h2>
            <p className="text-gray-600 leading-relaxed mb-4">WebP (pronounced "weppy") is an image format developed by Google and released in 2010. It was designed to replace both JPEG and PNG for web use by offering better compression than either — with support for both lossy and lossless modes, transparency (like PNG), and animation (like GIF).</p>
            <p className="text-gray-600 leading-relaxed">As of 2026, WebP is supported by all major browsers: Chrome, Firefox, Safari, Edge, and Opera.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WebP vs JPEG vs PNG</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Feature</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">WebP</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">JPEG</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">PNG</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Compression type</td><td className="p-3 text-center">Both</td><td className="p-3 text-center">Lossy</td><td className="p-3 text-center">Lossless</td></tr>
                  <tr><td className="p-3">Transparency support</td><td className="p-3 text-center text-green-600">✅</td><td className="p-3 text-center text-red-600">❌</td><td className="p-3 text-center text-green-600">✅</td></tr>
                  <tr><td className="p-3">Animation support</td><td className="p-3 text-center text-green-600">✅</td><td className="p-3 text-center text-red-600">❌</td><td className="p-3 text-center text-red-600">❌</td></tr>
                  <tr><td className="p-3">File size vs JPEG</td><td className="p-3 text-center text-green-600">25–34% smaller</td><td className="p-3 text-center">Baseline</td><td className="p-3 text-center text-red-600">2–5× larger</td></tr>
                  <tr><td className="p-3">Browser support (2026)</td><td className="p-3 text-center text-green-600">All major browsers</td><td className="p-3 text-center text-green-600">Universal</td><td className="p-3 text-center text-green-600">Universal</td></tr>
                  <tr><td className="p-3">Best for</td><td className="p-3 text-center">Web images</td><td className="p-3 text-center">Photos</td><td className="p-3 text-center">Graphics, logos</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Should You Use WebP?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">For web use, yes — WebP is the best choice in most situations. It delivers smaller file sizes than JPEG at equivalent quality, supports transparency unlike JPEG, and is now universally supported.</p>
            <p className="text-gray-600 leading-relaxed">For situations where you need maximum compatibility (old email clients, some desktop software), JPEG or PNG may still be safer choices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use WebP</h2>
            <ul className="space-y-3">
              {[
                "Website images — WebP reduces page load time and improves Core Web Vitals / SEO",
                "WordPress and Shopify product images — most themes support WebP",
                "Social media images (where the platform accepts WebP uploads)",
                "Any image with transparency — WebP with transparency is smaller than PNG",
                "Animated images — WebP animations are much smaller than equivalent GIFs",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When NOT to Use WebP</h2>
            <ul className="space-y-3">
              {[
                "Printing — WebP is a web format; print workflows expect JPEG or TIFF",
                "Email attachments — some email clients don't display WebP inline",
                "Editing source files — always keep originals in lossless formats (PNG/TIFF) for editing",
                "Legacy software compatibility — older design tools may not support WebP",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Convert to WebP — Free with SlimFile</h2>
            <p className="text-gray-600 leading-relaxed">SlimFile's image compressor supports WebP input and output. Upload a JPEG, PNG, HEIC, or GIF and download it as a compressed WebP file — all in your browser, no upload to external servers.</p>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress & Convert Images — Free</h2>
          <p className="text-red-100 mb-8 text-lg">JPEG, PNG, WebP, HEIC, GIF — all formats, no limits, no account.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
