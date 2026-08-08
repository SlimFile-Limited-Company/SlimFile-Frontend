import React, { FC } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, FileImage, FileText, Download, Users, Sparkles, CheckCircle2, Star, FileSpreadsheet, FileType, ScanText, Radio, Video, PenTool, FilePlus2, Lock, Minimize2, RefreshCw, Layers, Scan, GitMerge, Rss, PenLine, LayoutDashboard, FileEdit, BarChart3, X, ChevronLeft, ChevronRight, Maximize2, Crop, Wand2, Signature, Eraser, UserX, Grid3x3, Languages, MessageCircleQuestion, Tags, Smile, GitCompare, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSEO } from "@/hooks/useSEO";

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-blob {
    animation: blob 15s infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }

  /* Mascot */
  @keyframes mascot-bounce {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-6px) rotate(-3deg); }
    75% { transform: translateY(-3px) rotate(3deg); }
  }
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes bubble-pop {
    0%   { opacity: 0; transform: scale(0.7) translateY(8px); }
    70%  { transform: scale(1.05) translateY(-2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(220,38,38,0); }
  }
  @keyframes pulse-glow-blue {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
  }
  .pulse-glow-blue { animation: pulse-glow-blue 2s ease-in-out infinite; }
  @keyframes tool-shine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .mascot-bounce { animation: mascot-bounce 3s ease-in-out infinite; }
  .slide-in-right { animation: slide-in-right 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .slide-in-left  { animation: slide-in-left  0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .bubble-pop     { animation: bubble-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .pulse-glow     { animation: pulse-glow 2s ease-in-out infinite; }

  /* Flip card */
  .flip-card { perspective: 1000px; }
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
  }
  .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 1rem;
    overflow: hidden;
  }
  .flip-card-back { transform: rotateY(180deg); }
`;
document.head.appendChild(style);
import { Button } from "@/components/ui/button";
import { isAuthenticated } from '@/lib/auth';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

const getApiBase = (): string => {
  return import.meta.env.VITE_API_URL || "https://slimfile-backend.onrender.com";
};

const Home: FC = () => {
  useSEO({
    title: 'SlimFile — Compress, Convert & Collaborate on Files',
    description: 'Compress PDFs, images, and Office files for free. Convert formats, summarize documents with AI, and collaborate with your team — all in one place.',
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [compressedCount, setCompressedCount] = useState<number>(0);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // AI Lab carousel
  const [aiLabIndex, setAiLabIndex] = useState(0);
  const aiLabFeatures = [
    { icon: Languages, title: 'Translate Text', gradient: 'from-blue-500 to-cyan-500', href: '/ai-lab?feature=translate', description: 'Translate text to any language instantly with AI.', features: ['12+ languages', 'Preserves context', 'File upload support'] },
    { icon: FileText, title: 'Summarize Document', gradient: 'from-purple-500 to-pink-500', href: '/ai-lab?feature=summarize', description: 'Get key points and summaries from any document.', features: ['PDF, DOCX support', 'Smart extraction', 'Structured output'] },
    { icon: PenTool, title: 'Rewrite Content', gradient: 'from-green-500 to-emerald-500', href: '/ai-lab?feature=rewrite', description: 'Improve, formalize, or simplify your text.', features: ['Multiple styles', 'Tone adjustment', 'Quality improvement'] },
    { icon: MessageCircleQuestion, title: 'Ask Questions', gradient: 'from-orange-500 to-red-500', href: '/ai-lab?feature=question', description: 'Get answers about your documents and text.', features: ['Document analysis', 'Detailed answers', 'Context-aware'] },
    { icon: Tags, title: 'Extract Keywords', gradient: 'from-yellow-500 to-orange-500', href: '/ai-lab?feature=keywords', description: 'Identify key terms, topics, and tags automatically.', features: ['Topic analysis', 'Tag generation', 'Categorization'] },
    { icon: Smile, title: 'Analyze Sentiment', gradient: 'from-pink-500 to-rose-500', href: '/ai-lab?feature=sentiment', description: 'Detect tone, emotions, and sentiment in text.', features: ['Emotion detection', 'Tone analysis', 'Detailed breakdown'] },
    { icon: GitCompare, title: 'Compare Texts', gradient: 'from-indigo-500 to-purple-500', href: '/ai-lab?feature=compare', description: 'Find differences and similarities between texts.', features: ['Side-by-side analysis', 'Change detection', 'Structured report'] },
    { icon: Mail, title: 'Email Generator', gradient: 'from-blue-600 to-cyan-600', href: '/ai-lab?feature=email', description: 'Generate professional emails from bullet points.', features: ['8 email types', '6 tone options', 'Instant generation'] },
  ];

  // Features slider - organized: General → AI Lab → Image Processing
  const [featuresPage, setFeaturesPage] = useState(0);

  // General Features (no duplicates)
  const generalFeatures = [
    { icon: FileImage,  title: "Compress Files",        description: "Shrink images, PDFs, DOCX & XLSX while keeping quality.",               features: ["JPEG, PNG, WebP, PDF", "DOCX & XLSX support", "Up to 95% reduction"],       gradient: "from-blue-500 to-blue-600",     href: "/compress",        badge: "Popular",   flip: "Sneaky peek! 👀"          },
    { icon: FileText,  title: "Convert Formats",       description: "Transform files between formats — no quality loss.",                     features: ["Images, Office to PDF", "PDF to Images ZIP", "No quality loss"],              gradient: "from-purple-500 to-purple-600", href: "/convert-only",    badge: "New",       flip: "Oh you curious one! 🐱"   },
    { icon: Zap,       title: "Convert & Compress",    description: "Convert format AND reduce size in one single step.",                     features: ["All conversion features", "Max size reduction", "One-step processing"],       gradient: "from-red-500 to-red-600",       href: "/convert-compress", badge: "Best Value", flip: "You snooped! 🕵️"          },
    { icon: FilePlus2, title: "PDF Merger & Splitter", description: "Combine multiple PDFs or split one into custom sections.",               features: ["Merge up to 20 PDFs", "Split by page ranges", "Drag to reorder"],           gradient: "from-amber-500 to-orange-500",  href: "/forge",           badge: "New",       flip: "Busted! 🫢"                },
    { icon: ScanText,  title: "OCR Tool",              description: "Extract editable text from images and scanned documents.",               features: ["Scan images & PDFs", "Multiple languages", "Export as text/PDF"],            gradient: "from-orange-500 to-orange-600", href: "/ocr-tool",        badge: "New",       flip: "Well well well... 😏"      },
    { icon: Radio,     title: "Activity Feed",         description: "Stay updated with live activity across all your workspaces.",             features: ["Real-time updates", "Activity tracking", "Team notifications"],              gradient: "from-indigo-500 to-indigo-600", href: "/feed",            badge: "Live",      flip: "Look who's here! 👋"       },
    { icon: Video,     title: "Video Meetings",        description: "Host HD video calls and share your screen instantly.",                   features: ["HD video calls", "Screen sharing", "No downloads needed"],                   gradient: "from-cyan-500 to-cyan-600",     href: "/meet",            badge: "New",       flip: "You found me! 🙈"          },
    { icon: PenTool,   title: "Whiteboards",           description: "Brainstorm ideas and sketch concepts on visual boards.",                 features: ["Drawing tools", "Text & shapes", "Multiple boards"],                         gradient: "from-pink-500 to-pink-600",     href: "/my-whiteboards",  badge: "New",       flip: "Peek-a-boo! 🫣"            },
    { icon: FileType,  title: "My Documents",          description: "Write and edit documents with a rich text editor.",                      features: ["Rich text formatting", "Import & export DOCX", "Auto-save & organize"],      gradient: "from-sky-500 to-sky-600",       href: "/documents",       badge: "New",       flip: "Gotcha! 😏"                },
    { icon: Users,     title: "Team Workspaces",       description: "Collaborate in real-time with your team in shared spaces.",               features: ["Real-time chat", "Share links & resources", "Member management"],            gradient: "from-green-500 to-green-600",   href: "/workspaces",      badge: "Team",      flip: "Caught ya! 😄"             },
    { icon: Lock,      title: "PDF Password Protect",  description: "Lock PDFs with a password or remove existing ones.",                    features: ["128-bit encryption", "Remove passwords", "Files never stored"],              gradient: "from-violet-500 to-violet-600", href: "/lock",            badge: "New",       flip: "Oh snap! 😮"               },
    { icon: Sparkles,  title: "Summarize Document",    description: "Compress and extract a smart AI summary from any PDF, DOCX or PPTX.",   features: ["Powered by Llama 3", "PDF, DOCX & PPTX", "Structured output"],              gradient: "from-purple-600 to-indigo-700", href: "/ai-lab?feature=summarize",       badge: "AI",        flip: "Well hello there! 🤫"      },
  ];

  // Image Processing Features
  const imageFeatures = [
    { icon: Maximize2, title: 'Resize Image', gradient: 'from-blue-500 to-indigo-500', href: '/images/resize', description: 'Resize images to custom dimensions with quality preservation.', features: ['Maintain aspect ratio', '100% quality default', 'PNG/JPEG/WEBP support'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: Crop, title: 'Crop Image', gradient: 'from-emerald-500 to-teal-500', href: '/images/crop', description: 'Crop images with drag-to-crop interface and zoom controls.', features: ['Visual drag interface', 'Zoom 1x - 3x', 'Live preview'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: Wand2, title: 'Enhance Image', gradient: 'from-purple-500 to-pink-500', href: '/images/enhance', description: 'Automatically improve brightness, contrast, and sharpness.', features: ['One-click enhance', 'Auto adjustments', 'Quality improvement'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: Signature, title: 'Watermark Image', gradient: 'from-cyan-500 to-blue-500', href: '/images/watermark', description: 'Add text or image watermarks to protect your images.', features: ['Text & image marks', 'Custom position', 'Opacity control'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: Eraser, title: 'Remove Background', gradient: 'from-red-500 to-orange-500', href: '/images/remove-background', description: 'Convert your images to transparent PNG format.', features: ['Transparent PNG', 'Alpha channel', 'Quick conversion'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: Layers, title: 'Replace Background', gradient: 'from-violet-500 to-purple-500', href: '/images/replace-background', description: 'Change image background with solid colors.', features: ['Color picker', 'Custom colors', 'Live preview'], badge: 'New', flip: 'Image Magic! 🖼️' },
    { icon: UserX, title: 'Blur Faces', gradient: 'from-indigo-500 to-blue-600', href: '/images/blur-faces', description: 'AI-powered face detection and blur for privacy protection.', features: ['Auto face detection', 'Adjustable intensity', 'Privacy protection'], badge: 'AI', flip: 'Image Magic! 🖼️' },
    { icon: Grid3x3, title: 'Generate Thumbnails', gradient: 'from-amber-500 to-yellow-500', href: '/images/generate-thumbnails', description: 'Create multiple thumbnail sizes from your images.', features: ['Multiple sizes', 'Batch generation', 'Instant download'], badge: 'New', flip: 'Image Magic! 🖼️' },
  ];

  // Organize by category: General → AI Lab → Image Processing
  const featureCategories = [
    generalFeatures,
    aiLabFeatures.map(f => ({ ...f, flip: "AI Power! 🤖" })),
    imageFeatures,
  ];

  const totalPages = featureCategories.length; // 3 pages: General, AI Lab, Image Processing

  // Right mascot — fun file compression tips
  const mascotTips = [
    { icon: Zap,        title: "ZIP was born in 1989 🎂",      desc: "Phil Katz invented the ZIP format over 35 years ago — and it's still one of the most widely used compression formats on the planet.",  features: ["Used by billions daily", "Lossless compression", "Cross-platform support"],  gradient: "from-red-500 to-orange-400",    href: "/compress"        },
    { icon: FileImage,  title: "Images eat your bandwidth 🍽️", desc: "Images account for over 60% of the average webpage's total size. Compressing them is the single fastest way to speed up any website.",   features: ["Cut page weight by 60%+", "Faster load times", "Better SEO scores"],         gradient: "from-blue-500 to-cyan-500",     href: "/compress"        },
    { icon: Sparkles,   title: "WebP beats JPEG 🏆",           desc: "Google's WebP format is ~30% smaller than JPEG at the same visual quality — and ~25% smaller than PNG for images with transparency.",   features: ["30% smaller than JPEG", "Supports transparency", "Free to convert here"],    gradient: "from-purple-500 to-pink-500",   href: "/compress"        },
    { icon: FileText,   title: "PDFs can shrink 90% 🤯",       desc: "A scanned PDF with embedded images can often be compressed by up to 90% without any noticeable loss — just smarter encoding under the hood.", features: ["No visible quality loss", "Smaller email attachments", "Faster uploads"],   gradient: "from-emerald-500 to-teal-500",  href: "/compress"        },
    { icon: Globe,      title: "Speed = Revenue 💰",           desc: "Amazon found that every 100ms of latency cost them 1% in sales. Smaller files = faster sites = more money. It really is that simple.",   features: ["100ms = 1% more sales", "Lower bounce rates", "Higher conversions"],         gradient: "from-amber-500 to-orange-500",  href: "/compress"        },
    { icon: Shield,     title: "Lossless vs Lossy 🔬",         desc: "Lossless compression (ZIP, PNG) keeps every single bit. Lossy (JPEG, MP3) throws away data you can't see or hear — that's how it gets so small.", features: ["ZIP & PNG = lossless", "JPEG & MP3 = lossy", "Both free on SlimFile"],    gradient: "from-indigo-500 to-violet-500", href: "/compress"        },
    { icon: CheckCircle2, title: "Compression saves the planet 🌍", desc: "Data centres consume ~1–2% of global electricity. Smaller files mean fewer bytes transferred, less energy burned, and a smaller carbon footprint.", features: ["Less energy per transfer", "Fewer server resources", "Part of our SDGs"], gradient: "from-green-500 to-emerald-500", href: "/compress"        },
    { icon: FileSpreadsheet, title: "DOCX hides bloat 📊",    desc: "A DOCX file is actually a ZIP archive. Microsoft Office embeds full-resolution images and unused styles that can inflate your file 10×.",  features: ["Hidden ZIP structure", "Embedded images bloat it", "Compress free here"],    gradient: "from-sky-500 to-blue-500",      href: "/compress"        },
    { icon: Minimize2,  title: "The 95% club 🎖️",             desc: "SlimFile users regularly hit 90–95% size reduction on image-heavy PDFs. That's a 20 MB file shrinking to just 1 MB — still crystal clear.",  features: ["Up to 95% reduction", "Crystal-clear output", "Takes seconds"],              gradient: "from-rose-500 to-red-500",      href: "/compress"        },
    { icon: RefreshCw,  title: "Convert then compress 🔄",     desc: "Switching a PNG to WebP AND compressing it in one step can cut your image size by up to 70%. SlimFile does both simultaneously.",          features: ["One-step workflow", "Up to 70% smaller", "No quality compromise"],           gradient: "from-fuchsia-500 to-purple-500", href: "/convert-compress" },
  ];
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [mascotDismissed, setMascotDismissed] = useState(true);

  useEffect(() => {
    if (mascotDismissed) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex(i => (i + 1) % mascotTips.length);
        setTipVisible(true);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, [mascotDismissed]);

  const nextTip = () => {
    setTipVisible(false);
    setTimeout(() => { setTipIndex(i => (i + 1) % mascotTips.length); setTipVisible(true); }, 200);
  };

  // Left mascot — motivational quotes & file tips
  const leftTips = [
    { emoji: "💪", title: "Keep It Up!",          gradient: "from-blue-500 to-blue-600",      text: "Every file you compress saves real bandwidth and makes the web faster for everyone.", bullets: ["Saves bandwidth costs", "Faster page loads", "Happier users"] },
    { emoji: "🎯", title: "WebP Wins",            gradient: "from-cyan-500 to-blue-500",      text: "WebP is ~30% smaller than JPEG at the same visual quality — and supports transparency like PNG.", bullets: ["Lossless & lossy modes", "Supported in all browsers", "Convert free with SlimFile"] },
    { emoji: "🚀", title: "Speed = Rankings",     gradient: "from-indigo-500 to-purple-500",  text: "Small files load faster and Google rewards it. Pages under 3 MB consistently rank higher.", bullets: ["Boosts SEO ranking", "Lower bounce rates", "Better Core Web Vitals"] },
    { emoji: "🧠", title: "PDF Secret",           gradient: "from-purple-500 to-pink-500",    text: "Compressing a PDF by 80% still looks identical on screen — smarter encoding, same quality.", bullets: ["No visible quality loss", "Easy to email & share", "Saves storage space"] },
    { emoji: "⚡", title: "Batch It!",            gradient: "from-amber-500 to-orange-500",   text: "Batch compress all your images before uploading — process dozens at once and save hours.", bullets: ["Process dozens at once", "Consistent output quality", "One-click download"] },
    { emoji: "🌍", title: "Go Green",             gradient: "from-green-500 to-emerald-500",  text: "Smaller files mean fewer bytes transferred and less energy burned in data centres worldwide.", bullets: ["Less server energy used", "Fewer data transfers", "Part of our SDG goals"] },
    { emoji: "📱", title: "Mobile First",         gradient: "from-sky-500 to-cyan-500",       text: "Lighter files load 4× faster on 4G networks — your mobile users will thank you every time.", bullets: ["Improve mobile UX", "Reduce data usage", "Reach more users"] },
    { emoji: "🔐", title: "Stay Safe",            gradient: "from-violet-500 to-purple-500",  text: "Always password-protect sensitive PDFs before sharing via email or public links.", bullets: ["128-bit encryption", "Remove passwords too", "Files never stored"] },
    { emoji: "🗜️", title: "Slim That PPTX",      gradient: "from-rose-500 to-red-500",       text: "PPTX files can be 10× smaller after compression — perfect for email attachments and sharing.", bullets: ["Keeps fonts & layouts", "Works with Google Slides", "Email-ready in seconds"] },
    { emoji: "📊", title: "Unlock Scanned Docs",  gradient: "from-teal-500 to-green-500",     text: "OCR turns scanned PDFs and images into fully searchable, editable text in seconds.", bullets: ["Multiple languages", "Export as text or PDF", "Works on images too"] },
    { emoji: "✨", title: "AI to the Rescue",     gradient: "from-fuchsia-500 to-purple-600", text: "AI Summarizer can condense a 50-page report into 5 clear bullet points — instantly.", bullets: ["Powered by Llama 3", "PDF, DOCX & PPTX", "Structured key points"] },
    { emoji: "🤝", title: "Share Smarter",        gradient: "from-blue-500 to-indigo-500",    text: "Share a compressed file link instead of a bulky attachment — always faster, no inbox clutter.", bullets: ["No inbox clutter", "Instant access", "Works on any device"] },
    { emoji: "🎨", title: "PNG → WebP Magic",     gradient: "from-pink-500 to-rose-500",      text: "Converting PNG to WebP cuts image size by up to 50% with zero visible quality drop.", bullets: ["Alpha transparency kept", "Smaller than PNG & JPEG", "Convert free here"] },
    { emoji: "📁", title: "Forge Your PDFs",      gradient: "from-orange-500 to-amber-500",   text: "Merge all your project PDFs into one tidy file, then split or reorder pages freely.", bullets: ["Merge up to 20 PDFs", "Drag to reorder pages", "Split by page ranges"] },
  ];
  const [leftTipIndex, setLeftTipIndex] = useState(0);
  const [leftTipVisible, setLeftTipVisible] = useState(true);
  const [leftMascotDismissed, setLeftMascotDismissed] = useState(true);

  useEffect(() => {
    if (leftMascotDismissed) return;
    const interval = setInterval(() => {
      setLeftTipVisible(false);
      setTimeout(() => {
        setLeftTipIndex(i => (i + 1) % leftTips.length);
        setLeftTipVisible(true);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, [leftMascotDismissed]);

  const nextLeftTip = () => {
    setLeftTipVisible(false);
    setTimeout(() => { setLeftTipIndex(i => (i + 1) % leftTips.length); setLeftTipVisible(true); }, 200);
  };

  useEffect(() => {
    const API_BASE = getApiBase();
    fetch(`${API_BASE}/api/stats`, { credentials: 'omit' })
      .then(res => res.json())
      .then(data => setCompressedCount(typeof data.compressedCount === 'number' ? data.compressedCount : 0))
      .catch(() => setCompressedCount(0));

    const socket = io(API_BASE, {
      transports: ['websocket'],
    });

    socket.on("statsUpdate", (newCount: number) => {
      if (typeof newCount === 'number') setCompressedCount(newCount);
    });

    return () => {
      socket.off("statsUpdate");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-44 md:pt-56 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-white">

        {/* 💡 Left Mascot — motivational quotes & file tips */}
        {!leftMascotDismissed && (
          <div className="slide-in-left absolute top-28 left-4 z-30 hidden lg:flex items-start gap-2">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={() => setLeftMascotDismissed(true)}
                className="text-[9px] text-gray-300 hover:text-gray-500 transition-colors self-end leading-none mb-0.5"
              >✕</button>
              <div
                className="mascot-bounce w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center cursor-pointer border-2 border-white pulse-glow-blue"
                onClick={nextLeftTip}
                title="Click for next tip"
              >
                <img src="/logo.gif" alt="SlimFile tips mascot" className="w-9 h-9 object-contain rounded-lg" />
              </div>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">SlimFile</span>
            </div>

            {/* Speech bubble — opens to the right */}
            {leftTipVisible && (() => {
              const lt = leftTips[leftTipIndex];
              return (
                <div className="bubble-pop bg-white border border-gray-100 shadow-2xl rounded-2xl rounded-tl-none px-3 py-3 relative flex flex-col" style={{ width: 220, height: 240 }}>
                  {/* Tail pointing left */}
                  <div className="absolute -left-2 top-0 w-0 h-0" style={{ borderTop: '0px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' }} />
                  {/* Gradient header strip */}
                  <div className={`bg-gradient-to-r ${lt.gradient} rounded-xl px-3 py-2 mb-2 flex items-center gap-2 shrink-0`}>
                    <span className="text-lg leading-none">{lt.emoji}</span>
                    <p className="text-white font-bold text-xs leading-tight">{lt.title}</p>
                  </div>
                  {/* Tip text */}
                  <p className="text-gray-600 text-[11px] leading-relaxed mb-2 px-1 flex-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{lt.text}</p>
                  {/* Bullet tips */}
                  <ul className="space-y-1 mb-2 px-1 shrink-0">
                    {lt.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {/* Progress dots + next */}
                  <div className="flex items-center justify-between px-1 shrink-0">
                    <div className="flex gap-1">
                      {leftTips.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === leftTipIndex ? 'bg-blue-500 w-4' : 'bg-gray-200 w-1.5'}`} />
                      ))}
                    </div>
                    <button onClick={nextLeftTip} className="text-[10px] text-gray-400 hover:text-gray-600 font-bold transition-colors">
                      next →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 😺 Mascot — far top-right */}
        {!mascotDismissed && (
          <div className="slide-in-right absolute top-28 right-4 z-30 hidden lg:flex items-start gap-2">
            {/* Speech bubble */}
            {tipVisible && (() => {
              const tip = mascotTips[tipIndex];
              const TipIcon = tip.icon;
              return (
                <div className="bubble-pop bg-white border border-gray-100 shadow-2xl rounded-2xl rounded-tr-none px-3 py-3 relative flex flex-col" style={{ width: 220, height: 240 }}>
                  {/* Gradient header strip */}
                  <div className={`bg-gradient-to-r ${tip.gradient} rounded-xl px-3 py-2 mb-2 flex items-center gap-2 shrink-0`}>
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <TipIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-bold text-xs leading-tight">{tip.title}</p>
                  </div>
                  {/* Description */}
                  <p className="text-gray-600 text-[11px] leading-relaxed mb-2 px-1 flex-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{tip.desc}</p>
                  {/* Features */}
                  <ul className="space-y-1 mb-2 px-1 shrink-0">
                    {tip.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {/* Try + progress */}
                  <div className="flex items-center justify-between px-1 shrink-0">
                    <div className="flex gap-1">
                      {mascotTips.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tipIndex ? 'bg-red-500 w-4' : 'bg-gray-200 w-1.5'}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={tip.href} className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-0.5">
                        Try <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                      <button onClick={nextTip} className="text-[10px] text-gray-400 hover:text-gray-600 font-bold transition-colors">
                        next →
                      </button>
                    </div>
                  </div>
                  {/* Tail pointing right */}
                  <div className="absolute -right-2 top-0 w-0 h-0" style={{ borderTop: '0px solid transparent', borderBottom: '10px solid transparent', borderLeft: '10px solid white' }} />
                </div>
              );
            })()}

            {/* Mascot avatar */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={() => setMascotDismissed(true)}
                className="text-[9px] text-gray-300 hover:text-gray-500 transition-colors self-end leading-none mb-0.5"
              >✕</button>
              <div
                className="mascot-bounce w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 shadow-xl flex items-center justify-center cursor-pointer border-2 border-white"
                onClick={nextTip}
                title="Click for next tip"
              >
                <img src="/logo.gif" alt="SlimFile mascot" className="w-9 h-9 object-contain rounded-lg" />
              </div>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">SlimFile</span>
            </div>
          </div>
        )}

        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center space-y-4 sm:space-y-6">
              {/* Headline - Compress. Convert. Collaborate. */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight">
                <span style={{ color: '#dc2626' }}>Compress</span>
                <span style={{ color: '#dc2626' }}>. </span>
                <span style={{ color: '#9333ea' }}>Convert</span>
                <span style={{ color: '#9333ea' }}>. </span>
                <span className="text-gray-900">Collaborate</span>
                <span className="text-gray-900">.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto font-normal">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link to="/get-started">
                  <Button
                    size="lg"
                    className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 text-base font-medium"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/ai-lab">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 rounded-full border-purple-200 text-purple-700 hover:border-purple-500 hover:text-purple-900 hover:bg-purple-50 transition-all duration-200 text-base font-medium"
                  >
                    AI Lab
                  </Button>
                </Link>
                <a href="https://play.google.com/store/apps/details?id=com.slimfile.app" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 py-3 rounded-full border-gray-900 text-gray-900 hover:border-gray-700 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 text-base font-medium gap-2 bg-white"
                    style={{ minHeight: '48px' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Get it on Google Play
                  </Button>
                </a>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-4 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Navigation: Arrows + Dots */}
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {/* Left Arrow */}
            <button
              onClick={() => setFeaturesPage((prev) => Math.max(0, prev - 1))}
              disabled={featuresPage === 0}
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors border-2 ${
                featuresPage === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-red-100 text-red-600 hover:bg-red-50'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeaturesPage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === featuresPage ? 'bg-red-600 w-8' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setFeaturesPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={featuresPage === totalPages - 1}
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors border-2 ${
                featuresPage === totalPages - 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-red-100 text-red-600 hover:bg-red-50'
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="relative">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureCategories[featuresPage].map((feature) => (
              <div key={feature.title} className="flip-card" style={{ minHeight: "300px" }}>
                <div className="flip-card-inner">

                  {/* FRONT */}
                  <div className="flip-card-front">
                    <Link to={feature.href} className="group block h-full">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
                        {/* Gradient header */}
                        <div className={`relative bg-gradient-to-br ${feature.gradient} px-5 pt-5 pb-8 flex-shrink-0`}>
                          <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {feature.badge}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-white font-bold text-base leading-tight">{feature.title}</p>
                          </div>
                        </div>
                        {/* Floating white panel */}
                        <div className="relative -mt-4 mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col flex-1">
                          <p className="text-gray-500 text-xs leading-relaxed mb-4">{feature.description}</p>
                          <ul className="space-y-1.5 mb-4 flex-1">
                            {feature.features.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 group-hover:gap-2 transition-all duration-200">
                            Try Now <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* BACK */}
                  <div className="flip-card-back">
                    <Link to={feature.href} className="block h-full">
                      <div className={`bg-gradient-to-br ${feature.gradient} h-full flex flex-col items-center justify-center gap-4 p-6 text-center rounded-2xl`}>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white text-2xl font-black tracking-tight">{feature.flip}</p>
                        <p className="text-white/90 text-sm font-medium leading-snug max-w-[180px]">
                          You found <span className="font-bold">{feature.title}</span>!
                        </p>
                        <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/30">
                          Click to Open <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Office Documents Highlight Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white border-y border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-semibold text-xs sm:text-sm">NEW FEATURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Microsoft Office Document Compression
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Now supporting Word documents and Excel spreadsheets with powerful compression
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FileType className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">DOCX Files</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Word Documents</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Compress embedded images and graphics",
                    "Remove unnecessary metadata and revision history",
                    "Works even without images through XML optimization",
                    "5-30% reduction for text-only documents",
                    "Up to 95% reduction for documents with images"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">XLSX Files</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Excel Spreadsheets</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Optimize charts and embedded images",
                    "Remove calculation chains (auto-recalculated on open)",
                    "Maximum ZIP compression for better file size",
                    "5-30% reduction for data-only spreadsheets",
                    "Up to 95% reduction for files with charts/images"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try Office Compression Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* File Conversion Section - NEW */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white border-y border-purple-100">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-semibold text-xs sm:text-sm">NEW FEATURES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                File Conversion Tools
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Convert your files between different formats with our powerful conversion tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
              {/* Convert Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Convert Only
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Transform your files between different formats without compression. Perfect for format compatibility.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "Image formats: JPG, PNG, WebP, PDF",
                      "Office docs: DOCX, PPTX, XLSX to PDF",
                      "PDF to Images (ZIP)"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/convert-only">
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Convert Only
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Convert and Compress */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-red-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Convert & Compress
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    The ultimate two-in-one solution. Convert between formats AND optimize file size in a single step.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "All conversion features included",
                      "Maximum file size reduction",
                      "Perfect quality with smaller files"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/convert-compress">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Convert & Compress
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Compress Only */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl h-full">
                  {/* New Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                    <FileImage className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Compress Only
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Reduce file sizes while maintaining the same format. Ideal for storage optimization and faster sharing.
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "Images: JPEG, PNG, WebP",
                      "Documents: PDF, DOCX, PPTX, XLSX",
                      "Up to 95% size reduction"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link to="/compress">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg sm:rounded-xl px-0 transition-all duration-300 group-hover:gap-1 sm:group-hover:gap-2 text-sm sm:text-base"
                    >
                      <span className="flex items-center gap-1">
                        Try Compress Only
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 w-full max-w-4xl mx-auto">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Choose Your Tool</h4>
                  <p className="text-sm text-gray-600">Select the perfect tool for your needs</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link to="/convert-only" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Convert Only
                    </Button>
                  </Link>
                  <Link to="/convert-compress" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Convert & Compress
                    </Button>
                  </Link>
                  <Link to="/compress" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Compress Only
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                See It In Action
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Watch how easy it is to compress your files with SlimFile
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <video
                  className="w-full h-auto"
                  controls
                  poster="/lovable-uploads/thumbnail.png"
                >
                  <source src="/lovable-uploads/Short.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link to="/compress">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try It Yourself
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose SlimFile?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The most reliable file compression platform on the web
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Advanced algorithms compress your files in seconds, not minutes.",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "All processing happens in your browser. Your files never leave your device.",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                description: "Access from any device, any browser. No downloads required.",
                gradient: "from-purple-400 to-purple-600"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 shadow-lg hover:shadow-xl">
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 px-4">
              Join thousands of users who trust SlimFile for their compression needs
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link to="/compress" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl bg-white text-red-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <span className="flex items-center gap-2">
                    Start Compressing Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 w-full"
                >
                  <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  About Us
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-6 sm:mt-8">
              <a
                href="https://gofund.me/dcf07947"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <span>Support our mission</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Modal */}
      {analyticsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setAnalyticsOpen(false)}
        >
          <div
            className="relative bg-white w-full h-full sm:rounded-2xl sm:shadow-2xl overflow-hidden sm:w-[96vw] sm:h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">SlimFile Live Analytics</p>
                  <p className="text-xs text-gray-400 hidden sm:block">Powered by Google Analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile scroll hint */}
                <p className="text-xs text-gray-400 sm:hidden">Scroll horizontally to explore</p>
                <button
                  onClick={() => setAnalyticsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* iframe wrapper — horizontal scroll on mobile */}
            <div className="overflow-auto w-full" style={{ height: "calc(100% - 53px)" }}>
              <iframe
                src="https://datastudio.google.com/embed/reporting/336ae76d-a21e-493c-b697-d936274fcb5a/page/kIV1C"
                frameBorder="0"
                style={{ border: 0, minWidth: "800px", width: "100%", height: "100%" }}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
