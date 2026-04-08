import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Image,
  Download,
  Upload,
  Zap,
  Shield,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Camera,
  Palette,
  Monitor,
  Eye,
  Settings,
  Target,
  Maximize2,
  FileImage,
  Cpu,
  Wifi,
  DollarSign
} from "lucide-react";

export default function CompressImagesOnline() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mr-4">
              <Image className="w-10 h-10 text-purple-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
              <Zap className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress Images Online - Free & Professional
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize JPEG, PNG, WebP, and other image formats instantly. Reduce file sizes by up to 95%
            while maintaining stunning visual quality for web, email, and social media.
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
              <Clock className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">1-3s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">5M+</div>
              <div className="text-sm text-gray-600">Images Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SlimFile Image Compression?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced algorithms deliver maximum compression with minimal quality loss across all image formats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Process images in 1-3 seconds using optimized algorithms. Batch compress multiple images instantly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Client-side processing ensures your images never leave your device. Complete privacy guaranteed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Preserved</h3>
              <p className="text-gray-600">
                Smart compression maintains visual quality while achieving maximum file size reduction.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <FileImage className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multiple Formats</h3>
              <p className="text-gray-600">
                Support for JPEG, PNG, WebP, GIF, and more. Convert between formats for optimal results.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Maximize2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Batch Processing</h3>
              <p className="text-gray-600">
                Compress multiple images simultaneously. Perfect for photographers and content creators.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Preview</h3>
              <p className="text-gray-600">
                See before/after comparison with quality metrics. Make informed decisions about compression levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supported Image Formats
            </h2>
            <p className="text-lg text-gray-600">
              Compress all popular image formats with specialized optimization for each type
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">JPEG/JPG</h3>
                  <p className="text-sm text-gray-600">Lossy compression</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Perfect for photographs and complex images. Up to 90% size reduction while maintaining visual quality.
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Best for:</strong> Photos, web images, social media
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PNG</h3>
                  <p className="text-sm text-gray-600">Lossless compression</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Ideal for graphics, logos, and images with transparency. Maintains perfect quality with smart compression.
              </p>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-800">
                  <strong>Best for:</strong> Logos, graphics, transparent images
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WebP</h3>
                  <p className="text-sm text-gray-600">Modern format</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Next-generation format with superior compression. Up to 35% smaller than JPEG with better quality.
              </p>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-800">
                  <strong>Best for:</strong> Modern web browsers, high-quality images
                </p>
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
              From social media to e-commerce, optimize images for maximum impact and minimum file size
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Website Optimization</h3>
              <p className="text-gray-600 mb-3">
                Improve Core Web Vitals and SEO rankings with faster-loading images.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Faster page load times</li>
                <li>• Better SEO performance</li>
                <li>• Improved user experience</li>
                <li>• Lower bounce rates</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
              <p className="text-gray-600 mb-3">
                Share high-quality images on Instagram, Facebook, Twitter, and LinkedIn.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Instagram posts & stories</li>
                <li>• Facebook image sharing</li>
                <li>• Twitter media uploads</li>
                <li>• LinkedIn profile images</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Camera className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Photography</h3>
              <p className="text-gray-600 mb-3">
                Professional photographers can deliver optimized galleries to clients.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Client gallery delivery</li>
                <li>• Portfolio websites</li>
                <li>• Print preparation</li>
                <li>• Archive management</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <DollarSign className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">E-commerce</h3>
              <p className="text-gray-600 mb-3">
                Optimize product images for faster loading and better conversion rates.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product catalog images</li>
                <li>• Category thumbnails</li>
                <li>• Zoom functionality</li>
                <li>• Mobile shopping</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Wifi className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Marketing</h3>
              <p className="text-gray-600 mb-3">
                Ensure newsletters and promotional emails load quickly and reliably.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Newsletter images</li>
                <li>• Email campaigns</li>
                <li>• Marketing materials</li>
                <li>• Promotional content</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Cpu className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Apps</h3>
              <p className="text-gray-600 mb-3">
                Optimize images for mobile applications and responsive designs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• App store screenshots</li>
                <li>• In-app images</li>
                <li>• Icon optimization</li>
                <li>• Asset management</li>
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
              Professional-grade compression with enterprise-level performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Processing Speed</span>
                  <span className="font-bold text-green-600">1-3 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Reduction</span>
                  <span className="font-bold text-blue-600">70-95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quality Retention</span>
                  <span className="font-bold text-purple-600">95-99%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Batch Processing</span>
                  <span className="font-bold text-orange-600">Unlimited</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Smart Resizing</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Format Conversion</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Metadata Stripping</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Color Optimization</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
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
              Everything you need to know about image compression
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressing images reduce quality?
              </h3>
              <p className="text-gray-600">
                Our smart compression algorithms maintain 95-99% visual quality while achieving 70-95% file size reduction.
                You can preview before/after comparisons to see the exact results before downloading.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What image formats do you support?
              </h3>
              <p className="text-gray-600">
                We support all popular formats including JPEG, PNG, WebP, GIF, BMP, TIFF, and SVG.
                Each format is optimized using specialized algorithms for maximum compression efficiency.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I compress multiple images at once?
              </h3>
              <p className="text-gray-600">
                Yes! Our batch processing feature allows you to compress unlimited images simultaneously.
                Perfect for photographers, designers, and content creators who work with large image collections.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my image data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely secure. All compression happens in your browser using client-side processing.
                Images never leave your device or touch our servers, ensuring complete privacy and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Images?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of users who trust SlimFile for professional image compression and optimization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Compress Images Now
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
              Related Image Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of image optimization tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-images-for-website" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Globe className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Compress Images for Website
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize images specifically for web performance and SEO improvement.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/best-tools-to-compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Best Image Compression Tools
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive guide to the best online image compression tools and techniques.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/how-to-compress-files-for-faster-website-loading" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Faster Website Loading
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Complete guide to optimizing files for maximum website performance.
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


