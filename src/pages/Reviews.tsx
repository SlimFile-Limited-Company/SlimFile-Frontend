import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  operationType: string;
  createdAt: string;
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

const PAGE_SIZE = 12;

export const Reviews = () => {
  useSEO({
    title: 'Customer Reviews — SlimFile User Feedback',
    description: 'Read what our users say about SlimFile. Real reviews from people compressing, converting, and managing their files.',
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [shown, setShown] = useState(PAGE_SIZE);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/reviews?limit=100`),
          fetch(`${API_BASE_URL}/reviews/stats`)
        ]);

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          // Filter out 1-star reviews
          const filteredReviews = (reviewsData.reviews || []).filter((review: Review) => review.rating > 1);
          setReviews(filteredReviews);
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
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tool filters, only for tools that actually have reviews
  const toolsWithReviews = Array.from(new Set(reviews.map(r => r.operationType)));
  const filters = [{ key: 'all', label: 'All' }, ...toolsWithReviews.map(t => ({ key: t, label: operationLabels[t] || t }))];
  const visible = reviews.filter(r => filter === 'all' || r.operationType === filter);
  const maxCount = stats ? Math.max(1, ...[5, 4, 3, 2].map(n => stats.distribution[n as 5 | 4 | 3 | 2])) : 1;

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      {/* Hero */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">Reviews</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">What people say.</h1>
        <p className="mt-5 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          Real feedback from people who compress, convert and manage their files with SlimFile.
        </p>
      </section>

      {/* Ratings summary, App Store style */}
      {stats && stats.totalReviews > 0 && (
        <section className="px-4 sm:px-6 pb-14">
          <div className="max-w-3xl mx-auto rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-[72px] leading-none font-semibold tracking-tight">{stats.averageRating.toFixed(1)}</p>
              <p className="mt-2 text-[15px] text-[#6e6e73]">out of 5</p>
            </div>
            <div className="flex-1 w-full">
              {[5, 4, 3, 2].map(n => (
                <div key={n} className="flex items-center gap-3 py-1">
                  <span className="w-16 flex justify-end gap-0.5 shrink-0">
                    {Array.from({ length: n }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-[#6e6e73] fill-[#6e6e73]" />
                    ))}
                  </span>
                  <span className="flex-1 h-1.5 rounded-full bg-[#e8e8ed] overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-[#1d1d1f]"
                      style={{ width: `${(stats.distribution[n as 5 | 4 | 3 | 2] / maxCount) * 100}%` }}
                    />
                  </span>
                </div>
              ))}
              <p className="mt-3 text-right text-[13px] text-[#6e6e73]">
                {stats.totalReviews.toLocaleString()} {stats.totalReviews === 1 ? 'rating' : 'ratings'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Tool filter */}
          {filters.length > 2 && (
            <div className="flex justify-center mb-10">
              <div className="inline-flex max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-full bg-[#f5f5f7] p-1">
                {filters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => { setFilter(f.key); setShown(PAGE_SIZE); }}
                    className={`relative shrink-0 px-4 h-8 rounded-full text-[13px] transition-colors ${filter === f.key ? 'text-[#1d1d1f] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                  >
                    {filter === f.key && (
                      <motion.span layoutId="review-filter" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 flex justify-center text-[#6e6e73]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : visible.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <h2 className="text-[28px] font-semibold tracking-tight">No reviews yet</h2>
              <p className="mt-2 text-[17px] text-[#6e6e73]">Use any SlimFile tool and you can leave the first one.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visible.slice(0, shown).map(review => (
                  <article key={review._id} className="rounded-[22px] bg-[#f5f5f7] p-6 sm:p-7 flex flex-col">
                    <div className="flex items-center gap-0.5 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-[#ff9f0a] fill-[#ff9f0a]' : 'text-[#d2d2d7] fill-[#d2d2d7]'}`}
                        />
                      ))}
                    </div>
                    <p className="text-[17px] leading-relaxed flex-1">{review.comment}</p>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[15px] font-semibold text-[#1d1d1f] shrink-0">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold truncate">{review.name}</p>
                        <p className="text-[13px] text-[#6e6e73] truncate">
                          {operationLabels[review.operationType] || review.operationType} · {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {shown < visible.length && (
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
    </div>
  );
};

export default Reviews;
