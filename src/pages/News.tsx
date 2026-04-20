import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Tv,
  Mic,
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  ExternalLink,
  Package,
  Terminal,
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
  useSEO({
    title: 'SlimFile News — Latest Updates & Press',
    description: 'Stay up to date with the latest SlimFile news, product updates, press coverage, and announcements.',
  });
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
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                      <Icon className="w-3.5 h-3.5 text-red-600" />
                      {item.category}
                    </div>

                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
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
                        <p className="text-xs text-gray-500 mt-2">
                          Image will be added later.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {item.dateLabel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2.5 py-1 font-medium">
                        SlimFile
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {item.subtitle}
                    </p>

                    <ul className="space-y-3 text-sm">
                      {item.highlights.map((h) => (
                        <li key={h.title} className="flex items-start gap-2">
                          <span className="mt-2 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-red-600" />
                          <div>
                            <p className="font-medium text-gray-900">{h.title}</p>
                            <p className="text-gray-600 mt-0.5 leading-relaxed">{h.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {item.externalUrl ? (
                      <div className="mt-5">
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full justify-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {item.externalCtaLabel ?? "View"}
                          </Button>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </article>
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
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {item.dateLabel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                        {item.category}
                      </span>
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

