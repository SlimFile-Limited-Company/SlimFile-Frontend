import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Star, MessageSquare, TrendingUp, Bot, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
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
  role: 'assistant';
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
    title: 'Community Manager — SlimFile Assistant',
    description: 'Review management with SlimFile Assistant responding to customer feedback in real-time.',
  });

  const [reviews, setReviews] = useState<ReviewWithReplies[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

          // Auto-generate for reviews without replies in batches (5 per second)
          const reviewsNeedingReplies = reviewsWithReplies.filter(
            (review: ReviewWithReplies) => review.replies.length === 0
          );

          reviewsNeedingReplies.forEach((review: ReviewWithReplies, index: number) => {
            setTimeout(() => {
              generateAIReply(review._id, review.rating, review.comment);
            }, index * 200); // 200ms delay = 5 requests per second
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

      console.log('🤖 Generating AI reply for review:', reviewId);

      const response = await fetch(`${API_BASE_URL}/ai/grok`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are SlimFile Assistant, the official assistant for SlimFile - a file compression and conversion platform. Your role is to respond to customer reviews professionally, helpfully, and warmly.

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

      if (!response.ok) {
        throw new Error(`AI API failed: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.reply;
      console.log('✅ AI reply generated:', aiMessage);

      // Save the AI reply to the backend
      console.log('💾 Saving reply to backend...');
      const saveResponse = await fetch(`${API_BASE_URL}/reviews/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          message: aiMessage,
          role: 'assistant'
        })
      });

      if (!saveResponse.ok) {
        console.error('❌ Failed to save reply to backend:', saveResponse.status);
        console.error('Backend might not have /reviews/replies endpoint');
      } else {
        console.log('✅ Reply saved to backend');
      }

      // Update UI immediately regardless of backend save
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
    } catch (error) {
      console.error('❌ Error generating reply:', error);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, isGenerating: false } : r));
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <Bot className="w-4 h-4" />
            Review Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Community Manager
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            View all customer reviews and SlimFile Assistant responses
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Average Rating</p>
                  <p className="text-xl font-bold text-gray-900">{stats.averageRating.toFixed(1)} / 5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Reviews</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Assistant Responses</p>
                  <p className="text-xl font-bold text-gray-900">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className={`bg-gradient-to-br ${operationColors[review.operationType] || 'from-gray-500 to-gray-600'} px-4 py-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{review.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? 'text-yellow-300 fill-yellow-300'
                                    : 'text-white/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/60 text-xs">·</span>
                          <span className="text-white/80 text-xs">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {operationLabels[review.operationType] || review.operationType}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="px-4 py-2 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-2">
                    "{review.comment}"
                  </p>
                </div>

                {/* Assistant Replies */}
                <div className="px-4 py-3 space-y-2">
                  {review.isGenerating && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-purple-50 rounded-xl rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-xs font-semibold text-purple-900">SlimFile Assistant</p>
                          <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
                        </div>
                        <p className="text-xs text-purple-700">Generating response...</p>
                      </div>
                    </div>
                  )}

                  {review.replies.length === 0 && !review.isGenerating && (
                    <div className="text-center py-2 text-gray-400 text-xs">
                      <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                      No response yet
                    </div>
                  )}

                  {review.replies.map((reply) => (
                    <div key={reply._id} className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-purple-50 rounded-xl rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-xs font-semibold text-purple-900">
                            SlimFile Assistant
                          </p>
                          <span className="text-[10px] text-purple-600">
                            {formatDate(reply.createdAt)}
                          </span>
                          <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />
                        </div>
                        <p className="text-xs leading-relaxed text-purple-900">
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">How SlimFile Assistant Works</h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Smart Analysis:</strong> Analyzes both star rating AND review text to understand true sentiment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Auto-Reply:</strong> Instantly responds to all new reviews with contextual, helpful messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>View & Monitor:</strong> See all responses for quality assurance and improvements</span>
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
