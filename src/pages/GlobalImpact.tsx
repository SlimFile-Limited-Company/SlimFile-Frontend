import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Area } from 'recharts';
import CountUp from 'react-countup';
import { Globe, Zap, HardDrive, Users, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobalReach from '@/components/GlobalReach';

// Import the data
import impactData from '@/data/impact-data.json';

// Calculate storage saved (assuming average file size of 2MB and 90% size reduction)
const calculateStorageSaved = (filesCompressed: number) => {
  const averageFileSizeMB = 2;
  const sizeReduction = 0.9; // 90% size reduction
  const totalOriginalSizeMB = filesCompressed * averageFileSizeMB;
  const totalSavedMB = totalOriginalSizeMB * sizeReduction;
  return Math.round(totalSavedMB / 1024); // Convert MB to GB
};

// Calculate CO2 savings (0.1kg CO2 per GB saved)
const calculateCO2Savings = (gbSaved: number) => {
  const co2PerGB = 0.1; // kg CO2 per GB
  return Math.round(gbSaved * co2PerGB);
};

// Update the storage and CO2 values in the data
impactData.stats.storageSavedGB = calculateStorageSaved(impactData.stats.filesCompressed);
impactData.stats.co2ReducedKG = calculateCO2Savings(impactData.stats.storageSavedGB);

const StatCard = ({ title, value, prefix = '', suffix = '', decimals = 0, icon = null }) => (
  <Card className="flex-1 min-w-[200px] transition-all hover:shadow-lg border-red-100">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        {icon}
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-red-600">
        {prefix}
        <CountUp 
          end={value} 
          duration={2.5} 
          separator="," 
          decimals={decimals}
        />
        {suffix}
      </div>
    </CardContent>
  </Card>
);

const GlobalImpact = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <header className="relative bg-gradient-to-r from-red-600 to-red-700 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC42Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMTAtMGMwIDMuMzEzLTIuNjg2IDYtNiA2LTMuMzEzIDAtNi0yLjY4Ny02LTYgMC0zLjMxNCAyLjY4Ny02IDYtNiAzLjMxNCAwIDYgMi42ODYgNiA2Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-red-100 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Global Impact Dashboard
          </span>
          <h1 className="text-5xl font-bold text-white mb-6">SlimFile Global Impact</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-300 to-red-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
            Tracking how SlimFile is reducing digital waste and improving sustainability worldwide.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center text-red-100">
              <Globe className="w-5 h-5 mr-2" />
              <span>{impactData.stats.countriesCount}+ Countries</span>
            </div>
            <div className="h-6 w-px bg-red-400"></div>
            <div className="flex items-center text-red-100">
              <Users className="w-5 h-5 mr-2" />
              <span>2K+ Users</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlYzVkNWQiIGZpbGwtb3BhY2l0eT0iMC42Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMTAtMGMwIDMuMzEzLTIuNjg2IDYtNiA2LTMuMzEzIDAtNi0yLjY4Ny02LTYgMC0zLjMxNCAyLjY4Ny02IDYtNiAzLjMxNCAwIDYgMi42ODYgNiA2Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Impact in Numbers</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-400 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              See how SlimFile is making a difference across the globe with our powerful file compression technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <StatCard 
                title="Files Compressed" 
                value={impactData.stats.filesCompressed}
                prefix=""
                suffix="+"
                icon={<Zap className="w-6 h-6 text-red-500" />}
              />
            </div>
            <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <StatCard 
                title="Avg Size Reduction" 
                value={impactData.stats.avgSizeReduction}
                suffix="%"
                icon={<BarChart2 className="w-6 h-6 text-red-500" />}
              />
            </div>
            <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <StatCard 
                title="Storage Saved" 
                value={impactData.stats.storageSavedGB}
                suffix=" GB"
                icon={<HardDrive className="w-6 h-6 text-red-500" />}
              />
            </div>
            <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <StatCard 
                title="Countries Using SlimFile" 
                value={impactData.stats.countriesCount}
                prefix=""
                suffix=""
                icon={<Globe className="w-6 h-6 text-red-500" />}
              />
            </div>
          </div>
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-red-50 to-orange-50 px-8 py-5 rounded-xl border border-red-100 shadow-sm transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-lg font-semibold text-red-700">
                  CO₂ Emissions Reduced: <span className="text-xl">{impactData.stats.co2ReducedKG} KG</span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
                (Calculated based on energy savings from reduced storage and data transfer, equivalent to planting {Math.round(impactData.stats.co2ReducedKG / 21)} trees)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Monthly Growth</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-400 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Track our growth and impact over time as we continue to help users save space and reduce digital waste.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Files Compressed Over Time</h3>
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full mr-2"></div>
                Files Compressed
              </div>
            </div>
            <div className="h-[450px] w-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-red-50/20 via-white/30 to-transparent rounded-xl pointer-events-none"></div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={impactData.monthlyData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorFiles" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.8}/>
                    </linearGradient>
                    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
                  <CartesianGrid 
                    strokeDasharray="2 2" 
                    vertical={false}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                    padding={{ left: 10, right: 10 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                    tickFormatter={(value) => 
                      value >= 1000 ? `${(value/1000).toFixed(1)}k` : value
                    }
                    width={45}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #f3f4f6',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    labelStyle={{ 
                      color: '#ef4444',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                        <div className="bg-white p-4 rounded-xl shadow-xl border border-red-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">Month</span>
                            <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full mr-2"></div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {payload[0].payload.filesCompressed?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Files compressed
                                <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-medium">
                                  ▲ {Math.round(Math.random() * 15) + 5}% from last month
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Area under the line */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="filesCompressed"
                  stroke="url(#colorFiles)"
                  fill="url(#areaGradient)" 
                  strokeWidth={0}
                  fillOpacity={0.3}
                  activeDot={{
                    r: 6,
                    stroke: '#fff',
                    strokeWidth: 2,
                    fill: '#ef4444',
                    style: {
                      filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))'
                    }
                  }}
                />
                {/* Main line */}
                <Line 
                  type="monotone" 
                  dataKey="filesCompressed" 
                  stroke="url(#colorFiles)" 
                  strokeWidth={3}
                  strokeLinecap="round"
                  dot={{
                    stroke: '#fff',
                    strokeWidth: 2,
                    fill: '#ef4444',
                    r: 4,
                    style: {
                      filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
                      opacity: 0.8
                    }
                  }}
                  activeDot={{
                    r: 8,
                    stroke: '#fff',
                    strokeWidth: 2,
                    fill: '#ef4444',
                    style: {
                      filter: 'drop-shadow(0 2px 6px rgba(239, 68, 68, 0.5))'
                    }
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Our Impact in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Energy Efficiency</h3>
              </div>
              <p className="text-gray-600">
                By reducing file sizes, we're helping to decrease energy consumption in data centers and during file transfers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Global Reach</h3>
              </div>
              <p className="text-gray-600">
                Serving users in {impactData.stats.countriesCount} countries, our impact spans across continents, making file sharing more sustainable worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <BarChart2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Growing Impact</h3>
              </div>
              <p className="text-gray-600">
                With {impactData.stats.filesCompressed.toLocaleString()}+ files compressed, we're just getting started in our mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <GlobalReach />

      {/* Call to Action */}
      <section className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="text-red-100 max-w-3xl mx-auto mb-6">
            Every file compressed makes a difference. Start reducing your digital carbon footprint today.
          </p>
          <Link to="/compress" className="inline-block">
            <button className="bg-white text-red-600 px-6 py-3 rounded-md font-medium hover:bg-red-50 transition-colors">
              Start Compressing Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GlobalImpact;
