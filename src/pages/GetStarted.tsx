import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, FileText, FileImage, Users, Radio, Video, PenTool, ScanText, FileType, FilePlus2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GetStarted: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 pt-24">
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6 mb-12">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  Hello, What do you want to do today?
                </span>

              </h1>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {/* Compress Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-blue-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    Popular
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileImage className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Compress Only
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Reduce file sizes while maintaining the same format. Perfect for storage optimization.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Images: JPEG, PNG, WebP",
                      "Documents: PDF, DOCX",
                      "Up to 95% reduction",
                      "Keep original format"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/compress" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-purple-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Convert Only
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Transform files between different formats without compression. Perfect for compatibility.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Image formats: JPG, PNG, WebP",
                      "Office docs to PDF",
                      "PDF to Images (ZIP)",
                      "No quality loss"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/convert-only" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert & Compress */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-red-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    Best Value
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Convert & Compress
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    The ultimate two-in-one solution. Convert formats AND optimize file size in one step.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "All conversion features",
                      "Maximum size reduction",
                      "Perfect quality",
                      "One-step processing"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/convert-compress" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Create Workspace */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-green-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    Team
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Create Workspace
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Collaborate on projects with your team. Communicate in real-time and stay organized together.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Real-time team chat",
                      "Share links & resources",
                      "Voice messages",
                      "Member management"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/workspaces" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* OCR Tool */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-orange-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ScanText className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    OCR Tool
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Extract text from images and scanned documents. Convert pictures to editable text instantly.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Scan images & PDFs",
                      "Extract text accurately",
                      "Multiple languages",
                      "Export as text/PDF"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/ocr-tool" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Feed */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-indigo-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    Live
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Radio className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Feed
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Stay updated with real-time activity feed. See what's happening across your workspaces.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Real-time updates",
                      "Activity tracking",
                      "Workspace insights",
                      "Team notifications"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/feed" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Meet */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-cyan-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-cyan-200 hover:border-cyan-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Meet
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Host video meetings with your team. Connect face-to-face from anywhere in the world.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "HD video calls",
                      "Screen sharing",
                      "Instant meetings",
                      "No downloads needed"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/meet" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* My Whiteboards */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-pink-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    My Whiteboards
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Create and manage personal whiteboards. Brainstorm ideas, sketch concepts, and organize visually.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Drawing tools",
                      "Text & shapes",
                      "Save & export",
                      "Multiple boards"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/my-whiteboards" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              {/* My Documents */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-sky-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-sky-200 hover:border-sky-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileType className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    My Documents
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Create and edit documents with a professional word processor. Format, style, and export with ease.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Rich text formatting",
                      "Tables & images",
                      "Import & export DOCX",
                      "Auto-save & organize"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/documents" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              {/* PDF Merger & Splitter */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-amber-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FilePlus2 className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    PDF Merger & Splitter
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Combine multiple PDFs into one document, or split a PDF into separate pages or custom sections.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "Merge up to 20 PDFs",
                      "Split by page ranges",
                      "Drag to reorder files",
                      "Instant ZIP download"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/forge" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* PDF Password Protect */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-violet-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-violet-200 hover:border-violet-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    PDF Password Protect
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm flex-grow">
                    Add a password to any PDF so only you can open it — or remove an existing password instantly.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {[
                      "128-bit encryption",
                      "Remove existing passwords",
                      "Files never stored",
                      "Instant download"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/lock" className="w-full">
                    <Button
                      size="sm"
                      className="w-full text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="max-w-4xl mx-auto mt-16 sm:mt-20">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-gray-200 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Not Sure Which One to Choose?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Compress Only if:</h3>
                    <p className="text-sm sm:text-base">You want to reduce file size while keeping the same format. Great for storage optimization and faster uploads.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Convert Only if:</h3>
                    <p className="text-sm sm:text-base">You need to change file format without compression. Perfect for compatibility with specific software or requirements.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Convert & Compress if:</h3>
                    <p className="text-sm sm:text-base">You want the best of both worlds - change format AND reduce size in one go. Most efficient and time-saving option.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Create Workspace if:</h3>
                    <p className="text-sm sm:text-base">You need to collaborate on projects with your team. Communicate in real-time, share links and resources, and coordinate work together.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose OCR Tool if:</h3>
                    <p className="text-sm sm:text-base">You need to extract text from images or scanned documents. Convert pictures, screenshots, and PDFs into editable text.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Feed if:</h3>
                    <p className="text-sm sm:text-base">You want to stay updated with real-time activity across your workspaces. Track team activities and get instant notifications.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose Meet if:</h3>
                    <p className="text-sm sm:text-base">You need to host video meetings with your team. Connect face-to-face, share screens, and collaborate in real-time.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose My Whiteboards if:</h3>
                    <p className="text-sm sm:text-base">You want to brainstorm ideas and sketch concepts. Create personal visual boards for planning and organizing your thoughts.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose My Documents if:</h3>
                    <p className="text-sm sm:text-base">You need a professional word processor to create, edit, and format documents. Import DOCX files, add tables and images, and export with formatting preserved.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose PDF Merger & Splitter if:</h3>
                    <p className="text-sm sm:text-base">You need to combine multiple PDF files into one, or break a large PDF into smaller sections. Useful for reports, contracts, and any multi-document workflow.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Choose PDF Password Protect if:</h3>
                    <p className="text-sm sm:text-base">You want to restrict access to a PDF with a password, or remove an existing password from a protected document. Ideal for sensitive files and confidential documents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GetStarted;
