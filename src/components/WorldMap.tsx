import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
  'United Arab Emirates', 'Zambia'
];

// Some countries need to be mapped to their ISO codes for the map
const countryToISO: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'GBR',
  'South Korea': 'KOR',
  'Czech Republic': 'CZE',
  'Tanzania': 'TZA',
  'Congo [DRC]': 'COD',
  'Congo [Republic]': 'COG',
  'Ivory Coast': 'CIV',
  'Laos': 'LAO',
  'Macedonia [FYROM]': 'MKD',
  'Moldova': 'MDA',
  'Palestinian Territories': 'PSE',
  'Russia': 'RUS',
  'Syria': 'SYR',
  'Taiwan': 'TWN',
  'Venezuela': 'VEN',
  'Vietnam': 'VNM',
  'Türkiye': 'TUR'
};

const WorldMap = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; country: string } | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  
  const handleCountryHover = (geo: any, event: React.MouseEvent) => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setTooltip({
        x,
        y,
        country: geo.properties.name
      });
    }
  };

  return (
    <div className="w-full h-full">
      <div 
        ref={setContainerRef}
        className="relative w-full h-full bg-white rounded-xl overflow-hidden"
      >
      {tooltip && (
        <div 
          className="absolute bg-red-800 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y - 30}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          {tooltip.country}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 110,
          center: [10, 25],
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const isHighlighted = countries.some(country => 
                    geo.properties.name === country || 
                    geo.properties.name === countryToISO[country as keyof typeof countryToISO]
                  );
                  
                  const countryName = geo.properties.name;
                  const isTargetCountry = countries.some(country => 
                    countryName === country || 
                    countryName === countryToISO[country as keyof typeof countryToISO]
                  );
                  
                  const isActive = isTargetCountry;
                  
                  if (!isActive) {
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isActive ? 'url(#gradient)' : '#F3F4F6'}
                        stroke="#E5E7EB"
                        strokeWidth={0.8}
                        className="transition-all duration-300 hover:fill-gray-200"
                        style={{
                          default: {
                            fill: isActive ? 'url(#gradient)' : '#E5E7EB',
                            outline: 'none',
                            stroke: '#FFFFFF',
                            strokeWidth: 0.5,
                            transition: 'fill 0.2s',
                          },
                          hover: {
                            fill: isActive ? 'url(#gradientHover)' : '#D1D5DB',
                            cursor: 'default',
                            outline: 'none',
                          },
                          pressed: { outline: 'none' }
                        }}
                      />
                    );
                  }
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(event) => handleCountryHover(geo, event)}
                      onMouseMove={(event) => handleCountryHover(geo, event)}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: {
                          fill: isActive ? 'url(#gradient)' : 'transparent',
                          outline: 'none',
                          stroke: isActive ? '#FFFFFF' : '#E5E7EB',
                          strokeWidth: 1,
                          transition: 'all 0.2s',
                        },
                        hover: {
                          fill: isActive ? 'url(#gradientHover)' : 'rgba(185, 28, 28, 0.2)',
                          stroke: isActive ? '#FFFFFF' : '#B91C1C',
                          strokeWidth: 1.5,
                          cursor: 'pointer',
                          outline: 'none',
                        },
                        pressed: { 
                          outline: 'none',
                        }
                      }}
                    />
                  );
                })}
              </>
            )}
          </Geographies>
          </ZoomableGroup>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="gradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
        </ComposableMap>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>{countries.length} countries and counting are using SlimFile</p>
      </div>
    </div>
  );
};

export default WorldMap;
