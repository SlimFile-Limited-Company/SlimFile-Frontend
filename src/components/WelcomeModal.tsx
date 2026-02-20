import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, Users, Lock, ScanText, FileImage, FilePlus2 } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

const FEATURES = [
  { icon: <FileImage className="w-4 h-4" />, text: 'Compress images & PDFs' },
  { icon: <FilePlus2 className="w-4 h-4" />, text: 'Merge & split PDFs' },
  { icon: <Users className="w-4 h-4" />, text: 'Team workspaces & chat' },
  { icon: <ScanText className="w-4 h-4" />, text: 'OCR text extraction' },
  { icon: <Lock className="w-4 h-4" />, text: 'PDF password protection' },
  { icon: <Zap className="w-4 h-4" />, text: 'Convert & compress in one go' },
];

export const WelcomeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show for guests, once per session
    if (isAuthenticated()) return;
    const seen = sessionStorage.getItem('sf_welcome_seen');
    if (seen) return;

    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem('sf_welcome_seen', '1');
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Top bar */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-500 px-6 pt-8 pb-10 text-center">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.gif" alt="SlimFile" className="w-10 h-10 rounded-xl object-contain" />
            <span className="text-2xl font-bold text-white">SlimFile</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Welcome! 👋</h2>
          <p className="text-red-100 text-sm leading-relaxed">
            The all-in-one platform for compressing, converting, and managing your files.
          </p>
        </div>

        {/* Curved separator */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 h-5 relative">
          <div className="absolute inset-x-0 bottom-0 h-5 bg-white rounded-t-[2rem]" />
        </div>

        {/* Features grid */}
        <div className="px-6 pt-2 pb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
            Everything included — free
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-red-500 shrink-0">{icon}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2.5">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-red-200"
            >
              Log in to SlimFile
            </Link>
            <Link
              to="/login"
              state={{ signup: true }}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-2xl transition-colors"
            >
              Create a free account
            </Link>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
};
