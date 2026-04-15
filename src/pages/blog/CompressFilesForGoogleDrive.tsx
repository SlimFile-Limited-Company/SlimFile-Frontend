import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Cloud, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressFilesForGoogleDrive() {
  useSEO({
    title: 'Compress Files for Google Drive — Save Storage & Speed Up Uploads 2026 | SlimFile Blog',
    description: 'Compress PDFs and images before uploading to Google Drive to save your 15GB quota and speed up uploads. Free tools with no account needed.',
    canonical: 'https://slim-file.com/blog/compress-files-for-google-drive',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mx-auto mb-6"><Cloud className="w-10 h-10 text-yellow-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Sharing</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Files for Google Drive</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Google Drive gives you 15GB free — but large uncompressed files eat that up fast. Compress before uploading to save space and speed up sharing.</p>
          <Link to="/compress"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Compress Before Uploading to Drive?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Google Drive's 15GB free tier fills up faster than most people expect. Google Docs, Sheets, and Slides are free — but every PDF, image, and uploaded file counts toward your quota. A folder of 100 uncompressed photos can use 1–2GB. The same folder compressed: under 200MB.</p>
            <p className="text-gray-600 leading-relaxed">Beyond storage, smaller files upload faster (critical on slow connections), load faster for collaborators, and download faster on mobile.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Compress Files Before Google Drive Upload</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Identify what to compress", desc: "PDFs, JPEG/PNG photos, PPTX presentations, and scanned documents benefit most. Google Docs/Sheets don't count toward storage." },
                { step: "2", title: "Compress with SlimFile", desc: "Open slim-file.com in your browser. Use the compress-pdf-online or compress-images-online tool based on your file type." },
                { step: "3", title: "Download the compressed files", desc: "Compressed files save locally — ready for upload." },
                { step: "4", title: "Upload to Google Drive", desc: "Drag compressed files into Drive. You'll notice significantly faster upload times." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Google Drive Storage Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { tip: "Convert uploads to Google formats", desc: "Google Docs/Sheets don't count toward storage. Upload DOCX and check 'Convert to Google Docs' to save space." },
                { tip: "Use Google Photos separately", desc: "Google Photos now counts toward the 15GB limit. Compress photos before backing up." },
                { tip: "Clean up Drive Trash", desc: "Deleted files stay in Trash for 30 days and count toward storage. Empty Trash regularly." },
                { tip: "Share links instead of files", desc: "Instead of emailing large attachments, upload once to Drive and share a link." },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.tip}</p>
                  <p className="text-gray-600 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Savings: Compressed vs Uncompressed</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">File Type (100 files)</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Uncompressed</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Compressed</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Saved</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">DSLR photos (12MP)</td><td className="p-3">3GB</td><td className="p-3">300MB</td><td className="p-3 text-green-600 font-semibold">2.7GB</td></tr>
                  <tr><td className="p-3">Scanned PDFs</td><td className="p-3">2GB</td><td className="p-3">200MB</td><td className="p-3 text-green-600 font-semibold">1.8GB</td></tr>
                  <tr><td className="p-3">Office reports (DOCX)</td><td className="p-3">500MB</td><td className="p-3">100MB</td><td className="p-3 text-green-600 font-semibold">400MB</td></tr>
                  <tr><td className="p-3">Presentations (PPTX)</td><td className="p-3">5GB</td><td className="p-3">500MB</td><td className="p-3 text-green-600 font-semibold">4.5GB</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More Google Drive Compression Tips</h2>
            <ul className="space-y-3">
              {[
                "Compress entire project folders periodically — not just new files",
                "Use SlimFile's batch upload to compress multiple PDFs or images at once before uploading",
                "For team drives, establish a policy: compress all PDFs before sharing to keep shared drives manageable",
                "Google Drive shows storage usage by file type — go to drive.google.com/settings to see what's using the most space",
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
          <h2 className="text-3xl font-bold mb-4">Save Google Drive Space — Compress Free</h2>
          <p className="text-red-100 mb-8 text-lg">PDF and image compression before upload. Instant. No account.</p>
          <Link to="/compress"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress Files Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
