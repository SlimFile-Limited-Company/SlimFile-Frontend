import React from 'react';
import WorldMap from './WorldMap';

const countries = [
  'Ghana', 'United States', 'India', 'Nigeria', 'France', 'Germany', 'United Kingdom',
  'Canada', 'Ireland', 'Netherlands', 'Philippines', 'Pakistan', 'Indonesia', 'Saudi Arabia',
  'Singapore', 'Sweden', 'Brazil', 'Belgium', 'China', 'Hong Kong', 'Italy', 'Kenya',
  'Malaysia', 'Poland', 'Russia', 'Spain', 'Switzerland', 'Türkiye', 'Australia',
  'Benin', 'Romania', 'Rwanda', 'South Africa', 'Thailand', 'Vietnam', 'Algeria',
  'Argentina', 'Armenia', 'Bangladesh', 'Croatia', "Côte d'Ivoire", 'Denmark',
  'Ethiopia', 'Finland', 'Gambia', 'Hungary', 'Kazakhstan', 'Lebanon', 'Malta',
  'Mexico', 'North Macedonia', 'Panama', 'Portugal', 'Qatar', 'Serbia',
  'Sierra Leone', 'South Korea', 'Tanzania', 'Tunisia', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'Zambia', 'Greece'
];

const GlobalReach = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Global Reach</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SlimFile is being used in countries across the globe, helping users reduce their digital footprint.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[500px] w-full">
          <WorldMap />
        </div>

        <div className="mt-8 text-center">
          <button 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={() => {
              // Smooth scroll to the top of the page
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
