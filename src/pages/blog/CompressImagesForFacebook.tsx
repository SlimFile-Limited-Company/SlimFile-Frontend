import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Share2, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressImagesForFacebook() {
  useSEO({
    title: 'How to Compress Images for Facebook Without Losing Quality 2026 | SlimFile Blog',
    description: "Compress photos for Facebook posts, covers, and ads. Learn ideal dimensions and free tools to stop Facebook from blurring your images.",
    canonical: 'https://slim-file.com/blog/compress-images-for-facebook',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><Share2 className="w-10 h-10 text-blue-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for Facebook</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Facebook compresses every uploaded photo. Pre-optimise yours so the platform has minimal work to do — keeping your images crisp and clear.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Facebook Blurs Your Photos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Facebook's servers re-compress every uploaded image to reduce storage costs and loading times. If you upload a 10MB image, Facebook may compress it to under 500KB — a 95% reduction that introduces visible blurring, colour banding, and loss of fine detail.</p>
            <p className="text-gray-600 leading-relaxed">Pre-compressing gives you control. By targeting Facebook's preferred specs before upload, the platform's algorithm makes only minor adjustments, preserving far more quality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Facebook Image Specs (2026)</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Placement</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Ideal Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Max File Size</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Feed photo (square)</td><td className="p-3">1080 × 1080px</td><td className="p-3">Under 4MB</td></tr>
                  <tr><td className="p-3">Feed photo (landscape)</td><td className="p-3">1200 × 630px</td><td className="p-3">Under 4MB</td></tr>
                  <tr><td className="p-3">Cover photo</td><td className="p-3">851 × 315px</td><td className="p-3">Under 100KB (PNG)</td></tr>
                  <tr><td className="p-3">Profile photo</td><td className="p-3">170 × 170px (display)</td><td className="p-3">Under 100KB</td></tr>
                  <tr><td className="p-3">Ad image</td><td className="p-3">1200 × 628px</td><td className="p-3">Under 30MB</td></tr>
                  <tr><td className="p-3">Story</td><td className="p-3">1080 × 1920px</td><td className="p-3">Under 4MB</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compress Facebook Images with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open slim-file.com/compress-images-online", desc: "Works in any browser — no account or extension needed." },
                { step: "2", title: "Upload your photo", desc: "JPEG and PNG both supported. Batch upload available for multiple images." },
                { step: "3", title: "Download the compressed image", desc: "SlimFile targets the optimal balance for web viewing and social sharing." },
                { step: "4", title: "Upload to Facebook", desc: "Post your pre-compressed image. Facebook applies only minimal re-compression." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips for Facebook Image Quality</h2>
            <ul className="space-y-3">
              {[
                "Save images as JPEG at 80–85% quality before uploading — Facebook handles this level perfectly",
                "For cover photos, use PNG if your image has text or logos — PNG is lossless and Facebook handles it better for graphics",
                "Upload from desktop, not mobile — mobile Facebook app applies heavier compression",
                "Enable 'Upload HD photos' in Facebook settings (Profile → Settings → Media) to reduce re-compression",
                "For Facebook Ads, keep images under 20% text overlay — more text triggers lower quality delivery",
                "Use sRGB colour space — Facebook doesn't support CMYK or Adobe RGB",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Why do my Facebook photos look blurry?", a: "Facebook auto-compresses uploads. Pre-compress with SlimFile targeting 1080px width and the platform will apply far less degradation." },
                { q: "Should I upload JPEG or PNG to Facebook?", a: "JPEG for photos, PNG for graphics, logos, and images with text. Facebook converts PNG to JPEG for photos anyway." },
                { q: "Does Facebook compress videos too?", a: "Yes. For videos, upload MP4 at H.264 codec, 1080p max, under 4GB. SlimFile focuses on image compression." },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Facebook Images — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Stop Facebook from blurring your photos. Pre-compress in seconds.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
