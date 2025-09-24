import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Smartphone, Zap, Shield, Wifi } from "lucide-react";

// Define props type for TypeScript
interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About <span className="text-primary">SlimFile</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              The modern way to compress files. Fast, secure, and works everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-lg bg-white/80 backdrop-blur-md">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-6">
                SlimFile is more than a file compression tool — it’s a story of vision,
                persistence, and growth. The journey began with our founder,{" "}
                <strong>Isaac Abakah</strong>, who developed a unique compression algorithm
                during his final year of high school. Working as a solo developer at first,
                Isaac laid the foundation for what would later become SlimFile. After gaining
                admission to Central University, he assembled a small but dedicated team to
                transform the algorithm into a fully functional software solution.
              </p>
              <p className="text-gray-600 mb-6">
                With this team, SlimFile moved from concept to reality and officially went live.
                What started as a high school project quickly grew into a product that people
                across the globe now rely on. In just four months, SlimFile reached{" "}
                <strong>1,500 active users in 52 countries</strong>, all through pure organic
                growth — without any paid advertising. This milestone proved the need for fast,
                secure, and user-friendly file compression.
              </p>
              <p className="text-gray-600">
                Today, SlimFile stands as a <strong>Ghanaian-built innovation</strong> with a
                clear mission: to become the first-ever file compression company in Ghana, while
                competing on the global stage. Our goal is to make file sharing and storage
                simpler, faster, and more accessible to everyone, everywhere. We are proud of
                how far we’ve come — and even more excited about where we’re going. SlimFile is
                just getting started.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            <Card className="shadow-lg bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900">Supported Formats</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>PDF Documents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>PPTX Documents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>JPEG Images</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>PNG Images</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>WebP Images</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900">Progressive Web App</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Install SlimFile on any device and use it like a native app. Works on desktop,
                  mobile, and tablets.
                </p>
                <div className="text-sm text-gray-500">
                  Available on iOS, Android, Windows, macOS, and Linux
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900">Privacy First</h3>
                </div>
                <p className="text-gray-600">
                  Your files are processed entirely on your device. We never see, store, or
                  transmit your files. What happens in your browser, stays in your browser.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Wifi className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900">Online & Offline</h3>
                </div>
                <p className="text-gray-600">
                  SlimFile works online with a medium-speed internet connection for optimal
                  compression performance. Offline mode is supported via Service Workers for basic
                  functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-lg bg-white/80 backdrop-blur-md">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Built with Modern Technology
              </h2>
              <div className="grid gap-6 sm:grid-cols-3 text-center">
                <div>
                  <Zap className="h-12 w-12 text-primary mx-auto mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-900 mb-2">React & TypeScript</h3>
                  <p className="text-sm text-gray-600">Modern, type-safe frontend development</p>
                </div>
                <div>
                  <ImageIcon className="h-12 w-12 text-primary mx-auto mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Algorithms</h3>
                  <p className="text-sm text-gray-600">Server-side image processing and optimization</p>
                </div>
                <div>
                  <Smartphone className="h-12 w-12 text-primary mx-auto mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-900 mb-2">Service Workers</h3>
                  <p className="text-sm text-gray-600">Reliable online and offline functionality with caching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
