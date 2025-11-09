
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
    { name: "Compress", href: "/compress" },
    { name: "Features", href: "/features" },
    { name: "API", href: "/api" },
    { name: "Why Compression?", href: "/file-compression-education" },
  ];

  const companyNavigation = [
    { name: "Case Studies", href: "/case-studies" },
    { name: "Our Team", href: "/teams" },
    { name: "About", href: "/about" },
    { name: "Global Impact", href: "/global-impact" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "Contact", href: "/contact" },
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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
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
            <Link
              to="/slimfile-game"
              className={cn(
                "md:hidden text-sm font-medium transition-all duration-300 hover:text-red-600 relative flex items-center gap-1 px-2 py-1 rounded-md",
                location.pathname === "/slimfile-game" ? "text-red-600 bg-red-50" : "text-gray-600"
              )}
            >
              <span>Game</span>
              <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">New</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-red-600 relative",
                location.pathname === "/" ? "text-red-600" : "text-gray-600"
              )}
            >
              Home
              {location.pathname === "/" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/blog"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-red-600 relative",
                location.pathname === "/blog" ? "text-red-600" : "text-gray-600"
              )}
            >
              Our Blogs
              {location.pathname === "/blog" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/sdgs"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-red-600 relative",
                location.pathname === "/sdgs" ? "text-red-600" : "text-gray-600"
              )}
            >
              SDGs
              {location.pathname === "/sdgs" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/slimfile-game"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-red-600 relative flex items-center gap-1",
                location.pathname === "/slimfile-game" ? "text-red-600" : "text-gray-600"
              )}
            >
              <span>Game</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">New</span>
              {location.pathname === "/slimfile-game" && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('product')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-all duration-300 relative">
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
                {productNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
              {hoveredDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {productNavigation.map((item, index) => (
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

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('company')}
              onMouseLeave={() => handleDropdownHover(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-all duration-300 relative">
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
                {companyNavigation.some(item => isActiveRoute(item.href)) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
              {hoveredDropdown === 'company' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {companyNavigation.map((item, index) => (
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
              className="hover:bg-red-50"
            >
              <div className="transition-transform duration-200" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-xl transition-all duration-300">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-red-600 rounded-lg",
                  location.pathname === "/"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/blog"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-red-600 rounded-lg",
                  location.pathname === "/blog"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Blogs
              </Link>

              <Link
                to="/sdgs"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-red-600 rounded-lg",
                  location.pathname === "/sdgs"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                SDGs
              </Link>
  
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">Product</div>
                <div className="ml-4 space-y-1">
                  {productNavigation.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-red-600 rounded-lg",
                        isActiveRoute(item.href)
                          ? "text-red-600 bg-red-50"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Company Section */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">Company</div>
                <div className="ml-4 space-y-1">
                  {companyNavigation.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-red-600 rounded-lg",
                        isActiveRoute(item.href)
                          ? "text-red-600 bg-red-50"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {isAuthenticated() && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="w-full mx-4"
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
