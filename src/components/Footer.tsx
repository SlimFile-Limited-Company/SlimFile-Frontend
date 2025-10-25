import { Link, useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/utils";
import {
  BookOpen,
  Mail,
  Image,
  FileText,
  Smartphone,
  Globe,
  Users,
  Download,
  Video,
  ChevronRight,
  ArrowRight,
  Star,
  Clock,
  Zap
} from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const blogCategories = [
    {
      title: "PDF Guides",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      blogs: [
        {
          title: "How to Compress PDF for Email",
          href: "/blog/how-to-compress-pdf-for-email",
          icon: Mail,
          readTime: "5 min"
        },
        {
          title: "Reduce PDF File Size on Mobile",
          href: "/blog/reduce-pdf-file-size-on-mobile",
          icon: Smartphone,
          readTime: "8 min"
        },
        {
          title: "Compressing PDF for Printing vs Emailing",
          href: "/blog/compressing-pdf-for-printing-vs-emailing",
          icon: Download,
          readTime: "5 min"
        }
      ]
    },
    {
      title: "Image Optimization",
      icon: Image,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      blogs: [
        {
          title: "Best Tools to Compress Images Online",
          href: "/blog/best-tools-to-compress-images-online",
          icon: Image,
          readTime: "7 min"
        },
        {
          title: "Compress Images for Website",
          href: "/compress-images-for-website",
          icon: Globe,
          readTime: "6 min"
        }
      ]
    },
    {
      title: "Document & Media",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      blogs: [
        {
          title: "Compress PPTX Presentations",
          href: "/blog/compress-pptx-presentations-without-losing-quality",
          icon: FileText,
          readTime: "6 min"
        },
        {
          title: "Compress Large Videos Before Uploading",
          href: "/blog/how-to-compress-large-videos-before-uploading",
          icon: Video,
          readTime: "10 min"
        }
      ]
    },
    {
      title: "Performance & Strategy",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      blogs: [
        {
          title: "Website Loading Optimization",
          href: "/blog/how-to-compress-files-for-faster-website-loading",
          icon: Globe,
          readTime: "9 min"
        },
        {
          title: "Remote Work File Compression",
          href: "/blog/why-file-compression-is-essential-for-remote-work",
          icon: Users,
          readTime: "6 min"
        }
      ]
    }
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tools Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Compression Tools
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: '/compress-pdf-online', label: 'Compress PDF Online', icon: FileText },
                { href: '/compress-pptx-online', label: 'Compress PPTX Online', icon: FileText },
                { href: '/compress-images-online', label: 'Compress Images Online', icon: Image },
                { href: '/compress-pdf-for-email', label: 'Compress PDF for Email', icon: Mail },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.href}
                    className="flex items-center text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 p-2 rounded-lg hover:bg-white"
                    onClick={() => handleFooterClick(item.href, item.label)}
                  >
                    <IconComponent className="w-4 h-4 mr-2 text-gray-400" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog Carousels */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Our Blog Posts
              </h4>
              <Link
                to="/blog"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={category.title}
                    className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-6 border-2 ${category.borderColor} hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white mr-3`}>
                        <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <h5 className="text-base font-semibold text-gray-900">{category.title}</h5>
                    </div>

                    <div className="space-y-3">
                      {category.blogs.map((blog) => {
                        const BlogIcon = blog.icon;
                        return (
                          <button
                            key={blog.href}
                            className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-white/70 transition-colors duration-200 group"
                            onClick={() => handleFooterClick(blog.href, blog.title)}
                          >
                            <div className="flex items-start flex-1">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white mr-3 flex-shrink-0">
                                <BlogIcon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <h6 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {blog.title}
                                </h6>
                                <div className="flex items-center mt-1">
                                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{blog.readTime}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/logo.gif" alt="SlimFile Logo" className="h-8 w-8 object-contain rounded-md" />
              <span className="text-base font-semibold text-gray-900">SlimFile</span>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <a href="https://www.linkedin.com/company/slimfile-inc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/slimfile_inc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                  <img src="https://img.icons8.com/ios-filled/50/000000/instagram.png" alt="Instagram" className="w-6 h-6" />
                </a>
                <a href="https://x.com/slimfile_inc?s=11" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <img src="https://img.icons8.com/ios-filled/50/000000/twitterx.png" alt="X" className="w-6 h-6" />
                </a>
                <a href="https://www.tiktok.com/@slimfile_inc?_t=ZM-8yF3RexQsLg&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <img src="https://img.icons8.com/ios-filled/50/000000/tiktok.png" alt="TikTok" className="w-6 h-6" />
                </a>
                <a href="https://www.trustpilot.com/review/slim-file.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
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
        </div>
      </div>
    </footer>
  );
};
