
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { isAuthenticated, logout } from "@/lib/auth";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: "Contact", href: "/contact" },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <motion.img
              src="/logo.gif"
              alt="SlimFile Logo"
              className="h-10 w-10 object-contain rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <span className="text-2xl font-bold text-gray-900">SlimFile</span>
          </Link>

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
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
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
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>

            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-all duration-300 relative">
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
                {productNavigation.some(item => isActiveRoute(item.href)) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {productNavigation.map((item, index) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "w-full transition-colors duration-200",
                        isActiveRoute(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-all duration-300 relative">
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
                {companyNavigation.some(item => isActiveRoute(item.href)) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {companyNavigation.map((item, index) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "w-full transition-colors duration-200",
                        isActiveRoute(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  className="ml-4"
                  onClick={logout}
                >
                  Logout
                </Button>
              </motion.div>
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
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-xl"
          >
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

              {/* Mobile Product Section */}
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-2"
                >
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
                </motion.div>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};
