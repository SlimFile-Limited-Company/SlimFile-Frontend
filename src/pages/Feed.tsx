import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Zap, FileText, Image, Archive, Users, TrendingUp, HardDrive, BarChart2, Monitor } from 'lucide-react';

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
  isNew?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatBytes = (bytes: number) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
};

const getFileExt = (filename: string) => {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts[parts.length - 1].toLowerCase() : '';
};

const getFileTypeLabel = (fileType: string) => {
  if (fileType.includes('image')) return 'Image';
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation';
  if (fileType.includes('sheet') || fileType.includes('excel')) return 'Spreadsheet';
  if (fileType.includes('word') || fileType.includes('document')) return 'Document';
  if (fileType.includes('zip') || fileType.includes('archive')) return 'Archive';
  return 'File';
};

const FILE_TYPE_CONFIG: Record<string, { icon: typeof FileText; bg: string; text: string }> = {
  image:        { icon: Image,    bg: 'bg-amber-100',   text: 'text-amber-600'  },
  pdf:          { icon: FileText, bg: 'bg-red-100',     text: 'text-red-600'    },
  presentation: { icon: Monitor,  bg: 'bg-orange-100',  text: 'text-orange-600' },
  spreadsheet:  { icon: BarChart2,bg: 'bg-emerald-100', text: 'text-emerald-600'},
  document:     { icon: FileText, bg: 'bg-blue-100',    text: 'text-blue-600'   },
  archive:      { icon: Archive,  bg: 'bg-purple-100',  text: 'text-purple-600' },
  default:      { icon: FileText, bg: 'bg-gray-100',    text: 'text-gray-600'   },
};

const getFileTypeConfig = (fileType: string) => {
  if (fileType.includes('image')) return FILE_TYPE_CONFIG.image;
  if (fileType.includes('pdf'))   return FILE_TYPE_CONFIG.pdf;
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return FILE_TYPE_CONFIG.presentation;
  if (fileType.includes('sheet') || fileType.includes('excel')) return FILE_TYPE_CONFIG.spreadsheet;
  if (fileType.includes('word') || fileType.includes('document')) return FILE_TYPE_CONFIG.document;
  if (fileType.includes('zip') || fileType.includes('archive')) return FILE_TYPE_CONFIG.archive;
  return FILE_TYPE_CONFIG.default;
};

const OPERATION_CONFIG = {
  compress:         { label: 'Compressed',           bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  convert:          { label: 'Converted',             bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
  'convert-compress': { label: 'Converted & Compressed', bg: 'bg-blue-50', text: 'text-blue-700',   dot: 'bg-blue-500'    },
};

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ── Circular gauge ────────────────────────────────────────────────────────────
const CircularGauge = ({ ratio }: { ratio: number }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(ratio, 100) / 100) * circ;
  const color = ratio >= 70 ? '#10b981' : ratio >= 40 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <motion.circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-800">
        {ratio}%
      </span>
    </div>
  );
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-2.5 bg-gray-100 rounded w-16" />
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-100" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-20" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="flex items-center justify-between">
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="w-14 h-14 rounded-full bg-gray-100" />
    </div>
  </div>
);

// ── Feed card ─────────────────────────────────────────────────────────────────
const FeedCard = ({ activity, index }: { activity: FeedActivity; index: number }) => {
  const ftConfig = getFileTypeConfig(activity.fileType);
  const opConfig = OPERATION_CONFIG[activity.operation] ?? OPERATION_CONFIG.compress;
  const FileIcon = ftConfig.icon;
  const ext = getFileExt(activity.filename);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6) }}
      className="relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Accent left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${opConfig.dot}`} />

      {/* New badge */}
      {activity.isNew && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          NEW
        </motion.div>
      )}

      <div className="pl-5 pr-5 pt-4 pb-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Anonymous User</p>
            <p className="text-xs text-gray-400">{timeAgo(activity.createdAt)}</p>
          </div>
          <div className={`w-9 h-9 rounded-full ${ftConfig.bg} ${ftConfig.text} flex items-center justify-center flex-shrink-0`}>
            <FileIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Operation + ext badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${opConfig.bg} ${opConfig.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${opConfig.dot}`} />
            {activity.operation === 'convert'
              ? `Converted → ${activity.targetFormat?.toUpperCase()}`
              : opConfig.label}
          </span>
          {ext && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-mono font-medium">
              {ext}
            </span>
          )}
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
            {getFileTypeLabel(activity.fileType)}
          </span>
        </div>

        {/* Main content */}
        {activity.operation === 'convert' ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Original size</p>
              <p className="text-base font-bold text-gray-900">{formatBytes(activity.originalSize)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Output</p>
              <p className="text-base font-bold text-violet-600">{activity.targetFormat?.toUpperCase()}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatBytes(activity.originalSize)}</span>
                  <span className="text-emerald-600 font-medium">{formatBytes(activity.compressedSize)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - activity.compressionRatio}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Saved</span>
                <span className="text-sm font-bold text-emerald-600">{formatBytes(activity.spaceSaved)}</span>
              </div>
            </div>
            <CircularGauge ratio={activity.compressionRatio} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub }: { icon: typeof TrendingUp; label: string; value: string; sub?: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      {sub && <p className="text-xs text-white/50 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export const Feed = () => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'compress' | 'convert'>('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [feedRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/feed?limit=100`),
          fetch(`${API_BASE_URL}/feed/stats`),
        ]);
        if (!feedRes.ok || !statsRes.ok) throw new Error('Failed to fetch');
        setActivities(await feedRes.json());
        setStats(await statsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, [API_BASE_URL]);

  useEffect(() => {
    const socket = io(API_BASE_URL.replace('/api', ''), {
      reconnection: true, reconnectionDelay: 1000,
      reconnectionDelayMax: 5000, reconnectionAttempts: 5,
    });
    socket.on('newActivity', (activity: FeedActivity) => {
      setActivities(prev => [{ ...activity, isNew: true }, ...prev].slice(0, 100));
      // Clear isNew flag after 4s
      setTimeout(() => {
        setActivities(prev => prev.map(a => a._id === activity._id ? { ...a, isNew: false } : a));
      }, 4000);
    });
    return () => { socket.disconnect(); };
  }, [API_BASE_URL]);

  const filteredActivities = activities.filter((a) => {
    if (a.operation !== 'convert') {
      if (!a.compressionRatio || a.compressionRatio <= 0) return false;
      if (!a.spaceSaved || a.spaceSaved <= 0) return false;
    }
    if (filter === 'compress') return a.operation === 'compress';
    if (filter === 'convert') return a.operation.includes('convert');
    return true;
  });

  const counts = {
    all: activities.filter(a => a.operation !== 'convert' ? (a.compressionRatio > 0 && a.spaceSaved > 0) : true).length,
    compress: activities.filter(a => a.operation === 'compress' && a.compressionRatio > 0 && a.spaceSaved > 0).length,
    convert: activities.filter(a => a.operation.includes('convert')).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero stats bar ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
              <span className="text-white/40 text-xs">Real-time activity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Community Feed</h1>
            <p className="text-white/50 text-sm mb-10">See what the world is compressing right now</p>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <StatCard
                icon={Zap}
                label="Total Compressions"
                value={stats ? formatCount(stats.totalCompressions) : '—'}
                sub="files processed"
              />
              <StatCard
                icon={HardDrive}
                label="Space Saved"
                value={stats ? formatBytes(stats.totalSpaceSaved) : '—'}
                sub="across all users"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Compression"
                value={stats ? `${stats.avgCompressionRatio}%` : '—'}
                sub="average ratio"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:block">Filter</span>
          {(['all', 'compress', 'convert'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'compress' ? 'Compress' : 'Convert'}
              <span className={`ml-1.5 text-[10px] ${filter === f ? 'text-white/70' : 'text-gray-400'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>{filteredActivities.length} entries</span>
          </div>
        </div>
      </div>

      {/* ── Feed grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredActivities.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <FeedCard key={activity._id} activity={activity} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No activities yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
