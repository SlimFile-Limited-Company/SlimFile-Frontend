import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface GuestDownloadLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReview: () => void;
  hasReviewed: boolean;
}

export const GuestDownloadLimitModal = ({
  isOpen,
  onClose,
  onReview,
  hasReviewed
}: GuestDownloadLimitModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    navigate('/login');
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

        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You've used your free downloads!
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {hasReviewed
              ? "You've already used your review bonus downloads. Sign in to continue using SlimFile."
              : "You've used 2 free downloads. To continue, please sign in or leave a quick review to get 2 more free downloads."}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleSignIn}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
            >
              Sign In to Continue
            </Button>

            {!hasReviewed && (
              <>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <Button
                  onClick={() => {
                    onClose();
                    onReview();
                  }}
                  variant="outline"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 py-6 text-lg font-semibold"
                >
                  Leave a Review for 2 More Downloads
                </Button>
              </>
            )}
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-500 mt-6">
            Signing in gives you unlimited downloads and access to all features
          </p>
        </div>
      </div>
    </div>
  );
};
