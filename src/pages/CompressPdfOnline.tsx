import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPdfOnline() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PDF Online</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Shrink your PDF files instantly without losing clarity. Fast, secure, and free.
          </p>
          <Link to="/compress">
            <Button size="lg">Start Compressing</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Why compress PDFs online?</h2>
          <p>Reducing PDF size helps your files send faster, upload smoothly to forms, and save valuable storage without sacrificing clarity. With SlimFile, compression runs locally in your browser for privacy and speed.</p>
          <p>Heavy PDFs often contain oversized images, embedded fonts, and unused metadata. Our approach focuses on optimizing these areas while keeping text crisp and vector shapes intact.</p>
          <h3>Key benefits</h3>
          <ul>
            <li>Lower attachment sizes to avoid email rejections and delays.</li>
            <li>Faster uploads to portals, job sites, and cloud storage.</li>
            <li>Better mobile performance for on-the-go sharing.</li>
            <li>Preserved readability and document structure.</li>
            <li>No server uploads—everything stays on your device.</li>
          </ul>
          <h3>How SlimFile reduces size</h3>
          <ol>
            <li>Detects large embedded images and applies smart recompression.</li>
            <li>Removes redundant metadata and thumbnails safely.</li>
            <li>Retains vector text to keep characters sharp and selectable.</li>
            <li>Optimizes color profiles and compression settings automatically.</li>
          </ol>
          <h3>When to compress a PDF</h3>
          <p>Any time you need to send, submit, or host a PDF, slimming the file will improve user experience. Marketing collateral, scanned documents, academic papers, and product manuals benefit the most.</p>
          <h3>Best practices</h3>
          <ul>
            <li>Start with high-quality sources to avoid compounding artifacts.</li>
            <li>Prefer vector text over rasterized text for clarity at any zoom.</li>
            <li>Use reasonable image dimensions that match the document layout.</li>
            <li>Keep a copy of the original for archival or print needs.</li>
          </ul>
          <h3>Get started</h3>
          <p>Drag and drop your PDF into SlimFile to see an instant size reduction while maintaining legibility and layout fidelity.</p>
          <h3>Related guides</h3>
          <ul>
            <li><Link to="/compress-pdf-for-email" className="text-primary hover:underline">Compress PDF for Email</Link></li>
            <li><Link to="/compress-pdf-without-losing-quality" className="text-primary hover:underline">Compress PDF Without Losing Quality</Link></li>
            <li><Link to="/blog/reduce-pdf-file-size-on-mobile" className="text-primary hover:underline">Reduce PDF File Size on Mobile</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


