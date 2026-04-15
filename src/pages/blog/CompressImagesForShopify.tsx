import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressImagesForShopify() {
  useSEO({
    title: 'How to Compress Images for Shopify — Faster Store, More Sales 2026 | SlimFile Blog',
    description: 'Compress product images for Shopify to improve page speed and conversion rates. Ideal dimensions, file sizes, and free tools for Shopify store owners.',
    canonical: 'https://slim-file.com/blog/compress-images-for-shopify',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><ShoppingBag className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for Shopify</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Every 1-second delay in load time costs Shopify stores an average 7% in conversions. Optimise your product images to load faster and sell more.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 6 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Shopify Image Optimisation Matters</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Shopify automatically serves images via its CDN, but it doesn't compress your uploads — it serves what you give it. A product image uploaded at 5MB loads at 5MB. Multiply that across 10 product photos per page and you have a 50MB page — catastrophically slow on mobile.</p>
            <p className="text-gray-600 leading-relaxed">Google's PageSpeed Insights and Core Web Vitals directly measure image load performance. Poor scores mean lower organic search rankings, fewer clicks, and fewer sales.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopify Product Image Specs (2026)</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Image Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Recommended Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Max File Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Format</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Product image</td><td className="p-3">2048 × 2048px</td><td className="p-3">Under 500KB</td><td className="p-3">JPEG/WebP</td></tr>
                  <tr><td className="p-3">Collection banner</td><td className="p-3">1800 × 1000px</td><td className="p-3">Under 200KB</td><td className="p-3">JPEG/WebP</td></tr>
                  <tr><td className="p-3">Hero/slideshow</td><td className="p-3">1920 × 800px</td><td className="p-3">Under 250KB</td><td className="p-3">JPEG/WebP</td></tr>
                  <tr><td className="p-3">Blog post image</td><td className="p-3">1200 × 630px</td><td className="p-3">Under 150KB</td><td className="p-3">JPEG/WebP</td></tr>
                  <tr><td className="p-3">Logo</td><td className="p-3">400 × 200px</td><td className="p-3">Under 20KB</td><td className="p-3">PNG/SVG</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress Shopify Images with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Prepare your product photos", desc: "Export from your camera or editor at 2048×2048px — square format works best for Shopify's zoom feature." },
                { step: "2", title: "Open slim-file.com/compress-images-online", desc: "Upload multiple product images at once for efficient batch processing." },
                { step: "3", title: "Download compressed images", desc: "SlimFile targets under 500KB per product image without visible quality loss." },
                { step: "4", title: "Upload to Shopify", desc: "Go to Products → Add/Edit Product → Upload images. Your compressed images will load significantly faster." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Impact of Image Optimisation on Shopify Sales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { stat: "7%", label: "average conversion drop per 1s delay" },
                { stat: "53%", label: "of mobile users abandon pages over 3s" },
                { stat: "2×", label: "faster load = 2× more page views" },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-3xl font-bold text-red-600 mb-2">{item.stat}</p>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopify Image Optimisation Best Practices</h2>
            <ul className="space-y-3">
              {[
                "Use descriptive alt text for every product image — helps Google image search and accessibility",
                "Keep background consistent (white or light grey) — lighter backgrounds compress better and look professional",
                "Use the same square ratio (1:1) for all product images — consistent layout improves UX",
                "Shopify supports WebP — compress your images to WebP format for 30% smaller files than JPEG",
                "Remove EXIF metadata (GPS, camera info) — compressors like SlimFile do this automatically",
                "Test your store's speed with Google PageSpeed Insights after uploading — aim for 90+ on mobile",
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
          <h2 className="text-3xl font-bold mb-4">Speed Up Your Shopify Store — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Compress product images in seconds. No signup needed.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
