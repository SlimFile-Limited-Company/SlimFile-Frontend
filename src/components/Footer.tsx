import { Link, useNavigate, useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { SiTrustpilot } from "react-icons/si";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide footer on AI Lab page
  if (location.pathname === '/ai-lab') {
    return null;
  }

  const handleFooterClick = (path: string, label: string) => {
    trackEvent('footer_link_click', { path, label });
    navigate(path);
  };

  const columns = [
    {
      heading: "SlimFile Suites",
      links: [
        { label: "Compress", path: "/compress" },
        { label: "Convert", path: "/convert-only" },
        { label: "Compress & Convert", path: "/convert-compress" },
        { label: "Audio Compression", path: "https://audio.slim-file.com", external: true },
        { label: "OCR Tool", path: "/ocr-tool" },
        { label: "PDF Merger & Splitter", path: "/forge" },
        { label: "PDF Password Protect", path: "/lock" },
        { label: "Summarize Document", path: "/summarize" },
        { label: "AI Lab", path: "/ai-lab" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", path: "/about" },
        { label: "Partnerships", path: "/partnerships" },
        { label: "SDGs", path: "/sdgs" },
        { label: "News", path: "/news" },
        { label: "Why Compression?", path: "/file-compression-education" },
        { label: "Our Blogs", path: "/blog" },
        { label: "Contact", path: "/contact" },
      ],
    },
    {
      heading: "SlimFile Connect",
      links: [
        { label: "Feed", path: "/feed" },
        { label: "Meet", path: "/meet" },
        { label: "Reviews", path: "/reviews" },
        { label: "Community Manager", path: "/community-manager" },
      ],
    },
    {
      heading: "Dev Tools",
      links: [
        { label: "API Dashboard", path: "https://api.slim-file.com/", external: true },
        { label: "Developer Program", path: "https://api.slim-file.com/developer-program", external: true },
        { label: "Audio API", path: "https://system.slim-file.com", external: true },
        { label: "SlimFile SDK", path: "https://www.npmjs.com/package/@slimfile/sdk", external: true },
        { label: "SlimFile CLI", path: "https://www.npmjs.com/package/@slimfile/cli", external: true },
        { label: "SDK on GitHub", path: "https://github.com/ikaydreams-dev/SlimFile-SDK", external: true },
        { label: "CLI on GitHub", path: "https://github.com/ikaydreams-dev/slimfile-cli", external: true },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
      ],
    },
  ];

  const socials = [
    {
      href: "https://www.linkedin.com/company/slimfile-inc",
      icon: FaLinkedinIn,
      label: "LinkedIn",
      hover: "hover:text-blue-600",
    },
    {
      href: "https://www.instagram.com/slimfile_inc",
      icon: FaInstagram,
      label: "Instagram",
      hover: "hover:text-pink-500",
    },
    {
      href: "https://x.com/slimfile_inc",
      icon: FaXTwitter,
      label: "X",
      hover: "hover:text-black",
    },
    {
      href: "https://www.tiktok.com/@slimfile_inc",
      icon: FaTiktok,
      label: "TikTok",
      hover: "hover:text-black",
    },
    {
      href: "https://www.trustpilot.com/review/slim-file.com",
      icon: SiTrustpilot,
      label: "Trustpilot",
      hover: "hover:text-green-500",
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <h6 className="text-sm font-semibold text-gray-900 mb-3">{col.heading}</h6>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.path}>
                    {(link as any).external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleFooterClick(link.path, link.label)}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-150 text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.gif" alt="SlimFile Logo" className="h-7 w-7 object-contain rounded-md" loading="lazy" />
            <span className="text-sm font-semibold text-gray-900">SlimFile</span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} SlimFile. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socials.map(({ href, icon: Icon, label, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`text-gray-400 transition-colors duration-150 ${hover}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
