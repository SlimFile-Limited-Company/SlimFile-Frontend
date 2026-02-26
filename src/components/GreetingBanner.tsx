import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  userName: string;
  onDismiss: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 0  && hour < 5)  return { greeting: 'Good Night',     emoji: '🌙' };
  if (hour >= 5  && hour < 12) return { greeting: 'Good Morning',   emoji: '☀️' };
  if (hour >= 12 && hour < 17) return { greeting: 'Good Afternoon', emoji: '🌤️' };
  if (hour >= 17 && hour < 21) return { greeting: 'Good Evening',   emoji: '🌆' };
  return                               { greeting: 'Good Night',     emoji: '🌙' };
};

const DURATION = 5000;

export const GreetingBanner = ({ userName, onDismiss }: Props) => {
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(100);
  const { greeting, emoji }     = getGreeting();

  const dismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 350);
  };

  useEffect(() => {
    // Small delay so transition fires after mount
    const showTimer = setTimeout(() => setVisible(true), 80);

    // Countdown progress bar
    const start    = Date.now();
    const tick     = 40;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (elapsed >= DURATION) {
        clearInterval(interval);
        dismiss();
      }
    }, tick);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="fixed left-1/2 z-[200] w-[340px] max-w-[calc(100vw-24px)]"
      style={{
        top: '108px',
        transform: `translateX(-50%) translateY(${visible ? '0' : '-24px'})`,
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      }}
    >
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Progress bar */}
        <div className="h-[3px] bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400"
            style={{ width: `${progress}%`, transition: 'width 40ms linear' }}
          />
        </div>

        <div className="flex items-center gap-3.5 px-4 py-3.5">
          {/* Logo */}
          <img
            src="/logo.gif"
            alt="SlimFile"
            className="w-11 h-11 rounded-xl object-contain shrink-0 shadow-sm border border-gray-100"
          />

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-snug">
              {emoji} {greeting}, {userName}!
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Welcome back to SlimFile
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
