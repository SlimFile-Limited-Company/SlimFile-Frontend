import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogSendLargeFilesViaEmail() {
  useSEO({
    title: 'How to Send Large Files via Email — 5 Free Methods 2026 | SlimFile Blog',
    description: 'Send large PDFs and files via email when they exceed attachment limits. 5 free methods including file compression, Google Drive, WeTransfer, and more.',
    canonical: 'https://slim-file.com/blog/send-large-files-via-email',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6"><Mail className="w-10 h-10 text-red-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Sharing</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Send Large Files via Email</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Email attachment limits block large files. Here are 5 free methods to send any file of any size — including the fastest option for PDFs and images.</p>
          <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress PDF First <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Attachment Limits at a Glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { provider: "Gmail", limit: "25MB" },
                { provider: "Outlook", limit: "20MB" },
                { provider: "Yahoo Mail", limit: "25MB" },
                { provider: "Corporate", limit: "10MB" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.provider}</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{item.limit}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5 Methods to Send Large Files via Email</h2>
            <div className="space-y-5">
              {[
                {
                  num: "1", title: "Compress the File First (Best for PDFs & Images)",
                  desc: "If your file is a PDF, image, or document — compress it with SlimFile first. A 40MB PDF typically compresses to 2–5MB, well within any email limit. No link sharing needed — the file attaches directly.",
                  cta: true,
                },
                {
                  num: "2", title: "Google Drive Link",
                  desc: "Upload the file to Google Drive → right-click → Share → Copy Link. Paste the link in your email. Recipients can view or download without needing a Google account if you set sharing to 'Anyone with the link'.",
                  cta: false,
                },
                {
                  num: "3", title: "Dropbox Link",
                  desc: "Upload to Dropbox → hover over the file → Share → Create Link. Free Dropbox gives 2GB storage. Shared links work for any recipient.",
                  cta: false,
                },
                {
                  num: "4", title: "WeTransfer (Up to 2GB Free)",
                  desc: "Go to wetransfer.com, upload your files (up to 2GB free), enter the recipient's email, and WeTransfer sends them a download link. Links expire after 7 days.",
                  cta: false,
                },
                {
                  num: "5", title: "Gmail's Large File Insertion",
                  desc: "In Gmail, compose an email and click the Google Drive icon at the bottom of the compose window. Upload directly from Drive — Gmail bypasses attachment limits for Drive-linked files.",
                  cta: false,
                },
              ].map(item => (
                <div key={item.num} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex gap-3 items-start mb-3">
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.num}</div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-gray-600 text-sm ml-10">{item.desc}</p>
                  {item.cta && (
                    <div className="ml-10 mt-3">
                      <Link to="/compress-pdf-online" className="text-red-600 font-semibold text-sm underline">Compress PDF Free →</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Compress vs When to Use a Link</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                <p className="font-bold text-gray-900 mb-3">Compress and attach directly when:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ File is a PDF, image, or PPTX</li>
                  <li>✅ Recipient doesn't need the absolute original</li>
                  <li>✅ You want a self-contained email</li>
                  <li>✅ Recipient may have no cloud account</li>
                </ul>
              </div>
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-gray-900 mb-3">Use a link when:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ File is a video, ZIP archive, or software</li>
                  <li>✅ File is over 25MB even after compression</li>
                  <li>✅ Multiple people need access</li>
                  <li>✅ The file may need to be updated later</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Emailing Large Files</h2>
            <ul className="space-y-3">
              {[
                "Always compress PDFs before attaching — most PDFs reduce by 50–90% with no visible quality loss",
                "For multiple large images, ZIP them then share via Google Drive link",
                "Outlook users: use OneDrive insertion (same as Gmail's Drive integration) to bypass the 20MB limit",
                "Compress images with SlimFile before attaching — a 5MB JPEG becomes 400KB with no noticeable difference",
                "Test your attachment size before sending — check the email's total size in your sent drafts",
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
          <h2 className="text-3xl font-bold mb-4">Compress Your File — Email It Instantly</h2>
          <p className="text-red-100 mb-8 text-lg">No attachment errors. PDF and image compression. Free.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
