import React from "react";
import { BookOpen, Zap, Cloud, Lock, Globe, FileText, Image, Video, HelpCircle, TrendingUp, Shield } from "lucide-react";

const Section = ({ icon: Icon, title, children, bg }) => (
  <section className={`rounded-2xl p-8 mb-10 shadow-sm ${bg || "bg-white"}`}>
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-8 h-8 text-primary mr-3" />}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 text-lg leading-relaxed">{children}</div>
  </section>
);

const FileCompressionEducation = () => (
  <div className="min-h-screen pt-16 bg-gray-50">
    {/* Hero Section */}
    <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16 px-4 sm:px-6 lg:px-8 mb-12">
      <div className="container mx-auto max-w-3xl text-center">
        <BookOpen className="mx-auto mb-4 w-14 h-14 text-primary" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">The Complete Guide to File Compression</h1>
        <p className="text-xl text-gray-700 mb-6">
          File compression powers the modern digital world. Learn what it is, how it works, and why it matters for everyone—from everyday users to global businesses.
        </p>
      </div>
    </div>
    <div className="container mx-auto max-w-3xl px-4">
      <Section icon={Zap} title="Why File Compression Matters" bg="bg-white">
        Every time you send a photo, stream a video, or load a website, file compression is working behind the scenes. Without it, the internet would be slower, storage would be more expensive, and sharing digital content would be a headache. Compression makes digital life faster, greener, and more accessible for everyone.
      </Section>
      <Section icon={TrendingUp} title="A Brief History & Timeline" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li><strong>1960s-70s:</strong> Early research into data encoding and redundancy removal.</li>
          <li><strong>1980s:</strong> ARC and ZIP archivers make file sharing and storage practical for home computers.</li>
          <li><strong>1990s:</strong> JPEG and MP3 bring lossy compression to images and music, revolutionizing media.</li>
          <li><strong>2000s:</strong> MP4 and advanced codecs enable streaming video and mobile downloads.</li>
          <li><strong>2010s-present:</strong> Brotli, WebP, and cloud-native formats push efficiency even further.</li>
        </ul>
      </Section>
      <Section icon={FileText} title="The Science of Compression" bg="bg-white">
        <strong>Entropy:</strong> In information theory, entropy measures the unpredictability or randomness of data. The more predictable the data, the more it can be compressed.<br /><br />
        <strong>Finding Redundancy:</strong> Compression algorithms look for patterns, repetition, and structure. For example, the string <code>AAAAAA</code> can be stored as <code>6A</code> (run-length encoding).<br /><br />
        <strong>Popular Algorithms:</strong>
        <ul className="list-disc ml-6">
          <li>Huffman Coding: Assigns shorter codes to more frequent data.</li>
          <li>LZ77/LZW: Builds a dictionary of repeated sequences.</li>
          <li>DEFLATE: Used in ZIP, PNG, and GZIP; combines LZ77 and Huffman.</li>
          <li>Brotli: Modern web compression, used by Google and others.</li>
          <li>JPEG/MP3: Use transform coding and quantization for lossy compression.</li>
        </ul>
      </Section>
      <Section icon={Image} title="Types of Compression" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li><strong>Lossless:</strong> No information is lost. Used for ZIP, PNG, FLAC, GIF, and PDF. The original file can be perfectly reconstructed.</li>
          <li><strong>Lossy:</strong> Some data is discarded for higher compression. Used for JPEG, MP3, MP4, WebP. The result is smaller files, with some quality loss (often imperceptible).</li>
          <li><strong>Hybrid:</strong> Video codecs often combine both approaches for maximum efficiency.</li>
        </ul>
      </Section>
      <Section icon={Cloud} title="Real-World Scenarios & Use Cases" bg="bg-white">
        <ul className="list-disc ml-6">
          <li>Web Browsing: HTTP compression (GZIP, Brotli) makes websites load faster and saves bandwidth.</li>
          <li>Photo Sharing: Social media compresses images to speed up uploads and reduce storage needs.</li>
          <li>Streaming: Netflix, YouTube, and Spotify use advanced codecs to deliver high-quality video and audio with minimal buffering.</li>
          <li>Backups & Archives: Businesses compress data for backups, saving space and money.</li>
          <li>Healthcare & Science: Medical images and scientific data are compressed for storage and analysis.</li>
          <li>Education: Schools and universities compress documents and media to facilitate online learning.</li>
          <li>Mobile & Data Plans: Compression is critical for users on limited data plans or slow connections, making content accessible and affordable.</li>
          <li>Cloud Computing: Cloud providers use compression to optimize storage and reduce costs for both providers and users.</li>
        </ul>
      </Section>
      <Section icon={Globe} title="Environmental & Economic Impact" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li>Energy Savings: Less data means less energy used in data centers and networks.</li>
          <li>Lower Costs: Businesses and individuals save on storage and bandwidth costs.</li>
          <li>Accessibility: Compression makes the web faster and more usable for people worldwide, especially in areas with slow internet.</li>
          <li>Greener Tech: Reducing data transmission helps lower the carbon footprint of the digital world.</li>
        </ul>
      </Section>
      <Section icon={HelpCircle} title="Best Practices for Compression" bg="bg-white">
        <ul className="list-disc ml-6">
          <li>Use <strong>lossless</strong> compression for important documents, code, and anything you need to restore exactly.</li>
          <li>Use <strong>lossy</strong> compression for photos, music, and video where some quality loss is acceptable.</li>
          <li>Always keep a backup of originals before applying lossy compression.</li>
          <li>Choose the right format for your needs (e.g., PNG for graphics, JPEG for photos, PDF for documents).</li>
          <li>Test different settings to find the best balance of size and quality.</li>
        </ul>
      </Section>
      <Section icon={Lock} title="Compression & Privacy/Security" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li>Compression is not encryption. For sensitive files, use encryption in addition to compression.</li>
          <li>SlimFile deletes your files after processing and never stores them longer than necessary.</li>
          <li>Be aware of rare vulnerabilities (e.g., CRIME/BREACH attacks) when combining compression and encryption in web apps.</li>
        </ul>
      </Section>
      <Section icon={Shield} title="Myths & Misconceptions" bg="bg-white">
        <ul className="list-disc ml-6">
          <li><strong>"Compression always reduces quality":</strong> Not true! Lossless compression preserves all data. Lossy compression can be visually or audibly indistinguishable from the original at reasonable settings.</li>
          <li><strong>"You can infinitely compress a file":</strong> There are mathematical limits. Once data is random or already compressed, further compression is minimal.</li>
          <li><strong>"Compression is only for techies":</strong> Everyone benefits from compression, whether you realize it or not!</li>
          <li><strong>"Compression is unsafe":</strong> Compression is a mature, safe technology used everywhere. Just keep backups of important files before using lossy methods.</li>
        </ul>
      </Section>
      <Section icon={BookOpen} title="Glossary of Terms" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li><strong>Algorithm:</strong> A set of rules for solving a problem—in this case, reducing file size.</li>
          <li><strong>Codec:</strong> Software or hardware that compresses and decompresses digital data.</li>
          <li><strong>Entropy:</strong> A measure of randomness or unpredictability in data.</li>
          <li><strong>Lossless:</strong> Compression that allows perfect reconstruction of the original file.</li>
          <li><strong>Lossy:</strong> Compression that discards some data for higher compression ratios.</li>
          <li><strong>Archive:</strong> A file that contains one or more files, often compressed (e.g., ZIP, TAR).</li>
          <li><strong>Bitrate:</strong> The amount of data processed per second in audio/video files.</li>
          <li><strong>Quantization:</strong> The process of mapping input values to a smaller set, used in lossy compression.</li>
        </ul>
      </Section>
      <Section icon={HelpCircle} title="Frequently Asked Questions (FAQ)" bg="bg-white">
        <div className="space-y-4">
          <div>
            <strong>Q: Will compressing my files delete anything?</strong>
            <div>A: Lossless compression will not delete any data. Lossy compression may discard some information, but usually in a way that's not noticeable. Always keep a backup of important files.</div>
          </div>
          <div>
            <strong>Q: Can I compress a file multiple times?</strong>
            <div>A: You can, but repeated lossy compression can degrade quality. Lossless compression is safe to repeat.</div>
          </div>
          <div>
            <strong>Q: Why didn't my file get much smaller?</strong>
            <div>A: Some files are already compressed or contain random data, so further compression is limited.</div>
          </div>
          <div>
            <strong>Q: Is file compression secure?</strong>
            <div>A: Compression itself is not encryption. For sensitive files, use encryption in addition to compression.</div>
          </div>
          <div>
            <strong>Q: What is the best format for compressing images?</strong>
            <div>A: For photos, JPEG is usually best for lossy, PNG for lossless. For web, consider WebP for a good balance.</div>
          </div>
          <div>
            <strong>Q: Can I compress videos?</strong>
            <div>A: Yes! Video codecs like H.264, H.265, and VP9 are designed for high compression with good quality.</div>
          </div>
          <div>
            <strong>Q: Does compression affect SEO?</strong>
            <div>A: Yes—smaller images and files mean faster websites, which Google and users love.</div>
          </div>
          <div>
            <strong>Q: How does SlimFile protect my privacy?</strong>
            <div>A: SlimFile deletes your files after processing and never stores them longer than necessary. We use secure protocols and never share your data.</div>
          </div>
        </div>
      </Section>
      <Section icon={BookOpen} title="Further Reading & Resources" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li><a href="https://en.wikipedia.org/wiki/Data_compression" target="_blank" rel="noopener noreferrer">Wikipedia: Data Compression</a></li>
          <li><a href="https://www.howtogeek.com/116461/htg-explains-what-is-data-compression/" target="_blank" rel="noopener noreferrer">How-To Geek: What is Data Compression?</a></li>
          <li><a href="https://www.smashingmagazine.com/2015/09/image-optimization/" target="_blank" rel="noopener noreferrer">Smashing Magazine: Image Optimization</a></li>
          <li><a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener noreferrer">Google Developers: WebP</a></li>
          <li><a href="https://www.youtube.com/watch?v=OtDxDvCpPL4" target="_blank" rel="noopener noreferrer">YouTube: How ZIP Files Work</a></li>
        </ul>
      </Section>
      <Section icon={Zap} title="How SlimFile Helps" bg="bg-white">
        SlimFile makes file compression easy, fast, and secure. Our platform supports both images and PDFs, uses advanced algorithms, and never stores your files longer than necessary. Whether you’re saving space, sharing documents, or optimizing your website, SlimFile is here to help.
      </Section>
      <Section icon={HelpCircle} title="Learn More" bg="bg-gray-100">
        If you have questions about file compression or want to see how it can help your workflow, <a href="/contact" className="text-primary underline">contact us</a>—we’re happy to help!
      </Section>
    </div>
  </div>
);

export default FileCompressionEducation; 
