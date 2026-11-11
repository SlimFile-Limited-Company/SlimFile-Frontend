import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Star, Bot, Loader2 } from 'lucide-react';
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
  'forge-merge': 'Merge PDFs',
  'forge-split': 'Split PDF',
  lock: 'PDF Security',
  ocr: 'OCR',
  qr: 'QR Code',
  summarize: 'Summarization',
  zip: 'Zip Files',
  unzip: 'Unzip Files',
  'scan-compress': 'Scan & Compress',
  'scan-merge': 'Batch Scan & Merge',
  'scan-split': 'Batch Scan & Split',
  'scan-convert': 'Scan & Convert',
  esign: 'eSign PDF',
  'text-to-pdf': 'Text to PDF'
};

const PAGE_SIZE = 24;

export default function CommunityManager() {
  useSEO({
    title: 'Community Manager — SlimFile Assistant',
    description: 'Review management with SlimFile Assistant responding to customer feedback in real-time.',
  });

  const [reviews, setReviews] = useState<ReviewWithReplies[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shown, setShown] = useState(PAGE_SIZE);

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
        fetch(`${API_BASE_URL}/reviews?limit=1000`),
        fetch(`${API_BASE_URL}/reviews/stats`),
        fetch(`${API_BASE_URL}/reviews/replies`)
      ]);

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        // Filter out 1-star reviews
        const reviewsList = (reviewsData.reviews || []).filter((review: Review) => review.rating > 1);

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
            }, index * 1000); // 1 second delay = 1 request per second (Grok rate limit)
          });
        } else {
          setReviews(reviewsList.map((r: Review) => ({ ...r, replies: [] })));
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        // Recalculate stats excluding 1-star reviews
        const oneStarCount = statsData.distribution[1] || 0;
        const filteredTotalReviews = statsData.totalReviews - oneStarCount;
        const totalRatingPoints = (statsData.averageRating * statsData.totalReviews) - oneStarCount;
        const filteredAverageRating = filteredTotalReviews > 0 ? totalRatingPoints / filteredTotalReviews : 0;

        setStats({
          totalReviews: filteredTotalReviews,
          averageRating: filteredAverageRating,
          distribution: {
            5: statsData.distribution[5] || 0,
            4: statsData.distribution[4] || 0,
            3: statsData.distribution[3] || 0,
            2: statsData.distribution[2] || 0,
            1: 0 // Exclude 1-star from distribution
          }
        });
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

      const response = await fetch(`${API_BASE_URL}/ai/review-reply`, {
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

      // The server keeps one reply per review; show whichever one it kept.
      const saved = saveResponse.ok ? (await saveResponse.json()).reply : null;
      const reply: AIReply = saved ?? {
        _id: Date.now().toString(),
        reviewId,
        message: aiMessage,
        role: 'assistant',
        createdAt: new Date().toISOString()
      };
      if (!saveResponse.ok) console.error('❌ Failed to save reply to backend:', saveResponse.status);

      setReviews(prev => prev.map(review =>
        review._id === reviewId ? { ...review, replies: [reply], isGenerating: false } : review
      ));
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

  const replyCount = reviews.reduce((acc, r) => acc + r.replies.filter(reply => reply.role === 'assistant').length, 0);
  const tiles = stats ? [
    { label: 'Average rating', value: `${stats.averageRating.toFixed(1)}`, unit: 'out of 5' },
    { label: 'Reviews', value: stats.totalReviews.toLocaleString(), unit: 'from customers' },
    { label: 'Assistant replies', value: replyCount.toLocaleString(), unit: 'sent automatically' },
  ] : [];

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      {/* Hero */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">SlimFile Assistant</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Community Manager.</h1>
        <p className="mt-5 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          Every customer review, and the reply SlimFile Assistant sent back.
        </p>
      </section>

      {/* Stats */}
      {stats && (
        <section className="px-4 sm:px-6 pb-14">
          <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-3">
            {tiles.map(t => (
              <div key={t.label} className="rounded-[22px] bg-[#f5f5f7] p-7 text-center sm:text-left">
                <p className="text-[13px] font-semibold text-[#6e6e73]">{t.label}</p>
                <p className="mt-2 text-[44px] leading-none font-semibold tracking-tight">{t.value}</p>
                <p className="mt-2 text-[13px] text-[#6e6e73]">{t.unit}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center text-[#6e6e73]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <h2 className="text-[28px] font-semibold tracking-tight">No reviews yet</h2>
              <p className="mt-2 text-[17px] text-[#6e6e73]">Reviews show up here as soon as customers leave them.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.slice(0, shown).map(review => (
                  <article key={review._id} className="rounded-[22px] bg-[#f5f5f7] p-6 self-start w-full">
                    {/* Customer */}
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[15px] font-semibold shrink-0">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold truncate">{review.name}</p>
                        <p className="text-[13px] text-[#6e6e73] truncate">
                          {operationLabels[review.operationType] || review.operationType} · {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-[#ff9f0a] fill-[#ff9f0a]' : 'text-[#d2d2d7] fill-[#d2d2d7]'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[17px] leading-relaxed line-clamp-3">{review.comment}</p>

                    {/* Assistant reply */}
                    <div className="mt-5 pt-5 border-t border-black/[0.06] space-y-2">
                      {review.isGenerating ? (
                        <p className="flex items-center gap-2 text-[13px] text-[#6e6e73]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          SlimFile Assistant is replying…
                        </p>
                      ) : review.replies.length === 0 ? (
                        <p className="text-[13px] text-[#6e6e73]">No reply yet</p>
                      ) : (
                        review.replies.map(reply => (
                          <div key={reply._id} className="rounded-2xl bg-white p-4">
                            <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                              <Bot className="w-3.5 h-3.5 text-red-600" />
                              SlimFile Assistant
                              <span className="font-normal text-[#6e6e73]">· {formatDate(reply.createdAt)}</span>
                            </p>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-[#1d1d1f]">{reply.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {shown < reviews.length && (
                <div className="mt-10 text-center">
                  <button onClick={() => setShown(n => n + PAGE_SIZE)} className="text-[17px] text-red-600 hover:underline">
                    Show more reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[28px] bg-[#f5f5f7] p-8 sm:p-12">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight mb-8">How SlimFile Assistant works.</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Reads the whole review', text: 'It weighs the star rating and the words, so a 2-star review with kind words gets the right reply.' },
              { title: 'Replies automatically', text: 'Every new review gets a short, helpful reply within moments.' },
              { title: 'Everything in one place', text: 'See every reply here to check its quality and spot what to improve.' },
              { title: 'Live', text: 'New reviews and replies appear without refreshing the page.' },
            ].map(item => (
              <div key={item.title}>
                <h3 className="text-[17px] font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-[15px] text-[#6e6e73] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
