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
    { name: "Our Team", href: "/teams" },
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500/95 via-orange-400/95 to-pink-500/95 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:bg-white/30 transition-all duration-300"></div>
                <img
                  src="/logo.gif"
                  alt="SlimFile Logo"
                  className="h-10 w-10 object-contain rounded-xl relative z-10 border-2 border-white/30 group-hover:border-white/50 transition-all duration-300"
                />
              </div>
              <span className="text-2xl font-black text-white drop-shadow-lg group-hover:[text-shadow:_0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300">SlimFile</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={cn(
                "text-sm font-bold transition-all duration-300 relative drop-shadow-lg",
                location.pathname === "/"
                  ? "text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.8)]"
                  : "text-white/90 hover:text-white hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.6)]"
              )}
            >
              Home
              {location.pathname === "/" && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              )}
            </Link>

            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('product')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className={cn(
                "flex items-center space-x-1 text-sm font-bold transition-all duration-300 relative drop-shadow-lg",
                productNavigation.some(item => isActiveRoute(item.href))
                  ? "text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.8)]"
                  : "text-white/90 hover:text-white hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.6)]"
              )}>
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
                {productNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>
              {hoveredDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-2 border-white/30 py-2 z-50">
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
                "flex items-center space-x-1 text-sm font-bold transition-all duration-300 relative drop-shadow-lg",
                companyNavigation.some(item => isActiveRoute(item.href))
                  ? "text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.8)]"
                  : "text-white/90 hover:text-white hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.6)]"
              )}>
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
                {companyNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>
              {hoveredDropdown === 'company' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-2 border-white/30 py-2 z-50">
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
              <button className="flex items-center space-x-1 text-sm font-bold text-white/90 hover:text-white hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300 relative drop-shadow-lg">
                <span>SlimFile API</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {hoveredDropdown === 'api' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-2 border-white/30 py-2 z-50">
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
                "text-sm font-bold transition-all duration-300 relative drop-shadow-lg",
                location.pathname === "/stepsbuild"
                  ? "text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.8)]"
                  : "text-white/90 hover:text-white hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.6)]"
              )}
            >
              STEPsBuild
              {location.pathname === "/stepsbuild" && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              )}
            </Link>

            {isAuthenticated() && (
              <Button
                variant="outline"
                className="ml-4"
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-md text-white transition-all duration-300"
            >
              <div className="transition-transform duration-200" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {mobileMenuOpen ? <X className="w-5 h-5 drop-shadow-lg" /> : <Menu className="w-5 h-5 drop-shadow-lg" />}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20 bg-gradient-to-br from-red-500/98 via-orange-400/98 to-pink-500/98 backdrop-blur-xl transition-all duration-300 overflow-y-auto max-h-[calc(100vh-4rem)] relative z-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                  location.pathname === "/"
                    ? "text-white bg-white/30 backdrop-blur-md border-2 border-white/40"
                    : "text-white/90 hover:text-white hover:bg-white/20"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-4 py-2">
                <div className="text-sm font-black text-white drop-shadow-lg mb-2">Product</div>
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
                          "block px-3 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                          "text-white/90 hover:text-white hover:bg-white/20"
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
                          "block px-3 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                          isActiveRoute(item.href)
                            ? "text-white bg-white/30 backdrop-blur-md border-2 border-white/40"
                            : "text-white/90 hover:text-white hover:bg-white/20"
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
                <div className="text-sm font-black text-white drop-shadow-lg mb-2">Company</div>
                <div className="ml-4 space-y-1">
                  {companyNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                        isActiveRoute(item.href)
                          ? "text-white bg-white/30 backdrop-blur-md border-2 border-white/40"
                          : "text-white/90 hover:text-white hover:bg-white/20"
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
                <div className="text-sm font-black text-white drop-shadow-lg mb-2">SlimFile API</div>
                <div className="ml-4 space-y-1">
                  {apiNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "block px-3 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                        "text-white/90 hover:text-white hover:bg-white/20"
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
                  "px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-lg",
                  location.pathname === "/stepsbuild"
                    ? "text-white bg-white/30 backdrop-blur-md border-2 border-white/40"
                    : "text-white/90 hover:text-white hover:bg-white/20"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                STEPsBuild
              </Link>

              {isAuthenticated() && (
                <div className="px-4 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
