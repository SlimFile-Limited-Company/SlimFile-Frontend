import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Image, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertHeicToJpg() {
  useSEO({
    title: 'How to Convert HEIC to JPG Online — Free iPhone Photo Converter 2026 | SlimFile Blog',
    description: 'Convert HEIC photos from iPhone to JPG online for free. Works on Windows, Mac, and Android — no app download required. Instant HEIC to JPEG conversion.',
    canonical: 'https://slim-file.com/blog/convert-heic-to-jpg',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mx-auto mb-6"><Image className="w-10 h-10 text-gray-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Convert HEIC to JPG Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">iPhone and iPad photos save as HEIC by default — a format Windows, Android, and most apps can't open. Convert to JPG instantly, for free.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert HEIC to JPG Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is HEIC and Why Convert It?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">HEIC (High Efficiency Image Container) is Apple's photo format, used by default on iPhones since iOS 11. It stores images at similar quality to JPEG but at roughly half the file size — great for storage, frustrating for compatibility.</p>
            <p className="text-gray-600 leading-relaxed">The problem: Windows 10/11 can't natively open HEIC without a separate codec. Android phones don't support it. Most websites won't accept HEIC uploads. And email clients often struggle to display HEIC attachments. Converting to JPG solves all of these issues instantly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: SlimFile Online Converter (Fastest)</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-4">
              <p className="text-red-700 font-semibold mb-1">✅ No software. Works on Windows, Mac, Android, iPhone.</p>
              <p className="text-gray-600 text-sm">SlimFile converts HEIC to JPG in seconds — directly in your browser. No account required.</p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open slim-file.com/convert-only", desc: "Works in Chrome, Safari, Edge, and Firefox on any device." },
                { step: "2", title: "Upload your HEIC file(s)", desc: "Drag and drop or browse. Supports single and batch HEIC conversion." },
                { step: "3", title: "Download as JPG", desc: "Your converted JPG files download immediately. Full quality preserved." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Stop Your iPhone Taking HEIC Photos</h2>
            <p className="text-gray-600 mb-4">Prevent the issue from occurring by changing your iPhone camera settings to always save as JPEG:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open <strong>Settings</strong> on your iPhone</li>
              <li>Tap <strong>Camera → Formats</strong></li>
              <li>Select <strong>Most Compatible</strong> instead of High Efficiency</li>
              <li>All future photos save as JPEG automatically</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Note:</strong> This only affects new photos. Existing HEIC photos need to be converted individually.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 3: Mac Preview (Built-In)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Open the HEIC file in <strong>Preview</strong> (Macs open HEIC natively)</li>
              <li>Click <strong>File → Export</strong></li>
              <li>Change the Format to <strong>JPEG</strong></li>
              <li>Click <strong>Save</strong></li>
            </ol>
            <p className="text-gray-600 mt-3 text-sm">For batch conversion on Mac, select multiple HEIC files in Finder, open with Preview, then File → Export All Images as JPEG.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HEIC vs JPG Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Feature</th>
                  <th className="text-left p-3 font-semibold text-gray-700">HEIC</th>
                  <th className="text-left p-3 font-semibold text-gray-700">JPG</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">File size</td><td className="p-3">Smaller (50% vs JPG)</td><td className="p-3">Larger</td></tr>
                  <tr><td className="p-3">Quality</td><td className="p-3">Same or better</td><td className="p-3">Excellent</td></tr>
                  <tr><td className="p-3">Windows support</td><td className="p-3">Requires codec</td><td className="p-3 text-green-600 font-semibold">Native</td></tr>
                  <tr><td className="p-3">Android support</td><td className="p-3">Limited</td><td className="p-3 text-green-600 font-semibold">Universal</td></tr>
                  <tr><td className="p-3">Web/email support</td><td className="p-3">Limited</td><td className="p-3 text-green-600 font-semibold">Universal</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HEIC to JPG Tips</h2>
            <ul className="space-y-3">
              {[
                "When sending iPhone photos to Windows users, always convert to JPG first",
                "AirDropping from iPhone to Mac: HEIC stays as HEIC — Mac handles it natively",
                "AirDropping to Windows PC: HEIC may not open — convert before sharing",
                "WhatsApp, Instagram, Facebook: these platforms convert HEIC automatically on upload",
                "For email attachments: convert to JPG to guarantee the recipient can view the photo",
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
          <h2 className="text-3xl font-bold mb-4">Convert HEIC to JPG — Free Online</h2>
          <p className="text-red-100 mb-8 text-lg">No app. No account. Works on Windows, Mac, and Android.</p>
          <Link to="/convert-only"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Convert HEIC to JPG Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
