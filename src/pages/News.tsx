import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Tv,
  Mic,
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Package,
  Terminal,
  Radio,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";

type Highlight = {
  title: string;
  note: string;
};

type Cta = {
  label: string;
  href: string;
  external?: boolean;
  variant?: "default" | "outline";
};

type NewsItem = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  imageHint: string;
  highlights: Highlight[];
  externalUrl?: string;
  externalCtaLabel?: string;
  imageUrl?: string;
  ctas?: Cta[];
};

const newsItems: NewsItem[] = [
  {
    id: "slimaudio-launch",
    title: "SlimAudio — Audio Compression is Now Live",
    subtitle:
      "SlimFile expands beyond documents and images with SlimAudio — a powerful audio compression platform supporting MP3, WAV, FLAC, M4A, and more.",
    dateLabel: "June 2026",
    category: "Product",
    icon: Radio,
    imageHint: "SlimAudio audio compression platform",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop",
    externalUrl: "https://audio.slim-file.com",
    externalCtaLabel: "Try SlimAudio",
    ctas: [
      { label: "Try SlimAudio", href: "https://audio.slim-file.com", external: true, variant: "default" },
      { label: "Audio API Docs", href: "https://system.slim-file.com", external: true, variant: "outline" },
    ],
    highlights: [
      {
        title: "Multiple audio formats supported",
        note: "Compress MP3, WAV, FLAC, M4A, AAC, OGG, and more — all while maintaining excellent audio quality.",
      },
      {
        title: "Dedicated API for developers",
        note: "Integrate audio compression into your apps with our robust API at system.slim-file.com.",
      },
      {
        title: "Optimized for podcasters and creators",
        note: "Reduce file sizes for faster uploads, streaming, and distribution without sacrificing sound quality.",
      },
    ],
  },
  {
    id: "gtv-ghana",
    title: "SlimFile Featured on GTV Ghana",
    subtitle:
      "A spotlight on how SlimFile helps people compress and convert files faster and more securely.",
    dateLabel: "2025",
    category: "Media",
    icon: Tv,
    imageHint: "SlimFile on GTV Ghana",
    externalUrl: "https://www.youtube.com/watch?v=ZZ2v94GbS58",
    externalCtaLabel: "Watch on YouTube",
    imageUrl: "/news/gtv-ghana.png",
    highlights: [
      {
        title: "TV feature and product walk-through",
        note: "GTV aired a segment on what SlimFile is, who it’s for, and how compression and conversion work in practice.",
      },
      {
        title: "Story behind SlimFile’s mission",
        note: "We shared why simpler, lighter files matter for students, professionals, and teams across Ghana and beyond.",
      },
      {
        title: "How to use SlimFile for everyday workflows",
        note: "The discussion covered typical use cases: smaller PDFs, faster uploads, and converting between common formats.",
      },
    ],
  },
  {
    id: "slimfile-sdk-launch",
    title: "@slimfile/sdk Now Live on npm",
    subtitle:
      "SlimFile launches its official JavaScript/TypeScript SDK — giving developers a zero-dependency way to compress images, PDFs, and Office documents directly from their Node.js applications.",
    dateLabel: "April 2026",
    category: "Product",
    icon: Package,
    imageHint: "SlimFile SDK launch",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    externalUrl: "https://www.npmjs.com/package/@slimfile/sdk",
    externalCtaLabel: "View on npm",
    ctas: [
      { label: "View on npm", href: "https://www.npmjs.com/package/@slimfile/sdk", external: true, variant: "default" },
      { label: "SDK on GitHub", href: "https://github.com/ikaydreams-dev/SlimFile-SDK", external: true, variant: "outline" },
    ],
    highlights: [
      {
        title: "Zero runtime dependencies",
        note: "Built entirely on Node.js 18 built-ins — no axios, no form-data, nothing extra to install. Just npm install @slimfile/sdk and you're ready.",
      },
      {
        title: "Full TypeScript support",
        note: "Every method, parameter, and return value is strictly typed with JSDoc documentation, giving developers full autocomplete and inline hints in their editor.",
      },
      {
        title: "Simple, powerful API",
        note: "compress(), compressBatch(), getStats(), and built-in auth flow. Compress a file in three lines of code and get results back as a Buffer.",
      },
    ],
  },
  {
    id: "slimfile-cli-launch",
    title: "SlimFile CLI — Compress Files from Your Terminal",
    subtitle:
      "SlimFile releases its official command-line interface, letting developers and power users compress images, PDFs, and Office documents directly from the terminal with a single command.",
    dateLabel: "March 2026",
    category: "Product",
    icon: Terminal,
    imageHint: "SlimFile CLI launch",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop",
    externalUrl: "https://www.npmjs.com/package/@slimfile/cli",
    externalCtaLabel: "View on npm",
    ctas: [
      { label: "View on npm", href: "https://www.npmjs.com/package/@slimfile/cli", external: true, variant: "default" },
      { label: "CLI on GitHub", href: "https://github.com/ikaydreams-dev/slimfile-cli", external: true, variant: "outline" },
    ],
    highlights: [
      {
        title: "One command to compress anything",
        note: "Run slimfile compress photo.jpg from any terminal on macOS, Linux, or Windows. No setup beyond a free API key.",
      },
      {
        title: "Batch compression with glob patterns",
        note: "Compress entire folders in one go using patterns like ./images/*.jpg. Output as individual files or a ZIP archive.",
      },
      {
        title: "Auto API key generation",
        note: "Run slimfile setup to create or log into your account and auto-generate an API key — no dashboard visit required.",
      },
    ],
  },
  {
    id: "ghana-youth-tech-summit",
    title: "Ghana Youth Tech Summit",
    subtitle:
      "Showcasing SlimFile’s vision and tools to students, builders, and the tech ecosystem.",
    dateLabel: "2025",
    category: "Events",
    icon: Mic,
    imageHint: "SlimFile at the Ghana Youth Tech Summit",
    imageUrl: "/news/ghana-youth-tech-summit.jpeg",
    highlights: [
      {
        title: "Live demo and community Q&A",
        note: "Attendees saw SlimFile in action and asked questions about compression, conversion, and file limits.",
      },
      {
        title: "Partnership conversations",
        note: "We connected with educators, youth leaders, and tech groups interested in bringing SlimFile to more people.",
      },
      {
        title: "Product feedback and feature requests",
        note: "Summit visitors shared ideas that help shape what we build next—especially for mobile and classroom use.",
      },
    ],
  },
];

export default function News() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash.slice(1));

  // Update hash when it changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.slice(1));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Get the current news item if viewing a specific anchor
  const currentNewsItem = currentHash ? newsItems.find(item => item.id === currentHash) : null;

  useSEO({
    title: currentNewsItem ? `${currentNewsItem.title} — SlimFile News` : 'SlimFile News — Latest Updates & Press',
    description: currentNewsItem?.subtitle || 'Stay up to date with the latest SlimFile news, product updates, press coverage, and announcements.',
    ogImage: currentNewsItem?.imageUrl || 'https://slim-file.com/lovable-uploads/logo.png',
    ogType: currentNewsItem ? 'article' : 'website',
  });

  const handleShare = async (item: NewsItem) => {
    const shareUrl = item.externalUrl || `${window.location.origin}/news#${item.id}`;
    const shareText = `${item.title} - ${item.subtitle}`;

    // Try native share API first (mobile devices)
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: item.title,
          text: shareText,
          url: shareUrl,
        };

        // Try to include image if available (not widely supported yet, but future-proof)
        if (item.imageUrl && navigator.canShare) {
          try {
            // For external images, we can still share the URL
            // The native share will use the Open Graph image from the URL
            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
              return;
            }
          } catch (e) {
            // Fall back to sharing without image
          }
        }

        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to custom share
        console.log('Native share cancelled or failed');
      }
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin', item: NewsItem) => {
    const shareUrl = item.externalUrl || `${window.location.origin}/news#${item.id}`;
    const shareText = `${item.title} - ${item.subtitle}`;

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async (item: NewsItem) => {
    const shareUrl = item.externalUrl || `${window.location.origin}/news#${item.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="min-h-screen pt-28">
      {/* Hero */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100">
                <Newspaper className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Newsroom
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              The latest updates, media features, events, and milestones from SlimFile.
              This is where we share the stories behind our progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-7"
                >
                  Press & Partnerships
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button size="lg" variant="outline" className="px-7">
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Featured stories
            </h2>
            <div className="hidden sm:flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Updated as new highlights drop
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {newsItems.map((item) => {
              const Icon = item.icon;
              const cardInner = (
                <article className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group h-full">
                  {/* Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-700 border border-white/60 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-red-600" />
                      {item.category}
                    </div>

                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center px-6">
                        <div className="flex items-center justify-center mb-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-gray-200">
                            <ImageIcon className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{item.imageHint}</p>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Image CTA */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/60 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                        {item.externalCtaLabel ?? "Read more"}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.dateLabel}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-red-600 font-medium">SlimFile</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleShare(item);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group/share"
                        title="Share this news"
                      >
                        <Share2 className="w-4 h-4 text-gray-400 group-hover/share:text-red-600 transition-colors duration-200" />
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {item.subtitle}
                    </p>
                  </div>
                </article>
              );

              return item.externalUrl ? (
                <a
                  key={item.id}
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardInner}
                </a>
              ) : (
                <a key={item.id} href={`#${item.id}`} className="block h-full">
                  {cardInner}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Details sections */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl space-y-10">
          {newsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 scroll-mt-28"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-100 shrink-0">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {item.dateLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                          {item.category}
                        </span>
                      </div>
                      {/* Share buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSocialShare('twitter', item)}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group/twitter"
                          title="Share on Twitter"
                        >
                          <Twitter className="w-4 h-4 text-gray-400 group-hover/twitter:text-blue-500 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => handleSocialShare('facebook', item)}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group/facebook"
                          title="Share on Facebook"
                        >
                          <Facebook className="w-4 h-4 text-gray-400 group-hover/facebook:text-blue-600 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => handleSocialShare('linkedin', item)}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group/linkedin"
                          title="Share on LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 text-gray-400 group-hover/linkedin:text-blue-700 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => handleCopyLink(item)}
                          className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 group/copy"
                          title="Copy link"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-gray-600 transition-colors duration-200" />
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{item.subtitle}</p>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {item.highlights.map((h) => (
                        <div
                          key={h.title}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                        >
                          <p className="text-sm font-semibold text-gray-900">{h.title}</p>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{h.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      {item.ctas ? (
                        item.ctas.map((cta) =>
                          cta.external ? (
                            <a key={cta.label} href={cta.href} target="_blank" rel="noopener noreferrer">
                              <Button variant={cta.variant ?? "default"} className="w-full sm:w-auto">
                                {cta.label}
                              </Button>
                            </a>
                          ) : (
                            <Link key={cta.label} to={cta.href}>
                              <Button variant={cta.variant ?? "default"} className="w-full sm:w-auto">
                                {cta.label}
                              </Button>
                            </Link>
                          )
                        )
                      ) : (
                        <>
                          <Link to="/convert-only">
                            <Button variant="outline" className="w-full sm:w-auto">Try Convert</Button>
                          </Link>
                          <Link to="/compress">
                            <Button variant="outline" className="w-full sm:w-auto">Try Compress</Button>
                          </Link>
                          <Link to="/contact">
                            <Button className="w-full sm:w-auto">Contact SlimFile</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

