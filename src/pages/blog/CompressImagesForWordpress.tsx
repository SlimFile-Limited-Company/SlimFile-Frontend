import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressImagesForWordpress() {
  useSEO({
    title: 'How to Compress Images for WordPress — Faster Site, Better SEO 2026 | SlimFile Blog',
    description: 'Compress images before uploading to WordPress to speed up your site and improve Google rankings. Learn ideal file sizes, formats, and free tools.',
    canonical: 'https://slim-file.com/blog/compress-images-for-wordpress',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mx-auto mb-6"><Globe className="w-10 h-10 text-indigo-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for WordPress</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Large images are the #1 cause of slow WordPress sites. Compress before uploading and your site loads faster, ranks higher, and costs less to host.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Image Size Matters for WordPress</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Images typically account for 50–80% of a webpage's total load weight. A single unoptimised hero image can be 3–5MB — causing page load times of 4–8 seconds on mobile. Google's Core Web Vitals directly penalise slow-loading pages in search rankings.</p>
            <p className="text-gray-600 leading-relaxed">The fix is simple: compress images before uploading. A 3MB photo can be reduced to 150–300KB without visible quality loss — loading 10–20× faster.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WordPress Image Size Guide (2026)</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Image Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Dimensions</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Target File Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Format</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Hero/banner</td><td className="p-3">1920 × 600–900px</td><td className="p-3">Under 200KB</td><td className="p-3">WebP / JPEG</td></tr>
                  <tr><td className="p-3">Blog post image</td><td className="p-3">1200 × 630px</td><td className="p-3">Under 100KB</td><td className="p-3">WebP / JPEG</td></tr>
                  <tr><td className="p-3">Product image</td><td className="p-3">800 × 800px</td><td className="p-3">Under 80KB</td><td className="p-3">WebP / JPEG</td></tr>
                  <tr><td className="p-3">Thumbnail</td><td className="p-3">150 × 150px</td><td className="p-3">Under 20KB</td><td className="p-3">WebP</td></tr>
                  <tr><td className="p-3">Logo</td><td className="p-3">200 × 60px</td><td className="p-3">Under 10KB</td><td className="p-3">SVG / PNG</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step: Compress WordPress Images with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Before uploading to WordPress", desc: "Don't upload raw photos directly. Always compress first." },
                { step: "2", title: "Open slim-file.com/compress-images-online", desc: "Upload one or multiple images. SlimFile supports JPEG, PNG, WebP, and HEIC." },
                { step: "3", title: "Download compressed images", desc: "Each image is optimised to the ideal quality-to-size ratio." },
                { step: "4", title: "Upload to WordPress media library", desc: "Your compressed images load faster and take less storage on your server." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Image Format for WordPress in 2026</h2>
            <div className="space-y-4">
              {[
                { format: "WebP", badge: "Recommended", desc: "30–35% smaller than JPEG at the same quality. Supported by all modern browsers. Best choice for WordPress in 2026.", color: "green" },
                { format: "JPEG", badge: "Good", desc: "Universal support. Best for photographs. Not ideal for logos or text overlays. Compress to 75–85% quality.", color: "blue" },
                { format: "PNG", badge: "Use Sparingly", desc: "Lossless — ideal for logos, icons, screenshots with text. But file sizes are larger. Use SVG where possible.", color: "yellow" },
                { format: "SVG", badge: "Best for Icons/Logos", desc: "Infinitely scalable, tiny file sizes. Use for logos, icons, and illustrations. Not suitable for photos.", color: "purple" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900 w-16 shrink-0">{item.format}</div>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${item.color}-100 text-${item.color}-700 mb-2 inline-block`}>{item.badge}</span>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WordPress Image Optimisation Tips</h2>
            <ul className="space-y-3">
              {[
                "Compress before uploading — plugins like Smush compress after upload, but pre-compression is better",
                "Enable lazy loading in WordPress 5.5+ — images below the fold load only when scrolled to",
                "Use descriptive filenames (blue-running-shoes.jpg, not IMG_4832.jpg) for SEO",
                "Add alt text to every image for accessibility and search indexing",
                "Use WordPress's built-in responsive images — upload at 2× display size and let WordPress handle srcset",
                "Consider a CDN (Cloudflare, BunnyCDN) to serve images from edge locations globally",
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
          <h2 className="text-3xl font-bold mb-4">Speed Up WordPress — Compress Images Free</h2>
          <p className="text-red-100 mb-8 text-lg">No plugin needed. Compress before upload. Instant results.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
