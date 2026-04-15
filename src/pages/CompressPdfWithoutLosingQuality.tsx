import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import {
  Target,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Eye,
  Settings,
  Star,
  AlertTriangle,
  Info,
  FileText,
  Maximize2,
  Palette,
  Type,
  Image,
  BarChart3,
  Award,
  Search,
  Printer,
  Mail,
  Monitor,
  Smartphone,
  Globe,
  Cpu,
  Layers,
  ZoomIn
} from "lucide-react";

export default function CompressPdfWithoutLosingQuality() {
  useSEO({
    title: 'Compress PDF Without Losing Quality — Smart PDF Optimizer | SlimFile',
    description: 'Compress PDF files while preserving text sharpness and image quality. SlimFile\'s smart optimizer reduces size without visible degradation.',
    canonical: 'https://slim-file.com/compress-pdf-without-losing-quality',
  });
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mr-4">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
              <Eye className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PDF Without Losing Quality - Professional Grade
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced compression technology that preserves perfect document quality while achieving significant size reduction.
            Ideal for legal documents, presentations, and professional materials where quality is paramount.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Compress with Quality
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Quality Guaranteed • Professional Results • Secure
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Clock className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">3-6s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">70%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Quality Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quality-First Compression Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced algorithms prioritize quality preservation while achieving maximum compression efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Type className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Text Sharpness</h3>
              <p className="text-gray-600">
                Maintains crystal-clear text at any zoom level with preserved font embedding and perfect character rendering.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Color Accuracy</h3>
              <p className="text-gray-600">
                Preserves exact colors, gradients, and visual elements with professional-grade color management.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Image Quality</h3>
              <p className="text-gray-600">
                Optimizes images intelligently while maintaining visual clarity and detail appropriate for document use.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vector Graphics</h3>
              <p className="text-gray-600">
                Preserves vector elements like logos, diagrams, and illustrations with perfect scalability and sharpness.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <ZoomIn className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Zoom Fidelity</h3>
              <p className="text-gray-600">
                Ensures documents look perfect at any magnification level, maintaining professional presentation quality.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Processing</h3>
              <p className="text-gray-600">
                AI-powered analysis identifies optimal compression strategies for each document element and content type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quality vs Compression Balance
            </h2>
            <p className="text-lg text-gray-600">
              See how our quality-focused approach compares to standard compression methods
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-green-900">SlimFile Quality Mode</h3>
              </div>
              <p className="text-green-800 mb-4">
                Optimized for professional documents where quality is paramount. Preserves text sharpness, color accuracy,
                and visual elements while achieving significant size reduction through intelligent optimization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">70%</div>
                  <div className="text-sm text-green-700">Size Reduction</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">100%</div>
                  <div className="text-sm text-green-700">Quality Retained</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">3-6s</div>
                  <div className="text-sm text-green-700">Processing</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-blue-900">Standard Compression</h3>
              </div>
              <p className="text-blue-800 mb-4">
                Typical compression tools that prioritize maximum size reduction over quality. May cause visible degradation
                in text, images, and overall document appearance, especially noticeable in professional documents.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">90%</div>
                  <div className="text-sm text-blue-700">Size Reduction</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">60-80%</div>
                  <div className="text-sm text-blue-700">Quality Retained</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">1-2s</div>
                  <div className="text-sm text-blue-700">Processing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Professional Documents
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quality-focused compression is essential for documents where visual fidelity and professional appearance matter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Documents</h3>
              <p className="text-gray-600 mb-3">
                Contracts, agreements, and legal papers require perfect text clarity and formatting preservation.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Court documents</li>
                <li>• Legal contracts</li>
                <li>• Agreements</li>
                <li>• Compliance papers</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Presentations</h3>
              <p className="text-gray-600 mb-3">
                Business presentations and slide decks need to maintain visual impact and professional appearance.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Business presentations</li>
                <li>• Sales decks</li>
                <li>• Training materials</li>
                <li>• Conference slides</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing Materials</h3>
              <p className="text-gray-600 mb-3">
                Brochures, catalogs, and marketing collateral must preserve brand colors and visual quality.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product catalogs</li>
                <li>• Marketing brochures</li>
                <li>• Brand materials</li>
                <li>• Advertising content</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Image className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Design Documents</h3>
              <p className="text-gray-600 mb-3">
                Creative portfolios, design mockups, and visual documents require perfect color and image reproduction.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Design portfolios</li>
                <li>• Creative mockups</li>
                <li>• Visual documents</li>
                <li>• Art portfolios</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Printer className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Papers</h3>
              <p className="text-gray-600 mb-3">
                Research papers, thesis documents, and academic materials need to maintain scholarly presentation standards.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Research papers</li>
                <li>• Thesis documents</li>
                <li>• Academic journals</li>
                <li>• Educational materials</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Reports</h3>
              <p className="text-gray-600 mb-3">
                Financial reports, business analysis, and corporate documents require professional quality and accuracy.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Financial reports</li>
                <li>• Business analysis</li>
                <li>• Corporate documents</li>
                <li>• Executive summaries</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Quality Compression Works
            </h2>
            <p className="text-lg text-gray-600">
              Our intelligent algorithms analyze and optimize each document element while preserving quality
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Document Analysis
                </h3>
                <p className="text-gray-600 mb-3">
                  AI-powered analysis identifies text, images, vector graphics, and formatting elements to determine
                  the optimal compression strategy for each component type.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Result:</strong> Tailored compression approach for maximum quality preservation
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Selective Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Text and vector elements are preserved at 100% quality while images are optimized using
                  content-aware algorithms that maintain visual clarity appropriate for document use.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Result:</strong> Maximum size reduction with zero quality degradation
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Quality Validation
                </h3>
                <p className="text-gray-600 mb-3">
                  Final quality check ensures all elements meet professional standards. Documents are validated
                  for text sharpness, color accuracy, and overall visual fidelity before completion.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Result:</strong> Guaranteed quality preservation with every compression
                  </p>
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
              Everything you need to know about quality-focused PDF compression
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does quality-focused compression differ from standard compression?
              </h3>
              <p className="text-gray-600">
                Quality-focused compression uses advanced algorithms that analyze document content and apply different
                compression strategies based on content type. Text and vector graphics are preserved at 100% quality,
                while images are optimized with content-aware algorithms that maintain visual clarity appropriate for professional use.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressed documents look identical to the originals?
              </h3>
              <p className="text-gray-600">
                Yes! Our quality-focused approach ensures that compressed documents are visually identical to the originals.
                Text remains perfectly sharp and selectable, colors stay accurate, and all formatting is preserved.
                The only difference is the significantly smaller file size.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What types of documents benefit most from quality compression?
              </h3>
              <p className="text-gray-600">
                Legal documents, business presentations, marketing materials, academic papers, and any professional documents
                where visual quality and professional appearance are critical. Perfect for documents that will be viewed,
                printed, or presented to clients and stakeholders.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is quality compression slower than standard compression?
              </h3>
              <p className="text-gray-600">
                Quality compression takes slightly longer (3-6 seconds vs 1-2 seconds) because it performs detailed analysis
                and applies sophisticated optimization algorithms. However, the additional time ensures perfect quality preservation
                and is worth it for professional documents where quality matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Compress PDFs Without Quality Loss?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join professionals worldwide who trust SlimFile for quality-focused PDF compression
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Target className="w-5 h-5 mr-2" />
                Compress with Quality
              </Button>
            </Link>
            <Link to="/blog/compressing-pdf-for-printing-vs-emailing">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Info className="w-5 h-5 mr-2" />
                Compare Methods
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
              More PDF Compression Options
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete range of PDF optimization tools for different needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-pdf-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <HardDrive className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Standard PDF Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Maximum compression for general use with excellent size reduction.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-for-email" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Mail className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Email-Optimized Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Specifically tuned for email attachments with perfect delivery rates.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/compressing-pdf-for-printing-vs-emailing" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Printer className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Print vs Email Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Understanding the difference between compression for printing and email.
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


