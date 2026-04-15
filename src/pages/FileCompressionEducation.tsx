import { useState } from "react";
import { useSEO } from '@/hooks/useSEO';
import {
  BookOpen, Zap, Cloud, Lock, Globe, FileText,
  HelpCircle, TrendingUp, Shield, ExternalLink, ChevronDown,
  CheckCircle2, ArrowRight, Cpu, Database, Layers, AlertTriangle,
  BarChart3, Leaf, DollarSign, Wifi, FileImage, Archive, Play
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Shared primitives ───────────────────────────────────────────────────────

const Badge = ({ children, color = "red" }: { children: React.ReactNode; color?: string }) => {
  const map: Record<string, string> = {
    red:    "bg-red-50 border-red-100 text-red-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    blue:   "bg-blue-50 border-blue-100 text-blue-600",
    green:  "bg-green-50 border-green-100 text-green-600",
    amber:  "bg-amber-50 border-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${map[color] ?? map.red}`}>
      {children}
    </span>
  );
};

const SectionLabel = ({ icon: Icon, text, color = "red" }: { icon: React.ElementType; text: string; color?: string }) => (
  <div className="flex items-center gap-2 mb-5">
    <Badge color={color}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </Badge>
  </div>
);

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-200 ${open ? "border-red-200 bg-red-50/40" : "border-gray-100 bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-red-500" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const FileCompressionEducation = () => {
  useSEO({
    title: 'File Compression Education — How Compression Works | SlimFile',
    description: 'Learn how file compression works, the science behind lossless and lossy formats, and how SlimFile reduces PDF, image, and Office file sizes without losing quality.',
  });
  const faqs = [
    {
      q: "Will compressing my files delete anything?",
      a: "Lossless compression will not delete any data — the original file can be perfectly reconstructed. Lossy compression may discard some information, but usually in a way that's imperceptible. Always keep a backup of important files before applying lossy methods.",
    },
    {
      q: "Can I compress a file multiple times?",
      a: "You can, but repeated lossy compression degrades quality each time. Lossless compression is safe to repeat, though the gains diminish quickly after the first pass.",
    },
    {
      q: "Why didn't my file get much smaller?",
      a: "Some files are already compressed (JPEG, MP4, ZIP) or contain highly random data. Trying to compress them further yields little to no benefit.",
    },
    {
      q: "Is file compression secure?",
      a: "Compression is not encryption. It reduces size, not visibility. For sensitive files, always add encryption on top of compression.",
    },
    {
      q: "What's the best format for compressing images?",
      a: "For photos, JPEG is standard for lossy; PNG for lossless. WebP offers excellent quality at smaller sizes and is the modern web standard.",
    },
    {
      q: "Can I compress videos?",
      a: "Yes — codecs like H.264, H.265 (HEVC), and AV1 are built for exactly this. They deliver dramatic file-size reductions while keeping visual quality high.",
    },
    {
      q: "Does compression affect SEO?",
      a: "Positively — smaller images and assets mean faster page loads, which Google's Core Web Vitals reward directly.",
    },
    {
      q: "How does SlimFile protect my privacy?",
      a: "SlimFile deletes your files immediately after processing. We never store your files longer than necessary, use secure transfer protocols, and never share your data with third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(239,68,68,0.07),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-24 relative">
          <div className="flex justify-center mb-6">
            <Badge color="red">
              <BookOpen className="w-3.5 h-3.5" />
              Compression Guide
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 text-center leading-tight mb-6">
            The Complete Guide to{" "}
            <span className="text-primary">File Compression</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 text-center leading-relaxed max-w-2xl mx-auto mb-12">
            File compression powers the modern digital world. Learn what it is, how it works, and why it matters — from everyday users to global businesses.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "95%",    label: "Max size reduction",  color: "text-red-500"    },
              { value: "1 GB",   label: "Max file size",        color: "text-orange-500" },
              { value: "1960s",  label: "Algorithm origins",    color: "text-amber-600"  },
              { value: "100%",   label: "Privacy guaranteed",   color: "text-green-600"  },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
                <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Compression Matters ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <SectionLabel icon={Zap} text="Why It Matters" />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                The invisible technology behind every digital interaction
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Every time you send a photo, stream a video, or load a website, file compression is working behind the scenes. Without it, the internet would be slower, storage would be more expensive, and sharing digital content would be a headache.
              </p>
              <ul className="space-y-3">
                {[
                  "Makes websites 3–10× faster to load",
                  "Saves billions in cloud storage costs annually",
                  "Reduces the internet's carbon footprint",
                  "Enables streaming for users worldwide",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-gray-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Wifi,      label: "Faster Web",       desc: "HTTP Brotli/GZIP compression loads pages in milliseconds",     bg: "bg-blue-50",   border: "border-blue-100",   color: "text-blue-600"   },
                { icon: Play,      label: "Streaming",        desc: "H.265 and AV1 codecs deliver 4K on limited bandwidth",          bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-600" },
                { icon: Database,  label: "Cloud Storage",    desc: "Compressed backups cost a fraction of raw data storage",        bg: "bg-green-50",  border: "border-green-100",  color: "text-green-600"  },
                { icon: Leaf,      label: "Greener Tech",     desc: "Less data transfer means lower energy use in data centres",     bg: "bg-emerald-50",border: "border-emerald-100",color: "text-emerald-600"},
              ].map(({ icon: Icon, label, desc, bg, border, color }) => (
                <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
                  <Icon className={`w-6 h-6 ${color} mb-3`} strokeWidth={1.8} />
                  <p className="font-semibold text-gray-800 text-sm mb-1">{label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={TrendingUp} text="History" color="orange" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Six decades of compression innovation
          </h2>
          <div className="space-y-0">
            {[
              { era: "1960s–70s", title: "The foundations",         body: "Early research into information theory and data encoding. Shannon's entropy work laid the mathematical groundwork for all modern compression.", color: "border-gray-300",   dot: "bg-gray-400"    },
              { era: "1980s",     title: "Desktop era begins",      body: "ARC and ZIP archivers make file sharing and storage practical for home computers. LZW algorithm powers the first mass-market tools.",           color: "border-orange-300", dot: "bg-orange-400"  },
              { era: "1990s",     title: "Media revolution",        body: "JPEG and MP3 bring lossy compression to images and music — fundamentally changing how we consume and share media.",                               color: "border-red-300",    dot: "bg-red-500"     },
              { era: "2000s",     title: "Streaming takes over",    body: "MP4, H.264, and AAC enable HD streaming video and fast mobile downloads. YouTube and Netflix are born.",                                          color: "border-purple-300", dot: "bg-purple-500"  },
              { era: "2010s–now", title: "The efficiency race",     body: "Brotli, WebP, AV1, and HEVC push efficiency further. Cloud-native formats and AI-assisted compression redefine what's possible.",                color: "border-blue-300",   dot: "bg-blue-500"    },
            ].map(({ era, title, body, color, dot }, i) => (
              <div key={era} className="flex gap-6 pb-8 last:pb-0 relative">
                {/* Line */}
                {i < 4 && <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${dot} opacity-30`} />}
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full ${dot} shrink-0 mt-0.5 ring-4 ring-white shadow`} />
                <div className={`flex-1 bg-white rounded-2xl p-6 border-l-4 ${color} shadow-sm`}>
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{era}</span>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science of Compression ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <SectionLabel icon={Cpu} text="The Science" color="blue" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            How compression actually works
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl">
            At its core, compression finds and eliminates redundancy — repeated patterns, predictable sequences, and unused space.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              {
                title: "Entropy",
                body: "Information theory's measure of data randomness. The more predictable and structured data is, the more it can be compressed — perfectly random data cannot be compressed at all.",
                bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-700",
              },
              {
                title: "Redundancy Removal",
                body: "Compression algorithms find patterns. \"AAAAAA\" becomes \"6A\" in run-length encoding — the same information in far fewer bytes.",
                bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-700",
              },
            ].map(({ title, body, bg, border, color }) => (
              <div key={title} className={`rounded-2xl p-6 ${bg} border ${border}`}>
                <h3 className={`font-bold ${color} mb-2`}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-gray-900 mb-5 text-lg">Key algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "Huffman Coding",  desc: "Assigns shorter binary codes to more frequent symbols. Foundation of many lossless formats.",       tag: "Lossless" },
              { name: "LZ77 / LZW",      desc: "Builds a dictionary of repeated byte sequences and replaces them with compact references.",           tag: "Lossless" },
              { name: "DEFLATE",         desc: "Combines LZ77 and Huffman coding. Powers ZIP, PNG, and GZIP — the most widely-deployed algorithm.",   tag: "Lossless" },
              { name: "Brotli",          desc: "Google's modern web compression format — 15–25% better than GZIP with faster decompression.",         tag: "Lossless" },
              { name: "JPEG / WebP",     desc: "Discrete Cosine Transform (DCT) plus quantization discards imperceptible visual information.",         tag: "Lossy"    },
              { name: "MP3 / AAC",       desc: "Psychoacoustic models remove sounds the human ear cannot perceive at normal listening levels.",         tag: "Lossy"    },
            ].map(({ name, desc, tag }) => (
              <div key={name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-gray-900 text-sm">{name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${tag === "Lossless" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Types of Compression ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <SectionLabel icon={Layers} text="Compression Types" color="green" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Choosing the right type for your use case
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: "Lossless",
                headline: "Every bit preserved",
                body: "The original file can be perfectly reconstructed from the compressed version. No information is lost.",
                formats: ["ZIP", "PNG", "FLAC", "GIF", "PDF"],
                use: "Documents, code, spreadsheets, anything you'll need to restore exactly.",
                bg: "bg-white", accent: "bg-green-500", border: "border-green-200",
                badgeBg: "bg-green-50", badgeText: "text-green-700",
              },
              {
                title: "Lossy",
                headline: "Smaller, imperceptibly different",
                body: "Some data is permanently discarded in exchange for dramatically smaller files. At reasonable settings, the loss is invisible.",
                formats: ["JPEG", "MP3", "MP4", "WebP", "AAC"],
                use: "Photos, music, video, anything where a small quality trade-off is acceptable.",
                bg: "bg-white", accent: "bg-red-500", border: "border-red-200",
                badgeBg: "bg-red-50", badgeText: "text-red-700",
              },
              {
                title: "Hybrid",
                headline: "Best of both worlds",
                body: "Video codecs and modern formats combine lossless and lossy techniques at different layers for maximum efficiency.",
                formats: ["MKV", "MOV", "H.265", "AV1", "HEVC"],
                use: "Professional video production, broadcast media, streaming platforms.",
                bg: "bg-white", accent: "bg-purple-500", border: "border-purple-200",
                badgeBg: "bg-purple-50", badgeText: "text-purple-700",
              },
            ].map(({ title, headline, body, formats, use, bg, accent, border, badgeBg, badgeText }) => (
              <div key={title} className={`rounded-2xl border ${border} ${bg} overflow-hidden shadow-sm flex flex-col`}>
                <div className={`h-1.5 ${accent}`} />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
                  <p className={`text-xs font-semibold ${badgeText} mb-3`}>{headline}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{body}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {formats.map(f => (
                      <span key={f} className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badgeBg} ${badgeText}`}>{f}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Best for</p>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">{use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real-World Use Cases ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <SectionLabel icon={Globe} text="Use Cases" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Compression at work, everywhere
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl">
            From the smallest startup to the largest enterprise — and in daily life — file compression is fundamental.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe,     label: "Web Browsing",         desc: "GZIP and Brotli make every website load faster, saving bandwidth for billions.",    color: "text-blue-500",   bg: "bg-blue-50",   border: "border-blue-100"   },
              { icon: FileImage, label: "Photo Sharing",        desc: "Social platforms compress images to speed uploads and slash storage costs.",        color: "text-pink-500",   bg: "bg-pink-50",   border: "border-pink-100"   },
              { icon: Play,      label: "Video Streaming",      desc: "Netflix and YouTube deliver HD content via advanced codecs — even on slow links.",  color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
              { icon: Archive,   label: "Backups & Archives",   desc: "Businesses compress backups to dramatically reduce storage and cost.",               color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
              { icon: Shield,    label: "Healthcare & Science", desc: "Medical images and research datasets are compressed for sharing and analysis.",      color: "text-red-500",    bg: "bg-red-50",    border: "border-red-100"    },
              { icon: BookOpen,  label: "Education",            desc: "Schools compress course content and media for faster, more accessible delivery.",    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
              { icon: Wifi,      label: "Mobile & Data Plans",  desc: "Compression is critical for users on limited or slow mobile connections.",           color: "text-sky-500",    bg: "bg-sky-50",    border: "border-sky-100"    },
              { icon: Cloud,     label: "Cloud Computing",      desc: "Cloud providers compress stored data to optimise infrastructure and reduce costs.",   color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
            ].map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
                <Icon className={`w-5 h-5 ${color} mb-3`} strokeWidth={1.8} />
                <p className="font-bold text-gray-800 text-sm mb-1.5">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Environmental & Economic Impact ───────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <SectionLabel icon={Leaf} text="Impact" color="green" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            A greener, more accessible internet
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Zap,         title: "Energy Savings",    body: "Every kilobyte not transmitted saves power in data centres, routers, and devices. At internet scale, this adds up to thousands of gigawatt-hours annually.",     color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
              { icon: DollarSign,  title: "Lower Costs",       body: "Businesses and individuals save significantly on cloud storage, bandwidth bills, and CDN costs — often by 40–80%.",                                               color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
              { icon: Globe,       title: "Global Access",     body: "Faster, smaller files make the web usable in regions with slower connections and pricier data — directly expanding digital inclusion.",                             color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
              { icon: Leaf,        title: "Carbon Footprint",  body: "The internet accounts for ~3.7% of global emissions. Reducing data transmission is one of the highest-leverage tools for a greener tech industry.",               color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100" },
            ].map(({ icon: Icon, title, body, color, bg, border }) => (
              <div key={title} className={`flex gap-5 rounded-2xl p-6 border ${bg} ${border}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Practices ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={HelpCircle} text="Best Practices" color="amber" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Getting the most out of compression
          </h2>
          <div className="space-y-4">
            {[
              { n: "01", title: "Match method to purpose",     body: "Use lossless for documents, code, and anything you need to restore exactly. Use lossy for photos, audio, and video where a small quality trade-off is acceptable." },
              { n: "02", title: "Keep originals before lossy", body: "Lossy compression is irreversible. Always archive a copy of the original before applying JPEG compression or video transcoding." },
              { n: "03", title: "Choose the right format",     body: "PNG for graphics with transparency, JPEG for photographs, WebP when targeting modern browsers, PDF for documents that need to print reliably." },
              { n: "04", title: "Test before committing",      body: "Preview different quality settings and compare file sizes. The goal is the best balance of size and quality for your specific content." },
              { n: "05", title: "Don't re-compress compressed files", body: "Applying lossy compression to an already-lossy file (e.g. re-saving a JPEG) stacks artifacts. Start from the highest quality source you have." },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-amber-600">{n}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={Lock} text="Privacy & Security" color="blue" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            Compression is not encryption
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: AlertTriangle, title: "Not the same as encryption",
                body: "Compression reduces file size; encryption protects contents. For sensitive data, always use both — compress first, then encrypt.",
                bg: "bg-orange-50", border: "border-orange-200", color: "text-orange-600",
              },
              {
                icon: Shield, title: "SlimFile's data policy",
                body: "Your files are deleted immediately after processing. We use HTTPS for all transfers and never store files longer than required or share your data.",
                bg: "bg-green-50", border: "border-green-200", color: "text-green-600",
              },
              {
                icon: Lock, title: "Known security considerations",
                body: "CRIME and BREACH attacks can affect systems that combine HTTP compression and encryption. These are protocol-level concerns, not a risk in file compression tools like SlimFile.",
                bg: "bg-blue-50", border: "border-blue-200", color: "text-blue-600",
              },
            ].map(({ icon: Icon, title, body, bg, border, color }) => (
              <div key={title} className={`rounded-2xl p-6 border ${bg} ${border}`}>
                <Icon className={`w-5 h-5 ${color} mb-3`} strokeWidth={1.8} />
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Myths ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={Shield} text="Myths vs Reality" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Clearing up common misconceptions
          </h2>
          <div className="space-y-4">
            {[
              {
                myth:    "Compression always reduces quality",
                reality: "Lossless compression preserves every bit. Even lossy compression at normal settings produces results that are visually or audibly indistinguishable from the original.",
              },
              {
                myth:    "You can infinitely compress a file",
                reality: "There are mathematical limits. Once data is random — or already compressed — further compression yields nothing, or even increases the file size.",
              },
              {
                myth:    "Compression is only for tech experts",
                reality: "Everyone benefits from compression daily, often without knowing it. Modern tools like SlimFile make it one-click simple.",
              },
              {
                myth:    "Compression is unsafe",
                reality: "Compression is a mature, battle-tested technology. The only caveat: keep originals before applying lossy methods, in case you want the highest-quality version later.",
              },
            ].map(({ myth, reality }) => (
              <div key={myth} className="grid sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-red-50 p-6 border-r border-red-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Myth</p>
                  <p className="font-semibold text-gray-800 text-sm leading-relaxed">"{myth}"</p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Reality</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{reality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Glossary ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={BookOpen} text="Glossary" color="blue" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Key terms explained
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { term: "Algorithm",    def: "A step-by-step procedure for solving a problem — in this case, reducing file size."                                    },
              { term: "Codec",        def: "Software (or hardware) that compresses and decompresses digital media."                                                 },
              { term: "Entropy",      def: "A measure of randomness or unpredictability in data. Lower entropy = more compressible."                               },
              { term: "Lossless",     def: "Compression where the original file can be perfectly recreated from the compressed version."                           },
              { term: "Lossy",        def: "Compression that permanently discards some data for a smaller file size."                                               },
              { term: "Archive",      def: "A file containing one or more files, often compressed — e.g. ZIP or TAR."                                              },
              { term: "Bitrate",      def: "The amount of data processed per second in audio or video files. Higher = better quality + bigger file."               },
              { term: "Quantization", def: "Mapping a range of values to a smaller set — the primary mechanism of lossy compression in JPEG and MP3."              },
            ].map(({ term, def }) => (
              <div key={term} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="font-bold text-gray-900 mb-1">{term}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-3xl">
          <SectionLabel icon={HelpCircle} text="FAQ" color="orange" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── Further Reading ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <SectionLabel icon={ExternalLink} text="Further Reading" color="blue" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 leading-tight">
            Go deeper
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Data Compression",      source: "Wikipedia",         href: "https://en.wikipedia.org/wiki/Data_compression"                          },
              { title: "What is Data Compression?", source: "How-To Geek",   href: "https://www.howtogeek.com/116461/htg-explains-what-is-data-compression/" },
              { title: "Image Optimisation",    source: "Smashing Magazine",  href: "https://www.smashingmagazine.com/2015/09/image-optimization/"            },
              { title: "WebP Format",           source: "Google Developers",  href: "https://developers.google.com/speed/webp"                               },
              { title: "How ZIP Files Work",    source: "YouTube",            href: "https://www.youtube.com/watch?v=OtDxDvCpPL4"                            },
            ].map(({ title, source, href }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-red-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{title}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                </div>
                <p className="text-xs text-gray-400">{source}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── How SlimFile Helps ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel icon={Zap} text="SlimFile" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Compression made effortless
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                SlimFile makes file compression easy, fast, and secure. Our platform supports images, PDFs, Office documents and more — using advanced algorithms while keeping your data completely private.
              </p>
              <ul className="space-y-3">
                {[
                  "Images, PDFs, PPTX, DOCX and more",
                  "Up to 95% file size reduction",
                  "Files deleted immediately after processing",
                  "No account required for basic compression",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-gray-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FileImage, label: "Images",    desc: "JPEG, PNG, WebP",         bg: "bg-red-50",    border: "border-red-100",    color: "text-red-500"    },
                { icon: FileText,  label: "PDFs",      desc: "Compress & optimise",      bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
                { icon: BarChart3, label: "PPTX",      desc: "Presentations",            bg: "bg-amber-50",  border: "border-amber-100",  color: "text-amber-600"  },
                { icon: BookOpen,  label: "Documents", desc: "DOCX, XLSX & more",        bg: "bg-yellow-50", border: "border-yellow-100", color: "text-yellow-600" },
                { icon: Archive,   label: "Batch",     desc: "Multiple files at once",   bg: "bg-green-50",  border: "border-green-100",  color: "text-green-600"  },
                { icon: Shield,    label: "Secure",    desc: "Deleted after processing", bg: "bg-blue-50",   border: "border-blue-100",   color: "text-blue-600"   },
              ].map(({ icon: Icon, label, desc, bg, border, color }) => (
                <div key={label} className={`flex flex-col gap-2 rounded-2xl p-5 ${bg} border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.8} />
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="relative overflow-hidden bg-gray-900 rounded-3xl px-8 py-16 text-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(239,68,68,0.25),transparent)] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 rounded-2xl mb-8">
                <Zap className="w-7 h-7 text-red-400" strokeWidth={1.8} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to compress your files?
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Put your new knowledge to work. SlimFile compresses files in seconds — securely, and for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/compress"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Start Compressing
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-colors border border-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FileCompressionEducation;
