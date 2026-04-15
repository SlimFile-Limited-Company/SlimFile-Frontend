import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogReducePhotoSizeOnAndroid() {
  useSEO({
    title: 'How to Reduce Photo Size on Android — Free & Fast 2026 | SlimFile Blog',
    description: 'Reduce the file size of photos on your Android phone. Use SlimFile in Chrome, Google Photos, or Android camera settings to compress images without losing quality.',
    canonical: 'https://slim-file.com/blog/reduce-photo-size-on-android',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><Smartphone className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Reduce Photo Size on Android</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Android cameras take incredible photos — often 5–20MB each. Here's how to reduce photo file size on your Android phone without losing the quality you captured.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Photos Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Reduce Photo Size on Android?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Samsung Galaxy, Google Pixel, and other Android flagships now shoot at 50–200 megapixels. While this produces stunning detail, a single full-resolution photo can be 10–30MB. That's too large for email (25MB limit), too slow to upload on mobile data, and too heavy for many cloud storage workflows.</p>
            <p className="text-gray-600 leading-relaxed">Compressing photos to 200–800KB makes them fast to share, easy to email, and perfectly viewable on any screen — with no noticeable quality loss.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile in Chrome (Best Quality)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-4">
              <p className="text-red-700 font-semibold mb-1">✅ No app download — works in Chrome on any Android device</p>
              <p className="text-gray-600 text-sm">SlimFile runs in Chrome. Access your photos from the Android file picker, compress, and download — all in your browser.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open Chrome on your Android", desc: "Go to slim-file.com/compress-images-online." },
                { step: "2", title: "Tap the upload zone", desc: "Select photos from your Gallery or Google Photos through Android's file picker." },
                { step: "3", title: "Compression runs automatically", desc: "SlimFile processes the image — works on 4G/5G without needing Wi-Fi." },
                { step: "4", title: "Tap Download", desc: "The compressed photo saves to your Downloads folder. Share via WhatsApp, Gmail, or any app." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Google Photos (Free Storage Compression)</h2>
            <p className="text-gray-600 mb-4">Google Photos' "Storage Saver" quality compresses uploaded photos to 16MP, significantly reducing file size in the cloud:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open <strong>Google Photos</strong> on your Android</li>
              <li>Go to <strong>Profile → Photos Settings → Backup</strong></li>
              <li>Select <strong>Storage Saver</strong> quality instead of Original</li>
              <li>Photos backed up in Storage Saver mode are compressed automatically</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> This compresses the cloud copy but not the local file on your device. To compress local files for sharing, use SlimFile.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Change Android Camera Resolution</h2>
            <p className="text-gray-600 mb-4">For smaller photos going forward, lower your camera's resolution setting:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open your <strong>Camera app</strong></li>
              <li>Go to <strong>Settings</strong> (gear icon)</li>
              <li>Find <strong>Picture Size</strong> or <strong>Resolution</strong></li>
              <li>Select a lower resolution — 8MP or 12MP is still excellent for sharing</li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">Note: Settings vary by device. Samsung, Pixel, OnePlus, and Xiaomi all have different camera apps.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Android Photo Compression Tips</h2>
            <ul className="space-y-3">
              {[
                "WhatsApp compresses photos automatically when sent — but you lose control over the output quality. Pre-compress for better results.",
                "Samsung's Gallery app allows exporting photos at reduced size — go to Share → Export → choose size",
                "SlimFile supports batch compression — upload multiple photos at once to save time",
                "Photos from Android compress best as JPEG — PNG is lossless but much larger for photos",
                "After compression, share directly via Android's Share sheet to any app",
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
          <h2 className="text-3xl font-bold mb-4">Reduce Android Photo Size — Free in Chrome</h2>
          <p className="text-red-100 mb-8 text-lg">Works on Samsung, Pixel, OnePlus, Xiaomi, and all Android devices.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Photos Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
