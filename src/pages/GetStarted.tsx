import { FC } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, FileText, FileImage, Users, Radio, Video, PenTool, ScanText, FileType, FilePlus2, Lock, CheckCircle2, FileEdit, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: FileImage, title: 'Compress Files',        badge: 'Popular',    gradient: 'from-blue-500 to-blue-600',
    href: '/compress',          description: 'Shrink images, PDFs, DOCX & XLSX while keeping quality.',
    features: ['JPEG, PNG, WebP, PDF', 'DOCX & XLSX support', 'Up to 95% reduction'],
  },
  {
    icon: FileText,  title: 'Convert Formats',       badge: 'New',        gradient: 'from-purple-500 to-purple-600',
    href: '/convert-only',      description: 'Transform files between formats — no quality loss.',
    features: ['Images, Office to PDF', 'PDF to Images ZIP', 'No quality loss'],
  },
  {
    icon: Zap,       title: 'Convert & Compress',    badge: 'Best Value', gradient: 'from-red-500 to-red-600',
    href: '/convert-compress',  description: 'Convert format AND reduce size in one single step.',
    features: ['All conversion features', 'Max size reduction', 'One-step processing'],
  },
  {
    icon: Users,     title: 'Team Workspaces',       badge: 'Team',       gradient: 'from-green-500 to-green-600',
    href: '/workspaces',        description: 'Collaborate in real-time with your team in shared spaces.',
    features: ['Real-time chat', 'Share links & resources', 'Member management'],
  },
  {
    icon: ScanText,  title: 'OCR Tool',              badge: 'New',        gradient: 'from-orange-500 to-orange-600',
    href: '/ocr-tool',          description: 'Extract editable text from images and scanned documents.',
    features: ['Scan images & PDFs', 'Multiple languages', 'Export as text/PDF'],
  },
  {
    icon: Radio,     title: 'Activity Feed',         badge: 'Live',       gradient: 'from-indigo-500 to-indigo-600',
    href: '/feed',              description: 'Stay updated with live activity across all your workspaces.',
    features: ['Real-time updates', 'Activity tracking', 'Team notifications'],
  },
  {
    icon: Video,     title: 'Video Meetings',        badge: 'New',        gradient: 'from-cyan-500 to-cyan-600',
    href: '/meet',              description: 'Host HD video calls and share your screen instantly.',
    features: ['HD video calls', 'Screen sharing', 'No downloads needed'],
  },
  {
    icon: PenTool,   title: 'Whiteboards',           badge: 'New',        gradient: 'from-pink-500 to-pink-600',
    href: '/my-whiteboards',    description: 'Brainstorm ideas and sketch concepts on visual boards.',
    features: ['Drawing tools', 'Text & shapes', 'Multiple boards'],
  },
  {
    icon: FileType,  title: 'My Documents',          badge: 'New',        gradient: 'from-sky-500 to-sky-600',
    href: '/documents',         description: 'Write and edit documents with a rich text editor.',
    features: ['Rich text formatting', 'Import & export DOCX', 'Auto-save & organize'],
  },
  {
    icon: FilePlus2, title: 'PDF Merger & Splitter', badge: 'New',        gradient: 'from-amber-500 to-orange-500',
    href: '/forge',             description: 'Combine multiple PDFs or split one into custom sections.',
    features: ['Merge up to 20 PDFs', 'Split by page ranges', 'Drag to reorder'],
  },
  {
    icon: Lock,      title: 'PDF Password Protect',  badge: 'New',        gradient: 'from-violet-500 to-violet-600',
    href: '/lock',              description: 'Lock PDFs with a password or remove existing ones.',
    features: ['128-bit encryption', 'Remove passwords', 'Files never stored'],
  },
  {
    icon: Sparkles,  title: 'Summarize Document',    badge: 'AI',         gradient: 'from-purple-600 to-indigo-700',
    href: '/summarize',         description: 'Compress and extract a smart AI summary from any PDF, DOCX or PPTX.',
    features: ['Powered by Llama 3', 'PDF, DOCX & PPTX', 'Structured output'],
  },
];

const GetStarted: FC = () => {
  useSEO({
    title: 'Get Started with SlimFile — Choose Your Tool',
    description: 'Pick the right SlimFile tool for your task. Compress, convert, summarize, OCR, meet, collaborate — everything you need to manage files smarter.',
  });
  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Hello, what do you want to do today?
          </h1>
          <p className="text-gray-500 text-base">Pick a tool and get started in seconds.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Link to={f.href} key={f.title} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">

                {/* Gradient header */}
                <div className={`relative bg-gradient-to-br ${f.gradient} px-5 pt-5 pb-8 flex-shrink-0`}>
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white font-bold text-base leading-tight">{f.title}</p>
                  </div>
                </div>

                {/* Floating white panel */}
                <div className="relative -mt-4 mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col flex-1">
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{f.description}</p>
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {f.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 group-hover:gap-2 transition-all duration-200">
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
