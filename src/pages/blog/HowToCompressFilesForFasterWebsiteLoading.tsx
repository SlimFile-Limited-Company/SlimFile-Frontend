import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogHowToCompressFilesForFasterWebsiteLoading() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How to Compress Files for Faster Website Loading</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Improve performance with image and document optimization.</p>
          <Link to="/compress"><Button size="lg">Start Compressing</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>Optimizing files reduces transfer sizes and speeds up the critical rendering path. This improves metrics such as Largest Contentful Paint and Interaction to Next Paint.</p>
          <h3>Where to focus</h3>
          <ul>
            <li>Images: often the heaviest assets; compress and resize.</li>
            <li>Documents: PDFs and PPTX downloads benefit from slimming.</li>
            <li>Videos: transcode for target bitrates and resolutions.</li>
          </ul>
          <h3>Delivery strategies</h3>
          <ol>
            <li>Use caching and CDNs to reduce latency.</li>
            <li>Serve modern image and video formats when supported.</li>
            <li>Defer non-critical assets below the fold.</li>
          </ol>
          <h3>Explore more</h3>
          <ul>
            <li><Link to="/compress-images-for-website" className="text-primary hover:underline">Compress Images for Website</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
            <li><Link to="/blog/best-tools-to-compress-images-online" className="text-primary hover:underline">Best Tools to Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


