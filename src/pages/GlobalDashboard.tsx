import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HardDrive,
  FileArchive,
  TrendingUp,
  Globe,
  Leaf,
  Zap,
  TreeDeciduous
} from 'lucide-react';

interface GlobalStats {
  totalCompressions: number;
  totalSpaceSaved: number;
  avgCompressionRatio: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// Format bytes to human readable
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

// Fetch global stats
const fetchGlobalStats = async (): Promise<GlobalStats> => {
  const res = await fetch(`${API_BASE_URL}/feed/stats`);
  if (!res.ok) throw new Error('Failed to fetch global stats');
  return res.json();
};

export const GlobalDashboard = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['global-stats'],
    queryFn: fetchGlobalStats,
    refetchInterval: 60000, // Refetch every minute as backup
  });

  // Setup Socket.io for real-time updates
  useEffect(() => {
    const socketUrl = API_BASE_URL.replace('/api', '');
    console.log('[GlobalDashboard] Connecting to socket:', socketUrl);

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('[GlobalDashboard] Socket connected! ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[GlobalDashboard] Socket disconnected');
      setIsConnected(false);
    });

    // Listen for statsUpdate event
    socket.on('statsUpdate', (newStats: GlobalStats) => {
      console.log('[GlobalDashboard] Stats update received:', newStats);
      // Update React Query cache with new data
      queryClient.setQueryData(['global-stats'], newStats);
      // Show update indicator
      setHasUpdate(true);
      setTimeout(() => setHasUpdate(false), 2000);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  // Calculate environmental impact
  const gbSaved = (stats?.totalSpaceSaved || 0) / (1024 * 1024 * 1024);
  const treesEquivalent = Math.round(gbSaved * 0.1 / 21);
  const energySaved = Math.round(gbSaved * 7);
  const co2Reduced = Math.round(gbSaved * 0.1);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load global statistics</h1>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Global Statistics</h1>
            {hasUpdate && (
              <span className="px-2 py-1 text-xs font-bold text-green-600 bg-green-100 rounded-full animate-pulse">
                UPDATED!
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Aggregated statistics of all space saved by SlimFile users worldwide.
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {isConnected ? 'Live Updates Active' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={hasUpdate ? 'ring-2 ring-green-400 transition-all' : 'transition-all'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Compressions
              </CardTitle>
              <FileArchive className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {(stats?.totalCompressions || 0).toLocaleString()}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Files compressed globally</p>
            </CardContent>
          </Card>

          <Card className={hasUpdate ? 'ring-2 ring-green-400 transition-all' : 'transition-all'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Space Saved
              </CardTitle>
              <HardDrive className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {formatBytes(stats?.totalSpaceSaved || 0)}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Storage reclaimed</p>
            </CardContent>
          </Card>

          <Card className={hasUpdate ? 'ring-2 ring-green-400 transition-all' : 'transition-all'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Compression
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.avgCompressionRatio || 0}%
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">File size reduction</p>
            </CardContent>
          </Card>
        </div>

        {/* Large Total Space Saved Display */}
        <Card className="mb-8 bg-gradient-to-r from-red-600 to-orange-500 text-white border-0">
          <CardContent className="py-10 text-center">
            <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <p className="text-lg font-medium opacity-90 mb-2">Total Storage Saved Globally</p>
            {isLoading ? (
              <div className="animate-pulse mx-auto">
                <div className="h-16 bg-white/20 rounded w-64 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="text-5xl md:text-6xl font-bold mb-4">
                  {formatBytes(stats?.totalSpaceSaved || 0)}
                </div>
                <p className="text-sm opacity-75">
                  That's equivalent to {Math.round((stats?.totalSpaceSaved || 0) / (1024 * 1024 * 4.7)).toLocaleString()} DVDs worth of storage!
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Environmental Impact
          </h2>
          <p className="text-gray-600 text-sm">Estimated positive environmental effects from reduced storage needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {isLoading ? '...' : treesEquivalent.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">Trees Worth of CO2 Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">
                    {isLoading ? '...' : energySaved.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600">kWh of Energy Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {isLoading ? '...' : co2Reduced.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">kg of CO2 Reduced</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
