import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Zap, TrendingDown, FileText, Image, Music, Video, Archive, Sparkles } from 'lucide-react';

interface FeedActivity {
  _id: string;
  userName: string;
  userPicture?: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  spaceSaved: number;
  compressionRatio: number;
  fileType: string;
  operation: 'compress' | 'convert' | 'convert-compress';
  targetFormat?: string;
  createdAt: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('image')) return <Image className="w-5 h-5" />;
  if (fileType.includes('audio')) return <Music className="w-5 h-5" />;
  if (fileType.includes('video')) return <Video className="w-5 h-5" />;
  if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
  if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getOperationLabel = (operation: string, targetFormat?: string) => {
  if (operation === 'compress') return 'Compressed';
  if (operation === 'convert') return `Converted to ${targetFormat?.toUpperCase()}`;
  if (operation === 'convert-compress') return `Converted & Compressed`;
  return 'Processed';
};

const FeedCard = ({ activity, index }: { activity: FeedActivity; index: number }) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('audio')) return 'Audio';
    if (fileType.includes('video')) return 'Video';
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'Archive';
    if (fileType.includes('word') || fileType.includes('document')) return 'Document';
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'Spreadsheet';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation';
    return 'File';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-100/50"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Anonymous */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Anonymous avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">A user</h3>
              <p className="text-sm text-gray-500">{timeAgo(activity.createdAt)}</p>
            </div>
          </div>

          {/* Operation badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-red-50 border border-red-200 ml-2 flex-shrink-0"
          >
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-600">
              {getOperationLabel(activity.operation, activity.targetFormat)}
            </span>
          </motion.div>
        </div>

        {/* Anonymous activity description */}
        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <p className="text-sm font-medium text-gray-900 leading-relaxed">
            A user compressed a <span className="font-bold text-blue-600">{formatBytes(activity.originalSize)}</span> {getFileTypeLabel(activity.fileType)} to <span className="font-bold text-green-600">{formatBytes(activity.compressedSize)}</span> <span className="font-bold text-red-600">({activity.compressionRatio}% saved)</span>
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Original size */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3 rounded-lg bg-blue-50 border border-blue-200"
          >
            <p className="text-xs text-blue-600 font-semibold mb-1">Original</p>
            <p className="text-sm font-bold text-blue-900">{formatBytes(activity.originalSize)}</p>
          </motion.div>

          {/* Compressed size */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3 rounded-lg bg-green-50 border border-green-200"
          >
            <p className="text-xs text-green-600 font-semibold mb-1">Compressed</p>
            <p className="text-sm font-bold text-green-900">{formatBytes(activity.compressedSize)}</p>
          </motion.div>

          {/* Compression ratio */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3 rounded-lg bg-red-50 border border-red-200"
          >
            <p className="text-xs text-red-600 font-semibold mb-1">Saved</p>
            <p className="text-sm font-bold text-red-900">{activity.compressionRatio}%</p>
          </motion.div>
        </div>

        {/* Space saved highlight */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
        >
          <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-600">Space Saved</p>
            <p className="text-sm font-bold text-red-600">{formatBytes(activity.spaceSaved)}</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-red-200 to-transparent rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
      />
    </motion.div>
  );
};

export const Feed = () => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'compress' | 'convert'>('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  // Fetch initial feed data and stats
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [feedResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/feed?limit=100`),
          fetch(`${API_BASE_URL}/feed/stats`)
        ]);

        if (!feedResponse.ok || !statsResponse.ok) throw new Error('Failed to fetch feed');
        
        const feedData = await feedResponse.json();
        const statsData = await statsResponse.json();
        
        setActivities(feedData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [API_BASE_URL]);

  // Setup Socket.io connection for real-time updates
  useEffect(() => {
    const newSocket = io(API_BASE_URL.replace('/api', ''), {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to feed socket');
    });

    newSocket.on('newActivity', (activity: FeedActivity) => {
      setActivities((prev) => [activity, ...prev].slice(0, 50)); // Keep last 50
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from feed socket');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [API_BASE_URL]);

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true;
    if (filter === 'compress') return activity.operation === 'compress';
    if (filter === 'convert') return activity.operation.includes('convert');
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Community Feed
            </h1>
            
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch as users around the world compress and convert their files in real-time. See the impact we're making together!
          </p>
        </motion.div>

        {/* Global Stats */}
        {stats && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
            >
              <p className="text-sm text-blue-600 font-semibold mb-2">Total Activities</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalActivities}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
            >
              <p className="text-sm text-green-600 font-semibold mb-2">Total Space Saved</p>
              <p className="text-3xl font-bold text-green-900">{formatBytes(stats.totalSpaceSaved)}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
            >
              <p className="text-sm text-purple-600 font-semibold mb-2">Avg Compression</p>
              <p className="text-3xl font-bold text-purple-900">{stats.avgCompressionRatio}%</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
            >
              <p className="text-sm text-orange-600 font-semibold mb-2">Active Users</p>
              <p className="text-3xl font-bold text-orange-900">{stats.uniqueUsers}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {(['all', 'compress', 'convert'] as const).map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-200'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full"
            />
          </div>
        )}

        {/* Feed grid */}
        {!isLoading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <FeedCard key={activity._id} activity={activity} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">No activities yet. Be the first to compress!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 rounded-full bg-white border-2 border-green-200 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
          <span className="text-sm font-semibold text-gray-700">Live Feed</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
