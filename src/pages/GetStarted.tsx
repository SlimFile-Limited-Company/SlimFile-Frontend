import { FC, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, FileText, FileImage, Users, Radio, Video, PenTool, ScanText, FileType, FilePlus2, Lock, CheckCircle2, FileEdit, Sparkles, Languages, MessageCircleQuestion, Tags, Smile, GitCompare, Mail, Shield, Maximize2, Crop, Wand2, Signature, Eraser, Layers, UserX, Grid3x3 } from 'lucide-react';

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
    icon: FilePlus2, title: 'PDF Merger & Splitter', badge: 'New',        gradient: 'from-amber-500 to-orange-500',
    href: '/forge',             description: 'Combine multiple PDFs or split one into custom sections.',
    features: ['Merge up to 20 PDFs', 'Split by page ranges', 'Drag to reorder'],
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
    icon: Users,     title: 'Team Workspaces',       badge: 'Team',       gradient: 'from-green-500 to-green-600',
    href: '/workspaces',        description: 'Collaborate in real-time with your team in shared spaces.',
    features: ['Real-time chat', 'Share links & resources', 'Member management'],
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

const IMAGE_FEATURES = [
  {
    icon: Maximize2,  title: 'Resize Image',          badge: 'New',        gradient: 'from-blue-500 to-indigo-500',
    href: '/images/resize',      description: 'Resize images to custom dimensions with quality preservation.',
    features: ['Maintain aspect ratio', '100% quality default', 'PNG/JPEG/WEBP support'],
  },
  {
    icon: Crop,       title: 'Crop Image',            badge: 'New',        gradient: 'from-emerald-500 to-teal-500',
    href: '/images/crop',        description: 'Crop images with drag-to-crop interface and zoom controls.',
    features: ['Visual drag interface', 'Zoom 1x - 3x', 'Live preview'],
  },
  {
    icon: Wand2,      title: 'Enhance Image',         badge: 'New',        gradient: 'from-purple-500 to-pink-500',
    href: '/images/enhance',     description: 'Automatically improve brightness, contrast, and sharpness.',
    features: ['One-click enhance', 'Auto adjustments', 'Quality improvement'],
  },
  {
    icon: Signature,  title: 'Watermark Image',       badge: 'New',        gradient: 'from-cyan-500 to-blue-500',
    href: '/images/watermark',   description: 'Add text or image watermarks to protect your images.',
    features: ['Text & image marks', 'Custom position', 'Opacity control'],
  },
  {
    icon: Eraser,     title: 'Remove Background',     badge: 'New',        gradient: 'from-red-500 to-orange-500',
    href: '/images/remove-background', description: 'Convert your images to transparent PNG format.',
    features: ['Transparent PNG', 'Alpha channel', 'Quick conversion'],
  },
  {
    icon: Layers,     title: 'Replace Background',    badge: 'New',        gradient: 'from-violet-500 to-purple-500',
    href: '/images/replace-background', description: 'Change image background with solid colors.',
    features: ['Color picker', 'Custom colors', 'Live preview'],
  },
  {
    icon: UserX,      title: 'Blur Faces',            badge: 'AI',         gradient: 'from-indigo-500 to-blue-600',
    href: '/images/blur-faces',  description: 'AI-powered face detection and blur for privacy protection.',
    features: ['Auto face detection', 'Adjustable intensity', 'Privacy protection'],
  },
  {
    icon: Grid3x3,    title: 'Generate Thumbnails',   badge: 'New',        gradient: 'from-amber-500 to-yellow-500',
    href: '/images/generate-thumbnails', description: 'Create multiple thumbnail sizes from your images.',
    features: ['Multiple sizes', 'Batch generation', 'Instant download'],
  },
];

const AI_LAB_FEATURES = [
  {
    icon: Languages, title: 'Translate Text', badge: 'AI', gradient: 'from-blue-500 to-cyan-500',
    href: '/ai-lab?feature=translate', description: 'Translate text to any language instantly with AI.',
    features: ['12+ languages', 'Preserves context', 'File upload support'],
  },
  {
    icon: FileText, title: 'Summarize Document', badge: 'AI', gradient: 'from-purple-500 to-pink-500',
    href: '/ai-lab?feature=summarize', description: 'Get key points and summaries from any document.',
    features: ['PDF, DOCX support', 'Smart extraction', 'Structured output'],
  },
  {
    icon: PenTool, title: 'Rewrite Content', badge: 'AI', gradient: 'from-green-500 to-emerald-500',
    href: '/ai-lab?feature=rewrite', description: 'Improve, formalize, or simplify your text.',
    features: ['Multiple styles', 'Tone adjustment', 'Quality improvement'],
  },
  {
    icon: MessageCircleQuestion, title: 'Ask Questions', badge: 'AI', gradient: 'from-orange-500 to-red-500',
    href: '/ai-lab?feature=question', description: 'Get answers about your documents and text.',
    features: ['Document analysis', 'Detailed answers', 'Context-aware'],
  },
  {
    icon: Tags, title: 'Extract Keywords', badge: 'AI', gradient: 'from-yellow-500 to-orange-500',
    href: '/ai-lab?feature=keywords', description: 'Identify key terms, topics, and tags automatically.',
    features: ['Topic analysis', 'Tag generation', 'Categorization'],
  },
  {
    icon: Smile, title: 'Analyze Sentiment', badge: 'AI', gradient: 'from-pink-500 to-rose-500',
    href: '/ai-lab?feature=sentiment', description: 'Detect tone, emotions, and sentiment in text.',
    features: ['Emotion detection', 'Tone analysis', 'Detailed breakdown'],
  },
  {
    icon: GitCompare, title: 'Compare Texts', badge: 'AI', gradient: 'from-indigo-500 to-purple-500',
    href: '/ai-lab?feature=compare', description: 'Find differences and similarities between texts.',
    features: ['Side-by-side analysis', 'Change detection', 'Structured report'],
  },
  {
    icon: Mail, title: 'Email Generator', badge: 'AI', gradient: 'from-blue-600 to-cyan-600',
    href: '/ai-lab?feature=email', description: 'Generate professional emails from bullet points.',
    features: ['8 email types', '6 tone options', 'Instant generation'],
  },
  {
    icon: Shield, title: 'Remove Plagiarism', badge: 'AI', gradient: 'from-teal-500 to-green-500',
    href: '/ai-lab?feature=plagiarism', description: 'Rewrite text to make it 100% original.',
    features: ['Complete rewrite', 'Meaning preserved', 'Pass plagiarism checks'],
  },
];

const GetStarted: FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'images'>('general');
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

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'general'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">General Features</span>
              <span className="sm:hidden">General</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'ai'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">AI Lab</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'images'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">Image Processing</span>
              <span className="sm:hidden">Image</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeTab === 'general' ? FEATURES : activeTab === 'ai' ? AI_LAB_FEATURES : IMAGE_FEATURES).map((f) => (
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
