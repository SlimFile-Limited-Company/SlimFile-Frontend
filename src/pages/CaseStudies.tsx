import React, { useState } from "react";
import { X } from "lucide-react";

interface Testimonial {
  image: string;
}

const CaseStudies: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const testimonialsData: Testimonial[] = [
    { image: "/lovable-uploads/testimonial1.jpeg" },
    { image: "/lovable-uploads/testimonial2.jpeg" },
    { image: "/lovable-uploads/testimonial3.jpeg" },
    { image: "/lovable-uploads/testimonial4.jpeg" },
    { image: "/lovable-uploads/testimonial5.jpeg" },
    { image: "/lovable-uploads/testimonial6.jpeg" },
    { image: "/lovable-uploads/testimonial7.jpeg" },
    { image: "/lovable-uploads/testimonial8.png" },
    { image: "/lovable-uploads/testimonial9.jpg" },
    { image: "/lovable-uploads/testimonial10.jpg" },
    { image: "/lovable-uploads/testimonial11.jpg" },
  ];

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-block">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            TESTIMONIALS
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Join thousands of satisfied users who trust our service
        </p>
      </div>

      {/* Review Button */}
      <div className="flex justify-center mb-16">
        <a
          href="https://www.trustpilot.com/review/slim-file.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-2">
            Leave Us a Review
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            onClick={() => openModal(item.image)}
            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 p-1"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="relative overflow-hidden rounded-xl bg-white">
              <img
                src={item.image}
                alt={`Testimonial ${index + 1}`}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-medium">Click to view larger</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0v6m0-6h6m-6 0H4" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            className={`relative max-w-5xl w-full max-h-[90vh] transition-all duration-500 transform ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2"
              aria-label="Close modal"
            >
              <X size={28} />
            </button>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={selectedImage || ""}
                alt="Testimonial enlarged"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudies;
