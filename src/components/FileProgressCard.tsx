import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import type { TransferProgress } from '@/lib/uploadWithProgress';

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatDuration = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, '0')}s`;
};

// Status words in the spirit of a terminal assistant's "thinking" line:
// one playful verb at a time, swapped every couple of seconds.
const VERBS = {
  uploading: ['Uploading', 'Sending', 'Beaming up', 'Handing over'],
  downloading: ['Fetching', 'Delivering', 'Wrapping up'],
} as const;

type Mode = 'compress' | 'convert' | 'both';

const PROCESSING_VERBS: Record<Mode, readonly string[]> = {
  compress: [
    'Slimming', 'SlimFiling', 'Squeezing', 'Shrinking', 'Compacting', 'Condensing',
    'Trimming', 'Tightening', 'Crunching', 'Distilling', 'Decluttering', 'Streamlining',
    'Flattening', 'Pressing', 'Tidying', 'Polishing',
  ],
  convert: [
    'Converting', 'Reformatting', 'Transforming', 'Reshaping', 'Rebuilding', 'Translating',
    'Rearranging', 'Remapping', 'Retyping', 'Re-laying out', 'Morphing', 'SlimFiling',
  ],
  both: [
    'Converting', 'Reformatting', 'Transforming', 'Slimming', 'SlimFiling', 'Squeezing',
    'Shrinking', 'Compacting', 'Rebuilding', 'Condensing', 'Crunching', 'Polishing',
  ],
};

const PROCESSING_LABEL: Record<Mode, string> = {
  compress: 'Compress',
  convert: 'Convert',
  both: 'Convert & compress',
};

const SPARKS = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

/** Re-render on an interval while active, for the sparkle and the timers. */
const useTicker = (active: boolean, ms: number) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick(t => t + 1), ms);
    return () => clearInterval(id);
  }, [active, ms]);
  return tick;
};


const stepIndex = (stage: TransferProgress['stage']) =>
  stage === 'uploading' ? 0 : stage === 'processing' ? 1 : stage === 'downloading' ? 2 : stage === 'done' ? 3 : -1;

interface FileProgressCardProps {
  file: File;
  progress: TransferProgress;
  /** Which words and step label to use while the server works. */
  mode?: Mode;
}

export const FileProgressCard = ({ file, progress, mode = 'compress' }: FileProgressCardProps) => {
  const steps = [
    { stage: 'uploading', label: 'Upload' },
    { stage: 'processing', label: PROCESSING_LABEL[mode] },
    { stage: 'downloading', label: 'Download' },
  ];
  const { stage, loaded, total, speed, stageStartedAt } = progress;
  const running = stage === 'uploading' || stage === 'processing' || stage === 'downloading';
  const spark = useTicker(running, 120);
  const verbTick = useTicker(running, 2200);

  const current = stepIndex(stage);
  const elapsed = (Date.now() - stageStartedAt) / 1000;
  const percent = total ? Math.round((loaded / total) * 100) : 0;
  const remaining = speed > 0 && total ? (total - loaded) / speed : null;

  const verbs = stage === 'processing' ? PROCESSING_VERBS[mode] : running ? VERBS[stage as 'uploading' | 'downloading'] : null;
  const verb = verbs ? verbs[verbTick % verbs.length] : '';

  // Right-hand figure: a real percent while bytes move, a timer while the
  // server works (it does not report how far along it is).
  const figure = stage === 'processing' ? formatDuration(elapsed) : total ? `${percent}%` : '';

  const detail =
    stage === 'processing'
      ? elapsed > 20
        ? 'Large files can take a few minutes. Keep this tab open.'
        : 'Your file never gets stored. It is deleted as soon as it is done.'
      : stage === 'uploading' || stage === 'downloading'
        ? [
            total ? `${formatBytes(loaded)} of ${formatBytes(total)}` : formatBytes(loaded),
            speed > 0 ? `${formatBytes(speed)}/s` : null,
            remaining !== null && remaining > 1 ? `about ${formatDuration(remaining)} left` : null,
          ].filter(Boolean).join(' · ')
        : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm mb-4 text-left"
    >
      {/* File */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        </div>
      </div>

      {/* Status line */}
      <div className="mt-5">
        {stage === 'queued' && (
          <p className="font-mono text-sm text-gray-400">· Waiting its turn…</p>
        )}

        {stage === 'error' && (
          <p className="font-mono text-sm text-red-600">✕ Couldn't compress this one. Moving on.</p>
        )}

        {running && (
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-2 font-mono text-base sm:text-lg text-gray-900 min-w-0">
              <span className="text-red-600 w-4 inline-block text-center">{SPARKS[spark % SPARKS.length]}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={verb}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="truncate"
                >
                  {verb}…
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-gray-900 tabular-nums shrink-0">
              {figure}
            </span>
          </div>
        )}

        {detail && <p className="mt-1.5 font-mono text-xs text-gray-500 tabular-nums">{detail}</p>}
      </div>

      {/* Steps, as text */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
        {steps.map((step, i) => {
          const done = current > i;
          const active = current === i;
          return (
            <span
              key={step.stage}
              className={done ? 'text-gray-900' : active ? 'text-red-600 font-semibold' : 'text-gray-400'}
            >
              {done ? <Check className="inline w-3 h-3 mr-1 -mt-0.5" /> : active ? '› ' : ''}
              {step.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
};
