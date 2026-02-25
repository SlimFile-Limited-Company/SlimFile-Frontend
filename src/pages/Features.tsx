import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Shield, 
  Download, 
  Smartphone, 
  Globe, 
  Layers,
  FileImage,
  FileText,
  Gauge,
  Lock,
  RefreshCw,
  Users,
  FileSpreadsheet,
  FileType
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast Compression",
    description: "Advanced algorithms compress your files up to 95% smaller without losing quality.",
    category: "Performance"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Privacy First",
    description: "All processing happens locally in your browser. Your files never leave your device.",
    category: "Security"
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Instant Download",
    description: "Download compressed files immediately after processing with a single click.",
    category: "User Experience"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Works Everywhere",
    description: "Responsive design that works perfectly on desktop, tablet, and mobile devices.",
    category: "Compatibility"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Works Online",
    description: "SlimFile Web App technology lets you compress files with an internet connection.",
    category: "Accessibility"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Multiple Formats",
    description: "Support for JPEG, PNG, WebP images, PDF documents, and Microsoft Office files (PPTX, DOCX, XLSX).",
    category: "Compatibility"
  },
  {
    icon: <FileImage className="w-8 h-8" />,
    title: "Smart Image Optimization",
    description: "Intelligent compression that maintains visual quality while reducing file size.",
    category: "Technology"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "PDF Compression",
    description: "Reduce PDF file sizes while preserving text clarity and image quality.",
    category: "Technology"
  },
  {
    icon: <FileType className="w-8 h-8" />,
    title: "Word Document Compression",
    description: "Compress DOCX files up to 95% by optimizing embedded images and removing unnecessary metadata.",
    category: "Technology"
  },
  {
    icon: <FileSpreadsheet className="w-8 h-8" />,
    title: "Excel Optimization",
    description: "Reduce XLSX file sizes up to 95% through image compression, metadata stripping, and XML optimization.",
    category: "Technology"
  },
  {
    icon: <Gauge className="w-8 h-8" />,
    title: "Real-time Progress",
    description: "Track compression progress with detailed statistics and progression bar.",
    category: "User Experience"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Large File Support",
    description: "Compress files up to 1GB each with no daily limits or restrictions.",
    category: "Freedom"
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Batch Processing",
    description: "Upload and compress multiple files at once to save time.",
    category: "Efficiency"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Registration",
    description: "Register just by selecting your google account. No need to enter any user credentials.",
    category: "Simplicity"
  }
];

const categories = ["All", "Performance", "Security", "User Experience", "Compatibility", "Technology", "Accessibility", "Freedom", "Efficiency", "Simplicity"];

export default function Features() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Everyone
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              SlimFile combines cutting-edge compression technology with an intuitive interface to deliver the best file compression experience on the web.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary font-semibold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Now with Microsoft Office support (DOCX, XLSX)!
            </div>
          </div>
        </div>
      </section>

      {/* Features Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                    <Badge variant="outline">{feature.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Compression Highlight Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                New Feature
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Microsoft Office Document Compression
              </h2>
              <p className="text-lg text-gray-600">
                Powerful compression for your Word documents and Excel spreadsheets
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <FileType className="w-10 h-10 text-primary" />
                    <CardTitle className="text-2xl">DOCX Compression</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Compress embedded images to reduce file size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Strip unnecessary metadata and revision history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Works even without images through XML optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Typical reduction: 5-30% (text) or up to 95% (with images)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <FileSpreadsheet className="w-10 h-10 text-primary" />
                    <CardTitle className="text-2xl">XLSX Compression</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Optimize charts and embedded images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Remove calculation chains (recalculated on open)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Maximum ZIP compression for better file size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Typical reduction: 5-30% (data) or up to 95% (with charts/images)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Safe & Compatible</h3>
                  <p className="text-blue-800 text-sm">
                    All optimizations are safe and non-destructive. Your documents open normally in Microsoft Office, Google Docs, 
                    and other compatible applications. All content, formatting, formulas, and functionality are preserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience SlimFile?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SlimFile for their compression needs. Start compressing your files today.
          </p>
          
        </div>
      </section>
    </div>
  );
}