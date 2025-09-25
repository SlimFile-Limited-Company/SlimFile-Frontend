import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, FileImage, FileText, Download, Users, Sparkles, File, Image, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from '@/lib/auth';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { motion } from "framer-motion";

const getApiBase = () => {
  return import.meta.env.VITE_API_URL || "https://slimfile-backend.onrender.com";
};

const Home = () => {
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
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-red-50/20"></div>
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 15, -10, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-300/10 rounded-full blur-2xl"
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-red-400/15 rounded-full blur-xl"
          animate={{ x: [0, -40, 25, 0], y: [0, 25, -15, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="h-8 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium text-gray-900">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 bg-gray-900 rounded-sm"></div>
                    <div className="w-6 h-3 border border-gray-900 rounded-sm"></div>
                  </div>
                </div>
                <div className="p-4 h-full bg-gradient-to-b from-red-50 to-white">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Compress Files</h3>
                    <p className="text-sm text-gray-600">Reduce size by 95%</p>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-3">Original</p>
                      <div className="flex justify-center space-x-2">
                        <motion.div
                          className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center"
                          animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                        </motion.div>
                        <motion.div
                          className="w-8 h-10 bg-green-100 rounded flex items-center justify-center"
                          animate={{ y: [0, -3, 0], rotate: [0, -2, 2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        >
                          <Image className="w-4 h-4 text-green-600" />
                        </motion.div>
                        <motion.div
                          className="w-8 h-10 bg-purple-100 rounded flex items-center justify-center"
                          animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        >
                          <File className="w-4 h-4 text-purple-600" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Zap className="w-6 h-6 text-red-600" />
                      </motion.div>
                      <p className="text-xs text-gray-500">Compressing...</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-3">Compressed</p>
                      <div className="flex justify-center space-x-2">
                        <motion.div
                          className="w-6 h-8 bg-blue-50 rounded flex items-center justify-center border border-blue-200"
                          animate={{ y: [0, -2, 0], scale: [1, 0.9, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <FileText className="w-3 h-3 text-blue-500" />
                        </motion.div>
                        <motion.div
                          className="w-6 h-8 bg-green-50 rounded flex items-center justify-center border border-green-200"
                          animate={{ y: [0, -2, 0], scale: [1, 0.9, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        >
                          <Image className="w-3 h-3 text-green-500" />
                        </motion.div>
                        <motion.div
                          className="w-6 h-8 bg-purple-50 rounded flex items-center justify-center border border-purple-200"
                          animate={{ y: [0, -2, 0], scale: [1, 0.9, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        >
                          <File className="w-3 h-3 text-purple-500" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="flex items-center justify-center space-x-1 mt-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FileDown className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-bold text-red-600">95%</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.div
                      className="w-full h-10 bg-red-600 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4 text-white mr-2" />
                      <span className="text-sm font-medium text-white">Download</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="hidden lg:block relative"
            >
              <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  <div className="h-8 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium text-gray-900">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-gray-900 rounded-sm"></div>
                      <div className="w-6 h-3 border border-gray-900 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="p-4 h-full bg-gradient-to-b from-green-50 to-white">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Batch Compress</h3>
                      <p className="text-sm text-gray-600">Multiple files at once</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded flex items-center justify-center ${
                                i === 1 ? 'bg-blue-100' : i === 2 ? 'bg-green-100' : i === 3 ? 'bg-purple-100' : 'bg-orange-100'
                              }`}>
                                {i === 1 ? <FileText className="w-3 h-3 text-blue-600" /> :
                                 i === 2 ? <Image className="w-3 h-3 text-green-600" /> :
                                 i === 3 ? <File className="w-3 h-3 text-purple-600" /> :
                                 <FileText className="w-3 h-3 text-orange-600" />}
                              </div>
                              <span className="text-xs text-gray-700">file_{i}.pdf</span>
                            </div>
                            <motion.div
                              className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                            >
                              <Zap className="w-2 h-2 text-red-600" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Progress</span>
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            4/4 files
                          </motion.span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-red-600 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Total saved:</span>
                          <motion.span
                            className="text-green-600 font-bold"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            100.5 MB
                          </motion.span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Time saved:</span>
                          <span className="text-green-600 font-bold">95%</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <motion.div
                        className="w-full h-10 bg-red-600 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="w-4 h-4 text-white mr-2" />
                        <span className="text-sm font-medium text-white">Download All</span>
                      </motion.div>
                      <motion.div
                        className="w-full h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xs font-medium text-gray-600">Share</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
              className="mb-8 flex flex-col items-center gap-4"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(254, 242, 242, 0.8)", transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Trusted by 7K+ users worldwide
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a 
                  target="_blank" 
                  href="https://betalist.com/startups/slimfile-inc?utm_campaign=badge-slimfile-inc&amp;utm_medium=badge&amp;utm_source=badge-featured"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <Sparkles className="w-4 h-4 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">Featured on BetaList</span>
                </a>
              </motion.div>
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
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
                >
                  File Compression
                </motion.span>
                <motion.span 
                  className="text-red-600 block bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                  variants={{
                    hidden: { opacity: 0, y: 30, rotateX: -90 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 } }
                  }}
                >
                  Made Simple
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Reduce file sizes instantly without compromising quality. Fast, secure, and completely free compression for images, PDFs, and PPTX.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
                      Start Compressing
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/api">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 relative overflow-hidden group"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      SlimFile API
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-red-100 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
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
                    className="text-lg px-8 py-4 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 relative overflow-hidden group"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      Support Us
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gray-100 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </a>
              </motion.div>
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
                poster="/lovable-uploads/thumbnail.jpg"
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
    </div> {/* Closing the root div */}
  );
};

export default Home;
