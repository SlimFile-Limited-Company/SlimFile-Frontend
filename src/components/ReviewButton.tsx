import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';
import type { OperationType } from '@/components/ReviewPrompt';

/**
 * A quiet alternative to the old auto-opening review modal.
 *
 * It renders a single dismissible pill that only ever appears after a tool has
 * actually done its job, so nobody gets interrupted mid-task. The form itself
 * still lives in ReviewPrompt — this just decides when to show it.
 *
 * Dismissing hides it for the rest of the browser session, not just the page,
 * so a user moving between tools is not chased around.
 */
interface ReviewButtonProps {
  operationType: OperationType;
  className?: string;
}

const DISMISS_KEY = 'slimfile_review_prompt_dismissed';

export const ReviewButton = ({ operationType, className = '' }: ReviewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Private browsing can throw on setItem — hiding for this mount is enough.
    }
  };

  if (dismissed) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
        >
          <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
          Give us a review
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide review prompt"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ReviewPrompt
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        operationType={operationType}
      />
    </div>
  );
};
