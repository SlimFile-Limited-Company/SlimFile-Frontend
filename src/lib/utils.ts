import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Lightweight analytics event tracker. Pushes to dataLayer if available.
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: eventName, ...params });
    } else if (typeof window !== 'undefined') {
      // Fallback: emit a custom event for other listeners
      window.dispatchEvent(new CustomEvent(eventName, { detail: params }));
    }
  } catch {
    // no-op
  }
}
