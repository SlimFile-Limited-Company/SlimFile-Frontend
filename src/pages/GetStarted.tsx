import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, FileText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GetStarted: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 pt-20">
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6 mb-16">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  Choose Your Tool
                </span>
                
              </h1>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Compress Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Popular
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileImage className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Compress Only
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base flex-grow">
                    Reduce file sizes while maintaining the same format. Perfect for storage optimization and faster sharing.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "Images: JPEG, PNG, WebP",
                      "Documents: PDF, DOCX, PPTX, XLSX",
                      "Up to 95% size reduction",
                      "Maintain original format"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/compress" className="w-full">
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-purple-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Convert Only
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base flex-grow">
                    Transform your files between different formats without compression. Perfect for format compatibility.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "Image formats: JPG, PNG, WebP, PDF",
                      "Office docs: DOCX, PPTX, XLSX to PDF",
                      "PDF to Images (ZIP)",
                      "No quality loss"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/convert-only" className="w-full">
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert & Compress */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-red-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Best Value
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Convert & Compress
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base flex-grow">
                    The ultimate two-in-one solution. Convert between formats AND optimize file size in a single step.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "All conversion features included",
                      "Maximum file size reduction",
                      "Perfect quality with smaller files",
                      "Save time with one-step processing"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/convert-compress" className="w-full">
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
