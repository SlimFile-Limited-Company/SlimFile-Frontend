import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogHowToCompressLargeVideosBeforeUploading() {
  return (
    <div className="min-h-screen pt-16">
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How to Compress Large Videos Before Uploading</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Reduce upload time and avoid platform size limits.</p>
          <Link to="/compress"><Button size="lg">Start Compressing</Button></Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl prose prose-gray">
          <p>Transcoding with modern codecs and choosing the right bitrate can shrink video sizes dramatically while keeping quality acceptable for your audience and platform.</p>
          <h3>Key choices</h3>
          <ul>
            <li>Codec: H.264 for broad compatibility, HEVC/AV1 for smaller sizes.</li>
            <li>Resolution: match your target display (1080p is a common baseline).</li>
            <li>Bitrate: use variable bitrate (VBR) with a sensible ceiling.</li>
          </ul>
          <h3>Editing tips</h3>
          <ol>
            <li>Trim unnecessary footage before export to save time and space.</li>
            <li>Reduce noise and avoid excessive sharpening to prevent artifacts.</li>
            <li>Export test clips to compare quality at different bitrates.</li>
          </ol>
          <h3>Further reading</h3>
          <ul>
            <li><Link to="/blog/why-file-compression-is-essential-for-remote-work" className="text-primary hover:underline">Compression for Remote Work</Link></li>
            <li><Link to="/compress-images-online" className="text-primary hover:underline">Compress Images Online</Link></li>
            <li><Link to="/compress-pdf-online" className="text-primary hover:underline">Compress PDF Online</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}


