import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import {
  Image,
  Zap,
  Download,
  Upload,
  Shield,
  CheckCircle,
  Clock,
  ChevronRight,
  Info,
  Target,
  Globe,
  Star,
  Check,
  Layers,
  RefreshCw,
  Monitor,
  Smartphone,
  Gauge,
  TrendingDown
} from "lucide-react";

export default function BlogConvertPngToWebp() {
  useSEO({
    title: 'How to Convert PNG to WebP Free 2025 | SlimFile Blog',
    description: 'Reduce image file sizes by up to 30% by converting PNG to WebP. Faster websites, better Core Web Vitals, same visual quality.',
    canonical: 'https://slim-file.com/blog/convert-png-to-webp',
  });
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 mb-4 sm:mb-0 sm:mr-4">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-100">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert PNG to WebP: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Reduce image file sizes by up to 30% while maintaining quality. Learn how to convert PNG to WebP 
              format for faster websites and better performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert PNG to WebP Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Compress Images
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Web Performance Guide • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">30%</div>
              <div className="text-xs sm:text-sm text-gray-600">Smaller File Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">97%</div>
              <div className="text-xs sm:text-sm text-gray-600">Browser Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Quality Preserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">&lt;3s</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="#what-is-webp" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                What is WebP Format?
              </a>
              <a href="#why-convert" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert PNG to WebP?
              </a>
              <a href="#step-by-step" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#browser-support" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Browser Compatibility
              </a>
              <a href="#best-practices" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#faq" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <h2 id="what-is-webp" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mr-3" />
              What is WebP Format?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              WebP is a modern image format developed by Google that provides superior compression for images 
              on the web. It supports both lossy and lossless compression, as well as transparency (alpha channel) 
              and animation - making it a versatile replacement for PNG, JPEG, and GIF.
            </p>

            <div className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-3">WebP Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-800 text-sm">26% smaller than PNG (lossless)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-800 text-sm">25-34% smaller than JPEG (lossy)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-800 text-sm">Supports transparency</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-800 text-sm">Animation support</span>
                </div>
              </div>
            </div>

            <h2 id="why-convert" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Why Convert PNG to WebP?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Faster Page Load</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Smaller images mean faster loading websites, improving user experience and SEO rankings.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Reduced Bandwidth</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Save on hosting costs and serve more users with lower bandwidth consumption.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Quality Retention</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  WebP maintains excellent visual quality even with significant file size reduction.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">SEO Benefits</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Google prioritizes fast-loading sites, and using WebP images improves Core Web Vitals scores.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mr-3" />
              Step-by-Step Guide to Convert PNG to WebP
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your PNG Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your PNG file or click to browse. Our tool accepts PNG images of any size 
                    and automatically preserves transparency.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                    <p className="text-xs sm:text-sm text-purple-800">
                      <strong>Tip:</strong> Upload multiple PNGs for batch conversion
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Choose Quality Settings</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Select lossless conversion for pixel-perfect quality or adjust the lossy quality slider 
                    to balance file size and visual quality. For most web use, 80-90% quality is ideal.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Lossless option available</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Transparency preserved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download WebP Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click convert and download your optimized WebP image. Compare the file sizes to see 
                    how much space you've saved!
                  </p>
                  <div className="bg-pink-50 rounded-lg p-3 border-l-4 border-pink-500">
                    <p className="text-xs sm:text-sm text-pink-800">
                      <strong>Result:</strong> Most PNG images shrink by 25-30% when converted to WebP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="browser-support" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Monitor className="w-8 h-8 text-blue-500 mr-3" />
              Browser Compatibility
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              WebP is now supported by all major browsers. As of 2025, over 97% of users can view WebP images natively.
            </p>

            <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
              <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Browser</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">WebP Support</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Since Version</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Chrome</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">✓ Full Support</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Chrome 32+</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Firefox</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">✓ Full Support</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Firefox 65+</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Safari</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">✓ Full Support</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Safari 14+</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Edge</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">✓ Full Support</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Edge 18+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Best Practices for WebP Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Keep Original Files</h4>
                    <p className="text-gray-600 text-sm">Always keep your original PNG files as backups before converting.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use Lossless for Icons</h4>
                    <p className="text-gray-600 text-sm">For logos and icons with sharp edges, use lossless WebP conversion.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Provide Fallbacks</h4>
                    <p className="text-gray-600 text-sm">Use the picture element with PNG fallback for older browsers.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Test Quality Levels</h4>
                    <p className="text-gray-600 text-sm">Experiment with quality settings to find the best balance for your images.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Batch Convert</h4>
                    <p className="text-gray-600 text-sm">Use batch conversion for entire image directories to save time.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Check Transparency</h4>
                    <p className="text-gray-600 text-sm">Verify that transparent areas are preserved correctly after conversion.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Does WebP support transparency like PNG?</h3>
                <p className="text-gray-600">Yes! WebP fully supports alpha channel transparency, making it a perfect replacement for PNG images with transparent backgrounds.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much smaller will my WebP file be?</h3>
                <p className="text-gray-600">Typically, WebP images are 25-35% smaller than equivalent PNG files with lossless compression, and even smaller with lossy compression.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert WebP back to PNG?</h3>
                <p className="text-gray-600">Yes, you can convert WebP images back to PNG format using our converter. However, if lossy compression was used, the original quality cannot be recovered.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Should I use WebP for all images on my website?</h3>
                <p className="text-gray-600">For web use, WebP is generally the best choice due to smaller file sizes. However, for print or when maximum compatibility is needed, PNG may still be preferred.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Images?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Convert PNG to WebP and speed up your website today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Image className="w-5 h-5 mr-2" />
                Convert to WebP
              </Button>
            </Link>
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Compress Images
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/blog/convert-jpg-to-pdf" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                Convert JPG to PDF
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Transform your JPG images into professional PDF documents.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-pdf-to-image" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Convert PDF to Image
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Extract images from PDF or convert PDF pages to JPG/PNG.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/best-tools-to-compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Best Image Compression Tools
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Discover the best tools for compressing images online.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
