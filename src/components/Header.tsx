import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Star, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Hide header on B2B admin page
  if (location.pathname === '/b2b-api-keys-admin') {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [globalStats, setGlobalStats] = useState<{ totalCompressions: number; totalSpaceSaved: number; avgCompressionRatio: number } | null>(null);
  const [mobileDropdownsOpen, setMobileDropdownsOpen] = useState<{
    tools: boolean;
    devtools: boolean;
    internal: boolean;
  }>({
    tools: false,
    devtools: false,
    internal: false,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/admin/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setIsAdmin(true);
        }
      } catch (error) {
        // User is not admin, keep isAdmin false
      }
    };
    checkAdmin();
  }, []);

  // Fetch global stats for banner (same endpoint as Feed page)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/feed/stats`);
        if (response.ok) {
          const data = await response.json();
          setGlobalStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch feed stats:', error);
      }
    };
    fetchStats();
  }, []);

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const connectNavigation = [
    { name: "Feed", href: "/feed" },
    ...(isAuthenticated() ? [{ name: "Workspaces", href: "/workspaces" }] : []),
    ...(isAuthenticated() ? [{ name: "Documents", href: "/documents" }] : []),
    ...(isAuthenticated() ? [{ name: "My Whiteboards", href: "/my-whiteboards" }] : []),
    { name: "Meet", href: "/meet" },
  ];

  const devToolsNavigation = [
    { name: "API Dashboard", href: "https://api.slim-file.com/", external: true },
    { name: "Developer Program", href: "https://api.slim-file.com/developer-program", external: true },
    { name: "Audio API", href: "https://system.slim-file.com", external: true },
    { name: "SlimFile SDK", href: "https://www.npmjs.com/package/@slimfile/sdk", external: true },
    { name: "SlimFile CLI", href: "https://www.npmjs.com/package/@slimfile/cli", external: true },
    { name: "SDK on GitHub", href: "https://github.com/ikaydreams-dev/SlimFile-SDK", external: true },
    { name: "CLI on GitHub", href: "https://github.com/ikaydreams-dev/slimfile-cli", external: true },
  ];

  const suitesNavigation = [
    { name: "Compress", href: "/compress" },
    { name: "Convert", href: "/convert-only" },
    { name: "Compress and Convert", href: "/convert-compress" },
    { name: "Audio Compression", href: "https://audio.slim-file.com", external: true },
    { name: "OCR Tool", href: "/ocr-tool" },
    { name: "PDF Merger & Splitter", href: "/forge" },
    { name: "PDF Password Protect", href: "/lock" },
    { name: "Summarize Document", href: "/summarize" },
    { name: "QR Code Generator", href: "/qr-code" },
    { name: "AI Lab", href: "/ai-lab" },
  ];

  // iLovePDF keeps every tool inside one dropdown. "SlimFile Connect" and
  // "SlimFile Suites" were two separate dropdowns and are gone from the header
  // bar, so their items are merged here — otherwise Compress, Convert, Forge,
  // Lock, QR, AI Lab, Feed, Meet and the workspace pages become unreachable
  // from the header.
  const toolsNavigation = [
    ...suitesNavigation,
    ...connectNavigation.filter(c => !suitesNavigation.some(s => s.href === c.href)),
  ];

  const internalNavigation = [
    { name: "CEO Dashboard", href: "/ceo-dashboard" },
    { name: "B2B API Keys", href: "/b2b-api-keys-admin" },
    { name: "Newsletter", href: "/admin/newsletter" },
    { name: "Review Emails", href: "/admin/review-emails" },
    { name: "Security Terminal", href: "/security-terminal" },
  ];


  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleDropdownHover = (dropdown: string | null) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }

    if (dropdown) {
      setHoveredDropdown(dropdown);
    } else {
      // Add a small delay before closing to allow mouse movement to dropdown content
      const timeout = setTimeout(() => {
        setHoveredDropdown(null);
      }, 150);
      setDropdownTimeout(timeout);
    }
  };

  const toggleMobileDropdown = (dropdown: 'tools' | 'devtools' | 'internal') => {
    setMobileDropdownsOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img
                src="/logo.gif"
                alt="SlimFile Logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="text-2xl font-bold text-gray-900">SlimFile</span>
            </Link>

          {/* Desktop Navigation — left aligned next to the logo, iLovePDF style.
              It used to be absolutely centred, which overlapped the logo and the
              auth buttons as items were added. */}
          <nav className="hidden md:flex items-center space-x-1 ml-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full",
                location.pathname === "/"
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {t('header.home')}
            </Link>

            {/* Tools Dropdown — replaces the old Connect and Suites dropdowns */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('tools')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap",
                toolsNavigation.some(item => location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')) || (item.href === '/ai-lab' && location.pathname.startsWith('/ai-lab')))
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'tools' && (
                <div className="absolute top-full left-0 mt-2 w-56 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {toolsNavigation.map((item) => (
                    item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors duration-200",
                          (location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')) || (item.href === '/ai-lab' && location.pathname.startsWith('/ai-lab')))
                            ? "text-red-600 bg-red-50"
                            : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Dev Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('devtools')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap">
                <span>Dev Tools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'devtools' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {devToolsNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Dropdown (Admin Only) */}
            {isAdmin && (
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover('internal')}
                onMouseLeave={() => handleDropdownHover(null)}
              >
                <button className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap",
                  internalNavigation.some(item => isActiveRoute(item.href))
                    ? "text-white bg-red-600 shadow-md font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}>
                  <span>Internal</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {hoveredDropdown === 'internal' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                    {internalNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors duration-200",
                          isActiveRoute(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

          </nav>
          </div>

          {/* Auth buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.slimfile.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Get it on Google Play"
              className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 text-xs font-semibold"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Play Store
            </a>
            <Link to="/community-manager" title="SlimFile Assistant">
              <button className="w-9 h-9 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors">
                <Bot className="w-5 h-5 text-purple-600" />
              </button>
            </Link>
            <Link to="/reviews">
              <Button
                variant="outline"
                className="border-2 border-purple-400 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-500 font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-purple-400" />
                Reviews
              </Button>
            </Link>
            {isAuthenticated() ? (
              <Button
                variant="outline"
                onClick={() => logout()}
              >
                {t('header.logout')}
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                >
                  {t('header.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <div className="transition-transform duration-200" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 bg-white transition-all duration-300 overflow-y-auto max-h-[calc(100vh-4rem)] relative z-50 shadow-md">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname === "/"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.home')}
              </Link>

              {/* Mobile Tools Dropdown — replaces Connect and Suites */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('tools')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap",
                    toolsNavigation.some(item => location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')) || (item.href === '/ai-lab' && location.pathname.startsWith('/ai-lab')))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>Tools</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.tools && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.tools && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {toolsNavigation.map((item) => (
                      item.external ? (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                            (location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')) || (item.href === '/ai-lab' && location.pathname.startsWith('/ai-lab')))
                              ? "text-red-600 bg-red-50 border border-red-100"
                              : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Dev Tools Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('devtools')}
                  className="w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg"
                >
                  <span>Dev Tools</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.devtools && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.devtools && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {devToolsNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Internal Dropdown (Admin Only) */}
              {isAdmin && (
                <div className="px-4">
                  <button
                    onClick={() => toggleMobileDropdown('internal')}
                    className={cn(
                      "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                      internalNavigation.some(item => isActiveRoute(item.href))
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    )}
                  >
                    <span>Internal</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        mobileDropdownsOpen.internal && "transform rotate-180"
                      )}
                    />
                  </button>
                  {mobileDropdownsOpen.internal && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {internalNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                            isActiveRoute(item.href)
                              ? "text-red-600 bg-red-50 border border-red-100"
                              : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Reviews Button */}
              <div className="px-4 pt-2">
                <Link to="/reviews" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-500 font-semibold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-4 h-4 fill-purple-400" />
                    Reviews
                  </Button>
                </Link>
              </div>

              {/* Mobile SlimFile Assistant Link */}
              <div className="px-4 pt-2">
                <Link to="/community-manager" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-purple-600 hover:bg-purple-50 flex items-center justify-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>SlimFile Assistant</span>
                  </Button>
                </Link>
              </div>

              {isAuthenticated() ? (
                <div className="px-4 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <div className="px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    >
                      {t('header.login')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};