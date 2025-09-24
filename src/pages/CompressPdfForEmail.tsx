import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPdfForEmail() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PDF for Email</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Keep attachments under size limits and deliver faster with optimized PDFs.
          </p>
          <Link to="/compress">
            <Button size="lg">Compress a PDF</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Avoid email bounces</h2>
          <p>Many email providers restrict attachment sizes, typically between 20–25 MB. Oversized PDFs lead to rejections or slow sends. Compressing aligns your document with provider limits without harming readability.</p>
          <h3>Why this matters for outreach</h3>
          <ul>
            <li>Sales and support emails deliver reliably with lean attachments.</li>
            <li>Recruiting and academic submissions reach recipients without delays.</li>
            <li>Clients and stakeholders open files quickly on mobile devices.</li>
          </ul>
          <h3>Suggested settings</h3>
          <ol>
            <li>Prefer text and vector graphics where possible.</li>
            <li>Downscale images that exceed page layout dimensions.</li>
            <li>Remove redundant metadata and unused embedded resources.</li>
          </ol>
          <h3>Workflow tips</h3>
          <ul>
            <li>Keep an original copy for print, and a compressed variant for email.</li>
            <li>Batch compress related documents for consistent sizes.</li>
            <li>Preview before sending to check visual fidelity.</li>
          </ul>
          <h3>Related content</h3>
          <ul>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
            <li><Link to="/blog/how-to-compress-pdf-for-email" className="text-primary hover:underline">How to Compress PDF for Email</Link></li>
            <li><Link to="/blog/compressing-pdf-for-printing-vs-emailing" className="text-primary hover:underline">Compressing PDF for Printing vs Emailing</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


