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
    product: boolean;
    company: boolean;
    api: boolean;
  }>({
    product: false,
    company: false,
    api: false,
  });

  const productNavigation = [
    { name: "Compress Only", href: "/compress", external: false },
    { name: "Convert Only", href: "/convert-only", external: false },
    { name: "Convert and Compress", href: "/convert-compress", external: false },
    { name: "Game", href: "/slimfile-game", external: false },
  ];

  const companyNavigation = [
    { name: "About", href: "/about" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Global Impact", href: "/global-impact" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "SDGs", href: "/sdgs" },
    { name: "Features", href: "/features" },
    { name: "Why Compression?", href: "/file-compression-education" },
    { name: "Our Blogs", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const apiNavigation = [
    { name: "API Dashboard", href: "https://api.slim-file.com/", external: true },
    { name: "Developer Program", href: "https://api.slim-file.com/developer-program", external: true },
    { name: "API Pricing", href: "https://api.slim-file.com/pricing", external: true },
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

  const toggleMobileDropdown = (dropdown: 'product' | 'company' | 'api') => {
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-all duration-300 relative",
                location.pathname === "/"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t('header.home')}
              {location.pathname === "/" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('product')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 relative",
                productNavigation.some(item => isActiveRoute(item.href))
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}>
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
                {productNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
              {hoveredDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  {productNavigation.map((item) => {
                    const linkContent = (
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                      </div>
                    );

                    return item.external ? (
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
                        {linkContent}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors duration-200",
                          isActiveRoute(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        )}
                      >
                        {linkContent}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('company')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-all duration-300 relative",
                companyNavigation.some(item => isActiveRoute(item.href))
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}>
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
                {companyNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
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
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 relative">
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

            {/* Community Feed */}
            <Link
              to="/feed"
              className={cn(
                "text-sm font-medium transition-all duration-300 relative flex items-center gap-2",
                location.pathname === "/feed"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span>Feed</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Live</span>
              {location.pathname === "/feed" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-all duration-300 relative",
                location.pathname.startsWith("/dashboard")
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t('header.dashboard')}
              {location.pathname.startsWith("/dashboard") && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/global-dashboard"
              className={cn(
                "text-sm font-medium transition-all duration-300 relative flex items-center gap-2",
                location.pathname === "/global-dashboard"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span>Global Stats</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">Live</span>
              {location.pathname === "/global-dashboard" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/stepsbuild"
              className={cn(
                "text-sm font-medium transition-all duration-300 relative",
                location.pathname === "/stepsbuild"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              STEPsBuild
              {location.pathname === "/stepsbuild" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            {isAuthenticated() ? (
              <Button
                variant="outline"
                className="ml-4"
                onClick={logout}
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

          {/* Desktop right side - Language Selector */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          {/* Mobile menu button and language selector */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white/95 hover:bg-red-50 border-2 border-red-200 backdrop-blur-md text-red-600 transition-all duration-300 hover:text-red-700 hover:border-red-300"
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

              {/* Mobile Product Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => toggleMobileDropdown('product')}
                  className={cn(
                    "w-full flex items-center justify-between px-0 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                    productNavigation.some(item => isActiveRoute(item.href))
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  <span>Product</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      mobileDropdownsOpen.product && "transform rotate-180"
                    )}
                  />
                </button>
                {mobileDropdownsOpen.product && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {productNavigation.map((item) => {
                      const linkContent = (
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                      );

                      return item.external ? (
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
                          {linkContent}
                        </a>
                      ) : (
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
                          {linkContent}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

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

              {/* Mobile Feed Link */}
              <Link
                to="/feed"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg flex items-center justify-between",
                  location.pathname === "/feed"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Feed</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Live</span>
              </Link>

              <Link
                to="/stepsbuild"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname === "/stepsbuild"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                STEPsBuild
              </Link>

              <Link
                to="/dashboard"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname.startsWith("/dashboard")
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.dashboard')}
              </Link>

              <Link
                to="/global-dashboard"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg flex items-center justify-between",
                  location.pathname === "/global-dashboard"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Global Stats</span>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">Live</span>
              </Link>

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