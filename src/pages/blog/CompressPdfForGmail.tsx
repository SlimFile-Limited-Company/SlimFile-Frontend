import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function CompressPdfForGmail() {
  useSEO({
    title: 'Compress PDF for Gmail — Fit 25MB Attachment Limit (2026) | SlimFile',
    description: 'Send large PDFs via Gmail by compressing them to fit the 25MB limit. Free tool, instant compression, works for Outlook too.',
    canonical: 'https://slim-file.com/blog/compress-pdf-for-gmail',
  });

  const faqs = [
    { question: "What is Gmail's attachment size limit?", answer: "Gmail limits email attachments to 25MB total. If your PDF is larger, you must compress it or use Google Drive sharing. SlimFile can reduce most PDFs by 70-90% to fit within 25MB." },
    { question: "How do I send a large PDF via Gmail?", answer: "Compress the PDF first: 1) Visit slim-file.com/compress-pdf-online, 2) Upload your PDF, 3) Click Compress, 4) Download the smaller file, 5) Attach to Gmail. Most files compress from 30MB+ down to under 5MB." },
    { question: "Why does Gmail say my attachment is too large?", answer: "Your file exceeds 25MB. Gmail shows 'Attachment size limit exceeded' error. Compress your PDF with SlimFile to reduce it below 25MB, then attach successfully." },
    { question: "Can I compress PDF directly in Gmail?", answer: "No, Gmail doesn't offer built-in compression. You must compress the PDF before attaching. SlimFile is the fastest free option—works in your browser in seconds." },
    { question: "What if my PDF is still too large after compression?", answer: "If compression doesn't get it under 25MB, use Gmail's Google Drive integration: Click the Drive icon in Gmail compose, upload your PDF to Drive, and share the link instead of attaching." }
  ];

  const relatedPosts = [
    { title: "How to Compress PDF for Email", description: "Complete email attachment compression guide", href: "/blog/how-to-compress-pdf-for-email", category: "Guides" },
    { title: "Compress PDF Online Free", description: "Free unlimited PDF compression", href: "/blog/compress-pdf-online-free", category: "Tools" },
    { title: "Reduce PDF File Size", description: "7 proven methods to shrink PDFs", href: "/blog/reduce-pdf-file-size", category: "Guides" },
    { title: "Best PDF Compressors 2026", description: "Top 10 compression tools ranked", href: "/blog/best-pdf-compressors-2026", category: "Reviews" }
  ];

  return (
    <>
      <BlogSchema
        title="Compress PDF for Gmail — Fit 25MB Attachment Limit (2026)"
        description="Send large PDFs via Gmail by compressing to fit 25MB limit. Free instant tool."
        datePublished="2026-05-01"
        dateModified="2026-08-08"
        faqs={faqs}
        keywords={["compress pdf for gmail", "gmail attachment size limit", "send large pdf gmail", "reduce pdf for email", "gmail 25mb limit"]}
      />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Compress PDF for Gmail" }]} />

      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6">
              <Mail className="w-10 h-10 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Gmail</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress PDF for Gmail</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Reduce PDF size to fit Gmail's 25MB limit. Free, instant compression.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link to="/compress-pdf-online">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">
                  Compress for Gmail <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/compress">
                <Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">
                  All Tools
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 5 min read</p>
          </div>
        </section>

        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Gmail Attachment Limits</h2>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <p className="text-lg font-semibold text-gray-900 mb-3">25MB Total Limit</p>
                <p className="text-gray-600">Gmail allows up to 25MB of attachments per email. If your PDF is larger, you'll see "Attachment size limit exceeded" error.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Compress PDF for Gmail</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Open SlimFile", desc: "Visit slim-file.com/compress-pdf-online in any browser" },
                  { step: 2, title: "Upload Your PDF", desc: "Click 'Choose File' and select the large PDF" },
                  { step: 3, title: "Compress", desc: "Click 'Compress PDF' — takes seconds" },
                  { step: 4, title: "Download & Attach", desc: "Download compressed file and attach to Gmail" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">{item.step}</div>
                    <div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="text-center py-8 bg-gradient-to-br from-red-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Send Your PDF?</h3>
              <Link to="/compress-pdf-online">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Compress PDF Free</Button>
              </Link>
            </div>
          </div>
        </article>

        <FAQSection faqs={faqs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
