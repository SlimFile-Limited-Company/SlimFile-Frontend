import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
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
  RefreshCw,
  Globe,
  Lock,
  Printer,
  Users
} from "lucide-react";

export default function BlogConvertDocxToPdf() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 mb-4 sm:mb-0 sm:mr-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert DOCX to PDF: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Convert Word documents to professional PDF format. Preserve formatting, ensure 
              compatibility, and create documents that look the same on every device.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert DOCX to PDF Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Compress PDF
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Preserves Formatting • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Formatting Preserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">Secure</div>
              <div className="text-xs sm:text-sm text-gray-600">Files Protected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1 sm:mb-2">&lt;5s</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-gray-600">No Watermarks</div>
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
                Why Convert DOCX to PDF?
              </a>
              <a href="#step-by-step" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#benefits" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Benefits of PDF
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
              Why Convert DOCX to PDF?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              PDF (Portable Document Format) is the gold standard for sharing documents. Unlike Word 
              files, PDFs look identical on every device and operating system, can't be accidentally 
              edited, and are universally accepted for business and legal purposes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Universal Compatibility</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  PDFs open correctly on any device, operating system, or browser without MS Office.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Formatting Preserved</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Fonts, images, layouts, and formatting stay exactly as you designed them.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Document Security</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  PDFs can't be accidentally edited and can be password-protected.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Professional Standard</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  PDF is the accepted format for contracts, resumes, reports, and official documents.
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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your Word Document</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your DOCX file or click to browse. We support all Word document 
                    versions including complex documents with images, tables, and custom formatting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Convert Automatically</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Our converter processes your document, preserving all formatting, embedded fonts, 
                    images, headers, footers, and page layouts exactly as they appear in Word.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download Your PDF</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click download to get your professional PDF file. It's ready to share, print, 
                    or upload to any platform.
                  </p>
                </div>
              </div>
            </div>

            <h2 id="benefits" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Benefits of PDF Format
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
              <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Feature</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">DOCX</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Universal Viewing</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-red-600">Requires MS Office</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Any device/browser</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Consistent Layout</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-orange-600">May vary</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Always identical</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Edit Protection</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-red-600">Easily editable</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Protected</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Print Quality</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Good</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Printer className="w-8 h-8 text-blue-500 mr-3" />
              Common Use Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Resumes & CVs</h3>
                <p className="text-gray-600 text-sm">Send professionally formatted resumes that display correctly on any system.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Contracts & Agreements</h3>
                <p className="text-gray-600 text-sm">Share legal documents that can't be accidentally modified.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Reports & Proposals</h3>
                <p className="text-gray-600 text-sm">Present business documents with perfect formatting every time.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Manuals & Guides</h3>
                <p className="text-gray-600 text-sm">Distribute instructional materials that print correctly.</p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Review your Word document before converting to catch any issues</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Use standard fonts for best compatibility (Arial, Times New Roman, Calibri)</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Embed any special fonts in your Word document before converting</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Check the final PDF to ensure all pages converted correctly</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will my formatting be preserved?</h3>
                <p className="text-gray-600">Yes! Our converter maintains all formatting including fonts, images, tables, headers, footers, and page layouts.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What about hyperlinks in my document?</h3>
                <p className="text-gray-600">Hyperlinks are preserved and remain clickable in the PDF output.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert password-protected Word files?</h3>
                <p className="text-gray-600">You'll need to remove the password protection before converting. We don't store or access your passwords.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert DOCX to PDF?</h2>
          <p className="text-xl mb-8 opacity-90">Professional PDFs in seconds</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <FileText className="w-5 h-5 mr-2" />
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
            <Link to="/blog/convert-pdf-to-word" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Convert PDF to Word</h3>
              <p className="text-gray-600 text-sm mb-3">Edit PDF documents in Word format.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-pdf-to-pptx" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">Convert PDF to PowerPoint</h3>
              <p className="text-gray-600 text-sm mb-3">Turn PDFs into editable presentations.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-jpg-to-pdf" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">Convert JPG to PDF</h3>
              <p className="text-gray-600 text-sm mb-3">Create PDFs from images.</p>
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
