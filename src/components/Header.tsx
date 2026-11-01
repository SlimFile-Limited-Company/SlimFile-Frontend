import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Bot, Star, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, logout } from "@/lib/auth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

/* 9-dot launcher, matching the `ico--more` glyph iLovePDF uses to open its
   header overflow menu: 3x3 solid circles in a 24px box, r=2.17, centres on
   2.17 / 12 / 21.83 (measured off their sprite). lucide's Grid3x3 is a square
   grid with divider lines, which reads as a windowpane, not a launcher. */
const GridDots = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    {[2.17, 12, 21.83].map((cy) =>
      [2.17, 12, 21.83].map((cx) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.17} />
      ))
    )}
  </svg>
);

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [globalStats, setGlobalStats] = useState<{ totalCompressions: number; totalSpaceSaved: number; avgCompressionRatio: number } | null>(null);
  const [mobileDropdownsOpen, setMobileDropdownsOpen] = useState<{
    tools: boolean;
    internal: boolean;
    more: boolean;
  }>({
    tools: false,
    internal: false,
    more: false,
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

  // File tools only, in the same order as the home page tabs (Files, PDF,
  // Scan, AI Lab). Team pages are reached from the home page Team tab.
  const toolsNavigation: { name: string; href: string; external?: boolean }[] = [
    { name: "Compress", href: "/compress" },
    { name: "Convert", href: "/convert-only" },
    { name: "Compress and Convert", href: "/convert-compress" },
    { name: "Zip Files & Folders", href: "/zip" },
    { name: "QR Code Generator", href: "/qr-code" },
    { name: "PDF Merger & Splitter", href: "/forge" },
    { name: "Merge & Compress PDFs", href: "/merge-compress" },
    { name: "Split & Compress PDFs", href: "/split-compress" },
    { name: "Text to PDF", href: "/text-to-pdf" },
    { name: "OCR Tool", href: "/ocr-tool" },
    { name: "PDF Password Protect", href: "/lock" },
    { name: "Scan & Compress", href: "/scan-compress" },
    { name: "Batch Scan & Merge", href: "/scan-merge" },
    { name: "Batch Scan & Split", href: "/scan-split" },
    { name: "Scan & Convert", href: "/scan-convert" },
    { name: "AI Lab", href: "/ai-lab" },
  ];

  // Full-width Tools menu, laid out like Apple's: a first column of large
  // links to the most used tools, then smaller grouped columns.
  const toolsMenu = {
    featured: {
      title: "Explore Tools",
      links: [
        { name: "Compress", href: "/compress" },
        { name: "Convert & Compress", href: "/convert-compress" },
        { name: "Merge & Compress PDFs", href: "/merge-compress" },
        { name: "Scan & Compress", href: "/scan-compress" },
        { name: "AI Lab", href: "/ai-lab" },
      ],
    },
    groups: [
      {
        title: "PDF",
        links: [
          { name: "PDF Merger & Splitter", href: "/forge" },
          { name: "Split & Compress PDFs", href: "/split-compress" },
          { name: "Text to PDF", href: "/text-to-pdf" },
          { name: "OCR Tool", href: "/ocr-tool" },
          { name: "PDF Password Protect", href: "/lock" },
        ],
      },
      {
        title: "Files",
        links: [
          { name: "Convert", href: "/convert-only" },
          { name: "Compress and Convert", href: "/convert-compress" },
          { name: "Zip Files & Folders", href: "/zip" },
          { name: "QR Code Generator", href: "/qr-code" },
        ],
      },
      {
        title: "Scan",
        links: [
          { name: "Scan & Compress", href: "/scan-compress" },
          { name: "Batch Scan & Merge", href: "/scan-merge" },
          { name: "Batch Scan & Split", href: "/scan-split" },
          { name: "Scan & Convert", href: "/scan-convert" },
        ],
      },
    ],
  };

  const isToolActive = (href: string) =>
    location.pathname === href || (href === '/ai-lab' && location.pathname.startsWith('/ai-lab'));

  const internalNavigation = [
    { name: "CEO Dashboard", href: "/ceo-dashboard" },
    { name: "B2B API Keys", href: "/b2b-api-keys-admin" },
    { name: "Newsletter", href: "/admin/newsletter" },
    { name: "Review Emails", href: "/admin/review-emails" },
    { name: "Security Terminal", href: "/security-terminal" },
  ];

  const internalMenu = {
    featured: {
      title: "Internal",
      links: [
        { name: "CEO Dashboard", href: "/ceo-dashboard" },
        { name: "B2B API Keys", href: "/b2b-api-keys-admin" },
      ],
    },
    groups: [
      {
        title: "Communications",
        links: [
          { name: "Newsletter", href: "/admin/newsletter" },
          { name: "Review Emails", href: "/admin/review-emails" },
        ],
      },
      {
        title: "Security",
        links: [{ name: "Security Terminal", href: "/security-terminal" }],
      },
    ],
  };

  /* The 9-dot "apps" menu in the header. Everything that used to sit as loose
     buttons on the right — Play Store, the Assistant bot, Reviews — is folded
     in here, plus SlimFile Business which opens a mail to administration. */
  const moreNavigation = [
    { name: "Play Store", href: "https://play.google.com/store/apps/details?id=com.slimfile.app", external: true },
    { name: "SlimFile Assistant", href: "/community-manager" },
    { name: "Reviews", href: "/reviews" },
    { name: "SlimFile Business", href: "mailto:administration@slim-file.com" },
  ];

  const isMail = (href: string) => href.startsWith("mailto:");


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

  const toggleMobileDropdown = (dropdown: 'tools' | 'internal' | 'more') => {
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

  /* Reviews, Login and Logout all use this one neutral pill, matching the
     Google Play button above them: no brand colour, just a grey outline. */
  const appleTextLink =
    "text-[13px] tracking-[-0.01em] text-[#1d1d1f]/75 hover:text-[#1d1d1f] transition-colors duration-200";

  const pillBtn =
    "flex items-center gap-1.5 h-9 px-4 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 text-xs font-semibold";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* apple.com-style bar: thin and frosted, logo left, menu centred in
            small plain text, icons right. The outer blocks share the spare
            width equally so the menu stays centred without overlapping. */}
        <div className="flex items-center justify-between h-12">
          <div className="flex flex-1 items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <img
                src="/logo.gif"
                alt="SlimFile Logo"
                className="h-7 w-7 object-contain rounded-md"
              />
              <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">SlimFile</span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-none items-center gap-2">
            <Link
              to="/"
              className={cn(
                "text-[13px] tracking-[-0.01em] transition-colors duration-200 px-3 py-1 whitespace-nowrap",
                location.pathname === "/" ? "text-[#1d1d1f] font-medium" : "text-[#1d1d1f]/75 hover:text-[#1d1d1f]"
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
                "text-[13px] tracking-[-0.01em] transition-colors duration-200 px-3 py-1 whitespace-nowrap",
                hoveredDropdown === 'tools' || toolsNavigation.some(item => isToolActive(item.href))
                  ? "text-[#1d1d1f] font-medium"
                  : "text-[#1d1d1f]/75 hover:text-[#1d1d1f]"
              )}>
                Tools
              </button>
              <MegaMenu
                open={hoveredDropdown === 'tools'}
                featured={toolsMenu.featured}
                groups={toolsMenu.groups}
                isActive={isToolActive}
                onEnter={() => handleDropdownHover('tools')}
                onLeave={() => handleDropdownHover(null)}
                onPick={() => setHoveredDropdown(null)}
              />
            </div>

            {/* Dev Tools: one page; access is arranged through sales */}
            <Link
              to="/api"
              className={cn(
                "text-[13px] tracking-[-0.01em] transition-colors duration-200 px-3 py-1 whitespace-nowrap",
                isActiveRoute("/api") ? "text-[#1d1d1f] font-medium" : "text-[#1d1d1f]/75 hover:text-[#1d1d1f]"
              )}
            >
              Dev Tools
            </Link>

            {/* Internal Dropdown (Admin Only) */}
            {isAdmin && (
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover('internal')}
                onMouseLeave={() => handleDropdownHover(null)}
              >
                <button className={cn(
                  "text-[13px] tracking-[-0.01em] transition-colors duration-200 px-3 py-1 whitespace-nowrap",
                  hoveredDropdown === 'internal' || internalNavigation.some(item => isActiveRoute(item.href))
                    ? "text-[#1d1d1f] font-medium"
                    : "text-[#1d1d1f]/75 hover:text-[#1d1d1f]"
                )}>
                  Internal
                </button>
                <MegaMenu
                  open={hoveredDropdown === 'internal'}
                  featured={internalMenu.featured}
                  groups={internalMenu.groups}
                  isActive={isActiveRoute}
                  onEnter={() => handleDropdownHover('internal')}
                  onLeave={() => handleDropdownHover(null)}
                  onPick={() => setHoveredDropdown(null)}
                />
              </div>
            )}

          </nav>

          {/* Apps / 9-dot menu - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('more')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button
                title="More"
                aria-label="More"
                aria-expanded={hoveredDropdown === 'more'}
                className="p-1.5 -m-1.5 flex items-center justify-center text-[#1d1d1f]/75 hover:text-[#1d1d1f] transition-colors duration-200"
              >
                <GridDots className="w-4 h-4" />
              </button>
              <AnimatePresence>
              {hoveredDropdown === 'more' && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-full right-0 mt-3 w-64 origin-top-right bg-white/90 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-black/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-1.5 z-50"
                >
                  <p className="px-3 pt-2 pb-1.5 text-xs font-medium text-[#6e6e73]">More from SlimFile</p>
                  {moreNavigation.map((item) => {
                    const inner = (
                      <>
                        {item.name === "Play Store" ? (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                          </svg>
                        ) : item.name === "SlimFile Assistant" ? (
                          <Bot className="w-4 h-4 shrink-0" />
                        ) : item.name === "Reviews" ? (
                          <Star className="w-4 h-4 shrink-0" />
                        ) : (
                          <Mail className="w-4 h-4 shrink-0" />
                        )}
                        <span>{item.name}</span>
                      </>
                    );
                    const cls =
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-[#1d1d1f] hover:bg-black/[0.05] transition-colors duration-150 [&_svg]:text-[#6e6e73]";

                    return item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : isMail(item.href) ? (
                      <a key={item.name} href={item.href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link key={item.name} to={item.href} className={cls}>
                        {inner}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
              </AnimatePresence>
            </div>
            {isAuthenticated() ? (
              <button onClick={() => logout()} className={appleTextLink}>
                {t('header.logout')}
              </button>
            ) : (
              <Link to="/login" className={appleTextLink}>
                {t('header.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1.5">
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

              {/* Mobile Dev Tools */}
              <div className="px-4">
                <Link
                  to="/api"
                  className="block py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dev Tools
                </Link>
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

              {/* Mobile 9-dot / apps menu */}
              <div className="px-4 pt-2">
                <button
                  onClick={() => toggleMobileDropdown('more')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <GridDots className="w-4 h-4" />
                    More
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.more && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.more && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {moreNavigation.map((item) =>
                      item.external || isMail(item.href) ? (
                        <a
                          key={item.name}
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name === "Play Store" ? (
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
                              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                          ) : item.name === "Reviews" ? (
                            <Star className="w-4 h-4 shrink-0" />
                          ) : (
                            <Mail className="w-4 h-4 shrink-0" />
                          )}
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Bot className="w-4 h-4 shrink-0" />
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>

              {isAuthenticated() ? (
                <div className="px-4 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className={`${pillBtn} w-full justify-center`}
                  >
                    {t('header.logout')}
                  </button>
                </div>
              ) : (
                <div className="px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`${pillBtn} w-full justify-center`}>
                    {t('header.login')}
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

type MenuLink = { name: string; href: string };
type MenuGroup = { title: string; links: MenuLink[] };

interface MegaMenuProps {
  open: boolean;
  featured: MenuGroup;
  groups: MenuGroup[];
  isActive: (href: string) => boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPick: () => void;
}

/**
 * Full-width header menu in the style of apple.com: the panel grows down from
 * the header, the first column holds large links, the other columns fade in
 * one after another, and the page behind is blurred.
 *
 * Rendered into document.body: the header's own backdrop-filter would
 * otherwise trap the fixed panel and stop the page blur from working.
 */
const MegaMenu = ({ open, featured, groups, isActive, onEnter, onLeave, onPick }: MegaMenuProps) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* It ignores the pointer, so moving onto the page closes the menu. */}
          <motion.div
            key="mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden md:block fixed inset-x-0 top-12 bottom-0 z-40 bg-gray-900/10 backdrop-blur-md pointer-events-none"
          />
          <motion.div
            key="mega-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="hidden md:block fixed inset-x-0 top-12 z-50 overflow-hidden bg-[#fbfbfd]/95 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex gap-16 pl-[3.25rem]">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="min-w-[16rem]"
                >
                  <p className="text-xs font-medium text-gray-500 mb-3">{featured.title}</p>
                  <ul className="space-y-1.5">
                    {featured.links.map(item => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={onPick}
                          className={cn(
                            "text-2xl font-semibold tracking-tight transition-colors duration-200",
                            isActive(item.href) ? "text-red-600" : "text-gray-900 hover:text-red-600"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {groups.map((group, i) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    className="min-w-[10rem]"
                  >
                    <p className="text-xs font-medium text-gray-500 mb-3">{group.title}</p>
                    <ul className="space-y-2">
                      {group.links.map(item => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            onClick={onPick}
                            className={cn(
                              "text-sm font-medium transition-colors duration-200",
                              isActive(item.href) ? "text-red-600" : "text-gray-700 hover:text-red-600"
                            )}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
