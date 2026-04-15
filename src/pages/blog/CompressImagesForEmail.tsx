import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressImagesForEmail() {
  useSEO({
    title: 'How to Compress Images for Email — Avoid Attachment Limits 2026 | SlimFile Blog',
    description: 'Compress images before emailing to stay within Gmail, Outlook, and Yahoo attachment limits. Free tools and ideal sizes for email attachments and inline images.',
    canonical: 'https://slim-file.com/blog/compress-images-for-email',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 mx-auto mb-6"><Mail className="w-10 h-10 text-cyan-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Image Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for Email</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Email attachment limits are strict and unforgiving. Here's how to compress images so they get through every time — without sacrificing clarity.</p>
          <Link to="/compress-images-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Images Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Attachment Limits You Need to Know</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Email Provider</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Max Attachment Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Recommended Image Size</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Gmail</td><td className="p-3">25MB total</td><td className="p-3">Under 3MB per image</td></tr>
                  <tr><td className="p-3">Outlook / Hotmail</td><td className="p-3">20MB total</td><td className="p-3">Under 2MB per image</td></tr>
                  <tr><td className="p-3">Yahoo Mail</td><td className="p-3">25MB total</td><td className="p-3">Under 3MB per image</td></tr>
                  <tr><td className="p-3">Apple Mail (iCloud)</td><td className="p-3">20MB (Mail Drop for larger)</td><td className="p-3">Under 2MB per image</td></tr>
                  <tr><td className="p-3">Corporate Exchange</td><td className="p-3">10MB (often lower)</td><td className="p-3">Under 1MB per image</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress Images for Email with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open slim-file.com/compress-images-online", desc: "Open in any browser. No account or extension needed." },
                { step: "2", title: "Upload your images", desc: "Drag photos onto the upload zone. JPEG, PNG, WebP, and HEIC supported." },
                { step: "3", title: "Download compressed images", desc: "Typical reduction: 70–90%. Photos that were 5MB become 300–700KB." },
                { step: "4", title: "Attach and send", desc: "Compressed images are email-ready. Attach in Gmail, Outlook, or any email client." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Image Sizes for Email</h2>
            <ul className="space-y-3">
              {[
                "For photos sent to family/friends: compress to under 1MB — viewable on any device",
                "For professional documents with images: keep each image under 500KB",
                "For email newsletters (inline images): target 600px wide, under 100KB per image",
                "For real estate or architecture photos: 1200px wide, JPEG 80% quality — usually under 500KB",
                "For product photos (B2B): 2048px max, under 2MB — clients can zoom in if needed",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When Email Compression Isn't Enough</h2>
            <p className="text-gray-600 mb-4">If you have 30 high-resolution photos to share, even compressed they might exceed attachment limits. In that case:</p>
            <div className="space-y-3">
              {[
                { option: "Use Google Drive or Dropbox", desc: "Share a folder link instead of attachments. No size limits." },
                { option: "Use WeTransfer", desc: "Free file transfer up to 2GB. Link expires after 7 days." },
                { option: "Use SlimFile's compression + ZIP", desc: "Compress all images with SlimFile, ZIP them together, then share a Drive link." },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.option}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HEIC Photos from iPhone — Compress Before Emailing</h2>
            <p className="text-gray-600 leading-relaxed">iPhones save photos in HEIC format by default — a format many Windows and email clients can't open. SlimFile converts HEIC to JPEG automatically during compression, so your recipients can open the images on any device.</p>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Compress Images for Email — Free</h2>
          <p className="text-red-100 mb-8 text-lg">No size limit errors. Works with Gmail, Outlook, and more.</p>
          <Link to="/compress-images-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Images Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
