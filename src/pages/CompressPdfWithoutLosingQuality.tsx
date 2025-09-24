import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompressPdfWithoutLosingQuality() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Compress PDF Without Losing Quality</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Smart optimization preserves text and vector sharpness while reducing size.
          </p>
          <Link to="/compress">
            <Button size="lg">Try SlimFile</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <h2>Quality first</h2>
          <p>Our philosophy is to reduce size without visible degradation. That means avoiding over-aggressive downscaling, preserving vector text and shapes, and optimizing only where savings are meaningful.</p>
          <h3>What “without losing quality” means</h3>
          <ul>
            <li>Text remains selectable and sharp at any zoom level.</li>
            <li>Charts and diagrams keep clean lines and accurate colors.</li>
            <li>Photographs retain detail while shedding unnecessary bytes.</li>
          </ul>
          <h3>Techniques we apply</h3>
          <ol>
            <li>Adaptive image recompression based on content type.</li>
            <li>Retention of embedded fonts to maintain typesetting.</li>
            <li>Pruning of extraneous data that does not affect rendering.</li>
          </ol>
          <h3>When to use higher quality settings</h3>
          <p>Legal documents, presentations, and marketing collateral often warrant stricter retention of detail. SlimFile gives you strong defaults that suit most cases, while protecting critical fidelity.</p>
          <h3>You might also like</h3>
          <ul>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
            <li><Link to="/blog/compressing-pdf-for-printing-vs-emailing" className="text-primary hover:underline">Compressing PDF for Printing vs Emailing</Link></li>
            <li><Link to="/compress-pdf-for-email" className="text-primary hover:underline">Compress PDF for Email</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


