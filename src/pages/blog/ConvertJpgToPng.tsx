import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Image,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  ChevronRight,
  Info,
  Target,
  Star,
  Check,
  Layers,
  RefreshCw,
  Monitor,
  Palette,
  FileImage
} from "lucide-react";

export default function BlogConvertJpgToPng() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 mb-4 sm:mb-0 sm:mr-4">
                <FileImage className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert JPG to PNG: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Convert JPG images to PNG format for transparency support and lossless quality. 
              Perfect for logos, graphics, and images that need transparent backgrounds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert JPG to PNG Now
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
              Updated for 2025 • Free Tool • Transparency Support
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Lossless Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">Alpha</div>
              <div className="text-xs sm:text-sm text-gray-600">Transparency Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">&lt;3s</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-gray-600">No Registration</div>
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
              <a href="#why-convert" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert JPG to PNG?
              </a>
              <a href="#differences" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                JPG vs PNG Differences
              </a>
              <a href="#step-by-step" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#use-cases" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Use Cases
              </a>
              <a href="#best-practices" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#faq" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
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
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mr-3" />
              Why Convert JPG to PNG?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              While JPG is great for photographs, PNG offers unique advantages that make it the better choice
              for certain types of images. Converting JPG to PNG is essential when you need transparency,
              lossless quality, or sharper text and graphics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Transparency Support</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  PNG supports alpha channel transparency, allowing images to have see-through backgrounds.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Lossless Quality</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  PNG uses lossless compression, preserving every detail without degradation over time.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Sharp Text & Graphics</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  PNG maintains crisp edges for logos, icons, screenshots, and text-heavy images.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Web Compatibility</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  PNG is universally supported by all browsers and image editing software.
                </p>
              </div>
            </div>

            <h2 id="differences" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              JPG vs PNG: Key Differences
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
              <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Feature</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">JPG</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">PNG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Compression</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Lossy</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Lossless</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Transparency</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-red-600">No</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Yes (Alpha)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">File Size</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Smaller</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-orange-600">Larger</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Best For</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Photos</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Graphics, Logos</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Color Depth</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">24-bit</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Up to 48-bit</td>
                  </tr>
                </tbody>
              </table>
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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your JPG Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your JPG/JPEG file or click to browse. Our converter supports high-resolution
                    images and batch uploads for multiple files.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Select PNG Output</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Choose PNG as your output format. The converter will automatically preserve the original
                    dimensions and colors while adding PNG's lossless compression.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download Your PNG</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click convert and download your new PNG image. The file is ready for editing, 
                    web use, or adding transparent backgrounds in image editors.
                  </p>
                </div>
              </div>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              When to Convert JPG to PNG
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎨 Logo Design</h3>
                <p className="text-gray-600 text-sm">
                  Convert logos to PNG for transparent backgrounds that work on any colored surface.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📸 Screenshots</h3>
                <p className="text-gray-600 text-sm">
                  PNG preserves text clarity in screenshots better than JPG compression.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">✏️ Image Editing</h3>
                <p className="text-gray-600 text-sm">
                  Convert to PNG before editing to avoid quality loss from repeated saves.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🖼️ Graphics & Icons</h3>
                <p className="text-gray-600 text-sm">
                  Icons and UI elements look sharper in PNG format with crisp edges.
                </p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Convert to PNG when you need to edit the image multiple times</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Use PNG for images with text, logos, or sharp geometric shapes</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Keep the original JPG as a backup before converting</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Consider WebP for web use if file size is a concern</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will my image quality improve after converting?</h3>
                <p className="text-gray-600">Converting JPG to PNG won't restore quality lost during original JPG compression, but it prevents further degradation.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Why is my PNG file larger than the JPG?</h3>
                <p className="text-gray-600">PNG uses lossless compression, which preserves all data and typically results in larger files than lossy JPG compression.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I add transparency to my converted PNG?</h3>
                <p className="text-gray-600">Yes! Once converted to PNG, you can use image editors like Photoshop or GIMP to remove backgrounds and add transparency.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Convert JPG to PNG?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free, fast, and maintains perfect quality
          </p>
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
            <Link to="/blog/convert-png-to-jpg" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Convert PNG to JPG</h3>
              <p className="text-gray-600 text-sm mb-3">Reduce file size by converting PNG to JPG format.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-png-to-webp" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">Convert PNG to WebP</h3>
              <p className="text-gray-600 text-sm mb-3">Optimize images for the web with WebP format.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-jpg-to-pdf" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">Convert JPG to PDF</h3>
              <p className="text-gray-600 text-sm mb-3">Create PDF documents from your JPG images.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
