import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPptxForPresentation() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PPTX for Presentation</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Present confidently with smaller decks that load quickly on any device.
          </p>
          <Link to="/compress">
            <Button size="lg">Optimize a Deck</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Keep performance smooth</h2>
          <p>Slide decks often mix high-res photography, charts, and embedded videos. SlimFile targets the heaviest elements first so you can present without stutters or long load times.</p>
          <h3>Preparation checklist</h3>
          <ul>
            <li>Right-size images to match slide dimensions.</li>
            <li>Use vector logos and icons whenever possible.</li>
            <li>Trim video clips to essential segments and use efficient codecs.</li>
            <li>Embed fonts only when necessary to reduce overhead.</li>
          </ul>
          <h3>How SlimFile helps</h3>
          <ol>
            <li>Re-encodes images using perceptual quality thresholds.</li>
            <li>Optimizes embedded media and drops redundant streams.</li>
            <li>Removes unused thumbnails and metadata safely.</li>
            <li>Preserves slide layout and animations.</li>
          </ol>
          <h3>Explore more</h3>
          <ul>
            <li><Link to="/compress-pptx-online" className="text-primary hover:underline">Compress PPTX Online</Link></li>
            <li><Link to="/blog/compress-pptx-presentations-without-losing-quality" className="text-primary hover:underline">Compress PPTX Without Losing Quality</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


