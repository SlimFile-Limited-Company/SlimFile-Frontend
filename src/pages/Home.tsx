import React, { FC } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, FileImage, FileText, Download, Users, Sparkles, File, Image, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from '@/lib/auth';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { motion, MotionProps } from "framer-motion";

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
    <div className="min-h-screen pt-5">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-red-50/30 overflow-hidden">
        {/* Enhanced Glassmorphism Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 via-white/70 to-red-50/20 backdrop-blur-3xl"></div>

        {/* Animated Glass Orbs - Enhanced Glass Feel */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-red-200/25 via-red-100/35 to-red-50/45 rounded-full blur-3xl backdrop-blur-2xl border-2 border-white/40 shadow-2xl"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 90, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: 'blur(15px)' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-tr from-red-300/20 via-red-200/30 to-red-100/40 rounded-full blur-3xl backdrop-blur-2xl border-2 border-white/50 shadow-2xl"
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 0.8, 1.2, 1],
            rotate: [0, -90, -180, -360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: 'blur(15px)' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-red-400/15 via-red-300/25 to-red-200/35 rounded-full blur-2xl backdrop-blur-2xl border-2 border-white/60 shadow-2xl"
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.3, 0.7, 1],
            rotate: [0, 180, 360, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: 'blur(15px)' }}
        />

        {/* Enhanced Floating Glass Particles - More Glass-like */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-red-400/50 rounded-full backdrop-blur-lg border-2 border-white/70 shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backdropFilter: 'blur(5px)',
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0.5, 0.9, 0.5],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Additional Mobile Glass Elements - Enhanced */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-red-300/25 via-red-200/35 to-red-100/45 rounded-full blur-xl backdrop-blur-2xl border-2 border-white/60 shadow-xl hidden sm:block"
          animate={{
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 180, 360, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: 'blur(12px)' }}
        />

        <div className="container mx-auto text-center relative z-10 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            {/* Glassmorphism Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Main Glass Card - Enhanced Glass Feel */}
              <div className="relative backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 sm:p-12 lg:p-16 mx-1 sm:mx-4 lg:mx-6" style={{ backdropFilter: 'blur(20px)' }}>
                {/* Enhanced Inner Glass Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-red-50/30 rounded-3xl border-2 border-white/50 shadow-inner"
                  animate={{
                    opacity: [0.7, 0.9, 0.7],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ backdropFilter: 'blur(10px)' }}
                />

                {/* Mobile Glass Accent - Enhanced Glass Feel */}
                <motion.div
                  className="absolute top-6 right-6 w-20 h-20 sm:w-20 sm:h-20 bg-gradient-to-br from-red-200/40 via-red-100/50 to-red-50/60 rounded-full blur-lg backdrop-blur-2xl border-2 border-white/70 shadow-xl sm:hidden"
                  animate={{
                    scale: [1, 1.2, 0.9, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 90, 180, 270, 360]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ backdropFilter: 'blur(8px)' }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="mb-8 sm:mb-10 flex flex-col items-center gap-6 sm:gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {/* Trust Badges with Enhanced Glass Effect - Stronger Glass Feel */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-4 w-full max-w-2xl">
                      <motion.div
                        className="inline-flex items-center gap-3 backdrop-blur-2xl bg-white/30 text-red-600 px-8 py-4 rounded-full text-sm sm:text-sm font-medium border-2 border-white/50 shadow-2xl w-full sm:w-auto justify-center"
                        style={{ backdropFilter: 'blur(12px)' }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.45)",
                          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)"
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <span className="text-center">Trusted by 10K+ users worldwide</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full sm:w-auto"
                      >
                        <a
                          target="_blank"
                          href="https://betalist.com/startups/slimfile-inc?utm_campaign=badge-slimfile-inc&utm_medium=badge&utm_source=badge-featured"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 backdrop-blur-2xl bg-white/25 text-gray-700 px-8 py-4 rounded-full text-sm font-medium border-2 border-white/50 shadow-2xl hover:bg-white/35 hover:border-white/60 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group w-full sm:w-auto justify-center"
                          style={{ backdropFilter: 'blur(12px)' }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 flex-shrink-0"
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                          <span className="relative z-10 text-center">Featured on BetaList</span>
                        </a>
                      </motion.div>
                    </div>

                    {/* Enhanced Main Title with Better Mobile Scaling */}
                    <motion.h1
                      className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-10 leading-tight px-1 sm:px-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
                      }}
                    >
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: 30, rotateX: -90 },
                          visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
                        }}
                        className="block backdrop-blur-2xl bg-white/15 rounded-2xl px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/40 shadow-2xl mb-2"
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        File Compression
                      </motion.span>
                      <motion.span
                        className="text-red-600 block bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent drop-shadow-lg"
                        variants={{
                          hidden: { opacity: 0, y: 30, rotateX: -90 },
                          visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 } }
                        }}
                      >
                        Made Simple
                      </motion.span>
                    </motion.h1>

                    {/* Enhanced Description with Better Mobile Layout */}
                    <motion.div
                      className="backdrop-blur-2xl bg-white/20 rounded-2xl px-6 sm:px-8 py-5 sm:py-6 border-2 border-white/40 shadow-2xl max-w-4xl mx-1 sm:mx-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ backdropFilter: 'blur(12px)' }}
                    >
                      <motion.p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center" style={{ wordSpacing: '0.1em' }}>
                        Reduce file sizes instantly without losing quality&nbsp;
                        <br className="hidden sm:block" />
                        <span className="text-red-600 font-semibold text-xl sm:text-2xl">Fast and secure</span> compression for images, PDFs, and PPTX.
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Action Buttons with Better Mobile Spacing */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2 sm:px-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link to="/compress">
                        <Button
                          size="lg"
                          className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group backdrop-blur-lg border-2 border-white/30 w-full sm:w-auto"
                          style={{ backdropFilter: 'blur(8px)' }}
                        >
                          <motion.span
                            className="relative z-10 flex items-center justify-center"
                            initial={{ x: 0 }}
                            whileHover={{ x: -5 }}
                            transition={{ duration: 0.3 }}
                          >
                            Start Compressing
                          </motion.span>
                          <motion.div
                            className="ml-3 relative z-10"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link to="/api">
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl backdrop-blur-2xl bg-white/20 border-2 border-red-200/70 text-red-600 hover:bg-red-50/90 hover:border-red-300/90 transition-all duration-300 relative overflow-hidden group shadow-2xl hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] w-full sm:w-auto"
                          style={{ backdropFilter: 'blur(12px)' }}
                        >
                          <motion.span
                            className="relative z-10"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            SlimFile API
                          </motion.span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-50/60 to-red-100/60 rounded-2xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <a
                        href="https://gofund.me/dcf07947"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl backdrop-blur-2xl bg-white/20 border-2 border-gray-200/70 text-gray-600 hover:bg-gray-50/90 hover:border-gray-300/90 transition-all duration-300 relative overflow-hidden group shadow-2xl hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] w-full sm:w-auto"
                          style={{ backdropFilter: 'blur(12px)' }}
                        >
                          <motion.span
                            className="relative z-10"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            Support Us
                          </motion.span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gray-50/60 to-gray-100/60 rounded-2xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </a>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Stats Counter with Better Mobile Layout */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-1 sm:px-2"
                  >
                    {[
                      { value: "12K+", label: "Files Compressed", icon: FileImage },
                      { value: "95%", label: "Avg Size Reduction", icon: Zap },
                      { value: "24/7", label: "Always Available", icon: Globe }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="backdrop-blur-2xl bg-white/25 rounded-2xl p-5 sm:p-4 border-2 border-white/40 shadow-2xl hover:bg-white/30 transition-all duration-300"
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        <motion.div
                          className="w-14 h-14 sm:w-12 sm:h-12 bg-red-100/70 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-white/50"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          style={{ backdropFilter: 'blur(5px)' }}
                        >
                          <stat.icon className="w-7 h-7 sm:w-6 sm:h-6 text-red-600" />
                        </motion.div>
                        <div className="text-2xl sm:text-xl font-bold text-gray-900 mb-1 text-center">
                          {stat.value}
                        </div>
                        <div className="text-sm sm:text-xs text-gray-600 font-medium text-center leading-tight">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How to Use SlimFile
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch our quick tutorial to learn how to compress your files in just a few simple steps.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-transparent transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <video
                className="w-full h-auto rounded-2xl"
                controls
                poster="/lovable-uploads/thumbnail.png"
              >
                <source src="/lovable-uploads/Short.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <motion.div
                className="absolute inset-0 border-4 border-red-600/30 rounded-2xl pointer-events-none"
                animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10 flex items-center"
                    initial={{ x: 0 }}
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    Try It Now
                  </motion.span>
                  <motion.div
                    className="ml-2 relative z-10"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { value: 12, suffix: "K+", label: "Files Compressed", icon: FileImage, color: "red" },
              { value: 95, suffix: "%", label: "Average Size Reduction", icon: Zap, color: "green" },
              { value: 100, suffix: "%", label: "Secure Processing", icon: Shield, color: "blue" },
              { value: 24, suffix: "/7", label: "Always Available", icon: Globe, color: "purple" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                  whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0, rotate: 0 }}
                    whileHover={{ scale: 1, rotate: 5 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors duration-300 relative z-10"
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-8 h-8 text-red-600" />
                  </motion.div>
                  <motion.div 
                    className="text-4xl font-bold text-gray-900 mb-2 relative z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}{stat.suffix}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="text-gray-600 font-medium relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                    viewport={{ once: true }}
                  >
                    {stat.label}
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Powerful Compression Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your files, from individual images to bulk document processing.
            </p>
          </motion.div>
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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div 
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-3 h-full relative overflow-hidden"
                  whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    initial={{ scale: 0, rotate: 0 }}
                    whileHover={{ scale: 1, rotate: 2 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div 
                    className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-300 relative z-10"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, y: -5 }}
                    animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <feature.icon className="w-8 h-8 text-red-600" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-4 text-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 text-center mb-6 leading-relaxed relative z-10"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                  <div className="text-center relative z-10">
                    <Link to="/compress">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-6 py-2 transition-all duration-300 relative overflow-hidden group/btn"
                        >
                          <motion.span
                            className="flex items-center"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                          >
                            Try Now
                          </motion.span>
                          <motion.div
                            className="ml-1"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: index * 0.2 + 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose SlimFile?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most reliable and user-friendly file compression platform on the web.
            </p>
          </motion.div>
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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-300">
                    <feature.icon className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
