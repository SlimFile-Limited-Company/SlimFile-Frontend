import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Upload,
  Zap,
  Shield,
  Smartphone,
  Mail,
  Cloud,
  CheckCircle,
  ArrowRight,
  Info,
  Clock,
  HardDrive,
  Users,
  Star,
  ChevronRight,
  Image,
  Settings,
  Globe,
  Target
} from "lucide-react";

export default function CompressPdfOnline() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mr-4">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <Zap className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PDF Online - Free & Instant
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Reduce PDF file size instantly without compromising quality. Our advanced compression technology
            shrinks documents by up to 90% while preserving text clarity, images, and formatting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Start Compressing Now
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Free • No Registration • Secure
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Clock className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">2-5s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">90%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">2M+</div>
              <div className="text-sm text-gray-600">Files Processed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SlimFile PDF Compression?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced PDF compression technology with enterprise-grade security and lightning-fast processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Process PDFs in 2-5 seconds with our optimized compression algorithms.
                No waiting, no queues, instant results.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Client-side processing ensures your documents never leave your device.
                Enterprise-grade security protocols protect your data.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Preserved</h3>
              <p className="text-gray-600">
                Smart compression maintains text sharpness, image quality, and document structure.
                No visible quality loss guaranteed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Optimized</h3>
              <p className="text-gray-600">
                Perfect for mobile devices. Compress on-the-go and share instantly
                without worrying about file size limits.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Ready</h3>
              <p className="text-gray-600">
                Automatically compress to email-friendly sizes. Avoid attachment rejections
                and ensure reliable delivery.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Cloud className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloud Storage</h3>
              <p className="text-gray-600">
                Save valuable cloud storage space. Reduce costs and improve sync speeds
                across all your devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How PDF Compression Works
            </h2>
            <p className="text-lg text-gray-600">
              Our intelligent compression technology analyzes and optimizes every aspect of your PDF
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <Image className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Image Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Identifies high-resolution images and applies intelligent compression while maintaining visual quality.
                  Supports JPEG, PNG, and other image formats within PDFs.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Typical savings:</strong> 60-80% reduction in image-heavy PDFs
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 md:mb-0 md:mr-6">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Metadata Cleanup
                </h3>
                <p className="text-gray-600 mb-3">
                  Removes unnecessary metadata, thumbnails, bookmarks, and embedded fonts that aren't used.
                  Preserves essential document information and structure.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Typical savings:</strong> 10-30% reduction from metadata optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 md:mb-0 md:mr-6">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Text & Vector Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Optimizes text rendering and vector graphics while maintaining perfect scalability.
                  Ensures text remains crisp at any zoom level.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Result:</strong> Crystal clear text and graphics at all sizes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect For Every Use Case
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From business documents to academic papers, SlimFile handles all your PDF compression needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Mail className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Attachments</h3>
              <p className="text-gray-600 mb-3">
                Stay under email size limits (typically 20-25MB) while ensuring reliable delivery.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Avoid bounced emails</li>
                <li>• Faster sending & receiving</li>
                <li>• Professional presentation</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Upload className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">File Uploads</h3>
              <p className="text-gray-600 mb-3">
                Meet platform requirements for job applications, forms, and document submissions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Job portal submissions</li>
                <li>• Government forms</li>
                <li>• Academic platforms</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Cloud className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cloud Storage</h3>
              <p className="text-gray-600 mb-3">
                Maximize your storage space and improve sync performance across devices.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Google Drive optimization</li>
                <li>• Dropbox efficiency</li>
                <li>• OneDrive management</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Sharing</h3>
              <p className="text-gray-600 mb-3">
                Share documents quickly on mobile networks without data overages.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WhatsApp sharing</li>
                <li>• Mobile uploads</li>
                <li>• Remote work efficiency</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Web Publishing</h3>
              <p className="text-gray-600 mb-3">
                Faster loading times for websites, portfolios, and online documentation.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Website performance</li>
                <li>• SEO improvement</li>
                <li>• User experience</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <HardDrive className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Archive Management</h3>
              <p className="text-gray-600 mb-3">
                Organize and maintain large document collections efficiently.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Digital libraries</li>
                <li>• Backup optimization</li>
                <li>• Long-term storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Built for professionals who demand quality and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">PDF Documents</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Scanned PDFs</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Image-based PDFs</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Text-based PDFs</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Processing Speed</span>
                  <span className="font-bold text-green-600">2-5 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Reduction</span>
                  <span className="font-bold text-blue-600">70-90%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quality Retention</span>
                  <span className="font-bold text-purple-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Security Level</span>
                  <span className="font-bold text-red-600">Enterprise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about PDF compression
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressing my PDF affect the quality?
              </h3>
              <p className="text-gray-600">
                No! Our smart compression technology preserves text clarity and image quality while significantly
                reducing file size. You'll maintain 100% visual fidelity with up to 90% size reduction.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my data secure during compression?
              </h3>
              <p className="text-gray-600">
                Absolutely. All compression happens locally in your browser using client-side processing.
                Your files never leave your device or touch our servers, ensuring complete privacy and security.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What types of PDFs can be compressed?
              </h3>
              <p className="text-gray-600">
                Our tool works with all PDF types including text-based documents, scanned images, presentations,
                forms, and mixed-content files. We optimize each element type using specialized algorithms.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How much can I expect to save in file size?
              </h3>
              <p className="text-gray-600">
                Typical savings range from 50-90% depending on content. Image-heavy PDFs see the most dramatic
                reductions, while text-only documents benefit from metadata cleanup and optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Compress Your PDFs?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of users who trust SlimFile for fast, secure, and high-quality PDF compression
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Compress PDF Now
              </Button>
            </Link>
            <Link to="/api">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Settings className="w-5 h-5 mr-2" />
                API Integration
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Related PDF Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of PDF optimization tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-pdf-for-email" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Mail className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Compress PDF for Email
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize PDFs specifically for email attachments with guaranteed delivery.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-without-losing-quality" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Compress Without Losing Quality
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Maximum compression with zero quality loss using advanced algorithms.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/reduce-pdf-file-size-on-mobile" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Smartphone className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Mobile PDF Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Complete guide to reducing PDF sizes on mobile devices and tablets.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


