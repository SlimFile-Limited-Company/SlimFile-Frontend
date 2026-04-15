import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Instagram, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressImagesForInstagram() {
  useSEO({
    title: 'How to Compress Images for Instagram — Best Size & Quality 2026 | SlimFile Blog',
    description: 'Compress images for Instagram without losing quality. Learn the ideal dimensions, file sizes, and free tools to optimise photos for posts, stories, and reels.',
    canonical: 'https://slim-file.com/blog/compress-images-for-instagram',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mx-auto mb-6"><Instagram className="w-10 h-10 text-pink-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for Instagram</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Instagram recompresses every upload automatically — often making photos look worse. Pre-compress your images correctly to stay in control of quality.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Instagram Degrades Your Photos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Instagram applies its own compression algorithm to every uploaded image. If your photo is already large (e.g. a 10MB DSLR RAW export), Instagram's auto-compression is aggressive — it reduces the file to under 1MB, often producing visible artifacts, banding, and reduced sharpness.</p>
            <p className="text-gray-600 leading-relaxed">By pre-compressing to a size close to Instagram's own target, you control exactly what gets preserved. The platform's compressor then has less "work" to do and applies minimal degradation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instagram's Recommended Image Specs (2026)</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Format</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Dimensions</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Ideal File Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Format</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Square post</td><td className="p-3">1080 × 1080px</td><td className="p-3">Under 1MB</td><td className="p-3">JPEG</td></tr>
                  <tr><td className="p-3">Portrait post</td><td className="p-3">1080 × 1350px</td><td className="p-3">Under 1MB</td><td className="p-3">JPEG</td></tr>
                  <tr><td className="p-3">Landscape post</td><td className="p-3">1080 × 566px</td><td className="p-3">Under 1MB</td><td className="p-3">JPEG</td></tr>
                  <tr><td className="p-3">Story / Reel</td><td className="p-3">1080 × 1920px</td><td className="p-3">Under 8MB</td><td className="p-3">JPEG/MP4</td></tr>
                  <tr><td className="p-3">Profile photo</td><td className="p-3">320 × 320px</td><td className="p-3">Under 500KB</td><td className="p-3">JPEG/PNG</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress Images for Instagram with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/compress-images-online", desc: "Open SlimFile's image compressor in any browser on any device." },
                { step: "2", title: "Upload your photo", desc: "Supports JPEG, PNG, WebP, and HEIC formats. Drag and drop or click to select." },
                { step: "3", title: "Compression runs automatically", desc: "SlimFile optimises the image to the ideal balance of size and quality." },
                { step: "4", title: "Download and upload to Instagram", desc: "Your pre-compressed image is ready. Instagram will apply minimal additional compression." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instagram Image Quality Tips</h2>
            <ul className="space-y-3">
              {[
                "Always upload JPEG — Instagram handles JPEG best and compresses PNG further than needed",
                "Export at exactly 1080px wide — upscaling from smaller dimensions loses sharpness",
                "Use sRGB colour profile — Instagram doesn't support CMYK or wide-gamut profiles",
                "Avoid oversharpening before upload — Instagram's compression amplifies sharpening artifacts",
                "For Stories, save at 1080 × 1920px at 80–85% JPEG quality for optimal results",
                "Pre-compress on SlimFile, then enable 'Upload at highest quality' in Instagram settings",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">JPEG vs PNG for Instagram</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-gray-900 mb-2">JPEG — Best for Photos</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ Smaller file sizes</li>
                  <li>✅ Instagram-native format</li>
                  <li>✅ Best for photography</li>
                  <li>⚠️ Lossy — avoid re-saving</li>
                </ul>
              </div>
              <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                <p className="font-bold text-gray-900 mb-2">PNG — Best for Graphics</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>✅ Lossless quality</li>
                  <li>✅ Good for logos/text overlays</li>
                  <li>⚠️ Larger file size</li>
                  <li>⚠️ Instagram still converts it</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Optimise Your Instagram Images Now</h2>
          <p className="text-red-100 mb-8 text-lg">Free image compression. No account. No watermark.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
