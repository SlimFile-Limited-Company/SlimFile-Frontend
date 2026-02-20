import React from "react";
import { BookOpen, Zap, Cloud, Lock, Globe, FileText, Image, Video, HelpCircle, TrendingUp, Shield, ExternalLink } from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
  <section className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <h2 className="text-2xl font-normal text-gray-900">{title}</h2>
    </div>
    <div className="text-base text-gray-700 leading-relaxed space-y-4">{children}</div>
  </section>
);

const FileCompressionEducation = () => (
  <div className="min-h-screen bg-white pt-24 pb-16">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      {/* Header */}
      <div className="py-12 mb-8">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <BookOpen className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-4xl font-normal text-gray-900 mb-4">
          The Complete Guide to File Compression
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          File compression powers the modern digital world. Learn what it is, how it works, and why it matters for everyone—from everyday users to global businesses.
        </p>
      </div>

      {/* Main Content */}
      <Section icon={Zap} title="Why File Compression Matters">
        <p>
          Every time you send a photo, stream a video, or load a website, file compression is working behind the scenes. Without it, the internet would be slower, storage would be more expensive, and sharing digital content would be a headache. Compression makes digital life faster, greener, and more accessible for everyone.
        </p>
      </Section>

      <Section icon={TrendingUp} title="A Brief History & Timeline">
        <ul className="space-y-2">
          <li className="flex gap-3">
            <span className="font-medium text-gray-900 min-w-[120px]">1960s-70s:</span>
            <span>Early research into data encoding and redundancy removal.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-gray-900 min-w-[120px]">1980s:</span>
            <span>ARC and ZIP archivers make file sharing and storage practical for home computers.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-gray-900 min-w-[120px]">1990s:</span>
            <span>JPEG and MP3 bring lossy compression to images and music, revolutionizing media.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-gray-900 min-w-[120px]">2000s:</span>
            <span>MP4 and advanced codecs enable streaming video and mobile downloads.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-gray-900 min-w-[120px]">2010s-present:</span>
            <span>Brotli, WebP, and cloud-native formats push efficiency even further.</span>
          </li>
        </ul>
      </Section>

      <Section icon={FileText} title="The Science of Compression">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Entropy</h3>
            <p>In information theory, entropy measures the unpredictability or randomness of data. The more predictable the data, the more it can be compressed.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Finding Redundancy</h3>
            <p>Compression algorithms look for patterns, repetition, and structure. For example, the string <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">AAAAAA</code> can be stored as <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">6A</code> (run-length encoding).</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Popular Algorithms</h3>
            <ul className="space-y-1">
              <li><span className="font-medium">Huffman Coding:</span> Assigns shorter codes to more frequent data.</li>
              <li><span className="font-medium">LZ77/LZW:</span> Builds a dictionary of repeated sequences.</li>
              <li><span className="font-medium">DEFLATE:</span> Used in ZIP, PNG, and GZIP; combines LZ77 and Huffman.</li>
              <li><span className="font-medium">Brotli:</span> Modern web compression, used by Google and others.</li>
              <li><span className="font-medium">JPEG/MP3:</span> Use transform coding and quantization for lossy compression.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Image} title="Types of Compression">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg px-5 py-4 border-l-2 border-gray-300">
            <h3 className="font-medium text-gray-900 mb-1">Lossless</h3>
            <p className="text-sm">No information is lost. Used for ZIP, PNG, FLAC, GIF, and PDF. The original file can be perfectly reconstructed.</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-5 py-4 border-l-2 border-gray-300">
            <h3 className="font-medium text-gray-900 mb-1">Lossy</h3>
            <p className="text-sm">Some data is discarded for higher compression. Used for JPEG, MP3, MP4, WebP. The result is smaller files, with some quality loss (often imperceptible).</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-5 py-4 border-l-2 border-gray-300">
            <h3 className="font-medium text-gray-900 mb-1">Hybrid</h3>
            <p className="text-sm">Video codecs often combine both approaches for maximum efficiency.</p>
          </div>
        </div>
      </Section>

      <Section icon={Cloud} title="Real-World Scenarios & Use Cases">
        <ul className="space-y-2">
          <li><span className="font-medium text-gray-900">Web Browsing:</span> HTTP compression (GZIP, Brotli) makes websites load faster and saves bandwidth.</li>
          <li><span className="font-medium text-gray-900">Photo Sharing:</span> Social media compresses images to speed up uploads and reduce storage needs.</li>
          <li><span className="font-medium text-gray-900">Streaming:</span> Netflix, YouTube, and Spotify use advanced codecs to deliver high-quality video and audio with minimal buffering.</li>
          <li><span className="font-medium text-gray-900">Backups & Archives:</span> Businesses compress data for backups, saving space and money.</li>
          <li><span className="font-medium text-gray-900">Healthcare & Science:</span> Medical images and scientific data are compressed for storage and analysis.</li>
          <li><span className="font-medium text-gray-900">Education:</span> Schools and universities compress documents and media to facilitate online learning.</li>
          <li><span className="font-medium text-gray-900">Mobile & Data Plans:</span> Compression is critical for users on limited data plans or slow connections.</li>
          <li><span className="font-medium text-gray-900">Cloud Computing:</span> Cloud providers use compression to optimize storage and reduce costs.</li>
        </ul>
      </Section>

      <Section icon={Globe} title="Environmental & Economic Impact">
        <ul className="space-y-2">
          <li><span className="font-medium text-gray-900">Energy Savings:</span> Less data means less energy used in data centers and networks.</li>
          <li><span className="font-medium text-gray-900">Lower Costs:</span> Businesses and individuals save on storage and bandwidth costs.</li>
          <li><span className="font-medium text-gray-900">Accessibility:</span> Compression makes the web faster and more usable for people worldwide.</li>
          <li><span className="font-medium text-gray-900">Greener Tech:</span> Reducing data transmission helps lower the carbon footprint of the digital world.</li>
        </ul>
      </Section>

      <Section icon={HelpCircle} title="Best Practices for Compression">
        <ul className="space-y-2">
          <li>Use <span className="font-medium">lossless</span> compression for important documents, code, and anything you need to restore exactly.</li>
          <li>Use <span className="font-medium">lossy</span> compression for photos, music, and video where some quality loss is acceptable.</li>
          <li>Always keep a backup of originals before applying lossy compression.</li>
          <li>Choose the right format for your needs (e.g., PNG for graphics, JPEG for photos, PDF for documents).</li>
          <li>Test different settings to find the best balance of size and quality.</li>
        </ul>
      </Section>

      <Section icon={Lock} title="Compression & Privacy/Security">
        <ul className="space-y-2">
          <li>Compression is not encryption. For sensitive files, use encryption in addition to compression.</li>
          <li>SlimFile deletes your files after processing and never stores them longer than necessary.</li>
          <li>Be aware of rare vulnerabilities (e.g., CRIME/BREACH attacks) when combining compression and encryption in web apps.</li>
        </ul>
      </Section>

      <Section icon={Shield} title="Myths & Misconceptions">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-900 mb-1">"Compression always reduces quality"</p>
            <p className="text-sm">Not true! Lossless compression preserves all data. Lossy compression can be visually or audibly indistinguishable from the original at reasonable settings.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">"You can infinitely compress a file"</p>
            <p className="text-sm">There are mathematical limits. Once data is random or already compressed, further compression is minimal.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">"Compression is only for techies"</p>
            <p className="text-sm">Everyone benefits from compression, whether you realize it or not!</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">"Compression is unsafe"</p>
            <p className="text-sm">Compression is a mature, safe technology used everywhere. Just keep backups of important files before using lossy methods.</p>
          </div>
        </div>
      </Section>

      <Section icon={BookOpen} title="Glossary of Terms">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <span className="font-medium text-gray-900">Algorithm:</span>
            <span className="text-sm"> A set of rules for solving a problem—in this case, reducing file size.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Codec:</span>
            <span className="text-sm"> Software or hardware that compresses and decompresses digital data.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Entropy:</span>
            <span className="text-sm"> A measure of randomness or unpredictability in data.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Lossless:</span>
            <span className="text-sm"> Compression that allows perfect reconstruction of the original file.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Lossy:</span>
            <span className="text-sm"> Compression that discards some data for higher compression ratios.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Archive:</span>
            <span className="text-sm"> A file that contains one or more files, often compressed (e.g., ZIP, TAR).</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Bitrate:</span>
            <span className="text-sm"> The amount of data processed per second in audio/video files.</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Quantization:</span>
            <span className="text-sm"> The process of mapping input values to a smaller set, used in lossy compression.</span>
          </div>
        </div>
      </Section>

      <Section icon={HelpCircle} title="Frequently Asked Questions">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Will compressing my files delete anything?</h3>
            <p className="text-sm">Lossless compression will not delete any data. Lossy compression may discard some information, but usually in a way that's not noticeable. Always keep a backup of important files.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Can I compress a file multiple times?</h3>
            <p className="text-sm">You can, but repeated lossy compression can degrade quality. Lossless compression is safe to repeat.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Why didn't my file get much smaller?</h3>
            <p className="text-sm">Some files are already compressed or contain random data, so further compression is limited.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Is file compression secure?</h3>
            <p className="text-sm">Compression itself is not encryption. For sensitive files, use encryption in addition to compression.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">What is the best format for compressing images?</h3>
            <p className="text-sm">For photos, JPEG is usually best for lossy, PNG for lossless. For web, consider WebP for a good balance.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Can I compress videos?</h3>
            <p className="text-sm">Yes! Video codecs like H.264, H.265, and VP9 are designed for high compression with good quality.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Does compression affect SEO?</h3>
            <p className="text-sm">Yes—smaller images and files mean faster websites, which Google and users love.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How does SlimFile protect my privacy?</h3>
            <p className="text-sm">SlimFile deletes your files after processing and never stores them longer than necessary. We use secure protocols and never share your data.</p>
          </div>
        </div>
      </Section>

      <Section icon={BookOpen} title="Further Reading & Resources">
        <div className="space-y-2">
          <a href="https://en.wikipedia.org/wiki/Data_compression"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-start text-blue-600 hover:underline text-sm group">
            <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Wikipedia: Data Compression</span>
          </a>
          <a href="https://www.howtogeek.com/116461/htg-explains-what-is-data-compression/"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-start text-blue-600 hover:underline text-sm group">
            <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>How-To Geek: What is Data Compression?</span>
          </a>
          <a href="https://www.smashingmagazine.com/2015/09/image-optimization/"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-start text-blue-600 hover:underline text-sm group">
            <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Smashing Magazine: Image Optimization</span>
          </a>
          <a href="https://developers.google.com/speed/webp"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-start text-blue-600 hover:underline text-sm group">
            <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Google Developers: WebP</span>
          </a>
          <a href="https://www.youtube.com/watch?v=OtDxDvCpPL4"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-start text-blue-600 hover:underline text-sm group">
            <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>YouTube: How ZIP Files Work</span>
          </a>
        </div>
      </Section>

      <Section icon={Zap} title="How SlimFile Helps">
        <p>
          SlimFile makes file compression easy, fast, and secure. Our platform supports both images and PDFs, uses advanced algorithms, and never stores your files longer than necessary. Whether you're saving space, sharing documents, or optimizing your website, SlimFile is here to help.
        </p>
      </Section>

      {/* CTA */}
      <div className="bg-blue-600 rounded-lg px-8 py-10 text-center text-white mt-12">
        <h2 className="text-2xl font-normal mb-3">Ready to Get Started?</h2>
        <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
          If you have questions about file compression or want to see how it can help your workflow, we're happy to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/compress"
             className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded font-medium hover:bg-gray-50 transition-colors">
            Try Compression
          </a>
          <a href="/contact"
             className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded font-medium hover:bg-blue-700 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default FileCompressionEducation;
