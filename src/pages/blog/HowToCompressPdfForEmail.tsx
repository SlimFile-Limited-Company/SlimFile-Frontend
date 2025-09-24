import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogHowToCompressPdfForEmail() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How to Compress PDF for Email</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Keep attachments under provider limits and deliver reliably.</p>
          <Link to="/compress"><Button size="lg">Compress a PDF</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>Email services often cap attachments between 20–25 MB. Compressing ensures your message gets through without forcing recipients to use cloud links or separate download portals.</p>
          <h3>Why it matters</h3>
          <ul>
            <li>Higher deliverability for sales, support, and recruiting outreach.</li>
            <li>Faster sending and downloading on mobile networks.</li>
            <li>Improved user experience with smaller, quicker attachments.</li>
          </ul>
          <h3>Practical workflow</h3>
          <ol>
            <li>Export your document to PDF.</li>
            <li>Open SlimFile and compress the PDF while retaining quality.</li>
            <li>Attach the compressed version to your email.</li>
          </ol>
          <h3>Common pitfalls</h3>
          <ul>
            <li>Avoid repeatedly compressing already compressed files.</li>
            <li>Keep a high-quality original for print or archival.</li>
            <li>Check legibility for small text after compression.</li>
          </ul>
          <h3>Next steps</h3>
          <ul>
            <li><Link to="/compress-pdf-for-email" className="text-primary hover:underline">Compress PDF for Email</Link></li>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
            <li><Link to="/blog/compressing-pdf-for-printing-vs-emailing" className="text-primary hover:underline">Printing vs Emailing</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


