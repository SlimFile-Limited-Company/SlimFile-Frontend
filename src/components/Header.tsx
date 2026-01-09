import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const productNavigation = [
    { name: "Compress Only", href: "/compress", badge: "New", external: false },
    { name: "Convert Only", href: "/convert-only", badge: "New", external: false },
    { name: "Convert and Compress", href: "/convert-compress", badge: "New", external: false },
    { name: "Game", href: "/slimfile-game", badge: "New", external: false },
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
              Home
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
                        {item.badge && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full ml-2">
                            {item.badge}
                          </span>
                        )}
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
                <span>SlimFile API</span>
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
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative",
                    location.pathname.startsWith("/dashboard")
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Dashboard
                  {location.pathname.startsWith("/dashboard") && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </Link>
                <Button
                  variant="outline"
                  className="ml-4"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className="ml-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname === "/"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">Product</div>
                <div className="ml-4 space-y-1">
                  {productNavigation.map((item) => {
                    const linkContent = (
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
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
              </div>

              {/* Mobile Company Section */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">Company</div>
                <div className="ml-4 space-y-1">
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
              </div>

              {/* Mobile SlimFile API Section */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">SlimFile API</div>
                <div className="ml-4 space-y-1">
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
              </div>

              <Link
                to="/stepsbuild"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname === "/stepsbuild"
                    ? "text-red-600 bg-red-50 border border-red-100"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                STEPsBuild
              </Link>

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                      location.pathname.startsWith("/dashboard")
                        ? "text-red-600 bg-red-50 border border-red-100"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
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
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    >
                      Login
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