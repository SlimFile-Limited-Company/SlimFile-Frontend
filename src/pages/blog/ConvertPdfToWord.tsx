import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Edit,
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
  Type,
  Table,
  Image,
  Layout,
  Lock,
  Unlock
} from "lucide-react";

export default function BlogConvertPdfToWord() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 mb-4 sm:mb-0 sm:mr-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100">
                <Edit className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert PDF to Word (DOCX): Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Transform your PDF documents into editable Word files while preserving formatting. 
              Edit, update, and customize your documents with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert PDF to Word Now
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
              Updated for 2025 • Preserve Formatting • Free Online Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">99%</div>
              <div className="text-xs sm:text-sm text-gray-600">Formatting Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">3M+</div>
              <div className="text-xs sm:text-sm text-gray-600">PDFs Converted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">&lt;10s</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Secure & Private</div>
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
                Why Convert PDF to Word?
              </a>
              <a href="#step-by-step" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#what-preserved" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                What Gets Preserved
              </a>
              <a href="#best-practices" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#troubleshooting" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Troubleshooting
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
              Why Convert PDF to Word?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              PDF files are great for sharing and preserving document formatting, but they're difficult to edit.
              Converting PDF to Word (DOCX) allows you to modify content, update information, and collaborate 
              with others using familiar word processing tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Edit Content Freely</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Modify text, add images, and update information directly in Microsoft Word or Google Docs.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Preserve Formatting</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Our converter maintains fonts, tables, images, and layout for accurate document reproduction.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Type className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Reuse Content</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Extract and repurpose text and images from PDFs for new documents or presentations.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Track Changes</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Use Word's revision features to collaborate and track modifications in your documents.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Guide to Convert PDF to Word
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your PDF</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click the upload button or drag and drop your PDF file. Our tool supports PDFs of all sizes,
                    including multi-page documents and scanned files.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Supported:</strong> Standard PDFs, scanned PDFs (with OCR), password-protected PDFs
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Select Conversion Options</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Choose your preferred output format (DOCX is recommended for best compatibility). 
                    Enable OCR for scanned documents if needed.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">DOCX format output</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">OCR for scanned PDFs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download Your Word Document</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Click convert and wait for the process to complete. Download your editable Word file 
                    and open it in Microsoft Word, Google Docs, or any compatible word processor.
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-3 border-l-4 border-indigo-500">
                    <p className="text-xs sm:text-sm text-indigo-800">
                      <strong>Privacy:</strong> Your files are processed securely and deleted after conversion
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="what-preserved" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Layout className="w-8 h-8 text-purple-500 mr-3" />
              What Gets Preserved in Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <Type className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Text & Fonts</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Font styles and sizes</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Bold, italic, underline</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Text colors</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Paragraphs and spacing</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <Table className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tables & Lists</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Table structure</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Cell formatting</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Bulleted lists</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Numbered lists</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <Image className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Images & Graphics</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Embedded images</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Image positioning</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Charts and diagrams</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Background graphics</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <Layout className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Layout & Structure</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Page margins</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Headers and footers</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Multi-column layouts</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Page breaks</li>
                </ul>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Best Practices for PDF to Word Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use Text-Based PDFs</h4>
                    <p className="text-gray-600 text-sm">Digital PDFs convert better than scanned documents. Use OCR for scans.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Review After Conversion</h4>
                    <p className="text-gray-600 text-sm">Always check the converted document for any formatting issues that need adjustment.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Keep Original PDF</h4>
                    <p className="text-gray-600 text-sm">Always keep your original PDF as a reference and backup.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Check Font Compatibility</h4>
                    <p className="text-gray-600 text-sm">Ensure you have the required fonts installed for accurate display.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use DOCX Format</h4>
                    <p className="text-gray-600 text-sm">DOCX offers better compatibility than older DOC format.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Convert Page by Page</h4>
                    <p className="text-gray-600 text-sm">For complex documents, consider converting specific pages separately.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="troubleshooting" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <RefreshCw className="w-8 h-8 text-red-500 mr-3" />
              Troubleshooting Common Issues
            </h2>

            <div className="space-y-4 mb-8">
              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Text appears as images</h3>
                <p className="text-orange-800 text-sm">This usually means the PDF is a scanned document. Enable OCR (Optical Character Recognition) during conversion to extract editable text.</p>
              </div>

              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Fonts look different</h3>
                <p className="text-orange-800 text-sm">The original fonts may not be installed on your system. Word will substitute similar fonts. Install the original fonts for exact matching.</p>
              </div>

              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Layout is misaligned</h3>
                <p className="text-orange-800 text-sm">Complex layouts with multiple columns or text boxes may need manual adjustment after conversion. This is normal for heavily designed documents.</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Info className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert password-protected PDFs?</h3>
                <p className="text-gray-600">Yes, if you have the password. Enter the password when prompted, and the conversion will proceed normally.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will my formatting be exactly the same?</h3>
                <p className="text-gray-600">We preserve formatting as accurately as possible, but some complex elements may require minor adjustments. Simple documents typically convert perfectly.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I edit the Word document after conversion?</h3>
                <p className="text-gray-600">Absolutely! That's the main benefit. The converted DOCX file is fully editable in Microsoft Word, Google Docs, or any compatible word processor.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a file size limit?</h3>
                <p className="text-gray-600">SlimFile supports PDF files up to 200MB. For larger files, consider splitting them into smaller parts first.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Edit Your PDFs?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Convert PDF to Word in seconds - free and secure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <FileText className="w-5 h-5 mr-2" />
                Convert PDF to Word
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
            <Link to="/blog/convert-pdf-to-image" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Convert PDF to Image
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Extract images or convert PDF pages to JPG/PNG format.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

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

            <Link to="/blog/how-to-compress-pdf-for-email" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Compress PDF for Email
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Reduce PDF file size for easy email attachment sharing.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
