import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMPRESS_VERBS = [
  'Analyzing file structure…',
  'Scanning for redundancies…',
  'Removing unnecessary metadata…',
  'Stripping embedded thumbnails…',
  'Optimizing pixel density…',
  'Recalculating color profiles…',
  'Flattening image layers…',
  'Applying SlimFile compression…',
  'Running SlimFile algorithms…',
  'Reducing file weight…',
  'Eliminating duplicate data…',
  'Resampling image resolution…',
  'Compacting document structure…',
  'Shrinking without losing quality…',
  'Processing with SlimFile engine…',
  'Crunching the numbers…',
  'Trimming the fat…',
  'Squeezing every byte…',
  'Balancing quality and size…',
  'Fine-tuning compression ratio…',
  'Cleaning up header data…',
  'Optimizing encoding…',
  'Running lossless pass…',
  'Finalizing output…',
  'Almost there…',
];

const CONVERT_VERBS = [
  'Reading document format…',
  'Parsing file structure…',
  'Extracting document content…',
  'Mapping layout properties…',
  'Rebuilding in target format…',
  'Applying style definitions…',
  'Converting with SlimFile engine…',
  'Translating fonts and spacing…',
  'Reconstructing page layout…',
  'Transferring text blocks…',
  'Resolving formatting conflicts…',
  'Embedding document resources…',
  'Validating output structure…',
  'Running SlimFile converter…',
  'Processing document metadata…',
  'Handling special characters…',
  'Preserving document fidelity…',
  'Aligning content elements…',
  'Generating new file format…',
  'Cross-referencing styles…',
  'Packaging the output…',
  'Wrapping up conversion…',
  'Almost there…',
  'Finalizing your file…',
];

const COMPRESS_CONVERT_VERBS = [
  'Reading original file…',
  'Analyzing document format…',
  'Starting format conversion…',
  'Parsing file structure…',
  'Rebuilding in target format…',
  'Applying SlimFile converter…',
  'Converting successfully…',
  'Switching to compression…',
  'Running SlimFile algorithms…',
  'Applying compression engine…',
  'Reducing file weight…',
  'Optimizing output quality…',
  'Balancing size and fidelity…',
  'Squeezing the converted file…',
  'Crunching the numbers…',
  'Almost there…',
  'Finalizing your file…',
  'Wrapping up…',
];

type Mode = 'compress' | 'convert' | 'both';

interface ProcessingTextProps {
  mode?: Mode;
}

export const ProcessingText = ({ mode = 'compress' }: ProcessingTextProps) => {
  const verbs =
    mode === 'convert'
      ? CONVERT_VERBS
      : mode === 'both'
      ? COMPRESS_CONVERT_VERBS
      : COMPRESS_VERBS;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % verbs.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [verbs.length]);

  return (
    <div className="flex items-center justify-center h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-sm text-gray-500 font-medium"
        >
          {verbs[index]}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
            className="inline-block w-0.5 h-3.5 bg-gray-400 ml-0.5 align-middle"
          />
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
