import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Image,
  Download,
  Upload,
  Zap,
  CheckCircle,
  ChevronRight,
  Info,
  Target,
  Star,
  Check,
  RefreshCw,
  TrendingDown,
  Globe,
  Mail,
  FileImage
} from "lucide-react";

export default function BlogConvertPngToJpg() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 mb-4 sm:mb-0 sm:mr-4">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100">
                <FileImage className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert PNG to JPG: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Reduce file sizes by converting PNG to JPG format. Perfect for photos, web images, 
              and when you need smaller files without transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert PNG to JPG Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Compress Images
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Reduce File Size • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">80%</div>
              <div className="text-xs sm:text-sm text-gray-600">Smaller Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">High</div>
              <div className="text-xs sm:text-sm text-gray-600">Quality Output</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1 sm:mb-2">&lt;2s</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-gray-600">No Limits</div>
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
              <a href="#why-convert" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert PNG to JPG?
              </a>
              <a href="#step-by-step" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#quality-settings" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Quality Settings
              </a>
              <a href="#use-cases" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Use Cases
              </a>
              <a href="#best-practices" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#faq" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
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

            <h2 id="why-convert" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              Why Convert PNG to JPG?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              PNG files are often much larger than JPG files due to lossless compression. Converting to JPG 
              can reduce file sizes by 50-80%, making images easier to share, upload, and store while 
              maintaining good visual quality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Smaller File Sizes</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  JPG compression dramatically reduces file sizes, perfect for web use and email.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Universal Compatibility</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  JPG is supported everywhere - all devices, browsers, and platforms.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Faster Loading</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Smaller images load faster on websites and in applications.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Easy Sharing</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Smaller files are easier to email and share on social media.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Conversion Guide
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your PNG Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your PNG file or click to browse. Works with PNGs of any size, including 
                    those with transparent backgrounds.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-orange-500">
                    <p className="text-xs sm:text-sm text-orange-800">
                      <strong>Note:</strong> Transparent areas will be converted to white (or your chosen background color)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Adjust Quality Settings</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Choose your quality level: 90-100% for minimal loss, 70-90% for good balance, 
                    or lower for maximum compression. Preview the result before converting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download Your JPG</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click convert and download your optimized JPG image. Compare file sizes to see 
                    how much space you've saved!
                  </p>
                </div>
              </div>
            </div>

            <h2 id="quality-settings" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Quality Settings Guide
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
              <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Quality</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">File Size</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">90-100%</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Medium reduction</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Photography, printing</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">70-90%</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Good reduction</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Web images, email</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">50-70%</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">High reduction</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Thumbnails, previews</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-8 h-8 text-blue-500 mr-3" />
              Common Use Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🌐 Website Images</h3>
                <p className="text-gray-600 text-sm">Reduce page load times by converting large PNGs to optimized JPGs.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Attachments</h3>
                <p className="text-gray-600 text-sm">Stay under email size limits by converting PNGs to smaller JPGs.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Social Media</h3>
                <p className="text-gray-600 text-sm">Upload images faster to social platforms with smaller file sizes.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💾 Storage Savings</h3>
                <p className="text-gray-600 text-sm">Save disk space by converting PNG photo libraries to JPG.</p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Keep original PNG files as backups before converting</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Don't convert logos or graphics that need transparency</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Use 80-90% quality for the best size/quality balance</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Preview results before downloading to ensure quality meets needs</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens to transparent backgrounds?</h3>
                <p className="text-gray-600">JPG doesn't support transparency, so transparent areas are filled with a solid color (usually white).</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will I lose quality converting PNG to JPG?</h3>
                <p className="text-gray-600">There will be some quality loss due to JPG's lossy compression, but at high quality settings (85%+), it's usually imperceptible.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much smaller will my file be?</h3>
                <p className="text-gray-600">Typically 50-80% smaller depending on the image content and quality settings chosen.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert PNG to JPG?</h2>
          <p className="text-xl mb-8 opacity-90">Reduce file sizes instantly</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Image className="w-5 h-5 mr-2" />
                Convert Now
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
            <Link to="/blog/convert-jpg-to-png" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-amber-500 mb-4 group-hover:text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600">Convert JPG to PNG</h3>
              <p className="text-gray-600 text-sm mb-3">Add transparency support to your images.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-amber-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-png-to-webp" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">Convert PNG to WebP</h3>
              <p className="text-gray-600 text-sm mb-3">Modern format with best compression.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-webp-to-jpg" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">Convert WebP to JPG</h3>
              <p className="text-gray-600 text-sm mb-3">Convert WebP for wider compatibility.</p>
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
