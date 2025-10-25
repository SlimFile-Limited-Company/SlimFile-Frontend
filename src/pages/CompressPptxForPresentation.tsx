import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Download,
  Upload,
  Zap,
  Shield,
  Play,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Star,
  Timer,
  AlertTriangle,
  Type,
  Settings,
  Presentation,
  Video,
  Maximize2,
  Eye,
  Palette,
  Cpu,
  BarChart3,
  Award,
  Smartphone,
  Globe,
  Info,
  Wifi,
  Target,
  FileText,
  Image
} from "lucide-react";

export default function CompressPptxForPresentation() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mr-4">
              <Monitor className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <Play className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress PPTX for Presentation - Professional Delivery
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize PowerPoint presentations for flawless live delivery. Reduce file sizes while maintaining perfect slide quality,
            smooth transitions, and professional presentation performance across all devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Optimize Presentation
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Presentation Ready • Smooth Playback • Professional
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Timer className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">Instant</div>
              <div className="text-sm text-gray-600">Load Times</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Play className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">Smooth</div>
              <div className="text-sm text-gray-600">Transitions</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">All Devices</div>
              <div className="text-sm text-gray-600">Universal Compatibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Presentation-Optimized Compression
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized algorithms designed specifically for live presentations with real-time performance optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smooth Transitions</h3>
              <p className="text-gray-600">
                Optimized slide transitions and animations that play smoothly without stuttering or delays during live presentations.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Timer className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Loading</h3>
              <p className="text-gray-600">
                Dramatically reduced load times ensure presentations open instantly, eliminating awkward pauses before starting.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Reliable</h3>
              <p className="text-gray-600">
                Presentation elements preserved perfectly including animations, embedded media, and interactive components.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Monitor className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Compatibility</h3>
              <p className="text-gray-600">
                Works seamlessly across PowerPoint, Google Slides, Keynote, and web-based presentation platforms.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Media Optimized</h3>
              <p className="text-gray-600">
                Embedded videos and audio files optimized for smooth playback without compromising presentation quality.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Preserved</h3>
              <p className="text-gray-600">
                Maintains visual quality and professional appearance while achieving maximum file size reduction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Presentation Performance Impact
            </h2>
            <p className="text-lg text-gray-600">
              See the dramatic difference optimized presentations make in real-world scenarios
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-green-900">Optimized Presentation</h3>
              </div>
              <p className="text-green-800 mb-4">
                Presentations compressed specifically for live delivery with smooth performance, instant loading,
                and reliable playback across all devices and presentation platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">Instant</div>
                  <div className="text-sm text-green-700">Load Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">60fps</div>
                  <div className="text-sm text-green-700">Transitions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">All Devices</div>
                  <div className="text-sm text-green-700">Compatible</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">Professional</div>
                  <div className="text-sm text-green-700">Quality</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-red-900">Unoptimized Presentation</h3>
              </div>
              <p className="text-red-800 mb-4">
                Large, unoptimized presentations that cause loading delays, stuttering transitions, and compatibility issues
                during live presentations, potentially damaging professional credibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">5-15s</div>
                  <div className="text-sm text-red-700">Load Time</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">Choppy</div>
                  <div className="text-sm text-red-700">Transitions</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">Limited</div>
                  <div className="text-sm text-red-700">Compatibility</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">Risky</div>
                  <div className="text-sm text-red-700">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Scenarios Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Presentation Scenario
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From boardroom meetings to conference stages, optimize presentations for any live delivery situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Meetings</h3>
              <p className="text-gray-600 mb-3">
                Deliver crisp, professional presentations in boardrooms and client meetings without technical delays.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Boardroom presentations</li>
                <li>• Client pitches</li>
                <li>• Team meetings</li>
                <li>• Sales presentations</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conference Speaking</h3>
              <p className="text-gray-600 mb-3">
                Present confidently at conferences and events with reliable performance on any venue's equipment.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Conference presentations</li>
                <li>• Keynote speeches</li>
                <li>• Workshop sessions</li>
                <li>• Event presentations</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Training Sessions</h3>
              <p className="text-gray-600 mb-3">
                Conduct smooth training sessions and workshops with presentations that load instantly and play reliably.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Employee training</li>
                <li>• Workshop materials</li>
                <li>• Educational sessions</li>
                <li>• Instructional content</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Presenting</h3>
              <p className="text-gray-600 mb-3">
                Present directly from mobile devices and tablets with optimized performance for portable presentations.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• iPad presentations</li>
                <li>• Tablet displays</li>
                <li>• Mobile meetings</li>
                <li>• Portable demos</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Wifi className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Web Conferencing</h3>
              <p className="text-gray-600 mb-3">
                Share presentations in Zoom, Teams, and other web conferencing platforms with smooth screen sharing.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zoom meetings</li>
                <li>• Teams presentations</li>
                <li>• Web conferences</li>
                <li>• Remote collaboration</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Target className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Lectures</h3>
              <p className="text-gray-600 mb-3">
                Deliver engaging academic presentations and lectures with reliable performance in classroom settings.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• University lectures</li>
                <li>• Academic conferences</li>
                <li>• Research presentations</li>
                <li>• Educational seminars</li>
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
              How Presentation Optimization Works
            </h2>
            <p className="text-lg text-gray-600">
              Specialized compression technology designed specifically for live presentation delivery
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Media Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Identifies and optimizes embedded videos, audio files, and high-resolution images while maintaining
                  smooth playback quality appropriate for presentation use. Reduces bitrate while preserving clarity.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Result:</strong> Smooth media playback with 60-80% size reduction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Animation Preservation
                </h3>
                <p className="text-gray-600 mb-3">
                  Maintains all slide transitions, animations, and interactive elements at full quality.
                  Optimizes timing and reduces redundant animation data without affecting visual presentation.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Result:</strong> Smooth 60fps transitions with perfect timing
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
                  Cross-Platform Compatibility
                </h3>
                <p className="text-gray-600 mb-3">
                  Ensures optimized presentations work seamlessly across PowerPoint, Google Slides, Keynote,
                  and web-based presentation platforms with consistent performance and quality.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Result:</strong> Universal compatibility with reliable performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Presentation Performance Metrics
            </h2>
            <p className="text-lg text-gray-600">
              Real-world performance improvements for live presentation delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Improvements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Load Time Reduction</span>
                  <span className="font-bold text-green-600">80-95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Transition Smoothness</span>
                  <span className="font-bold text-blue-600">60fps</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">File Size Reduction</span>
                  <span className="font-bold text-purple-600">60-90%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Compatibility Score</span>
                  <span className="font-bold text-orange-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Animation Preservation</span>
                  <span className="font-bold text-red-600">100%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Elements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Slide Transitions</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Embedded Videos</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Audio Files</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Animations</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Interactive Elements</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
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
              Everything you need to know about optimizing PowerPoint presentations for live delivery
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will presentation compression affect slide animations and transitions?
              </h3>
              <p className="text-gray-600">
                No! Our presentation-optimized compression preserves all slide animations, transitions, and timing at 100% quality.
                The compression focuses on reducing image file sizes and media bitrates while maintaining perfect animation performance
                and smooth 60fps transitions during live presentations.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I use compressed presentations in PowerPoint, Google Slides, and Keynote?
              </h3>
              <p className="text-gray-600">
                Yes! Optimized presentations maintain full compatibility with PowerPoint, Google Slides, Keynote, and all major
                presentation platforms. The compression process ensures universal compatibility while improving performance
                across all presentation software and devices.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How much faster will my presentations load after compression?
              </h3>
              <p className="text-gray-600">
                Most presentations load 80-95% faster after optimization. A 50MB presentation that previously took 10-15 seconds
                to load will typically open in 1-2 seconds. This eliminates awkward pauses and ensures smooth presentation delivery
                in any environment.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will compressed presentations work on older computers and mobile devices?
              </h3>
              <p className="text-gray-600">
                Absolutely! Presentation optimization improves performance across all devices, including older computers,
                tablets, and mobile devices. The compression reduces system requirements while maintaining full visual quality
                and smooth playback performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Deliver Flawless Presentations?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who trust SlimFile for presentation-optimized PowerPoint compression
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Monitor className="w-5 h-5 mr-2" />
                Optimize Presentation
              </Button>
            </Link>
            <Link to="/blog/compress-pptx-presentations-without-losing-quality">
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
              More Presentation Tools
            </h2>
            <p className="text-lg text-gray-600">
              Explore our complete suite of presentation optimization and compression tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/compress-pptx-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Presentation className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                General PPTX Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive PowerPoint optimization for all use cases and scenarios.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/compress-pptx-presentations-without-losing-quality" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Target className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Quality-Focused Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Advanced techniques for maximum compression while maintaining presentation quality.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Image Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Optimize images within presentations for better performance and smaller file sizes.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-purple-600">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


