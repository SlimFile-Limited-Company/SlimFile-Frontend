import React, { FC } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, FileImage, FileText, Download, Users, Sparkles, File, Image, FileDown } from "lucide-react";

// Add keyframes for blob animation
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 15s infinite;
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
    <div className="min-h-screen pt-5 bg-gradient-to-br from-slate-50 via-slate-50/95 to-red-50/80">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-red-50/50 opacity-70"></div>
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-red-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            {/* Glassmorphism Content Container */}
            <div className="relative">
              {/* Main Glass Card - Enhanced Glass Feel */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16 mx-1 sm:mx-4 lg:mx-6 transition-all duration-300 hover:backdrop-blur-3xl hover:bg-white/15 hover:border-white/20">
                {/* Glass reflection effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                {/* Subtle border highlight */}
                <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-8 sm:mb-10 flex flex-col items-center gap-6 sm:gap-4">
                    {/* Trust Badges with Enhanced Glass Effect - Stronger Glass Feel */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                      <div className="flex items-center gap-3 text-red-600 text-sm font-medium">
                        <Sparkles className="w-5 h-5" />
                        <span>Trusted by 10K+ users worldwide</span>
                      </div>

                      <div className="hidden sm:block text-gray-400">•</div>
                      
                      <a
                        target="_blank"
                        href="https://betalist.com/startups/slimfile-inc?utm_campaign=badge-slimfile-inc&utm_medium=badge&utm_source=badge-featured"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 text-sm font-medium hover:text-red-600 transition-colors duration-300"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Featured on BetaList</span>
                      </a>
                    </div>

                    {/* Enhanced Main Title with Better Mobile Scaling */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-6 leading-tight px-1 sm:px-2">
                      <span className="block text-gray-900 mb-1">
                        File Compression
                      </span>
                      <span className="text-red-600 block">
                        Made Simple
                      </span>
                    </h1>

                    {/* Enhanced Description with Better Mobile Layout */}
                    <div className="max-w-3xl mx-1 sm:mx-2">
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
                        Reduce file sizes instantly without losing quality
                        <br className="hidden sm:block" />
                        <span className="text-red-600 font-semibold">
                          <span className="sm:hidden">&nbsp;</span>Fast and secure
                        </span> compression for images, PDFs, and PPTX.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons with Better Mobile Spacing */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2 sm:px-4">
                    <div>
                      <Link to="/compress">
                        <Button
                          size="lg"
                          className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 transform hover:scale-105 border-2 border-white/30 w-full sm:w-auto"
                        >
                          <span className="flex items-center justify-center">
                            Start Compressing
                          </span>
                          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
                        </Button>
                      </Link>
                    </div>

                    <div>
                      <Link to="/api">
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-white/20 border-2 border-red-200/70 text-red-600 hover:bg-red-50/90 hover:border-red-300/90 transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] w-full sm:w-auto"
                        >
                          <span>SlimFile API</span>
                        </Button>
                      </Link>
                    </div>

                    <div>
                      <a
                        href="https://gofund.me/dcf07947"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-white/20 border-2 border-gray-200/70 text-gray-600 hover:bg-gray-50/90 hover:border-gray-300/90 transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] w-full sm:w-auto"
                        >
                          <span>Support Us</span>
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Enhanced Stats Counter with Better Mobile Layout */}
                  <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-1 sm:px-2">
                    {[
                      { value: "12K+", label: "Files Compressed", icon: FileImage },
                      { value: "95%", label: "Avg Size Reduction", icon: Zap },
                      { value: "24/7", label: "Always Available", icon: Globe }
                    ].map((stat, index) => (
                      <div
                        key={stat.label}
                        className="bg-white/25 rounded-2xl p-5 sm:p-4 border-2 border-white/40 shadow-2xl hover:bg-white/30 transition-all duration-300"
                      >
                        <div className="w-14 h-14 sm:w-12 sm:h-12 bg-red-100/70 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-white/50">
                          <stat.icon className="w-7 h-7 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <div className="text-2xl sm:text-xl font-bold text-gray-900 mb-1 text-center">
                          {stat.value}
                        </div>
                        <div className="text-sm sm:text-xs text-gray-600 font-medium text-center leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How to Use SlimFile
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch our quick tutorial to learn how to compress your files in just a few simple steps.
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-transparent transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <video
                className="w-full h-auto rounded-2xl"
                controls
                poster="/lovable-uploads/thumbnail.png"
              >
                <source src="/lovable-uploads/Short.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-8 text-center">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    Try It Now
                  </span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: 12, suffix: "K+", label: "Files Compressed", icon: FileImage, color: "red" },
              { value: 95, suffix: "%", label: "Average Size Reduction", icon: Zap, color: "green" },
              { value: 100, suffix: "%", label: "Secure Processing", icon: Shield, color: "blue" },
              { value: 24, suffix: "/7", label: "Always Available", icon: Globe, color: "purple" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors duration-300">
                    <stat.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Powerful Compression Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your files, from individual images to bulk document processing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileImage,
                title: "Image Compression",
                description: "Optimize JPEG, PNG, and WebP images while maintaining visual quality.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: FileText,
                title: "PDF and PPTX Compression",
                description: "Reduce PDF and PPTX file sizes significantly without losing document quality.",
                color: "red",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: Download,
                title: "Batch Processing",
                description: "Compress multiple files at once with our powerful batch tools.",
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-3 h-full">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-center">
                    <Link to="/compress">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-6 py-2 transition-all duration-300"
                      >
                        <span className="flex items-center">
                          Try Now
                        </span>
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose SlimFile?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most reliable and user-friendly file compression platform on the web.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Advanced algorithms compress your files in seconds, not minutes."
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "All processing happens locally in your browser. Your files never leave your device."
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                description: "Access from any device, any browser. No downloads or installations required."
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-300">
                    <feature.icon className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-red-700/90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Compress Your Files?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join millions of users who trust SlimFile for their compression needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/compress">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 rounded-2xl bg-white text-red-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/teams">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 rounded-2xl text-red-600 bg-white border border-white/30 hover:bg-white/80 hover:text-red-700 hover:border-white transition-all duration-300"
                  >
                    <Users className="mr-2 w-5 h-5" />
                    Meet Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
