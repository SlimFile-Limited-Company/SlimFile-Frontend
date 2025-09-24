import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogReducePdfFileSizeOnMobile() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Reduce PDF File Size on Mobile</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Compress PDFs on iOS and Android right in the browser.</p>
          <Link to="/compress"><Button size="lg">Open Compressor</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>No installs required—SlimFile runs locally in your mobile browser for privacy and speed. This keeps uploads off third-party servers and saves data.</p>
          <h3>Make mobile workflows easier</h3>
          <ul>
            <li>Compress before attaching files to email or chat.</li>
            <li>Store lean copies in cloud drives to save space and sync faster.</li>
            <li>Share documents quickly with teammates and clients on the go.</li>
          </ul>
          <h3>Tips for iOS and Android</h3>
          <ol>
            <li>Use system Share/Save flows to keep your files organized.</li>
            <li>Prefer Wi‑Fi when compressing large scans to preserve data.</li>
            <li>Check legibility on small screens before sending.</li>
          </ol>
          <h3>Related</h3>
          <ul>
            <li><Link to="/compress-pdf-on-iphone" className="text-primary hover:underline">Compress PDF on iPhone</Link></li>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


