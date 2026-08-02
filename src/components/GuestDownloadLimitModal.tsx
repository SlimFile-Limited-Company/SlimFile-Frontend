import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface GuestDownloadLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestDownloadLimitModal = ({
  isOpen,
  onClose
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
            <span className="text-3xl">🔒</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to continue
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Please sign in to continue downloading files
          </p>

          {/* Actions */}
          <Button
            onClick={handleSignIn}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
          >
            Sign In
          </Button>

          {/* Footer note */}
          <p className="text-xs text-gray-500 mt-6">
            Signing in gives you unlimited downloads and access to all features
          </p>
        </div>
      </div>
    </div>
  );
};
