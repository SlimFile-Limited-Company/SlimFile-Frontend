import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  FileText,
  PenTool,
  MessageCircleQuestion,
  Tags,
  Smile,
  GitCompare,
  Send,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

type AIFeature =
  | 'translate'
  | 'summarize'
  | 'rewrite'
  | 'question'
  | 'keywords'
  | 'sentiment'
  | 'compare'
  | null;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const features = [
  {
    id: 'translate' as AIFeature,
    name: 'Translate Text',
    description: 'Translate text to any language',
    icon: Languages,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'summarize' as AIFeature,
    name: 'Summarize Document',
    description: 'Get key points and summaries',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'rewrite' as AIFeature,
    name: 'Rewrite Content',
    description: 'Improve, formalize, or simplify text',
    icon: PenTool,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'question' as AIFeature,
    name: 'Ask Questions',
    description: 'Get answers about your text or document',
    icon: MessageCircleQuestion,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'keywords' as AIFeature,
    name: 'Extract Keywords',
    description: 'Get tags, topics, and key terms',
    icon: Tags,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'sentiment' as AIFeature,
    name: 'Analyze Sentiment',
    description: 'Detect tone and emotions in text',
    icon: Smile,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'compare' as AIFeature,
    name: 'Compare Texts',
    description: 'Find differences between two texts',
    icon: GitCompare,
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function AILab() {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useSEO({
    title: 'AI Lab — Intelligent Text Processing | SlimFile',
    description: 'Access powerful AI tools for translation, summarization, rewriting, and more. Process text and documents with advanced AI capabilities.',
  });

  const handleFeatureSelect = (featureId: AIFeature) => {
    setSelectedFeature(featureId);
    setMessages([]);
    setInput('');
    setUploadedFile(null);

    const feature = features.find(f => f.id === featureId);
    if (feature) {
      setMessages([{
        role: 'assistant',
        content: `Welcome to ${feature.name}! ${feature.description}. How can I help you today?`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleBack = () => {
    setSelectedFeature(null);
    setMessages([]);
    setInput('');
    setUploadedFile(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB

    // If file > 10MB, compress it first
    if (file.size > maxSize) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Your file is larger than 10MB. Compressing it first...',
        timestamp: new Date(),
      }]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/compress', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Compression failed');
        }

        const blob = await response.blob();
        const compressedFile = new File([blob], file.name, { type: file.type });

        setUploadedFile(compressedFile);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `File compressed from ${(file.size / 1024 / 1024).toFixed(2)} MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB. Ready to process!`,
          timestamp: new Date(),
        }]);
      } catch (error) {
        console.error('Compression error:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Failed to compress file. Please try a smaller file.',
          timestamp: new Date(),
        }]);
      }
    } else {
      setUploadedFile(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage: Message = {
      role: 'user',
      content: input || `Uploaded: ${uploadedFile?.name}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (only user and assistant messages, no system)
      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: selectedFeature,
          message: input,
          conversationHistory: JSON.stringify(conversationHistory),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I processed your request.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setUploadedFile(null);
    } catch (error: any) {
      console.error('AI Lab error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Feature Selection Screen
  if (!selectedFeature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              AI Lab
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools for text processing. Choose a feature below to get started.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureSelect(feature.id)}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                      <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  const currentFeature = features.find(f => f.id === selectedFeature);
  const sidebarOpen = true; // Always show sidebar on desktop

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-white font-semibold text-sm sm:text-base">
              {currentFeature?.name}
            </h2>
            <p className="text-white/80 text-xs hidden sm:block">
              {currentFeature?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} hidden lg:block border-r border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden`}>
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Switch Feature</h3>
              <div className="space-y-2">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureSelect(feature.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedFeature === feature.id
                          ? 'bg-red-100 text-red-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium truncate">{feature.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-400">No messages yet</p>
                ) : (
                  messages.slice(-3).reverse().map((msg, idx) => (
                    <div key={idx} className="text-xs text-gray-600 p-2 bg-white rounded border border-gray-100">
                      <p className="font-medium text-gray-700 mb-1">
                        {msg.role === 'user' ? 'You' : 'AI'}
                      </p>
                      <p className="truncate">{msg.content.substring(0, 50)}...</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-900 rounded-tl-sm'
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {uploadedFile && (
              <div className="mb-3 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {uploadedFile.name}
                </span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <label className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-xl hover:border-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx"
                />
              </label>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm sm:text-base"
                disabled={isLoading}
              />

              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !uploadedFile)}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
