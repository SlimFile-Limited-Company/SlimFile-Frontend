import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Presentation,
  Download,
  Upload,
  Zap,
  Shield,
  Play,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Image,
  Video,
  Type,
  Settings,
  Monitor,
  Mail,
  Cloud,
  Target,
  FileText,
  Maximize2,
  Eye,
  Palette,
  Cpu,
  BarChart3,
  Award,
  Smartphone,
  Globe,
  Info,
  Star
} from "lucide-react";

export default function CompressPptxOnline() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mr-4">
              <Presentation className="w-10 h-10 text-orange-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100">
              <Zap className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PPTX Online - Free & Professional
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize PowerPoint presentations instantly. Reduce file sizes by up to 95% while maintaining
            perfect slide quality, animations, and formatting for seamless presentations.
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
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">3-8s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">500K+</div>
              <div className="text-sm text-gray-600">Presentations Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SlimFile for PPTX Compression?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized PowerPoint optimization that preserves every aspect of your presentation while dramatically reducing file size
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Process presentations in 3-8 seconds with our optimized compression algorithms.
                No waiting, no queues, instant results.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Client-side processing ensures your presentations never leave your device.
                Enterprise-grade security for sensitive business content.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Preserved</h3>
              <p className="text-gray-600">
                Maintain perfect slide quality, animations, transitions, and formatting.
                Every element optimized without visible quality loss.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Animation Support</h3>
              <p className="text-gray-600">
                Full support for PowerPoint animations, transitions, and embedded media.
                Interactive elements remain fully functional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Maximize2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Batch Processing</h3>
              <p className="text-gray-600">
                Compress multiple presentations simultaneously. Perfect for design agencies
                and corporate presentation teams.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Preview</h3>
              <p className="text-gray-600">
                Preview compressed presentations before downloading. Ensure all slides,
                animations, and media display correctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How PPTX Compression Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How PPTX Compression Works
            </h2>
            <p className="text-lg text-gray-600">
              Our intelligent compression technology analyzes and optimizes every component of your PowerPoint presentation
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4 md:mb-0 md:mr-6">
                <Image className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Image Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Identifies and optimizes all embedded images while maintaining visual quality appropriate for slide display.
                  Compresses background images, logos, charts, and photos without affecting slide clarity.
                </p>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-orange-800">
                    <strong>Typical savings:</strong> 50-80% reduction in image-heavy presentations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 md:mb-0 md:mr-6">
                <Video className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Media Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Optimizes embedded videos, audio files, and animations. Reduces bitrate and resolution
                  while maintaining smooth playback and audio quality for presentation use.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Typical savings:</strong> 60-90% reduction in media-heavy presentations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 md:mb-0 md:mr-6">
                <Type className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Text & Vector Graphics
                </h3>
                <p className="text-gray-600 mb-3">
                  Preserves text sharpness and vector graphics quality while removing unnecessary formatting data.
                  Maintains font embedding and ensures perfect text rendering at any zoom level.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Result:</strong> Crystal clear text and graphics with minimal file size impact
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Metadata & Structure Cleanup
                </h3>
                <p className="text-gray-600 mb-3">
                  Removes redundant slide thumbnails, unused master slides, and unnecessary metadata
                  while preserving all presentation functionality and structure.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Typical savings:</strong> 10-25% additional reduction from cleanup optimization
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
              Perfect For Every Presentation Scenario
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From corporate meetings to academic lectures, optimize your PowerPoint presentations for any situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Mail className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Sharing</h3>
              <p className="text-gray-600 mb-3">
                Share presentations via email without worrying about attachment size limits or failed deliveries.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Avoid email rejections</li>
                <li>• Faster sending & receiving</li>
                <li>• Professional delivery</li>
                <li>• No file sharing links needed</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Live Presentations</h3>
              <p className="text-gray-600 mb-3">
                Ensure smooth performance during live presentations with optimized file loading and transitions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smooth slide transitions</li>
                <li>• Fast loading times</li>
                <li>• Reliable playback</li>
                <li>• Professional performance</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Cloud className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cloud Storage</h3>
              <p className="text-gray-600 mb-3">
                Maximize cloud storage efficiency and improve sync performance across all devices.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Google Drive optimization</li>
                <li>• OneDrive efficiency</li>
                <li>• Dropbox management</li>
                <li>• Faster collaboration</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Web Embedding</h3>
              <p className="text-gray-600 mb-3">
                Embed presentations on websites and online platforms with faster loading and better performance.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Website performance</li>
                <li>• SEO improvement</li>
                <li>• User engagement</li>
                <li>• Mobile compatibility</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Sharing</h3>
              <p className="text-gray-600 mb-3">
                Share presentations on mobile devices and tablets without data overages or slow loading.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WhatsApp sharing</li>
                <li>• Mobile presentations</li>
                <li>• Tablet compatibility</li>
                <li>• Remote work efficiency</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Training</h3>
              <p className="text-gray-600 mb-3">
                Distribute training materials and educational content efficiently across organizations.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Training materials</li>
                <li>• Educational content</li>
                <li>• Corporate communications</li>
                <li>• Knowledge sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Professional-grade PowerPoint compression with comprehensive format support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">PowerPoint Presentations</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">PPTX Files</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">PPT Files</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Templates & Themes</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Embedded Media</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Processing Speed</span>
                  <span className="font-bold text-green-600">3-8 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Reduction</span>
                  <span className="font-bold text-blue-600">60-95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quality Retention</span>
                  <span className="font-bold text-purple-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Animation Support</span>
                  <span className="font-bold text-orange-600">Full</span>
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
              Everything you need to know about PowerPoint presentation compression
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressing my PowerPoint affect animations and transitions?
              </h3>
              <p className="text-gray-600">
                No! Our compression technology preserves all animations, slide transitions, embedded videos,
                and interactive elements. Your presentation will look and function exactly the same after compression.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What types of PowerPoint files can be compressed?
              </h3>
              <p className="text-gray-600">
                We support all PowerPoint formats including PPTX, PPT, and presentation templates.
                All embedded media, charts, tables, and formatting are preserved during compression.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I compress multiple presentations at once?
              </h3>
              <p className="text-gray-600">
                Yes! Our batch processing feature allows you to compress multiple PowerPoint files simultaneously.
                Perfect for design agencies, corporate teams, and educational institutions.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my presentation data secure during compression?
              </h3>
              <p className="text-gray-600">
                Absolutely secure. All processing happens locally in your browser using client-side technology.
                Your presentations never leave your device or touch our servers, ensuring complete privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your PowerPoint Presentations?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who trust SlimFile for high-quality PowerPoint compression
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Compress PPTX Now
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
              Related Presentation Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of presentation and document optimization tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-pptx-for-presentation" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Monitor className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                Compress for Presentation
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize PowerPoint presentations specifically for live presentation delivery.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/compress-pptx-presentations-without-losing-quality" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Compress Without Losing Quality
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Advanced techniques for maximum compression while maintaining presentation quality.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Image Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize images within presentations and other document types.
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


