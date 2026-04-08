import { Minimize2, RefreshCw, Users, FileImage, FileText, FileType, Scan, GitMerge, Lock, Rss, PenLine, Video, LayoutDashboard, CheckCircle2 } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 bg-white">

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="text-primary">SlimFile</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            SlimFile is a complete file management platform built around three core capabilities —
            <span className="font-semibold text-gray-700"> Compression</span>,
            <span className="font-semibold text-gray-700"> Conversion</span>, and
            <span className="font-semibold text-gray-700"> Collaboration</span>.
            Everything you need to work with files, documents, and teams — in one place.
          </p>
        </div>
      </section>

      {/* Compression */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-5 w-fit">
                <Minimize2 className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Compression</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Make your files smaller — without losing quality
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                SlimFile's compression engine reduces file sizes by up to 95% across a wide range of formats.
                Whether you're shrinking images for a website, reducing a PDF for email, or compressing
                Office documents for faster sharing — SlimFile handles it with precision.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Up to 95% file size reduction',
                  'Supports files up to 1GB',
                  'Batch compress multiple files at once',
                  'No quality loss on images',
                  'OCR scanning built in',
                  'PDF Merge, Split & Password Protect',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tiles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FileImage, label: 'Images',  desc: 'JPEG, PNG, WebP',       color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100' },
                { icon: FileText,  label: 'PDFs',    desc: 'PDF & PPTX',            color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
                { icon: FileType,  label: 'Office',  desc: 'DOCX & XLSX',           color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
                { icon: Scan,      label: 'OCR',     desc: 'Scan & extract text',   color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                { icon: GitMerge,  label: 'Merge',   desc: 'Combine PDFs',          color: 'text-lime-600',   bg: 'bg-lime-50',   border: 'border-lime-100' },
                { icon: Lock,      label: 'Protect', desc: 'Password lock PDFs',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
              ].map(({ icon: Icon, label, desc, color, bg, border }) => (
                <div key={label} className={`flex flex-col gap-2 rounded-2xl p-5 ${bg} border ${border}`}>
                  <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.8} />
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Rows (left on desktop) */}
            <div className="flex flex-col justify-center gap-3 order-2 lg:order-1">
              {[
                { from: 'PDF',         to: 'DOCX / PNG / JPEG',   color: 'from-blue-500 to-blue-600' },
                { from: 'JPEG / PNG',  to: 'WebP / PDF',           color: 'from-cyan-500 to-cyan-600' },
                { from: 'PPTX / DOCX', to: 'PDF',                  color: 'from-violet-500 to-violet-600' },
                { from: 'Any format',  to: 'Compressed output',    color: 'from-pink-500 to-pink-600' },
              ].map(({ from, to, color }) => (
                <div key={from} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700 w-28 shrink-0">{from}</span>
                  <div className={`flex-1 h-1.5 rounded-full bg-gradient-to-r ${color}`} />
                  <span className="text-sm font-semibold text-gray-700 w-36 shrink-0 text-right">{to}</span>
                </div>
              ))}
            </div>
            {/* Text (right on desktop) */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5 w-fit">
                <RefreshCw className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-600">Conversion</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Convert files to the format you need
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                SlimFile converts documents and images between popular formats instantly.
                Need a PDF as a Word document? An image as a PDF? A PPTX converted and compressed
                in one step? SlimFile does it all — quickly and accurately.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Convert images: JPEG, PNG, WebP, PDF',
                  'Convert Office docs: DOCX, PPTX, XLSX to PDF',
                  'Convert then compress in a single step',
                  'Fast server-side processing',
                  'Download instantly — no account required',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-5 w-fit">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-purple-600">Collaboration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Work together, not just alone
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                SlimFile is more than a file tool. It's a collaboration platform where teams
                can write documents, brainstorm on whiteboards, hold video meetings, and stay
                connected through a live feed — all completely independent of file compression.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Team Workspaces for shared projects',
                  'Rich text document editor',
                  'Real-time collaborative whiteboards',
                  'Built-in video meetings',
                  'Live Feed to see global activity',
                  'Personal dashboard to track your work',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tiles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,           label: 'Workspaces', desc: 'Shared team projects',      color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-100' },
                { icon: FileText,        label: 'Documents',  desc: 'Rich text editor',           color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-100' },
                { icon: PenLine,         label: 'Boards',     desc: 'Collaborative whiteboards',  color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
                { icon: Video,           label: 'Meet',       desc: 'Video meetings',             color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
                { icon: Rss,             label: 'Live Feed',  desc: 'Global activity stream',     color: 'text-teal-500',   bg: 'bg-teal-50',   border: 'border-teal-100' },
                { icon: LayoutDashboard, label: 'Dashboard',  desc: 'Your personal overview',     color: 'text-pink-500',   bg: 'bg-pink-50',   border: 'border-pink-100' },
              ].map(({ icon: Icon, label, desc, color, bg, border }) => (
                <div key={label} className={`flex flex-col gap-2 rounded-2xl p-5 ${bg} border ${border}`}>
                  <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.8} />
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            One platform. Three powers.
          </h2>
          <p className="text-gray-400 text-lg">
            Compress • Convert • Collaborate — SlimFile brings it all together so you can focus on what matters.
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;
