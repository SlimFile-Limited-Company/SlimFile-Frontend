import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Mail,
  FileText,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Send,
  Inbox,
  Wifi,
  Smartphone,
  Globe,
  Target,
  Maximize2,
  Eye,
  Settings,
  Star,
  AlertTriangle,
  Info,
  TrendingUp,
  Award,
  Monitor,
  Cloud,
  Image
} from "lucide-react";

export default function CompressPdfForEmail() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mr-4">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PDF for Email - Free & Instant
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize PDF attachments for email delivery. Reduce file sizes while maintaining perfect document quality,
            ensuring your emails are delivered successfully without attachment rejections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Compress PDF Now
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Free • No Registration • Secure
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Clock className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">2-5s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <HardDrive className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">90%</div>
              <div className="text-sm text-gray-600">Size Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">PDFs Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Provider Limits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Email Provider Attachment Limits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay within email provider limits to ensure your PDFs are delivered successfully
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Email Provider</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Attachment Limit</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Total Email Limit</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Compression Needed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Gmail</td>
                  <td className="border border-gray-300 px-4 py-3">25MB per file</td>
                  <td className="border border-gray-300 px-4 py-3">25MB total</td>
                  <td className="border border-gray-300 px-4 py-3">&gt;25MB files</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Outlook.com</td>
                  <td className="border border-gray-300 px-4 py-3">20MB per file</td>
                  <td className="border border-gray-300 px-4 py-3">No strict limit</td>
                  <td className="border border-gray-300 px-4 py-3">&gt;20MB files</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Yahoo Mail</td>
                  <td className="border border-gray-300 px-4 py-3">25MB per file</td>
                  <td className="border border-gray-300 px-4 py-3">25MB total</td>
                  <td className="border border-gray-300 px-4 py-3">&gt;25MB files</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">iCloud Mail</td>
                  <td className="border border-gray-300 px-4 py-3">20MB per file</td>
                  <td className="border border-gray-300 px-4 py-3">No strict limit</td>
                  <td className="border border-gray-300 px-4 py-3">&gt;20MB files</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Corporate Email</td>
                  <td className="border border-gray-300 px-4 py-3">10-15MB typically</td>
                  <td className="border border-gray-300 px-4 py-3">Varies</td>
                  <td className="border border-gray-300 px-4 py-3">&gt;10-15MB files</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect Email PDF Optimization
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized compression for email attachments that preserves document quality while ensuring delivery success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Optimized</h3>
              <p className="text-gray-600">
                Specifically tuned compression algorithms that balance size reduction with email delivery requirements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Client-side processing ensures your sensitive documents never leave your device or touch our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Preserved</h3>
              <p className="text-gray-600">
                Maintain perfect text clarity, image quality, and formatting while achieving maximum size reduction.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Process PDFs in 2-5 seconds with optimized compression algorithms designed for email workflows.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Maximize2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Batch Processing</h3>
              <p className="text-gray-600">
                Compress multiple PDF attachments simultaneously. Perfect for bulk email campaigns and document distribution.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Preview Before Send</h3>
              <p className="text-gray-600">
                Preview compressed PDFs before attaching to ensure all content displays correctly and meets your quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ideal for Every Email Scenario
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From business communications to personal sharing, optimize PDFs for any email situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Send className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Communications</h3>
              <p className="text-gray-600 mb-3">
                Send contracts, proposals, reports, and presentations without email delivery issues.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Client proposals</li>
                <li>• Business reports</li>
                <li>• Legal documents</li>
                <li>• Financial statements</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Services</h3>
              <p className="text-gray-600 mb-3">
                Share invoices, receipts, certificates, and documentation with clients and partners.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Invoices & receipts</li>
                <li>• Certificates</li>
                <li>• Documentation</li>
                <li>• Client deliverables</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sales & Marketing</h3>
              <p className="text-gray-600 mb-3">
                Distribute product catalogs, marketing materials, and sales presentations efficiently.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product catalogs</li>
                <li>• Marketing materials</li>
                <li>• Sales presentations</li>
                <li>• Campaign assets</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic & Education</h3>
              <p className="text-gray-600 mb-3">
                Share research papers, academic papers, thesis documents, and educational materials.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Research papers</li>
                <li>• Academic papers</li>
                <li>• Thesis documents</li>
                <li>• Course materials</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Sharing</h3>
              <p className="text-gray-600 mb-3">
                Send personal documents, photos, travel itineraries, and important personal files.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personal documents</li>
                <li>• Photo collections</li>
                <li>• Travel documents</li>
                <li>• Family sharing</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Remote Work</h3>
              <p className="text-gray-600 mb-3">
                Share work documents, project files, and collaboration materials with remote teams.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project files</li>
                <li>• Team documents</li>
                <li>• Collaboration</li>
                <li>• Remote meetings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about compressing PDFs for email
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What email providers have the strictest attachment limits?
              </h3>
              <p className="text-gray-600">
                Corporate email systems typically have the most restrictive limits (10-15MB), followed by Outlook.com and iCloud Mail at 20MB.
                Gmail and Yahoo Mail are more generous at 25MB per attachment. Always compress files larger than 10MB to ensure broad compatibility.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressing my PDF affect the document formatting?
              </h3>
              <p className="text-gray-600">
                No! Our email-optimized compression preserves all formatting, fonts, images, and layout elements.
                The compression focuses on reducing image file sizes and removing unnecessary metadata while maintaining perfect document appearance.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I compress multiple PDFs for a bulk email campaign?
              </h3>
              <p className="text-gray-600">
                Yes! Our batch processing feature allows you to compress multiple PDFs simultaneously, perfect for email marketing campaigns,
                newsletter attachments, or bulk document distribution. Each file is processed independently to ensure optimal results.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my PDF content secure during compression?
              </h3>
              <p className="text-gray-600">
                Absolutely secure. All processing happens locally in your browser using client-side technology.
                Your PDFs never leave your device or touch our servers, ensuring complete privacy and security for sensitive documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Send PDFs Without Email Issues?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of users who trust our email-optimized PDF compression for reliable document delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Mail className="w-5 h-5 mr-2" />
                Compress for Email
              </Button>
            </Link>
            <Link to="/blog/how-to-compress-pdf-for-email">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Info className="w-5 h-5 mr-2" />
                Learn More
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
              More PDF Optimization Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of PDF compression and optimization tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-pdf-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Compress PDF Online
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                General PDF compression for all purposes with maximum size reduction.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-without-losing-quality" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Compress Without Losing Quality
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Quality-focused compression that maintains visual fidelity while reducing size.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/reduce-pdf-file-size-on-mobile" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Smartphone className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Mobile PDF Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize PDFs specifically for mobile devices and mobile email clients.
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


