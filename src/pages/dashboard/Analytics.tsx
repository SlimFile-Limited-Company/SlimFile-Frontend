import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, HardDrive, FileArchive, Gauge } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#16a34a', '#0891b2'];

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const fetchAnalytics = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
};

export default function DashboardAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: fetchAnalytics
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Loading your compression analytics...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    );
  }

  // Process file type breakdown for pie chart
  const fileTypeData = Object.entries(data.fileTypeBreakdown || {}).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count as number
  }));

  // Process space saved by type for bar chart
  const spaceSavedData = Object.entries(data.spaceSavedByType || {}).map(([type, bytes]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    bytes: bytes as number,
    formatted: formatBytes(bytes as number)
  }));

  // Process compression over time for line chart
  const compressionOverTimeData = (data.compressionOverTime || []).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    files: item.count,
    spaceSaved: item.spaceSaved / (1024 * 1024) // Convert to MB
  }));

  // Process file size distribution
  const sizeDistributionData = [
    { name: '0-1 MB', value: data.fileSizeDistribution?.small || 0 },
    { name: '1-10 MB', value: data.fileSizeDistribution?.medium || 0 },
    { name: '10-100 MB', value: data.fileSizeDistribution?.large || 0 },
    { name: '100+ MB', value: data.fileSizeDistribution?.xlarge || 0 },
  ].filter(item => item.value > 0);

  // Calculate environmental impact
  const totalSpaceSaved = spaceSavedData.reduce((sum, item) => sum + item.bytes, 0);
  const bandwidthSaved = (totalSpaceSaved / (1024 * 1024 * 1024)) * 2; // GB * 2
  const energySaved = (totalSpaceSaved / (1024 * 1024 * 1024)) * 0.27; // kWh approximation
  const co2Offset = energySaved * 0.42; // kg CO2

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into your compression patterns and savings.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Compression</p>
                <p className="text-2xl font-bold text-gray-900">{data.avgCompressionRatio}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Space Saved (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{formatBytes(totalSpaceSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <FileArchive className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Files (30d)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileTypeData.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Energy Saved</p>
                <p className="text-2xl font-bold text-gray-900">{energySaved.toFixed(1)} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compression Over Time */}
        {compressionOverTimeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Compression Activity (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={compressionOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="files" stroke="#dc2626" name="Files Compressed" />
                  <Line yAxisId="right" type="monotone" dataKey="spaceSaved" stroke="#16a34a" name="Space Saved (MB)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* File Type Breakdown */}
        {fileTypeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>File Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fileTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fileTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Space Saved by Type */}
        {spaceSavedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Space Saved by File Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={spaceSavedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatBytes(value as number)} />
                  <Bar dataKey="bytes" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* File Size Distribution */}
        {sizeDistributionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>File Size Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sizeDistributionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0891b2" name="Files" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>🌍 Environmental Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            By compressing {formatBytes(totalSpaceSaved)} of data in the last 30 days, you've contributed to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{bandwidthSaved.toFixed(1)} GB</div>
              <p className="text-sm text-gray-700">Bandwidth Saved</p>
              <p className="text-xs text-gray-500 mt-1">Reduces network load</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{energySaved.toFixed(2)} kWh</div>
              <p className="text-sm text-gray-700">Energy Saved</p>
              <p className="text-xs text-gray-500 mt-1">Enough to charge {Math.round(energySaved * 50)} smartphones</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{co2Offset.toFixed(2)} kg</div>
              <p className="text-sm text-gray-700">CO₂ Offset</p>
              <p className="text-xs text-gray-500 mt-1">Equivalent to {(co2Offset / 21.77).toFixed(3)} trees</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
