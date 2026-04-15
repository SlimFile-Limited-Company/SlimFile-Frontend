import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogReducePhotoSizeOnIphone() {
  useSEO({
    title: 'How to Reduce Photo Size on iPhone — Free Methods 2026 | SlimFile Blog',
    description: 'Reduce the file size of photos on your iPhone without losing quality. Use SlimFile in Safari, iPhone settings, or built-in tools to compress HEIC and JPEG photos.',
    canonical: 'https://slim-file.com/blog/reduce-photo-size-on-iphone',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mx-auto mb-6"><Smartphone className="w-10 h-10 text-gray-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Reduce Photo Size on iPhone</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">iPhone cameras capture stunning photos — but at 5–15MB each, they're often too large to email or upload. Here's how to shrink them instantly.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Photos Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why iPhone Photos Are So Large</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Modern iPhones (iPhone 14 and newer) shoot at 12–48 megapixels. The default HEIC format saves storage versus JPEG, but it's still enormous compared to what most apps or email systems expect. A single photo in ProRAW mode can be 50–80MB.</p>
            <p className="text-gray-600 leading-relaxed">Even standard HEIC shots are typically 3–8MB each — large enough to cause problems when emailing, uploading to forms, or sharing on platforms with size limits.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile in Safari (Easiest)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-4">
              <p className="text-red-700 font-semibold mb-1">✅ No app download — works in Safari on iOS 15+</p>
              <p className="text-gray-600 text-sm">SlimFile runs in your iPhone's Safari browser. Upload from your Camera Roll, compress, and download — all without leaving Safari.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open Safari on your iPhone", desc: "Go to slim-file.com/compress-images-online." },
                { step: "2", title: "Tap the upload zone", desc: "Choose 'Photo Library' to select photos from your Camera Roll." },
                { step: "3", title: "Wait for compression", desc: "SlimFile handles HEIC and JPEG automatically — no conversion needed." },
                { step: "4", title: "Tap Download", desc: "The compressed photo saves to your Files app or Photos (depending on your iOS settings)." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Change iPhone Camera Settings</h2>
            <p className="text-gray-600 mb-4">For ongoing smaller photos, change your iPhone camera format before shooting:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open <strong>Settings → Camera → Formats</strong></li>
              <li>Choose <strong>Most Compatible</strong> instead of High Efficiency</li>
              <li>This saves photos as JPEG instead of HEIC — slightly larger but universally compatible</li>
              <li>For smaller file sizes, also turn off <strong>ProRAW</strong> and <strong>ProRes</strong> if enabled</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> JPEG photos are 10–20% larger than HEIC but work everywhere without conversion. HEIC is smaller but may not open on older Windows devices.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Share with "Actual Size" vs "Large/Medium"</h2>
            <p className="text-gray-600 mb-4">When sharing a photo from iPhone's Photos app, iOS offers size options:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open a photo in <strong>Photos</strong></li>
              <li>Tap the <strong>Share</strong> icon</li>
              <li>Tap <strong>Options</strong> at the top</li>
              <li>Under "Image Size", choose <strong>Medium</strong> or <strong>Large</strong> instead of Actual Size</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">This is a quick workaround but doesn't give you a compressed file saved locally — just affects what you share via the iOS share sheet.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">iPhone Photo Size Reduction Tips</h2>
            <ul className="space-y-3">
              {[
                "HEIC photos from iPhone open natively on Mac but require conversion for Windows — SlimFile converts to JPEG automatically",
                "For photos sent via AirDrop, size isn't usually an issue — full quality transfers",
                "For WhatsApp photo sharing, the app compresses automatically but quality suffers — pre-compress with SlimFile first",
                "iCloud optimises storage but doesn't reduce file size for sharing or attachments",
                "Photos compressed in SlimFile lose no visible quality for social sharing, emailing, or web use",
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
          <h2 className="text-3xl font-bold mb-4">Compress iPhone Photos — Free in Safari</h2>
          <p className="text-red-100 mb-8 text-lg">Works on iPhone and iPad. No app to install.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Photos Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
