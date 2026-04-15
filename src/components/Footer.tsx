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
  Clock,
  Zap,
  Settings
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const blogCategories = [
    {
      title: t('footer.pdfGuides'),
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
      title: t('footer.imageOptimization'),
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
      title: t('footer.documentMedia'),
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
      title: t('footer.performanceStrategy'),
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
              {t('footer.compressionTools')}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: '/compress-pdf-online', label: t('footer.compressPdf'), icon: FileText },
                { href: '/compress-pptx-online', label: t('footer.compressPptx'), icon: FileText },
                { href: '/compress-images-online', label: t('footer.compressImages'), icon: Image },
                { href: '/compress-pdf-for-email', label: t('footer.compressPdfEmail'), icon: Mail },
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
                {t('footer.ourBlog')}
              </h4>
              <Link
                to="/blog"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                {t('footer.viewAll')}
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

        {/* Quick Access Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-center">
            <Settings className="w-4 h-4 mr-2 text-primary" />
            {t('footer.quickAccess')}
          </h5>

          {/* Equal spacing on left and right - balanced on both mobile and desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 md:gap-6 px-4 md:px-8 lg:px-0 max-w-6xl mx-auto">
            {/* Product Column */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-2">{t('footer.product')}</h6>
              <div className="space-y-1">
                <button
                  onClick={() => handleFooterClick('/compress', t('footer.compress'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.compress')}
                </button>
                <button
                  onClick={() => handleFooterClick('/convert-only', t('footer.convertOnly'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.convertOnly')}
                </button>
                <button
                  onClick={() => handleFooterClick('/convert-compress', t('footer.convertCompress'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.convertCompress')}
                </button>
                <button
                  onClick={() => handleFooterClick('/slimfile-game', t('footer.game'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.game')}
                </button>
                <button
                  onClick={() => handleFooterClick('/features', t('footer.features'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.features')}
                </button>
                <button
                  onClick={() => handleFooterClick('/file-compression-education', t('footer.whyCompression'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.whyCompression')}
                </button>
              </div>
            </div>

            {/* Company Column */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-2">{t('footer.company')}</h6>
              <div className="space-y-1">
                <button
                  onClick={() => handleFooterClick('/about', t('footer.about'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.about')}
                </button>

                <button
                  onClick={() => handleFooterClick('/case-studies', t('footer.caseStudies'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.caseStudies')}
                </button>
                <button
                  onClick={() => handleFooterClick('/partnerships', t('footer.partnerships'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.partnerships')}
                </button>
                <button
                  onClick={() => handleFooterClick('/sdgs', t('footer.sdgs'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.sdgs')}
                </button>
                <button
                  onClick={() => handleFooterClick('/blog', t('footer.ourBlogs'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.ourBlogs')}
                </button>
                <button
                  onClick={() => handleFooterClick('/contact', t('footer.contact'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.contact')}
                </button>
              </div>
            </div>

            {/* SlimFile API Column */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-2">{t('footer.slimfileApi')}</h6>
              <div className="space-y-1">
                <a
                  href="https://api.slim-file.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.apiDashboard')}
                </a>
                <a
                  href="https://api.slim-file.com/developer-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.developerProgram')}
                </a>
                <a
                  href="https://api.slim-file.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.apiPricing')}
                </a>
                <button
                  onClick={() => handleFooterClick('/stepsbuild', t('footer.stepsbuild'))}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.stepsbuild')}
                </button>
              </div>
            </div>

            {/* Resources Column - HELP CENTER REMOVED */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-2">{t('footer.resources')}</h6>
              <div className="space-y-1">
                <a
                  href="https://api.slim-file.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  {t('footer.documentation')}
                </a>
                {/* HELP CENTER REMOVED */}
                <button
                  onClick={() => handleFooterClick('/privacy', 'Privacy Policy')}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handleFooterClick('/terms', 'Terms of Service')}
                  className="block text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200 text-left"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Socials Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/logo.gif" alt="SlimFile Logo" className="h-8 w-8 object-contain rounded-md" loading="lazy" />
              <span className="text-base font-semibold text-gray-900 ml-2">SlimFile</span>
            </div>

            {/* Social icons */}
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <a href="https://www.linkedin.com/company/slimfile-inc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <img src="https://img.icons8.com/ios_filled/1200/linkedin-circled.jpg" alt="LinkedIn" className="w-6 h-6" loading="lazy" />
                </a>
                <a href="https://www.instagram.com/slimfile_inc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/CIS-A2K_Instagram_Icon_%28Black%29.svg/2048px-CIS-A2K_Instagram_Icon_%28Black%29.svg.png" alt="Instagram" className="w-6 h-6" loading="lazy" />
                </a>
                <a href="https://x.com/slimfile_inc?s=11" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <img src="https://i.pinimg.com/736x/bd/bd/bb/bdbdbb7f668c3efcaeebe69468f434f7.jpg" alt="X" className="w-6 h-6" loading="lazy" />
                </a>
                <a href="https://www.tiktok.com/@slimfile_inc?_t=ZM-8yF3RexQsLg&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <img src="https://crystalpng.com/wp-content/uploads/2023/05/tiktok-logo-png.png" alt="TikTok" className="w-6 h-6" loading="lazy" />
                </a>
                <a href="https://www.trustpilot.com/review/slim-file.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                  <img src="https://img.icons8.com/ios-filled/50/000000/star--v1.png" alt="Trustpilot" className="w-6 h-6" loading="lazy" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};
