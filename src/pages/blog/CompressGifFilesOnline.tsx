import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Film, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressGifFilesOnline() {
  useSEO({
    title: 'How to Compress GIF Files Online — Reduce Animated GIF Size Free 2026 | SlimFile Blog',
    description: 'Compress animated GIF files online to reduce their size for email, Slack, and web use. Free tools, tips for reducing GIF size without losing animation quality.',
    canonical: 'https://slim-file.com/blog/compress-gif-files-online',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mx-auto mb-6"><Film className="w-10 h-10 text-purple-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress GIF Files Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Animated GIFs can be enormous — a 5-second GIF from a screen recording is easily 20MB. Here's how to compress GIFs without ruining the animation.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why GIFs Are So Large</h2>
            <p className="text-gray-600 leading-relaxed mb-4">GIF is a 1987 format that stores each animation frame as a full image. A 3-second GIF at 30 frames per second contains 90 individual images — each frame stored separately. Even with simple animations, this adds up fast.</p>
            <p className="text-gray-600 leading-relaxed">A 10-second screen recording converted to GIF can easily hit 30–50MB — far too large for email attachments, Slack messages (max 10MB free plan), or web page embedding.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GIF vs WebP vs MP4 — What to Use</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Format</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Animation</th>
                  <th className="text-left p-3 font-semibold text-gray-700">File Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Support</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-semibold">GIF</td><td className="p-3">✅ Yes</td><td className="p-3">Large</td><td className="p-3">Universal</td></tr>
                  <tr><td className="p-3 font-semibold">Animated WebP</td><td className="p-3">✅ Yes</td><td className="p-3">60% smaller</td><td className="p-3">Modern browsers</td></tr>
                  <tr><td className="p-3 font-semibold">MP4 (video)</td><td className="p-3">✅ Yes</td><td className="p-3">90% smaller</td><td className="p-3">Universal</td></tr>
                  <tr><td className="p-3 font-semibold">Compressed GIF</td><td className="p-3">✅ Yes</td><td className="p-3">30–50% smaller</td><td className="p-3">Universal</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-3">For web use in 2026, consider converting GIFs to MP4 (autoplay, muted) — dramatically smaller with better quality. For messaging apps where GIF is required, compress the GIF directly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress a GIF Online</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Upload to an image compressor", desc: "SlimFile's image compressor supports GIF files. Open slim-file.com/compress-images-online and upload your GIF." },
                { step: "2", title: "The tool reduces colour depth and frame size", desc: "GIF compression works by reducing the colour palette (max 256 colours) and optimising frame differences." },
                { step: "3", title: "Download the compressed GIF", desc: "Typical reduction: 30–60%. The animation is preserved." },
                { step: "4", title: "Test in a browser or messaging app", desc: "Open the compressed GIF to verify the animation still looks right before sending." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced GIF Reduction Techniques</h2>
            <div className="space-y-4">
              {[
                { technique: "Reduce frame rate", desc: "Drop from 30fps to 15fps — halves file size with minimal visual impact for most animations." },
                { technique: "Reduce dimensions", desc: "A GIF at 640px wide instead of 1280px is 4× smaller (width × height)." },
                { technique: "Reduce colour palette", desc: "Most GIFs use 256 colours. If your animation uses simple colours, dropping to 64 or 32 reduces size significantly." },
                { technique: "Trim length", desc: "Remove frames from the beginning and end. Even 1 fewer second makes a measurable difference." },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.technique}</p>
                  <p className="text-gray-600 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GIF Size Limits by Platform</h2>
            <ul className="space-y-3">
              {[
                "Slack (free): 10MB file limit — compress GIFs before posting",
                "Discord: 8MB for standard users, 50MB for Nitro subscribers",
                "Twitter/X: 15MB GIF limit for web, 5MB for mobile",
                "Tenor/GIPHY: 100MB upload limit but recommend under 5MB for performance",
                "Email (Gmail, Outlook): 25MB total attachment limit — GIFs count toward this",
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
          <h2 className="text-3xl font-bold mb-4">Compress GIF Files Free</h2>
          <p className="text-red-100 mb-8 text-lg">Reduce GIF size without breaking the animation.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
