import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Download,
  Upload,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  ChevronRight,
  Image,
  Settings,
  Star,
  AlertTriangle,
  Info,
  TrendingUp,
  BarChart3,
  Eye,
  Target,
  Maximize2,
  Smartphone,
  Monitor,
  Search,
  Cpu,
  Wifi,
  Timer,
  Award,
  FileImage,
  Palette,
  Camera
} from "lucide-react";

export default function CompressImagesForWebsite() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mr-4">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Compress Images for Website - SEO & Performance Optimized
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Optimize images for maximum website performance and SEO. Reduce load times, improve Core Web Vitals,
            and boost search rankings with professionally compressed images that maintain stunning visual quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/compress-images-online">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Optimize Website Images
              </Button>
            </Link>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              SEO Optimized • Performance Focused • Mobile Ready
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Timer className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">90%</div>
              <div className="text-sm text-gray-600">Faster Loading</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">50%+</div>
              <div className="text-sm text-gray-600">SEO Improvement</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">3B+</div>
              <div className="text-sm text-gray-600">Images Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Website Performance Impact
            </h2>
            <p className="text-lg text-gray-600">
              See the dramatic difference optimized images make for website performance and SEO
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-green-900">Optimized Website Images</h3>
              </div>
              <p className="text-green-800 mb-4">
                Professionally optimized images that load instantly, improve Core Web Vitals, and boost search engine rankings
                while maintaining stunning visual quality for the best user experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">1-2s</div>
                  <div className="text-sm text-green-700">Load Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">95+</div>
                  <div className="text-sm text-green-700">Lighthouse Score</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">50%+</div>
                  <div className="text-sm text-green-700">SEO Boost</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">Mobile</div>
                  <div className="text-sm text-green-700">Optimized</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-red-900">Unoptimized Website Images</h3>
              </div>
              <p className="text-red-800 mb-4">
                Large, unoptimized images that slow down page loading, hurt SEO rankings, and create poor user experiences
                with slow loading times and high bounce rates, especially on mobile devices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">5-10s</div>
                  <div className="text-sm text-red-700">Load Time</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">60-70</div>
                  <div className="text-sm text-red-700">Lighthouse Score</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">-30%</div>
                  <div className="text-sm text-red-700">SEO Penalty</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">Slow</div>
                  <div className="text-sm text-red-700">Mobile Loading</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Web Vitals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Optimize for Core Web Vitals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Improve Google's Core Web Vitals metrics with optimized images that enhance user experience and search rankings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Largest Contentful Paint (LCP)</h3>
              <p className="text-gray-600">
                Optimize hero images and main content visuals for faster loading and better LCP scores.
                Properly sized images load instantly without layout shifts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Maximize2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cumulative Layout Shift (CLS)</h3>
              <p className="text-gray-600">
                Prevent layout shifts with properly sized images and responsive dimensions.
                Maintain visual stability for better user experience and CLS scores.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Cpu className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">First Input Delay (FID)</h3>
              <p className="text-gray-600">
                Faster page loading with optimized images reduces blocking time and improves
                responsiveness for better FID scores and user interaction.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Performance</h3>
              <p className="text-gray-600">
                Optimized images for mobile devices ensure fast loading on slower connections
                and improve mobile-specific Core Web Vitals metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 mb-4">
                <Search className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SEO Rankings</h3>
              <p className="text-gray-600">
                Better Core Web Vitals scores directly impact search engine rankings and organic traffic.
                Google's algorithm favors fast-loading, well-optimized sites.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Experience</h3>
              <p className="text-gray-600">
                Fast-loading images create better user experiences, reduce bounce rates,
                and improve conversion rates across all devices and connection speeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Website Scenarios Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Website Type
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From e-commerce stores to personal blogs, optimize images for maximum performance and SEO impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">E-commerce Stores</h3>
              <p className="text-gray-600 mb-3">
                Optimize product images for faster loading and better conversion rates in online stores.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product galleries</li>
                <li>• Category pages</li>
                <li>• Shopping carts</li>
                <li>• Mobile commerce</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Camera className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Photography Portfolios</h3>
              <p className="text-gray-600 mb-3">
                Showcase photography work with optimized images that load quickly while maintaining visual impact.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Portfolio galleries</li>
                <li>• Client showcases</li>
                <li>• Image archives</li>
                <li>• High-res downloads</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Websites</h3>
              <p className="text-gray-600 mb-3">
                Professional websites need fast loading with optimized images for better user engagement.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Corporate sites</li>
                <li>• Landing pages</li>
                <li>• Service pages</li>
                <li>• About sections</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Blogs & Content</h3>
              <p className="text-gray-600 mb-3">
                Content-heavy sites benefit from optimized images that improve readability and loading speed.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Blog posts</li>
                <li>• Article images</li>
                <li>• Featured content</li>
                <li>• Social media</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Palette className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Design Agency Sites</h3>
              <p className="text-gray-600 mb-3">
                Creative agencies need fast-loading portfolio sites that showcase work without compromising quality.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Portfolio sites</li>
                <li>• Case studies</li>
                <li>• Design showcases</li>
                <li>• Creative work</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Smartphone className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Apps</h3>
              <p className="text-gray-600 mb-3">
                Optimize images for mobile apps and responsive web designs with device-specific compression.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile interfaces</li>
                <li>• App assets</li>
                <li>• Responsive design</li>
                <li>• Touch interfaces</li>
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
              Website Image Optimization Process
            </h2>
            <p className="text-lg text-gray-600">
              Advanced optimization technology designed specifically for website performance and SEO
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 md:mb-0 md:mr-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Content Analysis
                </h3>
                <p className="text-gray-600 mb-3">
                  AI-powered analysis identifies image content type (photos, graphics, logos) and determines
                  the optimal compression strategy for each image while maintaining visual quality appropriate for web use.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Result:</strong> Tailored optimization for each image type
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
                  Format Optimization
                </h3>
                <p className="text-gray-600 mb-3">
                  Automatically converts images to the most efficient format (WebP, AVIF, JPEG) based on browser support
                  and content type. Preserves transparency and maintains visual quality while reducing file size.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Result:</strong> Next-gen formats with 25-50% additional savings
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
                  Performance Validation
                </h3>
                <p className="text-gray-600 mb-3">
                  Final validation ensures images meet website performance standards and SEO requirements.
                  Images are tested for loading speed, visual quality, and compatibility across all devices and browsers.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Result:</strong> Website-ready images optimized for performance and SEO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              SEO & Performance Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive benefits that directly impact search rankings and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">SEO Improvements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Core Web Vitals Score</span>
                  <span className="font-bold text-green-600">+30-50%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Page Load Speed</span>
                  <span className="font-bold text-blue-600">80-95% Faster</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Search Rankings</span>
                  <span className="font-bold text-purple-600">+20-40%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Mobile Performance</span>
                  <span className="font-bold text-orange-600">90%+ Score</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Bounce Rate Reduction</span>
                  <span className="font-bold text-red-600">-25-40%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">File Size Reduction</span>
                  <span className="font-bold text-green-600">60-95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Format Optimization</span>
                  <span className="font-bold text-blue-600">WebP/AVIF</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Responsive Images</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">CDN Ready</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Browser Optimized</span>
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
              Everything you need to know about optimizing images for website performance and SEO
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do optimized images improve SEO rankings?
              </h3>
              <p className="text-gray-600">
                Optimized images directly improve Core Web Vitals scores (LCP, CLS, FID) which are major ranking factors
                in Google's algorithm. Faster loading images also reduce bounce rates and improve user engagement metrics,
                all of which contribute to better search engine rankings and increased organic traffic.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What image formats are best for website performance?
              </h3>
              <p className="text-gray-600">
                WebP and AVIF formats offer the best compression with superior quality for photographic content.
                JPEG remains widely supported for photos, while PNG is ideal for graphics with transparency.
                Our optimization automatically selects the best format based on content and browser support.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will image compression affect visual quality on my website?
              </h3>
              <p className="text-gray-600">
                No! Our website-optimized compression uses advanced algorithms that maintain visual quality appropriate
                for web display while achieving significant size reduction. Images are compressed to the optimal quality
                level for each specific use case, ensuring professional appearance and fast loading.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I implement responsive images on my website?
              </h3>
              <p className="text-gray-600">
                Use the HTML srcset and sizes attributes to serve different image sizes based on device screen size and resolution.
                Our optimization generates multiple sizes automatically, making it easy to implement responsive images
                that load quickly on all devices and improve Core Web Vitals scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Boost Your Website Performance?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of websites that use SlimFile for SEO-optimized image compression and faster loading times
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress-images-online">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Globe className="w-5 h-5 mr-2" />
                Optimize Website Images
              </Button>
            </Link>
            <Link to="/blog/how-to-compress-files-for-faster-website-loading">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold">
                <Info className="w-5 h-5 mr-2" />
                Performance Guide
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
              More Website Optimization Tools
            </h2>
            <p className="text-lg text-gray-600">
              Complete suite of tools for website performance optimization and SEO improvement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/blog/how-to-compress-files-for-faster-website-loading" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <TrendingUp className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Faster Website Loading
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive guide to optimizing all file types for maximum website performance.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read Guide <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/best-tools-to-compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Award className="w-10 h-10 text-green-500 mb-4 group-hover:text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Best Image Tools
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive review of the best image compression tools for different use cases.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-green-600">
                Read Review <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/compress-images-online" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Image className="w-10 h-10 text-purple-500 mb-4 group-hover:text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                General Image Compression
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Professional image optimization for all purposes with multiple format support.
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


