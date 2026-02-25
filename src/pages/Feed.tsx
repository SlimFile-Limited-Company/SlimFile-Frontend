import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Zap, FileText, Image, Music, Video, Archive, Circle } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Anonymous User</p>
            <p className="text-xs text-gray-500">{timeAgo(activity.createdAt)}</p>
          </div>
          {/* File type icon */}
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            {getFileIcon(activity.fileType)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Operation label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
          <Zap className="w-3.5 h-3.5" />
          {getOperationLabel(activity.operation, activity.targetFormat)}
        </div>

        {/* Main info */}
        {activity.operation === 'convert' ? (
          <>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Converted a <span className="font-medium text-gray-900">{getFileTypeLabel(activity.fileType)}</span> file to{' '}
              <span className="font-medium text-blue-600">{activity.targetFormat?.toUpperCase()}</span>
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-600">Original size</span>
              <span className="text-sm font-semibold text-gray-700">{formatBytes(activity.originalSize)}</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {activity.operation === 'convert-compress' ? 'Converted & compressed' : 'Compressed'} a{' '}
              <span className="font-medium text-gray-900">{getFileTypeLabel(activity.fileType)}</span> file from{' '}
              <span className="font-medium text-gray-900">{formatBytes(activity.originalSize)}</span> to{' '}
              <span className="font-medium text-green-600">{formatBytes(activity.compressedSize)}</span>
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                  <span>Compression ratio</span>
                  <span className="font-semibold text-blue-600">{activity.compressionRatio}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.compressionRatio}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-600">Space saved</span>
                <span className="text-sm font-semibold text-green-600">{formatBytes(activity.spaceSaved)}</span>
              </div>
            </div>
          </>
        )}
      </div>
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
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-8 border-b border-gray-200 mb-6"
        >
          <h1 className="text-3xl font-normal text-gray-900 mb-2">
            Community Activity
          </h1>
          <p className="text-base text-gray-600">
            Real-time compression activity from users worldwide
          </p>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="text-sm text-gray-600 mr-2">Filter:</span>
          {(['all', 'compress', 'convert'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full"
            />
          </div>
        )}

        {/* Feed grid */}
        {!isLoading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-base text-gray-600">No activities yet</p>
                  <p className="text-sm text-gray-500 mt-1">Check back soon for updates</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500" />
          </motion.div>
          <span className="text-sm text-gray-700">Live</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
