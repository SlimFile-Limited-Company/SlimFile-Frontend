import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { FileText, Image, Archive, BarChart2, Monitor, ArrowRight, Radio } from 'lucide-react';

interface FeedActivity {
  _id: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  spaceSaved: number;
  compressionRatio: number;
  fileType: string;
  operation: 'compress' | 'convert' | 'convert-compress' | 'merge-compress' | 'split-compress'
    | 'scan-compress' | 'scan-merge' | 'scan-split' | 'scan-convert';
  targetFormat?: string;
  createdAt: string;
  isNew?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
};

// Line icon and colour per file type. Colour is only on the icon, as on the
// home tiles; everything else stays neutral.
const fileKind = (fileType: string) => {
  if (fileType.includes('image')) return { icon: Image, color: 'text-amber-500', label: 'Image' };
  if (fileType.includes('pdf')) return { icon: FileText, color: 'text-red-600', label: 'PDF' };
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return { icon: Monitor, color: 'text-orange-500', label: 'Presentation' };
  if (fileType.includes('sheet') || fileType.includes('excel')) return { icon: BarChart2, color: 'text-emerald-600', label: 'Spreadsheet' };
  if (fileType.includes('word') || fileType.includes('document')) return { icon: FileText, color: 'text-blue-600', label: 'Document' };
  if (fileType.includes('zip') || fileType.includes('archive')) return { icon: Archive, color: 'text-purple-600', label: 'Archive' };
  return { icon: FileText, color: 'text-[#6e6e73]', label: 'File' };
};

// Merge, split and the scan tools are different jobs from a plain squeeze,
// so each keeps its own label.
const ACTION_LABELS: Record<FeedActivity['operation'], string> = {
  'compress': 'Compressed',
  'convert': 'Converted',
  'convert-compress': 'Converted & compressed',
  'merge-compress': 'Merged & compressed',
  'split-compress': 'Split & compressed',
  'scan-compress': 'Scanned & compressed',
  'scan-merge': 'Batch scan merged',
  'scan-split': 'Batch scan split',
  'scan-convert': 'Scanned & converted',
};

// ── Pieces ────────────────────────────────────────────────────────────────────

const Stat = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8"
  >
    <p className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">{value}</p>
    <p className="mt-2 text-[15px] text-[#6e6e73]">{label}</p>
  </motion.div>
);

const SkeletonTile = () => (
  <div className="rounded-[22px] bg-[#f5f5f7] p-6 animate-pulse">
    <div className="h-8 w-8 rounded-lg bg-[#e8e8ed]" />
    <div className="mt-5 h-3 w-1/2 rounded-full bg-[#e8e8ed]" />
    <div className="mt-6 h-10 w-1/3 rounded-xl bg-[#e8e8ed]" />
    <div className="mt-4 h-3 w-2/3 rounded-full bg-[#e8e8ed]" />
  </div>
);

const ActivityTile = ({ activity, index }: { activity: FeedActivity; index: number }) => {
  const kind = fileKind(activity.fileType);
  const Icon = kind.icon;
  const isConvert = activity.operation === 'convert';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4), ease: [0.4, 0, 0.2, 1] }}
      className={`relative rounded-[22px] p-6 transition-colors duration-700 ${activity.isNew ? 'bg-red-50' : 'bg-[#f5f5f7]'}`}
    >
      <div className="flex items-start justify-between">
        <Icon className={`w-7 h-7 ${kind.color}`} strokeWidth={1.75} />
        <span className={`text-[13px] ${activity.isNew ? 'text-red-600 font-medium' : 'text-[#6e6e73]'}`}>
          {activity.isNew && <span className="inline-block w-1.5 h-1.5 mr-1.5 mb-0.5 rounded-full bg-red-600 animate-pulse" />}
          {timeAgo(activity.createdAt)}
        </span>
      </div>

      <p className="mt-5 text-[15px] font-semibold text-[#1d1d1f]">{kind.label}</p>
      <p className="text-[13px] text-[#6e6e73]">{ACTION_LABELS[activity.operation] ?? 'Compressed'}</p>

      {isConvert ? (
        <div className="mt-6 flex items-center gap-3">
          <span className="text-[15px] text-[#6e6e73]">{formatBytes(activity.originalSize)}</span>
          <ArrowRight className="w-4 h-4 text-[#d2d2d7]" />
          <span className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            {activity.targetFormat?.toUpperCase() || 'Done'}
          </span>
        </div>
      ) : (
        <>
          <p className="mt-6 text-5xl font-semibold tracking-tight text-red-600 tabular-nums">
            −{activity.compressionRatio}%
          </p>
          <p className="mt-3 text-[13px] text-[#6e6e73] tabular-nums">
            {formatBytes(activity.originalSize)} → {formatBytes(activity.compressedSize)}
            <span className="text-[#1d1d1f]"> · Saved {formatBytes(activity.spaceSaved)}</span>
          </p>
        </>
      )}
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'compress', label: 'Compressed' },
  { key: 'convert', label: 'Converted' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export const Feed = () => {
  useSEO({
    title: 'Live Feed — See Files Being Compressed Right Now | SlimFile',
    description: 'Watch SlimFile\'s real-time feed showing files being compressed around the world. Live stats, file types, and compression ratios.',
  });
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    (async () => {
      try {
        const [fRes, sRes] = await Promise.all([
          fetch(`${API_BASE_URL}/feed?limit=300`),
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
      setActivities(prev => [{ ...a, isNew: true }, ...prev].slice(0, 300));
      setTimeout(() => setActivities(prev => prev.map(x => x._id === a._id ? { ...x, isNew: false } : x)), 4000);
    });
    return () => { socket.disconnect(); };
  }, [API_BASE_URL]);

  // Hide compressions that did not actually save anything.
  const clean = (a: FeedActivity) =>
    a.operation !== 'convert' ? (a.compressionRatio > 0 && a.spaceSaved > 0) : true;

  const filtered = activities.filter(a => {
    if (!clean(a)) return false;
    if (filter === 'compress') return a.operation !== 'convert';
    if (filter === 'convert') return a.operation.includes('convert');
    return true;
  }).slice(0, 100);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="pt-28 sm:pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 mb-3">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            Live from SlimFile
          </div>
          <h1 className="text-4xl sm:text-[56px] sm:leading-[1.07] font-semibold tracking-tight text-[#1d1d1f]">
            Files getting lighter,<br className="hidden sm:block" /> right now.
          </h1>
          <p className="mt-4 text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-2xl">
            Every compression and conversion on SlimFile appears here the moment it happens. File names are never shown.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat value={stats ? formatCount(stats.totalCompressions) : '—'} label="Files compressed" delay={0.05} />
            <Stat value={stats ? formatBytes(stats.totalSpaceSaved) : '—'} label="Space saved for people" delay={0.1} />
            <Stat value={stats ? `${stats.avgCompressionRatio}%` : '—'} label="Smaller, on average" delay={0.15} />
          </div>
        </div>
      </div>

      {/* Filter bar, pinned below the site header */}
      <div className="sticky top-12 z-20 bg-[#fbfbfd]/80 backdrop-blur-xl backdrop-saturate-150 border-y border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#e8e8ed]">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                  filter === f.key ? 'text-[#1d1d1f]' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {filter === f.key && (
                  <motion.span
                    layoutId="feed-filter-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[13px] text-[#6e6e73]">
            <Radio className="w-3.5 h-3.5" /> Updates in real time
          </span>
        </div>
      </div>

      {/* Activity */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonTile key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((a, i) => <ActivityTile key={a._id} activity={a} index={i} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-[28px] bg-[#f5f5f7] py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Radio className="w-6 h-6 text-red-600" strokeWidth={1.75} />
            </div>
            <p className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">Nothing here yet</p>
            <p className="mt-1 text-[15px] text-[#6e6e73]">New activity will appear the moment it happens.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
