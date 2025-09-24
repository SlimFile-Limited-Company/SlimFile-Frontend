import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPptxOnline() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PPTX Online</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Make your PowerPoint decks lighter and easier to share without losing visual fidelity.
          </p>
          <Link to="/compress">
            <Button size="lg">Start Compressing</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Keep presentations crisp and small</h2>
          <p>Large PPTX files slow down sharing and can stutter during delivery. SlimFile targets heavy slides, re-encodes images, and optimizes embedded media while preserving layout, fonts, and animations.</p>
          <h3>Top reasons to compress a deck</h3>
          <ul>
            <li>Send presentations over email and chat without hitting file limits.</li>
            <li>Host and embed decks online with faster loads and smoother playback.</li>
            <li>Present confidently without lag when transitioning between media-rich slides.</li>
            <li>Keep a high-quality visual experience for projectors and large screens.</li>
          </ul>
          <h3>What SlimFile optimizes</h3>
          <ol>
            <li>Images: adjusts resolution and compression based on slide size and purpose.</li>
            <li>Embedded Videos: favors efficient codecs and reasonable bitrates.</li>
            <li>Unused Data: removes redundant thumbnails and metadata.</li>
            <li>Fonts & Graphics: preserves vector quality for sharp text and icons.</li>
          </ol>
          <h3>Tips for best results</h3>
          <ul>
            <li>Use consistent image dimensions that match your slide template.</li>
            <li>Favor vector icons and shapes where possible over raster images.</li>
            <li>Trim video clips to the needed duration to reduce size.</li>
            <li>Store a master deck and export a compressed copy for sharing.</li>
          </ul>
          <h3>Related pages</h3>
          <ul>
            <li><Link to="/compress-pptx-for-presentation" className="text-primary hover:underline">Compress PPTX for Presentation</Link></li>
            <li><Link to="/blog/compress-pptx-presentations-without-losing-quality" className="text-primary hover:underline">Compress PPTX Presentations Without Losing Quality</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


