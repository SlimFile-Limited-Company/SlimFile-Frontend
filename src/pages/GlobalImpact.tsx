import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import CountUp from 'react-countup';
import { Globe, Zap, HardDrive, Users, BarChart2 } from 'lucide-react';
import GlobalReach from '@/components/GlobalReach';

// Import the data
import impactData from '@/data/impact-data.json';

// Calculate storage saved (assuming average file size of 2MB and 90% of files saved)
const calculateStorageSaved = (filesCompressed: number) => {
  const averageFileSizeMB = 2;
  const filesSaved = filesCompressed * 0.9; // 90% of compressed files are saved
  return Math.round((filesSaved * averageFileSizeMB) / 1024); // Convert MB to GB
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
              <span>{Math.floor(impactData.stats.filesCompressed / 1000)}K+ Users</span>
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
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={impactData.monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-red-600">
                            {payload[0].value?.toLocaleString()} files compressed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                  <Line
                    type="monotone"
                    dataKey="filesCompressed"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#dc2626' }}
                    activeDot={{ r: 6, fill: '#dc2626' }}
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
          <button className="bg-white text-red-600 px-6 py-3 rounded-md font-medium hover:bg-red-50 transition-colors">
            Start Compressing Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default GlobalImpact;
