import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, Loader2 } from 'lucide-react';
import { ASK_EVENT, declineCampusPrompt, shareLocationForCampus } from '@/lib/campus';

/**
 * Asks once, right after a file finishes, whether to count it for the
 * visitor's campus. Saying no changes nothing else.
 */
export default function CampusPrompt() {
  const [state, setState] = useState<'hidden' | 'ask' | 'working' | 'done'>('hidden');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ask = () => setState(s => (s === 'hidden' ? 'ask' : s));
    window.addEventListener(ASK_EVENT, ask);
    return () => window.removeEventListener(ASK_EVENT, ask);
  }, []);

  useEffect(() => {
    if (state !== 'done') return;
    const t = setTimeout(() => setState('hidden'), 4000);
    return () => clearTimeout(t);
  }, [state]);

  const allow = async () => {
    setState('working');
    const result = await shareLocationForCampus();
    setMessage(
      result && result !== 'denied'
        ? `Counted for ${result.short}. Thanks! 🎓`
        : 'Thanks! You can keep using SlimFile as usual.'
    );
    setState('done');
  };

  const notNow = () => {
    declineCampusPrompt();
    setState('hidden');
  };

  return (
    <AnimatePresence>
      {state !== 'hidden' && (
        <motion.div
          role="dialog"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-4 right-4 bottom-20 md:bottom-6 md:left-6 md:right-auto md:w-[360px] z-[60] rounded-[22px] bg-white/90 backdrop-blur-xl backdrop-saturate-150 border border-black/[0.06] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] p-5"
        >
          {state === 'done' ? (
            <p className="text-[15px] text-[#1d1d1f]">{message}</p>
          ) : (
            <>
              <div className="flex gap-3">
                <span className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4.5 h-4.5 text-red-600" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[#1d1d1f]">Your file is ready! Count it for your campus?</p>
                  <p className="mt-1 text-[13px] leading-snug text-[#6e6e73]">
                    We use your location once to find your school. We only keep the school's name, never where you are.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={allow}
                  disabled={state === 'working'}
                  className="flex-1 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium flex items-center justify-center gap-1.5"
                >
                  {state === 'working' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Allow
                </button>
                <button
                  onClick={notNow}
                  disabled={state === 'working'}
                  className="flex-1 h-9 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-medium"
                >
                  No thanks
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
