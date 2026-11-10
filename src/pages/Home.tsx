import { FC } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, FileImage, FileText, Users, FileType, ScanText, Radio, PenTool, FilePlus2, Lock, RefreshCw, Layers, GitMerge, FileEdit, BarChart3, X, Languages, MessageCircleQuestion, Tags, Smile, GitCompare, Mail, QrCode, Smartphone, Scissors, FileArchive, Signature } from "lucide-react";
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

`;
document.head.appendChild(style);
import { useState } from 'react';
import FeatureArt from '@/components/FeatureArt';
import TiltCard from '@/components/TiltCard';
import HeroRings from '@/components/HeroRings';
import HomeNewsStrip from '@/components/HomeNewsStrip';


const Home: FC = () => {
  useSEO({
    title: 'SlimFile — Compress, Convert & Collaborate on Files',
    description: 'Compress PDFs, images, and Office files for free. Convert formats, summarize documents with AI, and collaborate with your team — all in one place.',
  });
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const aiLabFeatures = [
    { icon: Languages, title: 'Translate Text', gradient: 'from-blue-500 to-cyan-500', color: 'text-blue-600', href: '/ai-lab?feature=translate', description: 'Translate text to any language instantly with AI.', features: ['12+ languages', 'Preserves context', 'File upload support'] },
    { icon: FileText, title: 'Summarize Document', gradient: 'from-purple-500 to-pink-500', color: 'text-purple-600', href: '/ai-lab?feature=summarize', description: 'Get key points and summaries from any document.', features: ['PDF, DOCX support', 'Smart extraction', 'Structured output'] },
    { icon: PenTool, title: 'Rewrite Content', gradient: 'from-green-500 to-emerald-500', color: 'text-emerald-600', href: '/ai-lab?feature=rewrite', description: 'Improve, formalize, or simplify your text.', features: ['Multiple styles', 'Tone adjustment', 'Quality improvement'] },
    { icon: MessageCircleQuestion, title: 'Ask Questions', gradient: 'from-orange-500 to-red-500', color: 'text-orange-600', href: '/ai-lab?feature=question', description: 'Get answers about your documents and text.', features: ['Document analysis', 'Detailed answers', 'Context-aware'] },
    { icon: Tags, title: 'Extract Keywords', gradient: 'from-yellow-500 to-orange-500', color: 'text-yellow-600', href: '/ai-lab?feature=keywords', description: 'Identify key terms, topics, and tags automatically.', features: ['Topic analysis', 'Tag generation', 'Categorization'] },
    { icon: Smile, title: 'Analyze Sentiment', gradient: 'from-pink-500 to-rose-500', color: 'text-pink-600', href: '/ai-lab?feature=sentiment', description: 'Detect tone, emotions, and sentiment in text.', features: ['Emotion detection', 'Tone analysis', 'Detailed breakdown'] },
    { icon: GitCompare, title: 'Compare Texts', gradient: 'from-indigo-500 to-purple-500', color: 'text-indigo-600', href: '/ai-lab?feature=compare', description: 'Find differences and similarities between texts.', features: ['Side-by-side analysis', 'Change detection', 'Structured report'] },
    { icon: Mail, title: 'Email Generator', gradient: 'from-blue-600 to-cyan-600', color: 'text-blue-700', href: '/ai-lab?feature=email', description: 'Generate professional emails from bullet points.', features: ['8 email types', '6 tone options', 'Instant generation'] },
  ];

  // General Features (no duplicates)
  const generalFeatures = [
    { icon: FileImage,  title: "Compress Files",        description: "Shrink images, PDFs, DOCX & XLSX while keeping quality.",               features: ["JPEG, PNG, WebP, PDF", "DOCX & XLSX support", "Up to 95% reduction"],       gradient: "from-blue-500 to-blue-600", color: "text-blue-600",     href: "/compress",   flip: "Sneaky peek! 👀"          },
    { icon: FileText,  title: "Convert Formats",       description: "Transform files between formats — no quality loss.",                     features: ["Images, Office to PDF", "PDF to Images ZIP", "No quality loss"],              gradient: "from-purple-500 to-purple-600", color: "text-purple-600", href: "/convert-only",       flip: "Oh you curious one! 🐱"   },
    { icon: Zap,       title: "Convert & Compress",    description: "Convert format AND reduce size in one single step.",                     features: ["All conversion features", "Max size reduction", "One-step processing"],       gradient: "from-red-500 to-red-600", color: "text-red-600",       href: "/convert-compress", flip: "You snooped! 🕵️"          },
    { icon: FilePlus2, title: "PDF Merger & Splitter", description: "Combine multiple PDFs or split one into custom sections.",               features: ["Merge up to 20 PDFs", "Split by page ranges", "Drag to reorder"],           gradient: "from-amber-500 to-orange-500", color: "text-amber-600",  href: "/forge",       flip: "Busted! 🫢"                },
    { icon: Layers,    title: "Merge & Compress PDFs", description: "Combine PDFs into one and compress the result in a single step.",       features: ["Up to 20 PDFs", "Compressed after merging", "One file out"],          gradient: "from-teal-500 to-emerald-600", color: "text-teal-600",  href: "/merge-compress",       flip: "Two birds, one stone! 🪶"    },
    { icon: GitMerge,  title: "Split & Compress PDFs", description: "Split a PDF into pages and compress every piece at once.",            features: ["Split by page ranges", "Each piece compressed", "PDF or ZIP download"],      gradient: "from-cyan-600 to-blue-600", color: "text-cyan-700",    href: "/split-compress",       flip: "Shrink that split! ✂️"         },
    { icon: FileEdit,  title: "Text to PDF",            description: "Paste plain text and get a clean, formatted PDF in seconds.",        features: ["Headings, lists & bold", "No sign-up needed", "Print-ready A4"],            gradient: "from-emerald-500 to-teal-600", color: "text-emerald-600", href: "/text-to-pdf",       flip: "Type it, ship it! 📄"         },
    { icon: ScanText,  title: "OCR Tool",              description: "Extract editable text from images and scanned documents.",               features: ["Scan images & PDFs", "Multiple languages", "Export as text/PDF"],            gradient: "from-orange-500 to-orange-600", color: "text-orange-600", href: "/ocr-tool",       flip: "Well well well... 😏"      },
    { icon: Lock,      title: "PDF Password Protect",  description: "Lock PDFs with a password or remove existing ones.",                    features: ["128-bit encryption", "Remove passwords", "Files never stored"],              gradient: "from-violet-500 to-violet-600", color: "text-violet-600", href: "/lock",       flip: "Oh snap! 😮"               },
    { icon: Signature, title: "eSign PDF",             description: "Sign PDFs in your browser: draw, type or upload your signature.",      features: ["Draw, type or upload", "Date, initials & text", "Never uploaded"],           gradient: "from-rose-500 to-red-600", color: "text-rose-600", href: "/esign",       flip: "Sign here! ✍️"             },
    { icon: FileArchive,title: "Zip Files & Folders",    description: "Bundle files or a whole folder into one ZIP, folders kept. Unzip too.",    features: ["Keeps folder paths", "Up to 5 GB", "Nothing stored"],               gradient: "from-slate-500 to-gray-600", color: "text-gray-700",    href: "/zip",         flip: "Pack it up! 🗜️"          },
    { icon: QrCode,    title: "QR Code Generator",     description: "Create QR codes for links, text, WhatsApp, WiFi & email — instantly.",   features: ["PNG & SVG download", "No sign-up needed", "100% in your browser"],         gradient: "from-fuchsia-500 to-pink-600", color: "text-fuchsia-600", href: "/qr-code",       flip: "You scanned me! 🔍"          },
    { icon: Radio,     title: "Activity Feed",         description: "Stay updated with live activity across all your workspaces.",             features: ["Real-time updates", "Activity tracking", "Team notifications"],              gradient: "from-indigo-500 to-indigo-600", color: "text-indigo-600", href: "/feed",      flip: "Look who's here! 👋"       },
    { icon: PenTool,   title: "Whiteboards",           description: "Brainstorm ideas and sketch concepts on visual boards.",                 features: ["Drawing tools", "Text & shapes", "Multiple boards"],                         gradient: "from-pink-500 to-pink-600", color: "text-pink-600",     href: "/my-whiteboards",       flip: "Peek-a-boo! 🫣"            },
    { icon: FileType,  title: "SlimDocx",              description: "A full Word-style editor for your documents.",                         features: ["Pages, tables & track changes", "Open & download Word files", "Saves automatically"],      gradient: "from-sky-500 to-sky-600", color: "text-sky-600",       href: "/documents",       flip: "Gotcha! 😏"                },
    { icon: Users,     title: "Team Workspaces",       description: "Collaborate in real-time with your team in shared spaces.",               features: ["Real-time chat", "Share links & resources", "Member management"],            gradient: "from-green-500 to-green-600", color: "text-green-600",   href: "/workspaces",      flip: "Caught ya! 😄"             },
  ];

  // Scanner tools. Kept out of generalFeatures so they appear only under the
  // Scan tab — they run off the phone camera and have nothing to do with
  // desktop uploads, so burying them in All would just be noise there.
  const scanFeatures = [
    { icon: Smartphone,  title: "Scan & Compress",   description: "Photograph pages and get one small, shareable PDF.",              gradient: "from-orange-400 to-orange-500", color: "text-orange-500", href: "/scan-compress" },
    { icon: Layers,      title: "Batch Scan & Merge", description: "Scan several documents and combine every page into one PDF.",       gradient: "from-blue-400 to-blue-500",     color: "text-blue-500",   href: "/scan-merge" },
    { icon: Scissors,    title: "Batch Scan & Split", description: "Scan a document and split it into separate small PDFs.",            gradient: "from-green-400 to-green-500",   color: "text-green-500",  href: "/scan-split" },
    { icon: RefreshCw,   title: "Scan & Convert",     description: "Turn a photo into Word, Excel, PowerPoint or images.",             gradient: "from-purple-400 to-purple-500", color: "text-purple-500", href: "/scan-convert" },
  ];

  // Category tabs, iLovePDF style. Every feature belongs to exactly one tab,
  // except "All" which is the union — so no tool appears twice. Summarize
  // Document lives only in AI Lab; it used to be duplicated in generalFeatures.
  const aiLabTab = aiLabFeatures.map(f => ({ ...f, flip: "AI Power! 🤖" }));
  const byTitle = (t: string) => generalFeatures.find(f => f.title === t)!;
  const TEAM_TITLES = new Set(["Activity Feed", "Whiteboards", "SlimDocx", "Team Workspaces"]);

  const featureTabs = [
    // Grouped deliberately: file tools, then AI Lab, then Team. Slicing off
    // the Team cards by title keeps byTitle() working off one flat array while
    // stopping collaboration tools from landing in the middle of file tools.
    { key: "all",  label: "All",     blurb: "All your file tools in one place.",
      items: [
        ...generalFeatures.filter(f => !TEAM_TITLES.has(f.title)),
        ...aiLabTab,
        ...generalFeatures.filter(f => TEAM_TITLES.has(f.title))
      ] },
    { key: "pdf",  label: "PDF",     blurb: "Merge, split, compress and protect your PDFs.",                        items: [byTitle("PDF Merger & Splitter"), byTitle("Merge & Compress PDFs"), byTitle("Split & Compress PDFs"), byTitle("Text to PDF"), byTitle("OCR Tool"), byTitle("PDF Password Protect"), byTitle("eSign PDF")] },
    { key: "files", label: "Files",  blurb: "Shrink, convert and generate files.",                                  items: [byTitle("Compress Files"), byTitle("Convert Formats"), byTitle("Convert & Compress"), byTitle("Zip Files & Folders"), byTitle("QR Code Generator")] },
    { key: "scan",  label: "Scan",   blurb: "Photograph paper with your phone and turn it into a PDF.",             items: scanFeatures },
    { key: "team", label: "Team",   blurb: "Sketch, write and collaborate together.",                              items: [byTitle("Whiteboards"), byTitle("SlimDocx"), byTitle("Team Workspaces"), byTitle("Activity Feed")] },
    { key: "ai",   label: "AI Lab",  blurb: "Translate, summarise, rewrite and analyse with AI.",                   items: aiLabTab },
  ];

  const [activeTab, setActiveTab] = useState(featureTabs[0].key);
  const visibleFeatures = featureTabs.find(t => t.key === activeTab)!.items;



  return (
    <div className="relative isolate min-h-screen bg-white overflow-x-hidden">
      <HeroRings />
      {/* Hero Section */}
      {/* pt-20 clears the fixed 64px header now that the purple banner is gone.
          Kept tight on mobile so ~10 slim cards fit in one viewport. */}
      <section className="pt-20 sm:pt-28 md:pt-32 pb-6 sm:pb-14 md:pb-16 px-4 sm:px-6 lg:px-8">

        <div className="container mx-auto">
          <HomeNewsStrip />
          {/* Category tabs — narrow text tabs, iLovePDF style. The old hero
              (headline, subtitle and three CTA buttons) was removed.
              Six tabs now overflow a narrow phone, so this scrolls sideways
              instead of wrapping and pushing the grid off screen. */}
          {/* Apple-style segmented control: a grey track with a white pill
              that slides to the selected tab. On narrow phones the track
              scrolls sideways instead of wrapping. */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto flex sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#e8e8ed]">
              {featureTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium whitespace-nowrap rounded-full transition-colors duration-200 ${
                    activeTab === tab.key ? "text-[#1d1d1f]" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  {activeTab === tab.key && (
                    <motion.span
                      layoutId="home-tab-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-[15px] text-[#6e6e73] mt-4">
            {featureTabs.find(t => t.key === activeTab)!.blurb}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-4 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-[1600px]">
          {/* Arrows and dots removed — the category tabs above now drive this grid. */}
          <div className="relative">

          {/* 5 columns on wide screens, not 4. At max-w-7xl with 4 columns the cards
              were ~300px each and read as zoomed out next to iLovePDF.
              Below sm each card collapses to a single slim row — icon and title
              — so roughly 10 fit on screen without scrolling. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-5">
            {visibleFeatures.map((feature) => {
              // Apple-style tile: soft grey surface with the red SlimFile artwork
              // on top, large title and a quiet "Try it" link. On phones it
              // collapses to a slim row so ~10 tools fit on one screen.
              const card = (
                <TiltCard className="group h-full flex flex-row sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0 rounded-2xl sm:rounded-[28px] bg-[#f5f5f7] p-3.5 sm:p-3 sm:pb-7 transition-[box-shadow] duration-300 ease-out hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.22)]">
                  <span className="sm:hidden"><FeatureArt icon={feature.icon} size="small" /></span>
                  <div className="hidden sm:block mb-6"><FeatureArt icon={feature.icon} /></div>
                  <div className="min-w-0 flex-1 sm:flex-none sm:px-4">
                    <p className="text-[15px] sm:text-[21px] font-semibold tracking-tight text-[#1d1d1f] leading-snug truncate sm:whitespace-normal">{feature.title}</p>
                    <p className="hidden sm:block mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{feature.description}</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-0.5 mt-auto pt-6 sm:px-4 text-[15px] font-medium text-red-600 transition-all duration-300 group-hover:gap-1.5">
                    Try it <ChevronRight className="w-4 h-4" />
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 sm:hidden" />
                </TiltCard>
              );
              return feature.href.startsWith('http') ? (
                <a
                  key={feature.title}
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {card}
                </a>
              ) : (
                <Link key={feature.title} to={feature.href} className="block h-full">
                  {card}
                </Link>
              );
            })}
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
