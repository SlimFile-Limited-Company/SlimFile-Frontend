import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Rss, Minimize2, RefreshCw, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

function getToken() { return localStorage.getItem('jwt') || ''; }

// Routes where the bottom nav should not appear (full-screen app experiences)
const HIDDEN_PREFIXES = ['/meet/', '/my-whiteboards/', '/documents/', '/login'];
function isHiddenRoute(pathname: string) {
  if (HIDDEN_PREFIXES.some(p => pathname.startsWith(p))) return true;
  // /workspaces/:id — hide only when there's a specific workspace ID (2 segments)
  if (/^\/workspaces\/[^/]+/.test(pathname)) return true;
  return false;
}

const tabs = [
  { label: 'Home',      icon: Home,            to: '/' },
  { label: 'Inbox',     icon: MessageCircle,   to: '/messages' },
  { label: 'Feed',      icon: Rss,             to: '/feed' },
  { label: 'Compress',  icon: Minimize2,       to: '/compress' },
  { label: 'Convert',   icon: RefreshCw,       to: '/convert-only' },
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const [dmUnread, setDmUnread] = useState(0);

  useEffect(() => {
    if (!getToken()) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/dm/unread`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setDmUnread(data.count || 0);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  if (isHiddenRoute(location.pathname)) return null;

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-1px_16px_rgba(0,0,0,0.07)]">
      <div className="flex items-stretch">
        {tabs.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          const badge = to === '/messages' ? dmUnread : 0;
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center pt-2 pb-safe-or-3 gap-[3px] relative transition-colors min-h-[56px]
                ${active ? 'text-red-600' : 'text-gray-400 active:text-gray-600'}`}
            >
              {/* Active indicator bar at top */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] bg-red-500 rounded-b-full" />
              )}

              {/* Icon with optional badge */}
              <div className="relative">
                <Icon
                  className="w-[22px] h-[22px]"
                  strokeWidth={active ? 2.3 : 1.8}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5 leading-none border border-white">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] leading-none font-medium ${active ? 'text-red-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
