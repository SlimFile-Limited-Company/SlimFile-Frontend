import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Files, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function HowToCompressMultiplePdfs() {
  useSEO({
    title: 'How to Compress Multiple PDFs at Once — Batch Compression (2026)',
    description: 'Compress multiple PDF files simultaneously. Free batch compression tool, process 10s or 100s of PDFs in one go.',
    canonical: 'https://slim-file.com/blog/how-to-compress-multiple-pdfs',
  });

  const faqs = [
    { question: "How do I compress multiple PDFs at once?", answer: "Use SlimFile: select multiple PDF files (hold Ctrl/Cmd while clicking), upload them all, and compress. All files process simultaneously in your browser." },
    { question: "Is there a limit to how many PDFs I can compress?", answer: "No hard limit with SlimFile. Your browser's memory is the only constraint. Most users easily compress 50-100 PDFs at once." },
    { question: "Can I compress an entire folder of PDFs?", answer: "Yes! In SlimFile's file picker, you can select all files in a folder. On some browsers, you can drag and drop entire folders." },
    { question: "Will batch compression reduce quality?", answer: "No. Each PDF is compressed individually with the same quality settings. Batch processing doesn't compromise quality." },
    { question: "How long does batch compression take?", answer: "Depends on file count and size. 10 PDFs: ~30 seconds. 100 PDFs: ~5 minutes. Processing happens in your browser, so powerful computers are faster." }
  ];

  const relatedPosts = [
    { title: "Batch Compress PDFs", description: "Complete guide to batch PDF compression", href: "/blog/batch-compress-pdfs", category: "Guides" },
    { title: "Compress PDF Online Free", description: "Free unlimited PDF compression", href: "/blog/compress-pdf-online-free", category: "Tools" },
    { title: "Compress PDF for Business", description: "Enterprise batch compression solutions", href: "/blog/compress-pdf-for-business", category: "Business" },
    { title: "Best PDF Compressors 2026", description: "Top batch compression tools", href: "/blog/best-pdf-compressors-2026", category: "Reviews" }
  ];

  return (
    <>
      <BlogSchema title="How to Compress Multiple PDFs at Once — Batch (2026)" description="Batch compress multiple PDF files simultaneously. Free tool." datePublished="2026-07-28" dateModified="2026-08-08" faqs={faqs} keywords={["compress multiple pdfs", "batch compress pdfs", "compress pdfs at once", "bulk pdf compression"]} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Compress Multiple PDFs" }]} />
      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mx-auto mb-6"><Files className="w-10 h-10 text-purple-600" /></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Batch Tools</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Multiple PDFs at Once</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Batch compress 10s or 100s of PDFs simultaneously. Free, unlimited, fast.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Batch Compress Now <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">All Tools</Button></Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 6 min read</p>
          </div>
        </section>
        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Batch Compress PDFs</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Open SlimFile", desc: "Go to slim-file.com/compress-pdf-online" },
                  { step: 2, title: "Select Multiple PDFs", desc: "Hold Ctrl (Windows) or Cmd (Mac) and click multiple files" },
                  { step: 3, title: "Upload All", desc: "All selected PDFs upload simultaneously" },
                  { step: 4, title: "Compress", desc: "Click compress—all files process at once" },
                  { step: 5, title: "Download All", desc: "Download compressed files individually or as ZIP" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">{item.step}</div>
                    <div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases for Batch Compression</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: "📁", title: "Archive Cleanup", desc: "Compress old document folders to save storage space" },
                  { icon: "📧", title: "Email Campaigns", desc: "Prepare multiple PDFs for mass email distribution" },
                  { icon: "🌐", title: "Website Assets", desc: "Optimize all downloadable PDFs on your website" },
                  { icon: "💼", title: "Client Deliverables", desc: "Compress project documents before sending to client" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tips for Efficient Batch Compression</h2>
              <div className="space-y-3">
                {[
                  "Process 20-50 files at a time for optimal speed",
                  "Close other browser tabs to free up memory",
                  "Sort files by size—compress largest ones first",
                  "Download as ZIP if compressing 10+ files"
                ].map((tip, i) => (
                  <div key={i} className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-gray-700"><strong className="text-purple-700">Tip {i + 1}:</strong> {tip}</p>
                  </div>
                ))}
              </div>
            </section>
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Batch Compressing</h3>
              <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Compress Multiple PDFs</Button></Link>
              <p className="text-sm text-gray-500 mt-3">No limits • Process 100s of files • Free</p>
            </div>
          </div>
        </article>
        <FAQSection faqs={faqs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
