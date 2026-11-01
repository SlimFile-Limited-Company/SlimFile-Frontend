import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/lib/auth';
import { useSEO } from '@/hooks/useSEO';

interface SignInRequiredProps {
  children: ReactNode;
  /** Feature name used in the heading, e.g. "Whiteboards". */
  feature: string;
  icon: LucideIcon;
  description: string;
  benefits?: string[];
  /** Search title and description; the sign-in card is what search engines see. */
  seo: { title: string; description: string };
}

/**
 * Wraps a page that needs an account. Signed-in users see the page; everyone
 * else gets a friendly modal explaining why to sign in, instead of being
 * bounced to the login screen without context.
 */
export default function SignInRequired({ children, feature, icon: Icon, description, benefits = [], seo }: SignInRequiredProps) {
  useSEO(seo);
  const location = useLocation();
  const navigate = useNavigate();
  const signedIn = isAuthenticated();

  const signIn = () => navigate('/login', { state: { from: location } });
  const notNow = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  useEffect(() => {
    if (signedIn) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') notNow(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [signedIn]);

  if (signedIn) return <>{children}</>;

  return (
    <div className="fixed inset-x-0 top-12 bottom-0 z-30 flex items-center justify-center px-4 bg-[#f5f5f7]">
      {/* Dotted canvas behind the dialog, hinting at what is waiting */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: 'radial-gradient(#d2d2d7 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-required-title"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md rounded-[28px] bg-white p-8 sm:p-10 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
      >
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center">
          <Icon className="w-7 h-7 text-red-600" strokeWidth={1.75} />
        </div>

        <h2 id="signin-required-title" className="text-[28px] leading-tight font-semibold tracking-tight text-[#1d1d1f]">
          Sign in to use {feature}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{description}</p>

        {benefits.length > 0 && (
          <ul className="mt-6 space-y-2 text-left inline-block">
            {benefits.map(b => (
              <li key={b} className="flex items-center gap-2.5 text-[15px] text-[#1d1d1f]">
                <Check className="w-4 h-4 text-red-600 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Button onClick={signIn} className="h-12 text-[15px] w-full">
            Sign in
          </Button>
          <button
            onClick={notNow}
            className="h-11 text-[15px] text-red-600 hover:text-red-700 transition-colors"
          >
            Not now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
