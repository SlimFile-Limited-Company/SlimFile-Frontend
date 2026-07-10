import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  X,
  Copy,
  Check,
  Mail,
  Shield,
  Menu
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
  | 'email'
  | 'plagiarism'
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
    description: 'Upload a document or paste text, then ask me anything about it',
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
  {
    id: 'email' as AIFeature,
    name: 'Email Generator',
    description: 'Generate professional emails from bullet points',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'plagiarism' as AIFeature,
    name: 'Remove Plagiarism',
    description: 'Rewrite text to make it 100% original',
    icon: Shield,
    color: 'from-teal-500 to-green-500',
  },
];

export default function AILab() {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [compareText2, setCompareText2] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Email Generator state
  const [emailType, setEmailType] = useState('Professional Inquiry');
  const [emailTone, setEmailTone] = useState('Professional');
  const [showEmailTypeModal, setShowEmailTypeModal] = useState(false);
  const [showEmailToneModal, setShowEmailToneModal] = useState(false);

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useSEO({
    title: 'AI Lab — Intelligent Text Processing | SlimFile',
    description: 'Access powerful AI tools for translation, summarization, rewriting, and more. Process text and documents with advanced AI capabilities.',
  });

  // Load conversation history when feature changes
  useEffect(() => {
    if (selectedFeature && localStorage.getItem('jwt')) {
      loadConversations(selectedFeature);
    }
  }, [selectedFeature]);

  // Helper to extract the main answer from AI response
  const extractAnswer = (content: string, feature: AIFeature): string => {
    // For translation, extract the translated text
    if (feature === 'translate') {
      const match = content.match(/(?:is|would be|:)\s*["']([^"']+)["']/);
      if (match) return match[1];
      // Try to find quoted text
      const quoted = content.match(/["']([^"']{2,})["']/);
      if (quoted) return quoted[1];
    }
    // For other features, return the full content
    return content;
  };

  const handleCopy = async (content: string, index: number) => {
    const answer = extractAnswer(content, selectedFeature);
    await navigator.clipboard.writeText(answer);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Load conversation history for selected feature
  const loadConversations = async (feature: AIFeature) => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/conversations?feature=${feature}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load a specific conversation
  const loadConversation = async (id: string) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/conversations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const conv = data.conversation;

        setConversationId(conv._id);
        setMessages(conv.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp)
        })));

        if (conv.targetLanguage) {
          setTargetLanguage(conv.targetLanguage);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setInput('');
    setUploadedFile(null);

    const feature = features.find(f => f.id === selectedFeature);
    if (feature) {
      setMessages([{
        role: 'assistant',
        content: `Welcome to ${feature.name}! ${feature.description}. How can I help you today?`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleFeatureSelect = (featureId: AIFeature) => {
    setSelectedFeature(featureId);
    setConversationId(null);
    setMessages([]);
    setInput('');
    setUploadedFile(null);
    setMobileMenuOpen(false); // Close mobile menu

    const feature = features.find(f => f.id === featureId);
    if (feature) {
      setMessages([{
        role: 'assistant',
        content: `Welcome to ${feature.name}! ${feature.description}. How can I help you today?`,
        timestamp: new Date(),
      }]);
    }

    // Load conversation history for this feature
    loadConversations(featureId);
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
    // Validation based on feature
    if (selectedFeature === 'compare') {
      if (!input.trim() || !compareText2.trim()) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Please provide both texts to compare.',
          timestamp: new Date(),
        }]);
        return;
      }
    } else if (!input.trim() && !uploadedFile) {
      return;
    }

    // Build the message based on feature
    let finalMessage = input;

    // For translation, add target language
    if (selectedFeature === 'translate' && !input.toLowerCase().includes('to ')) {
      finalMessage = `Translate this to ${targetLanguage}: ${input}`;
    }

    // For comparison, add second text if provided
    if (selectedFeature === 'compare' && compareText2.trim()) {
      finalMessage = `Text 1: ${input}\n\nText 2: ${compareText2}`;
    }

    // For email generator, add type and tone
    if (selectedFeature === 'email') {
      finalMessage = `Generate a ${emailTone.toLowerCase()} email for: ${emailType}\n\nKey points:\n${input}`;
    }

    const userMessage: Message = {
      role: 'user',
      content: finalMessage || `Uploaded: ${uploadedFile?.name}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setCompareText2('');
    setIsLoading(true);

    try {
      // Build conversation history (only user and assistant messages, no system)
      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      // Get API base URL from environment
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      // Get auth token if available
      const token = localStorage.getItem('jwt');
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

      // Use FormData if file is uploaded, otherwise JSON
      let response;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('feature', selectedFeature || '');
        formData.append('message', finalMessage);
        formData.append('conversationHistory', JSON.stringify(conversationHistory));

        // Include conversationId if continuing existing conversation
        if (conversationId) {
          formData.append('conversationId', conversationId);
        }

        // Include targetLanguage for translation feature
        if (selectedFeature === 'translate') {
          formData.append('targetLanguage', targetLanguage);
        }

        response = await fetch(`${API_BASE_URL}/ai/grok`, {
          method: 'POST',
          headers,
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/ai/grok`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feature: selectedFeature,
            message: finalMessage,
            conversationHistory: JSON.stringify(conversationHistory),
            conversationId: conversationId || undefined,
            targetLanguage: selectedFeature === 'translate' ? targetLanguage : undefined,
          }),
        });
      }

      let data;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server error: ${text.substring(0, 200)}`);
      }

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

      // Update conversationId if returned (for new conversations)
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Reload conversation history to show the new/updated conversation
      if (data.conversationId && selectedFeature) {
        loadConversations(selectedFeature);
      }
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
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} fixed lg:static inset-y-0 left-0 z-50 lg:z-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden lg:block`}>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">History</h3>
                <button
                  onClick={startNewConversation}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  New Chat
                </button>
              </div>
              <div className="space-y-2">
                {loadingHistory ? (
                  <p className="text-xs text-gray-400">Loading...</p>
                ) : conversations.length === 0 ? (
                  <p className="text-xs text-gray-400">No saved conversations</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`w-full text-left text-xs p-2 bg-white rounded border transition-colors ${
                        conversationId === conv._id
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-100 hover:border-red-100 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-700 mb-1 truncate">
                        {conv.title}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {new Date(conv.lastMessageAt).toLocaleDateString()} • {conv.messages.length} msgs
                      </p>
                    </button>
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
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 relative group ${
                message.role === 'user'
                  ? 'bg-red-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-900 rounded-tl-sm'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="text-sm sm:text-base break-words pr-8 prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words pr-8">
                  {message.content}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <p
                  className={`text-xs ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(message.content, index)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy answer"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
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

            {/* Language selector for Translation */}
            {selectedFeature === 'translate' && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Target Language</label>
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-red-600 focus:outline-none focus:border-red-600 transition-colors text-sm text-left flex items-center justify-between"
                >
                  <span>{targetLanguage}</span>
                  <span className="text-gray-400">▼</span>
                </button>
              </div>
            )}

            {/* Email Type & Tone selectors */}
            {selectedFeature === 'email' && (
              <>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email Type</label>
                    <button
                      onClick={() => setShowEmailTypeModal(true)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-red-600 focus:outline-none focus:border-red-600 transition-colors text-sm text-left flex items-center justify-between"
                    >
                      <span>{emailType}</span>
                      <span className="text-gray-400">▼</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tone</label>
                    <button
                      onClick={() => setShowEmailToneModal(true)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-red-600 focus:outline-none focus:border-red-600 transition-colors text-sm text-left flex items-center justify-between"
                    >
                      <span>{emailTone}</span>
                      <span className="text-gray-400">▼</span>
                    </button>
                  </div>
                </div>

                {/* Helper text based on email type */}
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">What to include:</p>
                  <p className="text-xs text-blue-700">
                    {emailType === 'Job Application' && '• Position applying for • Company name • Your relevant experience • Why you\'re interested'}
                    {emailType === 'Apology Letter' && '• What happened • Why you\'re sorry • How you\'ll fix it • What you\'ll do differently'}
                    {emailType === 'Thank You Email' && '• What you\'re thanking for • Specific details • Impact it had • Your appreciation'}
                    {emailType === 'Business Proposal' && '• What you\'re proposing • Key benefits • Timeline • Next steps'}
                    {emailType === 'Meeting Request' && '• Purpose of meeting • Preferred date/time • Duration • What you\'ll discuss'}
                    {emailType === 'Follow-up Email' && '• Previous conversation reference • What you\'re following up on • Your question or request'}
                    {emailType === 'Customer Service' && '• Issue or question • Order/Account details • What resolution you need'}
                    {emailType === 'Professional Inquiry' && '• What information you need • Why you\'re asking • Any relevant context'}
                  </p>
                </div>
              </>
            )}

            {/* Language Modal */}
            {showLanguageModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLanguageModal(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Select Target Language</h3>
                    <button onClick={() => setShowLanguageModal(false)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi', 'English'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setTargetLanguage(lang);
                          setShowLanguageModal(false);
                        }}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          targetLanguage === lang
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email Type Modal */}
            {showEmailTypeModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailTypeModal(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center mb-4">
                    <h3 className="text-lg font-semibold">Select Email Type</h3>
                    <button onClick={() => setShowEmailTypeModal(false)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {['Job Application', 'Apology Letter', 'Thank You Email', 'Business Proposal', 'Meeting Request', 'Follow-up Email', 'Customer Service', 'Professional Inquiry'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setEmailType(type);
                          setShowEmailTypeModal(false);
                        }}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          emailType === type
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email Tone Modal */}
            {showEmailToneModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailToneModal(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Select Tone</h3>
                    <button onClick={() => setShowEmailToneModal(false)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Formal', 'Professional', 'Friendly', 'Casual', 'Apologetic', 'Persuasive'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => {
                          setEmailTone(tone);
                          setShowEmailToneModal(false);
                        }}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          emailTone === tone
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Second text input for Compare */}
            {selectedFeature === 'compare' && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Text 1</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter first text..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 transition-colors text-sm resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1 mt-3">Text 2</label>
                <textarea
                  value={compareText2}
                  onChange={(e) => setCompareText2(e.target.value)}
                  placeholder="Enter second text to compare..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 transition-colors text-sm resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Hide normal input for compare feature (uses textareas above) */}
            {selectedFeature !== 'compare' && (
              <div className="flex gap-2">
                <label className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-xl hover:border-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                  className="px-4 sm:px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Send</span>
                </button>
              </div>
            )}

            {/* Send button for compare feature with upload support */}
            {selectedFeature === 'compare' && (
              <div className="flex gap-2 justify-end">
                <label className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-xl hover:border-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !compareText2.trim()}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Compare Texts</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
