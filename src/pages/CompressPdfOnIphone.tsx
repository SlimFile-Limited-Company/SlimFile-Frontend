import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Wifi,
  Globe,
  Target,
  Maximize2,
  Eye,
  Settings,
  Star,
  AlertTriangle,
  Info,
  Battery,
  Cpu,
  Share2,
  MessageSquare,
  Mail,
  FileText,
  Apple,
  Cloud,
  Image,
  Monitor
} from "lucide-react";

export default function CompressPdfOnIphone() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mr-4">
              <Smartphone className="w-10 h-10 text-pink-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PDF on iPhone - Free & Instant
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize PDF files directly on your iPhone using Safari. No app downloads required - just open SlimFile
            in your browser for instant, secure PDF compression with perfect quality retention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Open in Safari
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              No App Required • Works in Safari • Secure
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Clock className="w-8 h-8 text-pink-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">2-3s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">90%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">800K+</div>
              <div className="text-sm text-gray-600">Mobile Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* iPhone Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Optimized for iPhone & iPad
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specifically designed for iOS devices with hardware acceleration and mobile-optimized compression algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-pink-100 mb-4">
                <Cpu className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hardware Accelerated</h3>
              <p className="text-gray-600">
                Utilizes iPhone's powerful processors for lightning-fast PDF compression using Metal API and hardware acceleration.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Battery className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Battery Efficient</h3>
              <p className="text-gray-600">
                Optimized processing that respects iPhone battery life with short, efficient compression bursts and power management.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Private</h3>
              <p className="text-gray-600">
                All compression happens locally on your device. PDFs never leave your iPhone or touch our servers.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Apple className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Native iOS Experience</h3>
              <p className="text-gray-600">
                Seamless integration with iOS Safari, Files app, and Share menu for a native mobile experience.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Share2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Menu Integration</h3>
              <p className="text-gray-600">
                Compress PDFs directly from the iOS Share menu and save back to Files app instantly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Touch Optimized</h3>
              <p className="text-gray-600">
                Large touch targets and intuitive gestures designed specifically for iPhone and iPad touch interfaces.
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
              How to Compress PDFs on iPhone
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to optimize your PDF files using Safari on your iPhone or iPad
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Open SlimFile in Safari
                </h3>
                <p className="text-gray-600 mb-3">
                  Launch Safari on your iPhone or iPad and navigate to SlimFile. No app download required -
                  everything works directly in your browser using advanced web technologies.
                </p>
                <div className="bg-pink-50 rounded-lg p-3">
                  <p className="text-sm text-pink-800">
                    <strong>Pro tip:</strong> Add SlimFile to your home screen for quick access
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Upload Your PDF
                </h3>
                <p className="text-gray-600 mb-3">
                  Use the upload button or drag and drop your PDF file. The compression process starts automatically
                  and runs entirely on your device using client-side processing for maximum security.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Pro tip:</strong> Use the Share menu to compress PDFs directly from Files app
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Save & Share
                </h3>
                <p className="text-gray-600 mb-3">
                  Download your compressed PDF and save it back to the Files app. Share instantly via Messages,
                  Mail, or any other iOS app without worrying about file size limits.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Pro tip:</strong> Compressed PDFs maintain all formatting and quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Mobile Workflows
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compress PDFs on-the-go for business, education, and personal use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Messages & WhatsApp</h3>
              <p className="text-gray-600 mb-3">
                Share PDFs in iMessage, WhatsApp, and other messaging apps without hitting file size limits.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Quick document sharing</li>
                <li>• Group conversations</li>
                <li>• Business chat apps</li>
                <li>• No compression quality loss</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Mail className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Attachments</h3>
              <p className="text-gray-600 mb-3">
                Send PDF attachments via Mail app without worrying about attachment size restrictions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Avoid email bounces</li>
                <li>• Faster sending</li>
                <li>• Professional delivery</li>
                <li>• Mobile email clients</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Cloud className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cloud Storage</h3>
              <p className="text-gray-600 mb-3">
                Save space in iCloud Drive, Dropbox, and Google Drive with optimized PDF files.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• iCloud optimization</li>
                <li>• Dropbox efficiency</li>
                <li>• Google Drive sync</li>
                <li>• Faster uploads</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Documents</h3>
              <p className="text-gray-600 mb-3">
                Share contracts, reports, invoices, and presentations with clients and colleagues.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Client proposals</li>
                <li>• Business reports</li>
                <li>• Legal documents</li>
                <li>• Meeting materials</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Image className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos & Scans</h3>
              <p className="text-gray-600 mb-3">
                Compress scanned documents and photo PDFs without losing visual clarity or readability.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Document scans</li>
                <li>• Photo collections</li>
                <li>• Receipt archives</li>
                <li>• Visual documents</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Travel & Remote Work</h3>
              <p className="text-gray-600 mb-3">
                Share documents while traveling or working remotely with reliable mobile compression.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Travel documents</li>
                <li>• Remote work files</li>
                <li>• Mobile presentations</li>
                <li>• Field reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              iPhone & iPad Compatibility
            </h2>
            <p className="text-lg text-gray-600">
              Works seamlessly across all iOS devices with optimized performance for each model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Devices</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">iPhone Models</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">iPad Models</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Safari Browser</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">iOS 12+</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Hardware Acceleration</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Processing Speed</span>
                  <span className="font-bold text-green-600">2-3 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Reduction</span>
                  <span className="font-bold text-blue-600">60-90%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quality Retention</span>
                  <span className="font-bold text-purple-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Battery Impact</span>
                  <span className="font-bold text-orange-600">Minimal</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Data Usage</span>
                  <span className="font-bold text-red-600">None</span>
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
              Everything you need to know about compressing PDFs on iPhone and iPad
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I need to download an app to compress PDFs on iPhone?
              </h3>
              <p className="text-gray-600">
                No app download required! SlimFile works directly in Safari browser using advanced web technologies.
                Simply open SlimFile in Safari, upload your PDF, and compress it instantly. All processing happens locally on your device.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressing PDFs on mobile affect the quality?
              </h3>
              <p className="text-gray-600">
                No quality loss! Our mobile-optimized compression algorithms maintain perfect document quality while achieving
                significant size reduction. Text remains crystal clear, images stay sharp, and all formatting is preserved.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I compress multiple PDFs at once on iPhone?
              </h3>
              <p className="text-gray-600">
                Yes! You can upload and compress multiple PDF files simultaneously. Each file is processed independently
                to ensure optimal compression results. Perfect for batch processing of documents, reports, or photo collections.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is PDF compression secure on mobile devices?
              </h3>
              <p className="text-gray-600">
                Absolutely secure. All compression processing happens locally on your iPhone using client-side technology.
                Your PDF files never leave your device or connect to external servers, ensuring complete privacy and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Compress PDFs on Your iPhone?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of thousands of iPhone users who trust SlimFile for fast, secure PDF compression
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Smartphone className="w-5 h-5 mr-2" />
                Open in Safari
              </Button>
            </Link>
            <Link to="/blog/reduce-pdf-file-size-on-mobile">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Info className="w-5 h-5 mr-2" />
                Learn More
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
              More Mobile Optimization Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of mobile-friendly compression and optimization tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Compress Images Online
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize images for mobile devices with fast, secure compression.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/reduce-pdf-file-size-on-mobile" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Smartphone className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Mobile File Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Complete guide to optimizing all file types for mobile devices and apps.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                General PDF Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive PDF optimization for all devices and use cases.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


