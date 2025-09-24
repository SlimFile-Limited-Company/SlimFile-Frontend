import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogCompressingPdfForPrintingVsEmailing() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compressing PDF for Printing vs Emailing</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Different targets require different optimization strategies.</p>
          <Link to="/compress"><Button size="lg">Compress a PDF</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>Printing and emailing call for different optimization strategies. For print, prioritize higher DPI and color fidelity. For email, prioritize lighter images and smaller file sizes.</p>
          <h3>Settings by target</h3>
          <ul>
            <li>Printing: 300 DPI images, embedded fonts, accurate color profiles.</li>
            <li>Emailing: 96–150 DPI images, stripped metadata, lean compression.</li>
          </ul>
          <h3>Retention priorities</h3>
          <ol>
            <li>Keep vector text and lines for both use cases.</li>
            <li>Retain essential bookmarks and accessibility tags.</li>
            <li>Remove thumbnails and unnecessary attachments.</li>
          </ol>
          <h3>You might also like</h3>
          <ul>
            <li><Link to="/compress-pdf-without-losing-quality" className="text-primary hover:underline">Compress PDF Without Losing Quality</Link></li>
            <li><Link to="/compress-pdf-for-email" className="text-primary hover:underline">Compress PDF for Email</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


