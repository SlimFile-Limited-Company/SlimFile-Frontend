import React, { FC } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, FileImage, FileText, Download, Users, Sparkles, CheckCircle2, Star, FileSpreadsheet, FileType } from "lucide-react";

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-blob {
    animation: blob 15s infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(style);
import { Button } from "@/components/ui/button";
import { isAuthenticated } from '@/lib/auth';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

const getApiBase = (): string => {
  return import.meta.env.VITE_API_URL || "https://slimfile-backend.onrender.com";
};

const Home: FC = () => {
  const navigate = useNavigate();
  const [compressedCount, setCompressedCount] = useState<number>(0);

  useEffect(() => {
    const API_BASE = getApiBase();
    fetch(`${API_BASE}/api/stats`, { credentials: 'omit' })
      .then(res => res.json())
      .then(data => setCompressedCount(typeof data.compressedCount === 'number' ? data.compressedCount : 0))
      .catch(() => setCompressedCount(0));

    const socket = io(API_BASE, {
      transports: ['websocket'],
    });

    socket.on("statsUpdate", (newCount: number) => {
      if (typeof newCount === 'number') setCompressedCount(newCount);
    });

    return () => {
      socket.off("statsUpdate");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      {/* Hero Section - Enhanced */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-red-100 to-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-50 to-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-float">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-red-100">
                <Star className="w-4 h-4 text-red-600 fill-red-600" />
                <span className="text-sm font-semibold text-gray-800">10K+ Happy Users</span>
              </div>
              <a
                target="_blank"
                href="https://betalist.com/startups/slimfile-inc"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-red-100 hover:border-red-300 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-800">Featured on BetaList</span>
              </a>
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Now with Office Support!</span>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="text-center space-y-8">
              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  File Compression
                </span>
                <span className="block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Reduce file sizes instantly without losing quality.
                <span className="block mt-2 text-red-600 font-semibold">Fast, secure, and powerful compression for images, PDFs, and Office documents</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/compress">
                  <Button
                    size="lg"
                    className="group relative text-lg px-10 py-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-3">
                      Start Compressing Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <a href="https://api.slim-file.com/" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 py-6 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto"
                  >
                    Explore API
                  </Button>
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
                {[
                  { value: "12K+", label: "Files Compressed" },
                  { value: "95%", label: "Size Reduction" },
                  { value: "24/7", label: "Available" }
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-100">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Supported formats:</span>
            <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2">
              <FileImage className="w-4 h-4 text-red-600" />
              <span>JPEG, PNG, WebP</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span>PDF, PPTX</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full px-4 py-2">
              <FileType className="w-4 h-4" />
              <span className="font-semibold">DOCX, XLSX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned with Office Documents */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful compression tools for all your file types
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: FileImage,
                title: "Image Compression",
                description: "Optimize JPEG, PNG, and WebP images while maintaining visual quality.",
                features: ["Smart algorithms", "Batch processing", "Up to 95% reduction"],
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: FileText,
                title: "PDF & Presentations",
                description: "Reduce PDF and PPTX file sizes significantly without losing quality.",
                features: ["PDF optimization", "PPTX support", "Fast processing"],
                gradient: "from-red-500 to-red-600"
              },
              {
                icon: FileType,
                title: "Word Documents",
                description: "Compress DOCX files through image optimization and metadata removal.",
                features: ["DOCX support", "XML optimization", "Up to 95% smaller"],
                gradient: "from-purple-500 to-purple-600",
                badge: "New"
              },
              {
                icon: FileSpreadsheet,
                title: "Excel Spreadsheets",
                description: "Optimize XLSX files by compressing charts and removing unnecessary data.",
                features: ["XLSX support", "Chart compression", "Fast & safe"],
                gradient: "from-green-500 to-green-600",
                badge: "New"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group relative">
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-gray-100 hover:border-red-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl h-full">
                  {/* New Badge */}
                  {feature.badge && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {feature.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-red-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/compress">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-0 transition-all duration-300 group-hover:gap-2"
                    >
                      <span className="flex items-center gap-1">
                        Try Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Documents Highlight Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white border-y border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full px-6 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">NEW FEATURE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Microsoft Office Document Compression
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Now supporting Word documents and Excel spreadsheets with powerful compression
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileType className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">DOCX Files</h3>
                    <p className="text-sm text-gray-600">Word Documents</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Compress embedded images and graphics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Remove unnecessary metadata and revision history</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Works even without images through XML optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>5-30% reduction</strong> for text-only documents
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Up to 95% reduction</strong> for documents with images
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">XLSX Files</h3>
                    <p className="text-sm text-gray-600">Excel Spreadsheets</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optimize charts and embedded images</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Remove calculation chains (auto-recalculated on open)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Maximum ZIP compression for better file size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>5-30% reduction</strong> for data-only spreadsheets
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Up to 95% reduction</strong> for files with charts/images
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try Office Compression Now
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                See It In Action
              </h2>
              <p className="text-xl text-gray-600">
                Watch how easy it is to compress your files with SlimFile
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-auto"
                  controls
                  poster="/lovable-uploads/thumbnail.png"
                >
                  <source src="/lovable-uploads/Short.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try It Yourself
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose SlimFile?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most reliable file compression platform on the web
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Advanced algorithms compress your files in seconds, not minutes.",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "All processing happens in your browser. Your files never leave your device.",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                description: "Access from any device, any browser. No downloads required.",
                gradient: "from-purple-400 to-purple-600"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                  {/* Icon with gradient */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of users who trust SlimFile for their compression needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-2xl bg-white text-red-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Start Compressing Now
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/teams">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 rounded-2xl bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  <Users className="mr-2 w-5 h-5" />
                  Meet Our Team
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-8">
              <a
                href="https://gofund.me/dcf07947"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <span>Support our mission</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;