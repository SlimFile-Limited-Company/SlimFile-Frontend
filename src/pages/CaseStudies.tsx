import React from "react";

interface Testimonial {
  image: string;
}

const CaseStudies: React.FC = () => {
  // Testimonial Data
  const testimonialsData: Testimonial[] = [
    { image: "/lovable-uploads/testimonial1.jpeg" },
    { image: "/lovable-uploads/testimonial2.jpeg" },
    { image: "/lovable-uploads/testimonial3.jpeg" },
    { image: "/lovable-uploads/testimonial4.jpeg" },
    { image: "/lovable-uploads/testimonial5.jpeg" },
    { image: "/lovable-uploads/testimonial6.jpeg" },
    { image: "/lovable-uploads/testimonial7.jpeg" },
    { image: "/lovable-uploads/testimonial8.png" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-14 px-4">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center my-10">
        What Our Users Say
      </h2>

      {/* Review Button */}
      <div className="flex justify-center mb-10">
    
        <a
          href="https://www.trustpilot.com/review/slim-file.com"
          target=""
          rel="noopener noreferrer"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md 
                     hover:shadow-lg hover:scale-105 
                     transition-all duration-300 ease-in-out"
        >
          Leave Us a Review
        </a>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
          >
            {/* Testimonial Image */}
            <img
              src={item.image}
              alt={`Testimonial ${index + 1}`}
              className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudies;
