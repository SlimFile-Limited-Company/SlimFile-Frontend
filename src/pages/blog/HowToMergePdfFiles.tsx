import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { FileStack, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function HowToMergePdfFiles() {
  useSEO({
    title: 'How to Merge PDF Files Free — Combine PDFs (2026) | SlimFile',
    description: 'Merge multiple PDFs into one file. Free online tool, no limits, maintains quality. Combine PDFs in seconds.',
    canonical: 'https://slim-file.com/blog/how-to-merge-pdf-files',
  });

  const faqs = [
    { question: "How do I merge PDF files for free?", answer: "Use SlimFile Forge: go to slim-file.com/forge, upload your PDFs, arrange them in order, and click merge. Download the combined PDF instantly." },
    { question: "Can I merge password-protected PDFs?", answer: "Yes, but you'll need to enter the password for each protected file before merging." },
    { question: "Is there a limit to how many PDFs I can merge?", answer: "No limit with SlimFile. Merge 2, 10, 50+ PDFs - as many as you need." },
    { question: "Will merging PDFs reduce quality?", answer: "No. Merging combines files as-is without compression. Quality remains identical to the originals." },
    { question: "Can I rearrange pages before merging?", answer: "Yes! SlimFile Forge lets you drag and drop to reorder PDFs and pages before merging." }
  ];

  const relatedPosts = [
    { title: "How to Split PDF Files", description: "Separate PDF into multiple files", href: "/blog/how-to-split-pdf-files", category: "Tools" },
    { title: "Compress PDF Online Free", description: "Reduce PDF file size after merging", href: "/blog/compress-pdf-online-free", category: "Tools" },
    { title: "Best Free PDF Tools 2026", description: "Top PDF tools for merge, split, compress", href: "/blog/best-free-pdf-tools-2026", category: "Reviews" },
    { title: "Add Password to PDF", description: "Protect merged PDFs with password", href: "/blog/add-password-to-pdf", category: "Security" }
  ];

  return (
    <>
      <BlogSchema title="How to Merge PDF Files Free — Combine PDFs (2026)" description="Merge multiple PDFs into one file. Free online tool, no limits." datePublished="2026-06-10" dateModified="2026-08-08" faqs={faqs} keywords={["merge pdf files free", "combine pdfs", "join pdf files", "merge pdf online"]} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "How to Merge PDF Files" }]} />
      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><FileStack className="w-10 h-10 text-blue-600" /></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">PDF Tools</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Merge PDF Files</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Combine multiple PDFs into one file. Free, unlimited, easy.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Merge PDFs Now <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">Compress After</Button></Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 4 min read</p>
          </div>
        </section>
        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Steps to Merge PDFs</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Open SlimFile Forge", desc: "Go to slim-file.com/forge" },
                  { step: 2, title: "Upload PDFs", desc: "Select all PDFs you want to merge" },
                  { step: 3, title: "Arrange Order", desc: "Drag to reorder if needed" },
                  { step: 4, title: "Merge", desc: "Click merge and download combined PDF" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4"><div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">{item.step}</div><div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div></li>
                ))}
              </ol>
            </section>
            <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Merge Your PDFs Now</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/forge"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Start Merging</Button></Link>
                <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold text-lg">Compress Tool</Button></Link>
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
