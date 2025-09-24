import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPdfOnIphone() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PDF on iPhone</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Use SlimFile in Safari to shrink PDFs instantly—no app installs required.
          </p>
          <Link to="/compress">
            <Button size="lg">Open Compressor</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Mobile-friendly by design</h2>
          <p>SlimFile is optimized for Safari on iPhone and iPad. Compression runs locally, so documents never leave your device. Touch-friendly controls and accessible UI ensure a smooth experience.</p>
          <h3>Why it works well on iOS</h3>
          <ul>
            <li>Hardware-accelerated decoding for faster processing.</li>
            <li>Battery-friendly operations and short processing bursts.</li>
            <li>No app install—just open SlimFile in your browser.</li>
          </ul>
          <h3>Quick tips</h3>
          <ol>
            <li>Use the Share menu in Safari to save the compressed PDF back to Files.</li>
            <li>Compress before attaching to Mail or Messages to avoid size limits.</li>
            <li>Keep cellular data usage low with smaller attachments.</li>
          </ol>
          <h3>Explore more</h3>
          <ul>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
            <li><Link to="/blog/reduce-pdf-file-size-on-mobile" className="text-primary hover:underline">Reduce PDF File Size on Mobile</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


