import { Button } from "@/components/ui/button";
import { useSEO } from '@/hooks/useSEO';
import { Mail, Code2, Package, Terminal, KeyRound, Building2, Rocket, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen pt-28 bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-4 py-1.5 text-sm font-semibold mb-6">
            <Building2 className="w-4 h-4" /> For developers and businesses
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">SlimFile Developer Tools</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bring SlimFile's compression into your own apps and workflows. Access to the API, SDK and CLI is set up by our team, so get in touch and we'll get you started.
          </p>
          <a href={salesLink("SlimFile developer access")}>
            <Button size="lg" className="rounded-full px-8 py-6 text-base bg-red-600 hover:bg-red-700 text-white gap-2">
              <Mail className="w-5 h-5" /> Contact sales
            </Button>
          </a>
          <p className="text-sm text-gray-500 mt-4">{SALES_EMAIL}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Products */}
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map(tool => (
            <div key={tool.name} className="flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm p-7">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                <tool.icon className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">{tool.tagline}</p>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{tool.name}</h2>
              <p className="text-gray-600 mb-5 leading-relaxed">{tool.description}</p>
              <ul className="space-y-2 mb-7 text-sm text-gray-700">
                {tool.points.map(point => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-none" />
                    {point}
                  </li>
                ))}
              </ul>
              <a href={salesLink(tool.subject)} className="mt-auto">
                <Button variant="outline" className="w-full rounded-full border-red-200 text-red-700 hover:bg-red-50 gap-2">
                  <Mail className="w-4 h-4" /> Contact sales
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* How access works */}
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">How to get access</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-white border border-gray-200 p-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <step.icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Old keys */}
        <div className="mt-12 rounded-2xl bg-white border border-gray-200 p-7 flex flex-col sm:flex-row sm:items-center gap-5">
          <ShieldCheck className="w-10 h-10 text-red-600 flex-none" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Have an older SlimFile developer key?</h3>
            <p className="text-gray-600">
              Keys from the previous developer dashboard no longer work. Contact our sales team and we'll issue you a new key.
            </p>
          </div>
          <a href={salesLink("Replace my old SlimFile developer key")}>
            <Button className="rounded-full bg-red-600 hover:bg-red-700 text-white gap-2">
              <Mail className="w-4 h-4" /> Get a new key
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Api;
