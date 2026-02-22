import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Image,
  FileText,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  ChevronRight,
  ArrowRight,
  Info,
  Target,
  Smartphone,
  Globe,
  Star,
  Check,
  Settings,
  Layers,
  RefreshCw,
  Monitor,
  Printer,
  Mail
} from "lucide-react";

export default function BlogConvertJpgToPdf() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 mb-4 sm:mb-0 sm:mr-4">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert JPG to PDF: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Transform your JPG images into professional PDF documents instantly. Perfect for presentations, 
              portfolios, and document archiving with our free online converter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert JPG to PDF Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Compress Files
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Free Online Tool • No Registration Required
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">5M+</div>
              <div className="text-xs sm:text-sm text-gray-600">Images Converted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">&lt;5s</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Privacy Protected</div>
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
              <a href="#why-convert" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert JPG to PDF?
              </a>
              <a href="#step-by-step" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#use-cases" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Common Use Cases
              </a>
              <a href="#best-practices" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#batch-conversion" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Batch Conversion
              </a>
              <a href="#faq" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
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
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mr-3" />
              Why Convert JPG to PDF?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              Converting JPG images to PDF format offers numerous advantages for both personal and professional use.
              PDF documents are universally compatible, maintain consistent formatting across all devices, and 
              provide a professional appearance for sharing and printing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Universal Compatibility</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  PDFs can be opened on any device without specialized software, ensuring your images are accessible everywhere.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Print-Ready Format</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  PDFs maintain exact dimensions and quality, making them perfect for professional printing.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Combine Multiple Images</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Merge multiple JPG files into a single PDF document for easy organization and sharing.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Professional Sharing</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  PDFs look more professional in emails and are the standard format for business documents.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Guide to Convert JPG to PDF
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your JPG Image</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click the upload button or drag and drop your JPG file into the converter. You can upload 
                    single images or multiple files for batch conversion.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-orange-500">
                    <p className="text-xs sm:text-sm text-orange-800">
                      <strong>Supported formats:</strong> JPG, JPEG, PNG, WebP - all can be converted to PDF
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Choose PDF Settings</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Select your preferred page size (A4, Letter, etc.), orientation (portrait or landscape), 
                    and margin settings. Our tool automatically optimizes for the best quality.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Auto page sizing</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Quality preservation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Convert and Download</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click "Convert" and wait a few seconds for the process to complete. Your PDF will be 
                    ready for download instantly. All processing happens in your browser for maximum privacy.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Privacy First:</strong> Your files never leave your device - all conversion happens locally
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Globe className="w-8 h-8 text-purple-500 mr-3" />
              Common Use Cases for JPG to PDF Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Document Scanning</h3>
                <p className="text-gray-600 text-sm">
                  Convert scanned receipts, contracts, and documents from JPG to PDF for professional archiving and sharing.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎨 Portfolio Creation</h3>
                <p className="text-gray-600 text-sm">
                  Combine multiple artwork images or photographs into a single PDF portfolio for clients or applications.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Attachments</h3>
                <p className="text-gray-600 text-sm">
                  Convert images to PDF for more professional email attachments that are easier to print and archive.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 ID Documents</h3>
                <p className="text-gray-600 text-sm">
                  Convert photos of ID cards, passports, or licenses to PDF for official document submissions.
                </p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Best Practices for JPG to PDF Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use High-Resolution Images</h4>
                    <p className="text-gray-600 text-sm">Start with the highest quality JPG for best PDF output, especially for printing.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Choose Correct Orientation</h4>
                    <p className="text-gray-600 text-sm">Match the PDF orientation to your image aspect ratio for optimal display.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consider File Size</h4>
                    <p className="text-gray-600 text-sm">For email sharing, use compression after conversion to reduce the final PDF size.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Organize Before Converting</h4>
                    <p className="text-gray-600 text-sm">When combining multiple images, arrange them in the desired order first.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Name Files Descriptively</h4>
                    <p className="text-gray-600 text-sm">Use clear, descriptive file names for your converted PDFs for easy identification.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Test Print Quality</h4>
                    <p className="text-gray-600 text-sm">For important documents, do a test print to verify quality before final use.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="batch-conversion" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Layers className="w-8 h-8 text-indigo-500 mr-3" />
              Batch Conversion: Multiple JPGs to PDF
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Need to convert multiple JPG images at once? SlimFile supports batch conversion, allowing you to 
              combine multiple images into a single PDF document or convert them as separate PDFs.
            </p>

            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Batch Conversion Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-indigo-800">Upload unlimited images at once</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-indigo-800">Drag and drop reordering</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-indigo-800">Single merged PDF output</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-indigo-800">Individual PDF per image option</span>
                </div>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is JPG to PDF conversion free?</h3>
                <p className="text-gray-600">Yes, SlimFile offers completely free JPG to PDF conversion with no file limits, watermarks, or registration required.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will my images lose quality during conversion?</h3>
                <p className="text-gray-600">No, our converter preserves the original image quality. The PDF will contain your JPG at its original resolution.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert JPG to PDF on my phone?</h3>
                <p className="text-gray-600">Yes! SlimFile works on all devices including iOS and Android phones. Just open our website in your mobile browser.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data safe during conversion?</h3>
                <p className="text-gray-600">Absolutely. All conversion happens directly in your browser - your files never leave your device or get uploaded to any server.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Convert Your JPG to PDF?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Fast, free, and secure - convert your images in seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Image className="w-5 h-5 mr-2" />
                Convert JPG to PDF
              </Button>
            </Link>
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Compress Files
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
              <Image className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Convert PNG to WebP
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize your images for the web with WebP format conversion.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-pdf-to-word" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Convert PDF to Word
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Transform PDF documents into editable Word files easily.
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
