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
  AlertTriangle,
  Clock,
  Users,
  Smartphone,
  Globe,
  ChevronRight,
  ArrowRight,
  Info,
  Target,
  Maximize2,
  Send,
  Inbox,
  Wifi,
  HardDrive,
  Eye,
  Settings,
  Star,
  ThumbsUp,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Video,
  Award
} from "lucide-react";

export default function BlogHowToCompressPdfForEmail() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 mb-4 sm:mb-0 sm:mr-4">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Compress PDF for Email: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Master PDF compression for email attachments. Avoid bounced emails, ensure reliable delivery,
              and maintain professional document quality with our step-by-step guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/compress-pdf-for-email">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Compress PDF Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <FileText className="w-5 h-5 mr-2" />
                  General PDF Compression
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Professional Guide • Email Best Practices
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">25MB</div>
              <div className="text-xs sm:text-sm text-gray-600">Typical Email Limit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">90%</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Size Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">2M+</div>
              <div className="text-xs sm:text-sm text-gray-600">Successful Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">99.9%</div>
              <div className="text-xs sm:text-sm text-gray-600">Delivery Success Rate</div>
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
              <a href="#why-compress" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Compress PDFs for Email?
              </a>
              <a href="#step-by-step" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#email-limits" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Email Provider Limits
              </a>
              <a href="#best-practices" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#common-mistakes" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Common Mistakes to Avoid
              </a>
              <a href="#alternatives" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Alternative Solutions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <h2 id="why-compress" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              Why Compress PDFs for Email?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              Email providers impose strict attachment size limits to maintain system performance and prevent abuse.
              Most email services cap attachments between 20-25MB, with some limiting to as low as 10MB.
              Large PDF attachments often result in bounced emails, failed deliveries, or frustrated recipients.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Email Provider Limits</h3>
                  <ul className="text-blue-800 space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <li><strong>Gmail:</strong> 25MB per email (including attachments)</li>
                    <li><strong>Outlook:</strong> 20MB per attachment</li>
                    <li><strong>Yahoo Mail:</strong> 25MB total per email</li>
                    <li><strong>iCloud Mail:</strong> 20MB per attachment</li>
                    <li><strong>Corporate Email:</strong> Often 10-15MB (varies by organization)</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Key Benefits of PDF Compression</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Reliable Delivery</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Ensure your emails reach recipients without bouncing or requiring alternative delivery methods.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Faster Sending</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Smaller files upload and send faster, especially on slower internet connections.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Better UX</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Recipients can download and view attachments quickly without frustration.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Professional Image</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Demonstrate technical savvy and consideration for recipients' time and bandwidth.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Guide to Compress PDFs for Email
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Check Your PDF Size</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Before compression, determine your PDF's current size. Right-click the file and select "Properties"
                    or use SlimFile's analyzer to see the current file size and estimated compression potential.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Pro Tip:</strong> PDFs over 10MB should always be compressed before emailing
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Choose the Right Compression Tool</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Select a reliable PDF compression tool that maintains quality. SlimFile offers client-side processing,
                    ensuring your documents never leave your device while providing professional-grade compression.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Client-side processing</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Quality preservation</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Batch processing</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                      <span className="text-xs sm:text-sm font-medium text-green-800">Multiple formats</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload and Compress</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Upload your PDF to the compression tool. Most tools offer automatic optimization, but you can
                    adjust compression levels based on your needs. For email, medium to high compression usually works best.
                  </p>
                  <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-500">
                    <p className="text-xs sm:text-sm text-amber-800">
                      <strong>Email Recommendation:</strong> Use "High Quality" or "Email Optimized" settings for best results
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Verify Quality</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Always preview the compressed PDF before sending. Check that text is readable, images are clear,
                    and all important details are preserved. Use zoom functions to verify quality at different levels.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <p className="text-xs sm:text-sm text-purple-800">
                      <strong>Quality Check:</strong> Zoom to 100-200% to verify text sharpness and image clarity
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Attach and Send</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Attach the compressed PDF to your email. Double-check the file size in your email client
                    and send a test email to yourself first to ensure everything works correctly.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Best Practice:</strong> Send test emails to verify delivery and quality on different devices
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="email-limits" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Inbox className="w-8 h-8 text-purple-500 mr-3" />
              Email Provider Size Limits & Requirements
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px] border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Email Provider</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Attachment Limit</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Total Email Limit</th>
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Compression Needed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Gmail</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">25MB per file</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">25MB total</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">&gt;25MB files</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Outlook.com</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">20MB per file</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">No strict limit</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">&gt;20MB files</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Yahoo Mail</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">25MB per file</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">25MB total</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">&gt;25MB files</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">iCloud Mail</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">20MB per file</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">No strict limit</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">&gt;20MB files</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Corporate Email</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">10-15MB typically</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">Varies</td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">&gt;10-15MB files</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Best Practices for PDF Email Attachments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Test Before Sending</h4>
                    <p className="text-gray-600 text-sm">Always send a test email to yourself to verify the attachment works correctly on different devices and email clients.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Include Context</h4>
                    <p className="text-gray-600 text-sm">Add a brief description in the email body explaining what the PDF contains and why you're sending it.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use Descriptive Names</h4>
                    <p className="text-gray-600 text-sm">
                      Name your PDF file clearly (e.g., "Project-Proposal-2025.pdf") rather than generic names like "document.pdf".
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consider Multiple Files</h4>
                    <p className="text-gray-600 text-sm">For very large documents, consider splitting into smaller PDFs or providing a download link instead.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Check Accessibility</h4>
                    <p className="text-gray-600 text-sm">Ensure your PDF is accessible with proper headings, alt text for images, and readable fonts.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Mobile Optimization</h4>
                    <p className="text-gray-600 text-sm">Remember that many recipients will view your PDF on mobile devices, so ensure readability on small screens.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 id="common-mistakes" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              Common Mistakes to Avoid
            </h2>

            <div className="space-y-4">
              <div className="flex items-start bg-red-50 rounded-lg p-4">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Over-Compression</h4>
                  <p className="text-red-800 text-sm">Don't compress so much that text becomes unreadable or images lose important details. Quality should always come first for professional communications.</p>
                </div>
              </div>

              <div className="flex items-start bg-red-50 rounded-lg p-4">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Ignoring File Naming</h4>
                  <p className="text-red-800 text-sm">Don't send PDFs with generic names like "document.pdf" or "scan001.pdf". Use descriptive, professional file names that clearly indicate the content.</p>
                </div>
              </div>

              <div className="flex items-start bg-red-50 rounded-lg p-4">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">No Context in Email</h4>
                  <p className="text-red-800 text-sm">Don't send a PDF attachment without explaining what it contains and why you're sending it. Always provide context in the email body.</p>
                </div>
              </div>

              <div className="flex items-start bg-red-50 rounded-lg p-4">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Forgetting Mobile Users</h4>
                  <p className="text-red-800 text-sm">Don't assume everyone will view your PDF on a desktop computer. Ensure the compressed PDF is readable on mobile devices and tablets.</p>
                </div>
              </div>
            </div>

            <h2 id="alternatives" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-indigo-500 mr-3" />
              Alternative Solutions When Compression Isn't Enough
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">Cloud Storage Links</h3>
                <p className="text-indigo-800 mb-3">
                  Upload large files to Google Drive, Dropbox, or OneDrive and share download links instead of attachments.
                </p>
                <div className="text-sm text-indigo-700">
                  <strong>Best for:</strong> Files over 25MB, multiple recipients, version control
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-3">File Sharing Services</h3>
                <p className="text-green-800 mb-3">
                  Use WeTransfer, Dropbox Transfer, or similar services designed for large file sharing with email integration.
                </p>
                <div className="text-sm text-green-700">
                  <strong>Best for:</strong> One-time transfers, temporary access, no account required
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Document Splitting</h3>
                <p className="text-purple-800 mb-3">
                  Break large PDFs into smaller, logical sections that can be sent as separate attachments or combined by recipients.
                </p>
                <div className="text-sm text-purple-700">
                  <strong>Best for:</strong> Modular documents, easier navigation, selective reading
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Alternative Formats</h3>
                <p className="text-orange-800 mb-3">
                  Consider using Microsoft Word, Google Docs, or other editable formats that are typically smaller than PDFs.
                </p>
                <div className="text-sm text-orange-700">
                  <strong>Best for:</strong> Collaborative documents, editable content, smaller file sizes
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Compress Your PDFs for Email?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of professionals who trust SlimFile for reliable email delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-pdf-for-email">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Mail className="w-5 h-5 mr-2" />
                Compress for Email
              </Button>
            </Link>
            <Link to="/compress-pdf-online">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <FileText className="w-5 h-5 mr-2" />
                General PDF Compression
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
            <Link to="/blog/compressing-pdf-for-printing-vs-emailing" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                PDF for Printing vs Emailing
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Understanding the different compression requirements for print and email delivery.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-without-losing-quality" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Compress Without Losing Quality
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Advanced techniques for maximum compression with zero quality loss.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/reduce-pdf-file-size-on-mobile" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Smartphone className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Mobile PDF Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Complete guide to reducing PDF file sizes on mobile devices.
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


