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
  FileImage,
  ScanLine,
  Brain,
  GraduationCap,
  BarChart2,
  Unlock,
  Cpu,
  TrendingUp,
  Lock,
  RotateCw,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useSEO } from '@/hooks/useSEO';

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
  },
  // Batch 1 — PDF Compression
  {
    id: 19,
    title: "How to Compress PDF Without Adobe",
    description: "Free alternatives to Adobe Acrobat for compressing PDFs. No subscription needed — reduce PDF size instantly in your browser.",
    href: "/blog/compress-pdf-without-adobe",
    icon: FileText,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-01",
    featured: false,
    gradient: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 20,
    title: "How to Reduce PDF Size Below 1 MB",
    description: "Step-by-step guide to getting your PDF under 1 MB for email attachments, upload limits, and sharing platforms.",
    href: "/blog/reduce-pdf-size-below-1mb",
    icon: Download,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-02",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 21,
    title: "How to Batch Compress Multiple PDFs",
    description: "Compress many PDFs at once without processing them one by one. Save hours with bulk PDF compression workflows.",
    href: "/blog/batch-compress-multiple-pdfs",
    icon: Layers,
    category: "PDF",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-01-03",
    featured: false,
    gradient: "from-purple-50 to-indigo-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 22,
    title: "How to Compress a Scanned PDF",
    description: "Scanned PDFs are huge because they're full of images. Here's how to compress them dramatically without losing readability.",
    href: "/blog/compress-scanned-pdf",
    icon: ScanLine,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-04",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 23,
    title: "Why Is My PDF So Large?",
    description: "The most common reasons PDFs are unexpectedly large — and exactly how to fix each one.",
    href: "/blog/why-is-my-pdf-so-large",
    icon: HardDrive,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-05",
    featured: false,
    gradient: "from-amber-50 to-yellow-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 24,
    title: "How to Compress PDF in Chrome",
    description: "Use Chrome's built-in Print to PDF feature and free browser tools to compress PDFs — no software needed.",
    href: "/blog/compress-pdf-in-chrome",
    icon: Globe,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-06",
    featured: false,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 25,
    title: "How to Compress PDF for Printing",
    description: "Compress PDFs for printing without losing sharpness. Balance file size and print quality for the best results.",
    href: "/blog/compress-pdf-for-printing",
    icon: Download,
    category: "PDF",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-07",
    featured: false,
    gradient: "from-slate-50 to-gray-50",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  // Batch 2 — Image Compression
  {
    id: 26,
    title: "How to Compress Images for Instagram",
    description: "Optimal image sizes and formats for Instagram — reduce file size without the platform's aggressive re-compression ruining quality.",
    href: "/blog/compress-images-for-instagram",
    icon: Image,
    category: "Images",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-08",
    featured: false,
    gradient: "from-pink-50 to-purple-50",
    iconColor: "text-pink-600",
    bgColor: "bg-pink-100"
  },
  {
    id: 27,
    title: "How to Compress Images for Facebook",
    description: "Stop Facebook from destroying your image quality. Use the right compression settings before uploading.",
    href: "/blog/compress-images-for-facebook",
    icon: Image,
    category: "Images",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-09",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 28,
    title: "How to Compress Images for WordPress",
    description: "Speed up your WordPress site with properly compressed images. Improve Core Web Vitals and Google rankings.",
    href: "/blog/compress-images-for-wordpress",
    icon: Globe,
    category: "Images",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-01-10",
    featured: false,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-700",
    bgColor: "bg-blue-100"
  },
  {
    id: 29,
    title: "How to Compress Images for Shopify",
    description: "Faster product images mean higher conversion rates. Compress your Shopify store images the right way.",
    href: "/blog/compress-images-for-shopify",
    icon: Image,
    category: "Images",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-11",
    featured: false,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 30,
    title: "How to Compress Images for Email",
    description: "Send photos via email without bouncing. Learn the ideal image sizes and formats for email attachments.",
    href: "/blog/compress-images-for-email",
    icon: Mail,
    category: "Images",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-12",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 31,
    title: "How to Reduce Photo Size on iPhone",
    description: "iPhone photos are massive. Reduce HEIC and JPG photo size on iPhone for texting, email, and sharing.",
    href: "/blog/reduce-photo-size-on-iphone",
    icon: Smartphone,
    category: "Mobile",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-13",
    featured: false,
    gradient: "from-gray-50 to-slate-50",
    iconColor: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  {
    id: 32,
    title: "How to Reduce Photo Size on Android",
    description: "Compress photos on Android without third-party apps. Make images smaller for sharing on WhatsApp, email, and social media.",
    href: "/blog/reduce-photo-size-on-android",
    icon: Smartphone,
    category: "Mobile",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-14",
    featured: false,
    gradient: "from-green-50 to-teal-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 33,
    title: "How to Compress GIF Files Online",
    description: "Reduce animated GIF file size without killing the animation. Make GIFs load faster for websites and social media.",
    href: "/blog/compress-gif-files-online",
    icon: RefreshCw,
    category: "Images",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-15",
    featured: false,
    gradient: "from-orange-50 to-yellow-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  // Batch 3 — Office Documents
  {
    id: 34,
    title: "How to Compress a Word Document Online",
    description: "Reduce Word document file size free online. Smaller DOCX files are easier to email, share, and store.",
    href: "/blog/compress-word-document-online",
    icon: FileText,
    category: "Office",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-16",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 35,
    title: "How to Compress Excel Files",
    description: "Reduce Excel file size by removing bloat, compressing embedded images, and cleaning up unused sheets.",
    href: "/blog/compress-excel-files",
    icon: Table,
    category: "Office",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-17",
    featured: false,
    gradient: "from-green-50 to-teal-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 36,
    title: "How to Compress PowerPoint Without Losing Quality",
    description: "Make your PPTX files smaller without blurry slides. Best methods for compressing PowerPoint presentations.",
    href: "/blog/compress-powerpoint-without-losing-quality",
    icon: Presentation,
    category: "Presentations",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-01-18",
    featured: false,
    gradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 37,
    title: "How to Reduce Word File Size",
    description: "Why is your Word document so large? Discover the most effective ways to reduce DOCX file size quickly.",
    href: "/blog/reduce-word-file-size",
    icon: FileText,
    category: "Office",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-19",
    featured: false,
    gradient: "from-slate-50 to-gray-50",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  {
    id: 38,
    title: "How to Compress Files on Windows 11",
    description: "Built-in Windows 11 compression tools and free online alternatives for reducing PDF, image, and document sizes.",
    href: "/blog/compress-files-on-windows-11",
    icon: Monitor,
    category: "Office",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-01-20",
    featured: false,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  // Batch 4 — File Sharing
  {
    id: 39,
    title: "How to Compress Files for WhatsApp",
    description: "WhatsApp has strict file size limits. Compress PDFs, images, and videos to share them on WhatsApp without issues.",
    href: "/blog/compress-files-for-whatsapp",
    icon: MessageSquare,
    category: "File Sharing",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-21",
    featured: false,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 40,
    title: "How to Compress Files for Google Drive",
    description: "Avoid hitting Google Drive storage limits. Compress PDFs and images before uploading to keep your Drive lean.",
    href: "/blog/compress-files-for-google-drive",
    icon: HardDrive,
    category: "File Sharing",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-22",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 41,
    title: "How to Compress Files for Slack",
    description: "Slack has an 8 MB free-tier file limit. Compress files before sharing to avoid upgrade prompts.",
    href: "/blog/compress-files-for-slack",
    icon: Share2,
    category: "File Sharing",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-23",
    featured: false,
    gradient: "from-purple-50 to-indigo-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 42,
    title: "How to Compress Files for Dropbox",
    description: "Make the most of your Dropbox storage. Compress PDFs, images, and documents before syncing.",
    href: "/blog/compress-files-for-dropbox",
    icon: HardDrive,
    category: "File Sharing",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-24",
    featured: false,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 43,
    title: "How to Send Large Files via Email",
    description: "Email attachment limits prevent sending large files. The best methods to compress or share large files via email.",
    href: "/blog/send-large-files-via-email",
    icon: Mail,
    category: "File Sharing",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-25",
    featured: false,
    gradient: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 44,
    title: "How to Share Large PDF Files Online",
    description: "The best ways to share large PDFs online — compress, upload to cloud, or use file sharing links.",
    href: "/blog/share-large-pdf-files-online",
    icon: Share2,
    category: "File Sharing",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-01-26",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  // Batch 5 — PDF Conversion
  {
    id: 45,
    title: "How to Convert Word to PDF",
    description: "Convert Word documents to PDF for free. Preserve formatting and ensure your document looks the same on every device.",
    href: "/blog/convert-word-to-pdf",
    icon: FileText,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-27",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 46,
    title: "How to Convert Excel to PDF",
    description: "Turn spreadsheets into professional PDF documents. Control page layout, orientation, and print area.",
    href: "/blog/convert-excel-to-pdf",
    icon: Table,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-28",
    featured: false,
    gradient: "from-green-50 to-teal-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 47,
    title: "How to Convert PNG to PDF",
    description: "Combine PNG images into a single PDF file. Ideal for portfolios, scanned documents, and image collections.",
    href: "/blog/convert-png-to-pdf",
    icon: Image,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-29",
    featured: false,
    gradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 48,
    title: "How to Convert PDF to PNG",
    description: "Extract individual PDF pages as PNG images. Preserve transparency and get high-quality images from any PDF.",
    href: "/blog/convert-pdf-to-png",
    icon: FileImage,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-30",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 49,
    title: "How to Convert PPTX to PDF",
    description: "Convert PowerPoint presentations to PDF for universal compatibility. Share slides without requiring PowerPoint.",
    href: "/blog/convert-pptx-to-pdf",
    icon: Presentation,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-01-31",
    featured: false,
    gradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 50,
    title: "How to Convert PDF to JPEG",
    description: "Save PDF pages as JPEG images for thumbnails, previews, and social media sharing.",
    href: "/blog/convert-pdf-to-jpeg",
    icon: Image,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-01",
    featured: false,
    gradient: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 51,
    title: "How to Convert PDF to Text",
    description: "Extract text from PDF files for editing, copying, and data processing. Works on text-based and scanned PDFs.",
    href: "/blog/convert-pdf-to-text",
    icon: Edit,
    category: "Conversion",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-02",
    featured: false,
    gradient: "from-slate-50 to-gray-50",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  {
    id: 52,
    title: "How to Convert HEIC to JPG",
    description: "iPhone HEIC photos won't open everywhere. Convert HEIC to JPG for universal compatibility — free, online.",
    href: "/blog/convert-heic-to-jpg",
    icon: Smartphone,
    category: "Conversion",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-03",
    featured: false,
    gradient: "from-gray-50 to-slate-50",
    iconColor: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  // Batch 6 — Tool How-Tos
  {
    id: 53,
    title: "How to Extract Text from PDF Using OCR",
    description: "Turn scanned PDFs and images into editable text with OCR. Works on any document, any language.",
    href: "/blog/extract-text-from-pdf-using-ocr",
    icon: ScanLine,
    category: "OCR",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-04",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 54,
    title: "How to Merge PDF Files Online Free",
    description: "Combine multiple PDFs into one document. No account needed, no limits — merge PDFs instantly.",
    href: "/blog/merge-pdf-files-online-free",
    icon: Layers,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-05",
    featured: false,
    gradient: "from-purple-50 to-indigo-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 55,
    title: "How to Split PDF Into Separate Pages",
    description: "Extract individual pages or page ranges from a PDF. Split large documents into smaller, shareable files.",
    href: "/blog/split-pdf-into-separate-pages",
    icon: Share2,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-06",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 56,
    title: "How to Password Protect a PDF",
    description: "Add password protection to PDF documents before sharing. Keep sensitive content secure and private.",
    href: "/blog/password-protect-pdf",
    icon: Lock,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-07",
    featured: false,
    gradient: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 57,
    title: "How to Remove Password from PDF",
    description: "Know the password but tired of entering it? Remove PDF password protection in seconds, free, online.",
    href: "/blog/remove-password-from-pdf",
    icon: Unlock,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-08",
    featured: false,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 58,
    title: "How to Summarize a PDF with AI",
    description: "Get an instant AI-generated summary of any PDF. Save hours of reading — understand documents in seconds.",
    href: "/blog/summarize-pdf-with-ai",
    icon: Brain,
    category: "AI",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-09",
    featured: true,
    gradient: "from-indigo-50 to-purple-50",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  {
    id: 59,
    title: "How to Extract Pages from PDF",
    description: "Pull specific pages out of a PDF into a new document. No software required — works in your browser.",
    href: "/blog/extract-pages-from-pdf",
    icon: FileText,
    category: "PDF",
    readTime: "4 min read",
    author: "SlimFile Team",
    date: "2026-02-10",
    featured: false,
    gradient: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 60,
    title: "How to Rotate PDF Pages Online",
    description: "Fix upside-down or sideways PDF pages instantly. Rotate individual pages or entire documents for free.",
    href: "/blog/rotate-pdf-pages-online",
    icon: RotateCw,
    category: "PDF",
    readTime: "3 min read",
    author: "SlimFile Team",
    date: "2026-02-11",
    featured: false,
    gradient: "from-slate-50 to-gray-50",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  // Batch 7 — Comparisons
  {
    id: 61,
    title: "Best Free Alternatives to Adobe Acrobat 2026",
    description: "Adobe Acrobat costs $20+/month. These free tools cover 95% of what most users actually need.",
    href: "/blog/best-free-alternatives-to-adobe-acrobat",
    icon: BarChart2,
    category: "Comparisons",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2026-02-12",
    featured: true,
    gradient: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 62,
    title: "SlimFile vs iLovePDF — Full Comparison 2026",
    description: "SlimFile vs iLovePDF compared on free features, privacy, file limits, and tool breadth. Which should you use?",
    href: "/blog/slimfile-vs-ilovepdf",
    icon: BarChart2,
    category: "Comparisons",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-13",
    featured: false,
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 63,
    title: "SlimFile vs Smallpdf — Full Comparison 2026",
    description: "Smallpdf limits free users to 2 tasks/day. Here's how SlimFile compares across every feature that matters.",
    href: "/blog/slimfile-vs-smallpdf",
    icon: BarChart2,
    category: "Comparisons",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-14",
    featured: false,
    gradient: "from-yellow-50 to-amber-50",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  {
    id: 64,
    title: "Best Free PDF Compressor Online 2026",
    description: "The best free PDF compressors ranked by quality, privacy, speed, and limits. Find the right tool for your needs.",
    href: "/blog/best-free-pdf-compressor-online",
    icon: BarChart2,
    category: "Comparisons",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2026-02-15",
    featured: true,
    gradient: "from-red-50 to-pink-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 65,
    title: "Best Free Image Compressor Online 2026",
    description: "Top free image compressors ranked for JPEG, PNG, WebP, HEIC, and GIF. Privacy, quality, and format support compared.",
    href: "/blog/best-free-image-compressor-online",
    icon: BarChart2,
    category: "Comparisons",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-02-16",
    featured: false,
    gradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 66,
    title: "Best Free OCR Tools Online 2026",
    description: "The best free OCR tools for extracting text from scanned PDFs and images. Ranked by accuracy, privacy, and ease of use.",
    href: "/blog/best-ocr-tools-online",
    icon: ScanLine,
    category: "Comparisons",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-02-17",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 67,
    title: "Best Free AI Document Summarizers 2026",
    description: "The best free AI summarizers for PDFs, Word docs, and presentations. Accuracy, privacy, and format support compared.",
    href: "/blog/best-ai-document-summarizers-free",
    icon: Brain,
    category: "Comparisons",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-02-18",
    featured: false,
    gradient: "from-indigo-50 to-violet-50",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  {
    id: 68,
    title: "Best Free PDF Tools for Students 2026",
    description: "Every PDF tool a student needs — compress, summarize, OCR, merge, convert — all free and without an account.",
    href: "/blog/best-pdf-tools-for-students",
    icon: GraduationCap,
    category: "Comparisons",
    readTime: "7 min read",
    author: "SlimFile Team",
    date: "2026-02-19",
    featured: false,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  // Batch 8 — Educational
  {
    id: 69,
    title: "Lossless vs Lossy Compression — What's the Difference?",
    description: "Two fundamentally different ways to make files smaller. Understand when to use each for images, PDFs, and audio.",
    href: "/blog/lossless-vs-lossy-compression",
    icon: BookOpen,
    category: "Educational",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-20",
    featured: false,
    gradient: "from-slate-50 to-gray-50",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  {
    id: 70,
    title: "What Is a PDF File?",
    description: "Everything you need to know about PDF files — what they are, how they work, why they're large, and how to manage them.",
    href: "/blog/what-is-a-pdf",
    icon: FileText,
    category: "Educational",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-21",
    featured: false,
    gradient: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    id: 71,
    title: "What Is WebP? The Modern Image Format Explained",
    description: "WebP delivers 25–34% smaller file sizes than JPEG at equivalent quality. Here's what it is and when to use it.",
    href: "/blog/what-is-webp",
    icon: Image,
    category: "Educational",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-22",
    featured: false,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 72,
    title: "What Is OCR? Optical Character Recognition Explained",
    description: "OCR converts images of text into real, searchable, editable text. Here's how it works and when to use it.",
    href: "/blog/what-is-ocr",
    icon: ScanLine,
    category: "Educational",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-23",
    featured: false,
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 73,
    title: "How DPI Affects PDF File Size",
    description: "DPI is the biggest reason scanned PDFs are huge. Understand it, choose the right settings, and compress existing files.",
    href: "/blog/how-dpi-affects-pdf-file-size",
    icon: Settings,
    category: "Educational",
    readTime: "5 min read",
    author: "SlimFile Team",
    date: "2026-02-24",
    featured: false,
    gradient: "from-amber-50 to-yellow-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 74,
    title: "Understanding PDF Compression Algorithms",
    description: "What actually happens inside a PDF compressor? Flate, JPEG, JBIG2, and more — explained in plain English.",
    href: "/blog/understanding-pdf-compression-algorithms",
    icon: Cpu,
    category: "Educational",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-02-25",
    featured: false,
    gradient: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600",
    bgColor: "bg-violet-100"
  },
  {
    id: 75,
    title: "Why File Compression Matters for SEO",
    description: "Large images and files slow your website and hurt Google rankings. Learn why compression is essential for Core Web Vitals.",
    href: "/blog/why-file-compression-matters-for-seo",
    icon: TrendingUp,
    category: "Educational",
    readTime: "6 min read",
    author: "SlimFile Team",
    date: "2026-02-26",
    featured: false,
    gradient: "from-emerald-50 to-green-50",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
];

const categories = ["All", "PDF", "Images", "Conversion", "Comparisons", "Educational", "Office", "File Sharing", "OCR", "AI", "Presentations", "Mobile", "Web Performance", "Remote Work", "Video"];

export default function OurBlogs() {
  useSEO({
    title: 'Blog — File Compression & Conversion Guides | SlimFile',
    description: 'Browse SlimFile\'s guides on compressing PDFs, converting images, reducing file sizes for email, and optimizing files for the web.',
  });
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
    <div className="min-h-screen pt-28">
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
