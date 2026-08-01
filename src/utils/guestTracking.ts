/**
 * Guest Tracking Utility
 * Tracks guest user activity and download limits
 */

const GUEST_ID_KEY = 'slimfile_guest_id';
const DOWNLOAD_COUNT_KEY = 'slimfile_download_count';
const HAS_REVIEWED_KEY = 'slimfile_has_reviewed';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

/**
 * Generate a unique guest ID
 */
function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create guest ID
 */
export function getGuestId(): string {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = generateGuestId();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
}

/**
 * Get current download count from localStorage
 */
export function getDownloadCount(): number {
  const count = localStorage.getItem(DOWNLOAD_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Increment download count in localStorage
 */
export function incrementDownloadCount(): number {
  const currentCount = getDownloadCount();
  const newCount = currentCount + 1;
  localStorage.setItem(DOWNLOAD_COUNT_KEY, newCount.toString());
  return newCount;
}

/**
 * Check if guest has reviewed
 */
export function hasReviewed(): boolean {
  return localStorage.getItem(HAS_REVIEWED_KEY) === 'true';
}

/**
 * Mark guest as having reviewed (grants bonus downloads)
 */
export function markAsReviewed(): void {
  localStorage.setItem(HAS_REVIEWED_KEY, 'true');
}

/**
 * Check if guest can download (hasn't exceeded limit)
 */
export function canGuestDownload(): boolean {
  const downloadCount = getDownloadCount();
  const reviewed = hasReviewed();

  // Base limit: 2 downloads
  // If reviewed: +2 more downloads (total 4)
  const limit = reviewed ? 4 : 2;

  return downloadCount < limit;
}

/**
 * Get remaining downloads for guest
 */
export function getRemainingDownloads(): number {
  const downloadCount = getDownloadCount();
  const reviewed = hasReviewed();
  const limit = reviewed ? 4 : 2;

  return Math.max(0, limit - downloadCount);
}

/**
 * Track guest activity in backend
 */
export async function trackGuestActivity(
  actionType: 'compress' | 'convert' | 'convert-compress' | 'portal-compress' | 'download' | 'review',
  fileType?: string,
  originalSize?: number,
  processedSize?: number
): Promise<void> {
  try {
    const guestId = getGuestId();

    await fetch(`${API_BASE_URL}/guest-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestId,
        actionType,
        fileType,
        originalSize,
        processedSize,
      }),
    });
  } catch (error) {
    console.error('Failed to track guest activity:', error);
    // Don't block user experience if tracking fails
  }
}

/**
 * Notify backend that guest has reviewed
 */
export async function notifyGuestReviewed(reviewId?: string): Promise<void> {
  try {
    const guestId = getGuestId();

    await fetch(`${API_BASE_URL}/guest-activity/${guestId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewId }),
    });

    // Mark locally
    markAsReviewed();
  } catch (error) {
    console.error('Failed to notify guest review:', error);
  }
}

/**
 * Notify backend that guest converted to registered user
 */
export async function notifyGuestConverted(userId: string): Promise<void> {
  try {
    const guestId = getGuestId();

    await fetch(`${API_BASE_URL}/guest-activity/${guestId}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error('Failed to notify guest conversion:', error);
  }
}

/**
 * Reset guest tracking (for testing or after sign-up)
 */
export function resetGuestTracking(): void {
  localStorage.removeItem(GUEST_ID_KEY);
  localStorage.removeItem(DOWNLOAD_COUNT_KEY);
  localStorage.removeItem(HAS_REVIEWED_KEY);
}
