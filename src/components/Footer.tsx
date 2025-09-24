import { Link, useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/utils";

export const Footer = () => {
  const navigate = useNavigate();
  // Define social media and Trustpilot links
  const socialLinks = {
    linkedin: 'https://www.linkedin.com/company/slimfile-inc',
    instagram: 'https://www.instagram.com/slimfile_inc',
    x: 'https://x.com/slimfile_inc?s=11',
    tiktok: 'https://www.tiktok.com/@slimfile_inc?_t=ZM-8yF3RexQsLg&_r=1',
    trustpilot: 'https://www.trustpilot.com/review/slim-file.com'
  };

  const tools = [
    { href: '/compress-pdf-online', label: 'Compress PDF Online' },
    { href: '/compress-pptx-online', label: 'Compress PPTX Online' },
    { href: '/compress-images-online', label: 'Compress Images Online' },
    { href: '/compress-pdf-for-email', label: 'Compress PDF for Email' },
    { href: '/compress-pdf-on-iphone', label: 'Compress PDF on iPhone' },
    { href: '/compress-pdf-without-losing-quality', label: 'Compress PDF Without Losing Quality' },
    { href: '/compress-pptx-for-presentation', label: 'Compress PPTX for Presentation' },
    { href: '/compress-images-for-website', label: 'Compress Images for Website' },
  ];

  const blogs = [
    { href: '/blog/how-to-compress-pdf-for-email', label: 'How to Compress PDF for Email' },
    { href: '/blog/best-tools-to-compress-images-online', label: 'Best Tools to Compress Images Online' },
    { href: '/blog/compress-pptx-presentations-without-losing-quality', label: 'Compress PPTX Presentations Without Losing Quality' },
    { href: '/blog/reduce-pdf-file-size-on-mobile', label: 'Reduce PDF File Size on Mobile' },
    { href: '/blog/how-to-compress-files-for-faster-website-loading', label: 'How to Compress Files for Faster Website Loading' },
    { href: '/blog/why-file-compression-is-essential-for-remote-work', label: 'Why File Compression is Essential for Remote Work' },
    { href: '/blog/compressing-pdf-for-printing-vs-emailing', label: 'Compressing PDF for Printing vs Emailing' },
    { href: '/blog/how-to-compress-large-videos-before-uploading', label: 'How to Compress Large Videos Before Uploading' },
  ];

  const handleFooterClick = (path: string, label: string) => {
    trackEvent('footer_link_click', { path, label });
    // Navigate with hash to trigger hero scroll
    if (path.startsWith('/blog/')) {
      navigate(path + '#hero');
    } else {
      navigate(path + '#hero');
    }
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Tools</h4>
              <ul className="space-y-2">
                {tools.map((item) => (
                  <li key={item.href}>
                    <button
                      className="text-sm text-gray-600 hover:text-primary hover:underline"
                      onClick={() => handleFooterClick(item.href, item.label)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Our Blogs</h4>
              <ul className="space-y-2">
                {blogs.map((item) => (
                  <li key={item.href}>
                    <button
                      className="text-sm text-gray-600 hover:text-primary hover:underline text-left"
                      onClick={() => handleFooterClick(item.href, item.label)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center space-x-3">
                <img src="/logo.gif" alt="SlimFile Logo" className="h-8 w-8 object-contain rounded-md" />
                <span className="text-base font-semibold text-gray-900">SlimFile</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end md:self-end">
            <div className="flex space-x-4 mb-4">
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                <img src="https://img.icons8.com/ios-filled/50/000000/instagram.png" alt="Instagram" className="w-6 h-6" />
              </a>
              <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <img src="https://img.icons8.com/ios-filled/50/000000/twitterx.png" alt="X" className="w-6 h-6" />
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <img src="https://img.icons8.com/ios-filled/50/000000/tiktok.png" alt="TikTok" className="w-6 h-6" />
              </a>
              <a href={socialLinks.trustpilot} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                <img src="https://img.icons8.com/ios-filled/50/000000/star--v1.png" alt="Trustpilot" className="w-6 h-6" />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">
                File Compression Made Simple.
              </p>
              <p className="text-xs text-gray-500">
                © 2025 SlimFile. Reduce file sizes smartly without quality loss.
              </p>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 text-center mt-6">
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <span className="mx-2">|</span>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};
