import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { TrendingUp, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogWhyFileCompressionMattersForSeo() {
  useSEO({
    title: 'Why File Compression Matters for SEO — Page Speed & Core Web Vitals | SlimFile Blog',
    description: 'Large images and files slow down your website and hurt your Google rankings. Learn why compressing files matters for SEO and how to do it for free.',
    canonical: 'https://slim-file.com/blog/why-file-compression-matters-for-seo',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-6"><TrendingUp className="w-10 h-10 text-emerald-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Educational</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Why File Compression Matters for SEO</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Page speed is a Google ranking factor. Large, uncompressed images and files are the single biggest cause of slow websites. Here's what you need to know.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Speed Is a Google Ranking Factor</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Google officially confirmed page speed as a ranking factor in 2010 for desktop search, and extended it to mobile in 2018 with the "Speed Update." In 2021, Google introduced Core Web Vitals — three measurable metrics that directly reflect user experience, and all three are affected by page load performance.</p>
            <p className="text-gray-600 leading-relaxed">Images typically account for <strong>50–80% of a webpage's total byte weight</strong>. Compressing them is the single highest-impact optimization you can make.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Web Vitals Affected by File Size</h2>
            <div className="space-y-4">
              {[
                {
                  metric: "LCP — Largest Contentful Paint",
                  desc: "Measures how long it takes for the largest visible element (often a hero image) to load. Google wants this under 2.5 seconds. A large uncompressed hero image is the most common cause of poor LCP.",
                  fix: "Compress your hero image. Target under 200 KB for hero images.",
                },
                {
                  metric: "CLS — Cumulative Layout Shift",
                  desc: "Measures unexpected layout movement. Large images without defined dimensions cause layout shift as they load. This is compounded when images are slow to load.",
                  fix: "Compress images AND define width/height attributes in HTML.",
                },
                {
                  metric: "INP — Interaction to Next Paint",
                  desc: "Measures responsiveness to user interactions. Heavy pages with many large resources block the browser's main thread, making the page feel sluggish.",
                  fix: "Reduce total page weight by compressing all images.",
                },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-2">{item.metric}</p>
                  <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                  <p className="text-xs text-green-700 font-semibold">Fix: {item.fix}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Image Compression SEO Best Practices</h2>
            <ul className="space-y-3">
              {[
                "Compress all images before uploading — never upload the raw file from your camera or phone",
                "Target under 200 KB per image for web use (100 KB or less for small thumbnails)",
                "Use WebP format — 25–34% smaller than JPEG at equivalent quality, supported by all modern browsers",
                "Match image dimensions to display size — don't upload a 4000×3000 photo for a 400×300 thumbnail",
                "Compress PDF downloads on your site — slow PDF loads also hurt user experience",
                "Use lazy loading for images below the fold — they don't need to load until scrolled to",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Impact: Real Numbers</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Scenario</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Before</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">After Compression</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Savings</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">iPhone photo uploaded to WordPress</td><td className="p-3 text-center text-red-600">5 MB</td><td className="p-3 text-center text-green-600">120 KB</td><td className="p-3 text-center">97%</td></tr>
                  <tr><td className="p-3">Product photo for Shopify</td><td className="p-3 text-center text-red-600">2.5 MB</td><td className="p-3 text-center text-green-600">85 KB</td><td className="p-3 text-center">96%</td></tr>
                  <tr><td className="p-3">Company brochure PDF download</td><td className="p-3 text-center text-red-600">15 MB</td><td className="p-3 text-center text-green-600">1.8 MB</td><td className="p-3 text-center">88%</td></tr>
                  <tr><td className="p-3">Blog hero image</td><td className="p-3 text-center text-red-600">1.2 MB</td><td className="p-3 text-center text-green-600">95 KB</td><td className="p-3 text-center">92%</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Compress Your Website Images — Free</h2>
            <div className="space-y-4">
              {[
                { step: "1", desc: "Go to SlimFile's image compressor (no account needed)." },
                { step: "2", desc: "Upload your images — JPEG, PNG, WebP, HEIC, or GIF." },
                { step: "3", desc: "Download the compressed files. SlimFile processes everything in your browser — no upload to external servers." },
                { step: "4", desc: "Replace your existing images with the compressed versions and check your PageSpeed score." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Speed Up Your Site — Compress Images Free</h2>
          <p className="text-red-100 mb-8 text-lg">Better Core Web Vitals. Higher Google rankings. Faster pages.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
