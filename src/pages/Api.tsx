import { Button } from "@/components/ui/button";
import { useSEO } from '@/hooks/useSEO';
import { Mail, Code2, Package, Terminal, KeyRound, Rocket, ShieldCheck } from "lucide-react";

const SALES_EMAIL = "administration@slim-file.com";

// Access to every developer product is set up by the SlimFile team, so each
// card opens a pre-addressed email instead of a self-serve signup.
const salesLink = (subject: string) =>
  `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}`;

const tools = [
  {
    icon: Code2,
    name: "SlimFile Compression API",
    tagline: "For businesses and platforms",
    description: "Compress PDFs, images and Office files from your own systems over a simple REST API. Built for portals, banks, schools and any product that handles documents at scale.",
    points: ["PDF, JPG, PNG, WebP, DOCX, PPTX, XLSX", "Up to 95% smaller files", "Private API key for your business"],
    subject: "SlimFile Compression API access",
  },
  {
    icon: Package,
    name: "SlimFile SDK",
    tagline: "For developers in any language",
    description: "Add SlimFile compression to your app in a few lines of code, whatever language you build in: Python, JavaScript, PHP, Java, C#, Go and more.",
    points: ["Works with any programming language", "Simple to integrate", "Uses your SlimFile API key"],
    subject: "SlimFile SDK access",
  },
  {
    icon: Terminal,
    name: "SlimFile CLI",
    tagline: "For the terminal and automation",
    description: "Compress single files or whole folders from the command line, or plug SlimFile into scripts and build pipelines in any language.",
    points: ["Single files or batches", "Works with any language, script or CI", "Uses your SlimFile API key"],
    subject: "SlimFile CLI access",
  },
];

const steps = [
  { icon: Mail, title: "Email our sales team", text: `Write to ${SALES_EMAIL} with your company name, what you want to build and roughly how many files you expect to process.` },
  { icon: KeyRound, title: "Get your API key", text: "We set up your account and send you a private API key, along with the documentation for the tool you chose." },
  { icon: Rocket, title: "Start building", text: "Use your key with the API, SDK or CLI. Our team stays on hand to help you integrate." },
];

const Api = () => {
  useSEO({
    title: 'SlimFile Developer Tools — API, SDK and CLI',
    description: 'Bring SlimFile compression into your own product with the SlimFile API, SDK and CLI. Contact our sales team to get your API key.',
  });

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      {/* Hero */}
      <section className="px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">For developers and businesses</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto">
          SlimFile Developer Tools.
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          Bring SlimFile's compression into your own apps and workflows. Our team sets up your access.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={salesLink("SlimFile developer access")}>
            <Button size="lg" className="rounded-full px-7 h-11 text-[17px] bg-red-600 hover:bg-red-700 text-white">
              Contact sales
            </Button>
          </a>
          <a href="#how-it-works" className="text-[17px] text-red-600 hover:underline">
            How access works ›
          </a>
        </div>
        <p className="mt-5 text-sm text-[#6e6e73]">{SALES_EMAIL}</p>
      </section>

      {/* Products */}
      <section className="px-4 sm:px-6 pb-4">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
          {tools.map(tool => (
            <div key={tool.name} className="flex flex-col rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10">
              <tool.icon className="w-9 h-9 text-red-600 mb-6" strokeWidth={1.5} />
              <p className="text-[13px] font-semibold text-[#6e6e73] mb-1">{tool.tagline}</p>
              <h2 className="text-[28px] font-semibold tracking-tight leading-tight mb-3">{tool.name}</h2>
              <p className="text-[17px] text-[#6e6e73] leading-relaxed mb-6">{tool.description}</p>
              <ul className="space-y-2.5 mb-8 text-[15px]">
                {tool.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 border-t border-black/[0.06] pt-2.5">
                    {point}
                  </li>
                ))}
              </ul>
              <a href={salesLink(tool.subject)} className="mt-auto text-[17px] text-red-600 hover:underline">
                Contact sales ›
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How access works */}
      <section id="how-it-works" className="px-4 sm:px-6 py-20 sm:py-28 scroll-mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-center mb-14">
            How to get access.
          </h2>
          <div className="grid gap-10 md:gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white text-[15px] font-semibold flex items-center justify-center">{i + 1}</span>
                  <step.icon className="w-5 h-5 text-[#6e6e73]" strokeWidth={1.75} />
                </div>
                <h3 className="text-[21px] font-semibold tracking-tight mb-2">{step.title}</h3>
                <p className="text-[17px] text-[#6e6e73] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Old keys */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[28px] bg-[#f5f5f7] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-6">
          <ShieldCheck className="w-10 h-10 text-red-600 flex-none" strokeWidth={1.5} />
          <div className="flex-1">
            <h3 className="text-[24px] font-semibold tracking-tight mb-1">Have an older SlimFile developer key?</h3>
            <p className="text-[17px] text-[#6e6e73]">
              Keys from the previous developer dashboard no longer work. Contact our sales team and we'll issue you a new key.
            </p>
          </div>
          <a href={salesLink("Replace my old SlimFile developer key")}>
            <Button className="rounded-full px-6 h-10 bg-red-600 hover:bg-red-700 text-white">
              Get a new key
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Api;
