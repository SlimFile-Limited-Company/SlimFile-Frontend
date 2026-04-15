import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressFilesForWhatsapp() {
  useSEO({
    title: 'How to Compress Files for WhatsApp — Send Large PDFs & Photos 2026 | SlimFile Blog',
    description: "Compress PDFs, images, and documents to send via WhatsApp without hitting the 100MB file limit. Free tools and tips for Android and iPhone.",
    canonical: 'https://slim-file.com/blog/compress-files-for-whatsapp',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><MessageCircle className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Sharing</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Files for WhatsApp</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">WhatsApp compresses photos automatically — badly. And documents have a 100MB limit. Here's how to take control and share files perfectly every time.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp File Size Limits</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">File Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">WhatsApp Limit</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Notes</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">Photos (sent as photo)</td><td className="p-3">No official limit</td><td className="p-3">WhatsApp auto-compresses, reducing quality</td></tr>
                  <tr><td className="p-3">Photos (sent as document)</td><td className="p-3">100MB</td><td className="p-3">Original quality preserved — use this for professional photos</td></tr>
                  <tr><td className="p-3">PDF documents</td><td className="p-3">100MB</td><td className="p-3">No auto-compression — compress before sending if large</td></tr>
                  <tr><td className="p-3">Video</td><td className="p-3">16MB (send as video), 100MB (as document)</td><td className="p-3">Use document mode for better quality</td></tr>
                  <tr><td className="p-3">Audio</td><td className="p-3">100MB</td><td className="p-3">Voice notes: 16MB</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress PDFs for WhatsApp</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Open Chrome or Safari on your phone", desc: "Go to slim-file.com/compress-pdf-online." },
                { step: "2", title: "Upload your PDF", desc: "Select from Files, Google Drive, or Downloads." },
                { step: "3", title: "Download the compressed PDF", desc: "Typical reduction from 50MB → 3–5MB." },
                { step: "4", title: "Send via WhatsApp", desc: "Open WhatsApp → tap the attachment (📎) → Document → select the compressed PDF." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Photos on WhatsApp Without Quality Loss</h2>
            <p className="text-gray-600 mb-4">WhatsApp crushes photo quality when sent as "photos". To preserve quality:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Compress the photo with SlimFile first (slim-file.com/compress-images-online)</li>
              <li>In WhatsApp, tap the attachment icon (📎)</li>
              <li>Choose <strong>Document</strong> instead of Photo/Gallery</li>
              <li>Select your compressed image</li>
              <li>Send — the recipient gets a full-quality version of your pre-compressed image</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp File Compression Tips</h2>
            <ul className="space-y-3">
              {[
                "Always send PDFs as 'Document' not via copy-paste — pasting drops quality drastically",
                "Compress images with SlimFile before sending to control quality — don't rely on WhatsApp's auto-compression",
                "For large video files, use Google Drive or WeTransfer and share the link via WhatsApp instead",
                "WhatsApp Business allows up to 100MB for all file types — personal accounts have the same limits",
                "Compressed PDFs open perfectly in WhatsApp's built-in viewer — no special app needed",
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
          <h2 className="text-3xl font-bold mb-4">Compress Files for WhatsApp — Free</h2>
          <p className="text-red-100 mb-8 text-lg">PDF and image compression. Works on Android and iPhone.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
