import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressImagesForWebsite() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress Images for Website</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Make pages load faster and boost Core Web Vitals with optimized images.
          </p>
          <Link to="/compress">
            <Button size="lg">Compress Images</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Faster websites, happier users</h2>
          <p>Images are often the largest assets on a page. By optimizing format, dimensions, and compression levels, you can dramatically improve perceived performance and conversion rates.</p>
          <h3>Impact on performance</h3>
          <ul>
            <li>Lower cumulative layout shift by serving properly sized assets.</li>
            <li>Faster Largest Contentful Paint for hero images and banners.</li>
            <li>Reduced bounce rates on mobile connections.</li>
          </ul>
          <h3>How to approach optimization</h3>
          <ol>
            <li>Start with responsive design and define breakpoints.</li>
            <li>Use WebP or AVIF for photographic content where supported.</li>
            <li>Export hero images at exact display sizes to avoid waste.</li>
            <li>Serve multiple sizes via srcset and sizes attributes.</li>
          </ol>
          <h3>Related articles</h3>
          <ul>
            <li><Link to="/blog/how-to-compress-files-for-faster-website-loading" className="text-primary hover:underline">How to Compress Files for Faster Website Loading</Link></li>
            <li><Link to="/blog/best-tools-to-compress-images-online" className="text-primary hover:underline">Best Tools to Compress Images Online</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


