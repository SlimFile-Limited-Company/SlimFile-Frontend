import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { CHANNEL_URL, DOWNLOADED_EVENT, noteDismissed, noteFollowed, noteShown, shouldInvite } from '@/lib/followChannel';

// WhatsApp's mark, drawn in the brand's own style (lucide has no WhatsApp icon).
const WhatsAppMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.83 9.83 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4" />
  </svg>
);

/**
 * Sits under a tool's download button. Hidden until a download happens, then
 * appears in that same spot, where the person is already looking.
 */
export default function FollowChannel({ className = '' }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onDownload = () => {
      if (shouldInvite()) {
        noteShown();
        setVisible(true);
      }
    };
    window.addEventListener(DOWNLOADED_EVENT, onDownload);
    return () => window.removeEventListener(DOWNLOADED_EVENT, onDownload);
  }, []);

  const follow = () => {
    noteFollowed();
    window.open(CHANNEL_URL, '_blank', 'noopener,noreferrer');
    setVisible(false);
  };

  const close = () => {
    noteDismissed();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`overflow-hidden ${className}`}
        >
          <div className="mt-4 rounded-[18px] bg-[#f5f5f7] p-4 flex items-start gap-3 text-left">
            <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
              <Check className="w-4 h-4 text-red-600" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#1d1d1f]">Downloaded</p>
              <p className="mt-0.5 text-[13px] leading-snug text-[#6e6e73]">
                Follow SlimFile on WhatsApp for news, new features, file tips and job openings.
              </p>
              <button
                onClick={follow}
                className="mt-3 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium"
              >
                <WhatsAppMark className="w-4 h-4" />
                Follow the channel
              </button>
            </div>
            <button onClick={close} aria-label="Close" className="p-1 -m-1 text-[#6e6e73] hover:text-[#1d1d1f]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
