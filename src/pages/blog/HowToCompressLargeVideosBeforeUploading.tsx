import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Video,
  Upload,
  Download,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  Users,
  ChevronRight,
  Play,
  Settings,
  Monitor,
  Smartphone,
  Globe,
  Info,
  Star,
  Timer,
  Target,
  Maximize2,
  Eye,
  Palette,
  Cpu,
  BarChart3,
  FileText,
  Image,
  HardDrive,
  Layers,
  AlertTriangle,
  TrendingUp,
  Award,
  Camera,
  Film,
  Scissors,
  Gauge,
  Wifi,
  Server,
  Cloud,
  Mail
} from "lucide-react";

export default function BlogHowToCompressLargeVideosBeforeUploading() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 mb-4 sm:mb-0 sm:mr-4">
                <Video className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Compress Large Videos Before Uploading: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Master video compression techniques to dramatically reduce file sizes while maintaining quality.
              Learn professional strategies for faster uploads, better streaming, and optimal video delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/compress">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Compress Videos
                </Button>
              </Link>
              <Link to="/compress-images-online">
                <Button size="lg" variant="outline" className="px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  All Media Tools
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Professional Grade • Quality Preserved • Upload Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Video Compression Impact</h2>
            <p className="text-base sm:text-lg text-gray-600">See the dramatic difference proper video compression makes for upload times and quality</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-6 text-center border-2 border-red-200">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500 text-white mx-auto mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-2">Upload Speed</h3>
              <p className="font-semibold text-red-800 mb-2 text-sm sm:text-base">80-95% Faster</p>
              <p className="text-xs sm:text-sm text-red-700">Dramatically reduced upload times across all platforms</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 text-center border-2 border-blue-200">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 text-white mx-auto mb-3 sm:mb-4">
                <HardDrive className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">File Size</h3>
              <p className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">70-90% Smaller</p>
              <p className="text-xs sm:text-sm text-blue-700">Massive size reduction while maintaining visual quality</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 text-center border-2 border-green-200">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 text-white mx-auto mb-3 sm:mb-4">
                <Play className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">Quality Retention</h3>
              <p className="font-semibold text-green-800 mb-2 text-sm sm:text-base">90%+ Preserved</p>
              <p className="text-xs sm:text-sm text-green-700">Professional quality maintained for all viewing scenarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <a href="#video-formats" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Video Formats & Codecs
              </a>
              <a href="#resolution-bitrate" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Resolution & Bitrate Optimization
              </a>
              <a href="#compression-techniques" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Advanced Compression Techniques
              </a>
              <a href="#upload-platforms" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Platform-Specific Optimization
              </a>
              <a href="#editing-workflow" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Pre-Upload Editing Workflow
              </a>
              <a href="#quality-testing" className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Quality Testing & Validation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <h2 id="video-formats" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-3" />
              Video Formats & Codecs: The Foundation
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
              Choosing the right video format and codec is the most important decision for optimal compression.
              Modern codecs can achieve 70-90% size reduction while maintaining excellent quality, but compatibility
              and performance vary significantly across different platforms and devices.
            </p>

            <div className="space-y-8">

              {/* Codec Comparison */}
              <div className="border border-red-200 rounded-xl p-4 sm:p-6 bg-red-50/50">
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 mb-4 sm:mb-0 sm:mr-6">
                    <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-0 sm:mr-3">Codec Compression Comparison</h3>
                      <div className="flex items-center">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        <span className="ml-2 text-xs sm:text-sm font-medium text-red-700">Size vs Quality</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                      <strong>Modern vs Legacy Codecs.</strong> Newer codecs like H.265/HEVC and AV1 offer dramatically better compression
                      efficiency compared to older H.264, but require more processing power and have varying browser support.
                      Understanding these trade-offs is crucial for optimal results.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div className="bg-red-100 rounded-lg p-3">
                        <h4 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Modern Codecs:</h4>
                        <ul className="text-xs sm:text-sm text-red-800 space-y-1">
                          <li>• H.265/HEVC: 50% better compression</li>
                          <li>• AV1: 30% better than HEVC</li>
                          <li>• VP9: Excellent quality/size ratio</li>
                          <li>• Higher processing requirements</li>
                        </ul>
                      </div>
                      <div className="bg-red-100 rounded-lg p-3">
                        <h4 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Legacy Codecs:</h4>
                        <ul className="text-xs sm:text-sm text-red-800 space-y-1">
                          <li>• H.264: Universal compatibility</li>
                          <li>• VP8: WebM standard</li>
                          <li>• Lower processing requirements</li>
                          <li>• Larger file sizes</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-red-200 rounded-lg p-3">
                      <p className="text-xs sm:text-sm font-medium text-red-900">
                        <strong>Expert Tip:</strong> Use H.264 for maximum compatibility across all platforms, or H.265 for modern devices
                        and platforms that support it. Always provide fallbacks for older browsers and devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div className="border border-blue-200 rounded-xl p-4 sm:p-6 bg-blue-50/50">
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 mb-4 sm:mb-0 sm:mr-6">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-0 sm:mr-3">Container Format Selection</h3>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <span className="ml-2 text-xs sm:text-sm font-medium text-blue-700">Format Strategy</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                      <strong>Container vs Codec Choice.</strong> The container format (MP4, WebM, MOV) determines compatibility and features,
                      while the codec determines compression efficiency. MP4 with H.264 offers the best balance of compatibility and size.
                    </p>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Format</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Best Codec</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Browser Support</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">File Size</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Use Case</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-blue-50">
                            <td className="border border-gray-300 px-3 py-3 font-medium bg-blue-100 text-sm">MP4</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">H.264/H.265</td>
                            <td className="border border-gray-300 px-3 py-3 text-center">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Medium</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Universal compatibility</td>
                          </tr>
                          <tr className="hover:bg-green-50">
                            <td className="border border-gray-300 px-3 py-3 font-medium text-sm">WebM</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">VP8/VP9</td>
                            <td className="border border-gray-300 px-3 py-3 text-center">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Small</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Web optimization</td>
                          </tr>
                          <tr className="hover:bg-purple-50">
                            <td className="border border-gray-300 px-3 py-3 font-medium text-sm">MOV</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">H.264/ProRes</td>
                            <td className="border border-gray-300 px-3 py-3 text-center">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Large</td>
                            <td className="border border-gray-300 px-3 py-3 text-center text-sm">Professional editing</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <h2 id="resolution-bitrate" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Resolution & Bitrate Optimization
            </h2>

            <div className="space-y-6">

              <div className="bg-green-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
                <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-3 sm:mb-4">Resolution Selection Strategy</h3>
                <p className="text-green-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  Choose resolution based on target audience, delivery platform, and content type. Higher resolution doesn't always
                  mean better quality - it depends on the viewing context and original source material.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="border border-green-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Web & Social Media</h4>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                      <li>• 1080p (1920x1080): Standard quality</li>
                      <li>• 720p (1280x720): Good mobile quality</li>
                      <li>• 480p (854x480): Legacy compatibility</li>
                      <li>• Avoid 4K for web delivery</li>
                    </ul>
                  </div>
                  <div className="border border-green-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Professional & Business</h4>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                      <li>• 1440p (2560x1440): High quality presentations</li>
                      <li>• 1080p: Standard business presentations</li>
                      <li>• 720p: Internal team sharing</li>
                      <li>• Consider audience connection speeds</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3 sm:mb-4">Bitrate Optimization Guidelines</h3>
                <p className="text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  Bitrate determines file size and quality. Use variable bitrate (VBR) encoding for best results,
                  with appropriate maximum bitrates based on resolution and content complexity.
                </p>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Resolution</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Simple Content</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Complex Content</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">High Motion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">720p (HD)</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">1-2 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">2-3 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">3-4 Mbps</td>
                      </tr>
                      <tr className="hover:bg-green-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">1080p (Full HD)</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">2-3 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">4-6 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">6-8 Mbps</td>
                      </tr>
                      <tr className="hover:bg-purple-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">1440p (2K)</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">4-6 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">8-12 Mbps</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">12-16 Mbps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <h2 id="compression-techniques" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mr-3" />
              Advanced Compression Techniques
            </h2>

            <div className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="border border-purple-200 rounded-lg p-4 sm:p-6 bg-purple-50">
                  <Film className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-3">Two-Pass Encoding</h3>
                  <p className="text-purple-800 mb-3 text-sm sm:text-base">Analyzes video twice for optimal bitrate distribution</p>
                  <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                    <li>• Better quality consistency</li>
                    <li>• Optimal file size efficiency</li>
                    <li>• 20-30% better compression</li>
                    <li>• 2x processing time</li>
                  </ul>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 sm:p-6 bg-blue-50">
                  <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3">Variable Bitrate (VBR)</h3>
                  <p className="text-blue-800 mb-3 text-sm sm:text-base">Adjusts bitrate based on content complexity</p>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    <li>• Adapts to scene complexity</li>
                    <li>• Better quality/size ratio</li>
                    <li>• Maintains consistent quality</li>
                    <li>• Recommended for most content</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border-l-4 border-yellow-500">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-900 mb-3 sm:mb-4">Content-Aware Optimization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2 sm:mb-3 text-sm sm:text-base">Simple Content (Talking Head)</h4>
                    <ul className="space-y-1 sm:space-y-2 text-yellow-800 text-xs sm:text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Lower bitrates (2-4 Mbps for 1080p)
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Higher compression ratios possible
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        80-90% size reduction from original
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2 sm:mb-3 text-sm sm:text-base">Complex Content (Action/Motion)</h4>
                    <ul className="space-y-1 sm:space-y-2 text-yellow-800 text-xs sm:text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Higher bitrates (6-12 Mbps for 1080p)
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Preserve motion detail and sharpness
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        60-80% size reduction from original
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <h2 id="upload-platforms" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              Platform-Specific Optimization
            </h2>

            <div className="space-y-6">

              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3 sm:mb-4">Platform Requirements & Limits</h3>
                <p className="text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  Different platforms have specific requirements for video uploads. Understanding these constraints
                  ensures optimal delivery and prevents upload failures or quality degradation.
                </p>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[500px] border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-3 text-left font-semibold text-sm">Platform</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Size Limit</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Recommended Format</th>
                        <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-sm">Best Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">YouTube</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">128GB</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">MP4 (H.264)</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">1080p-4K</td>
                      </tr>
                      <tr className="hover:bg-green-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Vimeo</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">500MB-5GB</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">MP4 (H.264)</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">720p-4K</td>
                      </tr>
                      <tr className="hover:bg-purple-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">LinkedIn</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">200MB</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">MP4</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">1080p</td>
                      </tr>
                      <tr className="hover:bg-orange-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Twitter</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">512MB</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">MP4</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">720p</td>
                      </tr>
                      <tr className="hover:bg-red-50">
                        <td className="border border-gray-300 px-3 py-3 font-medium text-sm">Instagram</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">100MB</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">MP4</td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-sm">1080p</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <h2 id="editing-workflow" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Scissors className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mr-3" />
              Pre-Upload Video Editing Workflow
            </h2>

            <div className="space-y-6">

              <div className="bg-orange-50 rounded-lg p-4 sm:p-6 border-l-4 border-orange-500">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-900 mb-3 sm:mb-4">Video Preparation Checklist</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold mr-3 sm:mr-4">1</span>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">Content Review & Trimming</h4>
                      <p className="text-orange-800 text-xs sm:text-sm">Remove unnecessary footage, mistakes, and long pauses to reduce processing time and file size.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold mr-3 sm:mr-4">2</span>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">Stabilization & Enhancement</h4>
                      <p className="text-orange-800 text-xs sm:text-sm">Apply video stabilization, color correction, and basic enhancement before compression.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold mr-3 sm:mr-4">3</span>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">Test Export & Quality Check</h4>
                      <p className="text-orange-800 text-xs sm:text-sm">Export test clips at different settings to verify quality meets requirements before final export.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold mr-3 sm:mr-4">4</span>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">Final Compression & Validation</h4>
                      <p className="text-orange-800 text-xs sm:text-sm">Apply final compression settings and validate quality, compatibility, and file size.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border-l-4 border-purple-500">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-3 sm:mb-4">Export Settings Optimization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Basic Settings</h4>
                    <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                      <li>• Frame rate: 24-30fps</li>
                      <li>• Aspect ratio: 16:9 for web</li>
                      <li>• Audio: AAC 128-256kbps</li>
                      <li>• Sample rate: 44.1-48kHz</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Advanced Settings</h4>
                    <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                      <li>• Keyframe interval: 2-5 seconds</li>
                      <li>• B-frames: Enabled for efficiency</li>
                      <li>• CABAC: Enabled for compression</li>
                      <li>• Deblocking: Light to medium</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <h2 id="quality-testing" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Quality Testing & Validation
            </h2>

            <div className="space-y-6">

              <div className="bg-green-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
                <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-3 sm:mb-4">Multi-Platform Testing Protocol</h3>
                <p className="text-green-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  Test compressed videos across multiple devices, browsers, and platforms to ensure optimal quality
                  and compatibility before final upload or distribution.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold text-green-900 text-sm sm:text-base">Desktop</div>
                      <div className="text-xs sm:text-sm text-green-700">Chrome, Firefox, Safari</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold text-green-900 text-sm sm:text-base">Mobile Devices</div>
                      <div className="text-xs sm:text-sm text-green-700">iOS Safari, Chrome Mobile</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold text-green-900 text-sm sm:text-base">Web Platforms</div>
                      <div className="text-xs sm:text-sm text-green-700">YouTube, Vimeo, Social Media</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Quality Assessment Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Visual Quality</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Sharp text and graphics
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Natural skin tones and colors
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Smooth motion without artifacts
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Clear audio without distortion
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Technical Performance</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Fast loading and buffering
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Smooth playback on all devices
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Compatible with target platforms
                      </li>
                      <li className="flex items-center text-blue-800">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Appropriate file size for use case
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Compress Large Videos Before Uploading?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
            Master video compression and dramatically improve your upload speeds and video quality
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Compress Videos
              </Button>
            </Link>
            <Link to="/blog/why-file-compression-is-essential-for-remote-work">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Remote Work Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link to="/blog/why-file-compression-is-essential-for-remote-work" className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Remote Work Compression
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">
                Complete guide to file compression strategies for distributed teams and remote collaboration.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600 text-sm sm:text-base">
                Read More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-pdf-online" className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Document Compression
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">
                Comprehensive PDF and document optimization for all professional use cases.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600 text-sm sm:text-base">
                Read More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-images-online" className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Image Optimization
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">
                Professional image compression for web and digital media with multiple format support.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600 text-sm sm:text-base">
                Read More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


