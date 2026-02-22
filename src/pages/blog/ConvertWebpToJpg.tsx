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
  Globe,
  Monitor,
  Share2,
  FileImage
} from "lucide-react";

export default function BlogConvertWebpToJpg() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 mb-4 sm:mb-0 sm:mr-4">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100">
                <FileImage className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert WebP to JPG: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Convert WebP images to widely-compatible JPG format. Perfect for sharing, editing in 
              legacy software, and ensuring universal compatibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert WebP to JPG Now
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
              Updated for 2025 • Universal Compatibility • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">Fast</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1 sm:mb-2">High</div>
              <div className="text-xs sm:text-sm text-gray-600">Quality</div>
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
              <a href="#why-convert" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert WebP to JPG?
              </a>
              <a href="#step-by-step" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#compatibility" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Compatibility Issues
              </a>
              <a href="#use-cases" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Use Cases
              </a>
              <a href="#best-practices" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#faq" className="flex items-center text-green-600 hover:text-green-700 font-medium">
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
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Why Convert WebP to JPG?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              While WebP offers excellent compression, it's not universally supported by all software and 
              platforms. Converting to JPG ensures your images work everywhere - from older photo editors 
              to email clients and social media platforms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Universal Support</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  JPG works with every device, browser, and software application ever made.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Legacy Software</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Older photo editors and applications may not support WebP format.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Easy Sharing</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  JPG is universally accepted for email, messaging, and file sharing.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Image className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Print Services</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Most print services require JPG format for photo printing.
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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your WebP Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your WebP file or click to browse. Our converter handles both lossy 
                    and lossless WebP images, as well as animated WebP files.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Choose Quality Settings</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Select your preferred JPG quality. Higher quality means larger files but better 
                    visual fidelity. 85-95% is recommended for most uses.
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
                    Click convert and download your JPG image. It's now ready to use anywhere!
                  </p>
                </div>
              </div>
            </div>

            <h2 id="compatibility" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Monitor className="w-8 h-8 text-blue-500 mr-3" />
              WebP Compatibility Issues
            </h2>

            <div className="bg-orange-50 rounded-lg p-4 sm:p-6 mb-8">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Software That May Not Support WebP</h3>
              <ul className="text-orange-800 space-y-2 text-sm">
                <li>• Older versions of Adobe Photoshop (before CC 2022)</li>
                <li>• Microsoft Office applications</li>
                <li>• Some email clients and messaging apps</li>
                <li>• Older operating systems and photo viewers</li>
                <li>• Many print-on-demand services</li>
                <li>• Some social media platforms for profile pictures</li>
              </ul>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Common Use Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">✉️ Email Attachments</h3>
                <p className="text-gray-600 text-sm">Convert WebP to JPG before attaching to emails for universal viewing.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🖨️ Printing Photos</h3>
                <p className="text-gray-600 text-sm">Print services typically require JPG format for photo orders.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">✏️ Image Editing</h3>
                <p className="text-gray-600 text-sm">Edit WebP images in software that doesn't support the format.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📤 File Sharing</h3>
                <p className="text-gray-600 text-sm">Share images with people using older devices or software.</p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Keep original WebP files for web use - they're smaller</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Use 90%+ quality for important photos</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Note that transparent WebP backgrounds become white in JPG</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Convert to PNG instead if you need to preserve transparency</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will the image quality be affected?</h3>
                <p className="text-gray-600">There may be slight quality loss due to JPG compression, but at high quality settings it's usually imperceptible.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What about animated WebP files?</h3>
                <p className="text-gray-600">Converting animated WebP to JPG will extract only the first frame. Consider converting to GIF instead for animations.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will the file size increase?</h3>
                <p className="text-gray-600">Often yes, as WebP typically offers better compression than JPG. The file may be 20-50% larger.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert WebP to JPG?</h2>
          <p className="text-xl mb-8 opacity-90">Universal compatibility in seconds</p>
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
            <Link to="/blog/convert-png-to-webp" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">Convert PNG to WebP</h3>
              <p className="text-gray-600 text-sm mb-3">Optimize images with WebP format.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-png-to-jpg" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Convert PNG to JPG</h3>
              <p className="text-gray-600 text-sm mb-3">Reduce PNG file sizes with JPG.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-jpg-to-png" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-amber-500 mb-4 group-hover:text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600">Convert JPG to PNG</h3>
              <p className="text-gray-600 text-sm mb-3">Add transparency support to images.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-amber-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
