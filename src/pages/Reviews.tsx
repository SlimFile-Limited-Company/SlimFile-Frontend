import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Star, MessageSquare, TrendingUp, Users } from 'lucide-react';

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

export const Reviews = () => {
  useSEO({
    title: 'Customer Reviews — SlimFile User Feedback',
    description: 'Read what our users say about SlimFile. Real reviews from people compressing, converting, and managing their files.',
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Customer Reviews
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            See what our users say about SlimFile. Real feedback from people who compress, convert, and manage their files with us.
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
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.distribution[5]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  {/* Gradient header */}
                  <div className={`relative bg-gradient-to-br ${operationColors[review.operationType] || 'from-gray-500 to-gray-600'} px-5 pt-5 pb-8 flex-shrink-0`}>
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {operationLabels[review.operationType] || review.operationType}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-base leading-tight">{review.name}</p>
                        <div className="flex items-center gap-1 mt-1">
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
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative -mt-4 mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      "{review.comment}"
                    </p>
                    <p className="text-xs text-gray-400 mt-auto">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
