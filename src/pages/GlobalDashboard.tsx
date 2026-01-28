import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import CountUp from 'react-countup';
import {
  HardDrive,
  FileText,
  TrendingUp,
  Globe,
  BarChart3
} from 'lucide-react';

interface GlobalStats {
  totalCompressions: number;      // Total compression count
  totalSpaceSaved: number;        // Total bytes saved
  avgCompressionRatio: number;    // Average compression ratio %
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

const StatCard = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  color,
  previousValue
}: {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: any;
  color: string;
  previousValue?: number;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-white border-2 ${isAnimating ? 'border-green-400' : 'border-gray-100'} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-green-50 animate-pulse"
        />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {isAnimating && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 text-xs font-bold text-green-600 bg-green-100 rounded-full"
            >
              UPDATED!
            </motion.span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="text-3xl font-bold text-gray-900">
          {prefix}
          <CountUp
            end={value}
            duration={2}
            separator=","
            preserveValue={true}
            useEasing={true}
          />
          {suffix}
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${color} opacity-10 rounded-full`} />
    </motion.div>
  );
};

export const GlobalDashboard = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [previousStats, setPreviousStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  // Fetch initial aggregated stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/feed/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');

        const statsData = await response.json();
        console.log('📊 [GLOBAL DASHBOARD] Initial stats loaded:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching global stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [API_BASE_URL]);

  // Setup Socket.io for real-time updates to aggregated stats
  useEffect(() => {
    const socketUrl = API_BASE_URL.replace('/api', '');
    console.log('🔌 [GLOBAL DASHBOARD] Connecting to socket:', socketUrl);

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('✅ [GLOBAL DASHBOARD] Socket connected! ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('⚠️ [GLOBAL DASHBOARD] Socket disconnected');
      setIsConnected(false);
    });

    // Listen for statsUpdate event - updates ALL stats from Stats model
    socket.on('statsUpdate', (newStats: GlobalStats) => {
      console.log('📊 [GLOBAL DASHBOARD] Stats update received:', newStats);

      setStats(prev => {
        if (prev) setPreviousStats(prev);
        return {
          totalCompressions: newStats.totalCompressions,
          totalSpaceSaved: newStats.totalSpaceSaved,
          avgCompressionRatio: newStats.avgCompressionRatio
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [API_BASE_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-40 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
            <Globe className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Live Global Statistics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Global Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aggregated statistics of all space saved by SlimFile users worldwide.
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <motion.div
              animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {isConnected ? 'Live Updates Active' : 'Connecting...'}
            </span>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Space Saved"
            value={stats?.totalSpaceSaved || 0}
            icon={HardDrive}
            color="bg-gradient-to-br from-red-500 to-red-600"
            previousValue={previousStats?.totalSpaceSaved}
          />
          <StatCard
            title="Total Compressions"
            value={stats?.totalCompressions || 0}
            icon={FileText}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            previousValue={previousStats?.totalCompressions}
          />
          <StatCard
            title="Avg Compression"
            value={stats?.avgCompressionRatio || 0}
            suffix="%"
            icon={TrendingUp}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            previousValue={previousStats?.avgCompressionRatio}
          />
        </div>

        {/* Large Space Saved Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl text-white text-center shadow-2xl"
        >
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <p className="text-lg font-medium opacity-90 mb-2">Total Storage Saved Globally</p>
          <div className="text-5xl md:text-7xl font-bold">
            {formatBytes(stats?.totalSpaceSaved || 0)}
          </div>
          <p className="mt-4 text-sm opacity-75">
            That's equivalent to {Math.round((stats?.totalSpaceSaved || 0) / (1024 * 1024 * 4.7))} DVDs worth of storage!
          </p>
        </motion.div>

        {/* Environmental Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="text-4xl mb-2">🌳</div>
            <p className="text-2xl font-bold text-green-700">
              {Math.round((stats?.totalSpaceSaved || 0) / (1024 * 1024 * 1024) * 0.1 / 21)}
            </p>
            <p className="text-sm text-green-600">Trees Worth of CO2 Saved</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-2xl font-bold text-blue-700">
              {Math.round((stats?.totalSpaceSaved || 0) / (1024 * 1024 * 1024) * 7)}
            </p>
            <p className="text-sm text-blue-600">kWh of Energy Saved</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-4xl mb-2">🌍</div>
            <p className="text-2xl font-bold text-purple-700">
              {Math.round((stats?.totalSpaceSaved || 0) / (1024 * 1024 * 1024) * 0.1)}
            </p>
            <p className="text-sm text-purple-600">kg of CO2 Reduced</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
