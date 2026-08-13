import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Instagram, ArrowRight } from "lucide-react";
import { BlogSchema, FAQSection } from '@/components/BlogSchema';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedPosts } from '@/components/RelatedPosts';

export default function CompressImagesForInstagram() {
  useSEO({
    title: 'Compress Images for Instagram — Maintain Quality (2026) | SlimFile',
    description: 'Optimize images for Instagram posts, stories, and reels. Free compression tool that maintains quality while meeting Instagram requirements.',
    canonical: 'https://slim-file.com/blog/compress-images-for-instagram',
  });

  const faqs = [
    { question: "What are Instagram's image size requirements?", answer: "Instagram posts: max 1080x1350px (4:5 ratio), max 30MB. Stories: 1080x1920px (9:16), max 30MB. Feed posts display at 1080px width. Compress images to reduce upload time while maintaining visual quality." },
    { question: "Should I compress images before posting to Instagram?", answer: "Yes! Compressing reduces upload time and preserves quality better than Instagram's auto-compression. SlimFile optimizes images to Instagram's ideal specs before you upload." },
    { question: "What file format is best for Instagram?", answer: "JPEG for photos, PNG for graphics with transparency. Instagram converts everything to JPEG anyway, so compress to JPEG first for best quality control." },
    { question: "Does Instagram compress images?", answer: "Yes, Instagram automatically compresses all uploads. By pre-compressing with SlimFile, you control the quality and get better results than Instagram's aggressive auto-compression." },
    { question: "How do I compress images for Instagram without losing quality?", answer: "Use SlimFile: 1) Upload your image, 2) Select 'Instagram Optimized' preset, 3) Download and post. Images are optimized to 1080px width, 85% JPEG quality—perfect for Instagram." }
  ];

  const relatedPosts = [
    { title: "Compress Images for Facebook", description: "Optimize images for Facebook posts and ads", href: "/blog/compress-images-for-facebook", category: "Social Media" },
    { title: "Compress Images Online", description: "Free unlimited image compression", href: "/blog/compress-images-online-free", category: "Tools" },
    { title: "Reduce Photo Size on iPhone", description: "Compress photos directly on iOS", href: "/blog/reduce-photo-size-on-iphone", category: "Mobile" },
    { title: "Best Image Compressors 2026", description: "Top 10 image compression tools", href: "/blog/best-image-compressors-2026", category: "Reviews" }
  ];

  return (
    <>
      <BlogSchema
        title="Compress Images for Instagram — Maintain Quality (2026)"
        description="Optimize images for Instagram posts, stories, and reels. Free compression maintaining quality."
        datePublished="2026-05-15"
        dateModified="2026-08-08"
        faqs={faqs}
        keywords={["compress images for instagram", "instagram image size", "optimize photos for instagram", "instagram image requirements"]}
      />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Compress Images for Instagram" }]} />

      <div className="min-h-screen pt-20 bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mx-auto mb-6">
              <Instagram className="w-10 h-10 text-pink-600" />
            </div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Instagram</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">Compress Images for Instagram</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Optimize photos for Instagram posts, stories, and reels. Faster uploads, better quality.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/compress-images-online">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">
                  Compress for Instagram <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/compress">
                <Button variant="outline" className="px-8 py-3 rounded-xl font-semibold">General Compression</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Updated August 2026 · 6 min read</p>
          </div>
        </section>

        <article className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Instagram Image Requirements 2026</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">📸 Feed Posts</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Max width: 1080px</li>
                    <li>• Best ratio: 4:5 (1080x1350px)</li>
                    <li>• Max file size: 30MB</li>
                    <li>• Format: JPEG or PNG</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-3">📱 Stories</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Size: 1080x1920px (9:16)</li>
                    <li>• Max file size: 30MB</li>
                    <li>• Format: JPEG or PNG</li>
                    <li>• Video: MP4, max 15sec</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Compress for Instagram</h2>
              <ol className="space-y-4">
                {[
                  { step: 1, title: "Upload Image", desc: "Go to slim-file.com/compress-images-online and upload" },
                  { step: 2, title: "Compress", desc: "Select 'Instagram Optimized' or let auto-optimize handle it" },
                  { step: 3, title: "Download", desc: "Get optimized image (1080px width, perfect quality)" },
                  { step: 4, title: "Post", desc: "Upload to Instagram—faster upload, better quality" }
                ].map(item => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">{item.step}</div>
                    <div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-white rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Optimize for Instagram?</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/compress-images-online">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">Compress Images Free</Button>
                </Link>
                <Link to="/compress">
                  <Button variant="outline" className="px-8 py-3 rounded-xl font-semibold text-lg">All Tools</Button>
                </Link>
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
