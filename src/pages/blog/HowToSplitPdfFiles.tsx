import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Scissors, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function HowToSplitPdfFiles() {
  useSEO({
    title: 'How to Split PDF Files — Separate Pages Free (2026) | SlimFile',
    description: 'Split PDF into separate pages or extract specific pages. Free online tool, no limits, instant splitting.',
    canonical: 'https://slim-file.com/blog/how-to-split-pdf-files',
  });

  const faqs = [
    { question: "How do I split a PDF file for free?", answer: "Use SlimFile Forge: go to slim-file.com/forge, upload your PDF, select which pages to extract or split, and download the separated files instantly." },
    { question: "Can I extract specific pages from a PDF?", answer: "Yes! SlimFile Forge lets you select specific pages to extract. You can split by page range, extract odd/even pages, or separate each page individually." },
    { question: "Is there a limit to PDF size for splitting?", answer: "No limit with SlimFile. Split large PDFs (100+ pages, 50MB+) without restrictions." },
    { question: "Will splitting reduce PDF quality?", answer: "No. Splitting separates pages as-is without any compression or quality loss. Pages remain identical to the original." },
    { question: "Can I split password-protected PDFs?", answer: "Yes, but you'll need to enter the password first to unlock the PDF before splitting." }
  ];

  const relatedPosts = [
    { title: "How to Merge PDF Files", description: "Combine multiple PDFs into one", href: "/blog/how-to-merge-pdf-files", category: "Tools" },
    { title: "Compress PDF Online Free", description: "Reduce PDF size after splitting", href: "/blog/compress-pdf-online-free", category: "Tools" },
    { title: "Extract Pages from PDF", description: "Advanced page extraction techniques", href: "/blog/extract-pages-from-pdf", category: "Guides" },
    { title: "Best Free PDF Tools 2026", description: "Complete PDF toolkit", href: "/blog/best-free-pdf-tools-2026", category: "Reviews" }
  ];

  return (
    <>
      <BlogSchema title="How to Split PDF Files — Separate Pages Free (2026)" description="Split PDF into separate pages. Free online tool, no limits." datePublished="2026-06-15" dateModified="2026-08-08" faqs={faqs} keywords={["split pdf files", "separate pdf pages", "extract pdf pages", "divide pdf"]} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "How to Split PDF Files" }]} />
      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mx-auto mb-6"><Scissors className="w-10 h-10 text-purple-600" /></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Split PDF Files</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Separate PDF pages or extract specific sections. Free, unlimited, instant.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Split PDF Now <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">Compress Tool</Button></Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 4 min read</p>
          </div>
        </section>
        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Split a PDF</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Open SlimFile Forge", desc: "Go to slim-file.com/forge" },
                  { step: 2, title: "Upload PDF", desc: "Select the PDF you want to split" },
                  { step: 3, title: "Choose Split Method", desc: "Select pages to extract or split all" },
                  { step: 4, title: "Download", desc: "Get your separated PDF files" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4"><div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">{item.step}</div><div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div></li>
                ))}
              </ol>
            </section>
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Split Your PDF Now</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Start Splitting</Button></Link>
                <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold text-lg">Compress After</Button></Link>
              </div>
            </div>
          </div>
        </article>
        <FAQSection faqs={faqs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
