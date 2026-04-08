import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { FileText, Image, Archive, TrendingUp, HardDrive, Zap, ArrowRight, BarChart2, Monitor } from 'lucide-react';

interface FeedActivity {
  _id: string;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatBytes = (bytes: number) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
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
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
};

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ── File type config ──────────────────────────────────────────────────────────

type FileConfig = {
  icon: typeof FileText;
  gradient: string;
  iconBg: string;
  iconColor: string;
  label: string;
};

const getFileConfig = (fileType: string): FileConfig => {
  if (fileType.includes('image'))
    return { icon: Image,    gradient: 'from-amber-500 to-orange-500',   iconBg: 'bg-amber-500/20',   iconColor: 'text-amber-300',  label: 'Image' };
  if (fileType.includes('pdf'))
    return { icon: FileText, gradient: 'from-red-500 to-rose-600',       iconBg: 'bg-red-500/20',     iconColor: 'text-red-300',    label: 'PDF' };
  if (fileType.includes('presentation') || fileType.includes('powerpoint'))
    return { icon: Monitor,  gradient: 'from-orange-500 to-amber-600',   iconBg: 'bg-orange-500/20',  iconColor: 'text-orange-300', label: 'Presentation' };
  if (fileType.includes('sheet') || fileType.includes('excel'))
    return { icon: BarChart2,gradient: 'from-emerald-500 to-teal-600',   iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-300',label: 'Spreadsheet' };
  if (fileType.includes('word') || fileType.includes('document'))
    return { icon: FileText, gradient: 'from-blue-500 to-indigo-600',    iconBg: 'bg-blue-500/20',    iconColor: 'text-blue-300',   label: 'Document' };
  if (fileType.includes('zip') || fileType.includes('archive'))
    return { icon: Archive,  gradient: 'from-purple-500 to-violet-600',  iconBg: 'bg-purple-500/20',  iconColor: 'text-purple-300', label: 'Archive' };
  return   { icon: FileText, gradient: 'from-slate-500 to-slate-700',    iconBg: 'bg-slate-500/20',   iconColor: 'text-slate-300',  label: 'File' };
};

const getRatioColor = (ratio: number) => {
  if (ratio >= 70) return 'text-emerald-400';
  if (ratio >= 40) return 'text-blue-400';
  return 'text-amber-400';
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-24 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between mt-4">
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  </div>
);

// ── Feed card ─────────────────────────────────────────────────────────────────

const FeedCard = ({ activity, index }: { activity: FeedActivity; index: number }) => {
  const cfg = getFileConfig(activity.fileType);
  const Icon = cfg.icon;
  const ext = getFileExt(activity.filename);
  const isConvert = activity.operation === 'convert';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.5) }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Coloured header */}
      <div className={`relative bg-gradient-to-br ${cfg.gradient} px-5 pt-5 pb-8`}>
        {/* NEW badge */}
        {activity.isNew && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> NEW
          </motion.span>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider mb-1">
              {isConvert ? `Convert → ${activity.targetFormat?.toUpperCase()}` : 'Compressed'}
            </p>
            <p className="text-white font-semibold text-sm leading-snug">
              {cfg.label} File
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
          </div>
        </div>
      </div>

      {/* Body — overlaps header with negative margin */}
      <div className="relative -mt-4 mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4">
        {/* Extension + time row */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-mono font-semibold">
            {ext}
          </span>
          <span className="text-[11px] text-gray-400">{timeAgo(activity.createdAt)}</span>
        </div>

        {isConvert ? (
          /* Convert card body */
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Original</p>
              <p className="text-base font-bold text-gray-900">{formatBytes(activity.originalSize)}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Output</p>
              <p className="text-base font-bold text-violet-600">{activity.targetFormat?.toUpperCase()}</p>
            </div>
          </div>
        ) : (
          /* Compress card body */
          <div className="flex items-end justify-between">
            <div className="space-y-3 flex-1 mr-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Size saved</p>
                <p className="text-lg font-bold text-gray-900">{formatBytes(activity.spaceSaved)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Before</p>
                  <p className="text-xs font-semibold text-gray-600">{formatBytes(activity.originalSize)}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">After</p>
                  <p className="text-xs font-semibold text-emerald-600">{formatBytes(activity.compressedSize)}</p>
                </div>
              </div>
            </div>

            {/* Big ratio number */}
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Reduced by</p>
              <p className={`text-4xl font-black leading-none ${getRatioColor(activity.compressionRatio)}`}>
                {activity.compressionRatio}
                <span className="text-xl font-bold">%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Hero stat ─────────────────────────────────────────────────────────────────

const HeroStat = ({ icon: Icon, label, value, sub }: { icon: typeof TrendingUp; label: string; value: string; sub: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-1"
  >
    <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <p className="text-3xl sm:text-4xl font-black text-white">{value}</p>
    <p className="text-white/40 text-xs">{sub}</p>
  </motion.div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const Feed = () => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'compress' | 'convert'>('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    (async () => {
      try {
        const [fRes, sRes] = await Promise.all([
          fetch(`${API_BASE_URL}/feed?limit=500`),
          fetch(`${API_BASE_URL}/feed/stats`),
        ]);
        setActivities(await fRes.json());
        setStats(await sRes.json());
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    })();
  }, [API_BASE_URL]);

  useEffect(() => {
    const socket = io(API_BASE_URL.replace('/api', ''), {
      reconnection: true, reconnectionDelay: 1000,
      reconnectionDelayMax: 5000, reconnectionAttempts: 5,
    });
    socket.on('newActivity', (a: FeedActivity) => {
      setActivities(prev => [{ ...a, isNew: true }, ...prev].slice(0, 100));
      setTimeout(() => setActivities(prev => prev.map(x => x._id === a._id ? { ...x, isNew: false } : x)), 4000);
    });
    return () => { socket.disconnect(); };
  }, [API_BASE_URL]);

  const clean = (a: FeedActivity) =>
    a.operation !== 'convert' ? (a.compressionRatio > 0 && a.spaceSaved > 0) : true;

  const filtered = activities.filter(a => {
    if (!clean(a)) return false;
    if (filter === 'compress') return a.operation === 'compress';
    if (filter === 'convert') return a.operation.includes('convert');
    return true;
  });

  const counts = {
    all:      activities.filter(clean).length,
    compress: activities.filter(a => clean(a) && a.operation === 'compress').length,
    convert:  activities.filter(a => clean(a) && a.operation.includes('convert')).length,
  };

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'compress', label: 'Compressed' },
    { key: 'convert',  label: 'Converted' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* ── Hero ── */}
      <div className="bg-[#0A0A0F] pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            <span className="text-white/30 text-xs">Updates in real time</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
            Community Feed
          </h1>
          <p className="text-white/40 text-base mb-14">
            Every file compressed around the world, as it happens.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-white/10 pt-10">
            <HeroStat icon={Zap}        label="Total compressions" value={stats ? formatCount(stats.totalCompressions) : '—'} sub="all time, across all users" />
            <HeroStat icon={HardDrive}  label="Space saved"        value={stats ? formatBytes(stats.totalSpaceSaved)   : '—'} sub="all time, freed globally"   />
            <HeroStat icon={TrendingUp} label="Avg compression"    value={stats ? `${stats.avgCompressionRatio}%`      : '—'} sub="all time average ratio"     />
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-[#0A0A0F] text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? 'text-white/50' : 'text-gray-400'}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-400">
            {filtered.length} entries
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((a, i) => <FeedCard key={a._id} activity={a} index={i} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold">Nothing here yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
