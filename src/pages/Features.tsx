
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
  Users
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast Compression",
    description: "Advanced algorithms compress your files up to 80% smaller without losing quality.",
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
    description: "Support for JPEG, PNG, WebP images, PPTX and PDF documents with more formats coming.",
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
    icon: <Gauge className="w-8 h-8" />,
    title: "Real-time Progress",
    description: "Track compression progress with detailed statistics and progression bar.",
    category: "User Experience"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Large File Support",
    description: "Compress files up to 200MB each with no daily limits or restrictions.",
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
    description: "Register just by selecting your google account,No need to enter any user credentials ",
    category: "Simplicity"
  }
];

const categories = ["All", "Performance", "Security", "User Experience", "Compatibility", "Technology", "Accessibility", "Freedom", "Efficiency", "Simplicity"];

export default function Features() {
  return (
    <div className="min-h-screen bg-white pt-16">
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
