import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Image,
  Video,
  Smartphone,
  Globe,
  Mail,
  Zap,
  ChevronRight,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Star,
  CheckCircle,
  Download,
  Upload,
  Settings,
  Target,
  Eye,
  Share2,
  HardDrive,
  Monitor,
  RefreshCw,
  Edit,
  Layers,
  Table,
  Presentation,
  FileImage
} from "lucide-react";
import { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "How to Compress PDF for Email",
    description: "Master PDF compression for email attachments. Avoid bounced emails, ensure reliable delivery, and maintain professional document quality.",
    href: "/blog/how-to-compress-pdf-for-email",
    icon: Mail,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2025-01-15",
    featured: true,
    gradient: "from-blue-50 to-green-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 2,
    title: "Best Tools to Compress Images Online",
    description: "Discover the most effective online tools for image compression. Compare features, quality, and performance for web and print use.",
    href: "/blog/best-tools-to-compress-images-online",
    icon: Image,
    category: "Images",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2025-01-12",
    featured: true,
    gradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 3,
    title: "Compress PPTX Presentations Without Losing Quality",
    description: "Learn professional techniques to reduce PowerPoint file sizes while preserving visual quality and functionality.",
    href: "/blog/compress-pptx-presentations-without-losing-quality",
    icon: FileText,
    category: "Presentations",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2025-01-10",
    featured: false,
    gradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 4,
    title: "Reduce PDF File Size on Mobile",
    description: "Complete guide to mobile PDF compression with browser-based tools that work on iOS and Android devices.",
    href: "/blog/reduce-pdf-file-size-on-mobile",
    icon: Smartphone,
    category: "Mobile",
    readTime: "8 min read",
    author: "SlimFile Team",
    date: "2025-01-08",
    featured: false,
    gradient: "from-green-50 to-blue-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 5,
    title: "How to Compress Files for Faster Website Loading",
    description: "Optimize your website performance with proper file compression techniques and best practices for web developers.",
    href: "/blog/how-to-compress-files-for-faster-website-loading",
    icon: Globe,
    category: "Web Performance",
    readTime: "9 min read",
    author: "SlimFile Team",
    date: "2025-01-05",
    featured: false,
    gradient: "from-indigo-50 to-blue-50",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  {
    id: 6,
    title: "Why File Compression is Essential for Remote Work",
    description: "Understanding the importance of file compression in modern remote work environments and collaboration tools.",
    href: "/blog/why-file-compression-is-essential-for-remote-work",
    icon: User,
    category: "Remote Work",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2025-01-03",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 7,
    title: "Compressing PDF for Printing vs Emailing",
    description: "Learn the differences between compression settings for print-quality PDFs versus email-friendly file sizes.",
    href: "/blog/compressing-pdf-for-printing-vs-emailing",
    icon: Download,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2025-01-01",
    featured: false,
    gradient: "from-gray-50 to-slate-50",
    iconColor: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  {
    id: 8,
    title: "How to Compress Large Videos Before Uploading",
    description: "Step-by-step guide to video compression for social media, streaming, and storage optimization without quality loss.",
    href: "/blog/how-to-compress-large-videos-before-uploading",
    icon: Video,
    category: "Video",
    readTime: "10 min read",
    author: "SlimFile Team",
    date: "2025-01-28",
    featured: false,
    gradient: "from-pink-50 to-purple-50",
    iconColor: "text-pink-600",
    bgColor: "bg-pink-100"
  },
  {
    id: 9,
    title: "How to Convert JPG to PDF",
    description: "Transform your JPG images into professional PDF documents. Perfect for portfolios, document archiving, and sharing.",
    href: "/blog/convert-jpg-to-pdf",
    icon: Image,
    category: "Conversion",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2025-02-15",
    featured: true,
    gradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 10,
    title: "How to Convert PNG to WebP",
    description: "Reduce image file sizes by up to 30% while maintaining quality. Optimize images for faster websites and better performance.",
    href: "/blog/convert-png-to-webp",
    icon: Zap,
    category: "Conversion",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2025-02-18",
    featured: true,
    gradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 11,
    title: "How to Convert PDF to Word (DOCX)",
    description: "Transform PDF documents into editable Word files while preserving formatting. Edit, update, and customize your documents.",
    href: "/blog/convert-pdf-to-word",
    icon: Edit,
    category: "Conversion",
    readTime: "8 min read",
    author: "SlimFile Team",
    date: "2025-02-20",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 12,
    title: "How to Convert PDF to Image (JPG/PNG)",
    description: "Extract pages from PDF as high-quality images. Perfect for social media, presentations, and sharing content easily.",
    href: "/blog/convert-pdf-to-image",
    icon: RefreshCw,
    category: "Conversion",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-green-50 to-teal-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 13,
    title: "How to Convert JPG to PNG",
    description: "Convert JPG images to PNG format for transparency support and lossless quality. Perfect for logos and graphics.",
    href: "/blog/convert-jpg-to-png",
    icon: FileImage,
    category: "Conversion",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 14,
    title: "How to Convert PNG to JPG",
    description: "Reduce file sizes by converting PNG to JPG format. Perfect for photos, web images, and email attachments.",
    href: "/blog/convert-png-to-jpg",
    icon: Image,
    category: "Conversion",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-blue-50 to-cyan-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 15,
    title: "How to Convert WebP to JPG",
    description: "Convert WebP images to widely-compatible JPG format. Ensure universal compatibility for sharing and legacy software.",
    href: "/blog/convert-webp-to-jpg",
    icon: Layers,
    category: "Conversion",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 16,
    title: "How to Convert DOCX to PDF",
    description: "Convert Word documents to professional PDF format. Preserve formatting and ensure universal compatibility.",
    href: "/blog/convert-docx-to-pdf",
    icon: FileText,
    category: "Conversion",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: true,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 17,
    title: "How to Convert PDF to PowerPoint",
    description: "Transform static PDFs into editable PowerPoint presentations. Perfect for repurposing content and creating slides.",
    href: "/blog/convert-pdf-to-pptx",
    icon: Presentation,
    category: "Conversion",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 18,
    title: "How to Convert PDF to Excel",
    description: "Extract tables and data from PDFs into editable Excel spreadsheets. Perfect for financial reports and data analysis.",
    href: "/blog/convert-pdf-to-xlsx",
    icon: Table,
    category: "Conversion",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2025-02-22",
    featured: false,
    gradient: "from-green-50 to-teal-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  }
];

const categories = ["All", "PDF", "Images", "Presentations", "Mobile", "Web Performance", "Remote Work", "Video", "Conversion"];

export default function OurBlogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 mb-4 sm:mb-0 sm:mr-4">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              Our Blogs
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Expert insights, tutorials, and guides on file compression, optimization, and digital workflow efficiency.
              Stay updated with the latest techniques and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/compress">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Compressing
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated Weekly • Expert Content • Free Guides
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center lg:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center mb-6 sm:mb-8">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {featuredPosts.map((post) => {
                const IconComponent = post.icon;
                return (
                  <div
                    key={post.id}
                    className={`bg-gradient-to-br ${post.gradient} rounded-xl p-4 sm:p-6 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-start mb-4">
                      <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${post.bgColor} mr-3 sm:mr-4`}>
                        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${post.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mb-2">
                          {post.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                          <Link to={post.href} className="hover:underline">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {post.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-3 sm:space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={post.href}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Blog Posts */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">All Articles</h2>
            <div className="text-sm text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {regularPosts.map((post) => {
              const IconComponent = post.icon;
              return (
                <div
                  key={post.id}
                  className={`bg-gradient-to-br ${post.gradient} rounded-xl p-4 sm:p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${post.bgColor} mr-3`}>
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${post.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 hover:text-gray-700 transition-colors">
                        <Link to={post.href} className="hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2 sm:space-x-3 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={post.href}
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 to-red-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Compress Your Files?
          </h2>
          <p className="text-lg sm:text-xl text-red-100 mb-6 sm:mb-8">
            Put our expertise into practice with our powerful compression tools
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Compressing
              </Button>
            </Link>
            <Link to="/api">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-600 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
