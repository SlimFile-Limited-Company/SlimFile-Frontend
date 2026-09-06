import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

interface ReviewPromptProps {
  isOpen: boolean;
  onClose: () => void;
  operationType: 'compress' | 'convert' | 'convert-compress' | 'forge' | 'lock' | 'ocr' | 'summarize';
}

export const ReviewPrompt = ({ isOpen, onClose, operationType }: ReviewPromptProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userDataFetched, setUserDataFetched] = useState(false);

  // Get user name if authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated() && !userDataFetched) {
      const fetchUserName = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
          const token = localStorage.getItem('jwt');
          const response = await fetch(`${API_BASE_URL}/protected/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            const fullName = data.user?.name || '';
            const firstName = fullName.split(' ')[0];
            setUserName(firstName);
            setName(fullName);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
        setUserDataFetched(true);
      };
      fetchUserName();
    }
  }, [isOpen, userDataFetched]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !comment.trim()) {
      alert('Please provide a rating and comment');
      return;
    }

    if (!isAuthenticated() && !name.trim()) {
      alert('Please provide your name');
      return;
    }

    if (!isAuthenticated() && !email.trim()) {
      alert('Please provide your email');
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
      const token = localStorage.getItem('jwt');

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          comment: comment.trim(),
          operationType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setRating(0);
        setComment('');
        setName('');
        setEmail('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600 fill-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your review has been published. Check out all reviews on our Reviews page!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {userName ? `Hi ${userName}` : 'Hi there'}!
            </h2>
            <p className="text-gray-600 mb-6">
              This is Isaac Abakah, the Founder of SlimFile. We appreciate you using SlimFile.
              Please leave us a review.
            </p>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name (if not authenticated) */}
            {!isAuthenticated() && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            {/* Email (required, if not authenticated) */}
            {!isAuthenticated() && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            )}

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Tell us about your experience..."
                rows={4}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Maybe Later
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
