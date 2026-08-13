import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function CompressPdfForWhatsapp() {
  useSEO({
    title: 'Compress PDF for WhatsApp — Fit 16MB Limit (2026) | SlimFile',
    description: 'Send large PDFs on WhatsApp by compressing them to fit the 16MB limit. Free tool, instant compression, works on mobile and desktop.',
    canonical: 'https://slim-file.com/blog/compress-pdf-for-whatsapp',
  });

  const faqs = [
    {
      question: "What is WhatsApp's file size limit for PDFs?",
      answer: "WhatsApp limits file attachments to 16MB on Android and 128MB on iOS. However, for broad compatibility and faster sending, keep files under 16MB so both platforms can send and receive them."
    },
    {
      question: "How do I compress a PDF to send on WhatsApp?",
      answer: "Use SlimFile on your phone or computer: 1) Open slim-file.com/compress-pdf-online, 2) Upload your PDF, 3) Click Compress, 4) Download the smaller file, 5) Send via WhatsApp. The process takes seconds."
    },
    {
      question: "Can I compress PDFs directly on my phone for WhatsApp?",
      answer: "Yes! SlimFile works in mobile browsers (Safari, Chrome). Visit the site on your phone, compress your PDF, and it's ready to send via WhatsApp without downloading any app."
    },
    {
      question: "Will compressing a PDF for WhatsApp reduce quality?",
      answer: "No. SlimFile uses balanced compression that maintains readability and visual quality. Documents remain clear and professional even after 70-90% size reduction."
    },
    {
      question: "Why won't my PDF send on WhatsApp?",
      answer: "Most likely the file exceeds 16MB (Android limit). Compress it with SlimFile to reduce the size below 16MB, and it will send successfully on all devices."
    }
  ];

  const relatedPosts = [
    {
      title: "Compress PDF for Email",
      description: "Reduce PDF size for Gmail and Outlook",
      href: "/blog/how-to-compress-pdf-for-email",
      category: "Guides"
    },
    {
      title: "Compress PDF Online Free",
      description: "Free unlimited PDF compression tool",
      href: "/blog/compress-pdf-online-free",
      category: "Tools"
    },
    {
      title: "Compress Images for WhatsApp",
      description: "Reduce image size for WhatsApp sharing",
      href: "/blog/compress-images-for-whatsapp",
      category: "Guides"
    },
    {
      title: "Best PDF Compressors 2026",
      description: "Top 10 PDF compression tools",
      href: "/blog/best-pdf-compressors-2026",
      category: "Reviews"
    }
  ];

  return (
    <>
      <BlogSchema
        title="Compress PDF for WhatsApp — Fit 16MB Limit (2026)"
        description="Send large PDFs on WhatsApp by compressing them to fit the 16MB limit. Free tool, works on mobile."
        datePublished="2026-03-15"
        dateModified="2026-08-08"
        faqs={faqs}
        keywords={["compress pdf for whatsapp", "whatsapp pdf size limit", "send large pdf whatsapp", "reduce pdf for whatsapp"]}
      />
      <Breadcrumbs items={[
        { label: "Blog", href: "/blog" },
        { label: "Compress PDF for WhatsApp" }
      ]} />

      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">WhatsApp</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              Compress PDF for WhatsApp
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Reduce PDF size to fit WhatsApp's 16MB limit. Free, works on mobile, no app needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link to="/compress-pdf-online">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">
                  Compress for WhatsApp <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/compress">
                <Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">
                  All Tools
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 6 min read</p>
          </div>
        </section>

        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">WhatsApp File Size Limits</h2>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-4">
                <p className="text-sm text-gray-700 mb-3"><strong>Maximum file sizes:</strong></p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>📱 <strong>Android:</strong> 16 MB</li>
                  <li>🍎 <strong>iOS:</strong> 128 MB (but receiver's limit matters too)</li>
                  <li>💻 <strong>WhatsApp Web/Desktop:</strong> 16 MB (matches Android)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  <strong>Best practice:</strong> Keep files under 16MB for universal compatibility.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Compress PDF for WhatsApp</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Open SlimFile on Your Phone</h3>
                    <p className="text-gray-600 mb-3">Visit <strong>slim-file.com/compress-pdf-online</strong> in Safari (iOS) or Chrome (Android).</p>
                    <p className="text-sm text-gray-500">✓ No app download needed • Works in browser</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your PDF</h3>
                    <p className="text-gray-600 mb-3">Tap "Choose File" and select the PDF from your device (Downloads, iCloud, Google Drive, etc.).</p>
                    <p className="text-sm text-gray-500">✓ File stays on your device • Not uploaded to servers</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Compress</h3>
                    <p className="text-gray-600 mb-3">Tap "Compress PDF". Your browser processes the file locally in seconds.</p>
                    <p className="text-sm text-gray-500">✓ Typical reduction: 70-90% smaller</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Send</h3>
                    <p className="text-gray-600 mb-3">Download the compressed PDF. Open WhatsApp, attach the file, and send!</p>
                    <p className="text-sm text-gray-500">✓ Now under 16MB • Sends on all devices</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why SlimFile for WhatsApp?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <p className="font-semibold text-gray-900 mb-2">📱 Mobile-Friendly</p>
                  <p className="text-sm text-gray-600">Works perfectly in mobile browsers. No app needed.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <p className="font-semibold text-gray-900 mb-2">🔒 Private</p>
                  <p className="text-sm text-gray-600">Files processed on your device. Never uploaded anywhere.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <p className="font-semibold text-gray-900 mb-2">⚡ Fast</p>
                  <p className="text-sm text-gray-600">Compress in seconds. No waiting for cloud processing.</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                  <p className="font-semibold text-gray-900 mb-2">💯 Free</p>
                  <p className="text-sm text-gray-600">No limits, no premium upsells, completely free.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Scenarios</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">📄 Sending Invoices/Receipts</p>
                  <p className="text-sm text-gray-600">PDF invoices are often 5-10MB (especially scanned). Compress to 1-2MB for instant WhatsApp sharing.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">📚 Sharing Study Materials</p>
                  <p className="text-sm text-gray-600">Textbook chapters and notes exceed 16MB. Compress to share with classmates on WhatsApp groups.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">📝 Work Documents</p>
                  <p className="text-sm text-gray-600">Reports with images, presentations saved as PDF — compress for quick client sharing.</p>
                </div>
              </div>
            </section>

            <div className="text-center py-8 bg-gradient-to-br from-green-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Send Your PDF on WhatsApp?</h3>
              <Link to="/compress-pdf-online">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">
                  Compress PDF Now
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">Works on mobile • Under 16MB guaranteed • Free</p>
            </div>

          </div>
        </article>

        <FAQSection faqs={faqs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
