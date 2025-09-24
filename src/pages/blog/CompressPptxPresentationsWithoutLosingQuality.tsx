import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogCompressPptxPresentationsWithoutLosingQuality() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PPTX Presentations Without Losing Quality</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Keep slides sharp while reducing file size.</p>
          <Link to="/compress"><Button size="lg">Optimize a Deck</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>Maintaining quality in PPTX compression means being selective about what gets optimized. Text and vector elements should remain untouched, while images and videos are processed with care.</p>
          <h3>Recommendations</h3>
          <ul>
            <li>Use vector charts and icons for infinite scalability.</li>
            <li>Match image resolution to slide output resolution.</li>
            <li>Choose video bitrates appropriate for the display and venue.</li>
          </ul>
          <h3>Testing your deck</h3>
          <ol>
            <li>Preview on the same device and display you will present with.</li>
            <li>Check transitions for smoothness on media-heavy slides.</li>
            <li>Verify remote sharing quality for virtual presentations.</li>
          </ol>
          <h3>See also</h3>
          <ul>
            <li><Link to="/compress-pptx-online" className="text-primary hover:underline">Compress PPTX Online</Link></li>
            <li><Link to="/compress-pptx-for-presentation" className="text-primary hover:underline">Compress PPTX for Presentation</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


