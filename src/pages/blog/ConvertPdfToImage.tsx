import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  ChevronRight,
  Info,
  Target,
  Star,
  Check,
  Layers,
  RefreshCw,
  Monitor,
  Smartphone,
  Share2,
  Presentation,
  Instagram
} from "lucide-react";

export default function BlogConvertPdfToImage() {
  useSEO({
    title: 'How to Convert PDF to Image (JPG/PNG) Free 2025 | SlimFile Blog',
    description: 'Extract PDF pages as high-quality JPG or PNG images. Perfect for social media, presentations, and sharing PDF content as photos.',
    canonical: 'https://slim-file.com/blog/convert-pdf-to-image',
  });
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-teal-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 mb-4 sm:mb-0 sm:mr-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert PDF to Image (JPG/PNG): Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Extract pages from PDF as high-quality images. Perfect for social media, presentations, 
              and sharing document content without requiring PDF readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert PDF to Image Now
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
              Updated for 2025 • High-Quality Output • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">300 DPI</div>
              <div className="text-xs sm:text-sm text-gray-600">Max Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">JPG/PNG</div>
              <div className="text-xs sm:text-sm text-gray-600">Output Formats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">&lt;5s</div>
              <div className="text-xs sm:text-sm text-gray-600">Per Page</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Free & Secure</div>
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
                Why Convert PDF to Image?
              </a>
              <a href="#jpg-vs-png" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                JPG vs PNG: Which to Choose
              </a>
              <a href="#step-by-step" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#use-cases" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Common Use Cases
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
              Why Convert PDF to Image?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              Converting PDF pages to images makes your content more versatile and shareable. Images can be 
              easily posted on social media, embedded in websites, or used in presentations without requiring 
              recipients to have PDF viewing software.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Easy Sharing</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Share document content on social media, messaging apps, or email without attachment hassles.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Presentation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Presentations</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Insert PDF pages as images in PowerPoint, Keynote, or Google Slides with ease.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Web Display</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Embed document previews on websites without PDF plugins or external viewers.
                </p>
              </div>

              <div className="border border-pink-200 rounded-lg p-4 bg-pink-50">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 mb-2" />
                <h4 className="font-semibold text-pink-900 mb-2 text-sm sm:text-base">Social Media</h4>
                <p className="text-pink-800 text-xs sm:text-sm">
                  Post infographics, reports, or document excerpts directly to Instagram, Twitter, or LinkedIn.
                </p>
              </div>
            </div>

            <h2 id="jpg-vs-png" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              JPG vs PNG: Which Format to Choose
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
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Best For</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Photos, complex images</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Text, graphics, screenshots</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">File Size</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Smaller</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-orange-600">Larger</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Transparency</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-red-600">No</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Yes</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Quality</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Good (lossy)</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Excellent (lossless)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Text Clarity</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Good</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-green-600">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-teal-50 rounded-lg p-4 sm:p-6 mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-teal-900 mb-3">Quick Recommendation</h3>
              <ul className="text-teal-800 space-y-2 text-sm">
                <li className="flex items-start"><Check className="w-5 h-5 text-teal-600 mr-2 mt-0.5" /> <strong>Choose JPG</strong> for PDFs with photos, colorful images, or when file size matters</li>
                <li className="flex items-start"><Check className="w-5 h-5 text-teal-600 mr-2 mt-0.5" /> <strong>Choose PNG</strong> for text-heavy documents, diagrams, or when you need maximum clarity</li>
              </ul>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Guide to Convert PDF to Image
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your PDF</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your PDF or click to upload. Multi-page PDFs are supported - each page 
                    will be converted to a separate image file.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-green-500">
                    <p className="text-xs sm:text-sm text-green-800">
                      <strong>Tip:</strong> You can select specific pages to convert instead of the entire document
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Choose Output Format & Quality</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Select JPG or PNG format based on your needs. Choose resolution (72 DPI for web, 
                    150-300 DPI for print) and quality settings.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">JPG or PNG output</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Custom DPI settings</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download Your Images</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click convert and download your images. For multi-page PDFs, you'll get a ZIP file 
                    containing all page images, or you can download them individually.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Note:</strong> Multi-page conversions are packaged as a convenient ZIP download
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Common Use Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Social Media Posts</h3>
                <p className="text-gray-600 text-sm">
                  Share infographics, report summaries, or document excerpts as images on Instagram, LinkedIn, Twitter, or Facebook.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🖼️ Website Previews</h3>
                <p className="text-gray-600 text-sm">
                  Display document thumbnails or previews on your website without embedding PDF viewers.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Presentation Slides</h3>
                <p className="text-gray-600 text-sm">
                  Insert PDF charts, graphs, or pages directly into PowerPoint or Google Slides presentations.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Previews</h3>
                <p className="text-gray-600 text-sm">
                  Send document previews in email body instead of attachments that recipients might not open.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Documentation</h3>
                <p className="text-gray-600 text-sm">
                  Include PDF page screenshots in technical documentation, tutorials, or guides.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🗂️ Archiving</h3>
                <p className="text-gray-600 text-sm">
                  Convert old PDFs to image format for compatibility with image-based archiving systems.
                </p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices for PDF to Image Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Match Resolution to Purpose</h4>
                    <p className="text-gray-600 text-sm">Use 72 DPI for web/screen display, 150 DPI for general print, 300 DPI for high-quality print.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use PNG for Text</h4>
                    <p className="text-gray-600 text-sm">PNG preserves sharp text edges better than JPG, especially for documents with small fonts.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consider File Size</h4>
                    <p className="text-gray-600 text-sm">Higher resolution means larger files. Balance quality with practical file size limits.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Convert Specific Pages</h4>
                    <p className="text-gray-600 text-sm">Only convert the pages you need to save time and storage space.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Name Files Clearly</h4>
                    <p className="text-gray-600 text-sm">Use descriptive names like "report-page-1.png" for easy organization.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Keep Original PDFs</h4>
                    <p className="text-gray-600 text-sm">Always retain your original PDF files as the source of truth.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert multi-page PDFs?</h3>
                <p className="text-gray-600">Yes! Each page becomes a separate image file. You'll receive them in a ZIP archive for easy download.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What resolution should I use?</h3>
                <p className="text-gray-600">For web use, 72-96 DPI is sufficient. For printing, use 150-300 DPI depending on print quality requirements.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will the text still be selectable?</h3>
                <p className="text-gray-600">No, converting to image creates a visual representation. The text becomes part of the image and is not selectable or searchable.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert back from image to PDF?</h3>
                <p className="text-gray-600">Yes, you can convert images back to PDF using our JPG to PDF converter, but the result will be an image-based PDF, not a text-searchable one.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Convert Your PDFs to Images?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Fast, free, and high-quality conversions in seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Image className="w-5 h-5 mr-2" />
                Convert PDF to Image
              </Button>
            </Link>
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Compress PDF
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
              <FileText className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                Convert JPG to PDF
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Transform images into professional PDF documents.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-pdf-to-word" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Convert PDF to Word
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Transform PDFs into editable Word documents.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-png-to-webp" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Convert PNG to WebP
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize images for the web with WebP format.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
