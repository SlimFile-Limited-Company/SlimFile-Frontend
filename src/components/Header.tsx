import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileDropdownsOpen, setMobileDropdownsOpen] = useState<{
    company: boolean;
    api: boolean;
    dashboard: boolean;
    connect: boolean;
    suites: boolean;
    devtools: boolean;
  }>({
    company: false,
    api: false,
    dashboard: false,
    connect: false,
    suites: false,
    devtools: false,
  });

  const companyNavigation = [
    { name: "About", href: "/about" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "SDGs", href: "/sdgs" },
    { name: "News", href: "/news" },
    { name: "Why Compression?", href: "/file-compression-education" },
    { name: "Our Blogs", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const apiNavigation = [
    { name: "API Dashboard", href: "https://api.slim-file.com/", external: true },
    { name: "Developer Program", href: "https://api.slim-file.com/developer-program", external: true },
    { name: "API Pricing", href: "https://api.slim-file.com/pricing", external: true },
  ];

  const dashboardNavigation = [
    { name: "My Dashboard", href: "/dashboard" },
    { name: "Global Stats", href: "/global-dashboard" },
  ];

  const connectNavigation = [
    { name: "Feed", href: "/feed" },
    ...(isAuthenticated() ? [{ name: "Workspaces", href: "/workspaces" }] : []),
    ...(isAuthenticated() ? [{ name: "Documents", href: "/documents" }] : []),
    ...(isAuthenticated() ? [{ name: "My Whiteboards", href: "/my-whiteboards" }] : []),
    { name: "Meet", href: "/meet" },
  ];

  const devToolsNavigation = [
    { name: "SlimFile SDK", href: "https://www.npmjs.com/package/@slimfile/sdk", external: true },
    { name: "SlimFile CLI", href: "https://www.npmjs.com/package/@slimfile/cli", external: true },
    { name: "SDK on GitHub", href: "https://github.com/ikaydreams-dev/SlimFile-SDK", external: true },
    { name: "CLI on GitHub", href: "https://github.com/ikaydreams-dev/slimfile-cli", external: true },
  ];

  const suitesNavigation = [
    { name: "Compress", href: "/compress" },
    { name: "Convert", href: "/convert-only" },
    { name: "Compress and Convert", href: "/convert-compress" },
    { name: "OCR Tool", href: "/ocr-tool" },
    { name: "PDF Merger & Splitter", href: "/forge" },
    { name: "PDF Password Protect", href: "/lock" },
    { name: "Summarize Document", href: "/summarize" },
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

  const toggleMobileDropdown = (dropdown: 'company' | 'api' | 'dashboard' | 'connect' | 'suites' | 'devtools') => {
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
      {/* CLI announcement banner */}
      <a
        href="https://api.slim-file.com/cli"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-gray-900 px-6 py-2.5 text-white hover:bg-gray-800 transition-colors duration-200 group"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        <span className="text-sm font-medium tracking-wide">
          <span className="font-semibold">Introducing SlimFile CLI</span>
          <span className="hidden sm:inline opacity-80"> — </span>
          <code className="hidden sm:inline font-mono bg-white/10 px-1.5 py-0.5 rounded text-xs">npm install -g @slimfile/cli</code>
          <span className="hidden sm:inline opacity-80"> · v1.0.0 Live on npm</span>
        </span>
        <span className="text-sm opacity-75 group-hover:translate-x-0.5 transition-transform duration-150">›</span>
      </a>
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
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

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('company')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full",
                companyNavigation.some(item => isActiveRoute(item.href))
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'company' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {companyNavigation.map((item) => (
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

            {/* SlimFile API Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('api')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 px-3 py-1.5 rounded-full">
                <span>API</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'api' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {apiNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors duration-200",
                        "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* SlimFile Connect Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('connect')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap",
                connectNavigation.some(item => location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')))
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <span>SlimFile Connect</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'connect' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {connectNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200",
                        (location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')))
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SlimFile Suites Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('suites')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap",
                suitesNavigation.some(item => location.pathname === item.href || location.pathname.startsWith(item.href))
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <span>SlimFile Suites</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'suites' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {suitesNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200",
                        location.pathname === item.href || location.pathname.startsWith(item.href)
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
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
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 px-3 py-1.5 rounded-full">
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

            {/* Dashboard Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('dashboard')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full",
                dashboardNavigation.some(item => location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard')))
                  ? "text-white bg-red-600 shadow-md font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <span>{t('header.dashboard')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'dashboard' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {dashboardNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200",
                        (location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard') && item.href === '/dashboard'))
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated() ? (
              <Button
                variant="outline"
                className="ml-3"
                onClick={() => logout()}
              >
                {t('header.logout')}
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className="ml-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                >
                  {t('header.login')}
                </Button>
              </Link>
            )}
          </nav>

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

              {/* Mobile Company Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('company')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                    companyNavigation.some(item => isActiveRoute(item.href))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>Company</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.company && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.company && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {companyNavigation.map((item) => (
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

              {/* Mobile SlimFile API Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('api')}
                  className="w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg"
                >
                  <span>API</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.api && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.api && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {apiNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "block px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                          "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile SlimFile Connect Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('connect')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap",
                    connectNavigation.some(item => location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>SlimFile Connect</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.connect && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.connect && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {connectNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                          (location.pathname === item.href || (item.href === '/workspaces' && location.pathname.startsWith('/workspaces')) || (item.href === '/my-whiteboards' && location.pathname.startsWith('/my-whiteboards')))
                            ? "text-red-600 bg-red-50 border border-red-100"
                            : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile SlimFile Suites Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('suites')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap",
                    suitesNavigation.some(item => location.pathname === item.href || location.pathname.startsWith(item.href))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>SlimFile Suites</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.suites && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.suites && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {suitesNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                          location.pathname === item.href || location.pathname.startsWith(item.href)
                            ? "text-red-600 bg-red-50 border border-red-100"
                            : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                      </Link>
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

              {/* Mobile Dashboard Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('dashboard')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                    dashboardNavigation.some(item => location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard')))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>{t('header.dashboard')}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.dashboard && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.dashboard && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {dashboardNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                          (location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard') && item.href === '/dashboard'))
                            ? "text-red-600 bg-red-50 border border-red-100"
                            : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
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