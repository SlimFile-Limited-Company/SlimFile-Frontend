import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Star, MessageSquare, TrendingUp, Bot, Send, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  operationType: string;
  createdAt: string;
}

interface AIReply {
  _id: string;
  reviewId: string;
  message: string;
  role: 'assistant' | 'user';
  createdAt: string;
}

interface ReviewWithReplies extends Review {
  replies: AIReply[];
  isGenerating?: boolean;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const operationLabels: Record<string, string> = {
  compress: 'Compression',
  convert: 'Conversion',
  'convert-compress': 'Convert & Compress',
  forge: 'PDF Tools',
  lock: 'PDF Security',
  ocr: 'OCR',
  summarize: 'Summarization'
};

const operationColors: Record<string, string> = {
  compress: 'from-blue-500 to-indigo-500',
  convert: 'from-purple-500 to-pink-500',
  'convert-compress': 'from-red-500 to-orange-500',
  forge: 'from-amber-500 to-yellow-500',
  lock: 'from-green-500 to-emerald-500',
  ocr: 'from-cyan-500 to-teal-500',
  summarize: 'from-violet-500 to-purple-500'
};

export default function CommunityManager() {
  useSEO({
    title: 'Community Manager — SlimFile AI Assistant',
    description: 'AI-powered review management with SlimFile Assistant responding to customer feedback in real-time.',
  });

  const [reviews, setReviews] = useState<ReviewWithReplies[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMessages, setUserMessages] = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage] = useState<Record<string, boolean>>({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    fetchData();

    // Setup real-time socket connection
    const socket = io(API_BASE_URL.replace('/api', ''));

    socket.on('newReview', (review: Review) => {
      // Auto-generate AI reply for new review
      generateAIReply(review._id, review.rating, review.comment);
    });

    socket.on('newReply', (reply: AIReply) => {
      setReviews(prev => prev.map(review => {
        if (review._id === reply.reviewId) {
          return {
            ...review,
            replies: [...review.replies, reply],
            isGenerating: false
          };
        }
        return review;
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [API_BASE_URL]);

  const fetchData = async () => {
    try {
      const [reviewsRes, statsRes, repliesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reviews?limit=100`),
        fetch(`${API_BASE_URL}/reviews/stats`),
        fetch(`${API_BASE_URL}/reviews/replies`)
      ]);

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const reviewsList = reviewsData.reviews || [];

        if (repliesRes.ok) {
          const repliesData = await repliesRes.json();
          const repliesByReview: Record<string, AIReply[]> = {};

          repliesData.replies?.forEach((reply: AIReply) => {
            if (!repliesByReview[reply.reviewId]) {
              repliesByReview[reply.reviewId] = [];
            }
            repliesByReview[reply.reviewId].push(reply);
          });

          const reviewsWithReplies = reviewsList.map((review: Review) => ({
            ...review,
            replies: repliesByReview[review._id] || []
          }));

          setReviews(reviewsWithReplies);

          // Auto-generate AI reply for reviews without any replies
          reviewsWithReplies.forEach((review: ReviewWithReplies) => {
            if (review.replies.length === 0) {
              generateAIReply(review._id, review.rating, review.comment);
            }
          });
        } else {
          setReviews(reviewsList.map((r: Review) => ({ ...r, replies: [] })));
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIReply = async (reviewId: string, rating: number, comment: string) => {
    try {
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, isGenerating: true } : r));

      const response = await fetch(`${API_BASE_URL}/ai/grok`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are SlimFile Assistant, the official AI assistant for SlimFile - a file compression and conversion platform. Your role is to respond to customer reviews professionally, helpfully, and warmly.

IMPORTANT INSTRUCTIONS:
1. Analyze BOTH the star rating AND the actual text content
2. Sometimes users give low stars but write positive comments, or vice versa
3. Respond based on the ACTUAL SENTIMENT in their words, not just the stars
4. If there's a mismatch (e.g., 2 stars but positive text), acknowledge both: thank them for the kind words AND gently ask if something could be improved
5. Keep responses under 3 sentences
6. Be warm, professional, and helpful
7. For negative feedback: apologize, offer help/support
8. For positive feedback: thank them, highlight what they loved
9. For mixed feedback: acknowledge both the praise and concerns
10. Never mention that you're an AI - respond as "SlimFile Assistant" or "we"

Your tone should be: friendly, professional, empathetic, and solution-oriented.`
            },
            {
              role: 'user',
              content: `Review Rating: ${rating}/5 stars\nReview Text: "${comment}"\n\nPlease respond to this review considering both the rating and the actual text content.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = data.reply;

        // Save the AI reply to the backend
        await fetch(`${API_BASE_URL}/reviews/replies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewId,
            message: aiMessage,
            role: 'assistant'
          })
        });

        setReviews(prev => prev.map(review => {
          if (review._id === reviewId) {
            return {
              ...review,
              replies: [
                ...review.replies,
                {
                  _id: Date.now().toString(),
                  reviewId,
                  message: aiMessage,
                  role: 'assistant',
                  createdAt: new Date().toISOString()
                }
              ],
              isGenerating: false
            };
          }
          return review;
        }));
      }
    } catch (error) {
      console.error('Error generating AI reply:', error);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, isGenerating: false } : r));
    }
  };

  const handleUserReply = async (reviewId: string) => {
    const message = userMessages[reviewId]?.trim();
    if (!message) return;

    setSendingMessage(prev => ({ ...prev, [reviewId]: true }));

    try {
      // Save user message
      await fetch(`${API_BASE_URL}/reviews/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          message,
          role: 'user'
        })
      });

      const userReply: AIReply = {
        _id: Date.now().toString(),
        reviewId,
        message,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            replies: [...review.replies, userReply]
          };
        }
        return review;
      }));

      setUserMessages(prev => ({ ...prev, [reviewId]: '' }));

      // Generate AI response to the user's message
      const review = reviews.find(r => r._id === reviewId);
      if (review) {
        const allMessages = [
          ...review.replies.map(r => ({
            role: r.role === 'assistant' ? 'assistant' : 'user',
            content: r.message
          })),
          { role: 'user', content: message }
        ];

        const response = await fetch(`${API_BASE_URL}/ai/grok`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are SlimFile Assistant. Continue the conversation professionally and helpfully. Keep responses under 3 sentences. Be warm and solution-oriented.`
              },
              ...allMessages
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage = data.reply;

          await fetch(`${API_BASE_URL}/reviews/replies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reviewId,
              message: aiMessage,
              role: 'assistant'
            })
          });

          setReviews(prev => prev.map(r => {
            if (r._id === reviewId) {
              return {
                ...r,
                replies: [
                  ...r.replies,
                  {
                    _id: (Date.now() + 1).toString(),
                    reviewId,
                    message: aiMessage,
                    role: 'assistant',
                    createdAt: new Date().toISOString()
                  }
                ]
              };
            }
            return r;
          }));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <Bot className="w-4 h-4" />
            AI-Powered Review Management
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Community Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            SlimFile Assistant automatically responds to all customer reviews in real-time
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)} / 5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Responses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.reduce((acc, r) => acc + r.replies.filter(reply => reply.role === 'assistant').length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Reviews will appear here when customers leave feedback</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Review Header */}
                <div className={`bg-gradient-to-br ${operationColors[review.operationType] || 'from-gray-500 to-gray-600'} px-6 py-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-lg">{review.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-300 fill-yellow-300'
                                    : 'text-white/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/80 text-sm">·</span>
                          <span className="text-white/80 text-sm">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {operationLabels[review.operationType] || review.operationType}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-800 text-base leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* AI Replies Thread */}
                <div className="px-6 py-4 space-y-4">
                  {review.isGenerating && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-purple-50 rounded-2xl rounded-tl-none px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-semibold text-purple-900">SlimFile Assistant</p>
                          <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
                        </div>
                        <p className="text-sm text-purple-700">Generating response...</p>
                      </div>
                    </div>
                  )}

                  {review.replies.map((reply, idx) => (
                    <div key={reply._id} className={`flex items-start gap-3 ${reply.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.role === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {reply.role === 'assistant' ? (
                          <Bot className="w-5 h-5 text-purple-600" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className={`flex-1 rounded-2xl px-4 py-3 ${
                        reply.role === 'assistant'
                          ? 'bg-purple-50 rounded-tl-none'
                          : 'bg-blue-50 rounded-tr-none'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-semibold ${
                            reply.role === 'assistant' ? 'text-purple-900' : 'text-blue-900'
                          }`}>
                            {reply.role === 'assistant' ? 'SlimFile Assistant' : 'Community Manager'}
                          </p>
                          <span className={`text-xs ${
                            reply.role === 'assistant' ? 'text-purple-600' : 'text-blue-600'
                          }`}>
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          reply.role === 'assistant' ? 'text-purple-900' : 'text-blue-900'
                        }`}>
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* User Reply Input */}
                  <div className="pt-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <textarea
                          value={userMessages[review._id] || ''}
                          onChange={(e) => setUserMessages(prev => ({ ...prev, [review._id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleUserReply(review._id);
                            }
                          }}
                          placeholder="Reply as Community Manager..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={() => handleUserReply(review._id)}
                        disabled={!userMessages[review._id]?.trim() || sendingMessage[review._id]}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl h-[52px]"
                      >
                        {sendingMessage[review._id] ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How SlimFile Assistant Works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Smart Analysis:</strong> The AI analyzes both the star rating AND the review text to understand true sentiment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Auto-Reply:</strong> Instantly responds to all new reviews with contextual, helpful messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Full Conversations:</strong> You can reply as Community Manager and the AI will continue the conversation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Real-Time:</strong> New reviews and replies appear instantly without page refresh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
