import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogPasswordProtectPdf() {
  useSEO({
    title: 'How to Password Protect a PDF Online Free 2026 | SlimFile Blog',
    description: 'Add a password to any PDF file online for free. Protect sensitive documents with encryption before sharing — no software, no account, instant protection.',
    canonical: 'https://slim-file.com/blog/password-protect-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6"><Lock className="w-10 h-10 text-red-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Security</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Password Protect a PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Add encryption to any PDF in seconds. Share sensitive documents safely — recipients need your password to open them.</p>
          <Link to="/lock"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Lock PDF Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Password Protect a PDF?</h2>
            <ul className="space-y-3">
              {[
                "Prevent unauthorised viewing of contracts, financial reports, or medical records",
                "Ensure only intended recipients can open shared documents",
                "Comply with data protection requirements (GDPR, HIPAA) for sensitive files",
                "Protect intellectual property in proposals, designs, or reports",
                "Add a layer of security when sharing via email or cloud storage links",
              ].map((reason, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{reason}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Password Protect a PDF with SlimFile</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Go to slim-file.com/lock", desc: "Open SlimFile's PDF lock tool in any browser — no account needed." },
                { step: "2", title: "Upload your PDF", desc: "Your file is processed in your browser session and never stored on any server." },
                { step: "3", title: "Set your password", desc: "Enter a strong password. Use a mix of letters, numbers, and symbols." },
                { step: "4", title: "Download the encrypted PDF", desc: "The password-protected PDF is ready to share. Recipients need the password to open it." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Method 2: Microsoft Office (Word/Excel)</h2>
            <p className="text-gray-600 mb-4">When exporting Office documents as PDFs, you can add password protection during the export:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Click <strong>File → Save As → PDF</strong></li>
              <li>Click <strong>Options</strong> in the Save As dialog</li>
              <li>Check <strong>"Encrypt the document with a password"</strong></li>
              <li>Enter your password and confirm</li>
              <li>Click <strong>Save</strong></li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Encryption Levels Explained</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Encryption Level</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Security</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Use Case</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3">40-bit RC4 (PDF 1.1)</td><td className="p-3 text-red-600">Weak</td><td className="p-3">Legacy — avoid</td></tr>
                  <tr><td className="p-3">128-bit RC4 (PDF 1.4)</td><td className="p-3 text-yellow-600">Moderate</td><td className="p-3">Basic document protection</td></tr>
                  <tr className="bg-green-50"><td className="p-3 font-semibold">256-bit AES (PDF 1.7)</td><td className="p-3 text-green-600 font-semibold">Strong</td><td className="p-3">Recommended — SlimFile uses this</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Security Tips</h2>
            <ul className="space-y-3">
              {[
                "Never send the password in the same email as the protected PDF — use a separate channel (text, phone, another email)",
                "Use at least 12 characters combining uppercase, lowercase, numbers, and symbols",
                "Don't use the same password for multiple documents",
                "Store your password in a password manager — if lost, the PDF cannot be recovered",
                "For highly sensitive documents, combine PDF encryption with secure file transfer services",
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
          <h2 className="text-3xl font-bold mb-4">Password Protect Your PDF — Free</h2>
          <p className="text-red-100 mb-8 text-lg">256-bit AES encryption. Files never stored. Instant.</p>
          <Link to="/lock"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Lock PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
