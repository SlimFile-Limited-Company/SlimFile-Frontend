import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Linkedin, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function CompressPdfForLinkedIn() {
  useSEO({
    title: 'Compress PDF for LinkedIn — Fit 100MB Limit (2026) | SlimFile',
    description: 'Upload PDFs to LinkedIn by compressing to fit the 100MB limit. Free tool for LinkedIn posts, documents, and portfolio uploads.',
    canonical: 'https://slim-file.com/blog/compress-pdf-for-linkedin',
  });

  const faqs = [
    { question: "What is LinkedIn's PDF upload limit?", answer: "LinkedIn allows PDF uploads up to 100MB for documents, posts, and portfolio items. If your PDF exceeds this, you must compress it first." },
    { question: "How do I upload a PDF to LinkedIn?", answer: "On LinkedIn posts: click 'Document' icon, select PDF. On profile: go to 'Featured' section, click '+' and upload. PDFs must be under 100MB." },
    { question: "Why compress PDFs for LinkedIn?", answer: "Smaller files upload faster, are easier to view on mobile, and ensure compatibility. LinkedIn's document viewer performs better with optimized PDFs under 10MB." },
    { question: "Will compressing reduce PDF quality on LinkedIn?", answer: "No. SlimFile maintains visual quality while reducing file size. Text remains crisp, images stay clear—perfect for portfolios and presentations." },
    { question: "Can I compress PDFs on mobile for LinkedIn?", answer: "Yes! SlimFile works in mobile browsers. Compress PDFs on your phone before uploading to LinkedIn." }
  ];

  const relatedPosts = [
    { title: "Compress PDF for Email", description: "Fit PDFs into email attachment limits", href: "/blog/how-to-compress-pdf-for-email", category: "Guides" },
    { title: "Compress Images for Instagram", description: "Optimize images for social media", href: "/blog/compress-images-for-instagram", category: "Social Media" },
    { title: "Compress PDF Online Free", description: "Free unlimited PDF compression", href: "/blog/compress-pdf-online-free", category: "Tools" },
    { title: "Best PDF Compressors 2026", description: "Top compression tools ranked", href: "/blog/best-pdf-compressors-2026", category: "Reviews" }
  ];

  return (
    <>
      <BlogSchema title="Compress PDF for LinkedIn — Fit 100MB Limit (2026)" description="Upload PDFs to LinkedIn by compressing to fit 100MB limit. Free tool." datePublished="2026-07-25" dateModified="2026-08-08" faqs={faqs} keywords={["compress pdf for linkedin", "linkedin pdf upload", "linkedin document limit", "reduce pdf for linkedin"]} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Compress PDF for LinkedIn" }]} />
      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6"><Linkedin className="w-10 h-10 text-blue-700" /></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">LinkedIn</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress PDF for LinkedIn</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Optimize PDFs for LinkedIn posts and portfolio. Faster uploads, better viewing.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress for LinkedIn <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/compress"><Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">All Tools</Button></Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 5 min read</p>
          </div>
        </section>
        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">LinkedIn PDF Requirements</h2>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Limits:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Max file size:</strong> 100MB</li>
                  <li>• <strong>Recommended:</strong> Under 10MB for best performance</li>
                  <li>• <strong>Format:</strong> PDF only (for document uploads)</li>
                  <li>• <strong>Max pages:</strong> 300 pages</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Compress PDF for LinkedIn</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Open SlimFile", desc: "Visit slim-file.com/compress-pdf-online" },
                  { step: 2, title: "Upload PDF", desc: "Select your portfolio, presentation, or document" },
                  { step: 3, title: "Compress", desc: "Click compress—reduces size by 70-90%" },
                  { step: 4, title: "Upload to LinkedIn", desc: "Use compressed PDF in posts or Featured section" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">{item.step}</div>
                    <div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices for LinkedIn PDFs</h2>
              <div className="space-y-3">
                {[
                  { title: "Keep Under 10MB", desc: "While LinkedIn allows 100MB, files under 10MB load faster and perform better on mobile." },
                  { title: "Use Descriptive Titles", desc: "Name your PDF clearly (e.g., 'Portfolio_JohnDoe_2026.pdf') for better discoverability." },
                  { title: "Optimize for Mobile", desc: "Most LinkedIn users view on phones. Compress to ensure smooth viewing." },
                  { title: "Test Before Posting", desc: "Download your compressed PDF and check quality before uploading to LinkedIn." }
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Upload to LinkedIn?</h3>
              <Link to="/compress-pdf-online"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Compress PDF Free</Button></Link>
              <p className="text-sm text-gray-500 mt-3">Perfect for portfolios, presentations, resumes</p>
            </div>
          </div>
        </article>
        <FAQSection faqs={faqs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
