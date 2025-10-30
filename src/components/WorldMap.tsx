import React, { useState, useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

// Component to display country list with flags
const CountryList = ({ countries, onHover, activeCountry }: { countries: string[], onHover: (country: string | null) => void, activeCountry: string | null }) => (
  <div className="flex flex-col space-y-1">
    {countries.map((country) => (
      <div 
        key={country}
        className={`flex items-center space-x-2 p-1 rounded-md transition-colors ${activeCountry === country ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        onMouseEnter={() => onHover(country)}
        onMouseLeave={() => onHover(null)}
      >
        <div className="w-10 h-6 flex-shrink-0 overflow-hidden rounded-[2px] shadow-sm border border-gray-200">
          <ReactCountryFlag 
            countryCode={countryToISO[country]}
            svg
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            title={country}
          />
        </div>
        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{country}</span>
      </div>
    ))}
  </div>
);

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
  'United Arab Emirates', 'Zambia', 'Greece'
];

// Map country names to their ISO 3166-1 alpha-2 codes for flags
const countryToISO: Record<string, string> = {
  'Afghanistan': 'AF',
  'Albania': 'AL',
  'Algeria': 'DZ',
  'Argentina': 'AR',
  'Armenia': 'AM',
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bangladesh': 'BD',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Benin': 'BJ',
  'Brazil': 'BR',
  'Bulgaria': 'BG',
  'Cambodia': 'KH',
  'Cameroon': 'CM',
  'Canada': 'CA',
  'Chile': 'CL',
  'China': 'CN',
  'Colombia': 'CO',
  'Costa Rica': 'CR',
  'Croatia': 'HR',
  'Cuba': 'CU',
  'Cyprus': 'CY',
  'Czech Republic': 'CZ',
  "Côte d'Ivoire": 'CI',
  'Denmark': 'DK',
  'Dominican Republic': 'DO',
  'Ecuador': 'EC',
  'Egypt': 'EG',
  'Estonia': 'EE',
  'Ethiopia': 'ET',
  'Finland': 'FI',
  'France': 'FR',
  'Gambia': 'GM',
  'Georgia': 'GE',
  'Germany': 'DE',
  'Ghana': 'GH',
  'Greece': 'GR',
  'Hong Kong': 'HK',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Ireland': 'IE',
  'Israel': 'IL',
  'Italy': 'IT',
  'Jamaica': 'JM',
  'Japan': 'JP',
  'Kazakhstan': 'KZ',
  'Kenya': 'KE',
  'Kuwait': 'KW',
  'Laos': 'LA',
  'Latvia': 'LV',
  'Lebanon': 'LB',
  'Libya': 'LY',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Malaysia': 'MY',
  'Maldives': 'MV',
  'Malta': 'MT',
  'Mexico': 'MX',
  'Mongolia': 'MN',
  'Montenegro': 'ME',
  'Morocco': 'MA',
  'Myanmar': 'MM',
  'Nepal': 'NP',
  'Netherlands': 'NL',
  'New Zealand': 'NZ',
  'Nigeria': 'NG',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  'Norway': 'NO',
  'Oman': 'OM',
  'Pakistan': 'PK',
  'Panama': 'PA',
  'Peru': 'PE',
  'Philippines': 'PH',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Qatar': 'QA',
  'Romania': 'RO',
  'Russia': 'RU',
  'Rwanda': 'RW',
  'Saudi Arabia': 'SA',
  'Senegal': 'SN',
  'Serbia': 'RS',
  'Sierra Leone': 'SL',
  'Singapore': 'SG',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Somalia': 'SO',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  'Spain': 'ES',
  'Sri Lanka': 'LK',
  'Sudan': 'SD',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Syria': 'SY',
  'Taiwan': 'TW',
  'Tanzania': 'TZ',
  'Thailand': 'TH',
  'Tunisia': 'TN',
  'Türkiye': 'TR',
  'Uganda': 'UG',
  'Ukraine': 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Uruguay': 'UY',
  'Venezuela': 'VE',
  'Vietnam': 'VN',
  'Yemen': 'YE',
  'Zambia': 'ZM',
  'Zimbabwe': 'ZW'
};

const WorldMap = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; country: string } | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  
  // Split countries into two columns
  const { leftCountries, rightCountries } = useMemo(() => {
    const half = Math.ceil(countries.length / 2);
    return {
      leftCountries: countries.slice(0, half),
      rightCountries: countries.slice(half)
    };
  }, []);
  
  const handleCountryHover = (geo: any, event: React.MouseEvent) => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const countryName = geo.properties.name;
      
      setTooltip({
        x,
        y,
        country: countryName
      });
      
      // Also update the hovered country for the list highlighting
      if (countries.includes(countryName)) {
        setHoveredCountry(countryName);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      {/* Left country list - hidden on mobile, shown on lg screens */}
      <div className="hidden lg:block w-48 pr-4 overflow-y-auto scrollbar-thin">
        <CountryList 
          countries={leftCountries} 
          onHover={setHoveredCountry} 
          activeCountry={hoveredCountry}
        />
      </div>
      
      {/* Map container - full width on mobile, flex-1 on larger screens */}
      <div className="w-full lg:flex-1 h-[500px] lg:h-full">
        <div 
          ref={setContainerRef}
          className="relative w-full h-full bg-white rounded-xl overflow-hidden"
        >
      {tooltip && (
        <div 
          className="absolute bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 z-50 pointer-events-none flex items-center space-x-2"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="w-6 h-4 flex items-center justify-center overflow-hidden rounded-[1px] shadow-sm">
            <ReactCountryFlag 
              countryCode={countryToISO[tooltip.country]}
              svg
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              title={tooltip.country}
            />
          </div>
          <span>{tooltip.country}</span>
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
      
      {/* Right country list - hidden on mobile, shown on lg screens */}
      <div className="hidden lg:block w-48 pl-4 overflow-y-auto scrollbar-thin">
        <CountryList 
          countries={rightCountries} 
          onHover={setHoveredCountry} 
          activeCountry={hoveredCountry}
        />
      </div>
    </div>
  );
};

export default WorldMap;
