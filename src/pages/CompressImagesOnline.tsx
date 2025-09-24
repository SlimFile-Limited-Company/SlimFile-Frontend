import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressImagesOnline() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress Images Online</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Optimize JPEG, PNG, and WebP for fast sharing and publishing.
          </p>
          <Link to="/compress">
            <Button size="lg">Start Compressing</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Perfect for web and email</h2>
          <p>High-resolution photos are great for editing, but they can make pages load slowly and emails bounce. SlimFile re-encodes images using modern formats and right-sized dimensions to keep visual quality while slashing bytes.</p>
          <h3>Why image compression matters</h3>
          <ul>
            <li>Improves Core Web Vitals and SEO by reducing Largest Contentful Paint.</li>
            <li>Speeds up content delivery on mobile and constrained networks.</li>
            <li>Cuts CDN and storage costs for large media libraries.</li>
            <li>Enhances newsletter deliverability and user engagement.</li>
          </ul>
          <h3>How we optimize</h3>
          <ol>
            <li>Resizes images to fit common breakpoints without over-shrinking.</li>
            <li>Chooses efficient formats like WebP where appropriate.</li>
            <li>Balances compression level with perceived visual quality.</li>
            <li>Strips unnecessary metadata while preserving color accuracy.</li>
          </ol>
          <h3>Best practices</h3>
          <ul>
            <li>Design with responsive image sizes in mind.</li>
            <li>Use vector graphics for icons and logos when possible.</li>
            <li>Generate multiple sizes for art direction and serve via srcset.</li>
            <li>Keep originals archived for print or high-res needs.</li>
          </ul>
          <h3>Related reads</h3>
          <ul>
            <li><Link to="/compress-images-for-website" className="text-primary hover:underline">Compress Images for Website</Link></li>
            <li><Link to="/blog/best-tools-to-compress-images-online" className="text-primary hover:underline">Best Tools to Compress Images Online</Link></li>
            <li><Link to="/blog/how-to-compress-files-for-faster-website-loading" className="text-primary hover:underline">How to Compress Files for Faster Website Loading</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


