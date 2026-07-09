import { Link, useLocation } from 'react-router-dom';
import {
  Home, Rss, Minimize2, RefreshCw, LayoutDashboard,
  GitMerge, Lock, Layers, Users, FileText, PenLine, Video, Scan,
} from 'lucide-react';
import { useEffect, useRef } from 'react';


const HIDDEN_PREFIXES = ['/meet/', '/my-whiteboards/', '/documents/', '/login', '/ai-lab'];
function isHiddenRoute(pathname: string) {
  if (HIDDEN_PREFIXES.some(p => pathname.startsWith(p))) return true;
  if (/^\/workspaces\/[^/]+/.test(pathname)) return true;
  return false;
}

const tabs = [
  { label: 'Home',       icon: Home,            to: '/',                section: null },
  { label: 'Compress',   icon: Minimize2,       to: '/compress',        section: 'suite' },
  { label: 'Convert',    icon: RefreshCw,       to: '/convert-only',    section: 'suite' },
  { label: 'Both',       icon: Layers,          to: '/convert-compress',section: 'suite' },
  { label: 'OCR',        icon: Scan,            to: '/ocr-tool',        section: 'suite' },
  { label: 'Merge PDF',  icon: GitMerge,        to: '/forge',           section: 'suite' },
  { label: 'Lock PDF',   icon: Lock,            to: '/lock',            section: 'suite' },
  { label: 'Feed',       icon: Rss,             to: '/feed',            section: 'connect' },
  { label: 'Workspaces', icon: Users,           to: '/workspaces',      section: 'connect' },
  { label: 'Documents',  icon: FileText,        to: '/documents',       section: 'connect' },
  { label: 'Boards',     icon: PenLine,         to: '/my-whiteboards',  section: 'connect' },
  { label: 'Meet',       icon: Video,           to: '/meet',            section: 'connect' },
  { label: 'Dashboard',  icon: LayoutDashboard, to: '/dashboard',       section: null },
];

// Section accent colours
const sectionColor: Record<string, string> = {
  suite:   'bg-red-500   shadow-[0_3px_10px_rgba(239,68,68,0.35)]',
  connect: 'bg-violet-500 shadow-[0_3px_10px_rgba(139,92,246,0.35)]',
};
const sectionLabel: Record<string, string> = {
  suite:   'text-red-500',
  connect: 'text-violet-500',
};

export default function BottomNav() {
  const location  = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef    = useRef(0);

  /* ── Very slow auto-scroll (20 px / second) ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let last = 0;
    const SPEED = 20; // px per second

    const step = (ts: number) => {
      if (!pausedRef.current && el) {
        const delta = last ? (ts - last) / 1000 : 0;
        el.scrollLeft += SPEED * delta;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      last = ts;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const pause = () => {
      pausedRef.current = true;
      setTimeout(() => { pausedRef.current = false; }, 5000);
    };

    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('mousedown',  pause);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('mousedown',  pause);
    };
  }, []);

  if (isHiddenRoute(location.pathname)) return null;

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60]">
      <div className="bg-white/98 backdrop-blur-xl rounded-t-[28px] border-t border-gray-100/60 shadow-[0_-6px_32px_rgba(0,0,0,0.10)]">

        {/* Handle pill */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-[3px] rounded-full bg-gray-200" />
        </div>

        {/* Scrollable row */}
        <div className="relative">
          {/* Fade — left */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10
                          bg-gradient-to-r from-white to-transparent" />
          {/* Fade — right */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10
                          bg-gradient-to-l from-white to-transparent" />

          <div
            ref={scrollRef}
            className="flex overflow-x-scroll gap-0.5 px-5 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {tabs.map(({ label, icon: Icon, to, section }) => {
              const active = isActive(to);
              const pillBg = active
                ? (section ? sectionColor[section] : 'bg-gray-800 shadow-[0_3px_10px_rgba(0,0,0,0.22)]')
                : 'bg-gray-50';
              const labelCls = active
                ? (section ? sectionLabel[section] : 'text-gray-800')
                : 'text-gray-400';

              return (
                <Link
                  key={to}
                  to={to}
                  className="flex-shrink-0 flex flex-col items-center gap-[5px] px-1.5 py-1.5 min-w-[62px]"
                >
                  {/* Icon pill */}
                  <div className={`relative w-12 h-[34px] rounded-2xl flex items-center justify-center transition-all duration-200 ${pillBg}`}>
                    <Icon
                      className={`w-[17px] h-[17px] transition-colors ${active ? 'text-white' : 'text-gray-400'}`}
                      strokeWidth={active ? 2.3 : 1.7}
                    />
                  </div>

                  {/* Label */}
                  <span className={`text-[9px] leading-none font-semibold whitespace-nowrap transition-colors ${labelCls}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
