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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section - Figma Pro Design */}
      <section className="relative pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Bold Gradient Background - Figma Style */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Modern gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-400 to-pink-500 opacity-90"></div>

          {/* Noise texture overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-transparent to-blue-500/30"></div>

          {/* Large animated gradient orbs */}
          <div className="absolute -top-1/3 -left-1/4 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1200px] md:h-[1200px] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-1/3 -right-1/4 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1200px] md:h-[1200px] bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px] bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

          {/* Bright accent spots */}
          <div className="absolute top-20 right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-2xl opacity-60 animate-blob animation-delay-2000"></div>

          {/* Subtle light overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Trust Badges - Glass Morphism */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 animate-float">
              <div className="group flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-2xl border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-300">
                <div className="relative">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                </div>
                <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">10K+ Users</span>
              </div>
              <a
                target="_blank"
                href="https://betalist.com/startups/slimfile-inc"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-2xl border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg group-hover:rotate-12 transition-transform" />
                <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">Featured on BetaList</span>
              </a>
              <div className="group flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-2xl border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg animate-pulse" />
                <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">Office Support</span>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="text-center space-y-6 sm:space-y-8">
              {/* Headline - Bold White Text on Gradient */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                <span className="block text-white mb-2 sm:mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  File Compression
                </span>
                <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] [text-shadow:_0_0_30px_rgba(255,255,255,0.5)]">
                  Made Simple
                </span>
              </h1>

              {/* Subtitle - Glass Morphism Style */}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed px-2 font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
                Reduce file sizes instantly without losing quality.
              </p>
              <div className="flex justify-center px-2">
                {/* Mobile version - Slim it. Save it. Send it */}
                <span className="md:hidden inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-5 py-3 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <Zap className="w-5 h-5 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
                  <span className="font-bold text-white text-sm drop-shadow-lg">Slim it. Save it. Send it</span>
                </span>

                {/* Desktop version - Full description */}
                <span className="hidden md:inline-flex items-center gap-2 sm:gap-3 bg-white/25 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
                  <span className="font-bold text-white text-sm sm:text-base md:text-lg drop-shadow-lg">Fast, secure, and powerful compression for images, PDFs, and Office documents</span>
                </span>
              </div>

              {/* CTA Buttons - Glass Morphism Style */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center pt-8">
                <Link to="/compress" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group relative text-base sm:text-lg font-black px-10 sm:px-12 md:px-14 py-6 sm:py-7 md:py-8 rounded-2xl bg-white text-gray-900 hover:bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:scale-105 w-full overflow-hidden"
                  >
                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                    <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                      Start Compressing Free
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <a href="https://api.slim-file.com/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group text-base sm:text-lg font-bold px-10 sm:px-12 md:px-14 py-6 sm:py-7 md:py-8 rounded-2xl border-2 border-white/40 bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 hover:border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 w-full"
                  >
                    <span className="flex items-center justify-center gap-2 drop-shadow-lg">
                      Explore API
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </a>
              </div>

              {/* Quick Stats - Glass Morphism Cards - Optimized for Mobile */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto pt-10 sm:pt-12 md:pt-14">
                {[
                  { value: "12K+", label: "Files Compressed", mobileLabel: "Files", icon: "📊" },
                  { value: "95%", label: "Size Reduction", mobileLabel: "Reduction", icon: "⚡" },
                  { value: "24/7", label: "Available", mobileLabel: "Available", icon: "🌐" }
                ].map((stat, index) => (
                  <div key={stat.label} className="group relative">
                    <div className="relative bg-white/25 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 border-2 border-white/30 hover:bg-white/35 hover:border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-2">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="text-center relative z-10">
                        <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{stat.icon}</div>
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-1 sm:mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                          {stat.value}
                        </div>
                        {/* Mobile label */}
                        <div className="block sm:hidden text-[10px] text-white/90 font-bold drop-shadow-lg leading-tight">
                          {stat.mobileLabel}
                        </div>
                        {/* Desktop label */}
                        <div className="hidden sm:block text-xs sm:text-sm md:text-base text-white/90 font-bold drop-shadow-lg">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats Banner - Glass Morphism Style */}
      <section className="relative py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 border-y border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-500/20"></div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <span className="font-black text-white text-base sm:text-lg drop-shadow-lg">Supported formats:</span>
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-lg rounded-full px-4 py-2 sm:px-5 sm:py-2.5 border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300">
              <FileImage className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" />
              <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">JPEG, PNG, WebP</span>
            </div>
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-lg rounded-full px-4 py-2 sm:px-5 sm:py-2.5 border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" />
              <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">PDF, PPTX</span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-lg text-white rounded-full px-4 py-2 sm:px-5 sm:py-2.5 border-2 border-white/50 shadow-xl hover:bg-white/50 transition-all duration-300 hover:scale-105">
              <FileType className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
              <span className="font-black text-sm sm:text-base drop-shadow-lg">DOCX, XLSX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned with Office Documents */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Powerful compression tools for all your file types
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
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
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-gray-100 hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  {feature.badge && (
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                      {feature.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/compress">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Now
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white border-y border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-semibold text-xs sm:text-sm">NEW FEATURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Microsoft Office Document Compression
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Now supporting Word documents and Excel spreadsheets with powerful compression
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FileType className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">DOCX Files</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Word Documents</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Compress embedded images and graphics",
                    "Remove unnecessary metadata and revision history",
                    "Works even without images through XML optimization",
                    "5-30% reduction for text-only documents",
                    "Up to 95% reduction for documents with images"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">XLSX Files</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Excel Spreadsheets</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Optimize charts and embedded images",
                    "Remove calculation chains (auto-recalculated on open)",
                    "Maximum ZIP compression for better file size",
                    "5-30% reduction for data-only spreadsheets",
                    "Up to 95% reduction for files with charts/images"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try Office Compression Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* File Conversion Section - NEW */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white border-y border-purple-100">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-semibold text-xs sm:text-sm">NEW FEATURES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                File Conversion Tools
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Convert your files between different formats with our powerful conversion tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
              {/* Convert Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Convert Only
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Transform your files between different formats without compression. Perfect for format compatibility.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "Image formats: JPG, PNG, WebP, PDF",
                      "Office docs: DOCX, PPTX, XLSX to PDF",
                      "PDF to Images (ZIP)"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/convert-only">
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Convert Only
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert and Compress */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-red-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Convert & Compress
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    The ultimate two-in-one solution. Convert between formats AND optimize file size in a single step.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "All conversion features included",
                      "Maximum file size reduction",
                      "Perfect quality with smaller files"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/convert-compress">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Convert & Compress
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Compress Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <FileImage className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Compress Only
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Reduce file sizes while maintaining the same format. Ideal for storage optimization and faster sharing.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "Images: JPEG, PNG, WebP",
                      "Documents: PDF, DOCX, PPTX, XLSX",
                      "Up to 95% size reduction"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/compress">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Compress Only
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 w-full max-w-4xl mx-auto">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Choose Your Tool</h4>
                  <p className="text-sm text-gray-600">Select the perfect tool for your needs</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link to="/convert-only" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Convert Only
                    </Button>
                  </Link>
                  <Link to="/convert-compress" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Convert & Compress
                    </Button>
                  </Link>
                  <Link to="/compress" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Compress Only
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                See It In Action
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Watch how easy it is to compress your files with SlimFile
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
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

            <div className="text-center mt-6 sm:mt-8">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try It Yourself
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose SlimFile?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The most reliable file compression platform on the web
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 shadow-lg hover:shadow-xl">
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 px-4">
              Join thousands of users who trust SlimFile for their compression needs
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link to="/compress" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl bg-white text-red-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <span className="flex items-center gap-2">
                    Start Compressing Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/teams" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 w-full"
                >
                  <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Meet Our Team
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-6 sm:mt-8">
              <a
                href="https://gofund.me/dcf07947"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <span>Support our mission</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
