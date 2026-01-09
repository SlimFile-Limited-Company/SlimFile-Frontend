import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplet, Zap, TreePine, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Fetch environmental impact data
const fetchImpact = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/impact`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch impact data');
  return res.json();
};

export default function DashboardImpact() {
  const { data: impact, isLoading } = useQuery({
    queryKey: ['dashboard-impact'],
    queryFn: fetchImpact,
    refetchInterval: 60000,
  });

  // Calculate environmental metrics
  const spaceSaved = impact?.totalSpaceSaved || 0;
  const co2Saved = (spaceSaved / (1024 * 1024 * 1024)) * 0.2; // 0.2kg CO2 per GB
  const treesEquivalent = co2Saved / 21; // 1 tree absorbs ~21kg CO2/year
  const energySaved = (spaceSaved / (1024 * 1024)) * 0.005; // 0.005 kWh per MB
  const waterSaved = (spaceSaved / (1024 * 1024 * 1024)) * 2; // 2L water per GB

  const handleShare = () => {
    const text = `I've saved ${formatBytes(spaceSaved)} and reduced ${co2Saved.toFixed(2)}kg of CO2 with SlimFile! 🌍`;
    if (navigator.share) {
      navigator.share({ text, url: 'https://www.slim-file.com' });
    } else {
      navigator.clipboard.writeText(text);
      alert('Impact stats copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Environmental Impact</h1>
        <p className="text-gray-600 mt-1">
          Your positive contribution to the environment through file compression.
        </p>
      </div>

      {/* Main Impact Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Leaf className="w-6 h-6" />
            Your Environmental Footprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-green-200 rounded w-48 mx-auto mb-4"></div>
                <div className="h-6 bg-green-100 rounded w-64 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="text-5xl font-bold text-green-700 mb-2">
                  {co2Saved.toFixed(2)} kg
                </div>
                <p className="text-lg text-green-600 mb-4">
                  CO₂ emissions reduced
                </p>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  By compressing your files, you've helped reduce the carbon footprint of digital storage.
                  Every megabyte saved means less energy consumption in data centers.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Trees Equivalent
            </CardTitle>
            <TreePine className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {treesEquivalent.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Annual CO₂ absorption
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Energy Saved
            </CardTitle>
            <Zap className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {energySaved.toFixed(2)} kWh
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Electricity conserved
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Water Saved
            </CardTitle>
            <Droplet className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {waterSaved.toFixed(1)} L
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Water for cooling
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Storage Saved
            </CardTitle>
            <Leaf className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {formatBytes(spaceSaved)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Total space reduced
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Reduced Energy Consumption
              </h3>
              <p className="text-sm text-gray-600">
                Data centers consume massive amounts of electricity. By reducing file sizes,
                you're helping decrease the energy needed to store and transmit data globally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-green-600" />
                Lower Carbon Emissions
              </h3>
              <p className="text-sm text-gray-600">
                Smaller files mean less server infrastructure, cooling requirements, and
                network bandwidth - all contributing to reduced CO₂ emissions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-600" />
                Water Conservation
              </h3>
              <p className="text-sm text-gray-600">
                Data centers use significant amounts of water for cooling systems.
                Efficient storage helps conserve this precious resource.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Sustainable Digital Future
              </h3>
              <p className="text-sm text-gray-600">
                Every file compressed is a step toward more sustainable digital practices.
                Your choices today shape tomorrow's environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Impact */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Share Your Impact</h3>
            <p className="mb-6 text-green-100">
              Inspire others to make a difference by sharing your environmental contribution!
            </p>
            <Button
              onClick={handleShare}
              className="bg-white text-green-600 hover:bg-green-50"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share My Impact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
